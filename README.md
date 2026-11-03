# 上下文链路追踪

宿主插件。把一次 agent 会话收成可展开的树：回合、模型步骤、工具、子会话，以及标题、压缩、检索。点开节点可看该次调用的输入和元数据。

插件只记录调用。模型步骤的正文留在宿主会话日志里，点开时按序号重放。

## 怎么打开

三处入口名称都是「上下文链路追踪」，都看当前会话。左边是树，右边是详情。浏览器和 Desktop 共用这一套界面。

- **会话页签**：当前会话打开时出现。
- **右侧栏**：引导页里打开，面板停在当前会话旁边。
- **左侧栏**：面板列表里的一项。点开后，中间栏显示同一份面板。

尚未结束的回合默认展开，其余回合收起。

## 树

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

同一 step 里并行的工具是兄弟节点。对不上工具结果的子会话挂在该回合末尾，标成未关联。只有 `origin` 为 `subagent` 的子会话会嵌进这棵树。

点开节点：

- **模型步骤**：provider、model、用量、结束原因、输入消息、工具 schema、助手输出。同一步里的失败重试各自算一次尝试。
- **工具**：参数、结果，以及它发起的子会话。
- **标题**：系统提示、消息、路由，以及采纳的标题。
- **压缩**：被压缩的消息、用量和摘要。
- **检索**：挂在触发它的 `web_search` 下面。点开可看这次工具调用的参数，以及去掉密钥后的请求体。

## 要求

- Node.js `^22.19.0 || >=24`
- pnpm `>=11`（本仓库钉在 `pnpm@11.28.5`）
- 宿主 `>=0.2.0-0 <0.3.0`
- Host 同时提供 `sessionProjections` 和 `sessions` 时，插件才会激活

再次打开已结束的会话，还需要宿主的会话读取能力。

## 安装与开发

装进 profile：

```bash
dsh plugin --profile <profile> add dsh-context-track
```

本仓库：

```bash
pnpm install
pnpm test        # Vitest，用例在 tests/
pnpm run build   # Host → lib/，客户端 → lib/client/index.js
```

客户端产物是 `window.__ModuleLoader__.load` 工厂。编译、发布和源码联调见 [docs/publish-install.md](docs/publish-install.md)。协议 Apache-2.0。
