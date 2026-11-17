/** Reading view of one node, or the same node as JSON. The call result sits after the input. */
import { type ReactNode, type RefObject } from 'react';
import { type CategoryId } from '../shared/classify.js';
import { type NodeDetail } from '../shared/detail.js';
import type { TrackKey } from './locales.js';
export interface DetailProps {
    detail: NodeDetail | undefined;
    nodeKey: string;
    t: (key: TrackKey) => string;
    scrollerRef: RefObject<HTMLElement | null>;
    onOpenChild?: () => void;
    /** Trail from the round to the open node. Each entry that carries an id is clickable. */
    crumbs?: readonly {
        id?: string;
        label: string;
    }[];
    onCrumb?: (nodeId: string) => void;
    onClose?: () => void;
    /** Narrow tiers offer a return control instead of a collapse control. */
    onBack?: () => void;
    /** Category the summary band jumped to. The first matching card scrolls into view. */
    focusCategory?: CategoryId;
}
/** One node. A visited view stays mounted, so its folds and scroll survive the round trip. */
export declare function Detail({ detail, nodeKey, t, scrollerRef, onOpenChild, crumbs, onCrumb, onClose, onBack, focusCategory, }: DetailProps): ReactNode;
//# sourceMappingURL=Detail.d.ts.map