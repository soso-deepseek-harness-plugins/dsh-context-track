/**
 * Context summary band. Collapsed it is one line: a stacked make-up bar, a
 * legend, and the expand control. Expanded it is a grid of make-up, timing,
 * and sidecars that scrolls on its own.
 */
import { type ReactNode } from 'react';
import type { CategoryId } from '../shared/classify.js';
import { type Figure } from '../shared/figures.js';
import type { TrackState } from '../shared/model.js';
import type { ContextEvent, TurnReport } from '../shared/report.js';
import type { TrackKey } from './locales.js';
export declare function composeRows<T extends {
    id: CategoryId;
    tokens: number;
}>(categories: readonly T[]): T[];
export declare function reclaimedOf(events: readonly ContextEvent[]): Figure | undefined;
export declare function compactionPresent(report: TurnReport): boolean;
export declare function titlePresent(report: TurnReport): boolean;
export declare function ContextBand({ report, open, activeSeq, titleName, trackOf, t, onCategory, onGap, }: {
    report: TurnReport;
    open: boolean;
    activeSeq?: number;
    /** Adopted session name, read from the title sidecar when the log already has one. */
    titleName?: string;
    trackOf: (sessionId: string) => TrackState | undefined;
    t: (key: TrackKey) => string;
    onCategory: (id: CategoryId) => void;
    onGap: (seq: number) => void;
}): ReactNode;
//# sourceMappingURL=TokenCard.d.ts.map