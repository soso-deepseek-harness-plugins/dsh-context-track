/** Named breakdowns for tool definitions, injected content, and skills. */
import { useState, type ReactNode } from 'react'
import type { TrackKey } from './locales.js'
import { FigureView } from './widgets.js'

export const TOOL_PREVIEW = 5

type ToolSort = 'size' | 'name'
export type ToolListCategory = 'tools' | 'injection' | 'skill'

/** Largest entries first. Search runs before the preview cut. */
export function ToolList({
  tools,
  overhead,
  category = 'tools',
  t,
  nested = false,
}: {
  tools: readonly { name: string; tokens: number; calls?: number }[]
  overhead?: number
  category?: ToolListCategory
  t: (key: TrackKey) => string
  /** Sit under the category row. The row already names the group. */
  nested?: boolean
}): ReactNode {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<ToolSort>('size')
  const [showAll, setShowAll] = useState(false)
  if (tools.length === 0 && overhead === undefined) return null
  const nameKey = category === 'tools' ? 'catTools' : category === 'skill' ? 'catSkill' : 'catInjection'
  const searchKey = category === 'tools' ? 'searchTools' : category === 'skill' ? 'searchSkill' : 'searchInjection'
  const overheadKey: TrackKey = category === 'skill' ? 'skillOverhead' : 'overhead'
  const needle = query.trim().toLowerCase()
  const filtered = needle.length === 0
    ? [...tools]
    : tools.filter(tool => tool.name.toLowerCase().includes(needle))
  const ordered = [...filtered].sort((left, right) => compareTools(left, right, sort))
  const shown = showAll ? ordered : ordered.slice(0, TOOL_PREVIEW)
  const rest = ordered.length - shown.length
  const peak = Math.max(1, ...tools.map(tool => tool.tokens))
  return (
    <section data-category={category} data-breakdown className="dsh-context-track-tools" data-sort={sort} data-hue={category} data-nested={nested ? 'true' : undefined}>
      {nested ? null : (
        <div className="dsh-context-track-tools-head">
          <h3>{t(nameKey)}</h3>
          <span className="dsh-context-track-tools-count">{ordered.length}</span>
        </div>
      )}
      {tools.length > 0 ? (
        <div className="dsh-context-track-tools-bar">
          <input
            aria-label={t(searchKey)}
            placeholder={t(searchKey)}
            value={query}
            onChange={event => { setQuery(event.target.value) }}
          />
          <div className="dsh-context-track-tools-sort" role="group" aria-label={t(nameKey)}>
            <button type="button" aria-pressed={sort === 'size'} onClick={() => { setSort('size') }}>
              {t('sortSize')}
            </button>
            <button type="button" aria-pressed={sort === 'name'} onClick={() => { setSort('name') }}>
              {t('sortName')}
            </button>
          </div>
          {nested ? <span className="dsh-context-track-tools-count">{ordered.length}</span> : null}
        </div>
      ) : null}
      {shown.length > 0 ? (
        <ol className="dsh-context-track-tool-chart">
          {shown.map(tool => (
            <li key={tool.name} data-tool={tool.name} {...(tool.calls !== undefined ? { 'data-calls': tool.calls } : {})}>
              <span className="dsh-context-track-tool-name" title={tool.name}>
                <span>{tool.name}</span>
                {category !== 'tools' && tool.calls !== undefined && (category !== 'skill' || tool.calls > 1) ? (
                  <small className="dsh-context-track-tool-calls">{t('entries').replace('{n}', String(tool.calls))}</small>
                ) : null}
              </span>
              <span className="dsh-context-track-tool-meter" aria-hidden="true">
                <i style={{ width: `${(tool.tokens / peak) * 100}%`, ...(tool.tokens > 0 ? { minWidth: '2px' } : {}) }} />
              </span>
              <FigureView figure={{ basis: 'estimated', value: tool.tokens }} t={t} showBasis={false} />
            </li>
          ))}
        </ol>
      ) : needle.length > 0 ? (
        <p className="dsh-context-track-muted">{t(category === 'tools' ? 'noToolMatch' : 'noMatch')}</p>
      ) : null}
      {rest > 0 ? (
        <button type="button" data-remaining={rest} onClick={() => { setShowAll(true) }}>
          {t('remaining').replace('{n}', String(rest))}
        </button>
      ) : null}
      {overhead !== undefined ? (
        <p className="dsh-context-track-tools-overhead" data-overhead>
          {t(overheadKey)} <FigureView figure={{ basis: 'estimated', value: overhead }} t={t} showBasis={false} />
        </p>
      ) : null}
    </section>
  )
}

function compareTools(
  left: { name: string; tokens: number },
  right: { name: string; tokens: number },
  sort: ToolSort,
): number {
  if (sort === 'name') return left.name.localeCompare(right.name) || right.tokens - left.tokens
  return right.tokens - left.tokens || left.name.localeCompare(right.name)
}
