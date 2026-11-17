/** Glyph shared by the conversation tab, the sidebars, and the tab chip. */
import type { ReactNode } from 'react';
import type { TrackKey } from './locales.js';
/**
 * Draw a small tree mark.
 * @param props - edge length and an optional class from the guide capsule.
 * @returns the icon.
 */
export declare function TraceIcon({ size, className }: {
    size?: number;
    className?: string;
}): ReactNode;
/**
 * Chip title: the glyph before the panel name.
 * @param props - locale seat. The registration sets the plugin namespace.
 * @returns the chip contents.
 */
export declare function TraceTabTitle({ t }: {
    t: (key: TrackKey) => string;
}): ReactNode;
/**
 * Stacked composition bars. The header disclosure uses it to look like a
 * control instead of a caption, and to echo the make-up bar inside the band.
 * @returns the icon.
 */
export declare function BandIcon(): ReactNode;
export type NodeGlyphKind = 'turn' | 'step' | 'attempt' | 'tool' | 'child' | 'sidecar' | 'unlinked';
/** One 14px monochrome glyph per node kind. Inline so no icon package ships with the client. */
export declare function NodeGlyph({ kind }: {
    kind: NodeGlyphKind;
}): ReactNode;
//# sourceMappingURL=Icon.d.ts.map