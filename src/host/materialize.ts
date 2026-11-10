/**
 * Replay the log prefix a model call actually saw.
 * `inputSeq` is exclusive: events with `seq < inputSeq` are the input.
 */
import type { AssistantStreamRecord } from '@deepseek-ai/dsh-llm'
import { assistantStreamFirstTokenTime } from '@deepseek-ai/dsh-llm'
import type { SessionEvent, SessionMessageProjection } from '@deepseek-ai/dsh-session'
import { deriveEventMessage, foldRequestHeader, foldSurface } from '@deepseek-ai/dsh-session'
import { ToolHistoryProjection } from './tool-history.js'
import type { AttemptDetail, StepRunningDetail } from '../shared/detail.js'
import type { AttemptRef } from '../shared/model.js'

export interface MaterializeResult {
  messages: unknown
  tools: unknown
  toolHistory: unknown
  config: unknown
  adapterDefaults?: unknown
  context?: unknown
}

/** Fold `seq < inputSeq` into the messages, tools, and header that call saw. */
export function materializePrefix(
  events: readonly SessionEvent[],
  inputSeq: number,
  projections: readonly SessionMessageProjection[],
): MaterializeResult {
  const prefix = events.filter(event => event.seq < inputSeq)
  const surface = foldSurface(prefix, projections)
  const messages = surface.nodes.flatMap(seq => {
    const event = prefix.find(item => item.seq === seq)
    if (event === undefined) return []
    const message = deriveEventMessage(event, surface.projectedMessages)
    return message === null ? [] : [message]
  })
  const header = foldRequestHeader(prefix)
  const history = new ToolHistoryProjection()
  for (const event of prefix) history.apply(event)
  let context: unknown
  for (const event of prefix) {
    if ((event.type as string) === 'request/context') context = event.data
  }
  return {
    messages,
    tools: header?.tools ?? [],
    toolHistory: history.snapshot(),
    config: header?.config,
    ...(header?.adapterDefaults !== undefined ? { adapterDefaults: header.adapterDefaults } : {}),
    ...(context !== undefined ? { context } : {}),
  }
}

/** Detail of one settled attempt, including timing taken from the compact stream already on the event. */
export function materializeAttempt(
  events: readonly SessionEvent[],
  attempt: AttemptRef,
  projections: readonly SessionMessageProjection[],
): AttemptDetail {
  return withAttemptOutput(events, attempt, materializePrefix(events, attempt.inputSeq, projections))
}

/**
 * Output, usage, and timing for one attempt.
 * `prefix` is the fold of `seq < attempt.inputSeq` and can be cached on its own.
 * The attempt's status and output are not part of that fold: a running snapshot
 * of the same seq must not be reused as this detail.
 */
export function withAttemptOutput(
  events: readonly SessionEvent[],
  attempt: AttemptRef,
  prefix: MaterializeResult,
): AttemptDetail {
  const outputEvent = attempt.outputSeq === undefined
    ? undefined
    : events.find(event => event.seq === attempt.outputSeq)
  const outputData = outputEvent !== undefined && outputEvent.data !== null && typeof outputEvent.data === 'object'
    ? outputEvent.data as Record<string, unknown>
    : undefined
  const stream = Array.isArray(outputData?.stream) ? outputData.stream as readonly AssistantStreamRecord[] : []
  const timing = streamTiming(stream)
  const retryEvent = attempt.retrySeq === undefined ? undefined : events.find(event => event.seq === attempt.retrySeq)
  const retryData = retryEvent !== undefined && retryEvent.data !== null && typeof retryEvent.data === 'object'
    ? retryEvent.data as Record<string, unknown>
    : undefined
  const message = outputData?.message
  return {
    kind: 'attempt',
    status: attempt.status,
    inputSeq: attempt.inputSeq,
    ...prefix,
    ...(message !== undefined ? { output: message } : {}),
    ...(outputData?.usage !== undefined ? { usage: outputData.usage } : {}),
    ...(outputData?.interrupted === true ? { interrupted: true } : {}),
    ...(timing.firstTokenTime !== undefined ? { firstTokenTime: timing.firstTokenTime } : {}),
    ...(timing.streamDuration !== undefined ? { streamDuration: timing.streamDuration } : {}),
    ...(retryData !== undefined ? { retry: retryOf(retryData) } : {}),
  }
}

/** A step that has not produced an assistant event yet. The prefix is everything already committed. */
export function materializeRunning(
  events: readonly SessionEvent[],
  inputSeq: number,
  projections: readonly SessionMessageProjection[],
): StepRunningDetail {
  return {
    kind: 'step',
    status: 'running',
    inputSeq,
    ...materializePrefix(events, inputSeq, projections),
  }
}

function retryOf(data: Record<string, unknown>): { failure: unknown; retry: number; delayMs: number } {
  return {
    failure: data.failure,
    retry: typeof data.retry === 'number' ? data.retry : 0,
    delayMs: typeof data.delayMs === 'number' ? data.delayMs : 0,
  }
}

/** First token from the stream helper; duration is the compact stream's last time minus its start. */
export function streamTiming(stream: readonly AssistantStreamRecord[]): { firstTokenTime?: number; streamDuration?: number } {
  let time0: number | undefined
  let last: number | undefined
  for (const record of stream) {
    if (record.type === 'chunk') {
      time0 ??= record.time
      last = record.time
      continue
    }
    time0 ??= record.time0
    let end = record.time0
    for (const gap of record.dt) end += gap
    last = end
  }
  const firstTokenTime = assistantStreamFirstTokenTime(stream)
  const streamDuration = time0 !== undefined && last !== undefined ? last - time0 : undefined
  return {
    ...(firstTokenTime !== undefined ? { firstTokenTime } : {}),
    ...(streamDuration !== undefined ? { streamDuration } : {}),
  }
}
