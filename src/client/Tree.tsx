/** Call tree. Each row is the hierarchy. Expansion stays in the parent. */
import type { ReactNode } from 'react'
import { billOf, type Figure } from '../shared/figures.js'
import {
  childExpandable,
  defaultExpanded,
  type AttemptRef,
  type NodeStatus,
  type RootNode,
  type StepNode,
  type TokenUsageScalars,
  type TrackState,
  type TurnItem,
  type TurnNode,
} from '../shared/model.js'
import type { EventKind } from '../shared/report.js'
import { copyText, formatDuration } from './format.js'
import type { TrackKey } from './locales.js'
import { FigureView } from './widgets.js'

export interface TreeCursor {
  sessionId: string
  nodeId: string
  key: string
  kind: 'turn' | 'step' | 'attempt' | 'tool' | 'sidecar' | 'unlinked'
  status: NodeStatus
  expandable: boolean
  /** Node the inspector opens. A step opens its latest attempt. */
  activateId: string
  attemptId?: string
}

export interface TreeProps {
  sessionId: string
  track: TrackState | undefined
  trackOf: (sessionId: string) => TrackState | undefined
  open: Readonly<Record<string, boolean>>
  onToggle: (key: string, kind: string, status: NodeStatus) => void
  selected: { sessionId: string; nodeId: string } | undefined
  onSelect: (sessionId: string, nodeId: string) => void
  onActivate?: (cursor: TreeCursor) => void
  onAttempt?: (attemptId: string) => void
  t: (key: TrackKey) => string
  now?: number
  /** When set, rows that are not this kind drop out of the tree. Turns stay. */
  filter?: EventKind
  /** Compaction numbers for one turn. Other turns keep the plain sidecar label. */
  turnBill?: { turnId: string; reclaimed?: Figure; cost: Figure }
  parentTurnId?: string
  /** Nesting depth. Indent applies only inside the label cluster. */
  depth?: number
}

/** Render one session's index, nesting a child session's own index under its tool. */
export function Tree(props: TreeProps): ReactNode {
  const { track, t } = props
  if (track === undefined) return <p className="dsh-context-track-muted">{t('unavailable')}</p>
  return (
    <div>
      {track.root.map(node => (
        <RootRow key={`${props.sessionId}:${node.id}`} node={node} {...props} />
      ))}
    </div>
  )
}

function RootRow(props: TreeProps & { node: RootNode }): ReactNode {
  const { node } = props
  if (node.kind === 'turn') return <TurnRow {...props} node={node} />
  if (node.kind === 'sidecar') return <SidecarRow {...props} node={node} />
  return <UnlinkedRow {...props} node={node} />
}

function TurnRow({ node, ...props }: TreeProps & { node: TurnNode }): ReactNode {
  const key = rowKey(props.sessionId, node.id)
  const expanded = props.open[key] ?? defaultExpanded('turn', node.status)
  const origin = node.startTime
  const end = node.endTime ?? props.now
  const cursor: TreeCursor = {
    sessionId: props.sessionId, nodeId: node.id, key, kind: 'turn', status: node.status,
    expandable: node.items.length > 0, activateId: node.id,
  }
  return (
    <div>
      <Row
        label={props.t('turn').replace('{n}', String(node.turn))}
        status={node.status}
        expanded={expanded}
        canExpand={node.items.length > 0}
        current={isCurrent(props, node.id)}
        duration={origin !== undefined && end !== undefined ? end - origin : undefined}
        depth={nest(props)}
        t={props.t}
        onToggle={() => { props.onToggle(key, 'turn', node.status) }}
        onSelect={() => { activate(props, cursor) }}
      />
      {expanded ? (
        <div className="dsh-context-track-children">
          {node.items.map(item => (
            <ItemRow key={item.id} item={item} origin={origin} {...props} depth={nest(props) + 1} parentTurnId={node.id} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ItemRow(props: TreeProps & { origin?: number; item: TurnItem }): ReactNode {
  const { item } = props
  if (item.kind === 'step') return <StepRow {...props} node={item} />
  if (item.kind === 'sidecar') return <SidecarRow {...props} node={item} />
  return <UnlinkedRow {...props} node={item} />
}

function StepRow({
  node, origin, ...props
}: TreeProps & { origin?: number; node: StepNode }): ReactNode {
  if (!rowVisible('step', undefined, props.filter)) return null
  const key = rowKey(props.sessionId, node.id)
  const expanded = props.open[key] ?? false
  const depth = nest(props)
  const latest = node.attempts[node.attempts.length - 1]
  const target = latest?.id ?? node.id
  const canExpand = node.attempts.length > 0 || node.tools.length > 0 || (node.searches?.length ?? 0) > 0
  const start = node.startTime ?? origin
  const end = node.endTime ?? props.now
  const cursor: TreeCursor = {
    sessionId: props.sessionId, nodeId: node.id, key, kind: 'step', status: node.status,
    expandable: canExpand, activateId: target, ...(latest !== undefined ? { attemptId: latest.id } : {}),
  }
  return (
    <div>
      <Row
        label={props.t('step').replace('{n}', String(node.step))}
        secondary={node.model}
        status={node.status}
        expanded={expanded}
        canExpand={canExpand}
        current={isCurrent(props, target) || isCurrent(props, node.id)}
        usage={node.usage}
        duration={start !== undefined && end !== undefined ? end - start : undefined}
        depth={depth}
        t={props.t}
        onToggle={() => { props.onToggle(key, 'step', node.status) }}
        onSelect={() => { activate(props, cursor) }}
      />
      {expanded ? (
        <div className="dsh-context-track-children">
          {stepEntries(node).map(entry => {
            if (entry.kind === 'attempt') {
              if (!rowVisible('attempt', undefined, props.filter)) return null
              return (
                <AttemptRow key={entry.attempt.id} attempt={entry.attempt} {...props} depth={depth + 1} />
              )
            }
            if (entry.kind === 'search') {
              if (!rowVisible('sidecar', entry.search.purpose, props.filter)) return null
              return <SidecarRow key={entry.search.id} node={entry.search} {...props} depth={depth + 1} />
            }
            if (!rowVisible('tool', undefined, props.filter)) return null
            const tool = entry.tool
            const childKey = rowKey(props.sessionId, tool.id)
            const childOpen = props.open[childKey] ?? false
            const expandable = tool.childSessionId !== undefined && childExpandable(tool.childMode)
            const childTrack = expandable && tool.childSessionId !== undefined ? props.trackOf(tool.childSessionId) : undefined
            const shown = displayStatus(tool.status, childTrack)
            const cursor: TreeCursor = {
              sessionId: props.sessionId, nodeId: tool.id, key: childKey, kind: 'tool', status: shown,
              expandable, activateId: tool.id,
            }
            return (
              <div key={tool.id}>
                <Row
                  label={tool.name}
                  status={shown}
                  expanded={childOpen}
                  canExpand={expandable}
                  current={isCurrent(props, tool.id)}
                  duration={tool.startTime !== undefined && tool.endTime !== undefined ? tool.endTime - tool.startTime : undefined}
                  depth={depth + 1}
                  t={props.t}
                  onToggle={() => { props.onToggle(childKey, 'tool', shown) }}
                  onSelect={() => { activate(props, cursor) }}
                />
                {(tool.searches ?? []).some(search => rowVisible('sidecar', search.purpose, props.filter)) ? (
                  <div className="dsh-context-track-children">
                    {(tool.searches ?? []).map(search => (
                      rowVisible('sidecar', search.purpose, props.filter)
                        ? <SidecarRow key={search.id} node={search} {...props} depth={depth + 2} />
                        : null
                    ))}
                  </div>
                ) : null}
                {childOpen && expandable && tool.childSessionId !== undefined ? (
                  <div className="dsh-context-track-children">
                    <Tree {...props} sessionId={tool.childSessionId} track={childTrack} depth={depth + 2} />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function AttemptRow({
  attempt, ...props
}: TreeProps & { attempt: AttemptRef }): ReactNode {
  const end = attempt.endTime
  const start = attempt.streamStart ?? end
  const key = rowKey(props.sessionId, attempt.id)
  const cursor: TreeCursor = {
    sessionId: props.sessionId, nodeId: attempt.id, key, kind: 'attempt', status: attempt.status,
    expandable: false, activateId: attempt.id, attemptId: attempt.id,
  }
  return (
    <Row
      label={props.t('attempt').replace('{n}', String(attempt.attempt))}
      status={attempt.status}
      expanded={false}
      canExpand={false}
      current={isCurrent(props, attempt.id)}
      usage={attempt.usage}
      duration={start !== undefined && end !== undefined ? end - start : undefined}
      depth={nest(props)}
      t={props.t}
      onToggle={() => undefined}
      onSelect={() => { activate(props, cursor) }}
    />
  )
}

function figureText(figure: Figure | undefined, t: (key: TrackKey) => string): string {
  if (figure === undefined || figure.basis === 'absent' || figure.value === undefined) return '-'
  const basis = figure.basis === 'usage' ? t('exact') : t('estimated')
  return `${String(figure.value)} ${basis}`
}

function SidecarRow(props: TreeProps & { node: Extract<TurnItem, { kind: 'sidecar' }> }): ReactNode {
  if (!rowVisible('sidecar', props.node.purpose, props.filter)) return null
  const bill = props.turnBill?.turnId === props.parentTurnId ? props.turnBill : undefined
  const label = props.node.purpose === 'session-title'
    ? `${props.t('title')} -`
    : props.node.purpose === 'compaction'
      ? bill === undefined
        ? props.t('compaction')
        : `${props.t('compaction')} ${props.t('reclaimed')} ${figureText(bill.reclaimed, props.t)} · ${props.t('compactionCost')} ${figureText(bill.cost, props.t)}`
      : props.t('search')
  const key = rowKey(props.sessionId, props.node.id)
  const cursor: TreeCursor = {
    sessionId: props.sessionId, nodeId: props.node.id, key, kind: 'sidecar', status: props.node.status,
    expandable: false, activateId: props.node.id,
  }
  return (
    <Row
      label={label}
      status={props.node.status}
      expanded={false}
      canExpand={false}
      current={isCurrent(props, props.node.id)}
      depth={nest(props)}
      t={props.t}
      onToggle={() => undefined}
      onSelect={() => { activate(props, cursor) }}
    />
  )
}

function UnlinkedRow(props: TreeProps & { node: Extract<TurnItem, { kind: 'unlinked' }> | Extract<RootNode, { kind: 'unlinked' }> }): ReactNode {
  const key = rowKey(props.sessionId, props.node.id)
  const expanded = props.open[key] ?? false
  const expandable = childExpandable(props.node.childMode)
  const childTrack = expandable ? props.trackOf(props.node.childSessionId) : undefined
  const cursor: TreeCursor = {
    sessionId: props.sessionId, nodeId: props.node.id, key, kind: 'unlinked', status: 'ok',
    expandable, activateId: props.node.id,
  }
  if (!rowVisible('unlinked', undefined, props.filter)) return null
  return (
    <div>
      <Row
        label={props.node.childLabel ?? props.t('unlinked')}
        status="ok"
        expanded={expanded}
        canExpand={expandable}
        current={isCurrent(props, props.node.id)}
        depth={nest(props)}
        t={props.t}
        onToggle={() => { props.onToggle(key, 'unlinked', 'ok') }}
        onSelect={() => { activate(props, cursor) }}
      />
      {expanded && expandable ? (
        <div className="dsh-context-track-children">
          <Tree {...props} sessionId={props.node.childSessionId} track={childTrack} depth={nest(props) + 1} />
        </div>
      ) : null}
    </div>
  )
}

function Row({
  label, secondary, status, expanded, canExpand, current, usage, duration, depth, t, onToggle, onSelect,
}: {
  label: string
  secondary?: string
  status: NodeStatus
  expanded: boolean
  canExpand: boolean
  current: boolean
  usage?: TokenUsageScalars
  duration?: number
  depth: number
  t: (key: TrackKey) => string
  onToggle: () => void
  onSelect: () => void
}): ReactNode {
  const bill = usage === undefined ? undefined : billOf(usage)
  return (
    <div className="dsh-context-track-row" aria-current={current ? 'true' : undefined}>
      <div
        className="dsh-context-track-cluster"
        data-depth={depth}
        style={{ paddingInlineStart: `${depth * 0.75}rem` }}
      >
        {canExpand ? (
          <button
            type="button"
            className="dsh-context-track-chevron"
            aria-expanded={expanded}
            aria-label={expanded ? t('collapse') : t('expand')}
            onClick={onToggle}
          >
            <span aria-hidden="true">{expanded ? '▾' : '▸'}</span>
          </button>
        ) : (
          <span className="dsh-context-track-chevron" aria-hidden="true" />
        )}
        <span className={`dsh-context-track-dot dsh-context-track-status-${status}`} />
        <button type="button" className="dsh-context-track-label" onClick={onSelect}>
          <span>
            {label}
            {status === 'ok' ? null : (
              <>
                {' '}
                <span className={`dsh-context-track-status-${status}`}>{t(status)}</span>
              </>
            )}
          </span>
          {secondary !== undefined && secondary.length > 0 ? (
            <span className="dsh-context-track-muted">{secondary}</span>
          ) : null}
        </button>
      </div>
      <span data-column="duration">
        {duration !== undefined ? <DurationView ms={duration} /> : null}
      </span>
      <span data-column="tokens">
        {bill !== undefined ? (
          <span className="dsh-context-track-num">
            <FigureView figure={bill.input} t={t} showBasis={false} />
            {' → '}
            <FigureView figure={bill.output} t={t} showBasis={false} />
          </span>
        ) : null}
      </span>
    </div>
  )
}

function DurationView({ ms }: { ms: number }): ReactNode {
  const shown = formatDuration(ms)
  if (!shown.abbreviated) return <span className="dsh-context-track-num">{shown.text}</span>
  return (
    <button
      type="button"
      className="dsh-context-track-num"
      title={shown.full}
      data-full={shown.full}
      onClick={event => {
        event.stopPropagation()
        void copyText(shown.full)
      }}
    >
      {shown.text}
    </button>
  )
}

function rowKey(sessionId: string, nodeId: string): string {
  return `${sessionId}:${nodeId}`
}

function isCurrent(props: TreeProps, nodeId: string): boolean {
  return props.selected?.sessionId === props.sessionId && props.selected.nodeId === nodeId
}

/** A parent tool stays "running" in the tree while the child still has an open turn. */
function displayStatus(status: NodeStatus, child: TrackState | undefined): NodeStatus {
  if (child?.root.some(node => node.kind === 'turn' && node.status === 'running')) return 'running'
  return status
}

function activate(props: TreeProps, cursor: TreeCursor): void {
  props.onSelect(props.sessionId, cursor.activateId)
  if (cursor.attemptId !== undefined) props.onAttempt?.(cursor.attemptId)
  props.onActivate?.(cursor)
}

function nest(props: { depth?: number }): number {
  return props.depth ?? 0
}

/** Attempts, tools, and step-level searches in log order. Tool-owned searches stay on the tool. */
function stepEntries(step: StepNode): Array<
  | { seq: number; kind: 'attempt'; attempt: AttemptRef }
  | { seq: number; kind: 'tool'; tool: StepNode['tools'][number] }
  | { seq: number; kind: 'search'; search: NonNullable<StepNode['searches']>[number] }
> {
  const entries = [
    ...step.attempts.map(attempt => ({ seq: attempt.outputSeq ?? attempt.inputSeq, kind: 'attempt' as const, attempt })),
    ...step.tools.map(tool => ({ seq: tool.callSeq, kind: 'tool' as const, tool })),
    ...(step.searches ?? []).map(search => ({ seq: search.requestSeq, kind: 'search' as const, search })),
  ]
  return entries.sort((left, right) => left.seq - right.seq)
}

/** Kind filter for the tree. Turns always stay so the rail of the loop is still there. */
export function rowVisible(kind: string, purpose: string | undefined, filter: EventKind | undefined): boolean {
  if (filter === undefined) return true
  if (kind === 'turn') return true
  if (kind === 'step') return filter === 'model' || filter === 'tool'
  if (kind === 'attempt') return filter === 'model'
  if (kind === 'tool') return filter === 'tool'
  if (kind === 'sidecar') {
    if (filter === 'compaction') return purpose === 'compaction'
    if (filter === 'title') return purpose === 'session-title'
    return false
  }
  return false
}

/** Visible rows in paint order. Keyboard moves through this list. */
export function visibleTargets(
  sessionId: string,
  track: TrackState | undefined,
  open: Readonly<Record<string, boolean>>,
  trackOf: (sessionId: string) => TrackState | undefined,
  filter?: EventKind,
): TreeCursor[] {
  const rows: TreeCursor[] = []
  walk(sessionId, track, open, trackOf, filter, rows)
  return rows
}

function walk(
  sessionId: string,
  track: TrackState | undefined,
  open: Readonly<Record<string, boolean>>,
  trackOf: (sessionId: string) => TrackState | undefined,
  filter: EventKind | undefined,
  rows: TreeCursor[],
): void {
  if (track === undefined) return
  for (const node of track.root) {
    if (node.kind === 'turn') {
      const key = rowKey(sessionId, node.id)
      const expanded = open[key] ?? defaultExpanded('turn', node.status)
      rows.push({
        sessionId, nodeId: node.id, key, kind: 'turn', status: node.status,
        expandable: node.items.length > 0, activateId: node.id,
      })
      if (!expanded) continue
      for (const item of node.items) pushItem(sessionId, item, open, trackOf, filter, rows)
      continue
    }
    if (node.kind === 'sidecar' || node.kind === 'unlinked') {
      pushItem(sessionId, node, open, trackOf, filter, rows)
    }
  }
}

function pushItem(
  sessionId: string,
  item: TurnItem | Extract<RootNode, { kind: 'sidecar' | 'unlinked' }>,
  open: Readonly<Record<string, boolean>>,
  trackOf: (sessionId: string) => TrackState | undefined,
  filter: EventKind | undefined,
  rows: TreeCursor[],
): void {
  if (item.kind === 'sidecar') {
    if (!rowVisible('sidecar', item.purpose, filter)) return
    const key = rowKey(sessionId, item.id)
    rows.push({
      sessionId, nodeId: item.id, key, kind: 'sidecar', status: item.status,
      expandable: false, activateId: item.id,
    })
    return
  }
  if (item.kind === 'unlinked') {
    if (!rowVisible('unlinked', undefined, filter)) return
    const key = rowKey(sessionId, item.id)
    const expandable = childExpandable(item.childMode)
    const expanded = open[key] ?? false
    rows.push({
      sessionId, nodeId: item.id, key, kind: 'unlinked', status: 'ok', expandable, activateId: item.id,
    })
    if (expanded && expandable) walk(item.childSessionId, trackOf(item.childSessionId), open, trackOf, filter, rows)
    return
  }
  if (!rowVisible('step', undefined, filter)) return
  const key = rowKey(sessionId, item.id)
  const expanded = open[key] ?? false
  const latest = item.attempts[item.attempts.length - 1]
  const canExpand = item.attempts.length > 0 || item.tools.length > 0 || (item.searches?.length ?? 0) > 0
  rows.push({
    sessionId, nodeId: item.id, key, kind: 'step', status: item.status, expandable: canExpand,
    activateId: latest?.id ?? item.id,
    ...(latest !== undefined ? { attemptId: latest.id } : {}),
  })
  if (!expanded) return
  for (const entry of stepEntries(item)) {
    if (entry.kind === 'attempt') {
      if (!rowVisible('attempt', undefined, filter)) continue
      rows.push({
        sessionId, nodeId: entry.attempt.id, key: rowKey(sessionId, entry.attempt.id), kind: 'attempt',
        status: entry.attempt.status, expandable: false, activateId: entry.attempt.id, attemptId: entry.attempt.id,
      })
      continue
    }
    if (entry.kind === 'search') {
      if (!rowVisible('sidecar', entry.search.purpose, filter)) continue
      rows.push({
        sessionId, nodeId: entry.search.id, key: rowKey(sessionId, entry.search.id), kind: 'sidecar',
        status: entry.search.status, expandable: false, activateId: entry.search.id,
      })
      continue
    }
    if (!rowVisible('tool', undefined, filter)) continue
    const childKey = rowKey(sessionId, entry.tool.id)
    const expandable = entry.tool.childSessionId !== undefined && childExpandable(entry.tool.childMode)
    const childOpen = open[childKey] ?? false
    rows.push({
      sessionId, nodeId: entry.tool.id, key: childKey, kind: 'tool', status: entry.tool.status,
      expandable, activateId: entry.tool.id,
    })
    for (const search of entry.tool.searches ?? []) {
      if (!rowVisible('sidecar', search.purpose, filter)) continue
      rows.push({
        sessionId, nodeId: search.id, key: rowKey(sessionId, search.id), kind: 'sidecar',
        status: search.status, expandable: false, activateId: search.id,
      })
    }
    if (childOpen && expandable && entry.tool.childSessionId !== undefined) {
      walk(entry.tool.childSessionId, trackOf(entry.tool.childSessionId), open, trackOf, filter, rows)
    }
  }
}
