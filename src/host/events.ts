/**
 * Context events inside one turn. Unrecognized events are skipped.
 * Labels and token counts only — message bodies are not copied out.
 */
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import { classifyWindow, sourceLabel } from '../shared/classify.js'
import { estimateMessage } from '../shared/estimate.js'
import { estimatedFigure, parseUsage, type Figure } from '../shared/figures.js'
import type { TurnNode } from '../shared/model.js'
import type { ContextEvent, EventKind } from '../shared/report.js'

export function summarizeTurnEvents(
  events: readonly SessionEvent[],
  turn: TurnNode,
  windowSeq: number | undefined,
): ContextEvent[] {
  const rows: ContextEvent[] = []
  let provider: string | undefined
  let model: string | undefined
  for (const event of events) {
    const type = event.type as string
    const inTurn = event.seq >= turn.startSeq && (turn.endSeq === undefined || event.seq <= turn.endSeq)
    if (type === 'request/header') {
      const route = headerRoute(event)
      const changed = (route.model !== undefined && model !== undefined && route.model !== model)
        || (route.provider !== undefined && provider !== undefined && route.provider !== provider)
      if (route.provider !== undefined) provider = route.provider
      if (route.model !== undefined) model = route.model
      if (changed && inTurn) {
        rows.push(row(event, 'switch', route.model ?? route.provider ?? 'switch', turn, windowSeq))
      }
      const mode = planMode(event)
      if (mode !== undefined && inTurn) rows.push(row(event, 'switch', mode, turn, windowSeq))
      continue
    }
    if (!inTurn) continue
    if (type === 'plan/mode') {
      rows.push(row(event, 'switch', planMode(event) ?? 'plan', turn, windowSeq))
      continue
    }
    if (type === 'user/message' || type === 'developer/message') {
      const message = messageOf(event)
      const kind = messageKind(message)
      if (kind === undefined) continue
      const tokens = estimatedFigure(estimateMessage(message, false))
      rows.push(row(event, kind, sourceLabel(message), turn, windowSeq, tokens))
      continue
    }
    if (type === 'tool/result') {
      const message = messageOf(event)
      const kind = messageKind(message)
      if (kind !== 'skill') continue
      rows.push(row(event, 'skill', sourceLabel(message), turn, windowSeq, estimatedFigure(estimateMessage(message, false))))
      continue
    }
    if (type === 'tool/call') {
      const name = textField(dataOf(event), 'name') ?? 'tool'
      rows.push(row(event, 'tool', name, turn, windowSeq))
      continue
    }
    if (type === 'assistant/message' || type === 'assistant/attempt') {
      const usage = parseUsage(dataOf(event).usage)
      const tokens = usage?.totalTokens !== undefined
        ? { basis: 'usage' as const, value: usage.totalTokens }
        : usage !== undefined
          ? { basis: 'usage' as const, value: usage.inputTokens + usage.outputTokens }
          : undefined
      rows.push(row(event, 'model', model ?? 'model', turn, windowSeq, tokens))
      continue
    }
    if (type === 'compaction/start') {
      const reclaimed = reclaimedTokens(events, event)
      rows.push(row(
        event,
        'compaction',
        'compaction',
        turn,
        windowSeq,
        reclaimed === undefined ? undefined : estimatedFigure(reclaimed),
      ))
      continue
    }
    if (type === 'session/title-llm-request') {
      rows.push(row(event, 'title', 'title', turn, windowSeq))
      continue
    }
    if (/trim|prune|offload/i.test(type)) {
      rows.push(row(event, 'trim', type, turn, windowSeq))
    }
  }
  return rows
}

function row(
  event: SessionEvent,
  kind: EventKind,
  label: string,
  turn: TurnNode,
  windowSeq: number | undefined,
  tokens?: Figure,
): ContextEvent {
  const nodeId = nodeFor(turn, event.seq)
  return {
    seq: event.seq,
    time: event.time,
    kind,
    label,
    ...(tokens !== undefined ? { tokens } : {}),
    ...(nodeId !== undefined ? { nodeId } : {}),
    inWindow: windowSeq !== undefined && event.seq < windowSeq,
  }
}

function messageKind(message: unknown): 'injection' | 'skill' | undefined {
  const classified = classifyWindow([message], [])
  const category = classified.items[0]?.category
  if (category === 'injection' || category === 'skill') return category
  return undefined
}

function nodeFor(turn: TurnNode, seq: number): string | undefined {
  for (const item of turn.items) {
    if (item.kind === 'sidecar' && item.requestSeq === seq) return item.id
    if (item.kind !== 'step') continue
    for (const attempt of item.attempts) {
      if (attempt.outputSeq === seq) return attempt.id
    }
    for (const tool of item.tools) {
      if (tool.callSeq === seq) return tool.id
    }
  }
  return undefined
}

function reclaimedTokens(events: readonly SessionEvent[], start: SessionEvent): number | undefined {
  const compactionId = textField(dataOf(start), 'compactionId')
  const summary = events.find(event => {
    if ((event.type as string) !== 'compaction/summary' || event.seq < start.seq) return false
    if (compactionId === undefined) return true
    return textField(dataOf(event), 'compactionId') === compactionId
  })
  const shadowed = dataOf(summary).shadowedSeqs
  if (!Array.isArray(shadowed)) return undefined
  let total = 0
  let any = false
  for (const seq of shadowed) {
    if (typeof seq !== 'number') continue
    const message = messageOf(events.find(event => event.seq === seq))
    if (message === undefined) continue
    total += estimateMessage(message)
    any = true
  }
  return any ? total : undefined
}

function headerRoute(event: SessionEvent): { provider?: string; model?: string } {
  const header = dataOf(event).header
  const config = header !== null && typeof header === 'object' ? (header as { config?: unknown }).config : undefined
  if (config === null || typeof config !== 'object') return {}
  return {
    provider: textField(config as Record<string, unknown>, 'provider'),
    model: textField(config as Record<string, unknown>, 'model'),
  }
}

function planMode(event: SessionEvent): string | undefined {
  const data = dataOf(event)
  const direct = textField(data, 'mode') ?? textField(data, 'plan')
  if (direct !== undefined) return direct
  const header = data.header
  if (header === null || typeof header !== 'object') return undefined
  const record = header as Record<string, unknown>
  return textField(record, 'mode') ?? textField(record, 'plan')
}

function messageOf(event: SessionEvent | undefined): unknown {
  if (event === undefined) return undefined
  const data = dataOf(event)
  if (data.message !== undefined) return data.message
  if (typeof data.role === 'string') return data
  return undefined
}

function dataOf(event: SessionEvent | undefined): Record<string, unknown> {
  const data = event?.data
  return data !== null && typeof data === 'object' ? data as Record<string, unknown> : {}
}

function textField(source: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = source?.[key]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}
