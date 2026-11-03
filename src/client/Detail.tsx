/** Reading view of one node, or the same node as JSON. The call result sits above the input. */
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { classifyWindow, sourceLabel, type CategoryId, type ClassifiedItem } from '../shared/classify.js'
import { isMissing, type AttemptDetail, type NodeDetail, type StepRunningDetail, type ToolDetail } from '../shared/detail.js'
import { estimateMessage } from '../shared/estimate.js'
import { childExpandable } from '../shared/model.js'
import { ToolList } from './Inspector.js'
import { compositeJson, JsonView } from './JsonView.js'
import type { TrackKey } from './locales.js'
import { MarkdownView } from './MarkdownView.js'
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

type ViewName = 'reading' | 'json'

/** One node. Switching views restores the scroll each view last had. */
export function Detail({
  detail, nodeKey, t, scrollerRef, toolHints = [], onSelectTool, onOpenChild,
}: DetailProps): ReactNode {
  const [view, setView] = useState<ViewName>('reading')
  const [slice, setSlice] = useState<unknown>(undefined)
  const memory = useRef<Record<ViewName, number>>({ reading: 0, json: 0 })
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
        <button type="button" data-view-toggle="reading" aria-pressed={view === 'reading'} onClick={() => { choose('reading') }}>
          {t('reading')}
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
        {detail.kind === 'attempt' ? (
          <OutputCards output={detail.output} hints={hints} t={t} onSelectTool={onSelectTool} onSlice={onSlice} />
        ) : (
          <section data-output="unseen" className="dsh-context-track-block">
            <h3>{t('output')}</h3>
            <p className="dsh-context-track-muted">{t('notSeen')}</p>
          </section>
        )}
        <InputCards messages={detail.messages} tools={detail.tools} t={t} onSlice={onSlice} />
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
    return (
      <div className="dsh-context-track-prose" data-sidecar-body>
        <MarkdownView text={typeof text === 'string' ? text : stringify(text)} />
      </div>
    )
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
  const defaults = record(detail.adapterDefaults)
  const facts: Fact[] = []
  pushFact(facts, 'model', t('model'), text(config.model))
  pushFact(facts, 'provider', t('provider'), text(config.provider))
  pushFact(facts, 'temperature', t('temperature'), text(config.temperature))
  pushFact(facts, 'reasoning', t('reasoning'), text(config.reasoningEffort), defaults.reasoningEffort === true ? t('adapterDefault') : undefined)
  const maxTokens = text(config.maxTokens)
  if (maxTokens !== undefined) {
    facts.push({
      key: 'maxTokens',
      label: t('maxOutput'),
      value: `${formatCount(config.maxTokens)} token`,
      ...(defaults.maxTokens === true ? { note: t('adapterDefault') } : {}),
    })
  }
  facts.push({ key: 'window', label: t('windowLabel'), value: String(detail.inputSeq) })
  facts.push({ key: 'status', label: t('finish'), value: labelStatus(detail.status, t), status: detail.status })
  if (detail.kind === 'attempt' && detail.retry !== undefined) {
    pushFact(facts, 'retry', t('retry'), summarize(detail.retry.failure))
    facts.push({ key: 'delay', label: t('retryDelay'), value: `${detail.retry.delayMs} ms` })
  }
  return (
    <div className="dsh-context-track-facts" data-facts>
      {facts.map(fact => (
        <div key={fact.key} data-fact={fact.key}>
          <span className="dsh-context-track-fact-label">{fact.label}</span>
          <span className="dsh-context-track-fact-value">
            <span data-fact-value data-status={fact.status}>{fact.value}</span>
            {fact.note !== undefined ? <span className="dsh-context-track-fact-note">{fact.note}</span> : null}
          </span>
        </div>
      ))}
    </div>
  )
}

interface Fact {
  key: string
  label: string
  value: string
  note?: string
  status?: string
}

function pushFact(facts: Fact[], key: string, label: string, value: string | undefined, note?: string): void {
  if (value === undefined) return
  facts.push({ key, label, value, ...(note !== undefined ? { note } : {}) })
}

function text(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return formatCount(value)
  if (typeof value === 'string' && value.length > 0) return value
  return undefined
}

function formatCount(value: unknown): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return ''
  if (!Number.isInteger(value) || Math.abs(value) < 1000) return String(value)
  const sign = value < 0 ? '-' : ''
  return sign + String(Math.abs(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function InputCards({
  messages, tools, t, onSlice,
}: {
  messages: unknown
  tools: unknown
  t: (key: TrackKey) => string
  onSlice: (value: unknown) => void
}): ReactNode {
  const list = Array.isArray(messages) ? messages : []
  const classified = useMemo(() => classifyWindow(list, tools), [list, tools])
  return (
    <div data-input>
      <h3 className="dsh-context-track-section">{t('messages')}</h3>
      {list.map((message, index) => {
        const item = classified.items.find(entry => entry.message === message)
        return <MessageCard key={index} message={message} item={item} t={t} onSlice={onSlice} />
      })}
      <ToolList tools={classified.tools} overhead={classified.definitionOverhead} t={t} searchable />
    </div>
  )
}

function OutputCards({
  output, hints, t, onSelectTool, onSlice,
}: {
  output: unknown
  hints: readonly ToolHint[]
  t: (key: TrackKey) => string
  onSelectTool?: (hint: ToolHint) => void
  onSlice: (value: unknown) => void
}): ReactNode {
  if (output === undefined) {
    return (
      <section data-output="unseen" className="dsh-context-track-block">
        <h3>{t('output')}</h3>
        <p className="dsh-context-track-muted">{t('pending')}</p>
      </section>
    )
  }
  const blocks = contentBlocks(output)
  const texts = blocks.filter(block => block.type !== 'tool-call' && block.type !== 'reasoning' && typeof block.text === 'string' && block.text.length > 0)
  const thoughts = blocks.filter(block => block.type === 'reasoning' && typeof block.text === 'string' && block.text.length > 0)
  const calls = blocks.filter(block => block.type === 'tool-call')
  const loose = blocks.length === 0 ? messageText(output) : ''
  const panes: OutputPane[] = [
    ...(texts.length > 0 || loose.length > 0 ? ['answer' as const] : []),
    ...(thoughts.length > 0 ? ['reasoning' as const] : []),
    ...(calls.length > 0 ? ['tools' as const] : []),
  ]
  const signature = `${texts.length}:${thoughts.length}:${calls.length}:${loose.slice(0, 24)}`
  const [pane, setPane] = useState<OutputPane>(panes[0] ?? 'answer')
  const [seen, setSeen] = useState(signature)
  if (seen !== signature) {
    setSeen(signature)
    setPane(panes[0] ?? 'answer')
  }
  const active = panes.includes(pane) ? pane : (panes[0] ?? 'answer')
  const role = roleOf(output) ?? 'assistant'
  const priced = output !== null && typeof output === 'object'
    ? { ...(output as Record<string, unknown>), role }
    : { role, content: [{ type: 'text', text: loose }] }
  return (
    <div data-output>
      <section className="dsh-context-track-block dsh-context-track-output" data-category="history">
        <header className="dsh-context-track-output-head">
          <div className="dsh-context-track-output-title">
            <h3>{t('thisOutput')}</h3>
            <p className="dsh-context-track-output-summary">
              <span>{t('assistantReply')}</span>
              <span className="dsh-context-track-muted">{role}</span>
              <FigureView figure={{ basis: 'estimated', value: estimateMessage(priced) }} t={t} />
            </p>
          </div>
          <button type="button" data-open-json onClick={() => { onSlice(output) }}>
            {t('openInJson')}
          </button>
        </header>
        {panes.length > 1 ? (
          <div className="dsh-context-track-segments" role="tablist">
            {panes.map(name => (
              <button
                key={name}
                type="button"
                role="tab"
                data-output-tab={name}
                aria-selected={active === name}
                onClick={() => { setPane(name) }}
              >
                {outputPaneLabel(name, name === 'tools' ? calls.length : name === 'reasoning' ? thoughts.length : texts.length, t)}
              </button>
            ))}
          </div>
        ) : null}
        {panes.includes('answer') ? (
          <div data-output-panel="answer" hidden={active === 'answer' ? undefined : true}>
            {texts.map((block, index) => (
              <ReadingBody key={chipId(block, index)} text={String(block.text)} t={t} />
            ))}
            {loose.length > 0 ? <ReadingBody text={loose} t={t} /> : null}
          </div>
        ) : null}
        {panes.includes('reasoning') ? (
          <div data-output-panel="reasoning" hidden={active === 'reasoning' ? undefined : true}>
            {thoughts.map((block, index) => (
              <ReadingBody key={`think-${index}`} text={String(block.text)} faint t={t} />
            ))}
          </div>
        ) : null}
        {panes.includes('tools') ? (
          <div data-output-panel="tools" hidden={active === 'tools' ? undefined : true}>
            {calls.map((block, index) => (
              <OutputCall key={chipId(block, index)} block={block} hints={hints} t={t} onSelectTool={onSelectTool} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}

type OutputPane = 'answer' | 'reasoning' | 'tools'

function outputPaneLabel(pane: OutputPane, count: number, t: (key: TrackKey) => string): string {
  const name = pane === 'answer' ? t('answer') : pane === 'reasoning' ? t('think') : t('tools')
  return count > 1 ? `${name} ${count}` : name
}

function OutputCall({
  block, hints, t, onSelectTool,
}: {
  block: Record<string, unknown>
  hints: readonly ToolHint[]
  t: (key: TrackKey) => string
  onSelectTool?: (hint: ToolHint) => void
}): ReactNode {
  const args = block.arguments
  const preview = typeof args === 'string' ? args : args === undefined ? '' : stringify(args)
  const expandable = preview.length > 0
  const [open, setOpen] = useState(preview.length > 0 && preview.length <= 160 && !preview.includes('\n'))
  return (
    <div data-output-call className="dsh-context-track-call">
      <div className="dsh-context-track-call-head">
        {expandable ? (
          <button
            type="button"
            className="dsh-context-track-chevron"
            aria-expanded={open}
            aria-label={open ? t('collapse') : t('expand')}
            onClick={() => { setOpen(value => !value) }}
          >
            <span aria-hidden="true">{open ? '▾' : '▸'}</span>
          </button>
        ) : (
          <span className="dsh-context-track-chevron" aria-hidden="true" />
        )}
        <ToolChip block={block} hints={hints} t={t} onSelectTool={onSelectTool} />
      </div>
      {expandable ? (
        <div data-call-body hidden={open ? undefined : true}>
          <JsonOrMarkdown value={args} t={t} />
        </div>
      ) : null}
    </div>
  )
}

/** Markdown, or foldable JSON when the whole block is an object or array. */
function ReadingBody({
  text, faint = false, t,
}: {
  text: string
  faint?: boolean
  t: (key: TrackKey) => string
}): ReactNode {
  const embedded = faint ? undefined : compositeJson(text)
  const [open, setOpen] = useState(false)
  const lines = text.split('\n')
  const clampable = embedded === undefined && lines.length > PREVIEW_LINES
  const clamped = clampable && !open
  const shown = clamped ? lines.slice(0, PREVIEW_LINES).join('\n') : text
  return (
    <div
      className={faint ? 'dsh-context-track-reasoning' : undefined}
      data-folded={faint && !open ? 'true' : undefined}
      data-clamped={clamped ? 'true' : undefined}
    >
      {embedded !== undefined ? (
        <JsonView value={embedded} t={t} />
      ) : (
        <div className="dsh-context-track-prose">
          <MarkdownView text={shown} />
        </div>
      )}
      {clampable ? (
        <button type="button" data-more onClick={() => { setOpen(value => !value) }}>
          {open ? t('collapse') : t('showRest')}
        </button>
      ) : null}
    </div>
  )
}

function MessageCard({
  message, item, t, onSlice, faint = false,
}: {
  message: unknown
  item?: ClassifiedItem
  t: (key: TrackKey) => string
  onSlice: (value: unknown) => void
  faint?: boolean
}): ReactNode {
  const text = messageText(message)
  const embedded = faint ? undefined : compositeJson(text)
  const [open, setOpen] = useState(false)
  const lines = text.split('\n')
  const clampable = embedded === undefined && lines.length > PREVIEW_LINES
  const clamped = clampable && !open
  const shown = clamped ? lines.slice(0, PREVIEW_LINES).join('\n') : text
  const role = item?.role ?? roleOf(message) ?? ''
  const category = item?.category
  const folded = category === 'system' || faint
  const tokens = item?.tokens ?? estimateMessage(message, category === 'system')
  const source = sourceCell(message, category)
  const tool = category === 'tool-results' || category === 'skill' ? item?.toolName : undefined
  const callId = callIdOf(message)
  return (
    <section
      className={faint ? 'dsh-context-track-block dsh-context-track-reasoning' : 'dsh-context-track-block'}
      data-category={category}
      data-folded={folded && !open ? 'true' : undefined}
      data-clamped={clamped ? 'true' : undefined}
    >
      <table className="dsh-context-track-meta">
        <tbody>
          {role.length > 0 ? <MetaRow label={t('role')} value={role} /> : null}
          {category !== undefined ? <MetaRow label={t('category')} value={t(CATEGORY_KEY[category])} /> : null}
          <tr>
            <th scope="row">{t('tokenLabel')}</th>
            <td><FigureView figure={{ basis: 'estimated', value: tokens }} t={t} /></td>
          </tr>
          {source !== undefined ? <MetaRow label={t('source')} value={source} /> : null}
          {tool !== undefined ? <MetaRow label={t('toolName')} value={tool} /> : null}
          {callId !== undefined ? <MetaRow label={t('call')} value={callId} /> : null}
        </tbody>
      </table>
      {embedded !== undefined ? (
        <JsonView value={embedded} t={t} />
      ) : (
        <div className="dsh-context-track-prose">
          <MarkdownView text={shown} />
        </div>
      )}
      {clampable ? (
        <button type="button" data-more onClick={() => { setOpen(value => !value) }}>
          {open ? t('collapse') : t('showRest')}
        </button>
      ) : null}
      <button type="button" data-open-json onClick={() => { onSlice(message) }}>
        {t('openInJson')}
      </button>
    </section>
  )
}

function MetaRow({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>{value}</td>
    </tr>
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
        <JsonOrMarkdown value={detail.arguments} t={t} />
      </section>
      <section data-pane="result" className="dsh-context-track-block">
        <h3>{t('result')}</h3>
        {resultText === undefined ? (
          <p className="dsh-context-track-muted">{t('pending')}</p>
        ) : (
          <JsonOrMarkdown value={detail.result} t={t} />
        )}
        <button
          type="button"
          data-slice="result"
          onClick={() => { onSlice(detail.result === undefined ? '' : detail.result) }}
        >
          {t('openInJson')}
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

function callIdOf(message: unknown): string | undefined {
  if (message === null || typeof message !== 'object') return undefined
  const direct = (message as { toolCallId?: unknown }).toolCallId
  if (typeof direct === 'string' && direct.length > 0) return direct
  const source = (message as { source?: unknown }).source
  if (source === null || typeof source !== 'object') return undefined
  const nested = (source as { callId?: unknown }).callId
  return typeof nested === 'string' && nested.length > 0 ? nested : undefined
}

function sourceCell(message: unknown, category: CategoryId | undefined): string | undefined {
  if (category !== 'injection' && category !== 'skill') return undefined
  if (message === null || typeof message !== 'object') return undefined
  const source = (message as { source?: unknown }).source
  if (source === null || typeof source !== 'object') return undefined
  return sourceLabel(message)
}

function JsonOrMarkdown({ value, t }: { value: unknown; t: (key: TrackKey) => string }): ReactNode {
  if (typeof value === 'string') {
    const parsed = tryParse(value)
    if (parsed !== undefined) return <JsonView value={parsed} t={t} />
    return (
      <div className="dsh-context-track-prose">
        <MarkdownView text={value} />
      </div>
    )
  }
  return <JsonView value={value} t={t} />
}

function tryParse(text: string): unknown {
  try {
    return JSON.parse(text) as unknown
  } catch {
    return undefined
  }
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
  if (status === 'ok' || status === 'running' || status === 'error' || status === 'aborted') return t(status)
  return status
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' ? value as Record<string, unknown> : {}
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
