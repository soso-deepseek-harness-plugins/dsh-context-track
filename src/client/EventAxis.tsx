/** Event list for one turn. Filters show the unfiltered counts. */
import type { ReactNode } from 'react'
import type { ContextEvent, EventKind } from '../shared/report.js'
import type { TrackKey } from './locales.js'
import { EVENT_KEY, FigureView } from './widgets.js'

const KINDS: readonly EventKind[] = ['injection', 'skill', 'compaction', 'trim', 'model', 'tool', 'switch', 'title']

export function EventAxis({
  events,
  filter,
  activeSeq,
  t,
  onFilter,
  onSelect,
}: {
  events: readonly ContextEvent[]
  filter?: EventKind
  activeSeq?: number
  t: (key: TrackKey) => string
  onFilter: (kind: EventKind | undefined) => void
  onSelect: (event: ContextEvent) => void
}): ReactNode {
  const counts = new Map<EventKind, number>()
  for (const event of events) counts.set(event.kind, (counts.get(event.kind) ?? 0) + 1)
  const visible = filter === undefined ? events : events.filter(event => event.kind === filter)
  return (
    <section className="dsh-context-track-events">
      <div className="dsh-context-track-filters">
        <button type="button" className="dsh-context-track-chip" aria-pressed={filter === undefined} onClick={() => { onFilter(undefined) }}>
          {t('filterAll')} {events.length}
        </button>
        {KINDS.filter(kind => (counts.get(kind) ?? 0) > 0).map(kind => (
          <button
            key={kind}
            type="button"
            className="dsh-context-track-chip"
            data-kind={kind}
            data-count={counts.get(kind)}
            aria-pressed={filter === kind}
            onClick={() => { onFilter(filter === kind ? undefined : kind) }}
          >
            {t(EVENT_KEY[kind])} {counts.get(kind)}
          </button>
        ))}
      </div>
      {filter === undefined ? null : (
      <ul>
        {visible.map(event => (
          <li key={event.seq}>
            <button
              type="button"
              data-event-seq={event.seq}
              data-active={activeSeq === event.seq ? 'true' : undefined}
              onClick={() => { onSelect(event) }}
            >
              {t(EVENT_KEY[event.kind])} {event.label}
              {event.tokens !== undefined ? <> <FigureView figure={event.tokens} t={t} showBasis={false} /></> : null}
            </button>
          </li>
        ))}
      </ul>
      )}
    </section>
  )
}
