/** Panel width, not the browser window, picks the arrangement. */
export const WIDE_MIN_PX = 960
export const COMPACT_MIN_PX = 640
export const DENSE_MAX_PX = 440

/** Wide and compact sit side by side; narrow and dense stack the tree and cover it with the detail. */
export type Tier = 'wide' | 'compact' | 'narrow' | 'dense'

/** Default share of the split that the tree keeps. */
export const DEFAULT_TREE_RATIO = 0.38
/** Tree and detail never shrink past these widths while the panel can still hold both. */
export const TREE_MIN_PX = 240
export const DETAIL_MIN_PX = 320

/**
 * Pick a tier from the trace panel's own width.
 * @param width - measured panel width in CSS pixels.
 * @returns the arrangement tier.
 */
export function layoutForWidth(width: number): Tier {
  if (width >= WIDE_MIN_PX) return 'wide'
  if (width >= COMPACT_MIN_PX) return 'compact'
  if (width >= DENSE_MAX_PX) return 'narrow'
  return 'dense'
}

/** Two columns share the panel in the wide and compact tiers. */
export function isSideBySide(tier: Tier): boolean {
  return tier === 'wide' || tier === 'compact'
}

/**
 * Clamp a tree ratio so neither column drops below its minimum.
 * A panel too narrow to hold both minimums keeps the tree at its minimum share.
 * @param ratio - desired tree fraction between 0 and 1.
 * @param width - measured split width in CSS pixels.
 * @returns the tree fraction to apply.
 */
export function clampTreeRatio(ratio: number, width: number): number {
  if (!Number.isFinite(width) || width <= 0) return DEFAULT_TREE_RATIO
  const lowest = width > TREE_MIN_PX + DETAIL_MIN_PX ? TREE_MIN_PX / width : DEFAULT_TREE_RATIO
  const highest = width > TREE_MIN_PX + DETAIL_MIN_PX ? 1 - DETAIL_MIN_PX / width : DEFAULT_TREE_RATIO
  return Math.min(Math.max(ratio, lowest), highest)
}

/** Fixed step for the separator's arrow keys, in CSS pixels. */
export const GRIP_STEP_PX = 24
