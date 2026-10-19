/**
 * Client-visible projection key. Importing this module merges `track` into the
 * session-projection tables. The value is the index: sequence numbers and scalars.
 */
import type { TrackState } from './model.js'

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionStateMap {
    track: TrackState
  }
  interface SessionProjectionMap {
    track: TrackState
  }
}

export type { TrackState }
