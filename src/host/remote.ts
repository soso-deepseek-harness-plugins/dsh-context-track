/**
 * `getNode` reads one index node. Agent steps replay a log prefix. Sidecars read
 * the events that recorded them. A missing session is a normal result, not an exception.
 */
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { SessionId, type Session, type SessionEvent, type SessionMessageProjection } from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-session-projection'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type { InstructionRecord, NodeDetail, ToolDetail, TurnDetail, UnlinkedDetail } from '../shared/detail.js'
import {
  findNode,
  type SidecarNode,
  type ToolNode,
  type TrackState,
  type TurnNode,
  type UnlinkedNode,
} from '../shared/model.js'
import { foldAll } from './fold.js'
import { materializeAttempt, materializeRunning } from './materialize.js'
import { compactionDetail, compactionOrdinal, searchDetail, titleDetail } from './sidecar.js'
import { pairInstruction, Supplement, type SupplementOptions } from './supplement.js'

interface SessionPage {
  read(offset?: number): Promise<{ events: readonly SessionEvent[] }>
  close(): Promise<void>
}

/** Optional host reader for sessions that are no longer live. */
export interface SessionLogReader {
  open(id: string, access: 'read'): Promise<SessionPage>
}

/** One observation's detail cache. The same `inputSeq` is not folded twice. */
export class ObservationCache {
  private readonly values = new Map<string, Map<string, unknown>>()

  get<T>(sessionId: string, key: string): T | undefined {
    return this.values.get(sessionId)?.get(key) as T | undefined
  }

  set<T>(sessionId: string, key: string, value: T): T {
    let bucket = this.values.get(sessionId)
    if (bucket === undefined) {
      bucket = new Map()
      this.values.set(sessionId, bucket)
    }
    bucket.set(key, value)
    return value
  }

  getOr<T>(sessionId: string, key: string, produce: () => T): T {
    const hit = this.get<T>(sessionId, key)
    if (hit !== undefined) return hit
    return this.set(sessionId, key, produce())
  }

  end(sessionId: string): void {
    this.values.delete(sessionId)
  }
}

/** Host remote. Requires `sessionProjections` and `sessions`; persistence is optional. */
export class TrackRemote extends TypertRemoteService {
  static inject = ['sessionProjections', 'sessions']
  private reader: SessionLogReader | undefined
  readonly cache = new ObservationCache()
  readonly supplement: Supplement

  constructor(ctx: Context, config?: unknown) {
    super(ctx, 'track')
    this.supplement = new Supplement(isSupplementOptions(config) ? config : { directory: () => directoryOf(ctx) })
    ctx.inject(['sessionPersistence'], (child) => {
      const service = (child as Context & { sessionPersistence?: SessionLogReader }).sessionPersistence
      if (service !== undefined) this.reader = service
    })
    ctx.on('session/disposed', (session) => {
      this.cache.end(session.id)
    }, { global: true })
  }

  /**
   * Detail for one tree node.
   * @param sessionId - the session that owns the node. A child session is its own id.
   * @param nodeId - id from the trace index.
   * @returns the detail, or `{ missing: true }` when the session or node cannot be read.
   */
  @Remote
  async getNode(sessionId: string, nodeId: string): Promise<NodeDetail> {
    try {
      const loaded = await this.load(sessionId)
      if (loaded === undefined) return { missing: true }
      const found = findNode(loaded.state, nodeId)
      if (found === undefined) return { missing: true }
      const projections = hostSessions(this.ctx).messageProjections
      switch (found.kind) {
        case 'attempt':
          return this.cache.getOr(sessionId, `input:${found.node.inputSeq}`, () =>
            materializeAttempt(loaded.events, found.node, projections))
        case 'step': {
          const latest = found.node.attempts.at(-1)
          if (latest !== undefined) {
            return this.cache.getOr(sessionId, `input:${latest.inputSeq}`, () =>
              materializeAttempt(loaded.events, latest, projections))
          }
          const inputSeq = loaded.events.length
          return this.cache.getOr(sessionId, `input:${inputSeq}`, () =>
            materializeRunning(loaded.events, inputSeq, projections))
        }
        case 'tool':
          return this.cache.getOr(sessionId, `tool:${found.node.callSeq}`, () => toolDetail(loaded.events, found.node))
        case 'turn':
          return turnDetail(found.node)
        case 'unlinked':
          return unlinkedDetail(found.node)
        case 'sidecar':
          return await this.sidecarDetail(sessionId, loaded.events, found.node, projections)
        default:
          return { missing: true }
      }
    } catch {
      return { missing: true }
    }
  }

  private async sidecarDetail(
    sessionId: string,
    events: readonly SessionEvent[],
    node: SidecarNode,
    projections: readonly SessionMessageProjection[],
  ): Promise<NodeDetail> {
    const key = `side:${node.requestSeq}`
    const hit = this.cache.get<NodeDetail>(sessionId, key)
    if (hit !== undefined) return hit
    if (node.purpose === 'session-title') return this.cache.set(sessionId, key, titleDetail(events, node))
    if (node.purpose === 'web-search') return this.cache.set(sessionId, key, searchDetail(events, node))
    const instruction = await this.instruction(sessionId, events, node.requestSeq)
    return this.cache.set(sessionId, key, compactionDetail(events, node, projections, instruction))
  }

  private async instruction(sessionId: string, events: readonly SessionEvent[], requestSeq: number): Promise<InstructionRecord> {
    try {
      const lines = await this.supplement.lines(sessionId)
      return pairInstruction(lines, compactionOrdinal(events, requestSeq))
    } catch {
      return { recorded: false }
    }
  }

  private async load(sessionId: string): Promise<{ events: readonly SessionEvent[]; state: TrackState } | undefined> {
    const live = hostSessions(this.ctx).get(SessionId(sessionId))
    if (live !== undefined) {
      // The detail path has to replay a prefix. The index itself keeps no message bodies.
      const events = live.snapshotEvents()
      const state = this.ctx.sessionProjections.stateOf(live, 'track') ?? foldAll(events)
      return { events, state }
    }
    const reader = this.reader
    if (reader === undefined) return undefined
    let page: SessionPage | undefined
    try {
      page = await reader.open(sessionId, 'read')
      const read = await page.read(0)
      return { events: read.events, state: foldAll(read.events) }
    } catch {
      return undefined
    } finally {
      await page?.close().catch(() => undefined)
    }
  }
}

/** Host store. The client session service occupies the same Context key in this compilation. */
interface HostSessions {
  get(id: SessionId): Session | undefined
  readonly messageProjections: readonly SessionMessageProjection[]
}

function hostSessions(ctx: Context): HostSessions {
  return ctx.sessions as unknown as HostSessions
}

function isSupplementOptions(value: unknown): value is SupplementOptions {
  return value !== null && typeof value === 'object' && typeof (value as SupplementOptions).directory === 'function'
}

function toolDetail(events: readonly SessionEvent[], node: ToolNode): ToolDetail {
  const call = events.find(event => event.seq === node.callSeq)
  const result = node.resultSeq === undefined ? undefined : events.find(event => event.seq === node.resultSeq)
  const callData = call?.data !== null && typeof call?.data === 'object' ? call.data as Record<string, unknown> : undefined
  return {
    kind: 'tool',
    name: node.name,
    callId: node.callId,
    status: node.status,
    arguments: typeof callData?.arguments === 'string' ? callData.arguments : '',
    ...(result !== undefined ? { result: result.data } : {}),
    ...(node.childSessionId !== undefined ? { childSessionId: node.childSessionId } : {}),
    ...(node.childLabel !== undefined ? { childLabel: node.childLabel } : {}),
    ...(node.childMode !== undefined ? { childMode: node.childMode } : {}),
  }
}

function turnDetail(node: TurnNode): TurnDetail {
  return {
    kind: 'turn',
    turn: node.turn,
    status: node.status,
    ...(node.reason !== undefined ? { reason: node.reason } : {}),
    startSeq: node.startSeq,
    ...(node.endSeq !== undefined ? { endSeq: node.endSeq } : {}),
  }
}

function unlinkedDetail(node: UnlinkedNode): UnlinkedDetail {
  return {
    kind: 'unlinked',
    childSessionId: node.childSessionId,
    ...(node.childLabel !== undefined ? { childLabel: node.childLabel } : {}),
    ...(node.childMode !== undefined ? { childMode: node.childMode } : {}),
  }
}

function directoryOf(ctx: Context): string | undefined {
  try {
    const profile = (ctx as Context & { profileContext?: { dir?: string } }).profileContext?.dir
    if (typeof profile === 'string' && profile.length > 0) return join(profile, 'dsh-track')
  } catch {
    // profileContext is absent outside a profile launch.
  }
  const home = process.env.DSH_HOME
  if (home === undefined || home.length === 0) return undefined
  return join(home, 'profiles', process.env.DSH_PROFILE ?? 'default', 'dsh-track')
}
