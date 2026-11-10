/** Glyph shared by the conversation tab, the sidebars, and the tab chip. */
import type { ReactNode } from 'react'
import type { TrackKey } from './locales.js'

/**
 * Draw a small tree mark.
 * @param props - edge length and an optional class from the guide capsule.
 * @returns the icon.
 */
export function TraceIcon({ size = 16, className }: { size?: number; className?: string }): ReactNode {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 5h4v4H6zM14 10h4v4h-4zM6 15h4v4H6z" />
        <path d="M10 7h2a2 2 0 0 1 2 2v3M10 17h2a2 2 0 0 0 2-2v-3" />
      </g>
    </svg>
  )
}

/**
 * Chip title: the glyph before the panel name.
 * @param props - locale seat. The registration sets the plugin namespace.
 * @returns the chip contents.
 */
export function TraceTabTitle({ t }: { t: (key: TrackKey) => string }): ReactNode {
  return (
    <>
      <TraceIcon size={16} />
      {t('panel')}
    </>
  )
}

export type NodeGlyphKind = 'turn' | 'step' | 'attempt' | 'tool' | 'child' | 'sidecar' | 'unlinked'

/** One 14px monochrome glyph per node kind. Inline so no icon package ships with the client. */
export function NodeGlyph({ kind }: { kind: NodeGlyphKind }): ReactNode {
  return (
    <svg className="dsh-context-track-glyph" width={14} height={14} viewBox="0 0 16 16" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {paths(kind)}
      </g>
    </svg>
  )
}

function paths(kind: NodeGlyphKind): ReactNode {
  switch (kind) {
    case 'turn':
      return <><circle cx="8" cy="8" r="4.6" /><circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none" /></>
    case 'step':
      return <path d="M8 2.8 13.2 8 8 13.2 2.8 8z" />
    case 'attempt':
      return <path d="M8.8 2.2 4.2 8.9h3.1l-1 4.9 4.6-6.7H7.8z" />
    case 'tool':
      return <path d="M10.6 2.9a3.2 3.2 0 0 0-4 4l-3.2 3.2a1.6 1.6 0 0 0 2.3 2.3l3.2-3.2a3.2 3.2 0 0 0 4-4l-2 2-1.9-.4-.4-1.9z" />
    case 'child':
      return <><path d="M4 3v10" /><path d="M4 8h4.2a2.4 2.4 0 0 0 2.4-2.4V3.4" /><path d="M4 12h4.2a2.4 2.4 0 0 1 2.4 2.4v.2" /></>
    case 'sidecar':
      return <><path d="M2.6 4.4h5l1.4 1.6h4.4v6.2H2.6z" /><path d="M5 8.6h6" /></>
    case 'unlinked':
      return <><path d="M6.2 9.8 9.8 6.2" /><path d="M5.4 11.4 4 12.8a2.3 2.3 0 0 1-3.2-3.2l1.4-1.4" /><path d="M10.6 4.6 12 3.2a2.3 2.3 0 0 1 3.2 3.2l-1.4 1.4" /></>
  }
}
