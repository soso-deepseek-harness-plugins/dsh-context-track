/**
 * Context events inside one turn. Unrecognized events are skipped.
 * Labels and token counts only — message bodies are not copied out.
 */
import type { SessionEvent } from '@deepseek-ai/dsh-session';
import type { TurnNode } from '../shared/model.js';
import type { ContextEvent } from '../shared/report.js';
export declare function summarizeTurnEvents(events: readonly SessionEvent[], turn: TurnNode, windowSeq: number | undefined): ContextEvent[];
//# sourceMappingURL=events.d.ts.map