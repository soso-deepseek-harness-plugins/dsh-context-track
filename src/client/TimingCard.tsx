/** Wall clock, wait, think, and first response for the selected turn. */
import type { ReactNode } from 'react'
import type { TurnReport } from '../shared/report.js'
import { formatDuration } from './format.js'
import type { TrackKey } from './locales.js'
import { FigureView } from './widgets.js'

export function TimingCard({ report, t }: { report: TurnReport; t: (key: TrackKey) => string }): ReactNode {
  const { timing } = report
  const opening = timing.firstResponses.find(item => item.opening)
  const later = timing.firstResponses.filter(item => !item.opening)
  return (
    <section className="dsh-context-track-card" data-card="timing">
      <p>
        {t('elapsed')}{' '}
        <FigureView figure={timing.elapsed} t={t} showBasis={false} format={durationFormat} />
        {timing.elapsedRunning ? ` ${t('running')}` : null}
      </p>
      <p>
        {t('wait')} <FigureView figure={timing.wait} t={t} showBasis={false} format={durationFormat} />
      </p>
      <p>
        {t('think')} <FigureView figure={timing.think} t={t} showBasis={false} format={durationFormat} />
      </p>
      <p data-first="title">
        {t('firstResponse')}{' '}
        {opening === undefined ? (
          <FigureView figure={{ basis: 'absent' }} t={t} />
        ) : (
          <FigureView figure={opening.duration} t={t} showBasis={false} unseen={opening.pending} format={durationFormat} />
        )}
        {opening?.noUserMessage ? ` ${t('noUser')}` : null}
      </p>
      {later.map(item => (
        <p key={item.seq} data-first="later">
          {t('laterInput')}{' '}
          <FigureView figure={item.duration} t={t} showBasis={false} unseen={item.pending} format={durationFormat} />
        </p>
      ))}
    </section>
  )
}

function durationFormat(value: number) {
  return formatDuration(value)
}
