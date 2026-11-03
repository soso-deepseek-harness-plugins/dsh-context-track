// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { JsonView } from '../src/client/JsonView.tsx'
import { TracePage, type TracePageProps } from '../src/client/TracePage.tsx'
import { layoutForWidth } from '../src/client/layout.ts'
import { zh, type TrackKey } from '../src/client/locales.ts'
import type { NodeDetail } from '../src/shared/detail.ts'
import { TRACK_STATE_VERSION, type StepNode, type TrackState } from '../src/shared/model.ts'
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

function setInputValue(input: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  setter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

function buttons(host: ParentNode, label: string): HTMLButtonElement[] {
  return [...host.querySelectorAll('button')].filter(button =>
    button.textContent?.includes(label) === true || button.getAttribute('aria-label')?.includes(label) === true,
  )
}

function rectWidth(element: HTMLElement): number {
  if (element.classList.contains('dsh-context-track-rail')) return 192
  if (element.classList.contains('dsh-context-track-bill')) return 320
  if (element.classList.contains('dsh-context-track-tree')) return 280
  if (element.classList.contains('dsh-context-track-body')) return 900
  if (element.classList.contains('dsh-context-track-split')) return 560
  if (element.classList.contains('dsh-context-track')) return 1200
  return 400
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

function step(attempts: { id: string; status: 'ok' | 'error'; usage?: { inputTokens: number; outputTokens: number; totalTokens: number } }[]): StepNode {
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
    expect(view.host.querySelector('[data-response-end]')).toBeNull()
    expect(view.host.querySelector('[data-column="bar"]')).toBeNull()
    expect(view.host.querySelector('[data-first="title"]')?.textContent).toContain('800')
    expect(view.host.querySelector('[data-first="title"]')?.textContent).not.toContain('1400')
    expect(view.host.querySelector('[data-first="later"]')?.textContent).toContain('600')
    expect(view.host.querySelector('[data-call]')).toBeNull()
    expect(view.host.querySelector('[data-timing]')).toBeNull()
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
    expect(buttons(view.host, '原文')).toHaveLength(0)
    const kinds = new Set([...view.host.querySelectorAll('[data-json-token]')].map(node => node.getAttribute('data-json-token')))
    expect(kinds).toEqual(new Set(['key', 'string', 'number', 'boolean', 'null']))
    const scratch = document.createElement('div')
    document.body.appendChild(scratch)
    const scratchRoot = createRoot(scratch)
    roots.push(scratchRoot)
    act(() => { scratchRoot.render(<JsonView value="{" t={(key: TrackKey) => zh[key]} />) })
    expect(scratch.querySelector('[data-json="plain"]')?.textContent).toBe('{')
    expect(scratch.querySelector('[data-json-token]')).toBeNull()
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

  it('reads four bill figures and keeps tool rows out of the bar', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    expect(view.host.querySelectorAll('[data-stat]')).toHaveLength(4)
    expect(view.host.querySelector('[data-stat="reasoning"]')).toBeNull()
    expect(view.host.textContent).not.toContain(zh.reasoningBlock)
    expect(view.host.textContent).not.toContain(zh.delta)
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
    const name = cell?.querySelector('.dsh-context-track-turn-name')
    const meta = cell?.querySelector('.dsh-context-track-turn-meta')
    expect(name?.textContent).toBe('轮次 1')
    expect(meta?.textContent).toContain('1 s')
    expect(meta?.textContent).toContain('103')
    expect(name?.parentElement).not.toBe(meta)
    expect(getComputedStyle(name as HTMLElement).textOverflow).toBe('ellipsis')
    expect(getComputedStyle(cell as HTMLElement).overflow).toBe('hidden')
  })

  it('drags every column from the grip on its edge', async () => {
    const original = HTMLElement.prototype.getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = function () {
      const width = rectWidth(this as HTMLElement)
      return { x: 0, y: 0, width, height: 800, top: 0, left: 0, right: width, bottom: 800, toJSON() { return {} } } as DOMRect
    }
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    try {
      await act(async () => { await Promise.resolve() })
      const grips = [...view.host.querySelectorAll<HTMLElement>('.dsh-context-track-grip')]
      expect(grips.map(grip => grip.dataset.pane)).toEqual(['rail', 'bill', 'tree'])
      expect(grips.every(grip => grip.getAttribute('aria-orientation') === 'vertical')).toBe(true)
      const expected: Record<string, string> = { rail: '0 1 272px', bill: '0 1 400px', tree: '0 1 360px' }
      for (const grip of grips) {
        const column = grip.previousElementSibling as HTMLElement
        await act(async () => {
          grip.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 100, clientY: 100, pointerId: 1 }))
        })
        await act(async () => {
          grip.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 180, clientY: 180, pointerId: 1 }))
        })
        expect(column.style.flex).toBe(expected[grip.dataset.pane ?? ''])
        await act(async () => {
          grip.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }))
        })
        expect(grip.dataset.active).toBeUndefined()
      }
      const treeGrip = grips[2] as HTMLElement
      await act(async () => {
        treeGrip.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
      })
      expect((treeGrip.previousElementSibling as HTMLElement).style.flex).toBe('0 1 256px')
      expect(view.host.querySelector('.dsh-context-track-turn[aria-current="true"]')?.textContent).toContain('轮次 1')
    } finally {
      HTMLElement.prototype.getBoundingClientRect = original
    }
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
    const chart = inspector?.querySelector('[data-category="tools"]') as HTMLElement
    expect(chart.querySelector('[data-tool="tool-0"] .dsh-context-track-tool-meter i')?.getAttribute('style')).toContain('100%')
    const search = chart.querySelector('input') as HTMLInputElement
    await act(async () => {
      setInputValue(search, 'tool-7')
    })
    expect(chart.querySelector('[data-tool="tool-7"]')).not.toBeNull()
    expect(chart.querySelector('[data-tool="tool-0"]')).toBeNull()
    expect(chart.textContent).not.toContain(zh.noToolMatch)
    await act(async () => { setInputValue(search, 'missing-tool') })
    expect(chart.textContent).toContain(zh.noToolMatch)
    await act(async () => { setInputValue(search, '') })
    await click(buttons(chart, zh.sortName)[0])
    expect([...chart.querySelectorAll('[data-tool]')].map(node => node.getAttribute('data-tool'))).toEqual([
      'tool-0', 'tool-1', 'tool-2', 'tool-3', 'tool-4',
    ])
    expect(chart.getAttribute('data-sort')).toBe('name')
  })

  it('tucks tool definitions under the tools row and folds them', async () => {
    const report = bill()
    report.window.categories = [
      { id: 'tools', tokens: 40 },
      { id: 'user', tokens: 9 },
    ]
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: report }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const row = view.host.querySelector('[data-compose] [data-category="tools"]') as HTMLElement
    expect(row.getAttribute('data-open')).toBe('false')
    expect(row.querySelector('[data-tool]')).toBeNull()
    expect(row.querySelector('h3')).toBeNull()
    expect(view.host.querySelector('[data-compose] ~ [data-category="tools"]')).toBeNull()
    const name = row.querySelector('.dsh-context-track-cat-name') as HTMLElement
    expect(name.firstElementChild?.textContent).toContain(zh.catTools)
    const toggle = row.querySelector('button[aria-expanded]') as HTMLButtonElement
    expect(toggle.getAttribute('aria-label')).toBe(zh.catTools)
    expect(toggle.querySelector('svg')).not.toBeNull()
    expect(toggle.textContent).not.toContain('▸')
    await click(toggle)
    expect(row.getAttribute('data-open')).toBe('true')
    expect(row.querySelector('[data-tool="echo"]')).not.toBeNull()
    expect(row.querySelector('[data-nested="true"]')).not.toBeNull()
    expect(row.querySelector('h3')).toBeNull()
    expect(row.querySelector('[data-overhead]')?.textContent).toContain(zh.overhead)
    const bar = row.querySelector('.dsh-context-track-cat') as HTMLElement
    await act(async () => {
      bar.click()
      await Promise.resolve()
    })
    expect(row.getAttribute('data-open')).toBe('false')
    expect(row.querySelector('[data-tool]')).toBeNull()
  })

  it('keeps tool definitions in the bill chart and out of the detail', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    const detail = view.host.querySelector('.dsh-context-track-detail')
    const billPane = view.host.querySelector('[data-bill]')
    expect(detail?.querySelector('[data-category="tools"]')).toBeNull()
    expect(detail?.textContent).not.toContain(zh.catTools)
    expect(billPane?.querySelector('[data-category="tools"] [data-tool="echo"]')).not.toBeNull()
    expect(view.host.querySelectorAll('[data-category="tools"]')).toHaveLength(1)
  })

  it('shows the call output after the input and opens a tool from the tree', async () => {
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
          { type: 'text', text: '# hello-out' },
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
    expect(output?.querySelector('h1')?.textContent).toContain('hello-out')
    expect(output?.querySelector('[data-tool-chip]')).toBeNull()
    expect(output?.querySelector('[data-output-block]')).toBeNull()
    expect(output?.querySelectorAll('[data-output-call]')).toHaveLength(2)
    expect(output?.textContent).toContain('echo')
    expect(output?.textContent).toContain('nope')
    expect(output?.textContent).toContain('"q"')
    expect(output?.textContent).toContain('"hi"')
    expect(buttons(view.host, '概览')).toHaveLength(0)
    const stepRow = buttons(view.host, 'step 1')[0]?.closest('.dsh-context-track-row') as HTMLElement
    await click(stepRow.querySelector('button[aria-expanded]') as HTMLButtonElement)
    await click(buttons(view.host, 'echo')[0])
    await act(async () => { await Promise.resolve() })
    const args = view.host.querySelector('[data-pane="arguments"]')
    const result = view.host.querySelector('[data-pane="result"]')
    expect(args?.textContent).toContain('"q"')
    expect(args?.textContent).toContain('"hi"')
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
    const thought = view.host.querySelector('[data-reasoning]')
    expect(thought?.textContent).toContain(zh.think)
    expect(thought?.textContent).toContain('think-0')
    expect(thought?.textContent).not.toContain('think-9')
    await click(thought?.querySelector('[data-more]') as HTMLButtonElement)
    expect(thought?.textContent).toContain('think-9')
    const result = view.host.querySelector('[data-output] [data-category="history"]')
    expect(thought!.compareDocumentPosition(result!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(result?.textContent).toContain('seen-output')
    expect(result?.textContent).not.toContain('think-0')
    expect(result?.textContent).not.toContain(zh.estimated)
  })

  it('shows reasoning prose and exact output tokens when the model wrote no answer', async () => {
    const detail: NodeDetail = {
      kind: 'attempt',
      status: 'ok',
      inputSeq: 3,
      messages: [{ role: 'user', content: [{ type: 'text', text: 'hello' }] }],
      tools: [],
      toolHistory: { tools: [], updates: [] },
      config: { model: 'chat' },
      usage: { inputTokens: 20, outputTokens: 152 },
      output: {
        role: 'assistant',
        content: [
          { type: 'reasoning', text: 'look at the files first' },
          { type: 'tool-call', id: 'c1', name: 'bash', arguments: '{"cmd":"ls"}' },
        ],
      },
    }
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: detail })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    const thought = view.host.querySelector('[data-reasoning]')
    const card = view.host.querySelector('[data-output] [data-category="history"]')
    expect(thought?.textContent).toContain(zh.think)
    expect(thought?.textContent).toContain('look at the files first')
    expect(thought!.compareDocumentPosition(card!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(card?.textContent).not.toContain('look at the files first')
    expect(card?.querySelector('[data-output-call]')?.textContent).toContain('bash')
    expect(card?.textContent).toContain('"cmd"')
    expect(card?.textContent).not.toContain(zh.exact)
    expect(card?.textContent).not.toContain(zh.estimated)
    const tokens = card?.querySelector('[data-output-tokens] [data-basis="usage"]')
    expect(tokens?.textContent).toBe('token=152')
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
    const inputPart = view.host.querySelector('[data-json-part="input"]')
    const outputPart = view.host.querySelector('[data-json-part="output"]')
    expect(inputPart).not.toBeNull()
    expect(outputPart).not.toBeNull()
    expect(inputPart!.compareDocumentPosition(outputPart!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(inputPart?.textContent).toContain('"messages"')
    expect(inputPart?.textContent).toContain('"tools"')
    expect(inputPart?.textContent).not.toContain('"usage"')
    expect(outputPart?.textContent).toContain('"output"')
    expect(outputPart?.textContent).toContain('"usage"')
    expect(outputPart?.textContent).not.toContain('"messages"')
    const messages = inputPart?.querySelector('[data-json-key="messages"]') as HTMLButtonElement
    expect(Number(messages.getAttribute('data-count'))).toBeGreaterThan(0)
    expect(messages.getAttribute('aria-expanded')).toBe('true')
    const openKeys = view.host.querySelectorAll('[data-json-key]').length
    await click(messages)
    expect(messages.getAttribute('aria-expanded')).toBe('false')
    expect(view.host.querySelectorAll('[data-json-key]').length).toBeLessThan(openKeys)
    await click(view.host.querySelector('[data-view-toggle="reading"]') as HTMLButtonElement)
    expect(detail.scrollTop).toBe(28)
    expect(view.host.querySelector('[data-facts]')).not.toBeNull()
  })

  it('keeps a visited view mounted so its folds survive the round trip', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    expect(view.host.querySelector('[data-view-pane="json"]')).toBeNull()
    await click(view.host.querySelector('[data-view-toggle="json"]') as HTMLButtonElement)
    const jsonPane = view.host.querySelector('[data-view-pane="json"]') as HTMLElement
    const messages = jsonPane.querySelector('[data-json-key="messages"]') as HTMLButtonElement
    await click(messages)
    expect(messages.getAttribute('aria-expanded')).toBe('false')
    const foldedKeys = view.host.querySelectorAll('[data-json-key]').length
    await click(view.host.querySelector('[data-view-toggle="reading"]') as HTMLButtonElement)
    expect(jsonPane.hasAttribute('hidden')).toBe(true)
    expect((view.host.querySelector('[data-view-pane="reading"]') as HTMLElement).hasAttribute('hidden')).toBe(false)
    await click(view.host.querySelector('[data-view-toggle="json"]') as HTMLButtonElement)
    expect(jsonPane.hasAttribute('hidden')).toBe(false)
    expect(messages.getAttribute('aria-expanded')).toBe('false')
    expect(view.host.querySelectorAll('[data-json-key]').length).toBe(foldedKeys)
  })

  it('keeps the detail body mounted while the pane is collapsed', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    const toggle = view.host.querySelector('[data-detail-toggle]') as HTMLButtonElement
    const pane = view.host.querySelector('.dsh-context-track-detail') as HTMLElement
    const body = view.host.querySelector('.dsh-context-track-detail-body') as HTMLElement
    expect(body.hasAttribute('hidden')).toBe(false)
    await click(toggle)
    expect(pane.getAttribute('data-collapsed')).toBe('true')
    expect(body.hasAttribute('hidden')).toBe(true)
    expect(body.querySelector('[data-facts]')).not.toBeNull()
    await click(toggle)
    expect(pane.getAttribute('data-collapsed')).toBeNull()
    expect(body.hasAttribute('hidden')).toBe(true)
    await act(async () => { await new Promise(resolve => { setTimeout(resolve, 240) }) })
    expect(body.hasAttribute('hidden')).toBe(false)
    expect(body.querySelector('[data-facts]')).not.toBeNull()
  })

  it('puts tool rows after the user message, keeps a dash off the total, and splits compaction', async () => {
    const report = bill()
    report.consumption.reasoning = { basis: 'absent' }
    report.consumption.title = { basis: 'usage', value: 12 }
    report.window.categories = [
      { id: 'user', tokens: 9 },
      { id: 'tools', tokens: 40 },
      { id: 'tool-results', tokens: 50 },
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
    expect(rows.map(row => row.getAttribute('data-category'))).toEqual(['user', 'tool-results', 'tools', 'skill'])
    expect(rows[0]?.getAttribute('data-hue')).toBe('neutral')
    expect(rows[0]?.textContent).toContain(zh.catUser)
    expect(rows[0]?.textContent).toContain('9')
    expect(rows[0]?.querySelector('i')?.getAttribute('style')).toContain('18%')
    expect(rows[1]?.getAttribute('data-hue')).toBe('results')
    expect(rows[1]?.querySelector('i')?.getAttribute('style')).toContain('100%')
    expect(rows[2]?.getAttribute('data-hue')).toBe('tools')
    expect(view.host.querySelector('[data-stat="total"]')?.textContent).toContain('103')
    expect(view.host.querySelector('[data-stat="total"]')?.textContent).toContain(zh.exact)
    expect(view.host.querySelector('[data-compose] .dsh-context-track-badge')).toBeNull()
    expect(view.host.querySelector('[data-stat="reasoning"]')).toBeNull()
    expect(view.host.querySelector('[data-inspector="turn"]')?.textContent).not.toContain(zh.reasoningBlock)
    expect(view.host.querySelector('[data-inspector="turn"]')?.textContent).not.toContain(zh.delta)
    expect(view.host.querySelector('[data-inspector="turn"] [data-session-name]')).toBeNull()
    expect(view.host.querySelector('[data-inspector="turn"]')?.textContent).not.toContain(zh.titleExcluded)
    expect(view.host.querySelector('[data-inspector="turn"]')?.textContent).not.toContain('天气会话')
    expect(view.host.textContent).toContain('400 ms')
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

  it('leaves session naming out of the turn bill', async () => {
    const report = bill()
    report.consumption.title = { basis: 'absent' }
    const track = state([{
      kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 2,
      items: [{ kind: 'sidecar', id: 'side:title', purpose: 'session-title', status: 'ok', requestSeq: 1 }],
    }])
    const getNode = vi.fn(async () => ({
      ok: true as const,
      value: { kind: 'sidecar' as const, purpose: 'session-title' as const, status: 'ok', system: '', messages: [], route: '', maxTokens: 8 },
    }))
    const view = mount(session(track), getNode, async () => ({ ok: true as const, value: report }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const billPane = view.host.querySelector('[data-inspector="turn"]')
    expect(billPane?.querySelector('[data-session-name]')).toBeNull()
    expect(billPane?.textContent).not.toContain(zh.title)
    expect(billPane?.textContent).not.toContain(zh.titleExcluded)
    expect(billPane?.textContent).not.toContain(zh.titleMissing)
    expect(getNode).not.toHaveBeenCalled()
  })

  it('reads messages as markdown, clamps prose, and opens one message as JSON', async () => {
    const system = [
      '# Title',
      '',
      '- item',
      '',
      '1. step',
      '',
      '> quote',
      '',
      '**bold** *italic* `inline`',
      '',
      '```',
      'fence',
      '```',
      '',
      '[docs](https://example.com/docs)',
      '',
      '<skill_content>',
    ].join('\n')
    const user = Array.from({ length: 10 }, (_, index) => `user-${index}`).join('\n')
    const assistant = Array.from({ length: 10 }, (_, index) => `assistant-${index}`).join('\n')
    const detail: NodeDetail = {
      kind: 'attempt',
      status: 'ok',
      inputSeq: 3,
      messages: [
        { role: 'system', content: [{ type: 'text', text: system }] },
        { role: 'user', content: [{ type: 'text', text: user }] },
        { role: 'assistant', content: [{ type: 'tool-call', id: 'call-9', name: 'bash' }] },
        { role: 'tool', toolCallId: 'call-9', content: '{"ok":true}' },
      ],
      tools: [],
      toolHistory: { tools: [], updates: [] },
      config: { provider: 'deepseek', model: 'chat', temperature: 1, maxTokens: 256000 },
      adapterDefaults: { maxTokens: true },
      output: { content: [{ type: 'text', text: assistant }] },
    }
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: detail })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    const toggles = [...view.host.querySelectorAll('[data-view-toggle]')].map(node => node.textContent)
    expect(toggles).toEqual([zh.reading, zh.jsonView])
    expect(view.host.querySelector('[data-view="reading"]')).not.toBeNull()
    expect(view.host.textContent).not.toContain('原文')
    const pane = view.host.querySelector('.dsh-context-track-detail') as HTMLElement
    const prompt = pane.querySelector('[data-category="system"]')
    const more = prompt?.querySelector('[data-more]') as HTMLButtonElement
    await click(more)
    expect(prompt?.querySelector('h1')?.textContent).toContain('Title')
    expect(prompt?.querySelector('ul li')?.textContent).toContain('item')
    expect(prompt?.querySelector('ol li')?.textContent).toContain('step')
    expect(prompt?.querySelector('blockquote')?.textContent).toContain('quote')
    expect(prompt?.querySelector('strong')?.textContent).toContain('bold')
    expect(prompt?.querySelector('em')?.textContent).toContain('italic')
    expect(prompt?.querySelector('code')?.textContent).toContain('inline')
    expect(prompt?.querySelector('pre code')?.textContent).toContain('fence')
    const link = prompt?.querySelector('a')
    expect(link?.getAttribute('href')).toBe('https://example.com/docs')
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.getAttribute('rel')).toContain('noreferrer')
    expect(link?.getAttribute('rel')).toContain('noopener')
    expect(prompt?.textContent).toContain('<skill_content>')
    const tags = [...(prompt?.querySelectorAll('*') ?? [])].map(node => node.tagName.toLowerCase())
    expect(tags).not.toContain('skill_content')
    const table = prompt?.querySelector('table')
    expect(table?.textContent).toContain('system')
    expect(table?.textContent).toContain(zh.catSystem)
    expect(table?.textContent).toContain('token≈')
    expect(table?.textContent).not.toContain(zh.estimated)
    expect(table?.textContent).not.toContain(zh.exact)
    expect(table?.textContent).not.toContain('deepseek')
    expect(table?.textContent).not.toContain(zh.source)
    const facts = view.host.querySelector('[data-facts]')
    expect(facts?.querySelector('[data-fact="model"]')?.textContent).toContain('chat')
    expect(facts?.querySelector('[data-fact="provider"]')?.textContent).toContain('deepseek')
    expect(facts?.querySelector('[data-fact="temperature"]')?.textContent).toContain('1')
    expect(facts?.querySelector('[data-fact="maxTokens"]')?.textContent).toContain('256,000 token')
    expect(facts?.querySelector('[data-fact="maxTokens"]')?.textContent).toContain(zh.adapterDefault)
    expect(facts?.querySelector('[data-fact="window"]')?.textContent).toContain(zh.windowLabel)
    expect(facts?.querySelector('[data-fact="window"]')?.textContent).toContain('3')
    expect(facts?.querySelector('[data-fact="status"]')?.textContent).toContain(zh.ok)
    expect(facts?.textContent).not.toContain('结束原因')
    const userCard = pane.querySelector('[data-category="user"]')
    expect(userCard?.textContent).toContain('user-0')
    expect(userCard?.textContent).not.toContain('user-9')
    await click(userCard?.querySelector('[data-more]') as HTMLButtonElement)
    expect(userCard?.textContent).toContain('user-9')
    const assistantCard = pane.querySelector('[data-output] [data-category="history"]')
    expect(assistantCard?.textContent).toContain('assistant-0')
    expect(assistantCard?.textContent).not.toContain('assistant-9')
    await click(assistantCard?.querySelector('[data-more]') as HTMLButtonElement)
    expect(assistantCard?.textContent).toContain('assistant-9')
    const toolCard = pane.querySelector('[data-category="tool-results"]')
    expect(toolCard?.querySelector('table')?.textContent).toContain('bash')
    expect(toolCard?.querySelector('table')?.textContent).toContain('call-9')
    expect(toolCard?.querySelector('[data-json-view]')).not.toBeNull()
    expect(toolCard?.querySelector('.dsh-context-track-prose')).toBeNull()
    expect(toolCard?.querySelector('[data-json-token="boolean"]')?.textContent).toBe('true')
    pane.scrollTop = 18
    await click(userCard?.querySelector('[data-open-json]') as HTMLButtonElement)
    expect(view.host.querySelector('[data-view-toggle="json"]')?.getAttribute('aria-pressed')).toBe('true')
    expect(view.host.querySelector('[data-json-split]')).toBeNull()
    const json = view.host.querySelector('[data-json-view]')
    expect(json?.textContent).toContain('user-0')
    expect(json?.textContent).not.toContain('<skill_content>')
    await click(view.host.querySelector('[data-view-toggle="reading"]') as HTMLButtonElement)
    expect(pane.scrollTop).toBe(18)
  })

  it('renders tool JSON above the result and sidecar text as markdown', async () => {
    const modelStep = step([{ id: 'attempt:1:1:1', status: 'ok' }])
    modelStep.tools = [{
      kind: 'tool', id: 'tool:1', callId: 'c1', name: 'bash', status: 'ok', callSeq: 2,
      childSessionId: 'child-1', childMode: 'one-shot',
    }]
    const track = state([{
      kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 4, startTime: 1000, endTime: 2000,
      items: [
        modelStep,
        { kind: 'sidecar', id: 'side:compact', purpose: 'compaction', status: 'ok', requestSeq: 2 },
        { kind: 'sidecar', id: 'side:title', purpose: 'session-title', status: 'ok', requestSeq: 3 },
      ],
    }])
    const getNode = vi.fn(async (_session: string, id: string) => {
      if (id === 'tool:1') {
        return { ok: true as const, value: {
          kind: 'tool' as const, name: 'bash', callId: 'c1', status: 'ok',
          arguments: '{"cmd":"ls"}', result: 'plain result',
          childSessionId: 'child-1', childMode: 'one-shot',
        } }
      }
      if (id === 'side:compact') {
        return { ok: true as const, value: {
          kind: 'sidecar' as const, purpose: 'compaction' as const, status: 'ok',
          messages: [], tools: [], toolHistory: { tools: [], updates: [] }, config: {},
          instruction: { recorded: false as const },
          summary: '# Freed\n\n- kept',
        } }
      }
      if (id === 'side:title') {
        return { ok: true as const, value: {
          kind: 'sidecar' as const, purpose: 'session-title' as const, status: 'ok',
          system: 'Name this chat',
          messages: [{ role: 'user', content: [{ type: 'text', text: 'talked about weather' }] }],
          route: { provider: 'deepseek', model: 'flash' },
          maxTokens: 16,
          output: 'Named session',
        } }
      }
      return { ok: true as const, value: attemptDetail() }
    })
    const view = mount(session(track), getNode, async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    const tree = view.host.querySelector('.dsh-context-track-tree') as HTMLElement
    await click(buttons(tree, zh.compaction)[0])
    await act(async () => { await Promise.resolve() })
    const summary = view.host.querySelector('[data-sidecar-body]')
    expect(summary?.querySelector('h1')?.textContent).toContain('Freed')
    expect(summary?.querySelector('li')?.textContent).toContain('kept')
    await click(buttons(tree, zh.title)[0])
    await act(async () => { await Promise.resolve() })
    const title = view.host.querySelector('[data-title-body]')
    const titleInput = title?.querySelector('[data-input]')
    const titleOutput = title?.querySelector('[data-output]')
    expect(titleInput?.textContent).toContain('Name this chat')
    expect(titleInput?.textContent).toContain('talked about weather')
    expect(titleOutput?.textContent).toContain('Named session')
    expect(titleInput!.compareDocumentPosition(titleOutput!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(title?.querySelector('[data-fact="model"]')?.textContent).toContain('flash')
    expect(title?.querySelector('[data-fact="provider"]')?.textContent).toContain('deepseek')
    await click(buttons(tree, zh.expand).find(button => button.parentElement?.textContent?.includes('step')))
    await click(buttons(tree, 'bash')[0])
    await act(async () => { await Promise.resolve() })
    const args = view.host.querySelector('[data-pane="arguments"]')
    const result = view.host.querySelector('[data-pane="result"]')
    expect(args?.textContent).toContain('"cmd"')
    expect(args?.querySelector('[data-json="source"]')).not.toBeNull()
    expect(result?.textContent).toContain('plain result')
    expect(result?.querySelector('[data-json="plain"]')?.textContent).toBe('plain result')
    expect(result?.querySelector('.dsh-context-track-prose')).toBeNull()
    expect(args!.compareDocumentPosition(result!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(view.host.querySelector('[data-open-child]')).not.toBeNull()
  })

  it('keeps the session-title input when the name is still missing', async () => {
    const track = state([{
      kind: 'turn', id: 'turn:1', turn: 1, status: 'running', startSeq: 0, startTime: 1000,
      items: [{ kind: 'sidecar', id: 'side:title', purpose: 'session-title', status: 'running', requestSeq: 1 }],
    }])
    const view = mount(session(track), vi.fn(async () => ({
      ok: true as const,
      value: {
        kind: 'sidecar' as const, purpose: 'session-title' as const, status: 'running',
        system: 'Name this chat',
        messages: [{ role: 'user', content: 'hello there' }],
        route: {}, maxTokens: 8,
      },
    })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, zh.title)[0])
    await act(async () => { await Promise.resolve() })
    const title = view.host.querySelector('[data-title-body]')
    expect(title?.querySelector('[data-input]')?.textContent).toContain('hello there')
    expect(title?.querySelector('[data-input]')?.textContent).toContain('Name this chat')
    expect(title?.querySelector('[data-session-name]')?.textContent).toContain(zh.titleMissing)
    const input = title?.querySelector('[data-input]')
    const output = title?.querySelector('[data-output]')
    expect(input!.compareDocumentPosition(output!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders the search request as a query fact and highlighted JSON', async () => {
    const track = state([{
      kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 4, startTime: 1000, endTime: 2000,
      items: [
        { kind: 'sidecar', id: 'side:search', purpose: 'web-search', status: 'ok', requestSeq: 2 },
        { kind: 'sidecar', id: 'side:gone', purpose: 'web-search', status: 'ok', requestSeq: 3 },
      ],
    }])
    const getNode = vi.fn(async (_session: string, id: string) => {
      if (id === 'side:search') {
        return { ok: true as const, value: {
          kind: 'sidecar' as const, purpose: 'web-search' as const, status: 'ok',
          request: { query: 'deepseek v4 发布', hits: 3 },
        } }
      }
      return { ok: true as const, value: {
        kind: 'sidecar' as const, purpose: 'web-search' as const, status: 'ok', request: undefined,
      } }
    })
    const view = mount(session(track), getNode, async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    const tree = view.host.querySelector('.dsh-context-track-tree') as HTMLElement
    await click(buttons(tree, zh.search)[0])
    await act(async () => { await Promise.resolve() })
    const body = view.host.querySelector('[data-search-body]')
    expect(body?.textContent).toContain(zh.query)
    expect(body?.textContent).toContain('deepseek v4 发布')
    expect(body?.querySelector('[data-json-token]')).not.toBeNull()
    expect(body?.querySelector('.dsh-context-track-prose')).toBeNull()
    await click(buttons(tree, zh.search)[1])
    await act(async () => { await Promise.resolve() })
    const gone = view.host.querySelector('[data-search-body]')
    expect(gone?.textContent).toContain(zh.notSeen)
    expect(gone?.querySelector('[data-json-token]')).toBeNull()
  })

  it('nests a search under the tool that triggered it and shows that call’s arguments', async () => {
    const modelStep = step([{ id: 'attempt:1:1:1', status: 'ok' }])
    modelStep.tools = [{
      kind: 'tool', id: 'tool:3', callId: 'c1', name: 'web_search', status: 'ok', callSeq: 3,
      searches: [{
        kind: 'sidecar', id: 'side:search', purpose: 'web-search', status: 'ok', requestSeq: 4,
        origin: { kind: 'tool', toolId: 'tool:3', callId: 'c1', name: 'web_search', callSeq: 3 },
      }],
    }]
    const track = state([{
      kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 5, startTime: 1000, endTime: 2000,
      items: [modelStep],
    }])
    const view = mount(session(track), vi.fn(async () => ({
      ok: true as const,
      value: {
        kind: 'sidecar' as const, purpose: 'web-search' as const, status: 'ok',
        request: { query: 'deepseek v4' },
        source: { kind: 'tool' as const, name: 'web_search', callId: 'c1', arguments: { query: 'deepseek v4' } },
      },
    })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand)[0])
    const tree = view.host.querySelector('.dsh-context-track-tree') as HTMLElement
    const stepRow = buttons(tree, 'step 1')[0]?.closest('.dsh-context-track-row') as HTMLElement
    await click(stepRow.querySelector('button[aria-expanded]') as HTMLButtonElement)
    const toolRow = buttons(tree, 'web_search')[0]?.closest('.dsh-context-track-row') as HTMLElement
    const searchRow = buttons(tree, zh.search)[0]?.closest('.dsh-context-track-row') as HTMLElement
    const toolDepth = Number((toolRow.querySelector('.dsh-context-track-cluster') as HTMLElement).dataset.depth)
    const searchDepth = Number((searchRow.querySelector('.dsh-context-track-cluster') as HTMLElement).dataset.depth)
    expect(searchDepth).toBeGreaterThan(toolDepth)
    await click(buttons(tree, zh.search)[0])
    await act(async () => { await Promise.resolve() })
    const source = view.host.querySelector('[data-pane="source"]')
    expect(source?.textContent).toContain(zh.trigger)
    expect(source?.querySelector('[data-search-trigger]')?.textContent).toBe('web_search')
    expect(source?.textContent).toContain('deepseek v4')
    expect(source?.querySelector('[data-json-token]')).not.toBeNull()
  })

  it('aligns tree columns and names the chevron', async () => {
    const track = state([{
      kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 4, startTime: 1000, endTime: 5000,
      items: [{
        kind: 'step', id: 'step:1:1', turn: 1, step: 1, status: 'ok', startSeq: 1, endSeq: 4,
        startTime: 1200, endTime: 4000, inputSeq: 4, model: 'deepseek-flash',
        usage: { inputTokens: 11100, outputTokens: 384, totalTokens: 11484 },
        attempts: [{ id: 'attempt:1:1:1', attempt: 1, inputSeq: 4, outputSeq: 4, status: 'ok', streamStart: 1500, endTime: 3000 }],
        tools: [{ kind: 'tool', id: 'tool:1', callId: 'c1', name: 'bash', status: 'ok', callSeq: 2, startTime: 1600, endTime: 1800 }],
      }, {
        kind: 'sidecar', id: 'side:1', purpose: 'web-search', status: 'ok', requestSeq: 3,
      }],
    }])
    const view = mount(session(track), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const tree = view.host.querySelector('.dsh-context-track-tree') as HTMLElement
    const turnRow = buttons(tree, 'turn 1')[0]?.closest('.dsh-context-track-row') as HTMLElement
    const arrow = turnRow.querySelector('button[aria-expanded]') as HTMLButtonElement
    expect(arrow.getAttribute('aria-label')).toBe(zh.expand)
    expect(arrow.textContent).not.toContain(zh.expand)
    expect(turnRow.querySelector('.dsh-context-track-label')?.textContent).toContain('turn 1')
    expect(turnRow.querySelector('.dsh-context-track-label')?.textContent).not.toContain(zh.expand)
    const selected = view.host.querySelector('[aria-current="true"]')
    await click(arrow)
    expect(view.host.textContent).toContain('step 1')
    expect(view.host.querySelector('[aria-current="true"]')).toBe(selected)
    await click(buttons(view.host, 'step 1')[0])
    const stepRow = buttons(view.host, 'step 1')[0]?.closest('.dsh-context-track-row') as HTMLElement
    expect(stepRow.getAttribute('aria-current')).toBe('true')
    expect(stepRow.querySelector('.dsh-context-track-label')?.textContent).toContain('deepseek-flash')
    expect(stepRow.querySelector('[data-column="tokens"]')?.textContent).not.toContain('deepseek-flash')
    expect(stepRow.querySelector('[data-column="tokens"]')?.textContent).toContain('→')
    expect(stepRow.querySelector('[data-timing]')).toBeNull()
    expect(stepRow.querySelector('[data-column="bar"]')).toBeNull()
    await click(stepRow.querySelector('button[aria-expanded]') as HTMLButtonElement)
    const toolRow = buttons(view.host, 'bash')[0]?.closest('.dsh-context-track-row') as HTMLElement
    const sideRow = buttons(view.host.querySelector('.dsh-context-track-tree') as HTMLElement, zh.search)[0]?.closest('.dsh-context-track-row') as HTMLElement
    const attemptRow = buttons(view.host, 'llm_call 1')[0]?.closest('.dsh-context-track-row') as HTMLElement
    expect(columnIndex(turnRow, 'duration')).toBe(columnIndex(toolRow, 'duration'))
    expect(columnIndex(stepRow, 'tokens')).toBe(columnIndex(sideRow, 'tokens'))
    expect(sideRow.querySelector('[data-column="tokens"]')?.textContent?.trim()).toBe('')
    const turnCluster = turnRow.querySelector('.dsh-context-track-cluster') as HTMLElement
    const toolCluster = toolRow.querySelector('.dsh-context-track-cluster') as HTMLElement
    expect(Number(toolCluster.dataset.depth)).toBeGreaterThan(Number(turnCluster.dataset.depth))
    expect(parseFloat(toolCluster.style.paddingInlineStart)).toBeGreaterThan(parseFloat(turnCluster.style.paddingInlineStart))
    expect(toolCluster.contains(toolRow.querySelector('[data-column="duration"]'))).toBe(false)
    expect(attemptRow.querySelector('button[aria-expanded]')).toBeNull()
    expect(attemptRow.querySelector('.dsh-context-track-chevron')).not.toBeNull()
  })

  it('folds highlighted JSON by depth, string length, and explicit parse', async () => {
    const writeText = vi.fn(async () => undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const tail = 'ENDMARK'
    const prompt = `${'a'.repeat(130)}${tail}`
    const scratch = document.createElement('div')
    document.body.appendChild(scratch)
    const scratchRoot = createRoot(scratch)
    roots.push(scratchRoot)
    const render = (value: unknown) => {
      act(() => { scratchRoot.render(<JsonView value={value} t={(key: TrackKey) => zh[key]} />) })
    }
    render({
      messages: [{ source: { kind: 'secret-key' }, note: 'short' }],
      prompt,
      sentence: 'hello there',
      packed: '{"a":1}',
      line: 'one\ntwo',
    })
    const rootArrow = scratch.querySelector('[data-json-key=""]') as HTMLButtonElement
    const messages = scratch.querySelector('[data-json-key="messages"]') as HTMLButtonElement
    const source = scratch.querySelector('[data-json-key="messages.0.source"]') as HTMLButtonElement
    expect(rootArrow.getAttribute('aria-expanded')).toBe('true')
    expect(messages.getAttribute('aria-expanded')).toBe('true')
    expect(scratch.querySelector('[data-json-key="messages.0"]')?.getAttribute('aria-expanded')).toBe('true')
    expect(source.getAttribute('aria-expanded')).toBe('false')
    expect(source.parentElement?.textContent).toContain('{…}')
    expect(scratch.textContent).not.toContain('secret-key')
    const short = [...scratch.querySelectorAll('[data-json-token="string"]')].find(node => node.textContent?.includes('short'))
    expect(short?.closest('.dsh-context-track-json-line')?.querySelector('[aria-expanded]')).toBeNull()
    const key = scratch.querySelector('[data-json-token="key"]') as HTMLElement
    const keyArrow = key.closest('.dsh-context-track-json-line')?.querySelector('[aria-expanded]')
    const before = keyArrow?.getAttribute('aria-expanded')
    await act(async () => { key.click() })
    expect(keyArrow?.getAttribute('aria-expanded')).toBe(before)
    await click(source)
    expect(source.getAttribute('aria-expanded')).toBe('true')
    expect(scratch.textContent).toContain('secret-key')
    expect(messages.getAttribute('aria-expanded')).toBe('true')
    await click(messages)
    expect(messages.getAttribute('aria-expanded')).toBe('false')
    expect(messages.parentElement?.textContent).toContain('[1]')
    expect(scratch.querySelector('[data-json-key="messages.0.source"]')).toBeNull()
    const promptArrow = scratch.querySelector('[data-json-key="prompt"]') as HTMLButtonElement
    expect(promptArrow.getAttribute('aria-expanded')).toBe('false')
    expect(promptArrow.parentElement?.textContent).not.toContain(tail)
    expect(scratch.querySelector('[data-json-key="line"]')?.getAttribute('aria-expanded')).toBe('false')
    expect(buttons(scratch, zh.parseJson)).toHaveLength(1)
    await click(promptArrow)
    expect(promptArrow.parentElement?.textContent).toContain(tail)
    expect(promptArrow.parentElement?.querySelector('[data-json-token="string"]')).not.toBeNull()
    expect(messages.getAttribute('aria-expanded')).toBe('false')
    expect(scratch.querySelector('[data-json-key="line"]')?.getAttribute('aria-expanded')).toBe('false')
    await click(buttons(scratch, zh.expandAll)[0])
    expect(scratch.textContent).toContain(tail)
    await click(buttons(scratch, zh.collapseAll)[0])
    expect(rootArrow.getAttribute('aria-expanded')).toBe('false')
    expect(scratch.querySelector('[data-json-key="prompt"]')).toBeNull()
    render({ sentence: 'hello there', packed: '{"a":1}' })
    expect(scratch.querySelector('[data-json-key="packed"]')).toBeNull()
    await click(buttons(scratch, zh.parseJson)[0])
    expect(scratch.textContent).toContain('"a"')
    await click(scratch.querySelector('[data-copy-json]') as HTMLButtonElement)
    expect(writeText).toHaveBeenCalledWith(JSON.stringify({ sentence: 'hello there', packed: '{"a":1}' }, null, 2))
    render({ messages: [{ a: 1 }] })
    await click(scratch.querySelector('[data-json-key="messages"]') as HTMLButtonElement)
    render({ messages: [{ b: 2 }], fresh: true })
    expect(scratch.querySelector('[data-json-key="messages"]')?.getAttribute('aria-expanded')).toBe('true')
    expect(scratch.textContent).toContain('fresh')
  })
})

function columnIndex(row: HTMLElement, name: string): number {
  return [...row.children].indexOf(row.querySelector(`[data-column="${name}"]`) as HTMLElement)
}

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
