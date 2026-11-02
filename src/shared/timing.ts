/**
 * Wait, think, and first-response clocks.
 * Wait ends when the output stream starts. Think is the reasoning inside that stream.
 * First response is one span per user input, from the moment waiting began to the
 * first thing the user can see. Later tool-only calls do not add another span.
 */
import { absentFigure, usageFigure, type Figure } from './figures.js'

export interface StreamMetrics {
  streamStart?: number
  thinkMs: number
  hasReasoning: boolean
  firstVisible?: number
}

/** Read clocks off a compact stream. The text itself is not retained. */
export function streamMetrics(stream: readonly unknown[]): StreamMetrics {
  let streamStart: number | undefined
  let thinkMs = 0
  let hasReasoning = false
  let firstVisible: number | undefined
  let reasoningOpen: number | undefined
  const noteStart = (time: number) => {
    streamStart = streamStart === undefined ? time : Math.min(streamStart, time)
  }
  const noteVisible = (time: number) => {
    if (firstVisible === undefined || time < firstVisible) firstVisible = time
  }
  const closeReasoning = (time: number) => {
    if (reasoningOpen === undefined) return
    thinkMs += Math.max(0, time - reasoningOpen)
    reasoningOpen = undefined
  }
  for (const record of stream) {
    if (record === null || typeof record !== 'object') continue
    const row = record as Record<string, unknown>
    if (row.type === 'chunk') {
      if (typeof row.time !== 'number') continue
      noteStart(row.time)
      const chunk = row.chunk
      if (chunk === null || typeof chunk !== 'object') continue
      const kind = (chunk as { type?: unknown }).type
      if (kind === 'reasoning-delta') {
        hasReasoning = true
        reasoningOpen ??= row.time
        const text = (chunk as { text?: unknown }).text
        if (typeof text === 'string' && text.trim().length > 0) noteVisible(row.time)
        continue
      }
      closeReasoning(row.time)
      if (kind === 'text-delta') {
        const text = (chunk as { text?: unknown }).text
        if (typeof text === 'string' && text.trim().length > 0) noteVisible(row.time)
      } else if (kind === 'tool-call-delta') {
        const name = (chunk as { name?: unknown }).name
        const args = (chunk as { argumentsDelta?: unknown }).argumentsDelta
        if (typeof name === 'string' && name.length > 0) noteVisible(row.time)
        else if (typeof args === 'string' && args.trim().length > 0) noteVisible(row.time)
      }
      continue
    }
    closeReasoning(typeof row.time0 === 'number' ? row.time0 : streamStart ?? 0)
    if (typeof row.time0 !== 'number') continue
    noteStart(row.time0)
    const dt = numberList(row.dt)
    if (row.type === 'reasoning-chunks') {
      hasReasoning = true
      thinkMs += dt.reduce((sum, gap) => sum + gap, 0)
      scanVisible(row.time0, dt, row.texts, noteVisible)
    } else if (row.type === 'text-chunks') {
      scanVisible(row.time0, dt, row.texts, noteVisible)
    } else if (row.type === 'tool-call-chunks') {
      const name = row.name
      if (typeof name === 'string' && name.length > 0) noteVisible(row.time0)
      else scanVisible(row.time0, dt, row.args, noteVisible)
    }
  }
  return {
    ...(streamStart !== undefined ? { streamStart } : {}),
    thinkMs,
    hasReasoning,
    ...(firstVisible !== undefined ? { firstVisible } : {}),
  }
}

function numberList(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is number => typeof item === 'number')
}

/** Member `i` sits at `time0` plus the `dt` values that precede it. Blank members are skipped. */
function scanVisible(time0: number, dt: readonly number[], parts: unknown, note: (time: number) => void): void {
  if (!Array.isArray(parts)) return
  let time = time0
  for (let index = 0; index < parts.length; index += 1) {
    const text = parts[index]
    if (typeof text === 'string' && text.trim().length > 0) {
      note(time)
      return
    }
    time += dt[index] ?? 0
  }
}

/** Stream start minus the step start. Missing when the stream has not started. */
export function waitMs(stepStart: number | undefined, streamStart: number | undefined): number | undefined {
  if (stepStart === undefined || streamStart === undefined) return undefined
  return streamStart - stepStart
}

export interface FirstResponse {
  opening: boolean
  noUserMessage: boolean
  seq: number
  start: number
  end?: number
  duration: Figure
}

/**
 * One first-response per user input.
 * The opening input starts at `turn/start`, not at the user message.
 * A later `source.kind === 'user'` message starts at that message's time.
 */
export function firstResponses(input: {
  startTime: number | undefined
  startSeq: number
  userInputs: readonly { seq: number; time: number }[]
  visibles: readonly number[]
}): FirstResponse[] {
  if (input.startTime === undefined) return []
  const users = [...input.userInputs].sort((left, right) => left.time - right.time || left.seq - right.seq)
  const anchors = [
    { opening: true, noUserMessage: users.length === 0, seq: input.startSeq, start: input.startTime },
    ...users.slice(1).map(user => ({
      opening: false,
      noUserMessage: false,
      seq: user.seq,
      start: user.time,
    })),
  ]
  return anchors.map((anchor, index) => {
    const next = anchors[index + 1]
    const end = earliestAtOrAfter(input.visibles, anchor.start, next?.start)
    if (end === undefined) return { ...anchor, duration: absentFigure() }
    return { ...anchor, end, duration: usageFigure(end - anchor.start) }
  })
}

function earliestAtOrAfter(times: readonly number[], start: number, before: number | undefined): number | undefined {
  let best: number | undefined
  for (const time of times) {
    if (time < start) continue
    if (before !== undefined && time >= before) continue
    if (best === undefined || time < best) best = time
  }
  return best
}

export interface ToolInterval {
  start: number
  end: number
}

/** Parallel tools share one wall clock. Union is the merged span; sum is each span added. */
export function toolClock(intervals: readonly ToolInterval[]): { union: number; sum: number } {
  const sum = intervals.reduce((total, interval) => total + Math.max(0, interval.end - interval.start), 0)
  const ordered = [...intervals].filter(interval => interval.end >= interval.start).sort((left, right) => left.start - right.start)
  let union = 0
  let open = 0
  let close = 0
  let started = false
  for (const interval of ordered) {
    if (!started || interval.start > close) {
      if (started) union += close - open
      open = interval.start
      close = interval.end
      started = true
      continue
    }
    if (interval.end > close) close = interval.end
  }
  if (started) union += close - open
  return { union, sum }
}

/** Bar box on a shared turn clock. Later intervals sit further right. */
export function barGeometry(
  start: number,
  end: number,
  origin: number,
  span: number,
): { left: number; width: number } {
  const safe = span > 0 ? span : 1
  const left = ((start - origin) / safe) * 100
  const width = ((Math.max(end, start) - start) / safe) * 100
  return { left: Math.max(0, left), width: Math.max(0, width) }
}
