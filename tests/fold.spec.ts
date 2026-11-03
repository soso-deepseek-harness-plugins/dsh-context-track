import { describe, expect, it } from 'vitest'
import { SessionSeq, type SessionEvent } from '@deepseek-ai/dsh-session'
import { applyTrack, fold, foldAll } from '../src/host/fold.ts'
import {
  childExpandable,
  emptyTrack,
  isSubagentOrigin,
  type StepNode,
  type TurnNode,
} from '../src/shared/model.ts'

function ev(seq: number, type: string, data: unknown = {}): SessionEvent {
  return { type, seq: SessionSeq(seq), time: seq, data } as SessionEvent
}

function turn(state: ReturnType<typeof foldAll>, number: number): TurnNode {
  const node = state.root.find(item => item.kind === 'turn' && item.turn === number)
  if (node === undefined || node.kind !== 'turn') throw new Error(`missing turn ${number}`)
  return node
}

function step(state: ReturnType<typeof foldAll>): StepNode {
  const item = turn(state, 1).items.find(entry => entry.kind === 'step')
  if (item === undefined || item.kind !== 'step') throw new Error('missing step')
  return item
}

describe('fold', () => {
  it('records a failed attempt and the successful retry without message bodies', () => {
    const state = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'step/start', { turn: 1, step: 1 }),
      ev(2, 'assistant/attempt', { turn: 1, step: 1, stream: [] }),
      ev(3, 'llm/retry', { turn: 1, step: 1, retry: 1, delayMs: 10, failure: { message: 'down' } }),
      ev(4, 'assistant/message', {
        turn: 1, step: 1, stream: [],
        message: { role: 'assistant', content: [{ type: 'text', text: 'secret body' }] },
        usage: { inputTokens: 4, outputTokens: 2, totalTokens: 6 },
      }),
      ev(5, 'step/end', { turn: 1, step: 1 }),
    ])
    const node = step(state)
    expect(node.attempts.map(attempt => attempt.inputSeq)).toEqual([2, 4])
    expect(node.attempts[0]).toMatchObject({ status: 'error', retrySeq: 3 })
    expect(node.attempts[1]).toMatchObject({ status: 'ok', outputSeq: 4 })
    expect(node.usage).toEqual({ inputTokens: 4, outputTokens: 2, totalTokens: 6 })
    expect(node.status).toBe('ok')
    expect(JSON.stringify(state)).not.toContain('secret body')
  })

  it('keeps a running step input at the committed log length', () => {
    const state = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'step/start', { turn: 1, step: 1 }),
    ])
    expect(step(state)).toMatchObject({ status: 'running', inputSeq: 2, attempts: [] })
  })

  it('hangs a subagent on the tool result and fills the label from the catalog', () => {
    const state = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'step/start', { turn: 1, step: 1 }),
      ev(2, 'tool/call', { turn: 1, step: 1, callId: 'c1', name: 'spawn', arguments: '{"x":1}' }),
      ev(3, 'tool/result', {
        turn: 1, step: 1,
        message: {
          toolCallId: 'c1',
          isError: false,
          content: [{ type: 'text', text: JSON.stringify({ kind: 'activation', subagentId: 'child-1' }) }],
        },
      }),
      ev(4, 'subagent/catalog', { childId: 'child-1', mode: 'one-shot', label: 'Helper' }),
    ])
    const tool = step(state).tools[0]
    expect(tool).toMatchObject({
      childSessionId: 'child-1',
      childLabel: 'Helper',
      childMode: 'one-shot',
      status: 'ok',
    })
    expect(turn(state, 1).items.some(item => item.kind === 'unlinked')).toBe(false)
    expect(JSON.stringify(state)).not.toContain('{"x":1}')
  })

  it('leaves an unmatched catalog entry at the end of the turn', () => {
    const state = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'subagent/catalog', { childId: 'loose', mode: 'continuable', label: 'Loose' }),
      ev(2, 'step/start', { turn: 1, step: 1 }),
    ])
    const items = turn(state, 1).items
    expect(items.at(-1)).toMatchObject({ kind: 'unlinked', childSessionId: 'loose', childMode: 'continuable' })
    expect(items[0]).toMatchObject({ kind: 'step' })
  })

  it('stores external mode and does not inline another log', () => {
    const state = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'subagent/catalog', { childId: 'remote', mode: 'external', label: 'Remote' }),
    ])
    expect(turn(state, 1).items).toEqual([
      expect.objectContaining({ kind: 'unlinked', childSessionId: 'remote', childMode: 'external' }),
    ])
    expect(childExpandable('external')).toBe(false)
    expect(childExpandable('one-shot')).toBe(true)
  })

  it('does not treat a fork header as a subagent call', () => {
    expect(isSubagentOrigin({ parentSession: 'parent', origin: 'fork' })).toBe(false)
    expect(isSubagentOrigin({ parentSession: 'parent', origin: 'subagent' })).toBe(true)
    const state = foldAll([ev(0, 'turn/start', { turn: 1 })])
    expect(JSON.stringify(state)).not.toContain('fork-child')
  })

  it('places title, manual compaction, and search sidecars by sequence', () => {
    const state = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'session/title-llm-request', { system: 'name it', messages: [] }),
      ev(2, 'session/title', { title: 'Named', source: { kind: 'provider' } }),
      ev(3, 'turn/end', { turn: 1, reason: { kind: 'completed' } }),
      ev(4, 'compaction/start', { compactionId: 'manual', turn: null }),
      ev(5, 'turn/start', { turn: 2 }),
      ev(6, 'web/deepseek-search-llm-request', { query: 'hidden body' }),
    ])
    const first = turn(state, 1)
    expect(first.items[0]).toMatchObject({
      kind: 'sidecar', purpose: 'session-title', requestSeq: 1, outputSeq: 2, status: 'ok',
    })
    expect(turn(state, 2).items[0]).toMatchObject({ kind: 'sidecar', purpose: 'web-search', status: 'ok', requestSeq: 6 })
    expect(state.root.map(node => node.kind === 'turn' ? node.id : node.id)).toEqual(['turn:1', 'sidecar:4', 'turn:2'])
    expect(JSON.stringify(state)).not.toContain('name it')
    expect(JSON.stringify(state)).not.toContain('hidden body')
  })

  it('keeps each attempt’s usage and leaves a running step without timing scalars', () => {
    const state = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'step/start', { turn: 1, step: 1 }),
      ev(2, 'user/message', { role: 'user', content: [{ type: 'text', text: 'ask' }], source: { kind: 'user' } }),
    ])
    expect(step(state)).toMatchObject({ status: 'running', attempts: [] })
    expect(step(state)).not.toHaveProperty('waitMs')
    expect(step(state)).not.toHaveProperty('thinkMs')
    expect(turn(state, 1).userInputs).toEqual([{ seq: 2, time: 2 }])
    expect(JSON.stringify(state)).not.toContain('ask')

    const settled = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'step/start', { turn: 1, step: 1 }),
      ev(2, 'assistant/message', {
        turn: 1, step: 1,
        stream: [{ type: 'text-chunks', time0: 10, index: 0, dt: [4], texts: ['first body'] }],
        usage: { inputTokens: 3, outputTokens: 1, totalTokens: 4 },
        message: { role: 'assistant', content: [{ type: 'text', text: 'first body' }] },
      }),
      ev(3, 'llm/retry', { turn: 1, step: 1, retry: 1, delayMs: 25, failure: { message: 'down' } }),
      ev(4, 'assistant/message', {
        turn: 1, step: 1,
        stream: [{ type: 'text-chunks', time0: 40, index: 0, dt: [5], texts: ['second body'] }],
        usage: { inputTokens: 8, outputTokens: 2, totalTokens: 10 },
        message: { role: 'assistant', content: [{ type: 'text', text: 'second body' }] },
      }),
    ])
    const attempts = step(settled).attempts
    expect(attempts[0]?.usage).toEqual({ inputTokens: 3, outputTokens: 1, totalTokens: 4 })
    expect(attempts[1]?.usage).toEqual({ inputTokens: 8, outputTokens: 2, totalTokens: 10 })
    expect(attempts[0]?.delayMs).toBe(25)
    expect(step(settled).usage).toEqual({ inputTokens: 8, outputTokens: 2, totalTokens: 10 })
    expect(JSON.stringify(settled)).not.toContain('first body')
    expect(JSON.stringify(settled)).not.toContain('second body')
    expect(settled.stateVersion).toBe(4)
    const stale = { ...settled, stateVersion: 1 as never }
    expect(stale.stateVersion).not.toBe(settled.stateVersion)
    expect(foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'step/start', { turn: 1, step: 1 }),
    ]).stateVersion).toBe(4)
  })

  it('nests a search under the running tool, or under the step that produced it', () => {
    const duringTool = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'step/start', { turn: 1, step: 1 }),
      ev(2, 'assistant/message', {
        turn: 1, step: 1, stream: [],
        usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
        message: { role: 'assistant', content: [{ type: 'tool-call', name: 'web_search' }] },
      }),
      ev(3, 'tool/call', { turn: 1, step: 1, callId: 'c1', name: 'web_search', arguments: '{"query":"hidden"}' }),
      ev(4, 'web/deepseek-search-llm-request', { query: 'hidden body' }),
      ev(5, 'tool/result', { turn: 1, step: 1, message: { toolCallId: 'c1', content: [] } }),
    ])
    const called = step(duringTool)
    expect(called.searches).toBeUndefined()
    expect(called.tools[0]?.searches?.[0]).toMatchObject({
      purpose: 'web-search',
      requestSeq: 4,
      origin: { kind: 'tool', name: 'web_search', callId: 'c1', callSeq: 3 },
    })
    expect(JSON.stringify(duringTool)).not.toContain('hidden')

    const duringStep = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'step/start', { turn: 1, step: 1 }),
      ev(2, 'web/deepseek-search-llm-request', { query: 'early' }),
      ev(3, 'assistant/message', {
        turn: 1, step: 1, stream: [],
        usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
        message: { role: 'assistant', content: [{ type: 'text', text: 'early body' }] },
      }),
    ])
    expect(step(duringStep).tools).toEqual([])
    expect(step(duringStep).searches?.[0]?.origin).toMatchObject({
      kind: 'step', step: 1, attemptId: 'attempt:1:1:1', attempt: 1, outputSeq: 3,
    })
    expect(JSON.stringify(duringStep)).not.toContain('early')

    const afterStep = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'step/start', { turn: 1, step: 1 }),
      ev(2, 'step/end', { turn: 1, step: 1 }),
      ev(3, 'web/deepseek-search-llm-request', { query: 'late' }),
      ev(4, 'step/start', { turn: 1, step: 2 }),
    ])
    expect(step(afterStep).searches?.[0]?.requestSeq).toBe(3)
    expect(turn(afterStep, 1).items.filter(item => item.kind === 'sidecar')).toEqual([])

    const duringFetch = foldAll([
      ev(0, 'turn/start', { turn: 1 }),
      ev(1, 'step/start', { turn: 1, step: 1 }),
      ev(2, 'tool/call', { turn: 1, step: 1, callId: 'c1', name: 'web_search', arguments: '{}' }),
      ev(3, 'tool/result', { turn: 1, step: 1, message: { toolCallId: 'c1', content: [] } }),
      ev(4, 'tool/call', { turn: 1, step: 1, callId: 'c2', name: 'web_fetch', arguments: '{}' }),
      ev(5, 'web/deepseek-search-llm-request', { query: 'not-a-fetch' }),
    ])
    const hosted = step(duringFetch)
    expect(hosted.tools[0]?.searches).toBeUndefined()
    expect(hosted.tools[1]?.searches).toBeUndefined()
    expect(hosted.searches?.[0]?.requestSeq).toBe(5)
  })

  it('returns the same state for an unknown event and survives a throwing event', () => {
    const start = foldAll([ev(0, 'turn/start', { turn: 1 })])
    expect(fold(start, ev(1, 'plugin/unknown', { body: 'nope' }))).toBe(start)
    const bad = {
      seq: SessionSeq(1),
      get type(): string { throw new Error('boom') },
      data: {},
    } as SessionEvent
    expect(applyTrack(start, bad)).toBe(start)
    const next = applyTrack(applyTrack(start, bad), ev(2, 'turn/end', { turn: 1, reason: { kind: 'completed' } }))
    expect(next).not.toBe(start)
    expect(turn(next, 1).status).toBe('ok')
    expect(applyTrack(emptyTrack(), bad)).toBeTruthy()
  })
})
