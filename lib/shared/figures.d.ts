/**
 * Quantities shown in the console. `usage` is an exact model or clock figure,
 * `estimated` is the fixed-density heuristic, and `absent` is not a zero.
 */
import type { TokenUsageScalars } from './model.js';
export type FigureBasis = 'usage' | 'estimated' | 'absent';
export interface Figure {
    basis: FigureBasis;
    /** Omitted when the figure is absent. Zero is a real measurement. */
    value?: number;
}
/** Read a model usage object. Anything without both input and output counts is ignored. */
export declare function parseUsage(value: unknown): TokenUsageScalars | undefined;
export declare function usageFigure(value: number): Figure;
export declare function estimatedFigure(value: number): Figure;
export declare function absentFigure(): Figure;
export interface UsageBill {
    input: Figure;
    output: Figure;
    total: Figure;
    reasoning: Figure;
    cacheRead: Figure;
    cacheWrite: Figure;
}
/** One call's bill. Reasoning is reported beside output and is not added again. */
export declare function billOf(usage: TokenUsageScalars | undefined): UsageBill;
/**
 * Cache reads divided by billed input, truncated to two decimal percent points.
 * Unreported cache fields count as 0. A billed input that is not positive is absent.
 * Callers sum the attempts first; this does not average percents.
 */
export declare function cacheHitRate(usages: readonly TokenUsageScalars[]): Figure;
/** Sum reported calls. A call without `totalTokens` makes the sum fall back to input plus output. */
export declare function sumUsage(usages: readonly TokenUsageScalars[]): TokenUsageScalars | undefined;
/** Exact input minus the unscaled estimate. Both have to be present. Zero means they agree. */
export declare function estimateDelta(exactInput: Figure, estimated: Figure): {
    delta: Figure;
    consistent: boolean;
} | undefined;
/** Sum the attempts stored on a session index. Child sessions are totaled on their own. */
export declare function sessionUsage(root: readonly {
    kind: string;
    items?: readonly unknown[];
}[]): Figure;
/** `66.66` renders as `66.66%` without rounding up. */
export declare function formatHitPercent(value: number): string;
//# sourceMappingURL=figures.d.ts.map