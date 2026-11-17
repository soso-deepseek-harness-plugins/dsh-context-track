import type { Context } from '@deepseek-ai/cordis';
import { type SessionEvent } from '@deepseek-ai/dsh-session';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { MissingDetail, NodeDetail } from '../shared/detail.js';
import type { TurnReport } from '../shared/report.js';
import { Supplement } from './supplement.js';
interface SessionPage {
    read(offset?: number): Promise<{
        events: readonly SessionEvent[];
    }>;
    close(): Promise<void>;
}
/** Optional host reader for sessions that are no longer live. */
export interface SessionLogReader {
    open(id: string, access: 'read'): Promise<SessionPage>;
}
/** One observation's detail cache. The same `inputSeq` is not folded twice. */
export declare class ObservationCache {
    private readonly values;
    get<T>(sessionId: string, key: string): T | undefined;
    set<T>(sessionId: string, key: string, value: T): T;
    getOr<T>(sessionId: string, key: string, produce: () => T): T;
    end(sessionId: string): void;
}
/** Host remote. Requires `sessionProjections` and `sessions`; persistence is optional. */
export declare class TrackRemote extends TypertRemoteService {
    static inject: string[];
    private reader;
    readonly cache: ObservationCache;
    readonly supplement: Supplement;
    constructor(ctx: Context, config?: unknown);
    /**
     * Bill, window, clocks, and event list for one turn.
     * An empty `attemptId` uses the last successful attempt, or the last attempt.
     * The same `inputSeq` reuses the prefix fold `getNode` already fills. That fold
     * is only the input. Output and status are read from the current attempt.
     */
    getTurn(sessionId: string, turnId: string, attemptId: string): Promise<TurnReport | MissingDetail>;
    /**
     * Detail for one tree node.
     * @param sessionId - the session that owns the node. A child session is its own id.
     * @param nodeId - id from the trace index.
     * @returns the detail, or `{ missing: true }` when the session or node cannot be read.
     */
    getNode(sessionId: string, nodeId: string): Promise<NodeDetail>;
    private sidecarDetail;
    private instruction;
    /** Fold of `seq < inputSeq`. Stable for an append-only log, so it can be reused. */
    private prefixAt;
    /**
     * A step with no assistant event yet.
     * Keyed by the step and the log length: the next assistant event uses that
     * same seq as its input and must not inherit this running snapshot, and two
     * running steps share the window but not the added-context boundary.
     */
    private runningDetail;
    /** Status and output come from the attempt as it stands now. A later retry must not see the first snapshot. */
    private attemptDetail;
    private load;
}
export {};
//# sourceMappingURL=remote.d.ts.map