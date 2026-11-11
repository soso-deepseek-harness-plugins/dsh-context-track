/**
 * Context-trace console. The conversation tab and the right sidebar are both
 * session-scoped. The left-sidebar centre page follows the session the shell
 * retains for the main view. Detail reads committed logs. It does not
 * subscribe to the token stream.
 *
 * The panel is a shell: a header, a horizontal round strip, a collapsible
 * context band, and a tree beside a detail pane. Narrow panels keep the tree
 * full width and slide the detail over it.
 */
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import type { CategoryId } from '../shared/classify.js'
import { isMissing, type MissingDetail, type NodeDetail } from '../shared/detail.js'
import { cacheHitRate, usageFigure, type Figure } from '../shared/figures.js'
import {
  defaultExpanded,
  emptyTrack,
  findNode,
  toggleExpanded,
  type RootNode,
  type SidecarNode,
  type StepNode,
  type TrackState,
  type TurnNode,
} from '../shared/model.js'
import '../shared/projection.js'
import type { TurnReport } from '../shared/report.js'
import { Detail } from './Detail.js'
import { abbreviate, copyText, formatDuration, type ShownNumber } from './format.js'
import { BandIcon } from './Icon.js'
import {
  DEFAULT_TREE_RATIO,
  GRIP_STEP_PX,
  clampTreeRatio,
  isSideBySide,
  layoutForWidth,
  type Tier,
} from './layout.js'
import type { TrackKey } from './locales.js'
import { ensureStyles } from './styles.js'
import './slots.js'
import { compactionPresent, ContextBand, reclaimedOf } from './TokenCard.js'
import { Tree, collectKeys, visibleTargets, type TreeCursor } from './Tree.js'
import { FigureView, HitRateBadge } from './widgets.js'

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

/** Guarded storage: a blocked localStorage must never stop the first paint. */
const STORE_PREFIX = 'dsh-context-track:'

function readStore<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback
    const raw = localStorage.getItem(STORE_PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeStore(key: string, value: unknown): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value))
  } catch {
    /* private mode or a full quota: the panel still works, it just forgets. */
  }
}

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
 * What a round tab comes back to: the row that round was last opened on.
 * `nodeId` is the node the inspector reads, `key` the tree row that carries
 * the cursor, and `attemptId` the call the turn report windows on.
 */
interface TurnMark {
  sessionId: string
  nodeId: string
  key: string
  attemptId: string
}

/**
 * Centre-column page for the left-sidebar row. The row's panel has no session
 * binding, so the console follows the retained main session.
 */
export function TraceMain(props: Omit<TracePageProps, 'sessionId' | 'host'>): ReactNode {
  const sessionId = props.useSessions(state => mainSessionId(state.byId))
  return <TracePage {...props} host="main" sessionId={sessionId} />
}

/** Header, round strip, context band, and the selected turn's tree and detail. */
export function TracePage({ sessionId, useSessions, t, getNode, getTurn, host }: TracePageProps): ReactNode {
  ensureStyles()
  const rootRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const splitRef = useRef<HTMLDivElement>(null)
  const selectedChipRef = useRef<HTMLButtonElement>(null)
  const lastTrigger = useRef<{ kind: 'node' | 'turn'; id: string } | undefined>(undefined)
  const tier = usePanelTier(rootRef)
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
  const [detail, setDetail] = useState<NodeDetail | undefined>(undefined)
  const [report, setReport] = useState<TurnReport | MissingDetail | undefined>(undefined)
  /* Adopted session name for the band. Keyed by sidecar so a turn switch never shows the previous name. */
  const [title, setTitle] = useState<{ id: string; name?: string } | undefined>(undefined)
  const [detailOpen, setDetailOpen] = useState(true)
  const [detailShown, setDetailShown] = useState(true)
  /* Narrow panels slide the detail over the tree only after a click, never on an arrow-key move. */
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [bandOpen, setBandOpen] = useState(() => readStore<boolean>('band', false))
  const [ratio, setRatio] = useState(() => {
    const stored = readStore<number>('split', DEFAULT_TREE_RATIO)
    return Number.isFinite(stored) ? stored : DEFAULT_TREE_RATIO
  })
  const [focusCategory, setFocusCategory] = useState<CategoryId | undefined>(undefined)
  const revealTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  /* Session whose first content row has already been selected by default. */
  const autoSelected = useRef<string | undefined>(undefined)
  /* Last row the user opened in each round, so a tab switch returns to it. */
  const marks = useRef<Record<string, TurnMark>>({})

  const narrow = !isSideBySide(tier)
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
    setFocusCategory(undefined)
    marks.current = {}
  }, [sessionId])

  useEffect(() => () => { clearTimeout(revealTimer.current) }, [])

  useEffect(() => { writeStore('band', bandOpen) }, [bandOpen])
  useEffect(() => { writeStore('split', ratio) }, [ratio])

  const selectedTurnId = selectedTurn?.id
  useEffect(() => {
    const chip = selectedChipRef.current
    if (chip !== null) chip.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }, [selectedTurnId])

  /* Collapse hides the body first so the slide never lays it out at strip width.
   * Expand reveals the body once the slide has landed. The body stays mounted
   * either way, so views, folds, and scroll survive a collapse. */
  const collapseDetail = () => {
    clearTimeout(revealTimer.current)
    setDetailShown(false)
    setDetailOpen(false)
    setOverlayOpen(false)
    returnFocus()
  }

  const openDetail = () => {
    setOverlayOpen(true)
    if (detailOpen && detailShown) return
    setDetailOpen(true)
    clearTimeout(revealTimer.current)
    revealTimer.current = setTimeout(() => { setDetailShown(true) }, DETAIL_REVEAL_MS)
  }

  const returnFocus = () => {
    const trigger = lastTrigger.current
    if (trigger === undefined) return
    const root = rootRef.current
    if (root === null) return
    const selector = trigger.kind === 'turn'
      ? `[data-turn-id="${trigger.id}"]`
      : `[data-node-id="${trigger.id}"] .dsh-context-track-label`
    const element = root.querySelector<HTMLElement>(selector)
    element?.focus()
  }

  const revision = openRevision(list.projectionsBySession, node)
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
  }, [sessionId, node, track, revision, getNode])

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

  /* The band names the session beside the compaction and subagent rows, so the
   * adopted title is read once per title sidecar rather than only when opened. */
  const titleSidecar = selectedTurn?.items.find(
    (item): item is SidecarNode => item.kind === 'sidecar' && item.purpose === 'session-title',
  )
  const titleSidecarId = titleSidecar?.id
  const titleRevision = titleSidecar === undefined
    ? ''
    : `${titleSidecar.status}|${titleSidecar.outputSeq ?? ''}|${titleSidecar.endSeq ?? ''}`
  const titleName = title !== undefined && title.id === titleSidecarId ? title.name : undefined
  useEffect(() => {
    if (sessionId === undefined || titleSidecarId === undefined) return undefined
    let cancelled = false
    let pending: Promise<RemoteResult<NodeDetail>>
    try {
      pending = Promise.resolve(getNode(sessionId, titleSidecarId))
    } catch {
      return () => { cancelled = true }
    }
    void pending.then(result => {
      if (cancelled) return
      if (result == null || typeof result !== 'object' || !('ok' in result) || result.ok !== true) return
      const value = result.value
      if (!isMissing(value) && value.kind === 'sidecar' && value.purpose === 'session-title'
        && typeof value.output === 'string' && value.output.length > 0) {
        setTitle({ id: titleSidecarId, name: value.output })
      }
    }, () => undefined)
    return () => { cancelled = true }
  }, [sessionId, titleSidecarId, titleRevision, getNode])

  const cursors = sessionId === undefined
    ? []
    : visibleTargets(sessionId, track, open, id => readTrack(list.projectionsBySession, id))

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      if (showDetail && hasSelection) {
        event.preventDefault()
        collapseDetail()
      }
      return
    }
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

  /** Remember what a round was left on. A tab switch comes back to this row. */
  const markRow = (turnId: string | undefined, mark: TurnMark | undefined): void => {
    if (turnId !== undefined && mark !== undefined) marks.current[turnId] = mark
  }

  /** Point the tree cursor and the inspector at one row. */
  const showRow = (mark: TurnMark): void => {
    setMarker(undefined)
    setNode({ sessionId: mark.sessionId, nodeId: mark.nodeId })
    setActiveKey(mark.key)
    setAttemptId(mark.attemptId)
  }

  const selectCursor = (cursor: TreeCursor, pin: boolean) => {
    if (sessionId === undefined) return
    if (pin) {
      setPinned(true)
      setOverlayOpen(true)
    }
    const owner = turnContaining(turns, cursor.activateId) ?? turnContaining(turns, cursor.nodeId)
    if (owner !== undefined) setPicked(owner)
    if (cursor.kind === 'turn') {
      lastTrigger.current = { kind: 'turn', id: cursor.nodeId }
      showRow({ sessionId, nodeId: cursor.nodeId, key: cursor.key, attemptId: '' })
      setDetail(undefined)
      markRow(owner, { sessionId, nodeId: cursor.nodeId, key: cursor.key, attemptId: '' })
      return
    }
    lastTrigger.current = { kind: 'node', id: cursor.nodeId }
    const mark = {
      sessionId: cursor.sessionId, nodeId: cursor.activateId, key: cursor.key, attemptId: cursor.attemptId ?? '',
    }
    showRow(mark)
    markRow(owner, mark)
  }

  /* Open on content, never on an empty grouping row. The round that opens first
   * is the first one with items, so the panel lands where the loop began; a
   * round only opens on its turn row when it has no steps or sidecars yet. The
   * default does not pin the round, slide the narrow overlay, or count as a
   * choice, so a later tab switch still opens on the first call. */
  useEffect(() => {
    if (sessionId === undefined) {
      autoSelected.current = undefined
      return
    }
    if (autoSelected.current === sessionId) return
    if (picked !== undefined || node !== undefined || marker !== undefined) return
    const round = turns.find(turn => turn.items.length > 0)
    if (round === undefined) return
    const entry = openingRow(sessionId, round)
    if (entry === undefined) return
    autoSelected.current = sessionId
    setPicked(round.id)
    showRow(entry)
  }, [sessionId, picked, node, marker, turns])

  if (sessionId === undefined) {
    return <div className={rootClass} data-tier={tier}><p className="dsh-context-track-empty">{t('empty')}</p></div>
  }

  const shownReport = isTurnReport(report) ? report : undefined
  const watching = watchLabel(translate, selectedTurn, node?.nodeId, marker, track)
  const trackOf = (id: string) => readTrack(list.projectionsBySession, id)
  const nodeKey = `${sessionId}:${node?.nodeId ?? marker ?? 'turn'}`
  const failed = node !== undefined && detail !== undefined && isMissing(detail)
  const hasSelection = node !== undefined || marker !== undefined
  const sideBySide = isSideBySide(tier)
  const showDetail = sideBySide ? detailOpen : overlayOpen && hasSelection
  /* The band only exists for a turn, so its disclosure must not dangle on a sidecar mark. */
  const bandAvailable = marker === undefined && shownReport !== undefined
  const headTotal = shownReport?.consumption.total ?? (selectedTurn !== undefined ? totalFigure(selectedTurn) : { basis: 'absent' as const })
  const headClock = shownReport?.timing.elapsed ?? (selectedTurn !== undefined ? clockFigure(selectedTurn) : { basis: 'absent' as const })
  const headHit = shownReport?.consumption.hitRate ?? (selectedTurn !== undefined ? hitFigure(selectedTurn) : { basis: 'absent' as const })
  const crumbs = crumbTrail(track, turns, node?.nodeId, marker, translate)

  /** A remembered row survives while its node is still in that session's index. */
  const stillThere = (mark: TurnMark): boolean => {
    const index = trackOf(mark.sessionId)
    return index !== undefined && findNode(index, mark.nodeId) !== undefined
  }

  /** A tab switch returns to the row the round was left on, else its first call. */
  const pinTurn = (id: string) => {
    lastTrigger.current = { kind: 'turn', id }
    setMarker(undefined)
    setPicked(id)
    setPinned(true)
    const turn = turns.find(item => item.id === id)
    const kept = turn === undefined ? undefined : marks.current[id]
    const entry = turn === undefined
      ? undefined
      : (kept !== undefined && stillThere(kept) ? kept : undefined) ?? openingRow(sessionId, turn)
    if (entry !== undefined) {
      showRow(entry)
    } else {
      setNode({ sessionId, nodeId: id })
      setActiveKey(`${sessionId}:${id}`)
      setAttemptId('')
    }
    if (sideBySide) openDetail()
  }

  const selectNode = (cursor: TreeCursor) => {
    lastTrigger.current = { kind: 'node', id: cursor.nodeId }
    const mark = {
      sessionId: cursor.sessionId, nodeId: cursor.activateId, key: cursor.key, attemptId: cursor.attemptId ?? '',
    }
    showRow(mark)
    setPinned(true)
    setDetailOpen(true)
    setDetailShown(true)
    setOverlayOpen(true)
    const owner = turnContaining(turns, cursor.activateId) ?? turnContaining(turns, cursor.nodeId)
    if (owner !== undefined) {
      setPicked(owner)
      markRow(owner, mark)
    }
  }

  const chooseCrumb = (nodeId: string) => {
    const mark = { sessionId, nodeId, key: `${sessionId}:${nodeId}`, attemptId: '' }
    const turn = turns.some(item => item.id === nodeId)
    lastTrigger.current = { kind: turn ? 'turn' : 'node', id: nodeId }
    showRow(mark)
    const owner = turnContaining(turns, nodeId)
    if (owner !== undefined) markRow(owner, mark)
    if (turn) return
    setPinned(true)
    setDetailOpen(true)
    setDetailShown(true)
    setOverlayOpen(true)
    if (owner !== undefined) setPicked(owner)
  }

  const moveTurn = (delta: number) => {
    if (turns.length === 0) return
    const current = selectedTurn === undefined ? turns.length - 1 : turns.findIndex(turn => turn.id === selectedTurn.id)
    const next = turns[Math.min(Math.max(current + delta, 0), turns.length - 1)]
    if (next !== undefined && next.id !== selectedTurn?.id) pinTurn(next.id)
  }

  const bandCategory = (category: CategoryId) => {
    setFocusCategory(category)
    setDetailOpen(true)
    setDetailShown(true)
    setOverlayOpen(true)
  }

  return (
    <div
      ref={rootRef}
      className={rootClass}
      data-tier={tier}
      data-band={bandOpen ? 'open' : 'closed'}
      data-detail={showDetail ? 'open' : 'closed'}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <header className="dsh-context-track-head" data-pane="header">
        <span className="dsh-context-track-head-title" data-head="turn">
          {selectedTurn !== undefined ? t('turn').replace('{n}', String(selectedTurn.turn)) : t('panel')}
        </span>
        {selectedTurn !== undefined ? (
          <span className={`dsh-context-track-status-${selectedTurn.status}`} data-head="status" data-status={selectedTurn.status}>
            {selectedTurn.status === 'ok' ? null : t(selectedTurn.status)}
          </span>
        ) : null}
        {watching.length > 0 ? <span className="dsh-context-track-head-watching" data-watching>{t('watching').replace('{name}', watching)}</span> : null}
        <span className="dsh-context-track-head-spacer" />
        <span className="dsh-context-track-head-stat" data-head="total">
          <span className="dsh-context-track-head-label">{t('total')}</span>
          <FigureView figure={headTotal} t={translate} />
        </span>
        <span className="dsh-context-track-head-stat" data-head="hit">
          <HitRateBadge figure={headHit} t={translate} />
        </span>
        <span className="dsh-context-track-head-stat" data-head="elapsed">
          <span className="dsh-context-track-head-label">{t('elapsed')}</span>
          <FigureView figure={headClock} t={translate} showBasis={false} format={formatDuration} />
        </span>
        {bandAvailable ? (
          <button
            type="button"
            className="dsh-context-track-head-band"
            data-head-band
            data-band-toggle
            aria-expanded={bandOpen}
            aria-label={bandOpen ? t('bandCollapse') : t('bandExpand')}
            title={bandOpen ? t('bandCollapse') : t('bandExpand')}
            onClick={() => { setBandOpen(value => !value) }}
          >
            <BandIcon />
            <span className="dsh-context-track-head-band-label">{t('bandTitle')}</span>
            <span className="dsh-context-track-head-band-caret" aria-hidden="true">▾</span>
          </button>
        ) : null}
        <MoreMenu
          t={translate}
          onExpandAll={() => { bulk(true) }}
          onCollapseAll={() => { bulk(false) }}
          onResetSplit={() => { setRatio(DEFAULT_TREE_RATIO) }}
        />
      </header>
      {turns.length === 0 ? (
        <p className="dsh-context-track-empty">{t('noCalls')}</p>
      ) : (
        <>
          <TurnStrip
            entries={railEntries(track?.root ?? [])}
            selectedId={selectedTurn?.id}
            hoverId={hover}
            pinned={pinned}
            total={turns.length}
            selectedRef={selectedChipRef}
            t={translate}
            onHover={setHover}
            onTurn={pinTurn}
            onMove={moveTurn}
            onMark={id => {
              lastTrigger.current = { kind: 'node', id }
              setMarker(id)
              setNode({ sessionId, nodeId: id })
              setPinned(true)
              setActiveKey(`${sessionId}:${id}`)
              setDetailOpen(true)
              setDetailShown(true)
              setOverlayOpen(true)
            }}
          />
          {marker === undefined && shownReport !== undefined ? (
            <div className="dsh-context-track-band-wrap" data-pane="band">
              <ContextBand
                report={shownReport}
                open={bandOpen}
                activeSeq={eventSeq}
                titleName={titleName}
                trackOf={trackOf}
                t={translate}
                onCategory={bandCategory}
                onGap={seq => {
                  setEventSeq(seq)
                  const match = shownReport.events.find(item => item.seq === seq)
                  if (match?.nodeId !== undefined) {
                    lastTrigger.current = { kind: 'node', id: match.nodeId }
                    setNode({ sessionId, nodeId: match.nodeId })
                    setPinned(true)
                    setDetailOpen(true)
                    setDetailShown(true)
                    setOverlayOpen(true)
                    const owner = turnContaining(turns, match.nodeId)
                    if (owner !== undefined) {
                      markRow(owner, {
                        sessionId, nodeId: match.nodeId, key: `${sessionId}:${match.nodeId}`, attemptId: '',
                      })
                    }
                  }
                }}
              />
            </div>
          ) : null}
          <div className="dsh-context-track-split" data-pane="split" ref={splitRef}>
            <div
              className="dsh-context-track-tree"
              data-pane="tree"
              style={sideBySide && showDetail ? { flex: `0 1 ${ratio * 100}%` } : { flex: '1 1 auto' }}
            >
              <Tree
                sessionId={sessionId}
                track={track}
                trackOf={trackOf}
                open={open}
                onToggle={(key, kind, status) => {
                  setOpen(current => toggleExpanded(current, key, defaultExpanded(kind, status)))
                }}
                selected={node}
                onSelect={selectNode}
                onBulk={(expand, keys) => { bulk(expand, keys) }}
                t={translate}
                now={Date.now()}
                turnBill={shownReport !== undefined && compactionPresent(shownReport) ? {
                  turnId: shownReport.id,
                  reclaimed: reclaimedOf(shownReport.events),
                  cost: shownReport.consumption.compaction,
                } : undefined}
              />
            </div>
            {sideBySide && showDetail ? (
              <Grip
                label={t('adjustSplit')}
                onRatio={next => { setRatio(next) }}
                onStep={delta => {
                  const room = splitRef.current?.getBoundingClientRect().width ?? 0
                  setRatio(current => {
                    if (room <= 0) return current
                    return clampTreeRatio((current * room + delta) / room, room)
                  })
                }}
                onReset={() => { setRatio(DEFAULT_TREE_RATIO) }}
              />
            ) : null}
            {showDetail ? (
              <div
                className="dsh-context-track-detail"
                data-pane="detail"
                data-overlay={narrow ? 'true' : undefined}
                data-collapsed={detailShown ? undefined : 'true'}
                ref={detailRef}
              >
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
                      crumbs={crumbs}
                      onCrumb={chooseCrumb}
                      onClose={collapseDetail}
                      onBack={narrow ? collapseDetail : undefined}
                      focusCategory={focusCategory}
                      onOpenChild={() => {
                        if (node === undefined) return
                        revealTool(sessionId, node.nodeId, turns, setOpen)
                      }}
                    />
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  )

  function bulk(expand: boolean, keys?: readonly string[]): void {
    const all = keys ?? collectKeys(sessionId!, track, trackOf)
    setOpen(current => {
      const next = { ...current }
      for (const key of all) next[key] = expand
      return next
    })
  }
}

/**
 * Header actions. The list is painted inside the header's stacking context, so
 * opening it must not be clipped by the header's own box. It stays mounted only
 * while open; Escape and an outside press dismiss it.
 */
function MoreMenu({
  t, onExpandAll, onCollapseAll, onResetSplit,
}: {
  t: (key: TrackKey) => string
  onExpandAll: () => void
  onCollapseAll: () => void
  onResetSplit: () => void
}): ReactNode {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return undefined
    const dismiss = (event: Event) => {
      if (event.target instanceof Node && ref.current?.contains(event.target) === true) return
      setOpen(false)
    }
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setOpen(false)
    }
    document.addEventListener('pointerdown', dismiss, true)
    document.addEventListener('keydown', onEscape, true)
    return () => {
      document.removeEventListener('pointerdown', dismiss, true)
      document.removeEventListener('keydown', onEscape, true)
    }
  }, [open])
  const run = (action: () => void) => () => { setOpen(false); action() }
  return (
    <div className="dsh-context-track-more" data-more-menu data-open={open ? 'true' : undefined} ref={ref}>
      <button
        type="button"
        className="dsh-context-track-more-button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => { setOpen(value => !value) }}
      >
        {t('more')}
        <span className="dsh-context-track-more-caret" aria-hidden="true">▾</span>
      </button>
      {open ? (
        <div className="dsh-context-track-more-menu" role="menu">
          <button type="button" role="menuitem" onClick={run(onExpandAll)}>{t('expandAll')}</button>
          <button type="button" role="menuitem" onClick={run(onCollapseAll)}>{t('collapseAll')}</button>
          <span className="dsh-context-track-more-divider" role="separator" aria-hidden="true" />
          <button type="button" role="menuitem" onClick={run(onResetSplit)}>{t('resetSplit')}</button>
        </div>
      ) : null}
    </div>
  )
}

/** One row per round, or a thin label for a sidecar that sat between rounds. */
function TurnStrip({
  entries, selectedId, hoverId, pinned, total, selectedRef, t, onHover, onTurn, onMove, onMark,
}: {
  entries: RailEntry[]
  selectedId?: string
  hoverId?: string
  pinned: boolean
  total: number
  selectedRef: { current: HTMLButtonElement | null }
  t: (key: TrackKey) => string
  onHover: (id: string | undefined) => void
  onTurn: (id: string) => void
  onMove: (delta: number) => void
  onMark: (id: string) => void
}): ReactNode {
  const index = entries.find(turn => turn.kind === 'turn' && turn.node.id === selectedId)
  const position = index !== undefined && index.kind === 'turn' ? index.node.turn : undefined
  return (
    <div
      className="dsh-context-track-strip"
      data-pane="strip"
      role="tablist"
      aria-label={t('stripLabel')}
      onMouseLeave={() => { onHover(undefined) }}
      onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault()
        event.stopPropagation()
        onMove(event.key === 'ArrowRight' ? 1 : -1)
      }}
    >
      {entries.map(entry => entry.kind === 'turn' ? (
        <TurnChip
          key={entry.node.id}
          node={entry.node}
          selected={selectedId === entry.node.id}
          hovered={hoverId === entry.node.id}
          pinned={pinned && selectedId === entry.node.id}
          selectedRef={selectedRef}
          t={t}
          onHover={onHover}
          onTurn={onTurn}
        />
      ) : (
        <button
          key={entry.node.id}
          type="button"
          className="dsh-context-track-mark"
          data-mark={entry.node.id}
          title={sidecarName(entry.node.purpose, t)}
          onClick={() => { onMark(entry.node.id) }}
        >
          <span>{sidecarName(entry.node.purpose, t)}</span>
        </button>
      ))}
      {total > 6 && position !== undefined ? (
        <span className="dsh-context-track-strip-count" data-strip-count>
          {t('roundIndex').replace('{n}', String(position)).replace('{total}', String(total))}
        </span>
      ) : null}
    </div>
  )
}

/**
 * One round tab: identity and scale on the first line, the two numbers that
 * matter on the second. A bare turn number beside a duration and a total read
 * as a run of numbers, so every value now carries its own label.
 */
function TurnChip({
  node, selected, hovered, pinned, selectedRef, t, onHover, onTurn,
}: {
  node: TurnNode
  selected: boolean
  hovered: boolean
  pinned: boolean
  selectedRef: { current: HTMLButtonElement | null }
  t: (key: TrackKey) => string
  onHover: (id: string | undefined) => void
  onTurn: (id: string) => void
}): ReactNode {
  const elapsed = turnClock(node)
  return (
    <button
      type="button"
      className="dsh-context-track-turn"
      role="tab"
      aria-selected={selected}
      aria-current={selected ? 'true' : undefined}
      data-turn-id={node.id}
      data-turn={node.turn}
      data-hover={hovered ? 'true' : undefined}
      data-pinned={pinned ? 'true' : undefined}
      ref={selected ? selectedRef : undefined}
      onMouseEnter={() => { onHover(node.id) }}
      onClick={() => { onTurn(node.id) }}
    >
      <span className="dsh-context-track-turn-top">
        <span className={`dsh-context-track-dot dsh-context-track-status-${node.status}`} data-status={node.status} />
        <span className="dsh-context-track-turn-name">{t('turn').replace('{n}', String(node.turn))}</span>
        {node.status === 'ok' ? null : (
          <span className={`dsh-context-track-status-${node.status} dsh-context-track-turn-flag`}>{t(node.status)}</span>
        )}
        <TurnSummary node={node} t={t} />
      </span>
      <span className="dsh-context-track-turn-meta">
        <span className="dsh-context-track-turn-stat" data-chip-stat="elapsed">
          <span className="dsh-context-track-turn-stat-label">{t('elapsed')}</span>
          {elapsed === undefined
            ? <span className="dsh-context-track-muted">{t('absent')}</span>
            : <CopySpan shown={formatDuration(elapsed)} />}
        </span>
        <span className="dsh-context-track-turn-sep" aria-hidden="true">·</span>
        <span className="dsh-context-track-turn-stat" data-chip-stat="total">
          <span className="dsh-context-track-turn-stat-label">{t('total')}</span>
          <TurnTotal node={node} t={t} />
        </span>
      </span>
    </button>
  )
}

/** How much happened in this round, so the tabs differ by more than a number. */
function TurnSummary({ node, t }: { node: TurnNode; t: (key: TrackKey) => string }): ReactNode {
  const steps = node.items.filter(item => item.kind === 'step').length
  if (steps === 0) return null
  const tools = node.items.reduce((sum, item) => item.kind === 'step'
    ? sum + item.tools.length + (item.searches?.length ?? 0)
    : sum, 0)
  const parts = [t('summaryTurn').replace('{n}', String(steps))]
  if (tools > 0) parts.push(t('summaryTools').replace('{n}', String(tools)))
  return <span className="dsh-context-track-turn-summary" data-chip-summary>{parts.join(' · ')}</span>
}

/** Every tab carries its round total, labelled, so cost can be compared without clicking. */
function TurnTotal({ node, t }: { node: TurnNode; t: (key: TrackKey) => string }): ReactNode {
  const total = turnTotal(node)
  if (total === undefined) return <span className="dsh-context-track-muted">{t('absent')}</span>
  return (
    <span data-turn-total>
      <CopySpan shown={abbreviate(total)} />
    </span>
  )
}

/** Drag the tree edge. The detail keeps the leftover space. */
function Grip({
  label, onRatio, onStep, onReset,
}: {
  label: string
  onRatio: (ratio: number) => void
  onStep: (delta: number) => void
  onReset: () => void
}): ReactNode {
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const handle = event.currentTarget
    const column = handle.previousElementSibling
    const parent = handle.parentElement
    if (!(column instanceof HTMLElement) || parent === null) return
    event.preventDefault()
    const columnBox = column.getBoundingClientRect()
    const parentBox = parent.getBoundingClientRect()
    const origin = columnBox.width
    const room = parentBox.width
    const start = event.clientX
    try { handle.setPointerCapture(event.pointerId) } catch { /* the pointer can leave before capture */ }
    handle.dataset.active = 'true'
    const move = (ev: PointerEvent) => {
      if (room <= 0) return
      onRatio(clampTreeRatio((origin + (ev.clientX - start)) / room, room))
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
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    event.stopPropagation()
    onStep(event.key === 'ArrowRight' ? GRIP_STEP_PX : -GRIP_STEP_PX)
  }
  return (
    <div
      className="dsh-context-track-grip"
      data-pane="splitter"
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={label}
      title={label}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      onDoubleClick={onReset}
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

/** Tracks the panel's own width, not the window. Starts narrow so the first frame never flashes wide. */
function usePanelTier(ref: { readonly current: HTMLDivElement | null }): Tier {
  const [tier, setTier] = useState<Tier>('narrow')
  useEffect(() => {
    const element = ref.current
    if (element === null) return undefined
    const apply = () => {
      const width = element.getBoundingClientRect().width
      // Zero means the panel has not been measured yet; keep the narrow first frame.
      if (width > 0) setTier(layoutForWidth(width))
    }
    apply()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => { apply() })
    observer.observe(element)
    return () => { observer.disconnect() }
  }, [ref])
  return tier
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
  let total = 0
  let seen = false
  for (const item of node.items) {
    if (item.kind !== 'step') continue
    for (const attempt of item.attempts) {
      if (attempt.usage?.totalTokens === undefined) continue
      total += attempt.usage.totalTokens
      seen = true
    }
  }
  return seen ? total : undefined
}

function totalFigure(node: TurnNode): Figure {
  const total = turnTotal(node)
  return total === undefined ? { basis: 'absent' } : usageFigure(total)
}

/** Same roll-up the host report uses, for the header while the report is still loading. */
function hitFigure(node: TurnNode): Figure {
  const usages = node.items.flatMap(item => item.kind === 'step'
    ? item.attempts.flatMap(attempt => attempt.usage === undefined ? [] : [attempt.usage])
    : [])
  return cacheHitRate(usages)
}

function clockFigure(node: TurnNode): Figure {
  const clock = turnClock(node)
  return clock === undefined ? { basis: 'absent' } : usageFigure(clock)
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

/** `turn 2 / step 1 / llm_call 1`, each level clickable except the current one. */
function crumbTrail(
  track: TrackState | undefined,
  turns: readonly TurnNode[],
  nodeId: string | undefined,
  marker: string | undefined,
  t: (key: TrackKey) => string,
): { id?: string; label: string }[] {
  if (marker !== undefined && track !== undefined) {
    const side = track.root.find(item => item.kind === 'sidecar' && item.id === marker)
    if (side?.kind === 'sidecar') return [{ label: sidecarName(side.purpose, t) }]
    return [{ label: sidecarName('web-search', t) }]
  }
  const turn = turns.find(item => item.id === nodeId) ?? turnFor(turns, nodeId)
  const trail: { id?: string; label: string }[] = []
  if (turn === undefined) return trail
  trail.push({ label: t('turn').replace('{n}', String(turn.turn)), id: nodeId === turn.id ? undefined : turn.id })
  if (nodeId === undefined || nodeId === turn.id) return trail
  for (const item of turn.items) {
    if (item.kind !== 'step') continue
    if (item.id === nodeId) {
      trail.push({ label: t('step').replace('{n}', String(item.step)) })
      return trail
    }
    const attempt = item.attempts.find(entry => entry.id === nodeId)
    const tool = item.tools.find(entry => entry.id === nodeId)
    if (attempt === undefined && tool === undefined) continue
    trail.push({ label: t('step').replace('{n}', String(item.step)), id: item.id })
    if (attempt !== undefined) {
      trail.push({ label: t('attempt').replace('{n}', String(attempt.attempt)) })
    } else if (tool !== undefined) {
      trail.push({ label: tool.name })
    }
    return trail
  }
  const side = turn.items.find(item => item.id === nodeId && item.kind === 'sidecar')
  if (side?.kind === 'sidecar') trail.push({ label: sidecarName(side.purpose, t) })
  return trail
}

/**
 * The row a round opens on until the user picks one: the first model call of
 * its first step, so a retried step still lands on call 1. A step that has not
 * called yet opens on itself, and a round of sidecars opens on the first one.
 */
function openingRow(sessionId: string, turn: TurnNode): TurnMark | undefined {
  const step = turn.items.find((item): item is StepNode => item.kind === 'step')
  if (step !== undefined) {
    const first = step.attempts[0]
    if (first !== undefined) {
      return { sessionId, nodeId: first.id, key: `${sessionId}:${first.id}`, attemptId: first.id }
    }
    return { sessionId, nodeId: step.id, key: `${sessionId}:${step.id}`, attemptId: '' }
  }
  const aside = turn.items.find(item => item.kind === 'sidecar' || item.kind === 'unlinked')
  if (aside !== undefined) {
    return { sessionId, nodeId: aside.id, key: `${sessionId}:${aside.id}`, attemptId: '' }
  }
  return undefined
}

function turnFor(turns: readonly TurnNode[], nodeId: string | undefined): TurnNode | undefined {
  if (nodeId === undefined) return undefined
  return turns.find(turn => turnContaining([turn], nodeId) !== undefined)
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

/**
 * Facts that change when the open node's call settles.
 * The projection may keep the same track object, so the detail reload cannot
 * key off that object's identity. A child step uses its own session's track.
 */
function openRevision(
  projections: { [id: string]: { values: { track?: TrackState } } | undefined },
  node: { sessionId: string; nodeId: string } | undefined,
): string {
  if (node === undefined) return ''
  const track = readTrack(projections, node.sessionId)
  if (track === undefined) return `absent:${node.sessionId}:${node.nodeId}`
  const found = findNode(track, node.nodeId)
  if (found === undefined) return `missing:${node.nodeId}`
  switch (found.kind) {
    case 'step':
      return [
        'step',
        found.node.status,
        found.node.inputSeq,
        found.node.endSeq ?? '',
        found.node.attempts.map(item => `${item.id}:${item.status}:${item.outputSeq ?? ''}:${item.retrySeq ?? ''}`).join(','),
      ].join('|')
    case 'attempt':
      return `attempt|${found.node.status}|${found.node.outputSeq ?? ''}|${found.node.retrySeq ?? ''}`
    case 'tool':
      return `tool|${found.node.status}|${found.node.resultSeq ?? ''}|${found.node.childLabel ?? ''}|${found.node.childMode ?? ''}`
    case 'sidecar':
      return `side|${found.node.status}|${found.node.outputSeq ?? ''}|${found.node.endSeq ?? ''}`
    case 'turn':
      return `turn|${found.node.status}|${found.node.endSeq ?? ''}`
    case 'unlinked':
      return `unlinked|${found.node.childLabel ?? ''}|${found.node.childMode ?? ''}`
    default:
      return 'unknown'
  }
}
