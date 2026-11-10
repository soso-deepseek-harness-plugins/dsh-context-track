/** Wall clock, wait, think, and first response for the selected turn. */
import type { ReactNode } from 'react'
import type { Figure } from '../shared/figures.js'
import type { TurnReport } from '../shared/report.js'
import { formatDuration } from './format.js'
import type { TrackKey } from './locales.js'
import { FigureView } from './widgets.js'

export function TimingCard({ report, t }: { report: TurnReport; t: (key: TrackKey) => string }): ReactNode {
  const { timing } = report
  const opening = timing.firstResponses.find(item => item.opening)
  const later = timing.firstResponses.filter(item => !item.opening)
  const total = timing.elapsed.basis === 'absent' ? undefined : timing.elapsed.value
  const wait = timing.wait.value
  const think = timing.think.value
  /* Wait and think are slices of the wall clock, never a second total. */
  const segments = total !== undefined && total > 0
    ? [
      { key: 'wait', value: Math.max(wait ?? 0, 0) },
      { key: 'think', value: Math.max(think ?? 0, 0) },
      { key: 'rest', value: Math.max(total - (wait ?? 0) - (think ?? 0), 0) },
    ].filter(segment => segment.value > 0)
    : []
  return (
    <div className="dsh-context-track-timing" data-card="timing">
      {segments.length > 0 ? (
        <div
          className="dsh-context-track-timing-bar"
          data-time-bar
          role="img"
          aria-label={t('blockTiming')}
        >
          {segments.map(segment => (
            <span
              key={segment.key}
              data-time-seg={segment.key}
              style={{ flexGrow: segment.value }}
            />
          ))}
        </div>
      ) : null}
      <div className="dsh-context-track-timing-grid">
        <TimeCell
          name="elapsed"
          label={t('elapsed')}
          figure={timing.elapsed}
          note={timing.elapsedRunning ? t('running') : undefined}
          t={t}
        />
        <TimeCell name="wait" label={t('wait')} figure={timing.wait} t={t} />
        <TimeCell name="think" label={t('think')} figure={timing.think} t={t} />
        <div className="dsh-context-track-timing-cell" data-first="title" data-time="first">
          <span className="dsh-context-track-timing-label">{t('firstResponse')}</span>
          <span className="dsh-context-track-timing-value">
            {opening === undefined ? (
              <FigureView figure={{ basis: 'absent' }} t={t} />
            ) : (
              <FigureView figure={opening.duration} t={t} showBasis={false} unseen={opening.pending} format={durationFormat} />
            )}
          </span>
          {opening?.noUserMessage ? <span className="dsh-context-track-timing-note">{t('noUser')}</span> : null}
        </div>
      </div>
      {later.length > 0 ? (
        <div className="dsh-context-track-timing-later" data-time-later>
          {later.map(item => (
            <div key={item.seq} className="dsh-context-track-timing-later-row" data-first="later">
              <span className="dsh-context-track-timing-label">{t('laterInput')}</span>
              <span className="dsh-context-track-timing-value">
                <FigureView figure={item.duration} t={t} showBasis={false} unseen={item.pending} format={durationFormat} />
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function TimeCell({
  name, label, figure, note, t,
}: {
  name: string
  label: string
  figure: Figure
  note?: string
  t: (key: TrackKey) => string
}): ReactNode {
  return (
    <div className="dsh-context-track-timing-cell" data-time={name}>
      <span className="dsh-context-track-timing-label">{label}</span>
      <span className="dsh-context-track-timing-value">
        <FigureView figure={figure} t={t} showBasis={false} format={durationFormat} />
        {note !== undefined ? <span className="dsh-context-track-timing-note" data-running>{note}</span> : null}
      </span>
    </div>
  )
}

function durationFormat(value: number) {
  return formatDuration(value)
}
