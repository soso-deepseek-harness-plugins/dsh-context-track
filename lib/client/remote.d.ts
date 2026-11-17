/**
 * Client face of the host `track` remote. Methods return promises.
 * The web profile does not pre-mount third-party namespaces, so the client
 * contribution below is what creates `remote.track`.
 */
import type { RemoteResult, TypertRemoteContribution, TypertRemoteNamespace } from '@deepseek-ai/dsh-typert-protocol';
import type { MissingDetail, NodeDetail } from '../shared/detail.js';
import type { TurnReport } from '../shared/report.js';
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface TypertRemoteMap {
        'track/getNode'(sessionId: string, nodeId: string, signal?: AbortSignal): Promise<RemoteResult<NodeDetail>>;
        'track/getTurn'(sessionId: string, turnId: string, attemptId: string, signal?: AbortSignal): Promise<RemoteResult<TurnReport | MissingDetail>>;
    }
    interface TypertRemoteNamespaceMap {
        track: TypertRemoteNamespace<'track'>;
    }
}
/** Mount this before reading `ctx.remote.track`. Nothing else publishes the namespace. */
export declare const trackRemote: TypertRemoteContribution;
export type { NodeDetail };
//# sourceMappingURL=remote.d.ts.map