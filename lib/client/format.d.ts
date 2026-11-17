/** Compact numbers keep a full decimal form for the tooltip and the clipboard. */
export interface ShownNumber {
    text: string;
    full: string;
    abbreviated: boolean;
}
export declare function abbreviate(value: number): ShownNumber;
export declare function formatDuration(ms: number): ShownNumber;
export declare function copyText(value: string): Promise<void>;
//# sourceMappingURL=format.d.ts.map