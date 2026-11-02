import { describe, expect, it } from 'vitest'
import { Context, Service } from '@deepseek-ai/cordis'
import SessionStore, { Session, SessionId, type SessionEvent } from '@deepseek-ai/dsh-session'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
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
})
