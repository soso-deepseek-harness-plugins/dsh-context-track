/**
 * Context-trace console. The conversation tab and the right sidebar are both
 * session-scoped. The left-sidebar centre page follows the session the shell
 * retains for the main view. Detail reads committed logs. It does not
 * subscribe to the token stream.
 *
 * The panel is a shell: a header, a horizontal round strip, a collapsible
 * context band, and a tree beside a detail pane. Narrow panels keep the tree
 * full width and slide the detail over it.
 */
import { type ReactNode } from 'react';
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol';
import { type MissingDetail, type NodeDetail } from '../shared/detail.js';
import '../shared/projection.js';
import type { TurnReport } from '../shared/report.js';
import './slots.js';
export interface TrackInject {
    getNode(sessionId: string, nodeId: string): Promise<RemoteResult<NodeDetail>>;
    getTurn?(sessionId: string, turnId: string, attemptId: string): Promise<RemoteResult<TurnReport | MissingDetail>>;
}
type SessionView = PropsRuntime<'conversation.view'>;
export type TracePageProps = Omit<Pick<SessionView, 'sessionId' | 'useSessions'>, 'sessionId'> & PropsLocale<'dsh-context-track'> & TrackInject & {
    /** Absent on the centre page until the shell retains a session. */
    sessionId?: string;
    /** `main` is the centre column opened from the left sidebar. */
    host?: 'main';
};
/**
 * Centre-column page for the left-sidebar row. The row's panel has no session
 * binding, so the console follows the retained main session.
 */
export declare function TraceMain(props: Omit<TracePageProps, 'sessionId' | 'host'>): ReactNode;
/** Header, round strip, context band, and the selected turn's tree and detail. */
export declare function TracePage({ sessionId, useSessions, t, getNode, getTurn, host }: TracePageProps): ReactNode;
export {};
//# sourceMappingURL=TracePage.d.ts.map