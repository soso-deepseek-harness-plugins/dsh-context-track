/**
 * Wait, think, and first-response clocks.
 * Wait ends when the output stream starts. Think is the reasoning inside that stream.
 * First response is one span per user input, from the moment waiting began to the
 * first thing the user can see. Later tool-only calls do not add another span.
 */
import { type Figure } from './figures.js';
export interface StreamMetrics {
    streamStart?: number;
    thinkMs: number;
    hasReasoning: boolean;
    firstVisible?: number;
}
/** Read clocks off a compact stream. The text itself is not retained. */
export declare function streamMetrics(stream: readonly unknown[]): StreamMetrics;
/** Stream start minus the step start. Missing when the stream has not started. */
export declare function waitMs(stepStart: number | undefined, streamStart: number | undefined): number | undefined;
export interface FirstResponse {
    opening: boolean;
    noUserMessage: boolean;
    seq: number;
    start: number;
    end?: number;
    duration: Figure;
}
/**
 * One first-response per user input.
 * The opening input starts at `turn/start`, not at the user message.
 * A later `source.kind === 'user'` message starts at that message's time.
 */
export declare function firstResponses(input: {
    startTime: number | undefined;
    startSeq: number;
    userInputs: readonly {
        seq: number;
        time: number;
    }[];
    visibles: readonly number[];
}): FirstResponse[];
export interface ToolInterval {
    start: number;
    end: number;
}
/** Parallel tools share one wall clock. Union is the merged span; sum is each span added. */
export declare function toolClock(intervals: readonly ToolInterval[]): {
    union: number;
    sum: number;
};
/** Bar box on a shared turn clock. Later intervals sit further right. */
export declare function barGeometry(start: number, end: number, origin: number, span: number): {
    left: number;
    width: number;
};
//# sourceMappingURL=timing.d.ts.map