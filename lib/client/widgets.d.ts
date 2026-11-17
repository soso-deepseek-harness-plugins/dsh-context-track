/** Shared number, badge, and category labels. */
import type { ReactNode } from 'react';
import type { CategoryId } from '../shared/classify.js';
import { type Figure } from '../shared/figures.js';
import { type ShownNumber } from './format.js';
import type { TrackKey } from './locales.js';
export declare const CATEGORY_KEY: Record<CategoryId, TrackKey>;
export declare function FigureView({ figure, t, pending, unseen, showBasis, format, }: {
    figure: Figure;
    t: (key: TrackKey) => string;
    pending?: boolean;
    unseen?: boolean;
    /** The consumption basis is written once, on the turn total. Tool rows leave it off. */
    showBasis?: boolean;
    format?: (value: number) => ShownNumber;
}): ReactNode;
/**
 * Prompt caching reads as good news when it is high, so the tone tracks the
 * percentage rather than one fixed accent. The pill carries its own color and
 * tint so the number reads at a glance from the header.
 */
export declare function hitTone(figure: Figure): 'high' | 'mid' | 'low' | 'absent';
export declare function HitRateBadge({ figure, t, stat }: {
    figure: Figure;
    t: (key: TrackKey) => string;
    /** Set where the host test or a layout rule hooks onto the band figures. */
    stat?: string;
}): ReactNode;
//# sourceMappingURL=widgets.d.ts.map