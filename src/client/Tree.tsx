/** Left-hand trace tree. Expansion lives in the parent component, never in the projection. */
import type { ReactNode } from 'react'
import {
  childExpandable,
  defaultExpanded,
  type NodeStatus,
  type RootNode,
  type StepNode,
  type TrackState,
  type TurnItem,
} from '../shared/model.js'
import type { TrackKey } from './locales.js'

export interface TreeProps {
  sessionId: string
  track: TrackState | undefined
  trackOf: (sessionId: string) => TrackState | undefined
  open: Readonly<Record<string, boolean>>
  onToggle: (key: string, kind: string, status: NodeStatus) => void
  selected: { sessionId: string; nodeId: string } | undefined
  onSelect: (sessionId: string, nodeId: string) => void
  t: (key: TrackKey) => string
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

function TurnRow({ node, ...props }: TreeProps & { node: Extract<RootNode, { kind: 'turn' }> }): ReactNode {
  const key = rowKey(props.sessionId, node.id)
  const expanded = props.open[key] ?? defaultExpanded('turn', node.status)
  return (
    <div>
      <Row
        label={props.t('turn').replace('{n}', String(node.turn))}
        status={node.status}
        expanded={expanded}
        canExpand={node.items.length > 0}
        current={isCurrent(props, node.id)}
        t={props.t}
        onToggle={() => { props.onToggle(key, 'turn', node.status) }}
        onSelect={() => { props.onSelect(props.sessionId, node.id) }}
      />
      {expanded ? (
        <div className="dsh-context-track-children">
          {node.items.map(item => (
            <ItemRow key={item.id} item={item} {...props} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ItemRow(props: TreeProps & { item: TurnItem }): ReactNode {
  const { item } = props
  if (item.kind === 'step') return <StepRow {...props} node={item} />
  if (item.kind === 'sidecar') return <SidecarRow {...props} node={item} />
  return <UnlinkedRow {...props} node={item} />
}

function StepRow({ node, ...props }: TreeProps & { node: StepNode }): ReactNode {
  const key = rowKey(props.sessionId, node.id)
  const expanded = props.open[key] ?? false
  const target = node.attempts.length > 0 ? node.attempts[node.attempts.length - 1]?.id ?? node.id : node.id
  const canExpand = node.attempts.length > 0 || node.tools.length > 0
  return (
    <div>
      <Row
        label={props.t('step').replace('{n}', String(node.step))}
        status={node.status}
        expanded={expanded}
        canExpand={canExpand}
        current={isCurrent(props, target)}
        t={props.t}
        onToggle={() => { props.onToggle(key, 'step', node.status) }}
        onSelect={() => { props.onSelect(props.sessionId, target) }}
      />
      {expanded ? (
        <div className="dsh-context-track-children">
          {node.attempts.map(attempt => (
            <Row
              key={attempt.id}
              label={props.t('attempt').replace('{n}', String(attempt.attempt))}
              status={attempt.status}
              expanded={false}
              canExpand={false}
              current={isCurrent(props, attempt.id)}
              t={props.t}
              onToggle={() => undefined}
              onSelect={() => { props.onSelect(props.sessionId, attempt.id) }}
            />
          ))}
          {node.tools.map(tool => {
            const childKey = rowKey(props.sessionId, tool.id)
            const childOpen = props.open[childKey] ?? false
            const expandable = tool.childSessionId !== undefined && childExpandable(tool.childMode)
            const childTrack = expandable && tool.childSessionId !== undefined ? props.trackOf(tool.childSessionId) : undefined
            const shown = displayStatus(tool.status, childTrack)
            return (
              <div key={tool.id}>
                <Row
                  label={tool.name}
                  status={shown}
                  expanded={childOpen}
                  canExpand={expandable}
                  current={isCurrent(props, tool.id)}
                  t={props.t}
                  onToggle={() => { props.onToggle(childKey, 'tool', shown) }}
                  onSelect={() => { props.onSelect(props.sessionId, tool.id) }}
                />
                {childOpen && expandable && tool.childSessionId !== undefined ? (
                  <div className="dsh-context-track-children">
                    <Tree {...props} sessionId={tool.childSessionId} track={childTrack} />
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

function SidecarRow(props: TreeProps & { node: Extract<TurnItem, { kind: 'sidecar' }> }): ReactNode {
  const label = props.node.purpose === 'session-title'
    ? props.t('title')
    : props.node.purpose === 'compaction'
      ? props.t('compaction')
      : props.t('search')
  return (
    <Row
      label={label}
      status={props.node.status}
      expanded={false}
      canExpand={false}
      current={isCurrent(props, props.node.id)}
      t={props.t}
      onToggle={() => undefined}
      onSelect={() => { props.onSelect(props.sessionId, props.node.id) }}
    />
  )
}

function UnlinkedRow(props: TreeProps & { node: Extract<TurnItem, { kind: 'unlinked' }> | Extract<RootNode, { kind: 'unlinked' }> }): ReactNode {
  const key = rowKey(props.sessionId, props.node.id)
  const expanded = props.open[key] ?? false
  const expandable = childExpandable(props.node.childMode)
  const childTrack = expandable ? props.trackOf(props.node.childSessionId) : undefined
  return (
    <div>
      <Row
        label={props.node.childLabel ?? props.t('unlinked')}
        status="ok"
        expanded={expanded}
        canExpand={expandable}
        current={isCurrent(props, props.node.id)}
        t={props.t}
        onToggle={() => { props.onToggle(key, 'unlinked', 'ok') }}
        onSelect={() => { props.onSelect(props.sessionId, props.node.id) }}
      />
      {expanded && expandable ? (
        <div className="dsh-context-track-children">
          <Tree {...props} sessionId={props.node.childSessionId} track={childTrack} />
        </div>
      ) : null}
    </div>
  )
}

function Row({
  label, status, expanded, canExpand, current, t, onToggle, onSelect,
}: {
  label: string
  status: NodeStatus
  expanded: boolean
  canExpand: boolean
  current: boolean
  t: (key: TrackKey) => string
  onToggle: () => void
  onSelect: () => void
}): ReactNode {
  return (
    <div className="dsh-context-track-row" aria-current={current ? 'true' : undefined}>
      {canExpand ? (
        <button type="button" onClick={onToggle} aria-expanded={expanded}>
          {expanded ? t('collapse') : t('expand')}
        </button>
      ) : null}
      <button type="button" className="dsh-context-track-label" onClick={onSelect}>
        <span>{label}</span>
        {' '}
        <span className={`dsh-context-track-status-${status}`}>{t(status)}</span>
      </button>
    </div>
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
