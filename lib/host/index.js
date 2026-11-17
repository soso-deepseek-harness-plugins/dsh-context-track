import { z } from 'zod';
import { TRACK_STATE_VERSION, emptyTrack } from '../shared/model.js';
import '../shared/projection.js';
import { applyTrack } from './fold.js';
import { listenLlmStream } from './supplement.js';
import { TrackRemote } from './remote.js';
export const name = 'dsh-context-track';
export const inject = ['sessionProjections', 'sessions'];
function isTrackState(value) {
    if (value === null || typeof value !== 'object')
        return false;
    const state = value;
    return state.stateVersion === TRACK_STATE_VERSION && Array.isArray(state.root);
}
const trackStateSchema = z.custom(isTrackState);
export const trackProjection = {
    key: 'track',
    stateSchema: trackStateSchema,
    init() {
        return emptyTrack();
    },
    apply(state, event) {
        return applyTrack(state, event);
    },
    wire: {
        viewSchema: trackStateSchema,
        view(state) {
            return state;
        },
    },
    stateVersion: TRACK_STATE_VERSION,
};
/**
 * Mount the projection, the sidecar listener, and the remote.
 * A missing required service keeps the plugin from activating; Cordis waits on `inject`.
 * @param ctx - host context.
 * @param config - ignored. The service key is fixed.
 */
export function apply(ctx, config) {
    ctx.sessionProjections.register(trackProjection);
    const remote = new TrackRemote(ctx, config);
    ctx.on('llm/stream', (options, next) => listenLlmStream(options, next, remote.supplement));
    return remote;
}
export default class TrackPlugin {
    static inject = inject;
    remote;
    constructor(ctx, config) {
        this.remote = apply(ctx, config);
    }
}
//# sourceMappingURL=index.js.map