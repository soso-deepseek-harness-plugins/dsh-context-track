// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { JsonView } from '../src/client/JsonView.tsx'
import { TracePage, type TracePageProps } from '../src/client/TracePage.tsx'
import { highlightJson } from '../src/client/highlight.ts'
import { layoutForWidth } from '../src/client/layout.ts'
import { zh, type TrackKey } from '../src/client/locales.ts'
import type { NodeDetail } from '../src/shared/detail.ts'
import { TRACK_STATE_VERSION, type TrackState } from '../src/shared/model.ts'
import type { TurnReport } from '../src/shared/report.ts'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

interface ListState {
  ids: string[]
  byId: Record<string, { id: string; retainedBy?: { mainView?: number } }>
  projectionsBySession: Record<string, { values: { track?: TrackState } }>
}

function mount(list: ListState, getNode: TracePageProps['getNode'], getTurn?: TracePageProps['getTurn']): { host: HTMLDivElement; root: Root } {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  const props = {
    sessionId: list.ids[0],
    useSessions: (selector: (state: ListState) => unknown) => selector(list),
    t: (key: TrackKey) => zh[key],
    getNode,
    getTurn,
  } as unknown as TracePageProps
  act(() => { root.render(<TracePage {...props} />) })
  return { host, root }
}

function buttons(host: ParentNode, label: string): HTMLButtonElement[] {
  return [...host.querySelectorAll('button')].filter(button => button.textContent?.includes(label))
}

async function click(button: HTMLButtonElement | undefined): Promise<void> {
  await act(async () => {
    button?.click()
    await Promise.resolve()
  })
}

function state(root: TrackState['root']): TrackState {
  return { stateVersion: TRACK_STATE_VERSION, root }
}

function step(attempts: { id: string; status: 'ok' | 'error'; usage?: { inputTokens: number; outputTokens: number; totalTokens: number } }[]) {
  return {
    kind: 'step' as const,
    id: 'step:1:1',
    turn: 1,
    step: 1,
    status: 'ok' as const,
    startSeq: 1,
    endSeq: 4,
    startTime: 1000,
    endTime: 2000,
    inputSeq: 4,
    attempts: attempts.map((attempt, index) => ({
      attempt: index + 1,
      inputSeq: 4,
      outputSeq: 4,
      ...attempt,
    })),
    tools: [],
  }
}

const oneTurn = state([{
  kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 4, startTime: 1000, endTime: 2000,
  items: [step([{ id: 'attempt:1:1:1', status: 'ok', usage: { inputTokens: 1, outputTokens: 100, totalTokens: 103 } }])],
}])

function bill(): TurnReport {
  return {
    kind: 'turn-report',
    id: 'turn:1',
    turn: 1,
    status: 'ok',
    startSeq: 0,
    endSeq: 4,
    startTime: 1000,
    endTime: 4200,
    readAt: 4200,
    outputPending: false,
    consumption: {
      input: { basis: 'usage', value: 3 },
      output: { basis: 'usage', value: 100 },
      total: { basis: 'usage', value: 103 },
      reasoning: { basis: 'usage', value: 40 },
      cacheRead: { basis: 'usage', value: 2 },
      cacheWrite: { basis: 'absent' },
      hitRate: { basis: 'usage', value: 66.66 },
      compaction: { basis: 'usage', value: 12000 },
    },
    window: {
      attemptId: 'attempt:1:1:2',
      inputSeq: 7,
      categories: [
        { id: 'user', tokens: 9 },
        { id: 'tool-results', tokens: 12 },
      ],
      toolDefinitions: [{ name: 'echo', tokens: 8 }, { name: 'hidden', tokens: 2 }],
      definitionOverhead: 2,
      toolResults: [{ name: 'echo', tokens: 12, calls: 3 }],
      estimated: { basis: 'estimated', value: 21 },
      exactInput: { basis: 'usage', value: 100 },
      delta: { basis: 'usage', value: 79 },
      consistent: false,
      hitRate: { basis: 'usage', value: 10 },
    },
    timing: {
      elapsed: { basis: 'usage', value: 3200 },
      elapsedRunning: false,
      wait: { basis: 'usage', value: 900 },
      think: { basis: 'usage', value: 400 },
      calls: [
        { attemptId: 'attempt:1:1:1', label: '1', wait: { basis: 'usage', value: 100 }, think: { basis: 'usage', value: 0 }, thinkNote: 'none' },
        { attemptId: 'a2', label: '2', wait: { basis: 'usage', value: 800 }, think: { basis: 'usage', value: 400 } },
      ],
      firstResponses: [
        { opening: true, noUserMessage: false, seq: 0, start: 1000, end: 1800, duration: { basis: 'usage', value: 800 }, pending: false },
        { opening: false, noUserMessage: false, seq: 8, start: 5000, end: 5600, duration: { basis: 'usage', value: 600 }, pending: false },
      ],
      tools: [],
      toolUnion: 150,
      toolSum: 200,
    },
    events: [
      { seq: 2, time: 1200, kind: 'compaction', label: 'drop', tokens: { basis: 'estimated', value: 30 }, nodeId: 'sidecar:2', inWindow: true },
      { seq: 6, time: 2000, kind: 'model', label: 'chat', inWindow: true },
      { seq: 7, time: 3000, kind: 'model', label: 'reasoner', inWindow: true },
    ],
    subagents: [{ sessionId: 'child-1', label: 'Helper' }],
  }
}

describe('trace console', () => {
  const roots: Root[] = []
  afterEach(() => {
    for (const root of roots) act(() => { root.unmount() })
    roots.length = 0
    document.body.innerHTML = ''
  })

  it('does not request a turn when there is no session or no turn', async () => {
    const getNode = vi.fn()
    const getTurn = vi.fn()
    const empty = mount({ ids: [], byId: {}, projectionsBySession: {} }, getNode, getTurn)
    roots.push(empty.root)
    await act(async () => { await Promise.resolve() })
    expect(empty.host.textContent).toContain(zh.empty)
    expect(getNode).not.toHaveBeenCalled()
    expect(getTurn).not.toHaveBeenCalled()

    const bare = mount({
      ids: ['sess'],
      byId: { sess: { id: 'sess' } },
      projectionsBySession: { sess: { values: { track: state([{
        kind: 'sidecar', id: 'sidecar:4', purpose: 'compaction', status: 'ok', requestSeq: 4,
      }]) } } },
    }, getNode, getTurn)
    roots.push(bare.root)
    await act(async () => { await Promise.resolve() })
    expect(bare.host.textContent).toContain(zh.noCalls)
    expect(bare.host.textContent).not.toContain('轮次')
    expect(getTurn).not.toHaveBeenCalled()
  })

  it('switches on the panel width and lets a narrow detail return to the tree', async () => {
    expect(layoutForWidth(480)).toBe('narrow')
    expect(layoutForWidth(900)).toBe('wide')
    const observers: { ping: () => void }[] = []
    vi.stubGlobal('ResizeObserver', class {
      constructor(private readonly callback: () => void) { observers.push({ ping: () => { this.callback() } }) }
      observe() { this.callback() }
      disconnect() {}
    })
    const original = HTMLElement.prototype.getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = function () {
      const width = Number.parseFloat((this as HTMLElement).style.width || '')
      if (Number.isFinite(width) && width > 0) {
        return { x: 0, y: 0, width, height: 800, top: 0, left: 0, right: width, bottom: 800, toJSON() { return {} } } as DOMRect
      }
      return original.call(this)
    }
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    try {
      const panel = view.host.querySelector('.dsh-context-track') as HTMLElement
      panel.style.width = '480px'
      await act(async () => { observers.at(-1)?.ping() })
      expect(panel.dataset.layout).toBe('narrow')
      await click(buttons(view.host, zh.expand)[0])
      await click(buttons(view.host, 'step 1')[0])
      expect(panel.dataset.layout).toBe('narrow')
      expect(view.host.querySelector('[data-bill]')).not.toBeNull()
      expect(getComputedStyle(view.host.querySelector('.dsh-context-track-tree') as HTMLElement).display).not.toBe('none')
      expect(view.host.querySelector('.dsh-context-track-detail')).toBeTruthy()
      expect(buttons(view.host, zh.back)).toHaveLength(0)

      panel.style.width = '960px'
      await act(async () => { observers.at(-1)?.ping() })
      expect(panel.dataset.layout).toBe('wide')
      const bill = view.host.querySelector('[data-bill]') as HTMLElement
      const tree = view.host.querySelector('.dsh-context-track-tree') as HTMLElement
      const detail = view.host.querySelector('.dsh-context-track-detail') as HTMLElement
      bill.scrollTop = 11
      tree.scrollTop = 22
      detail.scrollTop = 33
      expect(bill.scrollTop).toBe(11)
      expect(tree.scrollTop).toBe(22)
      expect(detail.scrollTop).toBe(33)
      expect(view.host.querySelector('[data-watching]')?.textContent).toContain('llm_call 1')
    } finally {
      HTMLElement.prototype.getBoundingClientRect = original
      vi.unstubAllGlobals()
    }
  })

  it('badges exact and estimated figures, shows 66.66%, and does not add first responses', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const total = view.host.querySelector('[data-consumption="total"]')
    expect(total?.textContent).toContain('103')
    expect(total?.textContent).toContain(zh.exact)
    expect(total?.textContent).not.toContain('143')
    expect(view.host.textContent).toContain(zh.estimated)
    expect(view.host.textContent).toContain('66.66%')
    const mark = view.host.querySelector('[data-response-end]') as HTMLElement | null
    expect(mark?.style.left).toBe('80%')
    expect(view.host.querySelector('[data-first="title"]')?.textContent).toContain('800')
    expect(view.host.querySelector('[data-first="title"]')?.textContent).not.toContain('1400')
    expect(view.host.querySelector('[data-first="later"]')?.textContent).toContain('600')
    expect(view.host.querySelector('[data-call]')).toBeNull()
    await click(buttons(view.host, zh.expand)[0])
    const stepRow = buttons(view.host, 'step 1')[0]?.closest('.dsh-context-track-row')
    expect(stepRow?.getAttribute('title')).toContain(zh.noThink)
    const child = view.host.querySelector('[data-subagent="child-1"]')
    expect(child?.textContent).toContain(zh.subagentLine)
    expect(total?.textContent).not.toContain('999')
  })

  it('copies an abbreviated number, highlights JSON, and falls back when JSON is illegal', async () => {
    const writeText = vi.fn(async () => undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const abbreviated = view.host.querySelector('[data-full="12000"]') as HTMLButtonElement
    expect(abbreviated.title).toBe('12000')
    await click(abbreviated)
    expect(writeText).toHaveBeenCalledWith('12000')

    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    await click(view.host.querySelector('[data-view-toggle="json"]') as HTMLButtonElement)
    await click(buttons(view.host, zh.jsonSource)[0])
    expect(view.host.querySelector('.dsh-context-track-json-key')).not.toBeNull()
    expect(view.host.querySelector('.dsh-context-track-json-string')).not.toBeNull()
    expect(view.host.querySelector('.dsh-context-track-json-number')).not.toBeNull()
    expect(view.host.querySelector('.dsh-context-track-json-boolean')).not.toBeNull()
    expect(view.host.querySelector('.dsh-context-track-json-null')).not.toBeNull()
    const broken = highlightJson('{')
    expect(broken.ok).toBe(false)
    if (!broken.ok) expect(broken.text).toBe('{')
    const scratch = document.createElement('div')
    document.body.appendChild(scratch)
    const scratchRoot = createRoot(scratch)
    roots.push(scratchRoot)
    act(() => { scratchRoot.render(<JsonView value="{" t={(key: TrackKey) => zh[key]} />) })
    expect(scratch.querySelector('[data-json="plain"]')?.textContent).toBe('{')
    expect(scratch.querySelector('.dsh-context-track-json-key')).toBeNull()
  })

  it('filters events without changing counts and highlights the shared compaction sequence', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const compaction = view.host.querySelector('[data-kind="compaction"]')
    const model = view.host.querySelector('[data-kind="model"]')
    expect(compaction?.getAttribute('data-count')).toBe('1')
    expect(model?.getAttribute('data-count')).toBe('2')
    expect(view.host.querySelectorAll('[data-event-seq]')).toHaveLength(0)
    await click(compaction as HTMLButtonElement)
    expect(view.host.querySelectorAll('[data-event-seq]')).toHaveLength(1)
    expect(compaction?.getAttribute('data-count')).toBe('1')
    await click(view.host.querySelector('.dsh-context-track-gap') as HTMLButtonElement)
    expect(view.host.querySelector('[data-event-seq="2"]')?.getAttribute('data-active')).toBe('true')
    expect(view.host.querySelector('.dsh-context-track-gap')?.getAttribute('data-active')).toBe('true')
    await click(view.host.querySelector('[data-kind="compaction"]') as HTMLButtonElement)
    expect(view.host.querySelectorAll('[data-event-seq]')).toHaveLength(0)
    expect(view.host.querySelector('[data-kind="compaction"]')?.getAttribute('data-count')).toBe('1')
  })

  it('keeps hover from pinning a turn and moves with the keyboard', async () => {
    const two = state([
      { kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 2, items: [] },
      { kind: 'turn', id: 'turn:2', turn: 2, status: 'ok', startSeq: 3, endSeq: 5, items: [] },
    ])
    const view = mount(session(two), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    const current = () => view.host.querySelector('.dsh-context-track-turn[aria-current="true"]')?.textContent
    expect(current()).toContain('轮次 2')
    const first = buttons(view.host, '轮次 1').find(button => button.classList.contains('dsh-context-track-turn'))
    await act(async () => { first?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true })) })
    expect(current()).toContain('轮次 2')
    expect(first?.getAttribute('data-pinned')).not.toBe('true')
    const panel = view.host.querySelector('.dsh-context-track') as HTMLElement
    await act(async () => { panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })) })
    expect(current()).toContain('轮次 1')
    await act(async () => { panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })) })
    expect(view.host.querySelector('.dsh-context-track-turn[data-pinned="true"]')?.textContent).toContain('轮次 1')
  })

  it('expands and collapses the current tree row with the arrow keys', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const panel = view.host.querySelector('.dsh-context-track') as HTMLElement
    const press = async (key: string) => {
      await act(async () => { panel.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })) })
    }
    expect(view.host.textContent).not.toContain('step 1')
    await press('ArrowRight')
    expect(view.host.textContent).toContain('step 1')
    await press('ArrowDown')
    await press('ArrowRight')
    expect(view.host.textContent).toContain('llm_call 1')
    await press('ArrowLeft')
    expect(view.host.querySelector('.dsh-context-track-tree')?.textContent).not.toContain('llm_call 1')
    expect(view.host.querySelector('.dsh-context-track-tree')?.textContent).toContain('step 1')
  })

  it('opens the latest attempt from a step and keeps the failed attempt selectable', async () => {
    const track = state([{
      kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 4, startTime: 1000, endTime: 2000,
      items: [step([
        { id: 'attempt:1:1:1', status: 'error' },
        { id: 'attempt:1:1:2', status: 'ok' },
      ])],
    }])
    const getNode = vi.fn(async (_session: string, id: string) => ({
      ok: true as const,
      value: {
        kind: 'attempt' as const,
        status: id === 'attempt:1:1:2' ? 'ok' as const : 'error' as const,
        inputSeq: 4,
        messages: [{ role: 'user', content: 'prompt' }],
        tools: [],
        toolHistory: { tools: [], updates: [] },
        config: { model: id },
        output: { text: id },
      },
    }))
    const view = mount(session(track), getNode, async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, zh.expand)[0])
    expect(view.host.textContent).toContain('llm_call 1')
    expect(view.host.textContent).toContain('llm_call 2')
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    expect(getNode).toHaveBeenCalledWith('sess', 'attempt:1:1:2')
    expect(view.host.querySelector('[data-facts]')?.textContent).toContain('attempt:1:1:2')
    await click(buttons(view.host, 'llm_call 1')[0])
    await act(async () => { await Promise.resolve() })
    expect(getNode).toHaveBeenCalledWith('sess', 'attempt:1:1:1')
    expect(view.host.querySelector('[data-facts]')?.textContent).toContain('attempt:1:1:1')
  })

  it('opens a between-turn sidecar as a mark, not a turn', async () => {
    const marked = state([
      { kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 2, items: [] },
      { kind: 'sidecar', id: 'sidecar:3', purpose: 'compaction', status: 'ok', requestSeq: 3 },
      { kind: 'turn', id: 'turn:2', turn: 2, status: 'ok', startSeq: 4, endSeq: 6, items: [] },
    ])
    const getNode = vi.fn(async () => ({ ok: true as const, value: { kind: 'turn' as const, turn: 1, status: 'ok', startSeq: 0 } }))
    const view = mount(session(marked), getNode, async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    const mark = view.host.querySelector('[data-mark="sidecar:3"]') as HTMLButtonElement
    expect(mark.textContent).not.toContain('轮次')
    await click(mark)
    expect(view.host.querySelector('[data-card="tokens"]')).toBeNull()
    expect(getNode).toHaveBeenCalledWith('sess', 'sidecar:3')
  })

  it('reads five bill figures and keeps tool rows out of the bar', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    expect(view.host.querySelectorAll('[data-stat]')).toHaveLength(5)
    expect(view.host.querySelector('[data-stat="hit"]')?.getAttribute('title')).toBe(zh.hitHint)
    const bar = view.host.querySelector('[data-bill]')
    expect(bar?.querySelectorAll('[data-stat="total"] .dsh-context-track-badge')).toHaveLength(1)
    expect(bar?.querySelector('[data-compose] .dsh-context-track-badge')).toBeNull()
    expect(bar?.querySelector('[data-compose] [data-tool]')).toBeNull()
    expect(bar?.querySelector('[data-tool="echo"]')).not.toBeNull()
    const cell = view.host.querySelector('.dsh-context-track-turn')
    expect(cell?.querySelector('[data-status="ok"]')).not.toBeNull()
    expect(cell?.textContent).not.toContain('完成')
    expect(cell?.textContent).toContain('1 s')
    expect(cell?.querySelector('[data-full="1000"]')).not.toBeNull()
    expect(cell?.textContent).toContain('103')
  })

  it('copies the full decimal when the bill total is abbreviated', async () => {
    const writeText = vi.fn(async () => undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const report = bill()
    report.consumption.total = { basis: 'usage', value: 25000 }
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: report }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const total = view.host.querySelector('[data-stat="total"] [data-full="25000"]') as HTMLButtonElement
    expect(total.textContent).toContain('25k')
    await click(total)
    expect(writeText).toHaveBeenCalledWith('25000')
  })

  it('selects a running turn ahead of a later finished turn', async () => {
    const mixed = state([
      { kind: 'turn', id: 'turn:1', turn: 1, status: 'running', startSeq: 0, items: [] },
      { kind: 'turn', id: 'turn:2', turn: 2, status: 'ok', startSeq: 3, endSeq: 5, items: [] },
    ])
    const view = mount(session(mixed), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    expect(view.host.querySelector('.dsh-context-track-turn[aria-current="true"]')?.textContent).toContain('轮次 1')
  })

  it('shows the five largest tool definitions and leaves the rest as a count', async () => {
    const report = bill()
    report.window.toolDefinitions = Array.from({ length: 8 }, (_, index) => ({
      name: `tool-${index}`,
      tokens: (8 - index) * 10,
    }))
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: report }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const inspector = view.host.querySelector('[data-inspector="turn"]')
    expect(inspector?.querySelectorAll('[data-tool]')).toHaveLength(5)
    expect(inspector?.querySelector('[data-tool="tool-0"]')).not.toBeNull()
    expect(inspector?.querySelector('[data-tool="tool-4"]')).not.toBeNull()
    expect(inspector?.textContent).not.toContain('tool-7')
    expect(inspector?.querySelector('[data-remaining]')?.getAttribute('data-remaining')).toBe('3')
    expect(inspector?.querySelector('[data-call]')).toBeNull()
  })

  it('keeps input above output and jumps from a tool chip to that tool', async () => {
    const track = state([{
      kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 6, startTime: 1000, endTime: 2000,
      items: [{
        kind: 'step', id: 'step:1:1', turn: 1, step: 1, status: 'ok', startSeq: 1, endSeq: 6,
        startTime: 1000, endTime: 2000, inputSeq: 4,
        attempts: [{ id: 'attempt:1:1:1', attempt: 1, inputSeq: 4, outputSeq: 5, status: 'ok' }],
        tools: [
          { kind: 'tool', id: 'tool:2', callId: 'c1', name: 'echo', status: 'ok', callSeq: 2, childSessionId: 'child-1', childMode: 'one-shot', childLabel: 'Helper' },
          { kind: 'tool', id: 'tool:9', callId: 'ext', name: 'remote', status: 'ok', callSeq: 9, childSessionId: 'out', childMode: 'external' },
        ],
      }],
    }])
    const list = session(track)
    list.projectionsBySession['child-1'] = { values: { track: state([{
      kind: 'turn', id: 'turn:7', turn: 7, status: 'ok', startSeq: 0, endSeq: 1, items: [],
    }]) } }
    const getNode = vi.fn(async (_session: string, id: string) => {
      if (id === 'tool:2') {
        return { ok: true as const, value: {
          kind: 'tool' as const, name: 'echo', callId: 'c1', status: 'ok', arguments: '{"q":"hi"}', result: '',
          childSessionId: 'child-1', childMode: 'one-shot', childLabel: 'Helper',
        } }
      }
      if (id === 'tool:9') {
        return { ok: true as const, value: {
          kind: 'tool' as const, name: 'remote', callId: 'ext', status: 'ok', arguments: '{', result: '{',
          childSessionId: 'out', childMode: 'external',
        } }
      }
      return { ok: true as const, value: {
        kind: 'attempt' as const, status: 'ok', inputSeq: 4,
        messages: [
          { role: 'user', content: [{ type: 'text', text: 'hello-in' }] },
          { role: 'tool', toolCallId: 'c1', content: 'echoed hi\nsecond line' },
        ],
        tools: [], toolHistory: { tools: [], updates: [] }, config: { model: 'chat', temperature: 0 },
        output: { content: [
          { type: 'text', text: 'hello-out' },
          { type: 'tool-call', id: 'c1', name: 'echo', arguments: '{"q":"hi"}' },
          { type: 'tool-call', id: 'missing', name: 'nope', arguments: '{"z":1}' },
        ] },
      } }
    })
    const view = mount(list, getNode, async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    const detail = view.host.querySelector('.dsh-context-track-detail') as HTMLElement
    const input = detail.querySelector('[data-input]')
    const output = detail.querySelector('[data-output]')
    expect(input).not.toBeNull()
    expect(output).not.toBeNull()
    expect(input!.compareDocumentPosition(output!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(detail.textContent).toContain('hello-in')
    expect(detail.textContent).toContain('hello-out')
    expect(buttons(view.host, '概览')).toHaveLength(0)
    expect(view.host.querySelector('[data-tool-chip="c1"] [data-result-line]')?.textContent).toBe('echoed hi')
    expect(view.host.querySelector('[data-tool-chip="missing"] [data-result-line]')).toBeNull()

    await click(view.host.querySelector('[data-tool-chip="missing"]') as HTMLButtonElement)
    expect(view.host.querySelector('[data-facts]')).not.toBeNull()
    expect(view.host.querySelector('[data-tool-chip="missing"] [data-arg-summary]')?.textContent).toContain('{"z":1}')

    await click(view.host.querySelector('[data-tool-chip="c1"]') as HTMLButtonElement)
    await act(async () => { await Promise.resolve() })
    const args = view.host.querySelector('[data-pane="arguments"]')
    const result = view.host.querySelector('[data-pane="result"]')
    expect(args?.textContent).toContain('{"q":"hi"}')
    expect(result?.textContent).not.toContain('{"q":"hi"}')
    expect(args!.compareDocumentPosition(result!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(view.host.querySelector('[data-open-child]')).not.toBeNull()
    await click(view.host.querySelector('[data-open-child]') as HTMLButtonElement)
    expect(view.host.textContent).toContain('turn 7')

    await click(buttons(view.host, 'remote')[0])
    await act(async () => { await Promise.resolve() })
    expect(view.host.querySelector('[data-open-child]')).toBeNull()
    await click(view.host.querySelector('[data-slice="result"]') as HTMLButtonElement)
    const plain = view.host.querySelector('[data-json="plain"]')
    expect(plain?.textContent).toBe('{')
    expect(plain?.className).toContain('dsh-context-track-pre')
    const writeText = vi.fn(async () => undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    await click(view.host.querySelector('[data-copy-json]') as HTMLButtonElement)
    expect(writeText).toHaveBeenCalledWith('{')
  })

  it('folds a long system prompt and fades thinking', async () => {
    const system = Array.from({ length: 10 }, (_, index) => `sys-${index}`).join('\n')
    const thinking = Array.from({ length: 10 }, (_, index) => `think-${index}`).join('\n')
    const detail: NodeDetail = {
      kind: 'attempt',
      status: 'ok',
      inputSeq: 3,
      messages: [
        { role: 'system', content: [{ type: 'text', text: system }] },
        { role: 'user', content: [{ type: 'text', text: 'hello' }] },
      ],
      tools: [],
      toolHistory: { tools: [], updates: [] },
      config: { model: 'chat' },
      output: { content: [{ type: 'text', text: 'seen-output' }, { type: 'reasoning', text: thinking }] },
    }
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: detail })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    const prompt = view.host.querySelector('[data-category="system"]')
    expect(prompt?.getAttribute('data-folded')).toBe('true')
    expect(prompt?.textContent).toContain('sys-0')
    expect(prompt?.textContent).not.toContain('sys-9')
    await click(prompt?.querySelector('[data-more]') as HTMLButtonElement)
    expect(prompt?.textContent).toContain('sys-9')
    const reasoning = view.host.querySelector('.dsh-context-track-reasoning')
    expect(reasoning?.getAttribute('data-folded')).toBe('true')
    expect(reasoning?.textContent).toContain('think-0')
    expect(reasoning?.textContent).not.toContain('think-9')
  })

  it('folds a JSON key and restores the structured scroll position', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    const detail = view.host.querySelector('.dsh-context-track-detail') as HTMLElement
    detail.scrollTop = 28
    await click(view.host.querySelector('[data-view-toggle="json"]') as HTMLButtonElement)
    const messages = view.host.querySelector('[data-json-key="messages"]') as HTMLButtonElement
    expect(Number(messages.getAttribute('data-count'))).toBeGreaterThan(0)
    expect(messages.getAttribute('aria-expanded')).toBe('true')
    const openKeys = view.host.querySelectorAll('[data-json-key]').length
    await click(messages)
    expect(messages.getAttribute('aria-expanded')).toBe('false')
    expect(view.host.querySelectorAll('[data-json-key]').length).toBeLessThan(openKeys)
    await click(view.host.querySelector('[data-view-toggle="structured"]') as HTMLButtonElement)
    expect(detail.scrollTop).toBe(28)
    expect(view.host.querySelector('[data-facts]')).not.toBeNull()
  })

  it('draws category rows by size, keeps a dash off the total, and splits compaction', async () => {
    const report = bill()
    report.consumption.reasoning = { basis: 'absent' }
    report.consumption.title = { basis: 'absent' }
    report.window.categories = [
      { id: 'user', tokens: 9 },
      { id: 'tools', tokens: 40 },
      { id: 'skill', tokens: 3 },
    ]
    const track = state([{
      kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 4, startTime: 1000, endTime: 2000,
      items: [
        step([{ id: 'attempt:1:1:1', status: 'ok' }]),
        { kind: 'sidecar', id: 'side:title', purpose: 'session-title', status: 'ok', requestSeq: 1 },
        { kind: 'sidecar', id: 'side:compact', purpose: 'compaction', status: 'ok', requestSeq: 2 },
      ],
    }])
    const getNode = vi.fn(async (_session: string, id: string) => {
      if (id === 'side:title') {
        return { ok: true as const, value: { kind: 'sidecar' as const, purpose: 'session-title' as const, status: 'ok', system: '', messages: [], route: '', maxTokens: 16, output: '天气会话' } }
      }
      return { ok: true as const, value: attemptDetail() }
    })
    const view = mount(session(track), getNode, async () => ({ ok: true as const, value: report }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const rows = [...view.host.querySelectorAll('[data-compose] [data-category]')]
    expect(rows.map(row => row.getAttribute('data-category'))).toEqual(['tools', 'user', 'skill'])
    expect(rows[0]?.getAttribute('data-hue')).toBe('tools')
    expect(rows[1]?.getAttribute('data-hue')).toBe('neutral')
    expect(rows[1]?.textContent).toContain(zh.catUser)
    expect(rows[1]?.textContent).toContain('9')
    expect(view.host.querySelector('[data-stat="total"]')?.textContent).toContain('103')
    expect(view.host.querySelector('[data-stat="total"]')?.textContent).toContain(zh.exact)
    expect(view.host.querySelector('[data-compose] .dsh-context-track-badge')).toBeNull()
    expect(view.host.querySelector('[data-stat="reasoning"]')?.textContent).toContain('-')
    expect(view.host.textContent).toContain('400 ms')
    const naming = view.host.querySelector('[data-session-name]')
    expect(naming?.textContent).toContain(zh.title)
    expect(naming?.textContent).toContain('-')
    expect(naming?.textContent).toContain(zh.titleExcluded)
    expect(naming?.textContent).toContain('天气会话')
    expect(naming?.textContent).not.toContain('103')
    const compaction = view.host.querySelector('[data-compaction]')
    expect(compaction?.textContent).toContain(zh.reclaimed)
    expect(compaction?.textContent).toContain('30')
    expect(compaction?.querySelector('[data-basis="estimated"]')?.textContent).toContain(zh.estimated)
    expect(compaction?.textContent).toContain(zh.compactionCost)
    expect(compaction?.querySelector('[data-full="12000"]')).not.toBeNull()
    expect(compaction?.querySelector('[data-basis="usage"]')?.textContent).toContain(zh.exact)
    expect(compaction?.textContent).toContain(zh.compactionIncluded)
    await click(buttons(view.host, zh.expand)[0])
    expect(view.host.textContent).toContain('turn 1')
    expect(view.host.textContent).toContain('step 1')
    expect(view.host.querySelector('.dsh-context-track-turn')?.textContent).toContain('轮次 1')
    const tree = view.host.querySelector('.dsh-context-track-tree')
    expect(tree?.textContent).toContain(`${zh.title} -`)
    const compactRow = buttons(view.host, zh.compactionCost)[0]
    expect(compactRow?.textContent).toContain(zh.reclaimed)
    expect(compactRow?.textContent).toContain('30')
    expect(compactRow?.textContent).toContain(zh.estimated)
    expect(compactRow?.textContent).toContain(zh.exact)
  })

  it('keeps zero, hides a missing compaction card, and says the output is unseen or unsettled', async () => {
    const quiet = bill()
    quiet.consumption.compaction = { basis: 'absent' }
    quiet.consumption.output = { basis: 'usage', value: 0 }
    quiet.events = quiet.events.filter(event => event.kind !== 'compaction')
    const settled = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: quiet }))
    roots.push(settled.root)
    await act(async () => { await Promise.resolve() })
    expect(settled.host.querySelector('[data-compaction]')).toBeNull()
    expect(settled.host.textContent).not.toContain(zh.compactionCost)
    expect(settled.host.querySelector('[data-stat="output"]')?.textContent).toContain('0')
    expect(settled.host.querySelector('[data-stat="output"]')?.textContent).not.toContain('-')

    const pending = bill()
    pending.outputPending = true
    pending.consumption.output = { basis: 'absent' }
    const waiting = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: pending }))
    roots.push(waiting.root)
    await act(async () => { await Promise.resolve() })
    expect(waiting.host.querySelector('[data-stat="output"]')?.textContent).toContain(zh.pending)

    const running = state([{
      kind: 'turn', id: 'turn:1', turn: 1, status: 'running', startSeq: 0, startTime: 1000,
      items: [{
        kind: 'step', id: 'step:1:1', turn: 1, step: 1, status: 'running', startSeq: 1, inputSeq: 1, attempts: [], tools: [],
      }],
    }])
    const live = mount(session(running), vi.fn(async () => ({
      ok: true as const,
      value: { kind: 'step' as const, status: 'running' as const, inputSeq: 1, messages: [], tools: [], toolHistory: { tools: [], updates: [] }, config: {} },
    })), async () => ({ ok: true as const, value: bill() }))
    roots.push(live.root)
    await click(buttons(live.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    expect(live.host.querySelector('[data-output="unseen"]')?.textContent).toContain(zh.notSeen)
    expect(live.host.querySelector('[data-output="unseen"]')?.textContent).not.toContain('-')
  })

  it('says the session name is missing when the log has not adopted one', async () => {
    const report = bill()
    report.consumption.title = { basis: 'absent' }
    const track = state([{
      kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 2,
      items: [{ kind: 'sidecar', id: 'side:title', purpose: 'session-title', status: 'ok', requestSeq: 1 }],
    }])
    const view = mount(session(track), vi.fn(async () => ({
      ok: true as const,
      value: { kind: 'sidecar' as const, purpose: 'session-title' as const, status: 'ok', system: '', messages: [], route: '', maxTokens: 8 },
    })), async () => ({ ok: true as const, value: report }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    expect(view.host.querySelector('[data-session-name]')?.textContent).toContain(zh.titleMissing)
    expect(view.host.querySelector('[data-session-name]')?.textContent).toContain(zh.titleExcluded)
    expect(view.host.querySelector('[data-session-name]')?.textContent).toContain('-')
  })
})

function attemptDetail(): NodeDetail {
  return {
    kind: 'attempt',
    status: 'ok',
    inputSeq: 3,
    messages: [{ role: 'user', content: [{ type: 'text', text: 'hello' }], source: { kind: 'user' } }],
    tools: [{ name: 'echo', description: 'Echo', parameters: { type: 'object' } }],
    toolHistory: { tools: [], updates: [] },
    config: { provider: 'deepseek', model: 'chat', temperature: 0, flag: true, extra: null },
    output: { content: [{ type: 'text', text: 'seen-output' }, { type: 'reasoning', text: 'because' }] },
    usage: { inputTokens: 1, outputTokens: 1 },
  }
}

function session(track: TrackState): ListState {
  return {
    ids: ['sess'],
    byId: { sess: { id: 'sess', retainedBy: { mainView: 1 } } },
    projectionsBySession: {
      sess: { values: { track } },
      'child-1': { values: { track: state([{
        kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 2,
        items: [step([{ id: 'attempt:1:1:1', status: 'ok', usage: { inputTokens: 1, outputTokens: 1, totalTokens: 999 } }])],
      }]) } },
    },
  }
}
