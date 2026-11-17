import type { SessionEvent } from '@deepseek-ai/dsh-session';
export interface ToolHistoryFold {
    apply(event: SessionEvent): void;
    snapshot(): unknown;
}
export declare const ToolHistoryProjection: new () => ToolHistoryFold;
//# sourceMappingURL=tool-history.d.ts.map