/**
 * Replay the log prefix a model call actually saw.
 * `inputSeq` is exclusive: events with `seq < inputSeq` are the input.
 */
import type { AssistantStreamRecord } from '@deepseek-ai/dsh-llm';
import type { SessionEvent, SessionMessageProjection } from '@deepseek-ai/dsh-session';
import type { AttemptDetail, StepRunningDetail } from '../shared/detail.js';
import type { AttemptRef } from '../shared/model.js';
export interface MaterializeResult {
    messages: unknown;
    /** Log seq of each message in `messages`, in the same order. */
    messageSeqs: number[];
    tools: unknown;
    toolHistory: unknown;
    config: unknown;
    adapterDefaults?: unknown;
    context?: unknown;
}
/** Client-facing prefix fields. `messageSeqs` stays host-side and never reaches a detail. */
export type MaterializedInput = Omit<MaterializeResult, 'messageSeqs'>;
export declare function inputFields(prefix: MaterializeResult): MaterializedInput;
/** Fold `seq < inputSeq` into the messages, tools, and header that call saw. */
export declare function materializePrefix(events: readonly SessionEvent[], inputSeq: number, projections: readonly SessionMessageProjection[]): MaterializeResult;
/** Detail of one settled attempt, including timing taken from the compact stream already on the event. */
export declare function materializeAttempt(events: readonly SessionEvent[], attempt: AttemptRef, projections: readonly SessionMessageProjection[]): AttemptDetail;
/**
 * Output, usage, and timing for one attempt.
 * `prefix` is the fold of `seq < attempt.inputSeq` and can be cached on its own.
 * The attempt's status and output are not part of that fold: a running snapshot
 * of the same seq must not be reused as this detail.
 */
export declare function withAttemptOutput(events: readonly SessionEvent[], attempt: AttemptRef, prefix: MaterializeResult, newFrom?: number): AttemptDetail;
/** A step that has not produced an assistant event yet. The prefix is everything already committed. */
export declare function materializeRunning(events: readonly SessionEvent[], inputSeq: number, projections: readonly SessionMessageProjection[], newFrom?: number): StepRunningDetail;
/** First token from the stream helper; duration is the compact stream's last time minus its start. */
export declare function streamTiming(stream: readonly AssistantStreamRecord[]): {
    firstTokenTime?: number;
    streamDuration?: number;
};
//# sourceMappingURL=materialize.d.ts.map