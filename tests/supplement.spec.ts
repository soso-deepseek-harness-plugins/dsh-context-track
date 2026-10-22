import { describe, expect, it } from 'vitest'
import {
  Supplement,
  captureCompactionInstruction,
  listenLlmStream,
  pairInstruction,
  type CompactionLine,
} from '../src/host/supplement.ts'

function memory() {
  const files = new Map<string, string>()
  const supplement = new Supplement({
    directory: () => '/profiles/default/dsh-context-track',
    maxPending: 256,
    mkdir: async () => undefined,
    appendFile: async (path, data) => { files.set(path, (files.get(path) ?? '') + data) },
    readFile: async (path) => {
      const text = files.get(path)
      if (text === undefined) throw new Error('missing')
      return text
    },
  })
  return { files, supplement }
}

const call = {
  purpose: 'compaction' as const,
  sessionId: 'sess',
  messages: [{ content: [{ type: 'text', text: 'fold the tail' }] }],
}

describe('supplement', () => {
  it('appends one compaction instruction and ignores other purposes', async () => {
    const { files, supplement } = memory()
    const stream = listenLlmStream(call, () => 'model-stream', supplement)
    expect(stream).toBe('model-stream')
    listenLlmStream({ ...call, purpose: 'session-title' }, () => 'title-stream', supplement)
    listenLlmStream({
      purpose: 'compaction',
      sessionId: 'sess',
      messages: [{ content: [{ type: 'text', text: 'a' }, { type: 'text', text: 'b' }] }],
    }, () => 'multi', supplement)
    listenLlmStream({
      purpose: 'compaction',
      sessionId: 'sess',
      messages: [{ content: [{ type: 'text', text: 'x'.repeat(4097) }] }],
    }, () => 'big', supplement)
    await supplement.flush()
    const written = [...files.values()]
    expect(written).toHaveLength(1)
    expect(JSON.parse(written[0]?.trim() ?? '')).toEqual({ purpose: 'compaction', text: 'fold the tail' })
    expect(captureCompactionInstruction({ purpose: 'compaction', messages: [{ content: [{ type: 'text', text: 'x'.repeat(4096) }] }] })).toEqual({
      purpose: 'compaction', text: 'x'.repeat(4096),
    })
  })

  it('returns next immediately when capture throws or the disk write never settles', () => {
    const supplement = new Supplement({
      directory: () => '/profiles/default/dsh-context-track',
      mkdir: async () => undefined,
      appendFile: () => new Promise(() => undefined),
      readFile: async () => { throw new Error('missing') },
    })
    const throwing = {
      purpose: 'compaction',
      sessionId: 'sess',
      get messages(): { content: { type: string; text: string }[] }[] {
        throw new Error('unavailable')
      },
    }
    expect(listenLlmStream(throwing, () => 'still', supplement)).toBe('still')
    expect(listenLlmStream(call, () => 'now', supplement)).toBe('now')
  })

  it('drops a line when the queue is full and forgets a line whose write fails', async () => {
    const dropped = new Supplement({
      directory: () => '/profiles/default/dsh-context-track',
      maxPending: 1,
      mkdir: async () => undefined,
      appendFile: async () => undefined,
      readFile: async () => { throw new Error('missing') },
    })
    dropped.enqueue('sess', { purpose: 'compaction', text: 'first' })
    dropped.enqueue('sess', { purpose: 'compaction', text: 'second' })
    expect(dropped.dropped.count).toBe(1)
    await dropped.flush()
    expect(await dropped.lines('sess')).toEqual([{ purpose: 'compaction', text: 'first' }])

    const failed = new Supplement({
      directory: () => '/profiles/default/dsh-context-track',
      mkdir: async () => undefined,
      appendFile: async () => { throw new Error('disk') },
      readFile: async () => { throw new Error('missing') },
    })
    expect(listenLlmStream(call, () => 'kept', failed)).toBe('kept')
    await failed.flush()
    expect(failed.failed.count).toBe(1)
    expect(await failed.lines('sess')).toEqual([])
  })

  it('pairs file line n with compaction n after a restart', async () => {
    const files = new Map<string, string>()
    const io = {
      directory: () => '/profiles/default/dsh-context-track',
      mkdir: async () => undefined,
      appendFile: async (path: string, data: string) => { files.set(path, (files.get(path) ?? '') + data) },
      readFile: async (path: string) => {
        const text = files.get(path)
        if (text === undefined) throw new Error('missing')
        return text
      },
    }
    const supplement = new Supplement(io)
    const lines: CompactionLine[] = [
      { purpose: 'compaction', text: 'first' },
      { purpose: 'compaction', text: 'second' },
    ]
    for (const line of lines) supplement.enqueue('sess', line)
    await supplement.flush()
    const restarted = new Supplement(io)
    const stored = await restarted.lines('sess')
    expect(pairInstruction(stored, 0)).toEqual({ recorded: true, text: 'first' })
    expect(pairInstruction(stored, 1)).toEqual({ recorded: true, text: 'second' })
    expect(pairInstruction([], 0)).toEqual({ recorded: false })
  })
})
