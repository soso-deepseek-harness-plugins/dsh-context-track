export interface CompactionLine {
    purpose: 'compaction';
    text: string;
}
export interface StreamCall {
    purpose?: string;
    sessionId?: string;
    messages?: readonly {
        content?: readonly {
            type?: string;
            text?: string;
        }[];
    }[];
}
export interface SupplementOptions {
    /** This plugin's directory under the profile, or undefined when the host has no profile yet. */
    directory: () => string | undefined;
    maxPending?: number;
    appendFile?: (path: string, data: string) => Promise<void>;
    readFile?: (path: string) => Promise<string>;
    mkdir?: (path: string) => Promise<void>;
}
/** In-memory queue plus a JSONL file per session. */
export declare class Supplement {
    private readonly options;
    readonly dropped: {
        count: number;
    };
    readonly failed: {
        count: number;
    };
    private readonly sessions;
    private readonly maxPending;
    private timer;
    private writing;
    constructor(options: SupplementOptions);
    /**
     * Queue a compaction instruction. Returns immediately. A full queue drops the line and counts it.
     * @param sessionId - session whose JSONL receives the line.
     * @param line - purpose and the trailing instruction text.
     */
    enqueue(sessionId: string, line: CompactionLine): void;
    /** Lines in compaction order: the file, then anything still queued. */
    lines(sessionId: string): Promise<readonly CompactionLine[]>;
    /** Flush pending lines. Tests await this; the model listener does not. */
    flush(): Promise<void>;
    private failBatch;
    private buffer;
    private schedule;
    private ensureLoaded;
    private readExisting;
}
export declare function parseLines(text: string): CompactionLine[];
/**
 * The instruction is the last message when that message is one text block of at most 4KB.
 * Earlier messages are not read. Other purposes record nothing.
 */
export declare function captureCompactionInstruction(call: StreamCall): CompactionLine | undefined;
/**
 * Listen on `llm/stream` only to enqueue. The original stream is returned unchanged.
 * @param call - the model request.
 * @param next - the waterfall continuation.
 * @param supplement - the session's short-record queue.
 * @returns whatever `next()` returns.
 */
export declare function listenLlmStream<T>(call: StreamCall, next: () => T, supplement: Supplement): T;
export declare function pairInstruction(lines: readonly CompactionLine[], ordinal: number): {
    recorded: false;
} | {
    recorded: true;
    text: string;
};
//# sourceMappingURL=supplement.d.ts.map