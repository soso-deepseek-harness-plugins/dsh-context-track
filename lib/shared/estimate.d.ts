/**
 * Fixed-density token heuristic.
 * About four characters make one token. Ordinary blocks add 4. A role adds 4.
 * System prompts skip the per-block add. Images with a size use a patch grid.
 */
/** Content price of one text block, including the block overhead. `abcd` is 5. */
export declare function contentPrice(text: string): number;
/** Bare character tokens for one fragment, without block or role overhead. */
export declare function textTokens(text: string): number;
/** System prompt price: character tokens plus the role, and no per-block overhead. */
export declare function estimateSystemText(text: string): number;
export interface SizedImage {
    width: number;
    height: number;
}
/**
 * LLM tokens for one image after the official resize.
 * `[IMAGE_START] + ([IMAGE] * width + newline) * height + [IMAGE_END]`, capped at 1024.
 */
export declare function imagePatchTokens(width: number, height: number): number;
export declare function imageSize(block: unknown): SizedImage | undefined;
/** An assistant placeholder with no content is free. It does not pay the role overhead. */
export declare function isEmptyAssistant(message: unknown): boolean;
export declare function isNonEmptySystem(message: unknown): boolean;
/** Price one message. System messages skip the per-block overhead. */
export declare function estimateMessage(message: unknown, system?: boolean): number;
export interface PricedTool {
    name: string;
    tokens: number;
    definition: unknown;
}
export interface PricedTools {
    table: number;
    tools: PricedTool[];
    /** Present only when the table costs more than the tools combined. */
    overhead?: number;
}
/** Whole tool table, each tool, and the wrapper gap when the table is more expensive. */
export declare function estimateTools(tools: unknown): PricedTools;
//# sourceMappingURL=estimate.d.ts.map