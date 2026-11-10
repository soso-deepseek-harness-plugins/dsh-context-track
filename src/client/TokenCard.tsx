/**
 * Context summary band. Collapsed it is one line: a stacked make-up bar, a
 * legend, and the expand control. Expanded it is a grid of make-up, timing,
 * and sidecars that scrolls on its own.
 */
import { useState, type MouseEvent, type ReactNode } from 'react'
import type { CategoryId } from '../shared/classify.js'
import { sessionUsage, type Figure } from '../shared/figures.js'
import type { TrackState } from '../shared/model.js'
import type { CategoryTotal, ContextEvent, TurnReport } from '../shared/report.js'
import type { TrackKey } from './locales.js'
import { TimingCard } from './TimingCard.js'
import { abbreviate } from './format.js'
import { CATEGORY_KEY, FigureView, HitRateBadge } from './widgets.js'
import { ToolList, type ToolListCategory } from './Inspector.js'

/** Identity, not rank. A seventh category keeps its name and a neutral bar. */
const HUE: Record<CategoryId, string> = {
  tools: 'tools',
  'tool-results': 'results',
  system: 'system',
  skill: 'skill',
  history: 'history',
  injection: 'injection',
  user: 'neutral',
}

/** Tool rows follow the user row. The rest of the window stays ranked by size. */
const AFTER_USER = new Set<CategoryId>(['tool-results', 'tools'])

/** Only four legend entries before the rest fold into `+N`. */
const LEGEND_PREVIEW = 4

function bySize(left: { id: string; tokens: number }, right: { id: string; tokens: number }): number {
  return right.tokens - left.tokens || left.id.localeCompare(right.id)
}

export function composeRows<T extends { id: CategoryId; tokens: number }>(categories: readonly T[]): T[] {
  const head = categories.filter(category => !AFTER_USER.has(category.id)).sort(bySize)
  const tail = categories.filter(category => AFTER_USER.has(category.id)).sort(bySize)
  const userAt = head.findIndex(category => category.id === 'user')
  if (userAt < 0) return [...head, ...tail]
  return [...head.slice(0, userAt + 1), ...tail, ...head.slice(userAt + 1)]
}

export function reclaimedOf(events: readonly ContextEvent[]): Figure | undefined {
  const parts = events.filter(event => event.kind === 'compaction' && event.tokens?.value !== undefined)
  if (parts.length === 0) return undefined
  return {
    basis: parts.every(event => event.tokens?.basis === 'estimated') ? 'estimated' : 'usage',
    value: parts.reduce((sum, event) => sum + (event.tokens?.value ?? 0), 0),
  }
}

export function compactionPresent(report: TurnReport): boolean {
  return report.consumption.compaction.basis !== 'absent' || report.events.some(event => event.kind === 'compaction')
}

export function ContextBand({
  report,
  open,
  activeSeq,
  trackOf,
  t,
  onToggle,
  onCategory,
  onGap,
}: {
  report: TurnReport
  open: boolean
  activeSeq?: number
  trackOf: (sessionId: string) => TrackState | undefined
  t: (key: TrackKey) => string
  onToggle: () => void
  onCategory: (id: CategoryId) => void
  onGap: (seq: number) => void
}): ReactNode {
  const { consumption, window } = report
  const ranked = composeRows(window.categories)
  const [allLegend, setAllLegend] = useState(false)
  const [detailOpen, setDetailOpen] = useState<Partial<Record<ToolListCategory, boolean>>>({})
  const details: Partial<Record<ToolListCategory, readonly { name: string; tokens: number; calls?: number }[]>> = {
    tools: window.toolDefinitions,
    injection: window.injections ?? [],
    skill: window.skills ?? [],
  }
  const hasDetail = (id: ToolListCategory) => (details[id]?.length ?? 0) > 0 || (id === 'tools' && window.definitionOverhead !== undefined)
  const toggleDetail = (id: ToolListCategory) => { setDetailOpen(current => ({ ...current, [id]: current[id] !== true })) }
  const reclaimed = reclaimedOf(report.events)
  const gaps = report.events.filter(event => event.kind === 'compaction' && event.inWindow)
  return (
    <div className="dsh-context-track-band" data-band={open ? 'open' : 'closed'}>
      <div className="dsh-context-track-band-line">
        <span className="dsh-context-track-band-caption">{t('blockCompose')}</span>
        <StackedBar ranked={ranked} gaps={gaps} activeSeq={activeSeq} t={t} onCategory={onCategory} onGap={onGap} />
        <Legend
          ranked={ranked}
          all={allLegend}
          t={t}
          onMore={() => { setAllLegend(value => !value) }}
          onCategory={onCategory}
        />
        <button
          type="button"
          className="dsh-context-track-band-toggle"
          data-band-toggle
          aria-expanded={open}
          aria-label={open ? t('bandCollapse') : t('bandExpand')}
          onClick={onToggle}
        >
          <span aria-hidden="true">{open ? '▴' : '▾'}</span>
        </button>
      </div>
      {open ? (
        <div className="dsh-context-track-band-panel" data-band-panel>
          {/* The line above already labels the compose card with its bar and legend, so
              the panel keeps only the figures and the per-category rows. */}
          <section data-block="compose" className="dsh-context-track-band-block" aria-label={t('blockCompose')}>
            <p className="dsh-context-track-band-figures" data-figures>
              <span data-stat="input">{t('input')} <FigureView figure={consumption.input} t={t} showBasis={false} /></span>
              <span data-stat="output">{t('output')} <FigureView figure={consumption.output} t={t} showBasis={false} pending={report.outputPending} /></span>
              {consumption.reasoning.basis === 'absent' ? null : (
                <span data-stat="reasoning">{t('reasoningBlock')} <FigureView figure={consumption.reasoning} t={t} showBasis={false} /></span>
              )}
              <HitRateBadge figure={consumption.hitRate} t={t} stat="hit" />
            </p>
            <ol className="dsh-context-track-cats" data-compose>
              {ranked.map(category => {
                const detailCategory = category.id === 'tools' || category.id === 'injection' || category.id === 'skill' ? category.id : undefined
                const fold = detailCategory !== undefined && hasDetail(detailCategory)
                const expanded = fold && detailOpen[detailCategory] === true
                const name = t(CATEGORY_KEY[category.id])
                return (
                  <li
                    key={category.id}
                    data-category={category.id}
                    data-hue={HUE[category.id]}
                    data-open={fold ? (expanded ? 'true' : 'false') : undefined}
                  >
                    <div
                      className="dsh-context-track-cat-line"
                      data-fold={fold ? 'true' : undefined}
                      onClick={fold ? () => { toggleDetail(detailCategory) } : undefined}
                    >
                      <span className="dsh-context-track-cat-name">
                        <span>{name}</span>
                        {fold ? (
                          <button
                            type="button"
                            className="dsh-context-track-cat-toggle"
                            aria-expanded={expanded}
                            aria-label={name}
                            onClick={(event: MouseEvent) => {
                              event.stopPropagation()
                              toggleDetail(detailCategory)
                            }}
                          >
                            <Caret />
                          </button>
                        ) : null}
                      </span>
                      <span className={`dsh-context-track-cat dsh-context-track-cat-${HUE[category.id]}`}>
                        <i style={{ width: `${barShare(ranked, category)}%` }} />
                      </span>
                      <FigureView figure={{ basis: 'estimated', value: category.tokens }} t={t} showBasis={false} />
                    </div>
                    {expanded ? (
                      <ToolList
                        tools={details[detailCategory] ?? []}
                        overhead={detailCategory === 'tools' ? window.definitionOverhead : undefined}
                        category={detailCategory}
                        t={t}
                        nested
                      />
                    ) : null}
                  </li>
                )
              })}
            </ol>
            {hasDetail('tools') && !ranked.some(category => category.id === 'tools') ? (
              <ToolList tools={window.toolDefinitions} overhead={window.definitionOverhead} t={t} />
            ) : null}
          </section>
          <section data-block="timing" className="dsh-context-track-band-block">
            <h3>{t('blockTiming')}</h3>
            <TimingCard report={report} t={t} />
          </section>
          <section data-block="side" className="dsh-context-track-band-block">
            <h3>{t('blockSide')}</h3>
            {!compactionPresent(report) && report.subagents.length === 0 ? (
              <p className="dsh-context-track-side-empty" data-side-empty>{t('sideEmpty')}</p>
            ) : null}
            {compactionPresent(report) ? (
              <div className="dsh-context-track-side-group" data-compaction>
                <div className="dsh-context-track-side-row">
                  <span className="dsh-context-track-side-label">{t('reclaimed')}</span>
                  <span className="dsh-context-track-side-value">
                    <FigureView figure={reclaimed ?? { basis: 'absent' }} t={t} />
                  </span>
                </div>
                <div className="dsh-context-track-side-row">
                  <span className="dsh-context-track-side-label">{t('compactionCost')}</span>
                  <span className="dsh-context-track-side-value">
                    <FigureView figure={consumption.compaction} t={t} />
                  </span>
                </div>
                {consumption.compaction.basis !== 'absent' ? <p className="dsh-context-track-side-note">{t('compactionIncluded')}</p> : null}
                <div className="dsh-context-track-side-links">
                  {report.events.filter(event => event.kind === 'compaction').map(event => (
                    <button
                      key={event.seq}
                      type="button"
                      className="dsh-context-track-gap"
                      data-seq={event.seq}
                      data-active={activeSeq === event.seq ? 'true' : undefined}
                      onClick={() => { onGap(event.seq) }}
                    >
                      {t('kindCompaction')}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {report.subagents.map(child => {
              const track = trackOf(child.sessionId)
              const usage = sessionUsage(track?.root ?? [])
              return (
                <div key={child.sessionId} className="dsh-context-track-side-row" data-subagent={child.sessionId}>
                  <span className="dsh-context-track-side-label">
                    {t('subagentLine')} {child.label ?? child.sessionId}
                  </span>
                  <span className="dsh-context-track-side-value">
                    <FigureView figure={usage} t={t} showBasis={false} />
                  </span>
                </div>
              )
            })}
          </section>
        </div>
      ) : null}
    </div>
  )
}

function barShare(ranked: readonly CategoryTotal[], category: CategoryTotal): number {
  const peak = ranked.reduce((max, item) => Math.max(max, item.tokens), 0)
  return peak > 0 ? (category.tokens / peak) * 100 : 0
}

function StackedBar({
  ranked, gaps, activeSeq, t, onCategory, onGap,
}: {
  ranked: readonly CategoryTotal[]
  gaps: readonly ContextEvent[]
  activeSeq?: number
  t: (key: TrackKey) => string
  onCategory: (id: CategoryId) => void
  onGap: (seq: number) => void
}): ReactNode {
  const visible = ranked.filter(category => category.tokens > 0)
  if (visible.length === 0 && gaps.length === 0) {
    return <span className="dsh-context-track-band-bar" data-compose-bar data-empty="true" />
  }
  return (
    <span className="dsh-context-track-band-bar" data-compose-bar role="group" aria-label={t('compose')}>
      {visible.map(category => (
        <button
          key={category.id}
          type="button"
          className="dsh-context-track-band-seg"
          data-category={category.id}
          data-hue={HUE[category.id]}
          style={{ flexGrow: category.tokens }}
          title={`${t(CATEGORY_KEY[category.id])} ${abbreviate(category.tokens).text}`}
          onClick={() => { onCategory(category.id) }}
        />
      ))}
      {gaps.map(event => (
        <button
          key={`gap-${event.seq}`}
          type="button"
          className="dsh-context-track-band-gap"
          data-gap-seq={event.seq}
          data-active={activeSeq === event.seq ? 'true' : undefined}
          title={t('compaction')}
          onClick={() => { onGap(event.seq) }}
        />
      ))}
    </span>
  )
}

function Legend({
  ranked, all, t, onMore, onCategory,
}: {
  ranked: readonly CategoryTotal[]
  all: boolean
  t: (key: TrackKey) => string
  onMore: () => void
  onCategory: (id: CategoryId) => void
}): ReactNode {
  if (ranked.length === 0) return null
  const shown = all ? ranked : ranked.slice(0, LEGEND_PREVIEW)
  const rest = ranked.length - shown.length
  return (
    <span className="dsh-context-track-legend" data-legend-list>
      {shown.map(category => (
        <button
          key={category.id}
          type="button"
          className="dsh-context-track-legend-item"
          data-legend={category.id}
          data-hue={HUE[category.id]}
          onClick={() => { onCategory(category.id) }}
        >
          <i aria-hidden="true" />
          <span>{t(CATEGORY_KEY[category.id])}</span>
          <b className="dsh-context-track-num">{abbreviate(category.tokens).text}</b>
        </button>
      ))}
      {rest > 0 ? (
        <button type="button" className="dsh-context-track-legend-more" data-legend-more onClick={onMore}>
          {`+${rest}`}
        </button>
      ) : null}
    </span>
  )
}

/** Same glyph either way; the row rotates it, so open and closed stay the same width. */
function Caret(): ReactNode {
  return (
    <svg className="dsh-context-track-cat-caret" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M6 4.25 10.25 8 6 11.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
