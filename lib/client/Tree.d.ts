/** Call tree. Each row is the hierarchy. Expansion stays in the parent. */
import type { ReactNode } from 'react';
import { type Figure } from '../shared/figures.js';
import { type NodeStatus, type TrackState } from '../shared/model.js';
import type { EventKind } from '../shared/report.js';
import type { TrackKey } from './locales.js';
export interface TreeCursor {
    sessionId: string;
    nodeId: string;
    key: string;
    kind: 'turn' | 'step' | 'attempt' | 'tool' | 'sidecar' | 'unlinked';
    status: NodeStatus;
    expandable: boolean;
    /** Node the inspector opens. A step opens its latest attempt. */
    activateId: string;
    attemptId?: string;
}
export interface TreeProps {
    sessionId: string;
    track: TrackState | undefined;
    trackOf: (sessionId: string) => TrackState | undefined;
    open: Readonly<Record<string, boolean>>;
    onToggle: (key: string, kind: string, status: NodeStatus) => void;
    selected: {
        sessionId: string;
        nodeId: string;
    } | undefined;
    /** The whole cursor, so the parent can key a round's remembered row off the same row. */
    onSelect: (cursor: TreeCursor) => void;
    t: (key: TrackKey) => string;
    now?: number;
    /** When set, rows that are not this kind drop out of the tree. Turns stay. */
    filter?: EventKind;
    /** Compaction numbers for one turn. Other turns keep the plain sidecar label. */
    turnBill?: {
        turnId: string;
        reclaimed?: Figure;
        cost: Figure;
    };
    parentTurnId?: string;
    /** Nesting depth. Indent applies only inside the label cluster. */
    depth?: number;
    /** Expand or collapse every row in this session tree. */
    onBulk?: (expand: boolean, keys: readonly string[]) => void;
}
/** Render one session's index, nesting a child session's own index under its tool. */
export declare function Tree(props: TreeProps): ReactNode;
/** Every expandable key in a session tree, whether or not it is open now. */
export declare function collectKeys(sessionId: string, track: TrackState | undefined, trackOf: (sessionId: string) => TrackState | undefined): string[];
/** Kind filter for the tree. Turns always stay so the rail of the loop is still there. */
export declare function rowVisible(kind: string, purpose: string | undefined, filter: EventKind | undefined): boolean;
/** Visible rows in paint order. Keyboard moves through this list. */
export declare function visibleTargets(sessionId: string, track: TrackState | undefined, open: Readonly<Record<string, boolean>>, trackOf: (sessionId: string) => TrackState | undefined, filter?: EventKind): TreeCursor[];
//# sourceMappingURL=Tree.d.ts.map