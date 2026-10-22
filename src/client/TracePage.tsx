/**
 * Context-trace panel. The conversation tab and the right sidebar are both
 * session-scoped, so the current session is `sessionId`. Detail refreshes when
 * that session's committed projection changes. It does not subscribe to the
 * token stream. Child sessions are read from the session list.
 */
import { useEffect, useState, type ReactNode } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import type { NodeDetail } from '../shared/detail.js'
import {
  defaultExpanded,
  emptyTrack,
  toggleExpanded,
  type TrackState,
} from '../shared/model.js'
import '../shared/projection.js'
import { Detail } from './Detail.js'
import type { TrackKey } from './locales.js'
import { ensureStyles } from './styles.js'
import './slots.js'
import { Tree } from './Tree.js'

export interface TrackInject {
  getNode(sessionId: string, nodeId: string): Promise<RemoteResult<NodeDetail>>
}

type SessionView = PropsRuntime<'conversation.view'>

export type TracePageProps = Pick<SessionView, 'sessionId' | 'useSessions'> & PropsLocale<'dsh-context-track'> & TrackInject

interface Selection {
  sessionId: string
  nodeId: string
}

/** Left tree and right detail for the session this tab is bound to. */
export function TracePage({ sessionId, useSessions, t, getNode }: TracePageProps): ReactNode {
  ensureStyles()
  const list = useSessions(state => state)
  const track = sessionId === undefined ? undefined : readTrack(list.projectionsBySession, sessionId)
  const [open, setOpen] = useState<Readonly<Record<string, boolean>>>({})
  const [selection, setSelection] = useState<Selection | undefined>(undefined)
  const [detail, setDetail] = useState<NodeDetail | undefined>(undefined)
  const selectedTrack = selection === undefined ? undefined : readTrack(list.projectionsBySession, selection.sessionId)

  useEffect(() => {
    setSelection(undefined)
    setDetail(undefined)
  }, [sessionId])

  useEffect(() => {
    if (sessionId === undefined || selection === undefined) return undefined
    let cancelled = false
    const showMissing = () => { if (!cancelled) setDetail({ missing: true }) }
    // A throw here used to hit the slot error boundary and remove the whole panel.
    let pending: Promise<RemoteResult<NodeDetail>>
    try {
      pending = Promise.resolve(getNode(selection.sessionId, selection.nodeId))
    } catch {
      showMissing()
      return () => { cancelled = true }
    }
    void pending.then(result => {
      if (cancelled) return
      setDetail(result.ok ? result.value : { missing: true })
    }, showMissing)
    return () => { cancelled = true }
  }, [sessionId, selection, selectedTrack, getNode])

  if (sessionId === undefined) return <div className="dsh-context-track"><p className="dsh-context-track-empty">{t('empty')}</p></div>

  const translate = (key: TrackKey): string => t(key)
  return (
    <div className="dsh-context-track">
      <div className="dsh-context-track-tree">
        <Tree
          sessionId={sessionId}
          track={track ?? emptyTrack()}
          trackOf={id => readTrack(list.projectionsBySession, id)}
          open={open}
          onToggle={(key, kind, status) => {
            setOpen(current => toggleExpanded(current, key, defaultExpanded(kind, status)))
          }}
          selected={selection}
          onSelect={(id, nodeId) => { setSelection({ sessionId: id, nodeId }) }}
          t={translate}
        />
      </div>
      <div className="dsh-context-track-detail">
        <Detail detail={selection === undefined ? undefined : detail} t={translate} />
      </div>
    </div>
  )
}

function readTrack(
  projections: { [id: string]: { values: { track?: TrackState } } | undefined },
  sessionId: string,
): TrackState | undefined {
  return projections[sessionId]?.values.track
}
