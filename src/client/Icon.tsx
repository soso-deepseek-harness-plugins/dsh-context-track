/** Glyph shared by the conversation tab, the right-sidebar guide, and the tab chip. */
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
