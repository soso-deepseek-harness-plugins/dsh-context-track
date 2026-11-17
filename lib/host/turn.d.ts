/**
 * One turn's bill, window, clocks, and event list.
 * The window is one attempt's prefix. The bill adds every reported attempt in the turn.
 */
import type { SessionEvent } from '@deepseek-ai/dsh-session';
import type { AttemptRef, StepNode, TurnNode } from '../shared/model.js';
import type { TurnReport } from '../shared/report.js';
export declare function selectAttempt(turn: TurnNode, attemptId: string | undefined): {
    attempt?: AttemptRef;
    step?: StepNode;
};
export declare function buildTurnReport(input: {
    events: readonly SessionEvent[];
    turn: TurnNode;
    attempt?: AttemptRef;
    messages: unknown;
    tools: unknown;
    readAt: number;
}): TurnReport;
//# sourceMappingURL=turn.d.ts.map