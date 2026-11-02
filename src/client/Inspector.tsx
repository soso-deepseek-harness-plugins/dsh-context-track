/** Largest tool definitions. The bill and the attempt inspector share this list. */
import { useState, type ReactNode } from 'react'
import type { TrackKey } from './locales.js'
import { FigureView } from './widgets.js'

export const TOOL_PREVIEW = 5

/** Largest tool definitions first. The rest collapse to a count. Search applies before the cut. */
export function ToolList({
  tools,
  overhead,
  t,
  searchable = false,
}: {
  tools: readonly { name: string; tokens: number }[]
  overhead?: number
  t: (key: TrackKey) => string
  searchable?: boolean
}): ReactNode {
  const [query, setQuery] = useState('')
  const [bySize, setBySize] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const filtered = tools.filter(tool => tool.name.toLowerCase().includes(query.trim().toLowerCase()))
  const ordered = bySize ? [...filtered].sort((left, right) => right.tokens - left.tokens || left.name.localeCompare(right.name)) : filtered
  const shown = showAll ? ordered : ordered.slice(0, TOOL_PREVIEW)
  const rest = ordered.length - shown.length
  return (
    <section data-category="tools" className="dsh-context-track-block">
      <h3>{t('catTools')}</h3>
      {searchable ? (
        <>
          <label>
            {t('searchTools')}
            <input
              aria-label={t('searchTools')}
              value={query}
              onChange={event => { setQuery(event.target.value) }}
            />
          </label>
          <button type="button" onClick={() => { setBySize(value => !value) }}>{t('sortSize')}</button>
        </>
      ) : null}
      {shown.map(tool => (
        <p key={tool.name} data-tool={tool.name}>
          {tool.name}{' '}
          <FigureView figure={{ basis: 'estimated', value: tool.tokens }} t={t} showBasis={false} />
        </p>
      ))}
      {rest > 0 ? (
        <button type="button" data-remaining={rest} onClick={() => { setShowAll(true) }}>
          {t('remaining').replace('{n}', String(rest))}
        </button>
      ) : null}
      {overhead !== undefined ? (
        <p>
          {t('overhead')} <FigureView figure={{ basis: 'estimated', value: overhead }} t={t} showBasis={false} />
        </p>
      ) : null}
    </section>
  )
}
