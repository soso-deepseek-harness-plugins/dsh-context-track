/**
 * Sidecar details are read from the session events that already recorded the call.
 * The compaction instruction is the only field that does not come from the log.
 */
import type { SessionEvent, SessionMessageProjection } from '@deepseek-ai/dsh-session';
import type { CompactionDetail, InstructionRecord, SearchDetail, TitleDetail } from '../shared/detail.js';
import type { SidecarNode } from '../shared/model.js';
export declare function titleDetail(events: readonly SessionEvent[], node: SidecarNode): TitleDetail;
/** Title text from a registered provider between this request and the next title request. */
export declare function adoptedTitle(events: readonly SessionEvent[], requestSeq: number): string | undefined;
export declare function compactionDetail(events: readonly SessionEvent[], node: SidecarNode, projections: readonly SessionMessageProjection[], instruction: InstructionRecord): CompactionDetail;
/** Zero-based position of this compaction among the session's compaction sidecars. */
export declare function compactionOrdinal(events: readonly SessionEvent[], requestSeq: number): number;
export declare function searchDetail(events: readonly SessionEvent[], node: SidecarNode): SearchDetail;
//# sourceMappingURL=sidecar.d.ts.map