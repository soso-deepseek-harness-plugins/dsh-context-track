/** Highlighted JSON source. Objects, arrays, and long strings fold from the gutter. */
import { useState, type ReactNode } from 'react'
import { copyText } from './format.js'
import type { TrackKey } from './locales.js'

const STRING_LIMIT = 120
const PREVIEW_CHARS = 40

interface Fold {
  text: string
  bulk: 'default' | 'open' | 'shut'
  overrides: Record<string, boolean>
  parsed: Record<string, boolean>
}

export function JsonView({
  value, t, chrome = true,
}: {
  value: unknown
  t: (key: TrackKey) => string
  /** Copy and expand controls. Inline fragments leave them off. */
  chrome?: boolean
}): ReactNode {
  const text = typeof value === 'string' ? value : stringify(value)
  const parsed = tryParse(text)
  const [fold, setFold] = useState<Fold>({ text, bulk: 'default', overrides: {}, parsed: {} })
  const live: Fold = fold.text === text ? fold : { text, bulk: 'default', overrides: {}, parsed: {} }
  if (fold.text !== text) setFold(live)

  const copyValue = parsed === undefined ? text : JSON.stringify(parsed, null, 2)
  const toggle = (path: string, open: boolean) => {
    setFold(current => {
      const base = current.text === text ? current : live
      return { ...base, overrides: { ...base.overrides, [path]: !open } }
    })
  }
  const parseString = (path: string) => {
    setFold(current => {
      const base = current.text === text ? current : live
      return { ...base, parsed: { ...base.parsed, [path]: base.parsed[path] !== true } }
    })
  }

  return (
    <div data-json-view>
      {chrome ? <div className="dsh-context-track-json-tools">
        <button type="button" data-copy-json onClick={() => { void copyText(copyValue) }}>
          {t('copyJson')}
        </button>
        {parsed !== undefined ? (
          <div className="dsh-context-track-json-bulk">
            <button
              type="button"
              onClick={() => { setFold(current => ({ ...(current.text === text ? current : live), bulk: 'open', overrides: {} })) }}
            >
              {t('expandAll')}
            </button>
            <button
              type="button"
              onClick={() => { setFold(current => ({ ...(current.text === text ? current : live), bulk: 'shut', overrides: {} })) }}
            >
              {t('collapseAll')}
            </button>
          </div>
        ) : null}
      </div> : null}
      {parsed === undefined ? (
        <pre className="dsh-context-track-pre" data-json="plain">{text}</pre>
      ) : (
        <div className="dsh-context-track-json-source" data-json="source">
          <JsonNode
            path=""
            value={parsed}
            depth={0}
            fold={live}
            t={t}
            onToggle={toggle}
            onParse={parseString}
          />
        </div>
      )}
    </div>
  )
}

/** Object or array text embeds in a message card. Sentences and scalars stay prose. */
export function compositeJson(text: string): unknown | undefined {
  const parsed = tryParse(text)
  if (parsed === undefined || parsed === null || typeof parsed !== 'object') return undefined
  return parsed
}

function JsonNode({
  name, path, value, depth, fold, t, onToggle, onParse,
}: {
  name?: string
  path: string
  value: unknown
  depth: number
  fold: Fold
  t: (key: TrackKey) => string
  onToggle: (path: string, open: boolean) => void
  onParse: (path: string) => void
}): ReactNode {
  const key = name === undefined ? null : (
    <>
      <span data-json-token="key" className="dsh-context-track-json-key">{JSON.stringify(name)}</span>
      <span>: </span>
    </>
  )
  if (typeof value === 'string') return (
    <StringNode
      name={key}
      path={path}
      value={value}
      depth={depth}
      fold={fold}
      t={t}
      onToggle={onToggle}
      onParse={onParse}
    />
  )
  if (value === null || typeof value !== 'object') {
    return (
      <div className="dsh-context-track-json-line">
        {key}
        <Scalar value={value} />
      </div>
    )
  }
  const array = Array.isArray(value)
  const entries = array
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value as Record<string, unknown>)
  const open = isOpen(fold, path, depth, false)
  return (
    <div>
      <div className="dsh-context-track-json-line">
        <Arrow path={path} open={open} count={entries.length} onToggle={onToggle} />
        {key}
        <span>{open ? (array ? '[' : '{') : array ? `[${entries.length}]` : '{…}'}</span>
      </div>
      {open ? (
        <>
          {entries.map(([entry, item]) => (
            <div key={entry} className="dsh-context-track-json-nest">
              <JsonNode
                name={array ? undefined : entry}
                path={childPath(path, entry)}
                value={item}
                depth={depth + 1}
                fold={fold}
                t={t}
                onToggle={onToggle}
                onParse={onParse}
              />
            </div>
          ))}
          <div className="dsh-context-track-json-line">{array ? ']' : '}'}</div>
        </>
      ) : null}
    </div>
  )
}

function StringNode({
  name, path, value, depth, fold, t, onToggle, onParse,
}: {
  name: ReactNode
  path: string
  value: string
  depth: number
  fold: Fold
  t: (key: TrackKey) => string
  onToggle: (path: string, open: boolean) => void
  onParse: (path: string) => void
}): ReactNode {
  const long = value.length > STRING_LIMIT || value.includes('\n')
  const nested = compositeJson(value)
  const open = long ? isOpen(fold, path, depth, true) : true
  const showNested = open && nested !== undefined && fold.parsed[path] === true
  return (
    <div className="dsh-context-track-json-line">
      {long ? <Arrow path={path} open={open} onToggle={onToggle} /> : null}
      {name}
      {showNested ? (
        <JsonNode
          path={`${path}#`}
          value={nested}
          depth={0}
          fold={fold}
          t={t}
          onToggle={onToggle}
          onParse={onParse}
        />
      ) : (
        <span
          data-json-token="string"
          className="dsh-context-track-json-string"
          data-truncated={long && !open ? 'true' : undefined}
        >
          {long && !open ? preview(value) : JSON.stringify(value)}
        </span>
      )}
      {nested !== undefined ? (
        <button type="button" onClick={() => { onParse(path) }}>{t('parseJson')}</button>
      ) : null}
    </div>
  )
}

function Arrow({
  path, open, count, onToggle,
}: {
  path: string
  open: boolean
  count?: number
  onToggle: (path: string, open: boolean) => void
}): ReactNode {
  return (
    <button
      type="button"
      className="dsh-context-track-chevron"
      data-json-key={path}
      data-count={count}
      aria-expanded={open}
      onClick={() => { onToggle(path, open) }}
    >
      <span aria-hidden="true">{open ? '▾' : '▸'}</span>
    </button>
  )
}

function Scalar({ value }: { value: unknown }): ReactNode {
  if (value === null) return <span data-json-token="null" className="dsh-context-track-json-null">null</span>
  if (typeof value === 'number') {
    return <span data-json-token="number" className="dsh-context-track-json-number">{JSON.stringify(value)}</span>
  }
  if (typeof value === 'boolean') {
    return <span data-json-token="boolean" className="dsh-context-track-json-boolean">{JSON.stringify(value)}</span>
  }
  return <span data-json-token="string" className="dsh-context-track-json-string">{JSON.stringify(value)}</span>
}

function isOpen(fold: Fold, path: string, depth: number, long: boolean): boolean {
  const override = fold.overrides[path]
  if (override !== undefined) return override
  if (fold.bulk === 'open') return true
  if (fold.bulk === 'shut') return false
  if (long) return false
  return depth <= 2
}

function preview(value: string): string {
  const body = JSON.stringify(value).slice(1, -1)
  return `"${body.slice(0, PREVIEW_CHARS)}…"`
}

function childPath(parent: string, key: string): string {
  return parent.length === 0 ? key : `${parent}.${key}`
}

function tryParse(text: string): unknown {
  try {
    return JSON.parse(text) as unknown
  } catch {
    return undefined
  }
}

function stringify(value: unknown): string {
  if (value === undefined) return ''
  try {
    return JSON.stringify(value, null, 2) ?? ''
  } catch {
    return ''
  }
}
