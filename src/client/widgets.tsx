/** Shared number, badge, and category labels. */
import type { MouseEvent, ReactNode } from 'react'
import type { CategoryId } from '../shared/classify.js'
import type { Figure } from '../shared/figures.js'
import { abbreviate, copyText, type ShownNumber } from './format.js'
import type { TrackKey } from './locales.js'

export const CATEGORY_KEY: Record<CategoryId, TrackKey> = {
  system: 'catSystem',
  user: 'catUser',
  tools: 'catTools',
  'tool-results': 'catResults',
  injection: 'catInjection',
  skill: 'catSkill',
  history: 'catHistory',
}

export function FigureView({
  figure,
  t,
  pending = false,
  unseen = false,
  showBasis = true,
  format = abbreviate,
}: {
  figure: Figure
  t: (key: TrackKey) => string
  pending?: boolean
  unseen?: boolean
  /** The consumption basis is written once, on the turn total. Tool rows leave it off. */
  showBasis?: boolean
  format?: (value: number) => ShownNumber
}): ReactNode {
  if (figure.basis === 'absent' || figure.value === undefined) {
    const label = unseen ? t('notSeen') : pending ? t('pending') : t('absent')
    return <span className="dsh-context-track-muted" data-basis="absent">{label}</span>
  }
  const shown = format(figure.value)
  const badge = figure.basis === 'usage' ? t('exact') : t('estimated')
  const body = (
    <>
      {showBasis && figure.basis === 'estimated' ? '≈ ' : null}
      {shown.text}
      {showBasis ? (
        <>
          {' '}
          <span className="dsh-context-track-badge" data-basis={figure.basis}>{badge}</span>
        </>
      ) : null}
    </>
  )
  if (!shown.abbreviated) {
    return <span className="dsh-context-track-num" data-basis={figure.basis}>{body}</span>
  }
  return (
    <button
      type="button"
      className="dsh-context-track-num"
      title={shown.full}
      data-full={shown.full}
      onClick={(event: MouseEvent) => {
        event.stopPropagation()
        void copyText(shown.full)
      }}
    >
      {body}
    </button>
  )
}
