/** Right-hand detail. Bodies are shown as recorded JSON. There is no token stream. */
import type { ReactNode } from 'react'
import { isMissing, type NodeDetail } from '../shared/detail.js'
import type { TrackKey } from './locales.js'

export interface DetailProps {
  detail: NodeDetail | undefined
  t: (key: TrackKey) => string
}

/** Render one fetched node, or the prompt shown before a selection. */
export function Detail({ detail, t }: DetailProps): ReactNode {
  if (detail === undefined) return <p className="dsh-track-muted">{t('hint')}</p>
  if (isMissing(detail)) return <p className="dsh-track-muted">{t('missing')}</p>
  if (detail.kind === 'attempt' || detail.kind === 'step') {
    return (
      <div>
        <Block title={t('metadata')} value={{
          status: detail.status,
          inputSeq: detail.inputSeq,
          ...(detail.kind === 'attempt' ? {
            usage: detail.usage,
            firstTokenTime: detail.firstTokenTime,
            streamDuration: detail.streamDuration,
            interrupted: detail.interrupted,
            retry: detail.retry,
          } : {}),
          config: detail.config,
          context: detail.context,
          adapterDefaults: detail.adapterDefaults,
        }} />
        <Block title={t('messages')} value={detail.messages} />
        <Block title={t('tools')} value={detail.tools} />
        <Block title={t('toolHistory')} value={detail.toolHistory} />
        {detail.kind === 'attempt' ? <Block title={t('output')} value={detail.output} /> : null}
      </div>
    )
  }
  if (detail.kind === 'tool') {
    return (
      <div>
        <Block title={t('metadata')} value={{ name: detail.name, callId: detail.callId, status: detail.status }} />
        <Block title={t('arguments')} value={detail.arguments} />
        <Block title={t('result')} value={detail.result} />
        {detail.childSessionId !== undefined ? (
          <Block title={t('child')} value={{
            childSessionId: detail.childSessionId,
            childLabel: detail.childLabel,
            childMode: detail.childMode,
          }} />
        ) : null}
      </div>
    )
  }
  if (detail.kind === 'sidecar' && detail.purpose === 'session-title') {
    return (
      <div>
        <Block title={t('metadata')} value={{ status: detail.status, route: detail.route, maxTokens: detail.maxTokens, reasoningEffort: detail.reasoningEffort }} />
        <Block title={t('messages')} value={{ system: detail.system, messages: detail.messages }} />
        <Block title={t('output')} value={detail.output ?? ''} />
      </div>
    )
  }
  if (detail.kind === 'sidecar' && detail.purpose === 'compaction') {
    return (
      <div>
        <Block title={t('metadata')} value={{
          status: detail.status,
          provider: detail.provider,
          model: detail.model,
          maxTokens: detail.maxTokens,
          usage: detail.usage,
          error: detail.error,
          config: detail.config,
        }} />
        <Block title={t('messages')} value={detail.messages} />
        <Block title={t('tools')} value={detail.tools} />
        <Block title={t('toolHistory')} value={detail.toolHistory} />
        <Block title={t('instruction')} value={detail.instruction.recorded ? detail.instruction.text : t('instructionMissing')} />
        <Block title={t('summary')} value={detail.summary} />
        <Block title={t('rawOutput')} value={detail.rawOutput} />
      </div>
    )
  }
  if (detail.kind === 'sidecar' && detail.purpose === 'web-search') {
    return (
      <div>
        <Block title={t('metadata')} value={{ status: detail.status }} />
        <Block title={t('request')} value={detail.request} />
      </div>
    )
  }
  return <Block title={t('metadata')} value={detail} />
}

function Block({ title, value }: { title: string; value: unknown }): ReactNode {
  return (
    <section className="dsh-track-block">
      <h3>{title}</h3>
      <pre className="dsh-track-pre">{formatValue(value)}</pre>
    </section>
  )
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (value === undefined) return ''
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}
