/** Collapsible JSON, or the same slice as highlighted source. Invalid text stays plain. */
import { useState, type ReactNode } from 'react'
import { copyText } from './format.js'
import { highlightJson, type JsonPiece } from './highlight.js'
import type { TrackKey } from './locales.js'

export function JsonView({ value, t }: { value: unknown; t: (key: TrackKey) => string }): ReactNode {
  const text = typeof value === 'string' ? value : stringify(value)
  const parsed = parseJson(text)
  const [source, setSource] = useState(false)
  return (
    <div data-json-view>
      <button
        type="button"
        data-copy-json
        onClick={() => { void copyText(text) }}
      >
        {t('copyJson')}
      </button>
      {parsed !== undefined ? (
        <button type="button" aria-pressed={source} onClick={() => { setSource(open => !open) }}>
          {t('jsonSource')}
        </button>
      ) : null}
      {parsed === undefined ? (
        <pre className="dsh-context-track-pre" data-json="plain">{text}</pre>
      ) : source ? (
        <Highlighted text={text} />
      ) : (
        <JsonNode value={parsed} />
      )}
    </div>
  )
}

function Highlighted({ text }: { text: string }): ReactNode {
  const highlighted = highlightJson(text)
  if (!highlighted.ok) return <pre className="dsh-context-track-pre" data-json="plain">{highlighted.text}</pre>
  return (
    <pre className="dsh-context-track-pre dsh-context-track-json">
      {highlighted.pieces.map((piece, index) => (
        <JsonSpan key={`${piece.kind}-${index}`} piece={piece} />
      ))}
    </pre>
  )
}

function JsonSpan({ piece }: { piece: JsonPiece }): ReactNode {
  if (piece.kind === 'plain') return <span>{piece.text}</span>
  return <span className={`dsh-context-track-json-${piece.kind}`}>{piece.text}</span>
}

function JsonNode({ name, value }: { name?: string; value: unknown }): ReactNode {
  const complex = value !== null && typeof value === 'object'
  const [open, setOpen] = useState(true)
  if (!complex) {
    return (
      <div data-json-leaf={name ?? ''}>
        {name !== undefined ? `${name}: ` : null}
        {leaf(value)}
      </div>
    )
  }
  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value as Record<string, unknown>)
  return (
    <div className="dsh-context-track-json-node">
      <button
        type="button"
        data-json-key={name ?? ''}
        data-count={entries.length}
        aria-expanded={open}
        onClick={() => { setOpen(current => !current) }}
      >
        {name !== undefined && name.length > 0 ? `${name} ` : null}
        {entries.length}
      </button>
      {open ? entries.map(([key, item]) => <JsonNode key={key} name={key} value={item} />) : null}
    </div>
  )
}

function leaf(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value)
  if (value === undefined) return ''
  return String(value)
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown
  } catch {
    return undefined
  }
}

function stringify(value: unknown): string {
  if (value === undefined) return ''
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}
