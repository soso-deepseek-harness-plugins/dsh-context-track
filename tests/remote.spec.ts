import { describe, expect, it } from 'vitest'
import { Context, Service } from '@deepseek-ai/cordis'
import SessionStore, { Session, SessionId, type SessionEvent } from '@deepseek-ai/dsh-session'
import { createMessage, createUserMessage } from '@deepseek-ai/dsh-llm'
import SessionProjectionRegistry from '@deepseek-ai/dsh-session-projection'
import { remoteMethods } from '@deepseek-ai/dsh-typert-protocol'
import { apply } from '../src/host/index.ts'
import { isMissing } from '../src/shared/detail.ts'

class EndedLogs extends Service {
  constructor(ctx: Context, private readonly logs: ReadonlyMap<string, readonly SessionEvent[]>) {
    super(ctx, 'sessionPersistence')
  }

  async open(id: string): Promise<{
    read: () => Promise<{ events: readonly SessionEvent[] }>
    close: () => Promise<void>
  }> {
    const events = this.logs.get(id) ?? []
    return {
      read: async () => ({ events }),
      close: async () => undefined,
    }
  }
}

describe('getNode', () => {
  it('returns a missing detail without throwing, and reloads an ended session', async () => {
    const ended = Session.create(SessionId('ended'))
    ended.append('turn/start', { turn: 1 })
    ended.append('user/message', createUserMessage({
      content: [{ type: 'text', text: 'from-disk' }],
      source: { kind: 'user' },
    }), { surfaceOp: 'append' })
    const logs = new Map<string, readonly SessionEvent[]>([['ended', ended.snapshotEvents()]])
    const ctx = new Context()
    await ctx.plugin(SessionStore)
    await ctx.plugin(SessionProjectionRegistry)
    await ctx.plugin(EndedLogs, logs)
    const remote = apply(ctx)
    await Promise.resolve()
    expect(remoteMethods(remote).map(method => method.method).sort()).toEqual(['getNode', 'getTurn'])

    const missing = await remote.getNode('absent', 'turn:1')
    expect(missing).toEqual({ missing: true })
    expect(isMissing(missing)).toBe(true)

    const loaded = await remote.getNode('ended', 'turn:1')
    expect(loaded).toMatchObject({ kind: 'turn', turn: 1, status: 'running' })

    const session = ctx.sessions.prepare(SessionId('live'))
    const detach = ctx.sessions.enter(session)
    ctx.sessions.announce(session)
    session.append('turn/start', { turn: 1 })
    session.append('step/start', { turn: 1, step: 1 })
    session.append('user/message', createUserMessage({
      content: [{ type: 'text', text: 'live-prefix' }],
      source: { kind: 'user' },
    }), { surfaceOp: 'append' })
    const running = await remote.getNode(session.id, 'step:1:1')
    const again = await remote.getNode(session.id, 'step:1:1')
    expect(again).toBe(running)
    expect(running).toMatchObject({ kind: 'step', status: 'running' })
    if (running.kind === 'step') expect(JSON.stringify(running.messages)).toContain('live-prefix')
    detach()
    const after = await remote.getNode(session.id, 'step:1:1')
    expect(after).toEqual({ missing: true })
  })

  it('shows the finished output after the panel already read the running call', async () => {
    const ctx = new Context()
    await ctx.plugin(SessionStore)
    await ctx.plugin(SessionProjectionRegistry)
    const remote = apply(ctx)
    const session = ctx.sessions.prepare(SessionId('live'))
    const detach = ctx.sessions.enter(session)
    ctx.sessions.announce(session)
    session.append('turn/start', { turn: 1 })
    session.append('step/start', { turn: 1, step: 1 })
    session.append('user/message', createUserMessage({
      content: [{ type: 'text', text: 'live-prefix' }],
      source: { kind: 'user' },
    }), { surfaceOp: 'append' })

    const running = await remote.getNode(session.id, 'step:1:1')
    await remote.getTurn(session.id, 'turn:1', '')
    expect(running).toMatchObject({ kind: 'step', status: 'running' })

    session.append('assistant/message', {
      turn: 1,
      step: 1,
      usage: { inputTokens: 8, outputTokens: 3 },
      message: createMessage({
        role: 'assistant',
        content: [{ type: 'text', text: 'finished-answer' }],
        source: { kind: 'model', provider: 'deepseek', model: 'chat' },
      }),
    }, { surfaceOp: 'append' })
    session.append('step/end', { turn: 1, step: 1 })

    const settled = await remote.getNode(session.id, 'step:1:1')
    const attempt = await remote.getNode(session.id, 'attempt:1:1:1')
    expect(settled).toMatchObject({ kind: 'attempt', status: 'ok' })
    expect(attempt).toMatchObject({ kind: 'attempt', status: 'ok' })
    expect(JSON.stringify(settled)).toContain('finished-answer')
    expect(JSON.stringify(attempt)).toContain('finished-answer')
    expect(settled).toMatchObject({ usage: { outputTokens: 3 } })
    detach()
  })

  it('shows the second round’s first step after that call was watched while running', async () => {
    const ctx = new Context()
    await ctx.plugin(SessionStore)
    await ctx.plugin(SessionProjectionRegistry)
    const remote = apply(ctx)
    const session = ctx.sessions.prepare(SessionId('live'))
    const detach = ctx.sessions.enter(session)
    ctx.sessions.announce(session)
    session.append('turn/start', { turn: 0 })
    session.append('step/start', { turn: 0, step: 1 })
    session.append('user/message', createUserMessage({
      content: [{ type: 'text', text: 'first-round' }],
      source: { kind: 'user' },
    }), { surfaceOp: 'append' })
    await remote.getNode(session.id, 'step:0:1')
    session.append('assistant/message', {
      turn: 0,
      step: 1,
      message: createMessage({
        role: 'assistant',
        content: [{ type: 'text', text: 'first-answer' }],
        source: { kind: 'model', provider: 'deepseek', model: 'chat' },
      }),
    }, { surfaceOp: 'append' })
    session.append('step/end', { turn: 0, step: 1 })
    session.append('turn/end', { turn: 0, reason: { kind: 'ok' } })

    session.append('turn/start', { turn: 1 })
    session.append('step/start', { turn: 1, step: 1 })
    session.append('user/message', createUserMessage({
      content: [{ type: 'text', text: 'second-round' }],
      source: { kind: 'user' },
    }), { surfaceOp: 'append' })
    const running = await remote.getNode(session.id, 'step:1:1')
    await remote.getTurn(session.id, 'turn:1', '')
    expect(running).toMatchObject({ kind: 'step', status: 'running' })

    session.append('assistant/message', {
      turn: 1,
      step: 1,
      usage: { inputTokens: 11, outputTokens: 5 },
      message: createMessage({
        role: 'assistant',
        content: [{ type: 'text', text: 'second-round-answer' }],
        source: { kind: 'model', provider: 'deepseek', model: 'chat' },
      }),
    }, { surfaceOp: 'append' })
    session.append('step/end', { turn: 1, step: 1 })

    const settled = await remote.getNode(session.id, 'step:1:1')
    expect(settled).toMatchObject({ kind: 'attempt', status: 'ok', usage: { outputTokens: 5 } })
    expect(JSON.stringify(settled)).toContain('second-round-answer')
    expect(JSON.stringify(settled)).toContain('second-round')
    detach()
  })

  it('marks the first message each call added over the previous call’s window', async () => {
    const ctx = new Context()
    await ctx.plugin(SessionStore)
    await ctx.plugin(SessionProjectionRegistry)
    const remote = apply(ctx)
    const session = ctx.sessions.prepare(SessionId('live'))
    const detach = ctx.sessions.enter(session)
    ctx.sessions.announce(session)
    session.append('turn/start', { turn: 1 })
    session.append('step/start', { turn: 1, step: 1 })
    session.append('user/message', createUserMessage({
      content: [{ type: 'text', text: 'first-question' }],
      source: { kind: 'user' },
    }), { surfaceOp: 'append' })
    session.append('assistant/message', {
      turn: 1,
      step: 1,
      message: createMessage({
        role: 'assistant',
        content: [{ type: 'text', text: 'first-answer' }],
        source: { kind: 'model', provider: 'deepseek', model: 'chat' },
      }),
    }, { surfaceOp: 'append' })
    session.append('step/end', { turn: 1, step: 1 })
    session.append('step/start', { turn: 1, step: 2 })

    // Step 2 first saw the question; step 1's answer is the added card.
    const second = await remote.getNode(session.id, 'step:1:2')
    expect(second).toMatchObject({ kind: 'step', status: 'running', newFrom: 1 })
    expect(JSON.stringify(second)).not.toContain('messageSeqs')

    session.append('assistant/message', {
      turn: 1,
      step: 2,
      message: createMessage({
        role: 'assistant',
        content: [{ type: 'text', text: 'second-answer' }],
        source: { kind: 'model', provider: 'deepseek', model: 'chat' },
      }),
    }, { surfaceOp: 'append' })
    session.append('step/end', { turn: 1, step: 2 })
    const settled = await remote.getNode(session.id, 'attempt:1:2:1')
    expect(settled).toMatchObject({ kind: 'attempt', status: 'ok', newFrom: 1 })

    // A retry adds the failed call's output over the previous attempt's window.
    session.append('assistant/attempt', {
      turn: 1,
      step: 2,
      failure: { message: 'upstream', code: 'UPSTREAM' },
    })
    const retried = await remote.getNode(session.id, 'step:1:2')
    expect(retried).toMatchObject({ kind: 'attempt', newFrom: 2 })
    detach()
  })

  it('marks this round’s user message on a turn’s first step', async () => {
    const ctx = new Context()
    await ctx.plugin(SessionStore)
    await ctx.plugin(SessionProjectionRegistry)
    const remote = apply(ctx)
    const session = ctx.sessions.prepare(SessionId('live'))
    const detach = ctx.sessions.enter(session)
    ctx.sessions.announce(session)
    session.append('turn/start', { turn: 1 })
    session.append('step/start', { turn: 1, step: 1 })
    session.append('user/message', createUserMessage({
      content: [{ type: 'text', text: 'first-question' }],
      source: { kind: 'user' },
    }), { surfaceOp: 'append' })
    session.append('assistant/message', {
      turn: 1,
      step: 1,
      message: createMessage({
        role: 'assistant',
        content: [{ type: 'text', text: 'first-answer' }],
        source: { kind: 'model', provider: 'deepseek', model: 'chat' },
      }),
    }, { surfaceOp: 'append' })
    session.append('step/end', { turn: 1, step: 1 })
    session.append('turn/end', { turn: 1, reason: { kind: 'ok' } })
    session.append('turn/start', { turn: 2 })
    session.append('step/start', { turn: 2, step: 1 })
    session.append('user/message', createUserMessage({
      content: [{ type: 'text', text: 'second-question' }],
      source: { kind: 'user' },
    }), { surfaceOp: 'append' })

    const second = await remote.getNode(session.id, 'step:2:1')
    expect(second).toMatchObject({ kind: 'step', status: 'running' })
    if (second.kind !== 'step') return
    const messages = Array.isArray(second.messages) ? second.messages : []
    expect(JSON.stringify(messages[second.newFrom ?? -1])).toContain('second-question')
    expect(JSON.stringify(messages[0])).not.toContain('second-question')
    detach()
  })

  it('shows a tool result after the panel already read the running call', async () => {    const ctx = new Context()
    await ctx.plugin(SessionStore)
    await ctx.plugin(SessionProjectionRegistry)
    const remote = apply(ctx)
    const session = ctx.sessions.prepare(SessionId('live'))
    const detach = ctx.sessions.enter(session)
    ctx.sessions.announce(session)
    session.append('turn/start', { turn: 1 })
    session.append('step/start', { turn: 1, step: 1 })
    session.append('tool/call', { turn: 1, step: 1, callId: 'c1', name: 'task', arguments: '{"goal":"look"}' })

    const running = await remote.getNode(session.id, 'tool:2')
    expect(running).toMatchObject({ kind: 'tool', status: 'running' })
    expect(running).not.toHaveProperty('result')

    session.append('tool/result', {
      turn: 1,
      step: 1,
      message: {
        toolCallId: 'c1',
        isError: false,
        content: [{ type: 'text', text: 'task-done' }],
      },
    }, { surfaceOp: 'append' })
    const settled = await remote.getNode(session.id, 'tool:2')
    expect(settled).toMatchObject({ kind: 'tool', status: 'ok' })
    expect(JSON.stringify(settled)).toContain('task-done')
    detach()
  })

  it('shows a session title after the panel already read the running request', async () => {
    const ctx = new Context()
    await ctx.plugin(SessionStore)
    await ctx.plugin(SessionProjectionRegistry)
    const remote = apply(ctx)
    const session = ctx.sessions.prepare(SessionId('live'))
    const detach = ctx.sessions.enter(session)
    ctx.sessions.announce(session)
    session.append('session/title-llm-request', {
      system: 'sys',
      messages: ['hello'],
      route: { provider: 'p' },
      maxTokens: 16,
    })

    const running = await remote.getNode(session.id, 'sidecar:0')
    expect(running).toMatchObject({ kind: 'sidecar', purpose: 'session-title', status: 'running' })
    expect(running).not.toHaveProperty('output')

    session.append('session/title', { title: 'Adopted', source: { kind: 'provider' } })
    const named = await remote.getNode(session.id, 'sidecar:0')
    expect(named).toMatchObject({ kind: 'sidecar', purpose: 'session-title', status: 'ok', output: 'Adopted' })
    detach()
  })
})
