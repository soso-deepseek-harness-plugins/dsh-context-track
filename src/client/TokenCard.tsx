/** Turn bill. Figures, category rows, clocks, and sidecar cards stay visible beside the tree. */
import type { ReactNode } from 'react'
import type { CategoryId } from '../shared/classify.js'
import { formatHitPercent, sessionUsage, type Figure } from '../shared/figures.js'
import type { TrackState } from '../shared/model.js'
import type { ContextEvent, TurnReport } from '../shared/report.js'
import type { TrackKey } from './locales.js'
import { TimingCard } from './TimingCard.js'
import { CATEGORY_KEY, FigureView } from './widgets.js'
import { ToolList } from './Inspector.js'

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
  titleName,
  trackOf,
  t,
  onGap,
  children,
}: {
  report: TurnReport
  activeSeq?: number
  /** Adopted session name, when the log already has one. */
  titleName?: string
  trackOf: (sessionId: string) => TrackState | undefined
  t: (key: TrackKey) => string
  onGap: (seq: number) => void
  children?: ReactNode
}): ReactNode {
  const { consumption, window } = report
  const ranked = [...window.categories].sort((left, right) => right.tokens - left.tokens || left.id.localeCompare(right.id))
  const peak = ranked[0]?.tokens ?? 0
  const safe = peak > 0 ? peak : 1
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
        <p data-stat="reasoning">
          {t('reasoningBlock')} <FigureView figure={consumption.reasoning} t={t} showBasis={false} />
        </p>
        <p data-stat="hit" title={t('hitHint')}>
          {t('hitRate')} <FigureView figure={consumption.hitRate} t={t} showBasis={false} format={hitText} />
        </p>
      </div>
      <p className="dsh-context-track-muted">{t('compose')}</p>
      <ol className="dsh-context-track-cats" data-compose>
        {ranked.map(category => (
          <li key={category.id} data-category={category.id} data-hue={HUE[category.id]}>
            <span>{t(CATEGORY_KEY[category.id])}</span>
            <span className="dsh-context-track-cat">
              <i style={{ width: `${(category.tokens / safe) * 100}%` }} />
            </span>
            <FigureView figure={{ basis: 'estimated', value: category.tokens }} t={t} showBasis={false} />
          </li>
        ))}
      </ol>
      <ToolList tools={window.toolDefinitions} overhead={window.definitionOverhead} t={t} />
      <TimingCard report={report} t={t} />
      {window.consistent === true ? <p>{t('consistent')}</p> : null}
      {window.consistent === false && window.delta !== undefined ? (
        <p>
          {t('delta')} <FigureView figure={window.delta} t={t} showBasis={false} />
        </p>
      ) : null}
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
      {consumption.title !== undefined ? (
        <section data-session-name>
          <h3>{t('title')}</h3>
          <p data-stat="title">
            {t('usage')} <FigureView figure={consumption.title} t={t} showBasis={false} />
          </p>
          <p>{t('titleExcluded')}</p>
          <p>{titleName !== undefined && titleName.length > 0 ? titleName : t('titleMissing')}</p>
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
      <div className="dsh-context-track-bill-second">{children}</div>
    </div>
  )
}
