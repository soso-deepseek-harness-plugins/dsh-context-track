/**
 * Pure fold: one committed session event advances the trace index.
 * Unknown events return the same state reference. The index stores sequence
 * numbers and scalars, never message bodies, tool schemas, summaries, or search bodies.
 */
import type { SessionEvent } from '@deepseek-ai/dsh-session';
import { type SidecarPurpose, type TrackState } from '../shared/model.js';
/** Fold one event. A throw leaves the previous state in place so session append continues. */
export declare function applyTrack(state: TrackState, event: SessionEvent): TrackState;
/** Fold a whole log from an empty index. */
export declare function foldAll(events: readonly SessionEvent[]): TrackState;
export declare function fold(state: TrackState, event: SessionEvent): TrackState;
export type { SidecarPurpose };
//# sourceMappingURL=fold.d.ts.map