/**
 * Host plugin: fold the trace index, enqueue compaction instructions, and serve `getNode`.
 * The plugin stays inactive unless `sessionProjections` and `sessions` are both present.
 */
import type { Context } from '@deepseek-ai/cordis';
import { z } from 'zod';
import { type TrackState } from '../shared/model.js';
import '../shared/projection.js';
import { TrackRemote } from './remote.js';
export declare const name = "dsh-context-track";
export declare const inject: readonly ["sessionProjections", "sessions"];
export declare const trackProjection: {
    key: "track";
    stateSchema: z.ZodType<TrackState, unknown, z.core.$ZodTypeInternals<TrackState, unknown>>;
    init(): TrackState;
    apply(state: NoInfer<TrackState>, event: import("@deepseek-ai/dsh-session").SessionEvent): TrackState;
    wire: {
        viewSchema: z.ZodType<TrackState, unknown, z.core.$ZodTypeInternals<TrackState, unknown>>;
        view(state: NoInfer<TrackState>): TrackState;
    };
    stateVersion: 4;
};
/**
 * Mount the projection, the sidecar listener, and the remote.
 * A missing required service keeps the plugin from activating; Cordis waits on `inject`.
 * @param ctx - host context.
 * @param config - ignored. The service key is fixed.
 */
export declare function apply(ctx: Context, config?: unknown): TrackRemote;
export default class TrackPlugin {
    static inject: readonly ["sessionProjections", "sessions"];
    private readonly remote;
    constructor(ctx: Context, config?: unknown);
}
//# sourceMappingURL=index.d.ts.map