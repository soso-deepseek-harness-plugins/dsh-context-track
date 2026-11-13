# 技术设计

本插件把一次 agent 会话里的模型调用、工具调用、subagent，以及标题生成、压缩摘要这类旁路模型调用，收成一棵可展开的树。点开节点可以看到该次调用的完整输入和元数据。

插件只做记录。agent 步骤的正文留在宿主的会话日志里，点开时按序号重放。旁路调用里会话日志没有的短字段，追加进插件自己的增量文件。这条追加不进入模型调用的执行路径。本文只描述架构和代码结构，不包含实现任务。

## 1. 背景

会话日志是模型可见内容的唯一记录，并由宿主持久化保存。一次用户消息在日志里的形状是：

```
session
  turn/start
    step/start                         一步 = 一次模型调用 + 它发出的工具
      system/message
      user/message
      developer/message
      request/header                   provider、model、sampling、tools
      request/context                  contextWindow、systemPromptUpdate（仅变化时）
      assistant/message                输出、usage、带时间戳的压缩流
      assistant/attempt                失败或重试、没有进入历史的那一次
      llm/retry                        失败原因、重试序号、等待时间
      tool/call
      tool/result
    step/end
  turn/end
```

Loop 在发出请求之前，先把这次请求依赖的表面变更和 `request/header` 写进日志，然后再流式调用。因此某次调用的输入，等于这条助手事件之前的日志前缀，而不是会话结束时的当前表面。压缩和 system 节点替换会改写更早的表面，所以必须截到该次调用自己的前缀，不能调用 `Session.deriveMessages()` 去看历史步骤。

宿主已经导出这条重放路径，插件直接用，不自己复刻规则：

| 导出 | 作用 |
|---|---|
| `foldSurface(events, projections)` | 把一段日志前缀折成模型可见的表面，包含替换和消息投影 |
| `deriveEventMessage(event, projectedMessages)` | 把表面上的一条事件变成一条消息 |
| `foldRequestHeader(events)` | 取这段前缀里最后一张规范 `request/header` |
| `ToolHistoryProjection` | 沿同一前缀收出 `toolHistory` |
| `sessions.messageProjections` | 当前组合里已注册的消息投影，重放时必须带上 |
| `assistantStreamFirstTokenTime` | 从压缩流上取首 token 时间 |

Subagent 不展开在父日志里。父会话写一条 `subagent/catalog`（`childId`、`label`、`mode`）。委托工具的结果体是 `{ kind: "activation", subagentId }`。子会话 header 带 `parentSession`、`origin: subagent`、`delegationDepth`。子会话在启动后就返回给父工具，两边并行。header 里的 `parentSession` 只有在 `origin` 为 `subagent` 时才表示调用关系；否则是 fork，不进这棵树。子会话有自己的一份日志，宿主同样负责保存。

插件不往会话日志里追加事件。跟踪索引是日志的派生缓存，进程内由投影保存，进程重启后从日志重新折叠。旁路调用若有会话日志没记下的短字段，才追加到插件自己的增量文件；会话历史本身不进这个文件。

## 2. 目标与非目标

目标：

- 用树表示当前会话的 agent loop：Turn、Step（一次模型调用）、Tool，以及旁路模型调用。Subagent 挂在发起它的工具下面，子树是那个子会话自己的 turn、step 和旁路调用。
- 点开模型节点，能看到该次调用的完整输入（消息内容、工具 schema、toolHistory）和元数据（路由、sampling、用量、流上的耗时、结束原因）。旁路节点展示该次调用自己的输入和输出。
- 树节点可以展开和收起。
- 会话进行中、会话结束后再次打开、进程重启后再次打开，树和 agent 步骤的正文都从宿主的会话日志恢复。增量文件只补旁路调用里日志没有的短字段。
- 同一套纯函数同时服务界面和测试。已经落盘的旧会话，只要日志还在，就能还原树和 agent 步骤的完整输入。
- 记录失败不影响 agent loop。不改写请求，不包裹模型流，不在执行路径上复制会话历史或写盘。

非目标：

- 不把 agent 步骤的消息、工具和历史再写进插件文件。
- 不记录 provider 的 HTTP 原文。完整输入是日志前缀重放出来的规范请求；旁路调用同理，能从会话事件读到的就不再记一遍。
- 不把压缩后的原始 token 流再存一份。agent 步骤的耗时和首 token 时间从 `assistant/message`、`assistant/attempt` 上已有的流时间戳读取。
- 不做跨会话搜索、评分、数据集和 prompt 实验。
- 不把树嵌进 Composer 或对话气泡。
- 不把进行中的 token 流灌进详情面板。未结束的 step 只显示进行中；点开时重放当前已经提交的前缀。

## 3. 总体架构

插件是一个可安装的 bundle，分成 Host 和 Web Client 两个入口。Host 折叠索引、按序号重放正文，并在旁路调用上追加短记录。Client 负责树和详情。两边只共享类型，Client 不引用 Host 的运行时。

```
┌──────────────────────────────────────────────────────────────┐
│                         Web Client                           │
│   上下文链路追踪（会话页签 / 右侧栏）                          │
│   ┌─────────────────────┐    ┌────────────────────────────┐  │
│   │ 树（投影索引）       │    │ 详情                        │  │
│   │ Turn / Step / Tool  │    │ agent 步骤：按 inputSeq 重放 │  │
│   │ Sidecar             │    │ 旁路：读会话事件 + 短记录    │  │
│   └──────────▲──────────┘    └──────────────▲─────────────┘  │
└──────────────┼──────────────────────────────┼────────────────┘
               │ wire.view                    │ Remote getNode
               │ 序号 + 标量                  │
┌──────────────┴──────────────────────────────┴────────────────┐
│                            Host                              │
│                                                              │
│   session 事件 ──► fold ──► track 投影（只写序号和标量）      │
│                                                              │
│   旁路 llm/stream ──► 入队一条短记录 ──► 异步追加 JSONL       │
│   原样返回 next()，不读历史、不包裹流、不等待磁盘             │
│                                                              │
│   getNode ──► materialize（agent 步骤）                      │
│            或 读取旁路事件 + 已配对的短记录                   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    会话日志（宿主已持久化）
                    树和绝大部分正文的存放处
```

| 界面要看的 | 怎么得到 | 会话结束后再次打开 |
|---|---|---|
| 树，含旁路节点 | `fold` 增量推进 `track` 投影，经 `wire.view` 推到 Client | 宿主载入日志，投影再折一遍 |
| agent 步骤的完整输入 | `materialize(events, inputSeq)` | 同一函数，读载入后的事件 |
| 标题生成的输入和采纳结果 | `session/title-llm-request`，以及其后的 `session/title` | 同一份会话事件 |
| 压缩摘要的输出、用量、被压缩的消息 | `compaction/summary` 和它记下的 `shadowedSeqs` | 同一份会话事件 |
| 压缩请求末尾那条指令 | 增量文件里的一条短记录 | 读同一条 JSONL；没有则详情里标成日志未记录 |

投影状态是纯 JSON，并带 `stateVersion`。组合里如果挂了投影缓存，冷启动只重放缓存之后的尾部；缓存缺失或版本不符时，从整份日志重折。投影里不放消息正文，也不放增量文件的内容。

## 4. 跟踪树

### 4.1 节点

```ts
type NodeStatus = "running" | "ok" | "error" | "aborted"

type TrackNode =
  | { kind: "turn"; turn: number; reason?: string; status: NodeStatus
      startSeq: number; endSeq?: number }
  | { kind: "step"; turn: number; step: number; status: NodeStatus
      provider?: string; model?: string; usage?: TokenUsage
      attempts: AttemptRef[] }
  | { kind: "tool"; callId: string; name: string; status: NodeStatus
      callSeq: number; resultSeq?: number
      childSessionId?: string; childLabel?: string; childMode?: string }
  | { kind: "sidecar"; purpose: "session-title" | "compaction" | "web-search"
      status: NodeStatus
      requestSeq: number; outputSeq?: number; endSeq?: number }

interface AttemptRef {
  attempt: number
  inputSeq: number          // 折叠时取 seq < inputSeq 的事件
  outputSeq?: number        // assistant/message 或 assistant/attempt
  retrySeq?: number         // llm/retry，失败尝试才有
  status: NodeStatus
}
```

`inputSeq` 是这次尝试对应的助手事件的 seq。重放范围是它之前的全部事件。进行中的 step 还没有助手事件，`inputSeq` 取当前日志长度，重放范围是已经提交的全部事件。Loop 先写请求所依赖的事件再开始流式返回，所以这段前缀就是正在发送的输入。

同一步里的多次请求是这个 step 下的 attempt，不是新的 step。`assistant/message` 是进入历史的那一次，`assistant/attempt` 是没有进入历史的失败或取消。`llm/retry` 给失败尝试带上原因、重试序号和等待毫秒。重试如果在下一次请求前写了压缩或 system 替换，那些事件落在下一次尝试的 `inputSeq` 之前，重放会把它们算进去。

同一 step 里并行的工具是兄弟节点，按 `tool/call` 的 seq 排序。工具参数和结果不放进索引，详情用 `callSeq` 和 `resultSeq` 回日志读取。

旁路节点按把它写进日志的那条事件的 seq，插在同一层的 step 和 turn 之间。`compaction/start` 的 `turn` 为 `null` 时，节点挂在会话根上，位于前后两个 turn 之间。投影只存上面的序号，不复制事件里的 messages、summary 或搜索请求体。

### 4.2 一棵会话长什么样

```
Session  main
└─ Turn 1                                          reason: stop
   ├─ Step 1   model · 1.2s · 3.1k in
   │  ├─ attempt 1   error                         inputSeq → assistant/attempt
   │  ├─ attempt 2   ok                            inputSeq → assistant/message
   │  ├─ Tool read_file
   │  └─ Tool subagent  "查日志"
   │     └─ Session child                          origin: subagent, depth 1
   │        └─ Turn 1
   │           └─ Step 1
   ├─ Sidecar 标题生成                               session/title-llm-request
   ├─ Sidecar 压缩摘要                               compaction/start … summary … end
   └─ Step 2   model                               父级看到工具结果后的下一次调用
```

检索如果写了 `web/deepseek-search-llm-request`，同样是一个 sidecar，挂在该事件的 seq 上。它不经过 `ctx.llm`，会话事件里已经有去掉密钥的请求体。

### 4.3 Subagent 怎么挂上去

按这个顺序找父节点：

1. `tool/result` 的模型可见内容能解析出 `subagentId` 时，子会话挂在这个工具节点下。
2. 对不上任何工具结果的 `subagent/catalog` 条目，挂到记下它的那个 turn 末尾，标成未关联。
3. `mode: external` 没有本地日志，节点停在标签上，不能再展开。
4. 只有 `origin === "subagent"` 的 `parentSession` 才参与树。Fork 不嵌进来。

子会话是另一份日志上的同一套投影，里面的标题生成和压缩摘要也用同一套 sidecar。展开工具节点时用 `childSessionId` 读取那份会话，父投影不内联子日志。父工具可能在子会话还在跑时就已经返回，这时工具节点保持 `running`，直到子会话当前 turn 关闭。

## 5. 从日志前缀重放一次调用

`materialize(events, inputSeq, projections)` 是唯一知道「模型当时看见了什么」的函数。界面详情和测试都调用它。

```
prefix = events.filter(e => e.seq < inputSeq)
surface = foldSurface(prefix, projections)
messages = surface.nodes
  .map(seq => deriveEventMessage(prefix[seq], surface.projectedMessages))
  .filter(存在)
header = foldRequestHeader(prefix)          // config + tools
context = prefix 中最后一条 request/context
history = 对 prefix 跑 ToolHistoryProjection.snapshot()
```

`projections` 用 `sessions.messageProjections`。漏掉它们，图片卸载这类投影对不上模型真正看到的内容。

一次详情包含：

- 输入：`messages`、`header.tools`、`toolHistory`
- 元数据：`header.config`（provider、model、reasoningEffort、temperature、maxTokens、stop）、`header.adapterDefaults`、`request/context` 的 contextWindow 和 systemPromptUpdate
- 输出：`outputSeq` 指向的 `assistant/message` 或 `assistant/attempt`
- 用量：成功尝试取 `assistant/message` 上的 usage
- 耗时：压缩流的最后时间减去 `time0`。首 token 时间用 `assistantStreamFirstTokenTime`。这是流上的时间，不含请求在队列里等待的墙钟
- 失败：`llm/retry` 上的 `failure`、`retry`、`delayMs`

重放结果按 `inputSeq` 留在内存。同一次尝试再点开不再折叠。缓存只保留已经点开过的尝试，不预展开每一步。历史步骤的前缀不会再变，缓存留到这次 Host 进程里该会话的观察结束。重启后缓存没有了，再点开会重新重放，结果与上次相同，因为输入仍是那份日志。

索引折叠和正文重放分开。索引在 `sessionProjections` 里对每条新事件做一次增量折叠，状态里只有序号和标量。正文重放发生在点击时，成本是该次前缀的长度。agent 步骤不监听 `llm/stream`。

## 6. 旁路调用

旁路调用不产生 `step/start`，但会话日志里有它们自己的事件。树把这些事件收成 sidecar，详情从事件本身读取，不把正文抄进投影。

| 调用 | 树上的位置 | 输入 | 输出 |
|---|---|---|---|
| 标题生成 | `session/title-llm-request` 的 seq | 该事件里的 `system`、`messages`、`route`、`maxTokens`、`reasoningEffort` | 这条请求之后、下一条标题请求之前，来源为已注册 provider 的 `session/title`。没有则输出为空 |
| 压缩摘要 | `compaction/start` 到 `compaction/end` | `shadowedSeqs` 在摘要事件之前的表面上重放出来的消息，加上该前缀的 `foldRequestHeader` 与 `ToolHistoryProjection` | `compaction/summary` 的 `summary`、`rawOutput`、`usage`、provider、model、`maxTokens`。`compaction/end` 带 `error` 时节点为 error |
| 检索 | `web/deepseek-search-llm-request` 的 seq | 该事件里去掉密钥的请求体 | 事件没有单独的模型输出字段时，详情只展示这份请求 |

压缩请求在被压缩的消息后面还会加一条指令，再连同当时的 tools 发给模型。被压缩的消息和当时的 header、toolHistory 都能从摘要事件之前的日志重放出来。多出来的那条指令不在会话日志里，由下一节的增量文件补上。tools 与该前缀最后一张 `request/header` 相同，不再记一份 schema。

标题生成在发请求前已经把完整输入写进 `session/title-llm-request`，所以不为它复制消息。采纳后的标题在 `session/title`。这次调用的 usage 和原始流不在日志里；插件不包裹这次流去补它们。

## 7. 增量文件只补缺口

文件是追加的 JSONL：`$DSH_HOME/profiles/<profile>/dsh-context-track/<sessionId>.jsonl`。一行一条，只在会话日志缺字段时才写。当前只有压缩请求末尾的那条指令：

```json
{"purpose":"compaction","text":"<指令原文>"}
```

配对按同一会话里压缩调用的顺序：第 n 条 `purpose: compaction` 的短记录对上第 n 个压缩 sidecar。`compaction/summary` 或带 `error` 的 `compaction/end` 折进投影时，把已入队的记录编号记到节点上。重启后读文件再按顺序配对。对不上的记录忽略，节点上指令标成未记录。安装插件之前的旧压缩没有这行，消息、用量和摘要仍然从会话日志来。

不把 messages、tools、toolHistory、summary 写入这个文件。那些已经在会话日志里。

## 8. 不进入 agent 的执行路径

记录代码遵守下面的边界，避免拖慢或改变 agent：

- agent 步骤不监听 `llm/stream`。它们的索引只在会话事件已经提交之后，由投影同步折叠，并且只写序号和标量。
- 旁路的 `llm/stream` 监听只在 `purpose` 有值时入队。入队只取路由标量，以及压缩请求最后一条消息在它是单段文本且不超过 4KB 时的那段文本。不遍历前面的历史，不复制 tools。然后原样返回 `next()`，不包裹流，不等待磁盘。
- 入队是内存里的一次 push。异步批量追加 JSONL，不 fsync，不在 `turn/end` 重写整文件。队列有上限，满了丢弃新记录并计数。写失败只记日志。
- 投影折叠不读这个文件，也不把指令正文放进投影状态。
- 监听器和写盘抛错时吞掉，不传回 waterfall，不让会话追加失败。

因此模型何时发出、流如何返回、工具何时执行，都不依赖上下文链路追踪插件。插件卸掉或增量文件写失败时，agent 的过程与没装插件相同。

## 9. 再次打开

一次已经结束的会话要在界面里再看：

1. 树，包括标题、压缩和检索节点。打开会话时，宿主把持久化的事件载入 `Session`。`track` 投影对这批事件执行与当时相同的 `fold`。节点上的序号、用量和子会话 id 都是事件的函数。
2. agent 步骤的正文。`getNode` 用载入的事件和 `inputSeq` 调用 `materialize`。
3. 旁路正文。标题、压缩输出和检索请求读会话事件。压缩指令读增量 JSONL，按第 7 节的顺序配对。文件不在时，其余字段仍在。

进行中的树靠投影增量折叠和 `wire.view` 更新，不靠这个文件。

子会话同样如此。展开工具节点时按 `childSessionId` 观察那份会话，并读取那份会话自己的增量文件。

会话日志不在时，树和正文都没有来源。增量文件不能单独还原一次调用。

## 10. 界面

入口有两处，显示名称都是「上下文链路追踪」：会话页签 `context-track`（排在「上下文」之后），以及右侧栏引导页。点开右侧栏入口后，同一份面板停在当前会话旁边。两处都绑定当前会话。没有会话时页签不出现；组件没有 sessionId 时显示空状态。

面板骨架自上而下是四段：

- **header**：当前轮次状态、总消耗、耗时、详情带开关和更多菜单。详情带开关是一枚带头部图标、文案和旋转箭头的胶囊按钮，展开时高亮；窄档压成一行，`dense` 档只省掉图标。
- **轮次条**：横向胶囊，每枚显示轮次号、状态点和耗时，选中的胶囊额外显示总消耗；轮次之间的会话命名、压缩、检索作为窄标签夹在胶囊之间。选中胶囊会滚入视野，轮次多时右侧显示 `轮次 N / 总数`。切换胶囊（点击或方向键）回到该轮次上次打开的节点；该轮次第一次进入时落在它第一个 step 的第一个 LLM 调用上，没有 step 时退到第一个旁路节点，轮次还没有内容就停在轮次行。
- **上下文详情带**：默认只有一行堆叠构成条和图例，展开入口是 header 右侧的「上下文详情」按钮，不再在带内重复放收放箭头；展开后变成构成 / 耗时 / 旁路三块自适应网格，最大高度约占面板 40%，自己滚动，不推走树和详情。旁路块依次列出会话命名、上下文压缩和子会话：命名显示采纳的名字，还没有就写「还没得到会话名」，并标注「不计入轮次总消耗」，名字旁的窄标签打开这次命名调用；压缩显示腾出与摘要花费；子会话另计。三样都没有时才显示空态。工具定义、技能和注入明细只在对应类别展开时出现，保留搜索、按大小/名称排序和剩余个数。
- **树与详情**：默认 38% / 62%，中间一条分隔线；命中区 8px、视觉线 1px，树最小 240px、详情最小 320px，双击复位，聚焦后方向键按 24px 步进调整。宽档关闭详情后树占满，再点树行恢复。详情带展开状态和分隔比例记在 `localStorage`（前缀 `dsh-context-track:`），读取失败回默认值。

档位由 `ResizeObserver` 写进根元素的 `data-tier`：`wide`（≥ 960px）、`compact`（640–959px）、`narrow`（440–639px）、`dense`（< 440px）。首帧先按 `narrow` 渲染，测得宽度后再切换，避免闪一帧宽布局。`compact` 及以下只保留一个主滚动区：树占满宽度，详情以整页覆盖层滑入，带返回按钮并支持 `Esc` 关闭；关闭后焦点回到触发的树行或轮次胶囊，树的滚动位置保持不变。树内耗时和 token 两列由容器查询按树自身宽度收缩，不经过 React。

这份界面只有一个 `dsh.client`（`platform: web`）。Desktop 是加载同一套 Web 应用的 Electron 壳，所以浏览器和 Desktop 看到的是同一次注册，读同一个 Host。不为 Desktop 另写界面或另开窗口。页签和右侧栏由宿主排版，面板自身不再加主列的窗口按钮避让。

调用树默认全部展开，展开和收起留在组件状态里，不写进投影。每个轮次在内存里记住自己上次打开的节点：切换胶囊时按 `TurnMark`（会话、节点、行 key、窗口 attempt）还原，节点已不在索引里就回落到默认。第一次进入某个轮次（以及首次打开会话）落在它第一个 step 的第一个 LLM 调用上，重试过的步骤也停在 call 1，而不是最后一次尝试；没有 step 的轮次落到第一个旁路节点，还没有内容的轮次停在轮次行。默认选择不算用户选择，也不写进记忆，所以之后切换仍按首次规则；它同样不钉住轮次、不滑出窄档覆盖层。详情按阅读模式渲染，窄档仍由用户点行打开。折叠的轮次和步骤显示条目摘要，展开后隐藏。


点开模型节点后，详情分成四块：

- 元数据：provider、model、reasoning、temperature、maxTokens、stop、contextWindow、流耗时、首 token 时间、用量、结束原因、重试原因
- 输入消息：按角色列出内容块
- 工具 schema 和 toolHistory：原始 JSON
- 输出：助手消息；失败尝试显示 `llm/retry` 的失败信息

消息正文按 Markdown 子集渲染。单个换行不折成空格：源文本里的每一行各成一段，行与行之间留半个字符的间距；空行分隔的块再拉开一档，所以「一行」和「一段」看得出差别。正文宽度跟随卡片，只用卡片的左右内边距留白，宽档不额外收窄；行高 1.62，长链接和代码不撑破卡片。

点开工具节点时，用 `callSeq` 和 `resultSeq` 显示参数 JSON 和结果，以及子会话入口。子会话在同一棵树里展开，不强制跳进子会话页面。

点开旁路节点时：

- 标题生成：系统提示、发给模型的消息、路由和 token 上限，以及采纳的标题。
- 压缩摘要：被压缩的消息、末尾指令、provider、model、用量、摘要和原始输出。失败时显示 `compaction/end` 的 `error`。
- 检索：会话事件里的请求体。

树的数据来自投影的 `wire.view`，里面只有索引。详情在点击时通过 Remote 拉取。agent 步骤调用 `materialize`。进行中的 step 显示 running；点开时重放当前已提交的前缀，不订阅 token 流。

样式只使用宿主的 `--dsw-alias-*` 主题变量。文案提供中文和英文。不使用 iframe。

Remote 方法：

```ts
getNode(sessionId, nodeId): NodeDetail
```

活会话和再次打开的会话走同一条路：agent 步骤按 `inputSeq` 重放，旁路节点读对应事件和已配对的短记录。读不到会话时返回明确的缺失，不抛未分类异常。

## 11. 代码结构

包名见 `package.json`。其中声明 `dsh.bundle.patch` 和 `dsh.client`。patch 只插入 Host 这一行。Client 由 `dsh.client` 装进 Web。

```
./
├── package.json
├── cordis.patch.yml
├── locale/
│   ├── en.json
│   └── zh.json
├── icon.svg
└── src/
    ├── shared/
    │   └── model.ts          节点类型、AttemptRef、投影 stateVersion
    ├── host/
    │   ├── index.ts          插件入口、依赖声明、投影与 Remote 注册
    │   ├── fold.ts           纯函数：一条会话事件推进跟踪索引
    │   ├── materialize.ts    纯函数：日志前缀 → 一次 agent 步骤的完整输入
    │   ├── sidecar.ts        纯函数：旁路事件 → 详情；压缩指令从短记录补上
    │   ├── supplement.ts     旁路短记录的内存队列和异步 JSONL 追加
    │   └── remote.ts         getNode，按节点种类调用 materialize 或 sidecar
    └── client/
        ├── index.ts          会话页签和右侧栏入口
        ├── layout.ts         档位、分隔线比例和最小宽度
        ├── locales.ts        中英文文案
        ├── TracePage.tsx     外壳、轮次条、摘要带、树/详情与覆盖层
        ├── Tree.tsx          层级、展开、收起、选中和方向键
        ├── TokenCard.tsx     上下文详情带
        ├── TimingCard.tsx    耗时块
        ├── Inspector.tsx     详情容器
        ├── Detail.tsx        元数据、消息、工具、输出
        ├── JsonView.tsx      JSON 高亮与折叠
        ├── MarkdownView.tsx  消息正文渲染
        ├── Icon.tsx          单色节点图标
        ├── widgets.tsx       共用小组件
        ├── format.ts         数字、耗时和百分比格式
        └── styles.ts         面板样式和容器查询
```

依赖方向：

```
shared/model.ts
    ▲              ▲
    │              │
host/fold     host/materialize     host/sidecar
    │              │                    │
    └──────► host/index ◄──── host/supplement
                 │
                 ▼
            host/remote ──► materialize / sidecar
                 ▲
                 │  只有类型和 Remote 面
            client/*
```

`shared` 不引用 cordis。`fold` 只依赖会话事件类型和 `shared`。`materialize` 和 `sidecar` 只做纯读取，不注册监听。`supplement` 是唯一写文件的模块，并且只在队列排出时写。Client 不引用 Host 运行时。

Host 的必需依赖是 `sessionProjections` 和 `sessions`。缺一则插件不激活。再次打开已经结束的会话时，通过宿主的会话读取载入事件；这项能力不在时，只有仍然活着的会话能看树和详情。`subagents` 不是必需依赖：目录事件写在父日志里，没有 subagent 包时，工具节点就是普通工具。

Client 的依赖是 `slots`、`locale`、`layout`、`remote`，以及生成出来的 `remote.track`。

与正在运行的宿主共用同一份依赖：cordis、会话、会话投影、模型、远程协议。`engines.dsh` 钉住开发时所用的 0.2 系列。

### 模块职责

`fold.ts` 是同步纯函数，签名是 `(state, event) => state`。不认识的事件返回原来的 state 引用，让投影可以跳过无变化的发布。它只写序号和标量：打开和关闭 turn/step，从 `request/header` 抄下 provider 和 model，从助手事件抄下 usage 和 `inputSeq`，从 `llm/retry` 抄下重试序号，从工具事件抄下 callId、名称和 seq，从 `subagent/catalog` 和工具结果抄下子会话链接，从标题、压缩和检索事件挂上 sidecar。压缩事件到来时只记下已入队短记录的序号，不把指令正文写入 state。

`materialize.ts` 不保存状态。输入是事件数组、`inputSeq` 和消息投影列表，输出是一次 agent 步骤的详情。测试用一段截好的日志就能跑，不必启动 agent。

`sidecar.ts` 按 `requestSeq` 读取会话事件并组装旁路详情。压缩节点再按编号取一条短记录作为末尾指令。

`supplement.ts` 提供入队和异步追加。`llm/stream` 监听器只调用入队。排出失败不影响队列以外的任何调用方。

`remote.ts` 按节点种类调用 `materialize` 或 `sidecar`。同一 `inputSeq` 或同一旁路事件的结果留在内存里，这次观察结束时丢掉。

`index.ts` 注册投影、旁路 `llm/stream` 监听和 Remote。监听器遵守第 8 节。

Client 三个组件只消费索引和 `getNode` 的结果。展开状态留在 `Tree` 内部。

## 12. 一次调用怎么流过插件

```
用户消息进入
    │
    ▼
turn/start、step/start          fold 打开 Turn 和 Step，记下 startSeq，状态 running
    │
    ▼
request/header 等事件           fold 更新 provider、model
    │                           热路径上没有跟踪代码
    ▼
assistant/attempt 或            fold 追加 attempt，inputSeq = 该事件 seq
assistant/message               抄下 usage；压缩流留在原事件里
    │
    ├─ llm/retry                fold 给这个 attempt 记下 retrySeq 和失败标量
    │
    ▼
tool/call、tool/result          fold 添加工具节点，只记 seq
    │                           结果里若有 subagentId，挂上子会话 id
    ▼
子会话自己的事件                另一份日志上的同一套 fold
    │
    ▼
标题 / 压缩 / 检索事件           fold 挂上 sidecar，只记 seq
    │
    ▼
压缩的 llm/stream               入队末尾指令，立刻返回原来的流
    │                           磁盘追加在队列排出时发生
    ▼
step/end、turn/end              fold 关闭节点，记下 endSeq
    │
    ▼
wire.view                       面板上的树更新
```

用户点开 agent 步骤时，`getNode` 才对 `seq < inputSeq` 调用 `materialize`。点开旁路节点时读取对应事件；压缩再取已配对的短记录。会话结束后再次打开时，从第 9 节的载入路径重新得到同一棵树。

## 13. 失败与边界

- Remote 读不到会话或节点时返回缺失，不把异常抛回 agent loop。
- 索引折叠失败时投影保持上一次成功的状态，不阻断会话写入。
- 增量文件写失败或队列丢弃时，压缩节点的末尾指令标成未记录。消息、摘要和用量仍从会话日志读取。agent 继续执行。
- 会话日志还在时，安装插件之前的旧会话也能折出树、agent 步骤的完整输入，以及标题和压缩在日志里已有的字段。
- 卸掉插件后，已写出的 JSONL 留在 profile 目录。会话日志没有被插件改过，卸掉不影响会话重开。
- 工具结果的 JSON 是工具自己的约定。解析不出 `subagentId` 时，退回目录里的未关联挂载，子会话不丢。
- 点开一次很长的前缀会按该前缀的长度折叠一次。缓存挡住同一次尝试在本次进程内的重复点击。索引本身的增量折叠与前缀长度无关。

## 14. 尚未拍板的选择

当前设计先按下面两条实现。如果要改，改挂载规则或详情里的展示即可，不必改「agent 步骤只重放日志、旁路事件进树、缺口才异步追加短记录」。

- 对不上工具结果的子会话挂在该 turn 末尾。
- 详情里的工具参数、工具 schema 和 toolHistory 显示原始 JSON。
