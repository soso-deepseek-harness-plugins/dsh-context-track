# dsh-track

DeepSeek Harness 的会话跟踪插件。它把一次 agent 会话收成一棵可展开的树：回合、模型步骤、工具、子会话，以及标题生成、压缩摘要、检索。点开节点可以看到该次调用的输入和元数据。

插件只做记录。模型步骤的正文留在宿主的会话日志里，点开时按序号重放。记录失败不影响 agent loop。

## 界面

侧栏入口是「跟踪」。它打开同名主面板，并跟随布局里的当前会话。左边是树，右边是详情。没有打开的会话时显示空状态。

浏览器和 Desktop 共用这一套 Web 界面，读同一个 Host。窗口变窄时树和详情仍可滚动。

尚未结束的回合默认展开，其余回合收起。展开和收起只留在界面上。

点开节点后：

- **模型步骤**：provider、model、sampling、上下文窗口、流上的耗时、用量、结束原因；输入消息；工具 schema 和 toolHistory；助手输出。同一步里的失败重试各自算一次尝试。进行中的步骤显示进行中，详情重放已经提交的日志前缀。
- **工具**：参数、结果，以及它发起的子会话。子会话在同一棵树里展开。
- **标题**：系统提示、发给模型的消息、路由、token 上限，以及采纳的标题。
- **压缩**：被压缩的消息、末尾指令、provider、model、用量、摘要和原始输出。
- **检索**：会话事件里去掉密钥的请求体。

## 一棵树长什么样

```
Session
└─ Turn 1
   ├─ Step 1   provider · model
   │  ├─ attempt 1
   │  ├─ attempt 2
   │  ├─ Tool read_file
   │  └─ Tool subagent
   │     └─ Session child
   │        └─ Turn 1
   ├─ 标题
   ├─ 压缩
   └─ Step 2
```

同一 step 里并行的工具是兄弟节点。对不上任何工具结果的子会话挂在该回合末尾，标成未关联。`mode: external` 的子会话没有本地日志，节点停在标签上。只有 `origin` 为 `subagent` 的子会话才嵌进这棵树。

## 数据从哪来

树和模型步骤的正文都来自宿主已经持久化的会话日志。`track` 投影在进程内增量折叠索引，状态里只有序号和标量。进程重启后，宿主载入日志，投影再折一遍。已经落盘的旧会话，只要日志还在，就能还原树和模型步骤的完整输入。

点开模型步骤时，Host 取该次尝试之前的日志前缀，折成当时模型看见的消息、请求头和 toolHistory。详情按这次尝试缓存在内存里，这次观察结束时丢掉。

旁路调用的输入输出优先读会话事件。压缩请求在被压缩的消息后面还会加一条指令，这条指令不在会话日志里。插件把它追加到 profile 下的增量文件：

```
<profile>/dsh-track/<sessionId>.jsonl
```

profile 目录来自宿主的 `profileContext`。没有这项上下文时，使用 `$DSH_HOME/profiles/$DSH_PROFILE/dsh-track/`，`DSH_PROFILE` 缺省为 `default`。`DSH_HOME` 也没有时不写文件。一行一条：

```json
{"purpose":"compaction","text":"<指令原文>"}
```

同一会话里第 n 条短记录对上第 n 次压缩。对不上、文件不在，或安装插件之前的旧压缩，详情里这条指令标成未记录。消息、用量和摘要仍从会话日志读取。

写盘是异步追加，不 fsync，也不在回合结束时重写整文件。队列有上限，满了丢弃新记录并计数。监听器和写盘出错会被吞掉，不传回模型调用。

## 要求

- Node.js `^22.19.0 || >=24.0.0`
- pnpm `>=11`。仓库把包管理器钉在 `pnpm@11.28.5`（与 deepseek-harness 一致）。
- DeepSeek Harness `>=0.2.0-0 <0.3.0`
- Host 依赖 `sessionProjections` 和 `sessions`。缺一则插件不激活。
- 再次打开已经结束的会话，还需要宿主的会话读取。没有这项能力时，只有仍然活着的会话能看树和详情。

## 接入

`cordis.patch.yml` 把 Host 插件 `dsh-track` 插进宿主。`package.json` 的 `dsh.client` 把 Web 客户端装进浏览器和 Desktop，并声明这些客户端包：

- `@deepseek-ai/dsh-client-locale`
- `@deepseek-ai/dsh-client-ui-layout`
- `@deepseek-ai/dsh-client-ui-sidebar`
- `@deepseek-ai/dsh-client-ui-renderer`
- `@deepseek-ai/dsh-client-ui-session`
- `@deepseek-ai/dsh-api-gateway`

侧栏入口和主面板的 id 都是 `trace`。Client 自己的 Cordis 依赖是 `slots`、`locale`、`layout`、`remote`。它在启动时挂上 `remote.track`，第三方插件没有别的装配会提供这个命名空间。插件的 `inject` 不能再写 `remote.track`，否则会一直等一个只有自己才会挂上的服务。读取它的是 `apply` 里 `inject(['remote.track'])` 出来的子上下文；Cordis 不允许从没有注入这项服务的上下文上读它，那样点节点会抛错，面板被错误边界清掉。

Host 注册三件事：`track` 投影、旁路 `llm/stream` 监听、Remote 方法 `track/getNode`。Client 只消费投影推过来的索引，点开节点时再调 `getNode`。包入口 `.` 是 Host，`./client` 是 Web 客户端。

## 开发

```bash
pnpm install
pnpm test
pnpm run build
pnpm run clean    # 删除 dist/
```

`pnpm test` 跑 Vitest，用例在 `tests/`。`pnpm run build` 用 `tsc` 把 Host 和类型编到 `dist/`，再用 tsdown 把 Web 客户端打成 `dist/client/index.js`。这个文件必须是 `window.__ModuleLoader__.load` 工厂；Harness 按经典脚本加载它，直接发布 `tsc` 的 ESM 会在启动时报 `import failed`。`pnpm run clean` 删除 `dist/`。`dist/` 不进 git。`prepublishOnly` 会在 `pnpm publish` 前再编一次。`pnpm-workspace.yaml` 允许 `esbuild` 的安装脚本，Vitest 依赖它。要在本机 `deepseek-harness` 源码的 Web / Desktop 里加载本插件，见 [docs/publish-install.md](docs/publish-install.md) 的「源码联调」。

运行时依赖是 `zod`。Harness、界面包和 React 写在 `peerDependencies` 里：Cordis `~4.0.5`，`@deepseek-ai/dsh-*` 为 `^0.2.1-rc.2`，React `^18.2.0`。装进 profile 时用宿主已经带的那一份。开发依赖里的 Cordis 是 `4.0.5`，`@deepseek-ai/dsh-*` 是 `0.2.1-rc.2`，本仓库的编译和测试用这份。协议是 MIT，见 `LICENSE`。

```
src/
├── shared/
│   ├── model.ts         节点、序号、默认展开
│   ├── detail.ts        getNode 的详情类型
│   └── projection.ts    把 track 合并进会话投影表
├── host/
│   ├── index.ts         插件入口：投影、监听、Remote
│   ├── fold.ts          一条会话事件推进跟踪索引
│   ├── materialize.ts   日志前缀重放成一次模型步骤
│   ├── tool-history.ts  从已安装的 dsh-session 读取 ToolHistoryProjection
│   ├── sidecar.ts       旁路事件组装详情
│   ├── supplement.ts    压缩指令的内存队列和 JSONL 追加
│   └── remote.ts        getNode
└── client/
    ├── index.ts         侧栏入口和主面板
    ├── TracePage.tsx    左右分栏
    ├── Tree.tsx         展开、收起、选中
    ├── Detail.tsx       元数据、消息、工具、输出
    ├── locales.ts       界面文案，中文为原文，英文对照
    ├── remote.ts        track/getNode 的客户端类型
    ├── styles.ts
    └── Icon.tsx
locale/                  插件清单里的标题和描述
tests/
```

`shared/model.ts` 和 `shared/detail.ts` 不引用 cordis。Client 不引用 Host 运行时。跟踪树、重放规则和失败边界见 [docs/design.md](docs/design.md)。

## 发布与安装

编译、发布、安装与源码 Web / Desktop 联调命令见 **[docs/publish-install.md](docs/publish-install.md)**。`package.json` 的 `files` / `exports` / `dsh.bundle` 仍以仓库为准。

最短路径：

```bash
# 本仓库
pnpm install && pnpm test && pnpm run build
pnpm version 0.1.0 --no-git-tag-version
pnpm publish --access public --no-git-checks

# 别人装进 profile
dsh plugin --profile <profile> add dsh-track

# 本机 harness 源码联调（无全局 dsh；先 build 本插件；只写 $DSH_HOME）
cd /path/to/deepseek-harness
pnpm dsh plugin --profile web add /path/to/dsh-track
pnpm dsh web
# Desktop：退出应用后
#   DSH_HOME=/tmp/dsh-desktop-dev pnpm dsh plugin --profile desktop add /path/to/dsh-track
#   DSH_HOME=/tmp/dsh-desktop-dev pnpm run start:desktop
```
