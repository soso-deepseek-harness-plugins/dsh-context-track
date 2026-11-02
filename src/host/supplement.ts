/**
 * Async short records for the compaction instruction the session log does not store.
 * The listener only enqueues. Disk append happens later, without fsync, and never
 * reports failure back to the model call.
 */
import { appendFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const MAX_INSTRUCTION_BYTES = 4096

export interface CompactionLine {
  purpose: 'compaction'
  text: string
}

export interface StreamCall {
  purpose?: string
  sessionId?: string
  messages?: readonly { content?: readonly { type?: string; text?: string }[] }[]
}

export interface SupplementOptions {
  /** This plugin's directory under the profile, or undefined when the host has no profile yet. */
  directory: () => string | undefined
  maxPending?: number
  appendFile?: (path: string, data: string) => Promise<void>
  readFile?: (path: string) => Promise<string>
  mkdir?: (path: string) => Promise<void>
}

interface SessionBuffer {
  /** Accepted lines in pairing order, including ones not yet on disk. */
  accepted: CompactionLine[]
  pending: CompactionLine[]
  /** File lines already merged into `accepted`. */
  loaded: boolean
  loading?: Promise<void>
}

/** In-memory queue plus a JSONL file per session. */
export class Supplement {
  readonly dropped = { count: 0 }
  readonly failed = { count: 0 }
  private readonly sessions = new Map<string, SessionBuffer>()
  private readonly maxPending: number
  private timer: ReturnType<typeof setImmediate> | undefined
  private writing = false

  constructor(private readonly options: SupplementOptions) {
    this.maxPending = options.maxPending ?? 256
  }

  /**
   * Queue a compaction instruction. Returns immediately. A full queue drops the line and counts it.
   * @param sessionId - session whose JSONL receives the line.
   * @param line - purpose and the trailing instruction text.
   */
  enqueue(sessionId: string, line: CompactionLine): void {
    if (!safeSessionId(sessionId) || this.options.directory() === undefined) {
      this.failed.count += 1
      return
    }
    const buffer = this.buffer(sessionId)
    if (buffer.pending.length >= this.maxPending) {
      this.dropped.count += 1
      return
    }
    buffer.accepted.push(line)
    buffer.pending.push(line)
    this.schedule()
  }

  /** Lines in compaction order: the file, then anything still queued. */
  async lines(sessionId: string): Promise<readonly CompactionLine[]> {
    if (!safeSessionId(sessionId)) return []
    const buffer = this.buffer(sessionId)
    await this.ensureLoaded(sessionId, buffer)
    return buffer.accepted
  }

  /** Flush pending lines. Tests await this; the model listener does not. */
  async flush(): Promise<void> {
    if (this.timer !== undefined) {
      clearImmediate(this.timer)
      this.timer = undefined
    }
    if (this.writing) return
    this.writing = true
    try {
      for (const [sessionId, buffer] of this.sessions) {
        if (buffer.pending.length === 0) continue
        await this.ensureLoaded(sessionId, buffer)
        const batch = buffer.pending
        buffer.pending = []
        const directory = this.options.directory()
        const path = directory === undefined ? undefined : join(directory, `${sessionId}.jsonl`)
        if (path === undefined) {
          this.failBatch(buffer, batch)
          continue
        }
        try {
          if (this.options.mkdir) await this.options.mkdir(dirname(path))
          else await mkdir(dirname(path), { recursive: true })
          const payload = batch.map(line => JSON.stringify(line)).join('\n') + '\n'
          if (this.options.appendFile) await this.options.appendFile(path, payload)
          else await appendFile(path, payload)
        } catch {
          this.failBatch(buffer, batch)
        }
      }
    } finally {
      this.writing = false
      if ([...this.sessions.values()].some(buffer => buffer.pending.length > 0)) this.schedule()
    }
  }

  private failBatch(buffer: SessionBuffer, batch: CompactionLine[]): void {
    const drop = new Set(batch)
    buffer.accepted = buffer.accepted.filter(line => !drop.has(line))
    this.failed.count += batch.length
  }

  private buffer(sessionId: string): SessionBuffer {
    let buffer = this.sessions.get(sessionId)
    if (buffer === undefined) {
      buffer = { accepted: [], pending: [], loaded: false }
      this.sessions.set(sessionId, buffer)
    }
    return buffer
  }

  private schedule(): void {
    if (this.timer !== undefined || this.writing) return
    this.timer = setImmediate(() => {
      this.timer = undefined
      void this.flush()
    })
  }

  private async ensureLoaded(sessionId: string, buffer: SessionBuffer): Promise<void> {
    if (buffer.loaded) return
    buffer.loading ??= this.readExisting(sessionId).then(existing => {
      buffer.accepted = [...existing, ...buffer.accepted]
      buffer.loaded = true
    })
    await buffer.loading
  }

  private async readExisting(sessionId: string): Promise<CompactionLine[]> {
    const directory = this.options.directory()
    if (directory === undefined) return []
    try {
      const path = join(directory, `${sessionId}.jsonl`)
      const text = this.options.readFile
        ? await this.options.readFile(path)
        : await readFile(path, 'utf8')
      return parseLines(text)
    } catch {
      return []
    }
  }
}

export function parseLines(text: string): CompactionLine[] {
  const lines: CompactionLine[] = []
  for (const row of text.split('\n')) {
    if (row.trim() === '') continue
    try {
      const parsed = JSON.parse(row) as { purpose?: unknown; text?: unknown }
      if (parsed.purpose === 'compaction' && typeof parsed.text === 'string') {
        lines.push({ purpose: 'compaction', text: parsed.text })
      }
    } catch {
      // A torn or foreign line is ignored. Pairing then marks that slot unrecorded.
    }
  }
  return lines
}

/**
 * The instruction is the last message when that message is one text block of at most 4KB.
 * Earlier messages are not read. Other purposes record nothing.
 */
export function captureCompactionInstruction(call: StreamCall): CompactionLine | undefined {
  if (call.purpose !== 'compaction') return undefined
  const messages = call.messages
  if (messages === undefined || messages.length === 0) return undefined
  const last = messages[messages.length - 1]
  const content = last?.content
  if (content === undefined || content.length !== 1) return undefined
  const block = content[0]
  if (block?.type !== 'text' || typeof block.text !== 'string') return undefined
  if (Buffer.byteLength(block.text, 'utf8') > MAX_INSTRUCTION_BYTES) return undefined
  return { purpose: 'compaction', text: block.text }
}

/**
 * Listen on `llm/stream` only to enqueue. The original stream is returned unchanged.
 * @param call - the model request.
 * @param next - the waterfall continuation.
 * @param supplement - the session's short-record queue.
 * @returns whatever `next()` returns.
 */
export function listenLlmStream<T>(call: StreamCall, next: () => T, supplement: Supplement): T {
  try {
    if (call.purpose !== undefined && call.purpose !== '') {
      const line = captureCompactionInstruction(call)
      if (line !== undefined && call.sessionId !== undefined) supplement.enqueue(call.sessionId, line)
    }
  } catch {
    // A tracking failure must not change the model call.
  }
  return next()
}

export function pairInstruction(lines: readonly CompactionLine[], ordinal: number): { recorded: false } | { recorded: true; text: string } {
  const line = lines[ordinal]
  if (line === undefined) return { recorded: false }
  return { recorded: true, text: line.text }
}

function safeSessionId(sessionId: string): boolean {
  return sessionId.length > 0
    && sessionId !== '.'
    && sessionId !== '..'
    && !sessionId.includes('/')
    && !sessionId.includes('\\')
    && !sessionId.includes('\0')
}
