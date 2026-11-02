/** One turn, as the console reads it. Event rows carry labels and counts, never message bodies. */
import type { Figure } from './figures.js'
import type { CategoryId } from './classify.js'
import type { NodeStatus } from './model.js'

export interface CategoryTotal {
  id: CategoryId
  tokens: number
}

export interface NamedLine {
  name: string
  tokens: number
  calls?: number
}

export interface WindowReport {
  attemptId?: string
  inputSeq?: number
  categories: CategoryTotal[]
  toolDefinitions: NamedLine[]
  definitionOverhead?: number
  toolResults: NamedLine[]
  estimated: Figure
  exactInput: Figure
  delta?: Figure
  consistent?: boolean
  hitRate: Figure
}

export interface CallTiming {
  attemptId: string
  label: string
  wait: Figure
  think: Figure
  /** Set when the attempt settled without a reasoning fragment. */
  thinkNote?: 'none'
  delayMs?: number
  firstVisible?: number
}

export interface FirstResponseReport {
  opening: boolean
  noUserMessage: boolean
  seq: number
  start?: number
  end?: number
  duration: Figure
  /** Running, and nothing visible yet. The console says “not seen yet”. */
  pending: boolean
}

export interface TimingReport {
  elapsed: Figure
  elapsedRunning: boolean
  wait: Figure
  think: Figure
  calls: CallTiming[]
  firstResponses: FirstResponseReport[]
  tools: { id: string; name: string; start?: number; end?: number }[]
  toolUnion?: number
  toolSum?: number
}

export type EventKind = 'injection' | 'skill' | 'compaction' | 'trim' | 'model' | 'tool' | 'switch' | 'title'

export interface ContextEvent {
  seq: number
  time: number
  kind: EventKind
  label: string
  tokens?: Figure
  nodeId?: string
  inWindow: boolean
}

export interface SubagentLine {
  sessionId: string
  label?: string
  mode?: string
}

export interface ConsumptionReport {
  input: Figure
  output: Figure
  total: Figure
  reasoning: Figure
  cacheRead: Figure
  cacheWrite: Figure
  hitRate: Figure
  compaction: Figure
  /** Present when this turn recorded a title call. Absent usage stays unreported. */
  title?: Figure
}

export interface TurnReport {
  missing?: false
  kind: 'turn-report'
  id: string
  turn: number
  status: NodeStatus
  reason?: string
  startSeq: number
  endSeq?: number
  startTime?: number
  endTime?: number
  readAt: number
  /** The open attempt has not produced an assistant event yet. */
  outputPending: boolean
  consumption: ConsumptionReport
  window: WindowReport
  timing: TimingReport
  events: ContextEvent[]
  subagents: SubagentLine[]
}
