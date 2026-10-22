/**
 * Host plugin: fold the trace index, enqueue compaction instructions, and serve `getNode`.
 * The plugin stays inactive unless `sessionProjections` and `sessions` are both present.
 */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-llm'
import type { ProjectionDefinition } from '@deepseek-ai/dsh-session-projection'
import { z } from 'zod'
import { TRACK_STATE_VERSION, emptyTrack, type TrackState } from '../shared/model.js'
import '../shared/projection.js'
import { applyTrack } from './fold.js'
import { listenLlmStream } from './supplement.js'
import { TrackRemote } from './remote.js'

export const name = 'dsh-context-track'

export const inject = ['sessionProjections', 'sessions'] as const

function isTrackState(value: unknown): value is TrackState {
  if (value === null || typeof value !== 'object') return false
  const state = value as TrackState
  return state.stateVersion === TRACK_STATE_VERSION && Array.isArray(state.root)
}

const trackStateSchema: z.ZodType<TrackState> = z.custom<TrackState>(isTrackState)

export const trackProjection = {
  key: 'track' as const,
  stateSchema: trackStateSchema,
  init() {
    return emptyTrack()
  },
  apply(state, event) {
    return applyTrack(state, event)
  },
  wire: {
    viewSchema: trackStateSchema,
    view(state) {
      return state
    },
  },
  stateVersion: TRACK_STATE_VERSION,
} satisfies ProjectionDefinition<'track'>

/**
 * Mount the projection, the sidecar listener, and the remote.
 * A missing required service keeps the plugin from activating; Cordis waits on `inject`.
 * @param ctx - host context.
 * @param config - ignored. The service key is fixed.
 */
export function apply(ctx: Context, config?: unknown): TrackRemote {
  ctx.sessionProjections.register(trackProjection)
  const remote = new TrackRemote(ctx, config)
  ctx.on('llm/stream', (options, next) => listenLlmStream(options, next, remote.supplement))
  return remote
}

export default class TrackPlugin {
  static inject = inject
  private readonly remote: TrackRemote

  constructor(ctx: Context, config?: unknown) {
    this.remote = apply(ctx, config)
  }
}
