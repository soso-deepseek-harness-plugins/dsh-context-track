/** Shared number, badge, and category labels. */
import type { MouseEvent, ReactNode } from 'react'
import type { CategoryId } from '../shared/classify.js'
import { formatHitPercent, type Figure } from '../shared/figures.js'
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

/**
 * Prompt caching reads as good news when it is high, so the tone tracks the
 * percentage rather than one fixed accent. The pill carries its own color and
 * tint so the number reads at a glance from the header.
 */
export function hitTone(figure: Figure): 'high' | 'mid' | 'low' | 'absent' {
  if (figure.basis === 'absent' || figure.value === undefined) return 'absent'
  if (figure.value >= 80) return 'high'
  if (figure.value >= 50) return 'mid'
  return 'low'
}

export function HitRateBadge({ figure, t, stat }: {
  figure: Figure
  t: (key: TrackKey) => string
  /** Set where the host test or a layout rule hooks onto the band figures. */
  stat?: string
}): ReactNode {
  const tone = hitTone(figure)
  const text = figure.basis === 'absent' || figure.value === undefined ? t('absent') : formatHitPercent(figure.value)
  return (
    <span className="dsh-context-track-hit" data-hit-tone={tone} data-stat={stat} title={t('hitHint')}>
      <span className="dsh-context-track-hit-label">{t('hitRate')}</span>
      <span className="dsh-context-track-hit-value">{text}</span>
    </span>
  )
}
