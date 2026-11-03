/** Detail payloads. Message bodies are JSON values read from the session log at click time. */

export interface MissingDetail {
  missing: true
  /** Which read failed. Omitted by node reads that only say the node is gone. */
  target?: 'session' | 'turn'
}

export interface AttemptDetail {
  missing?: false
  kind: 'attempt'
  status: string
  inputSeq: number
  messages: unknown
  tools: unknown
  toolHistory: unknown
  config: unknown
  adapterDefaults?: unknown
  context?: unknown
  output?: unknown
  usage?: unknown
  firstTokenTime?: number
  streamDuration?: number
  interrupted?: true
  retry?: {
    failure: unknown
    retry: number
    delayMs: number
  }
}

export interface StepRunningDetail {
  missing?: false
  kind: 'step'
  status: 'running'
  inputSeq: number
  messages: unknown
  tools: unknown
  toolHistory: unknown
  config: unknown
  adapterDefaults?: unknown
  context?: unknown
}

export interface ToolDetail {
  missing?: false
  kind: 'tool'
  name: string
  callId: string
  status: string
  arguments: string
  result?: unknown
  childSessionId?: string
  childLabel?: string
  childMode?: string
}

export interface TurnDetail {
  missing?: false
  kind: 'turn'
  turn: number
  status: string
  reason?: string
  startSeq: number
  endSeq?: number
}

export interface UnlinkedDetail {
  missing?: false
  kind: 'unlinked'
  childSessionId: string
  childLabel?: string
  childMode?: string
}

export type InstructionRecord =
  | { recorded: false }
  | { recorded: true; text: string }

export interface TitleDetail {
  missing?: false
  kind: 'sidecar'
  purpose: 'session-title'
  status: string
  system: unknown
  messages: unknown
  route: unknown
  maxTokens: unknown
  reasoningEffort?: unknown
  output?: string
}

export interface CompactionDetail {
  missing?: false
  kind: 'sidecar'
  purpose: 'compaction'
  status: string
  messages: unknown
  tools: unknown
  toolHistory: unknown
  config: unknown
  instruction: InstructionRecord
  summary?: unknown
  rawOutput?: unknown
  usage?: unknown
  provider?: string
  model?: string
  maxTokens?: number
  error?: string
}

export type SearchSource =
  | { kind: 'tool'; name: string; callId: string; arguments?: unknown }
  | { kind: 'attempt'; step: number; attempt?: number; output?: unknown }

export interface SearchDetail {
  missing?: false
  kind: 'sidecar'
  purpose: 'web-search'
  status: string
  request: unknown
  /** The tool call or model attempt that was running when the search was requested. */
  source?: SearchSource
}

export type NodeDetail =
  | MissingDetail
  | AttemptDetail
  | StepRunningDetail
  | ToolDetail
  | TurnDetail
  | UnlinkedDetail
  | TitleDetail
  | CompactionDetail
  | SearchDetail

export function isMissing(detail: NodeDetail): detail is MissingDetail {
  return 'missing' in detail && detail.missing === true
}
