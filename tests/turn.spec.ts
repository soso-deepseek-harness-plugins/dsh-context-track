import { describe, expect, it } from 'vitest'
import { Context, Service } from '@deepseek-ai/cordis'
import SessionStore, { Session, SessionId, SessionSeq, type SessionEvent } from '@deepseek-ai/dsh-session'
import SessionProjectionRegistry from '@deepseek-ai/dsh-session-projection'
import { foldAll } from '../src/host/fold.ts'
import { apply } from '../src/host/index.ts'
import { buildTurnReport } from '../src/host/turn.ts'
import type { TurnNode } from '../src/shared/model.ts'

function ev(seq: number, type: string, data: unknown, time = seq * 1000): SessionEvent {
  return { type, seq: SessionSeq(seq), time, data } as SessionEvent
}

function turnOf(events: readonly SessionEvent[]): TurnNode {
  const node = foldAll(events).root.find(item => item.kind === 'turn')
  if (node === undefined || node.kind !== 'turn') throw new Error('missing turn')
  return node
}

describe('getTurn', () => {
  it('adds every reported attempt, keeps the window on the selected attempt, and leaves the gap unscaled', () => {
    const events = [
      ev(0, 'turn/start', { turn: 1 }, 1000),
      ev(1, 'step/start', { turn: 1, step: 1 }, 1100),
      ev(2, 'user/message', {
        role: 'user',
        content: [{ type: 'text', text: 'abcd' }],
        source: { kind: 'user' },
      }, 1300),
      ev(3, 'request/header', { header: { config: { provider: 'deepseek', model: 'chat' } }, reason: 'initial' }, 1400),
      ev(4, 'assistant/message', {
        turn: 1,
        step: 1,
        stream: [{ type: 'reasoning-chunks', time0: 1800, index: 0, dt: [400], texts: ['think'] }],
        usage: { inputTokens: 100, outputTokens: 1, totalTokens: 101, cacheReadTokens: 0 },
        message: { role: 'assistant', content: [{ type: 'reasoning', text: 'think' }] },
      }, 2200),
      ev(5, 'llm/retry', { turn: 1, step: 1, retry: 1, delayMs: 10, failure: { message: 'down' } }, 2300),
      ev(6, 'request/header', { header: { config: { provider: 'deepseek', model: 'reasoner' } }, reason: 'retry' }, 2400),
      ev(7, 'assistant/message', {
        turn: 1,
        step: 1,
        stream: [{ type: 'text-chunks', time0: 4000, index: 0, dt: [20], texts: ['ok'] }],
        usage: { inputTokens: 0, outputTokens: 1, totalTokens: 51, cacheReadTokens: 50 },
        message: { role: 'assistant', content: [{ type: 'text', text: 'ok' }] },
      }, 4020),
      ev(8, 'step/end', { turn: 1, step: 1 }, 4100),
      ev(9, 'turn/end', { turn: 1, reason: { kind: 'completed' } }, 4200),
    ]
    const turn = turnOf(events)
    const failed = buildTurnReport({
      events,
      turn,
      attempt: turn.items.find(item => item.kind === 'step')?.kind === 'step'
        ? (turn.items.find(item => item.kind === 'step') as { attempts: { id: string; inputSeq: number; usage?: unknown }[] }).attempts[0]
        : undefined,
      messages: [{ role: 'user', content: [{ type: 'text', text: 'abcd' }], source: { kind: 'user' } }],
      tools: [{ name: 'echo', description: 'Echo', parameters: { type: 'object' } }],
      readAt: 5000,
    })
    const successAttempt = (turn.items.find(item => item.kind === 'step') as { attempts: { id: string; inputSeq: number }[] }).attempts[1]
    const success = buildTurnReport({
      events,
      turn,
      attempt: successAttempt as never,
      messages: [{ role: 'user', content: [{ type: 'text', text: 'abcd' }], source: { kind: 'user' } }],
      tools: [],
      readAt: 5000,
    })
    expect(success.consumption.total).toEqual({ basis: 'usage', value: 152 })
    expect(failed.consumption.total).toEqual(success.consumption.total)
    expect(success.consumption.hitRate).toEqual({ basis: 'usage', value: 33.33 })
    expect(success.window.attemptId).toBe('attempt:1:1:2')
    expect(failed.window.attemptId).toBe('attempt:1:1:1')
    expect(failed.window.consistent).toBe(false)
    expect(failed.window.categories.find(item => item.id === 'user')?.tokens).toBeGreaterThan(0)
    expect(failed.timing.elapsed).toEqual({ basis: 'usage', value: 3200 })
    expect(failed.timing.firstResponses[0]?.duration).toEqual({ basis: 'usage', value: 800 })
    expect(failed.timing.calls).toHaveLength(2)
    expect(success.events.some(event => event.kind === 'switch' && event.label === 'reasoner')).toBe(true)
    expect(success.events.some(event => event.kind === 'model')).toBe(true)
    expect(success.subagents).toEqual([])
  })

  it('bills an in-turn compaction, leaves a title unreported, and skips unknown events', () => {
    const events = [
      ev(0, 'turn/start', { turn: 1 }, 1000),
      ev(1, 'user/message', {
        role: 'user',
        content: [{ type: 'text', text: 'from AGENTS' }],
        source: { kind: 'file', path: 'AGENTS.md' },
      }, 1100),
      ev(2, 'compaction/start', { compactionId: 'c1', turn: 1 }, 1200),
      ev(3, 'compaction/summary', {
        compactionId: 'c1',
        shadowedSeqs: [1],
        usage: { inputTokens: 9, outputTokens: 1, totalTokens: 10 },
      }, 1500),
      ev(4, 'session/title-llm-request', { system: 'name', messages: [] }, 1600),
      ev(5, 'plugin/unknown', { body: 'secret prose' }, 1700),
      ev(6, 'step/start', { turn: 1, step: 1 }, 1800),
      ev(7, 'assistant/message', {
        turn: 1, step: 1, stream: [],
        usage: { inputTokens: 2, outputTokens: 2, totalTokens: 4, cacheReadTokens: 2 },
        message: { role: 'assistant', content: [{ type: 'text', text: 'done' }] },
      }, 2000),
      ev(8, 'turn/end', { turn: 1, reason: { kind: 'completed' } }, 2100),
    ]
    const folded = foldAll(events)
    const turn = folded.root.find(item => item.kind === 'turn')
    if (turn === undefined || turn.kind !== 'turn') throw new Error('missing turn')
    const report = buildTurnReport({
      events,
      turn,
      attempt: turn.items.find(item => item.kind === 'step')?.kind === 'step'
        ? (turn.items[turn.items.length - 1] as { attempts: never[] }).attempts[0]
        : undefined,
      messages: [],
      tools: [],
      readAt: 3000,
    })
    expect(report.consumption.total).toEqual({ basis: 'usage', value: 14 })
    expect(report.consumption.hitRate).toEqual({ basis: 'usage', value: 50 })
    expect(report.consumption.compaction).toEqual({ basis: 'usage', value: 10 })
    expect(report.consumption.title).toEqual({ basis: 'absent' })
    expect(report.events.map(event => event.kind)).toEqual(['injection', 'compaction', 'title', 'model'])
    expect(report.events.find(event => event.kind === 'injection')).toMatchObject({ label: 'AGENTS.md' })
    expect(report.events.find(event => event.kind === 'compaction')?.tokens?.basis).toBe('estimated')
    expect(JSON.stringify(report.events)).not.toContain('secret prose')
    expect(JSON.stringify(report.events)).not.toContain('from AGENTS')
  })

  it('does not add a child session’s usage to the parent', () => {
    const events = [
      ev(0, 'turn/start', { turn: 1 }, 1000),
      ev(1, 'step/start', { turn: 1, step: 1 }, 1100),
      ev(2, 'assistant/message', {
        turn: 1, step: 1, stream: [],
        usage: { inputTokens: 4, outputTokens: 1, totalTokens: 5 },
        message: { role: 'assistant', content: [] },
      }, 1500),
      ev(3, 'tool/call', { turn: 1, step: 1, callId: 'c1', name: 'spawn', arguments: '{}' }, 1600),
      ev(4, 'tool/result', {
        turn: 1, step: 1,
        message: {
          role: 'tool',
          toolCallId: 'c1',
          content: [{ type: 'text', text: JSON.stringify({ subagentId: 'child-1' }) }],
          source: { kind: 'tool', callId: 'c1' },
        },
      }, 1700),
      ev(5, 'turn/end', { turn: 1, reason: { kind: 'completed' } }, 1800),
    ]
    const turn = turnOf(events)
    const report = buildTurnReport({
      events, turn,
      attempt: (turn.items.find(item => item.kind === 'step') as { attempts: never[] }).attempts[0],
      messages: [],
      tools: [],
      readAt: 1800,
    })
    expect(report.consumption.total).toEqual({ basis: 'usage', value: 5 })
    expect(report.subagents).toEqual([expect.objectContaining({ sessionId: 'child-1' })])
  })

  it('says when the session or the turn cannot be read', async () => {
    class EndedLogs extends Service {
      constructor(ctx: Context) {
        super(ctx, 'sessionPersistence')
      }

      async open(id: string): Promise<{ read: () => Promise<{ events: readonly SessionEvent[] }>; close: () => Promise<void> }> {
        if (id !== 'ended') throw new Error('missing session')
        return { read: async () => ({ events: [] }), close: async () => undefined }
      }
    }
    const ctx = new Context()
    await ctx.plugin(SessionStore)
    await ctx.plugin(SessionProjectionRegistry)
    await ctx.plugin(EndedLogs)
    const remote = apply(ctx)
    expect(await remote.getTurn('missing', 'turn:1', '')).toEqual({ missing: true, target: 'session' })
    const session = ctx.sessions.prepare(SessionId('live'))
    const detach = ctx.sessions.enter(session)
    ctx.sessions.announce(session)
    session.append('turn/start', { turn: 1 })
    expect(await remote.getTurn(session.id, 'turn:9', '')).toEqual({ missing: true, target: 'turn' })
    const report = await remote.getTurn(session.id, 'turn:1', '')
    expect(report).toMatchObject({ kind: 'turn-report', outputPending: true })
    const again = await remote.getTurn(session.id, 'turn:1', '')
    expect(again).toBe(report)
    detach()
  })
})
