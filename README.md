# 上下文链路追踪

`dsh-context-track` 是 deepseek-harness 的宿主插件，把一次 agent 会话收成一棵可展开的树：轮次、模型步骤、工具调用、子会话，以及会话命名、上下文压缩和检索这类旁路模型调用。点开任意节点，可以看这次调用的完整输入、输出和元数据。

插件只做记录，不进入 agent 的执行路径：

- 索引由宿主会话日志派生，进程内保存在投影里，重启后从日志重新折叠。
- 模型步骤的正文留在宿主会话日志里，点开时按序号重放，不在插件侧复制一份。
- 只有日志里没有的旁路短字段（当前是压缩请求末尾的指令），才异步追加到插件自己的增量 JSONL。

界面入口名称都是「上下文链路追踪」，绑定当前会话：会话页签、右侧栏引导页、左侧栏面板列表。浏览器与 Desktop 共用同一套 Web 界面；面板分 header、轮次条、上下文详情带、树与详情四段，宽档并排、窄档整页覆盖，支持方向键与 `Esc`，文案提供中文和英文。调用树默认全部展开；轮次胶囊记住该轮次上次打开的节点，第一次进入则落在第一个 step 的第一个 LLM 调用上，详情按阅读模式展示。

## 环境要求

| 项 | 要求 |
| --- | --- |
| Node.js | `^22.19.0 \|\| >=24.0.0` |
| pnpm | `>=11`（本仓库钉在 `pnpm@11.28.5`） |
| 宿主 dsh | `>=0.2.0-0 <0.3.0` |

运行时依赖：`zod`、`markdown-to-jsx`、`react`，以及宿主的 cordis 与 `@deepseek-ai/dsh-*` 系列包（会话、会话投影、模型、Remote 协议、Web Client 各包），见 `package.json` 的 `dependencies` 与 `peerDependencies`。这些宿主包由宿主提供，插件不重复打包。

激活条件：宿主同时提供 `sessionProjections` 和 `sessions`，插件才会激活。再次打开已结束的会话还需要宿主的会话读取能力。

## 安装

插件发布物是已构建的 `lib/`，安装方不需要再 build。

```bash
dsh plugin --profile <profile> add dsh-context-track
# 指定版本：dsh-context-track@0.1.0 / dsh-context-track@beta

dsh web                     # 或 dsh --profile <profile>
```

打开会话后，页签和右侧栏会出现「上下文链路追踪」。注意 `pnpm add dsh-context-track` 只装进 `node_modules`，不会启用宿主插件层，必须用 `dsh plugin add`。

卸载：

```bash
dsh plugin --profile <profile> remove dsh-context-track
```

## 开发

```bash
pnpm install
pnpm test        # Vitest，用例在 tests/
pnpm run build   # tsc 类型与声明 → lib/；tsdown 打客户端 → lib/client/index.js
pnpm run clean   # 删掉 lib/
```

客户端产物是 `window.__ModuleLoader__.load` 工厂，不是 `tsc` 直接输出的 ESM。本机联调时把插件目录或 `pnpm pack` 出的 `.tgz` 装进 profile，改完插件重新 `build` 后重启 Web 或重开 Desktop。

## 目录

```text
src/
├── shared/   节点类型、投影 stateVersion、分类与统计纯函数
├── host/     插件入口、投影折叠、日志重放、旁路详情、增量 JSONL、Remote
└── client/   Web 面板：外壳、轮次条、摘要带、树、详情、JSON 与 Markdown 渲染
```

## 文档

- 技术设计：[docs/design.md](docs/design.md)
- 编译、发布、安装、卸载与源码联调：[docs/publish-install.md](docs/publish-install.md)

协议 Apache-2.0。
