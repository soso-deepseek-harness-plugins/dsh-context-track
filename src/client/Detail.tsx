/** Reading view of one node, or the same node as JSON. The call result sits after the input. */
import { useLayoutEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode, type RefObject } from 'react'
import { classifyWindow, sourceLabel, type CategoryId, type ClassifiedItem } from '../shared/classify.js'
import { isMissing, type AttemptDetail, type NodeDetail, type SearchDetail, type StepRunningDetail, type TitleDetail, type ToolDetail } from '../shared/detail.js'
import { estimateMessage } from '../shared/estimate.js'
import { parseUsage } from '../shared/figures.js'
import { childExpandable } from '../shared/model.js'
import { compositeJson, JsonView } from './JsonView.js'
import type { TrackKey } from './locales.js'
import { MarkdownView } from './MarkdownView.js'
import { abbreviate, copyText } from './format.js'
import { CATEGORY_KEY } from './widgets.js'

const PREVIEW_LINES = 8

export interface DetailProps {
  detail: NodeDetail | undefined
  nodeKey: string
  t: (key: TrackKey) => string
  scrollerRef: RefObject<HTMLElement | null>
  onOpenChild?: () => void
  /** Trail from the round to the open node. Each entry that carries an id is clickable. */
  crumbs?: readonly { id?: string; label: string }[]
  onCrumb?: (nodeId: string) => void
  onClose?: () => void
  /** Narrow tiers offer a return control instead of a collapse control. */
  onBack?: () => void
  /** Category the summary band jumped to. The first matching card scrolls into view. */
  focusCategory?: CategoryId
}

type ViewName = 'reading' | 'json'

/** One node. A visited view stays mounted, so its folds and scroll survive the round trip. */
export function Detail({
  detail, nodeKey, t, scrollerRef, onOpenChild, crumbs, onCrumb, onClose, onBack, focusCategory,
}: DetailProps): ReactNode {
  const [view, setView] = useState<ViewName>('reading')
  const [slice, setSlice] = useState<unknown>(undefined)
  const [visited, setVisited] = useState<Readonly<Record<ViewName, boolean>>>({ reading: true, json: false })
  const [copied, setCopied] = useState(false)
  const memory = useRef<Record<ViewName, number>>({ reading: 0, json: 0 })
  const viewRef = useRef(view)
  viewRef.current = view

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (scroller !== null) scroller.scrollTop = memory.current[view]
  }, [view, nodeKey, scrollerRef])

  useLayoutEffect(() => {
    if (focusCategory === undefined) return
    const scroller = scrollerRef.current
    const card = scroller?.querySelector(`[data-focus="true"]`)
    if (card instanceof HTMLElement) card.scrollIntoView?.({ block: 'nearest' })
  }, [focusCategory, scrollerRef])

  const rememberScroll = () => {
    const scroller = scrollerRef.current
    if (scroller !== null) memory.current[viewRef.current] = scroller.scrollTop
  }

  const choose = (next: ViewName) => {
    rememberScroll()
    setSlice(undefined)
    setVisited(current => ({ ...current, [next]: true }))
    setView(next)
  }

  const openSlice = (value: unknown) => {
    rememberScroll()
    setSlice(value)
    setVisited(current => ({ ...current, json: true }))
    setView('json')
  }

  const copyNode = () => {
    if (detail === undefined) return
    void copyText(JSON.stringify(detail, null, 2))
    setCopied(true)
    setTimeout(() => { setCopied(false) }, 1200)
  }

  const failed = detail !== undefined && isMissing(detail)
  return (
    <div data-view={view} data-node={nodeKey} className="dsh-context-track-detail-inner">
      <header className="dsh-context-track-detail-head" data-detail-head>
        {onBack !== undefined ? (
          <button type="button" data-detail-back onClick={onBack}>
            <span aria-hidden="true">←</span> {t('back')}
          </button>
        ) : null}
        <nav className="dsh-context-track-crumbs" data-crumbs aria-label={t('detailPane')}>
          {(crumbs ?? []).map((crumb, index) => {
            const crumbId = crumb.id
            return (
              <span key={`${crumbId ?? 'self'}-${index}`} className="dsh-context-track-crumb">
                {index > 0 ? <span aria-hidden="true" className="dsh-context-track-crumb-sep">/</span> : null}
                {crumbId === undefined || onCrumb === undefined ? (
                  <span data-crumb-current>{crumb.label}</span>
                ) : (
                  <button type="button" data-crumb={crumbId} onClick={() => { onCrumb(crumbId) }}>
                    {crumb.label}
                  </button>
                )}
              </span>
            )
          })}
        </nav>
        <div className="dsh-context-track-views">
          <button type="button" data-view-toggle="reading" aria-pressed={view === 'reading'} onClick={() => { choose('reading') }}>
            {t('reading')}
          </button>
          <button type="button" data-view-toggle="json" aria-pressed={view === 'json'} onClick={() => { choose('json') }}>
            {t('jsonView')}
          </button>
        </div>
        <button type="button" data-copy-node aria-live="polite" onClick={copyNode}>
          {copied ? t('copied') : t('copyJson')}
        </button>
        {onClose !== undefined ? (
          <button type="button" data-detail-close aria-label={t('closeDetail')} onClick={onClose}>
            <span aria-hidden="true">✕</span>
          </button>
        ) : null}
      </header>
      {detail === undefined ? <p className="dsh-context-track-muted">{t('hint')}</p> : null}
      {failed ? <p className="dsh-context-track-muted">{t('missing')}</p> : null}
      {detail === undefined || failed ? null : (
        <>
          {/* The JSON pane precedes the reading pane so a first-match query finds it once both stay mounted. */}
          {visited.json ? (
            <div data-view-pane="json" hidden={view !== 'json'}>
              <JsonPane detail={detail} slice={slice} t={t} />
            </div>
          ) : null}
          <div data-view-pane="reading" hidden={view !== 'reading'}>
            <Structured
              detail={detail}
              t={t}
              onOpenChild={onOpenChild}
              onSlice={openSlice}
              focusCategory={focusCategory}
            />
          </div>
        </>
      )}
    </div>
  )
}

function Structured({
  detail, t, onOpenChild, onSlice, focusCategory,
}: {
  detail: Exclude<NodeDetail, { missing: true }>
  t: (key: TrackKey) => string
  onOpenChild?: () => void
  onSlice: (value: unknown) => void
  focusCategory?: CategoryId
}): ReactNode {
  if (detail.kind === 'attempt' || detail.kind === 'step') {
    return (
      <div data-io>
        <Facts detail={detail} t={t} />
        <InputCards
          messages={detail.messages}
          tools={detail.tools}
          newFrom={detail.newFrom}
          t={t}
          onSlice={onSlice}
          focusCategory={focusCategory}
        />
        {detail.kind === 'attempt' ? (
          <OutputCards output={detail.output} usage={detail.usage} t={t} onSlice={onSlice} />
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
    if (detail.purpose === 'session-title') {
      return <TitleBody detail={detail} t={t} onSlice={onSlice} />
    }
    if (detail.purpose === 'web-search') {
      return <SearchBody detail={detail} t={t} />
    }
    return (
      <div className="dsh-context-track-prose" data-sidecar-body>
        <MarkdownView text={typeof detail.summary === 'string' ? detail.summary : stringify(detail.summary)} />
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
  return <FactList facts={facts} />
}

/** Session naming uses the same reading shape as a model call: facts, input, then output. */
function TitleBody({
  detail, t, onSlice,
}: {
  detail: TitleDetail
  t: (key: TrackKey) => string
  onSlice: (value: unknown) => void
}): ReactNode {
  const named = typeof detail.output === 'string' && detail.output.length > 0
  return (
    <div data-io data-title-body>
      <TitleFacts detail={detail} t={t} />
      <InputCards messages={titleMessages(detail)} tools={undefined} t={t} onSlice={onSlice} />
      {named ? (
        <OutputCards output={detail.output} t={t} onSlice={onSlice} />
      ) : (
        <section data-output="unseen" className="dsh-context-track-block">
          <h3>{t('output')}</h3>
          <p data-session-name className="dsh-context-track-muted">{t('titleMissing')}</p>
        </section>
      )}
    </div>
  )
}

function TitleFacts({
  detail, t,
}: {
  detail: TitleDetail
  t: (key: TrackKey) => string
}): ReactNode {
  const route = record(detail.route)
  const facts: Fact[] = []
  if (typeof detail.route === 'string') {
    pushFact(facts, 'route', t('routeLabel'), text(detail.route))
  } else {
    pushFact(facts, 'model', t('model'), text(route.model))
    pushFact(facts, 'provider', t('provider'), text(route.provider))
  }
  pushFact(facts, 'reasoning', t('reasoning'), text(detail.reasoningEffort))
  const maxTokens = text(detail.maxTokens)
  if (maxTokens !== undefined) {
    facts.push({ key: 'maxTokens', label: t('maxOutput'), value: `${formatCount(detail.maxTokens)} token` })
  }
  facts.push({ key: 'status', label: t('finish'), value: labelStatus(detail.status, t), status: detail.status })
  return <FactList facts={facts} />
}

function titleMessages(detail: TitleDetail): unknown[] {
  const list = Array.isArray(detail.messages) ? detail.messages : []
  const system = systemMessage(detail.system)
  return system === undefined ? list : [system, ...list]
}

function systemMessage(system: unknown): unknown | undefined {
  if (typeof system === 'string') {
    if (system.trim().length === 0) return undefined
    return { role: 'system', content: [{ type: 'text', text: system }] }
  }
  if (system === null || typeof system !== 'object') return undefined
  const row = system as { role?: unknown; content?: unknown; text?: unknown }
  if (row.role === undefined && row.content === undefined && typeof row.text !== 'string') return undefined
  return system
}

function FactList({ facts }: { facts: readonly Fact[] }): ReactNode {
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
  messages, tools, newFrom, t, onSlice, focusCategory,
}: {
  messages: unknown
  tools: unknown
  /** Index of the first message this call added over the previous one. */
  newFrom?: number
  t: (key: TrackKey) => string
  onSlice: (value: unknown) => void
  focusCategory?: CategoryId
}): ReactNode {
  const list = Array.isArray(messages) ? messages : []
  const classified = useMemo(() => classifyWindow(list, tools), [list, tools])
  return (
    <div data-input>
      <h3 className="dsh-context-track-section">{t('messages')}</h3>
      {list.map((message, index) => {
        const item = classified.items.find(entry => entry.message === message)
        const focused = focusCategory !== undefined && item?.category === focusCategory
        return (
          <MessageCard
            key={index}
            message={message}
            item={item}
            t={t}
            onSlice={onSlice}
            focused={focused}
            isNew={newFrom !== undefined && index === newFrom}
          />
        )
      })}
    </div>
  )
}

/** Thinking sits in its own card. The result card keeps the written answer, tool calls, and output tokens. */
function OutputCards({
  output, usage, t, onSlice,
}: {
  output: unknown
  usage?: unknown
  t: (key: TrackKey) => string
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
  const answer = outputAnswer(output)
  const thought = outputThought(output)
  const calls = outputCalls(output)
  const outputTokens = parseUsage(usage)?.outputTokens
  return (
    <div data-output>
      {thought.length > 0 ? (
        <section data-reasoning className="dsh-context-track-block dsh-context-track-reasoning">
          <header className="dsh-context-track-output-meta">
            <h3>{t('think')}</h3>
          </header>
          <ReadingBody text={thought} faint t={t} />
        </section>
      ) : null}
      <section className="dsh-context-track-block dsh-context-track-output" data-category="history">
        <header className="dsh-context-track-output-meta">
          <h3>{t('output')}</h3>
          {outputTokens !== undefined ? (
            <span data-output-tokens className="dsh-context-track-output-tokens">
              <TokenMark basis="usage" value={outputTokens} />
            </span>
          ) : null}
          <button type="button" data-open-json onClick={() => { onSlice(output) }}>
            {t('openInJson')}
          </button>
        </header>
        {answer.length > 0 ? <ReadingBody text={answer} t={t} /> : null}
        {calls.map((block, index) => <OutputCall key={callKey(block, index)} block={block} t={t} />)}
      </section>
    </div>
  )
}

/** A tool call the model wrote: its name, then the arguments as highlighted JSON. */
function OutputCall({ block, t }: { block: Record<string, unknown>; t: (key: TrackKey) => string }): ReactNode {
  const name = typeof block.name === 'string' && block.name.length > 0 ? block.name : t('tools')
  const args = block.arguments
  const hasArgs = args !== undefined && args !== null && args !== ''
  return (
    <div data-output-call>
      <p className="dsh-context-track-output-call-name">{name}</p>
      {hasArgs ? <JsonView value={args} t={t} chrome={false} /> : null}
    </div>
  )
}

/** Exact usage is `token=n`. A character estimate is `token≈n`. No exact or estimated caption. */
function TokenMark({ basis, value }: { basis: 'usage' | 'estimated'; value: number }): ReactNode {
  const shown = abbreviate(value)
  const mark = basis === 'usage' ? `token=${shown.text}` : `token≈${shown.text}`
  if (!shown.abbreviated) {
    return <span className="dsh-context-track-num" data-basis={basis}>{mark}</span>
  }
  return (
    <button
      type="button"
      className="dsh-context-track-num"
      title={basis === 'usage' ? `token=${shown.full}` : `token≈${shown.full}`}
      data-full={shown.full}
      onClick={(event: MouseEvent) => {
        event.stopPropagation()
        void copyText(shown.full)
      }}
    >
      {mark}
    </button>
  )
}

function callKey(block: Record<string, unknown>, index: number): string {
  return typeof block.id === 'string' && block.id.length > 0 ? block.id : `${index}`
}

function outputCalls(output: unknown): Record<string, unknown>[] {
  return contentBlocks(output).filter(block => block.type === 'tool-call')
}

/** Written answer. A plain string is the whole output. Reasoning never fills this card. */
function outputAnswer(output: unknown): string {
  if (typeof output === 'string') return output
  const blocks = contentBlocks(output)
  const answer = blockText(blocks, 'text')
  if (answer.length > 0) return answer
  return blocks.length === 0 ? messageText(output) : ''
}

function outputThought(output: unknown): string {
  if (typeof output === 'string') return ''
  return blockText(contentBlocks(output), 'reasoning')
}

function blockText(blocks: readonly Record<string, unknown>[], type: string): string {
  return blocks
    .filter(block => block.type === type && typeof block.text === 'string' && block.text.trim().length > 0)
    .map(block => String(block.text))
    .join('\n\n')
}

/** Full-node JSON is two documents. A sliced message stays a single document. */
function JsonPane({
  detail, slice, t,
}: {
  detail: Exclude<NodeDetail, { missing: true }>
  slice: unknown
  t: (key: TrackKey) => string
}): ReactNode {
  if (slice !== undefined) return <JsonView value={slice} t={t} />
  const parts = jsonParts(detail)
  if (parts === undefined) return <JsonView value={detail} t={t} />
  return (
    <div data-json-split>
      <section data-json-part="input" className="dsh-context-track-block">
        <h3>{t('input')}</h3>
        <JsonView value={parts.input} t={t} />
      </section>
      <section data-json-part="output" className="dsh-context-track-block">
        <h3>{t('output')}</h3>
        <JsonView value={parts.output} t={t} />
      </section>
    </div>
  )
}

function jsonParts(detail: Exclude<NodeDetail, { missing: true }>): { input: unknown; output: unknown } | undefined {
  if (detail.kind === 'attempt' || detail.kind === 'step') {
    return {
      input: pick(detail, ['inputSeq', 'messages', 'tools', 'toolHistory', 'config', 'adapterDefaults', 'context']),
      output: detail.kind === 'step'
        ? { status: detail.status }
        : pick(detail, ['status', 'output', 'usage', 'firstTokenTime', 'streamDuration', 'interrupted', 'retry']),
    }
  }
  if (detail.kind === 'tool') {
    return {
      input: pick(detail, ['name', 'callId', 'arguments', 'childSessionId', 'childLabel', 'childMode']),
      output: pick(detail, ['status', 'result']),
    }
  }
  if (detail.kind === 'sidecar' && detail.purpose === 'compaction') {
    return {
      input: pick(detail, ['messages', 'tools', 'toolHistory', 'config', 'instruction', 'provider', 'model', 'maxTokens']),
      output: pick(detail, ['status', 'summary', 'rawOutput', 'usage', 'error']),
    }
  }
  if (detail.kind === 'sidecar' && detail.purpose === 'session-title') {
    return {
      input: pick(detail, ['system', 'messages', 'route', 'maxTokens', 'reasoningEffort']),
      output: pick(detail, ['status', 'output']),
    }
  }
  return undefined
}

function pick(source: object, keys: readonly string[]): Record<string, unknown> {
  const row = source as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const key of keys) {
    if (row[key] !== undefined) out[key] = row[key]
  }
  return out
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
  message, item, t, onSlice, faint = false, focused = false, isNew = false,
}: {
  message: unknown
  item?: ClassifiedItem
  t: (key: TrackKey) => string
  onSlice: (value: unknown) => void
  faint?: boolean
  focused?: boolean
  /** First card this call added over the previous call's window. */
  isNew?: boolean
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
      data-focus={focused ? 'true' : undefined}
      data-new={isNew ? 'true' : undefined}
    >
      {isNew ? (
        <header className="dsh-context-track-new" data-new-mark>
          <span className="dsh-context-track-new-badge">{t('newMessages')}</span>
          <span className="dsh-context-track-new-rule" aria-hidden="true" />
        </header>
      ) : null}
      <table className="dsh-context-track-meta">
        <tbody>
          {role.length > 0 ? <MetaRow label={t('role')} value={role} /> : null}
          {category !== undefined ? <MetaRow label={t('category')} value={t(CATEGORY_KEY[category])} /> : null}
          <tr>
            <td colSpan={2}><TokenMark basis="estimated" value={tokens} /></td>
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

function ToolBody({
  detail, t, onOpenChild, onSlice,
}: {
  detail: ToolDetail
  t: (key: TrackKey) => string
  onOpenChild?: () => void
  onSlice: (value: unknown) => void
}): ReactNode {
  const local = detail.childSessionId !== undefined && childExpandable(detail.childMode)
  return (
    <div data-tool-view>
      <section data-pane="arguments" className="dsh-context-track-block">
        <h3>{t('arguments')}</h3>
        <JsonView value={detail.arguments} t={t} />
      </section>
      <section data-pane="result" className="dsh-context-track-block">
        <h3>{t('result')}</h3>
        {detail.result === undefined ? (
          <p className="dsh-context-track-muted">{t('pending')}</p>
        ) : (
          <JsonView value={detail.result} t={t} />
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

/** Search sidecar: who triggered it, then the query and the scrubbed request. */
function SearchBody({
  detail, t,
}: {
  detail: SearchDetail
  t: (key: TrackKey) => string
}): ReactNode {
  const query = record(detail.request).query
  const source = detail.source
  const trigger = source?.kind === 'tool'
    ? source.name
    : source?.kind === 'attempt'
      ? source.attempt !== undefined
        ? `${t('step').replace('{n}', String(source.step))} · ${t('attempt').replace('{n}', String(source.attempt))}`
        : t('step').replace('{n}', String(source.step))
      : undefined
  return (
    <div data-search-body>
      {source !== undefined && trigger !== undefined ? (
        <section data-pane="source" className="dsh-context-track-block">
          <h3>{t('trigger')}</h3>
          <p data-search-trigger>{trigger}</p>
          {source.kind === 'tool' && source.arguments !== undefined ? (
            <>
              <h3>{t('arguments')}</h3>
              <JsonView value={source.arguments} t={t} />
            </>
          ) : null}
          {source.kind === 'attempt' && source.output !== undefined ? (
            <JsonView value={source.output} t={t} />
          ) : null}
        </section>
      ) : null}
      <section data-pane="request" className="dsh-context-track-block">
        <h3>{t('request')}</h3>
        {typeof query === 'string' && query.length > 0 ? (
          <table className="dsh-context-track-meta">
            <tbody>
              <MetaRow label={t('query')} value={query} />
            </tbody>
          </table>
        ) : null}
        {detail.request === undefined ? (
          <p className="dsh-context-track-muted">{t('notSeen')}</p>
        ) : (
          <JsonView value={detail.request} t={t} />
        )}
      </section>
    </div>
  )
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

function summarize(value: unknown): string {
  const text = typeof value === 'string' ? value : value === undefined ? '' : stringify(value)
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > 80 ? `${flat.slice(0, 80)}…` : flat
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
