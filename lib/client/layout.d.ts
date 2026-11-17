/** Panel width, not the browser window, picks the arrangement. */
export declare const WIDE_MIN_PX = 960;
export declare const COMPACT_MIN_PX = 640;
export declare const DENSE_MAX_PX = 440;
/** Wide and compact sit side by side; narrow and dense stack the tree and cover it with the detail. */
export type Tier = 'wide' | 'compact' | 'narrow' | 'dense';
/** Default share of the split that the tree keeps. */
export declare const DEFAULT_TREE_RATIO = 0.38;
/** Tree and detail never shrink past these widths while the panel can still hold both. */
export declare const TREE_MIN_PX = 240;
export declare const DETAIL_MIN_PX = 320;
/**
 * Pick a tier from the trace panel's own width.
 * @param width - measured panel width in CSS pixels.
 * @returns the arrangement tier.
 */
export declare function layoutForWidth(width: number): Tier;
/** Two columns share the panel in the wide and compact tiers. */
export declare function isSideBySide(tier: Tier): boolean;
/**
 * Clamp a tree ratio so neither column drops below its minimum.
 * A panel too narrow to hold both minimums keeps the tree at its minimum share.
 * @param ratio - desired tree fraction between 0 and 1.
 * @param width - measured split width in CSS pixels.
 * @returns the tree fraction to apply.
 */
export declare function clampTreeRatio(ratio: number, width: number): number;
/** Fixed step for the separator's arrow keys, in CSS pixels. */
export declare const GRIP_STEP_PX = 24;
//# sourceMappingURL=layout.d.ts.map