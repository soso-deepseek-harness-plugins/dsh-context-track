import { describe, expect, it } from 'vitest'
import {
  Session,
  SessionId,
  SessionSeq,
  foldSurface,
  type SessionEvent,
} from '@deepseek-ai/dsh-session'
import { assistantStreamFirstTokenTime, createMessage, createUserMessage } from '@deepseek-ai/dsh-llm'
import { materializeAttempt, materializePrefix } from '../src/host/materialize.ts'
import { adoptedTitle, compactionDetail, searchDetail, titleDetail } from '../src/host/sidecar.ts'
import { foldAll } from '../src/host/fold.ts'
import { ObservationCache } from '../src/host/remote.ts'
import type { AttemptRef, SidecarNode } from '../src/shared/model.ts'

function text(value: unknown): string {
  return JSON.stringify(value)
}

describe('materialize', () => {
  it('replays the prefix the call saw, not the surface after a later replacement', () => {
    const session = Session.create(SessionId('history'))
    session.append('request/header', {
      reason: 'initial',
      header: {
        config: { provider: 'deepseek', model: 'chat', temperature: 0 },
        tools: [{ name: 'echo', description: 'Echo', parameters: { type: 'object' } }],
      },
    })
    session.append('request/context', { provider: 'deepseek', model: 'chat' })
    session.append('user/message', createUserMessage({
      content: [{ type: 'text', text: 'original-request' }],
      source: { kind: 'user' },
    }), { surfaceOp: 'append' })
    const stream = [{ type: 'text-chunks' as const, time0: 1000, index: 0, dt: [40], texts: ['hi'] }]
    const assistant = session.append('assistant/message', {
      turn: 1,
      step: 1,
      stream,
      usage: { inputTokens: 3, outputTokens: 1 },
      message: createMessage({
        role: 'assistant',
        content: [{ type: 'text', text: 'hi' }],
        source: { kind: 'model', provider: 'deepseek', model: 'chat' },
      }),
    }, { surfaceOp: 'append' })
    session.append('user/message', createUserMessage({
      content: [{ type: 'text', text: 'summary-replacement' }],
      source: { kind: 'user' },
    }), {
      surfaceOp: { op: 'replace', startSeq: SessionSeq(2), endSeq: assistant.seq },
      sourceEventSeqs: [SessionSeq(2), assistant.seq],
    })
    const attempt: AttemptRef = {
      id: 'attempt:1:1:1',
      attempt: 1,
      inputSeq: assistant.seq,
      outputSeq: assistant.seq,
      status: 'ok',
    }
    const detail = materializeAttempt(session.snapshotEvents(), attempt, [])
    expect(text(detail.messages)).toContain('original-request')
    expect(text(detail.messages)).not.toContain('summary-replacement')
    expect(detail.config).toMatchObject({ provider: 'deepseek', model: 'chat' })
    expect(detail.context).toMatchObject({ provider: 'deepseek', model: 'chat' })
    expect(detail.tools).toEqual([expect.objectContaining({ name: 'echo' })])
    expect(detail.toolHistory).toEqual({
      tools: [expect.objectContaining({ name: 'echo' })],
      updates: [],
    })
    expect(detail.usage).toEqual({ inputTokens: 3, outputTokens: 1 })
    expect(detail.firstTokenTime).toBe(assistantStreamFirstTokenTime(stream))
    expect(detail.streamDuration).toBe(40)
    expect(detail.output).toBeDefined()
    const current = foldSurface(session.snapshotEvents(), [])
    const currentText = current.nodes.map(seq => {
      const event = session.snapshotEvents().find(item => item.seq === seq)
      return event === undefined ? '' : text(event.data)
    }).join('\n')
    expect(currentText).toContain('summary-replacement')
    expect(currentText).not.toContain('original-request')
  })

  it('includes the retry failure and does not call the producer twice for one inputSeq', () => {
    const events = [{
      seq: SessionSeq(5),
      type: 'llm/retry',
      time: 5,
      data: { failure: { message: 'upstream', code: 'UPSTREAM' }, retry: 2, delayMs: 30 },
    }] as unknown as SessionEvent[]
    const attempt: AttemptRef = {
      id: 'attempt:1:1:1', attempt: 1, inputSeq: 0, retrySeq: 5, status: 'error',
    }
    const detail = materializeAttempt(events, attempt, [])
    expect(detail.retry).toEqual({
      failure: { message: 'upstream', code: 'UPSTREAM' },
      retry: 2,
      delayMs: 30,
    })
    const cache = new ObservationCache()
    let calls = 0
    const first = cache.getOr('s', 'input:0', () => {
      calls += 1
      return materializePrefix(events, 0, [])
    })
    const second = cache.getOr('s', 'input:0', () => {
      calls += 1
      return materializePrefix(events, 0, [])
    })
    expect(second).toBe(first)
    expect(calls).toBe(1)
    cache.end('s')
    cache.getOr('s', 'input:0', () => { calls += 1; return materializePrefix(events, 0, []) })
    expect(calls).toBe(2)
  })

  it('adopts only a provider title that belongs to the request', () => {
    const request: SidecarNode = {
      kind: 'sidecar', id: 'sidecar:1', purpose: 'session-title', status: 'ok', requestSeq: 1, outputSeq: 2,
    }
    const adopted = [
      ev(1, 'session/title-llm-request', { system: 'sys', messages: ['hello'], route: { provider: 'p' }, maxTokens: 16 }),
      ev(2, 'session/title', { title: 'Adopted', source: { kind: 'provider' } }),
    ]
    expect(titleDetail(adopted, request).output).toBe('Adopted')
    const fallback = [
      ev(1, 'session/title-llm-request', { system: 'sys', messages: [], route: {}, maxTokens: 16 }),
      ev(2, 'session/title', { title: 'Fallback', source: { kind: 'fallback' } }),
    ]
    expect(adoptedTitle(fallback, 1)).toBeUndefined()
    expect(titleDetail(fallback, { ...request, outputSeq: undefined, status: 'running' }).output).toBeUndefined()
    const interrupted = [
      ev(1, 'session/title-llm-request', { system: 'sys', messages: [], route: {}, maxTokens: 16 }),
      ev(2, 'session/title-llm-request', { system: 'again', messages: [], route: {}, maxTokens: 16 }),
      ev(3, 'session/title', { title: 'Later', source: { kind: 'provider' } }),
    ]
    expect(adoptedTitle(interrupted, 1)).toBeUndefined()
    expect(adoptedTitle(interrupted, 2)).toBe('Later')
  })

  it('replays shadowed messages for a compaction and surfaces an end error', () => {
    const session = Session.create(SessionId('compact'))
    session.append('user/message', createUserMessage({
      content: [{ type: 'text', text: 'shadowed-line' }],
      source: { kind: 'user' },
    }), { surfaceOp: 'append' })
    const events = [...session.snapshotEvents()]
    events.push(
      ev(1, 'compaction/start', { compactionId: 'c1', turn: 1 }),
      ev(2, 'compaction/summary', {
        compactionId: 'c1',
        summary: 'short',
        rawOutput: 'short raw',
        usage: { inputTokens: 8, outputTokens: 1 },
        provider: 'deepseek',
        model: 'chat',
        shadowedSeqs: [0],
      }),
      ev(3, 'compaction/end', { compactionId: 'c1', error: 'budget' }),
    )
    const node: SidecarNode = {
      kind: 'sidecar', id: 'sidecar:1', purpose: 'compaction', status: 'error',
      requestSeq: 1, outputSeq: 2, endSeq: 3, compactionId: 'c1',
    }
    const detail = compactionDetail(events, node, [], { recorded: false })
    expect(text(detail.messages)).toContain('shadowed-line')
    expect(detail.summary).toBe('short')
    expect(detail.rawOutput).toBe('short raw')
    expect(detail.usage).toEqual({ inputTokens: 8, outputTokens: 1 })
    expect(detail.error).toBe('budget')
    expect(detail.instruction).toEqual({ recorded: false })
  })

  it('shows the search request in the detail and keeps it out of the index', () => {
    const events = [
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'web/deepseek-search-llm-request', { query: 'secret-query' }),
    ]
    const state = foldAll(events)
    expect(JSON.stringify(state)).not.toContain('secret-query')
    const sidecar = state.root[0]?.kind === 'turn'
      ? state.root[0].items.find(item => item.kind === 'sidecar')
      : undefined
    expect(sidecar?.kind).toBe('sidecar')
    if (sidecar?.kind !== 'sidecar') return
    expect(searchDetail(events, sidecar).request).toEqual({ query: 'secret-query' })
  })
})

function ev(seq: number, type: string, data: unknown): SessionEvent {
  return { type, seq: SessionSeq(seq), time: seq, data } as SessionEvent
}
