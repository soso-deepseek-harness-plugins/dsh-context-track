/** Turn bill. Figures, category rows, clocks, and sidecar cards stay visible beside the tree. */
import { useState, type MouseEvent, type ReactNode } from 'react'
import type { CategoryId } from '../shared/classify.js'
import { formatHitPercent, sessionUsage, type Figure } from '../shared/figures.js'
import type { TrackState } from '../shared/model.js'
import type { ContextEvent, TurnReport } from '../shared/report.js'
import type { TrackKey } from './locales.js'
import { TimingCard } from './TimingCard.js'
import { CATEGORY_KEY, FigureView } from './widgets.js'
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

export function TokenCard({
  report,
  activeSeq,
  trackOf,
  t,
  onGap,
}: {
  report: TurnReport
  activeSeq?: number
  trackOf: (sessionId: string) => TrackState | undefined
  t: (key: TrackKey) => string
  onGap: (seq: number) => void
}): ReactNode {
  const { consumption, window } = report
  const ranked = composeRows(window.categories)
  const peak = ranked.reduce((max, category) => Math.max(max, category.tokens), 0)
  const safe = peak > 0 ? peak : 1
  const [open, setOpen] = useState<Partial<Record<ToolListCategory, boolean>>>({})
  const details: Partial<Record<ToolListCategory, readonly { name: string; tokens: number; calls?: number }[]>> = {
    tools: window.toolDefinitions,
    injection: window.injections ?? [],
    skill: window.skills ?? [],
  }
  const hasDetail = (id: ToolListCategory) => (details[id]?.length ?? 0) > 0 || (id === 'tools' && window.definitionOverhead !== undefined)
  const toggle = (id: ToolListCategory) => { setOpen(current => ({ ...current, [id]: current[id] !== true })) }
  const reclaimed = reclaimedOf(report.events)
  const hitText = (value: number) => ({ text: formatHitPercent(value), full: formatHitPercent(value), abbreviated: false })
  return (
    <div data-inspector="turn">
      <div className="dsh-context-track-bill-figures" data-card="tokens">
        <p data-consumption="total" data-stat="total">
          {t('total')} <FigureView figure={consumption.total} t={t} />
        </p>
        <p data-stat="input">
          {t('input')} <FigureView figure={consumption.input} t={t} showBasis={false} />
        </p>
        <p data-stat="output">
          {t('output')} <FigureView figure={consumption.output} t={t} showBasis={false} pending={report.outputPending} />
        </p>
        <p data-stat="hit" title={t('hitHint')}>
          {t('hitRate')} <FigureView figure={consumption.hitRate} t={t} showBasis={false} format={hitText} />
        </p>
      </div>
      <p className="dsh-context-track-muted">{t('compose')}</p>
      <ol className="dsh-context-track-cats" data-compose>
        {ranked.map(category => {
          const detailCategory = category.id === 'tools' || category.id === 'injection' || category.id === 'skill' ? category.id : undefined
          const fold = detailCategory !== undefined && hasDetail(detailCategory)
          const expanded = fold && open[detailCategory] === true
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
                onClick={fold ? () => { toggle(detailCategory) } : undefined}
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
                        toggle(detailCategory)
                      }}
                    >
                      <Caret />
                    </button>
                  ) : null}
                </span>
                <span className="dsh-context-track-cat">
                  <i style={{ width: `${(category.tokens / safe) * 100}%` }} />
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
      <TimingCard report={report} t={t} />
      {compactionPresent(report) ? (
        <section data-compaction>
          <h3>{t('compaction')}</h3>
          <p>
            {t('reclaimed')}{' '}
            <FigureView figure={reclaimed ?? { basis: 'absent' }} t={t} />
          </p>
          <p>
            {t('compactionCost')}{' '}
            <FigureView figure={consumption.compaction} t={t} />
          </p>
          {consumption.compaction.basis !== 'absent' ? <p>{t('compactionIncluded')}</p> : null}
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
        </section>
      ) : null}
      {report.subagents.map(child => {
        const track = trackOf(child.sessionId)
        const usage = sessionUsage(track?.root ?? [])
        return (
          <p key={child.sessionId} data-subagent={child.sessionId}>
            {t('subagentLine')} {child.label ?? child.sessionId}{' '}
            <FigureView figure={usage} t={t} showBasis={false} />
          </p>
        )
      })}
    </div>
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
