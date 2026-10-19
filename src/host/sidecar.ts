/**
 * Sidecar details are read from the session events that already recorded the call.
 * The compaction instruction is the only field that does not come from the log.
 */
import type { SessionEvent, SessionMessageProjection } from '@deepseek-ai/dsh-session'
import { deriveEventMessage, foldSurface } from '@deepseek-ai/dsh-session'
import type { CompactionDetail, InstructionRecord, SearchDetail, TitleDetail } from '../shared/detail.js'
import type { SidecarNode } from '../shared/model.js'
import { materializePrefix } from './materialize.js'

export function titleDetail(events: readonly SessionEvent[], node: SidecarNode): TitleDetail {
  const request = events.find(event => event.seq === node.requestSeq && (event.type as string) === 'session/title-llm-request')
  const data = objectData(request)
  const output = adoptedTitle(events, node.requestSeq)
  return {
    kind: 'sidecar',
    purpose: 'session-title',
    status: node.status,
    system: data?.system,
    messages: data?.messages,
    route: data?.route,
    maxTokens: data?.maxTokens,
    ...(data?.reasoningEffort !== undefined ? { reasoningEffort: data.reasoningEffort } : {}),
    ...(output !== undefined ? { output } : {}),
  }
}

/** Title text from a registered provider between this request and the next title request. */
export function adoptedTitle(events: readonly SessionEvent[], requestSeq: number): string | undefined {
  for (const event of events) {
    if (event.seq <= requestSeq) continue
    const type = event.type as string
    if (type === 'session/title-llm-request') return undefined
    if (type !== 'session/title') continue
    const data = objectData(event)
    const source = data?.source
    const kind = source !== null && typeof source === 'object' ? (source as { kind?: unknown }).kind : undefined
    if (kind !== 'provider') continue
    return typeof data?.title === 'string' ? data.title : undefined
  }
  return undefined
}

export function compactionDetail(
  events: readonly SessionEvent[],
  node: SidecarNode,
  projections: readonly SessionMessageProjection[],
  instruction: InstructionRecord,
): CompactionDetail {
  const summary = events.find(event => event.seq === node.outputSeq && (event.type as string) === 'compaction/summary')
  const end = events.find(event => event.seq === node.endSeq && (event.type as string) === 'compaction/end')
  const summaryData = objectData(summary)
  const endData = objectData(end)
  const error = typeof endData?.error === 'string' && endData.error.length > 0 ? endData.error : undefined
  const shadowed = Array.isArray(summaryData?.shadowedSeqs)
    ? summaryData.shadowedSeqs.filter((seq): seq is number => typeof seq === 'number')
    : []
  const replayed = summary === undefined
    ? { messages: [], tools: [], toolHistory: { tools: [], updates: [] }, config: undefined }
    : replayShadow(events, summary.seq, shadowed, projections)
  return {
    kind: 'sidecar',
    purpose: 'compaction',
    status: node.status,
    messages: replayed.messages,
    tools: replayed.tools,
    toolHistory: replayed.toolHistory,
    config: replayed.config,
    instruction,
    ...(summaryData?.summary !== undefined ? { summary: summaryData.summary } : {}),
    ...(summaryData?.rawOutput !== undefined ? { rawOutput: summaryData.rawOutput } : {}),
    ...(summaryData?.usage !== undefined ? { usage: summaryData.usage } : {}),
    ...(typeof summaryData?.provider === 'string' ? { provider: summaryData.provider } : {}),
    ...(typeof summaryData?.model === 'string' ? { model: summaryData.model } : {}),
    ...(typeof summaryData?.maxTokens === 'number' ? { maxTokens: summaryData.maxTokens } : {}),
    ...(error !== undefined ? { error } : {}),
  }
}

/** Messages for `shadowedSeqs` on the surface that existed before the summary event. */
function replayShadow(
  events: readonly SessionEvent[],
  summarySeq: number,
  shadowedSeqs: readonly number[],
  projections: readonly SessionMessageProjection[],
) {
  const prefix = events.filter(event => event.seq < summarySeq)
  const surface = foldSurface(prefix, projections)
  const messages = shadowedSeqs.flatMap(seq => {
    const event = prefix.find(item => item.seq === seq)
    if (event === undefined) return []
    const message = deriveEventMessage(event, surface.projectedMessages)
    return message === null ? [] : [message]
  })
  const header = materializePrefix(events, summarySeq, projections)
  return {
    messages,
    tools: header.tools,
    toolHistory: header.toolHistory,
    config: header.config,
  }
}

/** Zero-based position of this compaction among the session's compaction sidecars. */
export function compactionOrdinal(events: readonly SessionEvent[], requestSeq: number): number {
  let index = 0
  for (const event of events) {
    if ((event.type as string) !== 'compaction/start') continue
    if (event.seq < requestSeq) index += 1
    else break
  }
  return index
}

export function searchDetail(events: readonly SessionEvent[], node: SidecarNode): SearchDetail {
  const request = events.find(event => event.seq === node.requestSeq && (event.type as string) === 'web/deepseek-search-llm-request')
  return {
    kind: 'sidecar',
    purpose: 'web-search',
    status: node.status,
    request: request?.data,
  }
}

function objectData(event: SessionEvent | undefined): Record<string, unknown> | undefined {
  if (event === undefined || event.data === null || typeof event.data !== 'object') return undefined
  return event.data as Record<string, unknown>
}
