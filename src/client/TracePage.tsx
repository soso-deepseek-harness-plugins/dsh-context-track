/**
 * Context-trace console. The conversation tab and the right sidebar are both
 * session-scoped. The left-sidebar centre page follows the session the shell
 * retains for the main view. Detail reads committed logs. It does not
 * subscribe to the token stream.
 */
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import { isMissing, type MissingDetail, type NodeDetail } from '../shared/detail.js'
import { billOf, sumUsage } from '../shared/figures.js'
import {
  defaultExpanded,
  emptyTrack,
  toggleExpanded,
  type RootNode,
  type SidecarNode,
  type TrackState,
  type TurnNode,
} from '../shared/model.js'
import '../shared/projection.js'
import type { EventKind, TurnReport } from '../shared/report.js'
import { Detail } from './Detail.js'
import { abbreviate, copyText, formatDuration, type ShownNumber } from './format.js'
import { EventAxis } from './EventAxis.js'
import { layoutForWidth } from './layout.js'
import type { TrackKey } from './locales.js'
import { ensureStyles } from './styles.js'
import './slots.js'
import { compactionPresent, reclaimedOf, TokenCard } from './TokenCard.js'
import { Tree, visibleTargets, type TreeCursor } from './Tree.js'

export interface TrackInject {
  getNode(sessionId: string, nodeId: string): Promise<RemoteResult<NodeDetail>>
  getTurn?(
    sessionId: string,
    turnId: string,
    attemptId: string,
  ): Promise<RemoteResult<TurnReport | MissingDetail>>
}

/** Content reappears once the drawer slide has landed, never mid-animation. */
const DETAIL_REVEAL_MS = 190

type SessionView = PropsRuntime<'conversation.view'>

export type TracePageProps = Omit<Pick<SessionView, 'sessionId' | 'useSessions'>, 'sessionId'> & PropsLocale<'dsh-context-track'> & TrackInject & {
  /** Absent on the centre page until the shell retains a session. */
  sessionId?: string
  /** `main` is the centre column opened from the left sidebar. */
  host?: 'main'
}

/** The session the shell is showing. Opening this panel does not change it. */
function mainSessionId(byId: object): string | undefined {
  for (const value of Object.values(byId)) {
    if (value === null || typeof value !== 'object') continue
    const row = value as { id?: unknown; retainedBy?: { mainView?: unknown } }
    const weight = row.retainedBy?.mainView
    if (typeof row.id === 'string' && typeof weight === 'number' && weight > 0) return row.id
  }
  return undefined
}

interface NodeSelection {
  sessionId: string
  nodeId: string
}

/**
 * Centre-column page for the left-sidebar row. The row's panel has no session
 * binding, so the console follows the retained main session.
 */
export function TraceMain(props: Omit<TracePageProps, 'sessionId' | 'host'>): ReactNode {
  const sessionId = props.useSessions(state => mainSessionId(state.byId))
  return <TracePage {...props} host="main" sessionId={sessionId} />
}

/** Turn rail and the selected turn's token, timing, tree, and events. */
export function TracePage({ sessionId, useSessions, t, getNode, getTurn, host }: TracePageProps): ReactNode {
  ensureStyles()
  const rootRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const layout = usePanelLayout(rootRef)
  const rootClass = host === 'main' ? 'dsh-context-track dsh-context-track-main' : 'dsh-context-track'
  const list = useSessions(state => state)
  const track = sessionId === undefined ? undefined : readTrack(list.projectionsBySession, sessionId) ?? emptyTrack()
  const turns = (track?.root ?? []).filter((node): node is TurnNode => node.kind === 'turn')
  const [open, setOpen] = useState<Readonly<Record<string, boolean>>>({})
  const [picked, setPicked] = useState<string | undefined>(undefined)
  const [node, setNode] = useState<NodeSelection | undefined>(undefined)
  const [pinned, setPinned] = useState(false)
  const [hover, setHover] = useState<string | undefined>(undefined)
  const [marker, setMarker] = useState<string | undefined>(undefined)
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined)
  const [attemptId, setAttemptId] = useState('')
  const [eventSeq, setEventSeq] = useState<number | undefined>(undefined)
  const [filter, setFilter] = useState<EventKind | undefined>(undefined)
  const [detail, setDetail] = useState<NodeDetail | undefined>(undefined)
  const [report, setReport] = useState<TurnReport | MissingDetail | undefined>(undefined)
  const [paneSize, setPaneSize] = useState<Partial<Record<PaneName, number>>>({})
  const [detailOpen, setDetailOpen] = useState(true)
  const [detailShown, setDetailShown] = useState(true)
  const revealTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const pickedTurn = turns.find(turn => turn.id === picked)
  const selectedTurn = marker !== undefined
    ? undefined
    : pickedTurn ?? turns.find(turn => turn.status === 'running') ?? turns[turns.length - 1]
  const translate = (key: TrackKey): string => t(key)

  useEffect(() => {
    setPicked(undefined)
    setNode(undefined)
    setDetail(undefined)
    setReport(undefined)
    setMarker(undefined)
    setPinned(false)
    setAttemptId('')
    setEventSeq(undefined)
    setActiveKey(undefined)
    setFilter(undefined)
  }, [sessionId])

  useEffect(() => () => { clearTimeout(revealTimer.current) }, [])

  /* Collapse hides the body first so the slide never lays it out at strip width.
   * Expand reveals the body once the slide has landed. The body stays mounted
   * either way, so views, folds, and scroll survive a collapse. */
  const toggleDetail = () => {
    clearTimeout(revealTimer.current)
    if (detailOpen) {
      setDetailShown(false)
      setDetailOpen(false)
      return
    }
    setDetailOpen(true)
    revealTimer.current = setTimeout(() => { setDetailShown(true) }, DETAIL_REVEAL_MS)
  }

  useEffect(() => {
    if (sessionId === undefined || node === undefined) return undefined
    let cancelled = false
    const showMissing = () => { if (!cancelled) setDetail({ missing: true }) }
    let pending: Promise<RemoteResult<NodeDetail>>
    try {
      pending = Promise.resolve(getNode(node.sessionId, node.nodeId))
    } catch {
      showMissing()
      return () => { cancelled = true }
    }
    void pending.then(result => {
      if (cancelled) return
      if (result == null || typeof result !== 'object' || !('ok' in result) || result.ok !== true) {
        setDetail({ missing: true })
        return
      }
      setDetail(result.value)
    }, showMissing)
    return () => { cancelled = true }
  }, [sessionId, node, track, getNode])

  const turnId = selectedTurn?.id
  useEffect(() => {
    if (sessionId === undefined || turnId === undefined || getTurn === undefined) return undefined
    let cancelled = false
    const showMissing = () => { if (!cancelled) setReport({ missing: true, target: 'turn' }) }
    let pending: Promise<RemoteResult<TurnReport | MissingDetail>>
    try {
      pending = Promise.resolve(getTurn(sessionId, turnId, attemptId))
    } catch {
      showMissing()
      return () => { cancelled = true }
    }
    void pending.then(result => {
      if (cancelled) return
      setReport(result.ok ? result.value : { missing: true, target: 'turn' })
    }, showMissing)
    return () => { cancelled = true }
  }, [sessionId, turnId, attemptId, track, getTurn])

  const cursors = sessionId === undefined
    ? []
    : visibleTargets(sessionId, track, open, id => readTrack(list.projectionsBySession, id), filter)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (sessionId === undefined || turns.length === 0) return
    const target = event.target
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
    if (target instanceof HTMLElement && target.getAttribute('role') === 'separator') return
    const index = cursorIndex(cursors, activeKey, selectedTurn?.id)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next = cursors[index + (event.key === 'ArrowDown' ? 1 : -1)]
      if (next !== undefined) selectCursor(next, false)
      return
    }
    const current = cursors[index]
    if (current === undefined) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      if (!current.expandable) return
      setOpen(state => ({ ...state, [current.key]: event.key === 'ArrowRight' }))
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      setPinned(true)
      if (current.kind === 'turn') setPicked(current.nodeId)
    }
  }

  const selectCursor = (cursor: TreeCursor, pin: boolean) => {
    if (sessionId === undefined) return
    setMarker(undefined)
    setActiveKey(cursor.key)
    if (pin) setPinned(true)
    const owner = turnContaining(turns, cursor.activateId) ?? turnContaining(turns, cursor.nodeId)
    if (owner !== undefined) setPicked(owner)
    if (cursor.kind === 'turn') {
      setNode(undefined)
      setDetail(undefined)
      setAttemptId('')
      return
    }
    setNode({ sessionId: cursor.sessionId, nodeId: cursor.activateId })
    setAttemptId(cursor.attemptId ?? '')
  }

  if (sessionId === undefined) {
    return <div className={rootClass}><p className="dsh-context-track-empty">{t('empty')}</p></div>
  }

  const shownReport = isTurnReport(report) ? report : undefined
  const watching = watchLabel(translate, selectedTurn, node?.nodeId, marker, track)
  const trackOf = (id: string) => readTrack(list.projectionsBySession, id)
  const nodeKey = `${sessionId}:${node?.nodeId ?? marker ?? 'turn'}`
  const failed = node !== undefined && detail !== undefined && isMissing(detail)
  return (
    <div
      ref={rootRef}
      className={rootClass}
      data-layout={layout}
      data-covering="false"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <Rail
        entries={railEntries(track?.root ?? [])}
        selectedId={selectedTurn?.id}
        hoverId={hover}
        pinned={pinned}
        size={paneSize.rail}
        t={translate}
        onHover={setHover}
        onTurn={id => {
          setMarker(undefined)
          setPicked(id)
          setNode({ sessionId, nodeId: id })
          setPinned(true)
          setActiveKey(`${sessionId}:${id}`)
          setAttemptId('')
        }}
        onMark={id => {
          setMarker(id)
          setNode({ sessionId, nodeId: id })
          setPinned(true)
          setActiveKey(`${sessionId}:${id}`)
        }}
      />
      {turns.length === 0 && marker === undefined ? (
        <p className="dsh-context-track-empty">{t('noCalls')}</p>
      ) : (
        <>
          <Grip
            pane="rail"
            vertical={layout === 'narrow'}
            min={112}
            keep={280}
            onSize={px => { setPaneSize(current => ({ ...current, rail: px })) }}
          />
          <div className="dsh-context-track-body">
          {marker === undefined && shownReport !== undefined ? (
            <div className="dsh-context-track-bill" data-bill data-rows="2" style={paneFlex(paneSize.bill)}>
              {watching.length > 0 ? <p data-watching>{t('watching').replace('{name}', watching)}</p> : null}
              <TokenCard
                report={shownReport}
                activeSeq={eventSeq}
                trackOf={trackOf}
                t={translate}
                onGap={seq => {
                  setEventSeq(seq)
                  const match = shownReport.events.find(item => item.seq === seq)
                  if (match?.nodeId !== undefined) {
                    setNode({ sessionId, nodeId: match.nodeId })
                    setPinned(true)
                  }
                }}
              >
                <EventAxis
                  events={shownReport.events}
                  filter={filter}
                  activeSeq={eventSeq}
                  t={translate}
                  onFilter={setFilter}
                  onSelect={event => {
                    setEventSeq(event.seq)
                    if (event.nodeId === undefined) return
                    setNode({ sessionId, nodeId: event.nodeId })
                    setPinned(true)
                    if (event.nodeId.startsWith('attempt:')) setAttemptId(event.nodeId)
                  }}
                />
              </TokenCard>
            </div>
          ) : null}
          {marker === undefined && shownReport !== undefined ? (
            <Grip
              pane="bill"
              vertical={layout === 'narrow'}
              min={180}
              keep={220}
              onSize={px => { setPaneSize(current => ({ ...current, bill: px })) }}
            />
          ) : null}
          <div className="dsh-context-track-split">
            <div className="dsh-context-track-tree" style={paneFlex(paneSize.tree)}>
              <Tree
                sessionId={sessionId}
                track={track}
                trackOf={trackOf}
                open={open}
                filter={filter}
                onToggle={(key, kind, status) => {
                  setOpen(current => toggleExpanded(current, key, defaultExpanded(kind, status)))
                }}
                selected={node}
                onSelect={(id, nodeId) => {
                  setMarker(undefined)
                  setNode({ sessionId: id, nodeId })
                  setPinned(true)
                  const owner = turnContaining(turns, nodeId)
                  if (owner !== undefined) setPicked(owner)
                }}
                onActivate={cursor => { setActiveKey(cursor.key) }}
                onAttempt={id => { setAttemptId(id) }}
                t={translate}
                now={Date.now()}
                turnBill={shownReport !== undefined && compactionPresent(shownReport) ? {
                  turnId: shownReport.id,
                  reclaimed: reclaimedOf(shownReport.events),
                  cost: shownReport.consumption.compaction,
                } : undefined}
              />
            </div>
            <Grip
              pane="tree"
              vertical={layout === 'narrow'}
              min={160}
              keep={160}
              onSize={px => { setPaneSize(current => ({ ...current, tree: px })) }}
            />
            <div className="dsh-context-track-detail" data-collapsed={detailOpen ? undefined : 'true'} ref={detailRef}>
              <button
                type="button"
                className="dsh-context-track-detail-toggle"
                data-detail-toggle
                aria-expanded={detailOpen}
                aria-label={detailOpen ? translate('collapse') : translate('expand')}
                onClick={toggleDetail}
              >
                <span aria-hidden="true">{detailOpen ? '▸' : '◂'}</span>
                {detailOpen ? null : <span>{translate('detailPane')}</span>}
              </button>
              <div className="dsh-context-track-detail-body" hidden={!detailShown}>
                {failed ? (
                  <p className="dsh-context-track-muted">{t('missing')}</p>
                ) : (
                  <Detail
                    key={nodeKey}
                    detail={node === undefined && marker === undefined ? undefined : detail}
                    nodeKey={nodeKey}
                    t={translate}
                    scrollerRef={detailRef}
                    onOpenChild={() => {
                      if (node === undefined) return
                      revealTool(sessionId, node.nodeId, turns, setOpen)
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  )
}

function Rail({
  entries, selectedId, hoverId, pinned, size, t, onHover, onTurn, onMark,
}: {
  entries: RailEntry[]
  selectedId?: string
  hoverId?: string
  pinned: boolean
  size?: number
  t: (key: TrackKey) => string
  onHover: (id: string | undefined) => void
  onTurn: (id: string) => void
  onMark: (id: string) => void
}): ReactNode {
  return (
    <div className="dsh-context-track-rail" style={paneFlex(size)} onMouseLeave={() => { onHover(undefined) }}>
      {entries.map(entry => entry.kind === 'turn' ? (
        <TurnFace
          key={entry.node.id}
          node={entry.node}
          current={selectedId === entry.node.id}
          hover={hoverId === entry.node.id}
          pinned={pinned && selectedId === entry.node.id}
          t={t}
          onHover={() => { onHover(entry.node.id) }}
          onTurn={() => { onTurn(entry.node.id) }}
        />
      ) : (
        <button
          key={entry.node.id}
          type="button"
          className="dsh-context-track-mark"
          data-mark={entry.node.id}
          onClick={() => { onMark(entry.node.id) }}
        >
          {entry.node.purpose === 'session-title' ? t('title') : entry.node.purpose === 'compaction' ? t('compaction') : t('search')}
        </button>
      ))}
    </div>
  )
}

/** Name on the first line, clock and tokens on the second, so a narrow rail cannot glue them together. */
function TurnFace({
  node, current, hover, pinned, t, onHover, onTurn,
}: {
  node: TurnNode
  current: boolean
  hover: boolean
  pinned: boolean
  t: (key: TrackKey) => string
  onHover: () => void
  onTurn: () => void
}): ReactNode {
  const clock = turnClock(node)
  const total = turnTotal(node)
  return (
    <button
      type="button"
      className="dsh-context-track-turn"
      aria-current={current ? 'true' : undefined}
      data-hover={hover ? 'true' : undefined}
      data-pinned={pinned ? 'true' : undefined}
      onMouseEnter={onHover}
      onClick={onTurn}
    >
      <span className="dsh-context-track-turn-line">
        <span className={`dsh-context-track-dot dsh-context-track-status-${node.status}`} data-status={node.status} />
        <span className="dsh-context-track-turn-name">{t('round').replace('{n}', String(node.turn))}</span>
        {node.status === 'ok' ? null : <span className={`dsh-context-track-status-${node.status}`}>{t(node.status)}</span>}
      </span>
      {clock === undefined && total === undefined ? null : (
        <span className="dsh-context-track-turn-meta">
          {clock !== undefined ? <CopySpan shown={formatDuration(clock)} /> : null}
          {total !== undefined ? <CopySpan shown={abbreviate(total)} /> : null}
        </span>
      )}
    </button>
  )
}

type PaneName = 'rail' | 'bill' | 'tree'

function paneFlex(px: number | undefined): { flex: string } | undefined {
  return px === undefined ? undefined : { flex: `0 1 ${px}px` }
}

/** Drag the edge of the previous column. The next column keeps the leftover space. */
function Grip({
  pane, vertical, min, keep, onSize,
}: {
  pane: PaneName
  vertical: boolean
  min: number
  /** Space left for the columns on the far side of this grip. */
  keep: number
  onSize: (px: number) => void
}): ReactNode {
  const resize = (origin: number, delta: number, room: number) => {
    const max = room > min + keep ? room - keep : Math.max(min, origin)
    onSize(Math.round(Math.min(Math.max(origin + delta, min), max)))
  }
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const handle = event.currentTarget
    const column = handle.previousElementSibling
    const parent = handle.parentElement
    if (!(column instanceof HTMLElement) || parent === null) return
    event.preventDefault()
    const columnBox = column.getBoundingClientRect()
    const parentBox = parent.getBoundingClientRect()
    const origin = vertical ? columnBox.height : columnBox.width
    const room = vertical ? parentBox.height : parentBox.width
    const start = vertical ? event.clientY : event.clientX
    try { handle.setPointerCapture(event.pointerId) } catch { /* the pointer can leave before capture */ }
    handle.dataset.active = 'true'
    const move = (ev: PointerEvent) => {
      resize(origin, (vertical ? ev.clientY : ev.clientX) - start, room)
    }
    const stop = () => {
      delete handle.dataset.active
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', stop)
      handle.removeEventListener('pointercancel', stop)
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', stop)
    handle.addEventListener('pointercancel', stop)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const arrows = event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === 'ArrowLeft'
    if (!arrows) return
    event.preventDefault()
    event.stopPropagation()
    const grow = vertical ? event.key === 'ArrowDown' : event.key === 'ArrowRight'
    const shrink = vertical ? event.key === 'ArrowUp' : event.key === 'ArrowLeft'
    if (!grow && !shrink) return
    const column = event.currentTarget.previousElementSibling
    if (!(column instanceof HTMLElement)) return
    const box = column.getBoundingClientRect()
    const origin = (vertical ? box.height : box.width) || min
    resize(origin, grow ? 24 : -24, Number.POSITIVE_INFINITY)
  }
  return (
    <div
      className="dsh-context-track-grip"
      data-pane={pane}
      role="separator"
      tabIndex={0}
      aria-orientation={vertical ? 'horizontal' : 'vertical'}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    />
  )
}

type RailEntry = { kind: 'turn'; node: TurnNode } | { kind: 'mark'; node: SidecarNode }

function railEntries(root: readonly RootNode[]): RailEntry[] {
  const entries: RailEntry[] = []
  for (const node of root) {
    if (node.kind === 'turn') entries.push({ kind: 'turn', node })
    else if (node.kind === 'sidecar') entries.push({ kind: 'mark', node })
  }
  return entries
}

function isTurnReport(value: TurnReport | MissingDetail | undefined): value is TurnReport {
  return value !== undefined && !('missing' in value && value.missing === true)
}

function usePanelLayout(ref: { readonly current: HTMLDivElement | null }): 'wide' | 'narrow' {
  const [layout, setLayout] = useState<'wide' | 'narrow'>('wide')
  useEffect(() => {
    const element = ref.current
    if (element === null) return undefined
    const apply = () => {
      const width = element.getBoundingClientRect().width
      // Zero means the panel has not been measured yet, so the wide layout stays until a real width arrives.
      if (width > 0) setLayout(layoutForWidth(width))
    }
    apply()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => { apply() })
    observer.observe(element)
    return () => { observer.disconnect() }
  }, [ref])
  return layout
}

function CopySpan({ shown }: { shown: ShownNumber }): ReactNode {
  if (!shown.abbreviated) return <span className="dsh-context-track-num">{shown.text}</span>
  return (
    <span
      className="dsh-context-track-num"
      title={shown.full}
      data-full={shown.full}
      onClick={event => {
        event.stopPropagation()
        void copyText(shown.full)
      }}
    >
      {shown.text}
    </span>
  )
}

function turnClock(node: TurnNode): number | undefined {
  if (node.startTime === undefined || node.endTime === undefined) return undefined
  return Math.max(0, node.endTime - node.startTime)
}

function turnTotal(node: TurnNode): number | undefined {
  const usages = []
  for (const item of node.items) {
    if (item.kind !== 'step') continue
    for (const attempt of item.attempts) {
      if (attempt.usage !== undefined) usages.push(attempt.usage)
    }
  }
  return billOf(sumUsage(usages)).total.value
}

function cursorIndex(cursors: readonly TreeCursor[], activeKey: string | undefined, turnId: string | undefined): number {
  if (activeKey !== undefined) {
    const byKey = cursors.findIndex(cursor => cursor.key === activeKey)
    if (byKey >= 0) return byKey
  }
  const byTurn = cursors.findIndex(cursor => cursor.kind === 'turn' && cursor.nodeId === turnId)
  return byTurn >= 0 ? byTurn : 0
}

function sidecarName(purpose: string, t: (key: TrackKey) => string): string {
  if (purpose === 'session-title') return t('title')
  if (purpose === 'compaction') return t('compaction')
  return t('search')
}

function watchLabel(
  t: (key: TrackKey) => string,
  turn: TurnNode | undefined,
  nodeId: string | undefined,
  marker: string | undefined,
  track: TrackState | undefined,
): string {
  if (marker !== undefined && track !== undefined) {
    const side = track.root.find(item => item.kind === 'sidecar' && item.id === marker)
    if (side?.kind === 'sidecar') return sidecarName(side.purpose, t)
  }
  if (turn === undefined) return ''
  if (nodeId === undefined || nodeId === turn.id) return t('turn').replace('{n}', String(turn.turn))
  for (const item of turn.items) {
    if (item.kind === 'step') {
      if (item.id === nodeId) return t('step').replace('{n}', String(item.step))
      const attempt = item.attempts.find(entry => entry.id === nodeId)
      if (attempt !== undefined) {
        const name = t('attempt').replace('{n}', String(attempt.attempt))
        return item.model !== undefined && item.model.length > 0 ? `${name} · ${item.model}` : name
      }
      const tool = item.tools.find(entry => entry.id === nodeId)
      if (tool !== undefined) return tool.name
    } else if (item.id === nodeId && item.kind === 'sidecar') {
      return sidecarName(item.purpose, t)
    } else if (item.id === nodeId && item.kind === 'unlinked') {
      return item.childLabel ?? item.id
    }
  }
  return nodeId ?? ''
}

function turnContaining(turns: readonly TurnNode[], nodeId: string): string | undefined {
  for (const turn of turns) {
    if (turn.id === nodeId) return turn.id
    for (const item of turn.items) {
      if (item.id === nodeId) return turn.id
      if (item.kind !== 'step') continue
      if (item.attempts.some(attempt => attempt.id === nodeId)) return turn.id
      if (item.tools.some(tool => tool.id === nodeId)) return turn.id
    }
  }
  return undefined
}

function revealTool(
  sessionId: string,
  toolId: string,
  turns: readonly TurnNode[],
  setOpen: (update: (state: Readonly<Record<string, boolean>>) => Record<string, boolean>) => void,
): void {
  for (const turn of turns) {
    for (const item of turn.items) {
      if (item.kind !== 'step') continue
      if (!item.tools.some(tool => tool.id === toolId)) continue
      setOpen(state => ({
        ...state,
        [`${sessionId}:${turn.id}`]: true,
        [`${sessionId}:${item.id}`]: true,
        [`${sessionId}:${toolId}`]: true,
      }))
      return
    }
  }
}

function readTrack(
  projections: { [id: string]: { values: { track?: TrackState } } | undefined },
  sessionId: string,
): TrackState | undefined {
  return projections[sessionId]?.values.track
}
