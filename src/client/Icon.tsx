/** Sidebar glyph for the Trace panel. The sidebar owns the button around it. */
import type { ReactNode } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'

/**
 * Draw a small tree mark at the size the sidebar requests.
 * @param props - requested edge length.
 * @returns the icon.
 */
export function TraceIcon({ size }: PropsRuntime<'sidebar.panellist'>): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 5h4v4H6zM14 10h4v4h-4zM6 15h4v4H6z" />
        <path d="M10 7h2a2 2 0 0 1 2 2v3M10 17h2a2 2 0 0 0 2-2v-3" />
      </g>
    </svg>
  )
}
