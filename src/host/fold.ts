/**
 * Pure fold: one committed session event advances the trace index.
 * Unknown events return the same state reference. The index stores sequence
 * numbers and scalars, never message bodies, tool schemas, summaries, or search bodies.
 */
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import {
  attemptId,
  emptyTrack,
  sidecarId,
  stepId,
  toolId,
  turnId,
  unlinkedId,
  type AttemptRef,
  type NodeStatus,
  type RootNode,
  type SidecarNode,
  type SidecarPurpose,
  type StepNode,
  type TokenUsageScalars,
  type ToolNode,
  type TrackState,
  type TurnItem,
  type TurnNode,
  type UnlinkedNode,
} from '../shared/model.js'

/** Fold one event. A throw leaves the previous state in place so session append continues. */
export function applyTrack(state: TrackState, event: SessionEvent): TrackState {
  try {
    return fold(state, event)
  } catch {
    return state
  }
}

/** Fold a whole log from an empty index. */
export function foldAll(events: readonly SessionEvent[]): TrackState {
  let state = emptyTrack()
  for (const event of events) state = applyTrack(state, event)
  return state
}

export function fold(state: TrackState, event: SessionEvent): TrackState {
  const type = event.type as string
  switch (type) {
    case 'turn/start':
      return onTurnStart(state, event)
    case 'turn/end':
      return onTurnEnd(state, event)
    case 'step/start':
      return onStepStart(state, event)
    case 'step/end':
      return onStepEnd(state, event)
    case 'assistant/message':
      return onAssistantMessage(state, event)
    case 'assistant/attempt':
      return onAssistantAttempt(state, event)
    case 'llm/retry':
      return onRetry(state, event)
    case 'tool/call':
      return onToolCall(state, event)
    case 'tool/result':
      return onToolResult(state, event)
    case 'request/header':
      return onHeader(state, event)
    case 'request/context':
    case 'system/message':
    case 'user/message':
    case 'developer/message':
      return bumpRunning(state, event)
    case 'subagent/catalog':
      return onCatalog(state, event)
    case 'session/title-llm-request':
      return onTitleRequest(state, event)
    case 'session/title':
      return onTitle(state, event)
    case 'compaction/start':
      return onCompactionStart(state, event)
    case 'compaction/summary':
      return onCompactionSummary(state, event)
    case 'compaction/end':
      return onCompactionEnd(state, event)
    case 'web/deepseek-search-llm-request':
      return onSearch(state, event)
    default:
      return state
  }
}

function record(event: SessionEvent): Record<string, unknown> {
  const data = event.data
  return data !== null && typeof data === 'object' ? data as Record<string, unknown> : {}
}

function num(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isSafeInteger(value) ? value : undefined
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function usageOf(value: unknown): TokenUsageScalars | undefined {
  if (value === null || typeof value !== 'object') return undefined
  const source = value as Record<string, unknown>
  if (typeof source.inputTokens !== 'number' || typeof source.outputTokens !== 'number') return undefined
  const usage: TokenUsageScalars = { inputTokens: source.inputTokens, outputTokens: source.outputTokens }
  for (const key of ['totalTokens', 'cacheReadTokens', 'cacheWriteTokens', 'reasoningTokens'] as const) {
    const item = source[key]
    if (typeof item === 'number') usage[key] = item
  }
  return usage
}

function seqOf(node: { kind: string; startSeq?: number; requestSeq?: number; catalogSeq?: number }): number {
  if (node.kind === 'turn' || node.kind === 'step') return node.startSeq ?? 0
  if (node.kind === 'sidecar') return node.requestSeq ?? 0
  return node.catalogSeq ?? 0
}

function replaceRoot(state: TrackState, id: string, next: RootNode): TrackState {
  let changed = false
  const root = state.root.map(node => {
    if (node.id !== id) return node
    changed = true
    return next
  })
  return changed ? { ...state, root } : state
}

function mapTurn(state: TrackState, turnNumber: number, update: (turn: TurnNode) => TurnNode): TrackState {
  let changed = false
  const root = state.root.map(node => {
    if (node.kind !== 'turn' || node.turn !== turnNumber) return node
    const next = update(node)
    if (next !== node) changed = true
    return next
  })
  return changed ? { ...state, root } : state
}

function openTurn(state: TrackState): TurnNode | undefined {
  for (let index = state.root.length - 1; index >= 0; index -= 1) {
    const node = state.root[index]
    if (node?.kind === 'turn' && node.status === 'running') return node
  }
  return undefined
}

function turnByNumber(state: TrackState, turnNumber: number): TurnNode | undefined {
  return state.root.find((node): node is TurnNode => node.kind === 'turn' && node.turn === turnNumber)
}

function runningStep(turn: TurnNode): StepNode | undefined {
  for (let index = turn.items.length - 1; index >= 0; index -= 1) {
    const item = turn.items[index]
    if (item?.kind === 'step' && item.status === 'running') return item
  }
  return undefined
}

function withBodyItem(turn: TurnNode, item: StepNode | SidecarNode): TurnNode {
  const unlinked = turn.items.filter(entry => entry.kind === 'unlinked')
  const body = [...turn.items.filter(entry => entry.kind !== 'unlinked'), item]
  body.sort((left, right) => seqOf(left) - seqOf(right))
  return { ...turn, items: [...body, ...unlinked] }
}

function replaceItem(turn: TurnNode, id: string, next: TurnItem): TurnNode {
  let changed = false
  const items = turn.items.map(item => {
    if (item.id !== id) return item
    changed = true
    return next
  })
  return changed ? { ...turn, items } : turn
}

function placeRoot(state: TrackState, node: RootNode): TrackState {
  const unlinked = state.root.filter(entry => entry.kind === 'unlinked')
  const body = [...state.root.filter(entry => entry.kind !== 'unlinked'), node]
  body.sort((left, right) => seqOf(left) - seqOf(right))
  return { ...state, root: [...body, ...unlinked] }
}

function onTurnStart(state: TrackState, event: SessionEvent): TrackState {
  const turnNumber = num(record(event).turn)
  if (turnNumber === undefined) return state
  if (turnByNumber(state, turnNumber)) return state
  const turn: TurnNode = {
    kind: 'turn',
    id: turnId(turnNumber),
    turn: turnNumber,
    status: 'running',
    startSeq: event.seq,
    items: [],
  }
  return placeRoot(state, turn)
}

function statusOfReason(kind: string | undefined): NodeStatus {
  if (kind === 'aborted') return 'aborted'
  if (kind === 'error' || kind === 'blocked') return 'error'
  return 'ok'
}

function closeStep(step: StepNode, status: NodeStatus, endSeq: number): StepNode {
  if (step.status !== 'running') return step
  return { ...step, status, endSeq }
}

function onTurnEnd(state: TrackState, event: SessionEvent): TrackState {
  const data = record(event)
  const turnNumber = num(data.turn)
  if (turnNumber === undefined) return state
  const reason = data.reason
  const kind = reason !== null && typeof reason === 'object' ? str((reason as { kind?: unknown }).kind) : undefined
  const status = statusOfReason(kind)
  return mapTurn(state, turnNumber, turn => {
    if (turn.endSeq !== undefined) return turn
    return {
      ...turn,
      status,
      endSeq: event.seq,
      ...(kind !== undefined ? { reason: kind } : {}),
      items: turn.items.map(item => item.kind === 'step' ? closeStep(item, status === 'running' ? 'ok' : status, event.seq) : item),
    }
  })
}

function onStepStart(state: TrackState, event: SessionEvent): TrackState {
  const data = record(event)
  const turnNumber = num(data.turn)
  const stepNumber = num(data.step)
  if (turnNumber === undefined || stepNumber === undefined) return state
  const turn = turnByNumber(state, turnNumber)
  if (!turn) return state
  if (turn.items.some(item => item.kind === 'step' && item.step === stepNumber)) return state
  const step: StepNode = {
    kind: 'step',
    id: stepId(turnNumber, stepNumber),
    turn: turnNumber,
    step: stepNumber,
    status: 'running',
    startSeq: event.seq,
    inputSeq: event.seq + 1,
    attempts: [],
    tools: [],
  }
  return replaceRoot(state, turn.id, withBodyItem(turn, step))
}

function onStepEnd(state: TrackState, event: SessionEvent): TrackState {
  const data = record(event)
  const turnNumber = num(data.turn)
  const stepNumber = num(data.step)
  if (turnNumber === undefined || stepNumber === undefined) return state
  return mapTurn(state, turnNumber, turn => {
    const step = turn.items.find((item): item is StepNode => item.kind === 'step' && item.step === stepNumber)
    if (!step || step.status !== 'running') return turn
    const failed = step.attempts.some(attempt => attempt.status === 'error' || attempt.status === 'aborted')
    const succeeded = step.attempts.some(attempt => attempt.status === 'ok')
    const status: NodeStatus = succeeded || step.attempts.length === 0 ? 'ok' : failed ? 'error' : 'ok'
    return replaceItem(turn, step.id, { ...step, status, endSeq: event.seq })
  })
}

function addAttempt(state: TrackState, event: SessionEvent, status: NodeStatus, usage: TokenUsageScalars | undefined, interrupted?: true): TrackState {
  const data = record(event)
  const turnNumber = num(data.turn)
  const stepNumber = num(data.step)
  if (turnNumber === undefined || stepNumber === undefined) return state
  return mapTurn(state, turnNumber, turn => {
    const step = turn.items.find((item): item is StepNode => item.kind === 'step' && item.step === stepNumber)
    if (!step) return turn
    const attemptNumber = step.attempts.length + 1
    const attempt: AttemptRef = {
      id: attemptId(turnNumber, stepNumber, attemptNumber),
      attempt: attemptNumber,
      inputSeq: event.seq,
      outputSeq: event.seq,
      status,
    }
    const next: StepNode = {
      ...step,
      inputSeq: event.seq + 1,
      attempts: [...step.attempts, attempt],
      ...(usage !== undefined ? { usage } : {}),
    }
    void interrupted
    return replaceItem(turn, step.id, next)
  })
}

function onAssistantMessage(state: TrackState, event: SessionEvent): TrackState {
  const data = record(event)
  const interrupted = data.interrupted === true ? true : undefined
  return addAttempt(state, event, interrupted ? 'aborted' : 'ok', usageOf(data.usage), interrupted)
}

function onAssistantAttempt(state: TrackState, event: SessionEvent): TrackState {
  return addAttempt(state, event, 'error', undefined)
}

function onRetry(state: TrackState, event: SessionEvent): TrackState {
  const data = record(event)
  const turnNumber = num(data.turn)
  const stepNumber = num(data.step)
  if (turnNumber === undefined || stepNumber === undefined) return state
  return mapTurn(state, turnNumber, turn => {
    const step = turn.items.find((item): item is StepNode => item.kind === 'step' && item.step === stepNumber)
    const last = step?.attempts.at(-1)
    if (!step || !last || last.retrySeq !== undefined) return turn
    const attempts = step.attempts.map((attempt, index) => index === step.attempts.length - 1
      ? { ...attempt, retrySeq: event.seq, status: 'error' as const }
      : attempt)
    return replaceItem(turn, step.id, { ...step, inputSeq: event.seq + 1, attempts })
  })
}

function onToolCall(state: TrackState, event: SessionEvent): TrackState {
  const data = record(event)
  const turnNumber = num(data.turn)
  const stepNumber = num(data.step)
  const callId = str(data.callId)
  const name = str(data.name)
  if (turnNumber === undefined || stepNumber === undefined || callId === undefined || name === undefined) return state
  return mapTurn(state, turnNumber, turn => {
    const step = turn.items.find((item): item is StepNode => item.kind === 'step' && item.step === stepNumber)
    if (!step || step.tools.some(tool => tool.callId === callId)) return turn
    const tool: ToolNode = {
      kind: 'tool',
      id: toolId(event.seq),
      callId,
      name,
      status: 'running',
      callSeq: event.seq,
    }
    return replaceItem(turn, step.id, { ...step, inputSeq: event.seq + 1, tools: [...step.tools, tool] })
  })
}

function subagentIdFromResult(message: unknown): string | undefined {
  if (message === null || typeof message !== 'object') return undefined
  const content = (message as { content?: unknown }).content
  if (!Array.isArray(content)) return undefined
  for (const block of content) {
    if (block === null || typeof block !== 'object') continue
    const recordBlock = block as { type?: unknown; text?: unknown }
    if (recordBlock.type !== 'text' || typeof recordBlock.text !== 'string') continue
    try {
      const parsed = JSON.parse(recordBlock.text) as { subagentId?: unknown }
      if (typeof parsed.subagentId === 'string' && parsed.subagentId.length > 0) return parsed.subagentId
    } catch {
      // Tool text that is not the activation JSON stays a normal tool.
    }
  }
  return undefined
}

function onToolResult(state: TrackState, event: SessionEvent): TrackState {
  const data = record(event)
  const turnNumber = num(data.turn)
  const stepNumber = num(data.step)
  const message = data.message
  const callId = message !== null && typeof message === 'object' ? str((message as { toolCallId?: unknown }).toolCallId) : undefined
  if (turnNumber === undefined || stepNumber === undefined || callId === undefined) return state
  const childSessionId = subagentIdFromResult(message)
  const isError = message !== null && typeof message === 'object' && (message as { isError?: unknown }).isError === true
  return mapTurn(state, turnNumber, turn => {
    const step = turn.items.find((item): item is StepNode => item.kind === 'step' && item.step === stepNumber)
    if (!step) return turn
    const tool = step.tools.find(entry => entry.callId === callId)
    if (!tool) return turn
    const unlinked = childSessionId === undefined
      ? undefined
      : turn.items.find((item): item is UnlinkedNode => item.kind === 'unlinked' && item.childSessionId === childSessionId)
    const nextTool: ToolNode = {
      ...tool,
      status: isError ? 'error' : 'ok',
      resultSeq: event.seq,
      ...(childSessionId !== undefined ? { childSessionId } : {}),
      ...(unlinked?.childLabel !== undefined ? { childLabel: unlinked.childLabel } : {}),
      ...(unlinked?.childMode !== undefined ? { childMode: unlinked.childMode } : {}),
    }
    const tools = step.tools.map(entry => entry.id === tool.id ? nextTool : entry)
    let nextTurn = replaceItem(turn, step.id, { ...step, inputSeq: event.seq + 1, tools })
    if (unlinked) {
      nextTurn = { ...nextTurn, items: nextTurn.items.filter(item => item.id !== unlinked.id) }
    }
    return nextTurn
  })
}

function onHeader(state: TrackState, event: SessionEvent): TrackState {
  const header = record(event).header
  const config = header !== null && typeof header === 'object' ? (header as { config?: unknown }).config : undefined
  const provider = config !== null && typeof config === 'object' ? str((config as { provider?: unknown }).provider) : undefined
  const model = config !== null && typeof config === 'object' ? str((config as { model?: unknown }).model) : undefined
  const bumped = bumpRunning(state, event)
  if (provider === undefined && model === undefined) return bumped
  const turn = openTurn(bumped)
  const step = turn ? runningStep(turn) : undefined
  if (!turn || !step) return bumped
  if (step.provider === provider && step.model === model) return bumped
  return replaceRoot(bumped, turn.id, replaceItem(turn, step.id, {
    ...step,
    ...(provider !== undefined ? { provider } : {}),
    ...(model !== undefined ? { model } : {}),
  }))
}

function bumpRunning(state: TrackState, event: SessionEvent): TrackState {
  const turn = openTurn(state)
  const step = turn ? runningStep(turn) : undefined
  if (!turn || !step) return state
  const inputSeq = event.seq + 1
  if (step.inputSeq === inputSeq) return state
  return replaceRoot(state, turn.id, replaceItem(turn, step.id, { ...step, inputSeq }))
}

function catalogFields(data: Record<string, unknown>): { childId: string; mode?: string; label?: string } | undefined {
  const childId = str(data.childId)
  if (childId === undefined || childId.length === 0) return undefined
  return { childId, mode: str(data.mode), label: str(data.label) }
}

function toolWithChild(turn: TurnNode, childId: string): { step: StepNode; tool: ToolNode } | undefined {
  for (const item of turn.items) {
    if (item.kind !== 'step') continue
    const tool = item.tools.find(entry => entry.childSessionId === childId)
    if (tool) return { step: item, tool }
  }
  return undefined
}

function onCatalog(state: TrackState, event: SessionEvent): TrackState {
  const fields = catalogFields(record(event))
  if (!fields) return state
  const turn = openTurn(state) ?? [...state.root].reverse().find((node): node is TurnNode => node.kind === 'turn')
  if (!turn) {
    if (state.root.some(node => node.kind === 'unlinked' && node.childSessionId === fields.childId)) return state
    const node: UnlinkedNode = {
      kind: 'unlinked',
      id: unlinkedId(fields.childId),
      childSessionId: fields.childId,
      catalogSeq: event.seq,
      ...(fields.label !== undefined ? { childLabel: fields.label } : {}),
      ...(fields.mode !== undefined ? { childMode: fields.mode } : {}),
    }
    return placeRoot(state, node)
  }
  const linked = toolWithChild(turn, fields.childId)
  if (linked) {
    const tool: ToolNode = {
      ...linked.tool,
      ...(fields.label !== undefined ? { childLabel: fields.label } : {}),
      ...(fields.mode !== undefined ? { childMode: fields.mode } : {}),
    }
    const tools = linked.step.tools.map(entry => entry.id === tool.id ? tool : entry)
    return replaceRoot(state, turn.id, replaceItem(turn, linked.step.id, { ...linked.step, tools }))
  }
  if (turn.items.some(item => item.kind === 'unlinked' && item.childSessionId === fields.childId)) return state
  const unlinked: UnlinkedNode = {
    kind: 'unlinked',
    id: unlinkedId(fields.childId),
    childSessionId: fields.childId,
    catalogSeq: event.seq,
    ...(fields.label !== undefined ? { childLabel: fields.label } : {}),
    ...(fields.mode !== undefined ? { childMode: fields.mode } : {}),
  }
  return replaceRoot(state, turn.id, { ...turn, items: [...turn.items, unlinked] })
}

function hostTurn(state: TrackState): TurnNode | undefined {
  return openTurn(state)
}

function addSidecar(state: TrackState, sidecar: SidecarNode, turnNumber: number | null): TrackState {
  if (turnNumber === null) return placeRoot(state, sidecar)
  const turn = turnNumber === undefined ? hostTurn(state) : turnByNumber(state, turnNumber) ?? hostTurn(state)
  if (!turn) return placeRoot(state, sidecar)
  if (turn.items.some(item => item.id === sidecar.id)) return state
  return replaceRoot(state, turn.id, withBodyItem(turn, sidecar))
}

function onTitleRequest(state: TrackState, event: SessionEvent): TrackState {
  const sidecar: SidecarNode = {
    kind: 'sidecar',
    id: sidecarId(event.seq),
    purpose: 'session-title',
    status: 'running',
    requestSeq: event.seq,
  }
  const closed = closePreviousTitle(state, event.seq)
  const turn = hostTurn(closed)
  return addSidecar(closed, sidecar, turn ? turn.turn : null)
}

function closePreviousTitle(state: TrackState, beforeSeq: number): TrackState {
  return mapSidecars(state, sidecar => {
    if (sidecar.purpose !== 'session-title' || sidecar.requestSeq >= beforeSeq || sidecar.status !== 'running') return sidecar
    return { ...sidecar, status: 'ok' }
  })
}

function onTitle(state: TrackState, event: SessionEvent): TrackState {
  const source = record(event).source
  const kind = source !== null && typeof source === 'object' ? str((source as { kind?: unknown }).kind) : undefined
  if (kind !== 'provider') return state
  let target: SidecarNode | undefined
  for (const sidecar of sidecarsOf(state)) {
    if (sidecar.purpose !== 'session-title' || sidecar.requestSeq >= event.seq) continue
    if (target === undefined || sidecar.requestSeq > target.requestSeq) target = sidecar
  }
  if (!target || target.outputSeq !== undefined) return state
  return mapSidecars(state, sidecar => sidecar.id === target?.id
    ? { ...sidecar, outputSeq: event.seq, status: 'ok' }
    : sidecar)
}

function onCompactionStart(state: TrackState, event: SessionEvent): TrackState {
  const data = record(event)
  const compactionId = str(data.compactionId)
  const turn = data.turn === null ? null : num(data.turn) ?? null
  const sidecar: SidecarNode = {
    kind: 'sidecar',
    id: sidecarId(event.seq),
    purpose: 'compaction',
    status: 'running',
    requestSeq: event.seq,
    ...(compactionId !== undefined ? { compactionId } : {}),
  }
  return addSidecar(state, sidecar, turn)
}

function onCompactionSummary(state: TrackState, event: SessionEvent): TrackState {
  const compactionId = str(record(event).compactionId)
  return mapSidecars(state, sidecar => {
    if (sidecar.purpose !== 'compaction' || sidecar.outputSeq !== undefined) return sidecar
    if (compactionId !== undefined && sidecar.compactionId !== compactionId) return sidecar
    return { ...sidecar, outputSeq: event.seq }
  })
}

function onCompactionEnd(state: TrackState, event: SessionEvent): TrackState {
  const data = record(event)
  const compactionId = str(data.compactionId)
  const error = str(data.error)
  return mapSidecars(state, sidecar => {
    if (sidecar.purpose !== 'compaction' || sidecar.endSeq !== undefined) return sidecar
    if (compactionId !== undefined && sidecar.compactionId !== compactionId) return sidecar
    return { ...sidecar, endSeq: event.seq, status: error !== undefined && error.length > 0 ? 'error' : 'ok' }
  })
}

function onSearch(state: TrackState, event: SessionEvent): TrackState {
  const sidecar: SidecarNode = {
    kind: 'sidecar',
    id: sidecarId(event.seq),
    purpose: 'web-search',
    status: 'ok',
    requestSeq: event.seq,
    outputSeq: event.seq,
  }
  const turn = hostTurn(state)
  return addSidecar(state, sidecar, turn ? turn.turn : null)
}

function* sidecarsOf(state: TrackState): Generator<SidecarNode> {
  for (const node of state.root) {
    if (node.kind === 'sidecar') yield node
    if (node.kind !== 'turn') continue
    for (const item of node.items) {
      if (item.kind === 'sidecar') yield item
    }
  }
}

function mapSidecars(state: TrackState, update: (sidecar: SidecarNode) => SidecarNode): TrackState {
  let changed = false
  const mapNode = (node: RootNode): RootNode => {
    if (node.kind === 'sidecar') {
      const next = update(node)
      if (next !== node) changed = true
      return next
    }
    if (node.kind !== 'turn') return node
    let turnChanged = false
    const items = node.items.map(item => {
      if (item.kind !== 'sidecar') return item
      const next = update(item)
      if (next !== item) turnChanged = true
      return next
    })
    if (!turnChanged) return node
    changed = true
    return { ...node, items }
  }
  const root = state.root.map(mapNode)
  return changed ? { ...state, root } : state
}

export type { SidecarPurpose }
