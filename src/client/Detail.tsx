/** Structured reading of one node, or the same node as JSON. Input sits above output. */
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { classifyWindow, type ClassifiedItem } from '../shared/classify.js'
import { isMissing, type AttemptDetail, type NodeDetail, type StepRunningDetail, type ToolDetail } from '../shared/detail.js'
import { estimateMessage } from '../shared/estimate.js'
import { childExpandable } from '../shared/model.js'
import { ToolList } from './Inspector.js'
import { JsonView } from './JsonView.js'
import type { TrackKey } from './locales.js'
import { CATEGORY_KEY, FigureView } from './widgets.js'

const PREVIEW_LINES = 8

export interface ToolHint {
  id: string
  callId: string
  name: string
  status: string
  resultLine?: string
}

export interface DetailProps {
  detail: NodeDetail | undefined
  nodeKey: string
  t: (key: TrackKey) => string
  scrollerRef: RefObject<HTMLElement | null>
  toolHints?: readonly ToolHint[]
  onSelectTool?: (hint: ToolHint) => void
  onOpenChild?: () => void
}

type ViewName = 'structured' | 'json'

/** One node. Switching views restores the scroll each view last had. */
export function Detail({
  detail, nodeKey, t, scrollerRef, toolHints = [], onSelectTool, onOpenChild,
}: DetailProps): ReactNode {
  const [view, setView] = useState<ViewName>('structured')
  const [slice, setSlice] = useState<unknown>(undefined)
  const memory = useRef<Record<ViewName, number>>({ structured: 0, json: 0 })
  const viewRef = useRef(view)
  viewRef.current = view

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (scroller !== null) scroller.scrollTop = memory.current[view]
  }, [view, nodeKey, scrollerRef])

  const choose = (next: ViewName) => {
    const scroller = scrollerRef.current
    if (scroller !== null) memory.current[viewRef.current] = scroller.scrollTop
    setSlice(undefined)
    setView(next)
  }

  const openSlice = (value: unknown) => {
    const scroller = scrollerRef.current
    if (scroller !== null) memory.current[viewRef.current] = scroller.scrollTop
    setSlice(value)
    setView('json')
  }

  if (detail === undefined) return <p className="dsh-context-track-muted">{t('hint')}</p>
  if (isMissing(detail)) return <p className="dsh-context-track-muted">{t('missing')}</p>

  const hints = detail.kind === 'attempt' || detail.kind === 'step'
    ? withResults(toolHints, detail.messages)
    : toolHints

  return (
    <div data-view={view} data-node={nodeKey}>
      <div className="dsh-context-track-views">
        <button type="button" data-view-toggle="structured" aria-pressed={view === 'structured'} onClick={() => { choose('structured') }}>
          {t('structured')}
        </button>
        <button type="button" data-view-toggle="json" aria-pressed={view === 'json'} onClick={() => { choose('json') }}>
          {t('jsonView')}
        </button>
      </div>
      {view === 'json' ? (
        <JsonView value={slice !== undefined ? slice : detail} t={t} />
      ) : (
        <Structured
          detail={detail}
          hints={hints}
          t={t}
          onSelectTool={onSelectTool}
          onOpenChild={onOpenChild}
          onSlice={openSlice}
        />
      )}
    </div>
  )
}

function Structured({
  detail, hints, t, onSelectTool, onOpenChild, onSlice,
}: {
  detail: Exclude<NodeDetail, { missing: true }>
  hints: readonly ToolHint[]
  t: (key: TrackKey) => string
  onSelectTool?: (hint: ToolHint) => void
  onOpenChild?: () => void
  onSlice: (value: unknown) => void
}): ReactNode {
  if (detail.kind === 'attempt' || detail.kind === 'step') {
    return (
      <div data-io>
        <Facts detail={detail} t={t} />
        <InputCards messages={detail.messages} tools={detail.tools} t={t} />
        {detail.kind === 'attempt' ? (
          <OutputCards output={detail.output} hints={hints} t={t} onSelectTool={onSelectTool} />
        ) : (
          <section data-output="unseen" className="dsh-context-track-block">
            <h3>{t('output')}</h3>
            <p className="dsh-context-track-muted">{t('notSeen')}</p>
          </section>
        )}
      </div>
    )
  }
  if (detail.kind === 'tool') {
    return <ToolBody detail={detail} t={t} onOpenChild={onOpenChild} onSlice={onSlice} />
  }
  if (detail.kind === 'sidecar') {
    if (detail.purpose === 'session-title' && (detail.output === undefined || detail.output.length === 0)) {
      return <p data-session-name>{t('titleMissing')}</p>
    }
    const text = detail.purpose === 'session-title'
      ? detail.output
      : detail.purpose === 'compaction'
        ? detail.summary
        : detail.request
    return <pre className="dsh-context-track-pre">{typeof text === 'string' ? text : stringify(text)}</pre>
  }
  if (detail.kind === 'turn') {
    return <p>{detail.status === 'ok' ? null : detail.status}</p>
  }
  return <pre className="dsh-context-track-pre">{stringify(detail)}</pre>
}

function Facts({
  detail, t,
}: {
  detail: AttemptDetail | StepRunningDetail
  t: (key: TrackKey) => string
}): ReactNode {
  const config = record(detail.config)
  const parts = [
    textOf(config.provider, config.model),
    textOf(config.temperature, config.topP, config.maxTokens),
    `${t('windowLabel')} ${detail.inputSeq}`,
    `${t('finish')} ${detail.status}`,
  ]
  if (detail.kind === 'attempt' && detail.retry !== undefined) {
    parts.push(`${t('retry')} ${stringify(detail.retry.failure)}`)
    parts.push(`delayMs ${detail.retry.delayMs}`)
  }
  return <p data-facts>{parts.filter(part => part.trim().length > 0).join(' · ')}</p>
}

function InputCards({
  messages, tools, t,
}: {
  messages: unknown
  tools: unknown
  t: (key: TrackKey) => string
}): ReactNode {
  const list = Array.isArray(messages) ? messages : []
  const classified = useMemo(() => classifyWindow(list, tools), [list, tools])
  return (
    <div data-input>
      {list.map((message, index) => {
        const item = classified.items.find(entry => entry.message === message)
        return <MessageCard key={index} message={message} item={item} t={t} />
      })}
      <ToolList tools={classified.tools} overhead={classified.definitionOverhead} t={t} searchable />
    </div>
  )
}

function OutputCards({
  output, hints, t, onSelectTool,
}: {
  output: unknown
  hints: readonly ToolHint[]
  t: (key: TrackKey) => string
  onSelectTool?: (hint: ToolHint) => void
}): ReactNode {
  if (output === undefined) {
    return (
      <section data-output="unseen" className="dsh-context-track-block">
        <h3>{t('output')}</h3>
        <p className="dsh-context-track-muted">{t('pending')}</p>
      </section>
    )
  }
  const parts = splitOutput(output)
  const answer = parts.answer.length > 0 ? parts.answer : messageText(output)
  return (
    <div data-output>
      {answer.length > 0 ? (
        <MessageCard
          message={{ role: 'assistant', content: [{ type: 'text', text: answer }] }}
          item={{ category: 'history', tokens: estimateMessage({ role: 'assistant', content: [{ type: 'text', text: answer }] }), role: 'assistant', message: output }}
          t={t}
        />
      ) : null}
      {parts.chips.map((block, index) => (
        <ToolChip key={chipId(block, index)} block={block} hints={hints} t={t} onSelectTool={onSelectTool} />
      ))}
      {parts.reasoning.length > 0 ? (
        <MessageCard
          message={{ role: 'assistant', content: [{ type: 'reasoning', text: parts.reasoning }] }}
          item={{ category: 'history', tokens: estimateMessage({ role: 'assistant', content: [{ type: 'reasoning', text: parts.reasoning }] }), role: 'assistant', message: output }}
          t={t}
          faint
        />
      ) : null}
    </div>
  )
}

function MessageCard({
  message, item, t, faint = false,
}: {
  message: unknown
  item?: ClassifiedItem
  t: (key: TrackKey) => string
  faint?: boolean
}): ReactNode {
  const text = messageText(message)
  const [open, setOpen] = useState(false)
  const [jsonOn, setJsonOn] = useState(false)
  const lines = text.split('\n')
  const clamped = !open && lines.length > PREVIEW_LINES
  const shown = clamped ? lines.slice(0, PREVIEW_LINES).join('\n') : text
  const role = item?.role ?? roleOf(message) ?? ''
  const category = item?.category
  const folded = category === 'system' || faint
  const tokens = item?.tokens ?? estimateMessage(message, category === 'system')
  return (
    <section
      className={faint ? 'dsh-context-track-block dsh-context-track-reasoning' : 'dsh-context-track-block'}
      data-category={category}
      data-folded={folded && !open ? 'true' : undefined}
      data-clamped={clamped ? 'true' : undefined}
    >
      <h3>
        {role.length > 0 ? <span>{role} </span> : null}
        {category !== undefined ? <span>{t(CATEGORY_KEY[category])} </span> : null}
        <FigureView figure={{ basis: 'estimated', value: tokens }} t={t} />
      </h3>
      <pre className="dsh-context-track-pre">{shown}</pre>
      {lines.length > PREVIEW_LINES ? (
        <button type="button" data-more onClick={() => { setOpen(value => !value) }}>
          {open ? t('collapse') : t('showRest')}
        </button>
      ) : null}
      <button type="button" data-message-json onClick={() => { setJsonOn(value => !value) }}>
        {t('jsonView')}
      </button>
      {jsonOn ? <JsonView value={message} t={t} /> : null}
    </section>
  )
}

function ToolChip({
  block, hints, t, onSelectTool,
}: {
  block: Record<string, unknown>
  hints: readonly ToolHint[]
  t: (key: TrackKey) => string
  onSelectTool?: (hint: ToolHint) => void
}): ReactNode {
  const id = typeof block.id === 'string' ? block.id : undefined
  const name = typeof block.name === 'string' && block.name.length > 0 ? block.name : 'tool'
  const hint = id === undefined ? undefined : hints.find(tool => tool.callId === id || tool.id === id)
  const summary = summarize(block.arguments ?? block.args ?? block.input)
  const result = hint?.resultLine
  const status = hint?.status
  return (
    <button
      type="button"
      className="dsh-context-track-tool-chip"
      data-tool-chip={id ?? name}
      onClick={() => {
        if (hint === undefined || onSelectTool === undefined) return
        onSelectTool(hint)
      }}
    >
      <span>{name}</span>
      <span className="dsh-context-track-muted" data-arg-summary>{summary}</span>
      {status !== undefined ? (
        <span className={`dsh-context-track-dot dsh-context-track-status-${status}`} data-status={status} />
      ) : null}
      {status !== undefined && status !== 'ok' ? <span>{labelStatus(status, t)}</span> : null}
      {result !== undefined ? <span data-result-line>{result}</span> : null}
    </button>
  )
}

function ToolBody({
  detail, t, onOpenChild, onSlice,
}: {
  detail: ToolDetail
  t: (key: TrackKey) => string
  onOpenChild?: () => void
  onSlice: (value: unknown) => void
}): ReactNode {
  const local = detail.childSessionId !== undefined && childExpandable(detail.childMode)
  const resultText = detail.result === undefined ? undefined : typeof detail.result === 'string' ? detail.result : stringify(detail.result)
  return (
    <div data-tool-view>
      <section data-pane="arguments" className="dsh-context-track-block">
        <h3>{t('arguments')}</h3>
        <pre className="dsh-context-track-pre">{detail.arguments}</pre>
      </section>
      <section data-pane="result" className="dsh-context-track-block">
        <h3>{t('result')}</h3>
        {resultText === undefined ? (
          <p className="dsh-context-track-muted">{t('pending')}</p>
        ) : (
          <pre className="dsh-context-track-pre">{resultText}</pre>
        )}
        <button
          type="button"
          data-slice="result"
          onClick={() => { onSlice(detail.result === undefined ? '' : detail.result) }}
        >
          {t('jsonSource')}
        </button>
      </section>
      {local ? (
        <button type="button" data-open-child onClick={onOpenChild}>{t('openChild')}</button>
      ) : null}
    </div>
  )
}

function withResults(hints: readonly ToolHint[], messages: unknown): ToolHint[] {
  return hints.map(hint => ({
    ...hint,
    resultLine: hint.resultLine ?? findResult(messages, hint.callId),
  }))
}

function findResult(messages: unknown, callId: string): string | undefined {
  if (!Array.isArray(messages)) return undefined
  for (const message of messages) {
    if (message === null || typeof message !== 'object') continue
    const row = message as { toolCallId?: unknown; source?: { callId?: unknown }; content?: unknown }
    const nested = row.source?.callId
    const id = typeof row.toolCallId === 'string' ? row.toolCallId : typeof nested === 'string' ? nested : undefined
    if (id !== callId) continue
    return firstLine(row.content ?? message)
  }
  return undefined
}

function firstLine(value: unknown): string {
  const text = typeof value === 'string' ? value : stringify(value)
  return (text.split('\n')[0] ?? '').trim()
}

function splitOutput(output: unknown): { answer: string; reasoning: string; chips: Record<string, unknown>[] } {
  const blocks = contentBlocks(output)
  if (blocks.length === 0) return { answer: messageText(output), reasoning: '', chips: [] }
  const answer: string[] = []
  const reasoning: string[] = []
  const chips: Record<string, unknown>[] = []
  for (const block of blocks) {
    if (block.type === 'tool-call') {
      chips.push(block)
      continue
    }
    if (typeof block.text !== 'string') continue
    if (block.type === 'reasoning') reasoning.push(block.text)
    else answer.push(block.text)
  }
  return { answer: answer.join(''), reasoning: reasoning.join(''), chips }
}

function contentBlocks(value: unknown): Record<string, unknown>[] {
  if (value === null || typeof value !== 'object') return []
  const content = (value as { content?: unknown }).content
  if (!Array.isArray(content)) return []
  return content.filter((block): block is Record<string, unknown> => block !== null && typeof block === 'object')
}

function messageText(message: unknown): string {
  if (typeof message === 'string') return message
  if (message === null || typeof message !== 'object') return stringify(message)
  const row = message as { text?: unknown; content?: unknown }
  if (typeof row.text === 'string') return row.text
  if (typeof row.content === 'string') return row.content
  const blocks = contentBlocks(message)
  if (blocks.length === 0) return stringify(message)
  return blocks.map(block => (typeof block.text === 'string' ? block.text : '')).join('')
}

function roleOf(message: unknown): string | undefined {
  if (message === null || typeof message !== 'object') return undefined
  const role = (message as { role?: unknown }).role
  return typeof role === 'string' ? role : undefined
}

function summarize(value: unknown): string {
  const text = typeof value === 'string' ? value : value === undefined ? '' : stringify(value)
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > 80 ? `${flat.slice(0, 80)}…` : flat
}

function chipId(block: Record<string, unknown>, index: number): string {
  return typeof block.id === 'string' ? block.id : `chip-${index}`
}

function labelStatus(status: string, t: (key: TrackKey) => string): string {
  if (status === 'running' || status === 'error' || status === 'aborted') return t(status)
  return status
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function textOf(...parts: unknown[]): string {
  return parts.filter(part => part !== undefined && part !== null && part !== '').map(part => String(part)).join(' ')
}

function stringify(value: unknown): string {
  if (typeof value === 'string') return value
  if (value === undefined) return ''
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}
