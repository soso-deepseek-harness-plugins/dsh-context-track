/** Trace index: sequence numbers and scalars only. No message bodies. */

export const TRACK_STATE_VERSION = 2 as const

export type NodeStatus = 'running' | 'ok' | 'error' | 'aborted'

export type SidecarPurpose = 'session-title' | 'compaction' | 'web-search'

/** Token counts copied off an assistant event. Bodies stay in the session log. */
export interface TokenUsageScalars {
  inputTokens: number
  outputTokens: number
  totalTokens?: number
  cacheReadTokens?: number
  cacheWriteTokens?: number
  reasoningTokens?: number
}

export interface AttemptRef {
  id: string
  attempt: number
  /** Replay `seq < inputSeq`. For a running step with no assistant event this is the log length. */
  inputSeq: number
  outputSeq?: number
  retrySeq?: number
  status: NodeStatus
  /** Model usage for this attempt. A later attempt does not replace it. */
  usage?: TokenUsageScalars
  /** Assistant event time. The stream body is not stored. */
  endTime?: number
  /** Earliest compact-stream `time0` or raw chunk time. */
  streamStart?: number
  /** `streamStart − step start`. Absent when the stream has not started. */
  waitMs?: number
  /** Reasoning duration. Zero means the settled attempt had no reasoning fragment. */
  thinkMs?: number
  /** Earliest user-visible output in this attempt. */
  firstVisible?: number
  /** Retry backoff. It is not part of model wait. */
  delayMs?: number
}

export interface ToolNode {
  kind: 'tool'
  id: string
  callId: string
  name: string
  status: NodeStatus
  callSeq: number
  resultSeq?: number
  startTime?: number
  endTime?: number
  childSessionId?: string
  childLabel?: string
  childMode?: string
}

export interface StepNode {
  kind: 'step'
  id: string
  turn: number
  step: number
  status: NodeStatus
  startSeq: number
  endSeq?: number
  startTime?: number
  endTime?: number
  provider?: string
  model?: string
  /** Latest reported usage. Each attempt keeps its own copy. */
  usage?: TokenUsageScalars
  /** Log length while the step has no assistant event yet. */
  inputSeq: number
  attempts: AttemptRef[]
  tools: ToolNode[]
}

export interface SidecarNode {
  kind: 'sidecar'
  id: string
  purpose: SidecarPurpose
  status: NodeStatus
  requestSeq: number
  outputSeq?: number
  endSeq?: number
  compactionId?: string
}

/** A catalog entry that no tool result named. It stays at the end of its turn. */
export interface UnlinkedNode {
  kind: 'unlinked'
  id: string
  childSessionId: string
  childLabel?: string
  childMode?: string
  catalogSeq: number
}

export type TurnItem = StepNode | SidecarNode | UnlinkedNode

/** A `source.kind === 'user'` message. The text stays in the log. */
export interface UserInputMark {
  seq: number
  time: number
}

export interface TurnNode {
  kind: 'turn'
  id: string
  turn: number
  status: NodeStatus
  reason?: string
  startSeq: number
  endSeq?: number
  startTime?: number
  endTime?: number
  /** User messages in log order. The opening input still starts at `startTime`. */
  userInputs?: UserInputMark[]
  items: TurnItem[]
}

export type RootNode = TurnNode | SidecarNode | UnlinkedNode

export interface TrackState {
  stateVersion: typeof TRACK_STATE_VERSION
  root: RootNode[]
}

export function emptyTrack(): TrackState {
  return { stateVersion: TRACK_STATE_VERSION, root: [] }
}

export function attemptId(turn: number, step: number, attempt: number): string {
  return `attempt:${turn}:${step}:${attempt}`
}

export function stepId(turn: number, step: number): string {
  return `step:${turn}:${step}`
}

export function turnId(turn: number): string {
  return `turn:${turn}`
}

export function toolId(callSeq: number): string {
  return `tool:${callSeq}`
}

export function sidecarId(requestSeq: number): string {
  return `sidecar:${requestSeq}`
}

export function unlinkedId(childSessionId: string): string {
  return `unlinked:${childSessionId}`
}

export type FoundNode =
  | { kind: 'turn'; node: TurnNode }
  | { kind: 'step'; node: StepNode }
  | { kind: 'attempt'; node: AttemptRef; step: StepNode }
  | { kind: 'tool'; node: ToolNode }
  | { kind: 'sidecar'; node: SidecarNode }
  | { kind: 'unlinked'; node: UnlinkedNode }

/** Locate one index node by the id the client sends to `getNode`. */
export function findNode(state: TrackState, id: string): FoundNode | undefined {
  for (const root of state.root) {
    const found = findInRoot(root, id)
    if (found) return found
  }
  return undefined
}

function findInRoot(node: RootNode, id: string): FoundNode | undefined {
  if (node.kind === 'sidecar') return node.id === id ? { kind: 'sidecar', node } : undefined
  if (node.kind === 'unlinked') return node.id === id ? { kind: 'unlinked', node } : undefined
  if (node.id === id) return { kind: 'turn', node }
  for (const item of node.items) {
    if (item.kind === 'sidecar' && item.id === id) return { kind: 'sidecar', node: item }
    if (item.kind === 'unlinked' && item.id === id) return { kind: 'unlinked', node: item }
    if (item.kind !== 'step') continue
    if (item.id === id) return { kind: 'step', node: item }
    for (const attempt of item.attempts) {
      if (attempt.id === id) return { kind: 'attempt', node: attempt, step: item }
    }
    for (const tool of item.tools) {
      if (tool.id === id) return { kind: 'tool', node: tool }
    }
  }
  return undefined
}

/**
 * A fork header points at a parent but is not a call. Only `origin: "subagent"`
 * is a call relationship, and even then the parent log — not this header —
 * decides where the child hangs.
 */
export function isSubagentOrigin(header: { parentSession?: string; origin?: string }): boolean {
  return header.origin === 'subagent' && typeof header.parentSession === 'string' && header.parentSession.length > 0
}

/** Unfinished turns start open. Everything else starts closed. The choice stays in the component. */
export function defaultExpanded(kind: string, status: NodeStatus): boolean {
  return kind === 'turn' && status === 'running'
}

/** An external child has no local log, so the tree does not offer a chevron. */
export function childExpandable(mode: string | undefined): boolean {
  return mode !== 'external'
}

/** Toggle one id. `open` is component state; this never writes a projection. */
export function toggleExpanded(
  open: Readonly<Record<string, boolean>>,
  id: string,
  fallback: boolean,
): Record<string, boolean> {
  const current = open[id] ?? fallback
  return { ...open, [id]: !current }
}
