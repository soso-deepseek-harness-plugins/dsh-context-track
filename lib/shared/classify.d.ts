/**
 * Split one model window into token buckets.
 * Tool results are grouped by name. Their call count is the number of result messages.
 */
import { type PricedTool } from './estimate.js';
export type CategoryId = 'system' | 'user' | 'tools' | 'tool-results' | 'injection' | 'skill' | 'history';
export interface ClassifiedItem {
    category: CategoryId;
    tokens: number;
    role?: string;
    toolName?: string;
    message: unknown;
}
export interface ToolResultLine {
    name: string;
    tokens: number;
    calls: number;
}
export interface ClassifiedWindow {
    items: ClassifiedItem[];
    totals: Record<CategoryId, number>;
    tools: PricedTool[];
    definitionOverhead?: number;
    toolResults: ToolResultLine[];
    injections: ToolResultLine[];
    skills: ToolResultLine[];
    /** Catalog wrapper text and role overhead left after pricing each listed skill. */
    skillOverhead?: number;
    estimatedTotal: number;
}
/** Classify the messages and tool schemas one attempt actually saw. */
export declare function classifyWindow(messages: readonly unknown[], tools: unknown): ClassifiedWindow;
/** A short source label for an injection or skill row. Bodies stay out of the label. */
export declare function sourceLabel(message: unknown): string;
//# sourceMappingURL=classify.d.ts.map