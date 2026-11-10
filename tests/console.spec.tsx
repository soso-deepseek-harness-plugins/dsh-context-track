// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { JsonView } from '../src/client/JsonView.tsx'
import { TracePage, type TracePageProps } from '../src/client/TracePage.tsx'
import { layoutForWidth } from '../src/client/layout.ts'
import { zh, type TrackKey } from '../src/client/locales.ts'
import { traceCss } from '../src/client/styles.ts'
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

const panel = (host: ParentNode) => host.querySelector('[data-tier]') as HTMLElement
const rowOf = (host: ParentNode, nodeId: string) => host.querySelector(`[data-row-kind][data-node-id="${nodeId}"]`) as HTMLElement | null
const labelOf = (host: ParentNode, nodeId: string) => rowOf(host, nodeId)?.querySelector('.dsh-context-track-label') as HTMLButtonElement | null
const chevronOf = (host: ParentNode, nodeId: string) => rowOf(host, nodeId)?.querySelector('button[aria-expanded]') as HTMLButtonElement | null
const chipOf = (host: ParentNode, turnId: string) => host.querySelector(`[data-turn-id="${turnId}"]`) as HTMLButtonElement | null
const bandToggle = (host: ParentNode) => host.querySelector('[data-band-toggle]') as HTMLButtonElement | null
const bandPane = (host: ParentNode) => host.querySelector('[data-pane="band"]') as HTMLElement | null
const treePane = (host: ParentNode) => host.querySelector('[data-pane="tree"]') as HTMLElement

async function click(button: HTMLButtonElement | null | undefined): Promise<void> {
  await act(async () => {
    button?.click()
    await Promise.resolve()
  })
}

/** Open a row regardless of its default expansion. */
async function openRow(host: ParentNode, nodeId: string): Promise<void> {
  const control = chevronOf(host, nodeId)
  if (control !== null && control.getAttribute('aria-expanded') === 'false') await click(control)
}

async function expandBand(host: ParentNode): Promise<void> {
  const toggle = bandToggle(host)
  if (toggle !== null && toggle.getAttribute('aria-expanded') === 'false') await click(toggle)
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

/** A step of one round whose calls are numbered in log order. */
function calls(id: string, turn: number, step: number, attempts: readonly string[]): StepNode {
  return {
    kind: 'step' as const,
    id,
    turn,
    step,
    status: 'ok' as const,
    startSeq: 1,
    endSeq: 4,
    startTime: 1000,
    endTime: 2000,
    inputSeq: 4,
    attempts: attempts.map((attemptId, index) => ({
      id: attemptId, attempt: index + 1, inputSeq: 4, outputSeq: 4, status: 'ok' as const,
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

/** Stub a measured panel and a split width. Returns the observers the caller pings. */
function measured(): { observers: { ping: () => void }[]; restore: () => void } {
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
  return {
    observers,
    restore() {
      HTMLElement.prototype.getBoundingClientRect = original
      vi.unstubAllGlobals()
    },
  }
}

async function setWidths(host: HTMLElement, observers: { ping: () => void }[], widths: Partial<Record<'panel' | 'split' | 'tree', number>>): Promise<void> {
  const shell = panel(host)
  if (widths.panel !== undefined) shell.style.width = `${widths.panel}px`
  if (widths.split !== undefined) {
    const split = host.querySelector('[data-pane="split"]') as HTMLElement | null
    if (split !== null) split.style.width = `${widths.split}px`
  }
  if (widths.tree !== undefined) treePane(host).style.width = `${widths.tree}px`
  await act(async () => { observers.at(-1)?.ping() })
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
    expect(bare.host.textContent).not.toContain('turn 1')
    expect(getTurn).not.toHaveBeenCalled()
  })

  it('picks a tier from the panel width and starts narrow before the first measurement', async () => {
    expect(layoutForWidth(1200)).toBe('wide')
    expect(layoutForWidth(900)).toBe('compact')
    expect(layoutForWidth(480)).toBe('narrow')
    expect(layoutForWidth(380)).toBe('dense')
    const { observers, restore } = measured()
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    try {
      const shell = panel(view.host)
      expect(shell.dataset.tier).toBe('narrow')
      expect(shell.querySelector('[data-pane="detail"]')).toBeNull()

      await setWidths(view.host, observers, { panel: 1200 })
      expect(shell.dataset.tier).toBe('wide')
      expect(shell.querySelector('[data-pane="detail"]')).not.toBeNull()
      expect(shell.querySelector('[data-pane="detail"]')?.getAttribute('data-overlay')).toBeNull()

      await setWidths(view.host, observers, { panel: 760 })
      expect(shell.dataset.tier).toBe('compact')
      expect(shell.querySelector('[data-pane="detail"]')).not.toBeNull()

      await setWidths(view.host, observers, { panel: 380 })
      expect(shell.dataset.tier).toBe('dense')
      expect(shell.querySelector('[data-pane="detail"]')).toBeNull()
      await openRow(view.host, 'turn:1')
      await click(labelOf(view.host, 'step:1:1'))
      expect(shell.querySelector('[data-pane="detail"]')?.getAttribute('data-overlay')).toBe('true')
    } finally {
      restore()
    }
  })

  it('opens on the first content row in reading mode', async () => {
    const { observers, restore } = measured()
    const getNode = vi.fn(async () => ({ ok: true as const, value: attemptDetail() }))
    const view = mount(session(oneTurn), getNode, async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    try {
      await act(async () => { await Promise.resolve() })
      // A turn is a grouping row; the default lands on step 1's first call.
      expect(rowOf(view.host, 'attempt:1:1:1')?.getAttribute('data-current')).toBe('true')
      expect(rowOf(view.host, 'step:1:1')?.getAttribute('data-current')).toBe('true')
      expect(rowOf(view.host, 'turn:1')?.getAttribute('data-current')).toBeNull()
      expect(getNode).toHaveBeenCalledWith('sess', 'attempt:1:1:1')
      expect(chipOf(view.host, 'turn:1')?.getAttribute('aria-current')).toBe('true')
      await setWidths(view.host, observers, { panel: 1200 })
      expect(view.host.querySelector('[data-view="reading"]')).not.toBeNull()
      expect(view.host.querySelector('[data-view-toggle="reading"]')?.getAttribute('aria-pressed')).toBe('true')
      expect(view.host.querySelector('[data-pane="detail"] [data-facts]')).not.toBeNull()
    } finally {
      restore()
    }
  })

  it('returns to the row a round was left on and opens a fresh round on its first call', async () => {
    const track = state([
      {
        kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 6, startTime: 1000, endTime: 2000,
        items: [calls('step:1:1', 1, 1, ['attempt:1:1:1', 'attempt:1:1:2'])],
      },
      {
        kind: 'turn', id: 'turn:2', turn: 2, status: 'ok', startSeq: 7, endSeq: 12, startTime: 3000, endTime: 4000,
        items: [calls('step:2:1', 2, 1, ['attempt:2:1:1', 'attempt:2:1:2'])],
      },
    ])
    const getNode = vi.fn(async () => ({ ok: true as const, value: attemptDetail() }))
    const view = mount(session(track), getNode, async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const isCurrent = (nodeId: string) => rowOf(view.host, nodeId)?.getAttribute('data-current') === 'true'

    // Round 1 opens on its first call, not on the retry that closed the step.
    expect(chipOf(view.host, 'turn:1')?.getAttribute('aria-current')).toBe('true')
    expect(isCurrent('attempt:1:1:1')).toBe(true)
    expect(getNode).toHaveBeenCalledWith('sess', 'attempt:1:1:1')

    // A row the user opens is what this round remembers.
    await click(labelOf(view.host, 'attempt:1:1:2'))
    await act(async () => { await Promise.resolve() })
    expect(getNode).toHaveBeenCalledWith('sess', 'attempt:1:1:2')

    // Round 2 has never been opened, so it lands on its own first call.
    await click(chipOf(view.host, 'turn:2'))
    await act(async () => { await Promise.resolve() })
    expect(chipOf(view.host, 'turn:2')?.getAttribute('aria-current')).toBe('true')
    expect(isCurrent('attempt:2:1:1')).toBe(true)
    expect(getNode).toHaveBeenCalledWith('sess', 'attempt:2:1:1')

    await click(labelOf(view.host, 'attempt:2:1:2'))
    await act(async () => { await Promise.resolve() })

    // Switching back returns to the row each round was left on.
    await click(chipOf(view.host, 'turn:1'))
    await act(async () => { await Promise.resolve() })
    expect(isCurrent('attempt:1:1:2')).toBe(true)
    expect(getNode).toHaveBeenLastCalledWith('sess', 'attempt:1:1:2')
    await click(chipOf(view.host, 'turn:2'))
    await act(async () => { await Promise.resolve() })
    expect(isCurrent('attempt:2:1:2')).toBe(true)
    expect(getNode).toHaveBeenLastCalledWith('sess', 'attempt:2:1:2')
  })

  it('reads the header figures and the band ingredients without repeating the basis', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const total = view.host.querySelector('[data-head="total"]')
    expect(total?.textContent).toContain('103')
    expect(total?.textContent).toContain(zh.exact)
    expect(total?.textContent).not.toContain('143')
    expect(view.host.querySelector('[data-head="elapsed"]')?.textContent).toContain('3.2 s')
    expect(view.host.querySelector('[data-head="total"] [data-basis="usage"]')).not.toBeNull()
    const headHit = view.host.querySelector('[data-head="hit"]')
    expect(headHit?.textContent).toContain('66.66%')
    expect(headHit?.querySelector('.dsh-context-track-hit')?.getAttribute('data-hit-tone')).toBe('mid')
    await expandBand(view.host)
    const compose = view.host.querySelector('[data-block="compose"]')
    expect(compose?.querySelector('[data-stat="input"]')?.textContent).toContain('3')
    expect(compose?.querySelector('[data-stat="output"]')?.textContent).toContain('100')
    expect(compose?.querySelector('[data-stat="reasoning"]')?.textContent).toContain('40')
    expect(compose?.querySelector('[data-stat="hit"]')?.textContent).toContain('66.66%')
    expect(compose?.querySelector('[data-stat="hit"]')?.getAttribute('title')).toBe(zh.hitHint)
    expect(compose?.querySelector('[data-stat="hit"]')?.getAttribute('data-hit-tone')).toBe('mid')
    expect(compose?.querySelector('[data-stat] .dsh-context-track-badge')).toBeNull()
    expect(view.host.querySelector('[data-block="timing"]')?.textContent).toContain(zh.elapsed)
    expect(view.host.querySelector('[data-block="timing"]')?.textContent).toContain('800')
    const child = view.host.querySelector('[data-block="side"] [data-subagent="child-1"]')
    expect(child?.textContent).toContain(zh.subagentLine)
  })

  it('copies an abbreviated number, highlights JSON, and falls back when JSON is illegal', async () => {
    const writeText = vi.fn(async () => undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    await expandBand(view.host)
    const abbreviated = view.host.querySelector('[data-full="12000"]') as HTMLButtonElement
    expect(abbreviated.title).toBe('12000')
    await click(abbreviated)
    expect(writeText).toHaveBeenCalledWith('12000')

    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    await click(view.host.querySelector('[data-view-toggle="json"]') as HTMLButtonElement)
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

  it('highlights the compaction gap without an event filter', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    expect(view.host.querySelector('.dsh-context-track-filters')).toBeNull()
    expect(view.host.querySelector('[data-kind]')).toBeNull()
    await expandBand(view.host)
    const gap = view.host.querySelector('[data-gap-seq="2"]') as HTMLButtonElement
    await click(gap)
    expect(gap.getAttribute('data-active')).toBe('true')
    expect(view.host.querySelector('[data-seq="2"]')?.getAttribute('data-active')).toBe('true')
  })

  it('keeps hover from pinning a turn and moves the strip with left and right', async () => {
    const two = state([
      { kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 2, items: [] },
      { kind: 'turn', id: 'turn:2', turn: 2, status: 'ok', startSeq: 3, endSeq: 5, items: [] },
    ])
    const view = mount(session(two), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    const current = () => view.host.querySelector('.dsh-context-track-turn[aria-current="true"]')?.getAttribute('data-turn-id')
    expect(current()).toBe('turn:2')
    const first = chipOf(view.host, 'turn:1')
    await act(async () => { first?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true })) })
    expect(current()).toBe('turn:2')
    expect(first?.getAttribute('data-pinned')).not.toBe('true')
    const strip = view.host.querySelector('[data-pane="strip"]') as HTMLElement
    await act(async () => { strip.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })) })
    expect(current()).toBe('turn:1')
    const shell = panel(view.host)
    await act(async () => { shell.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })) })
    expect(current()).toBe('turn:1')
    await act(async () => { shell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })) })
    expect(view.host.querySelector('[data-turn-id="turn:1"][data-pinned="true"]')).not.toBeNull()
  })

  it('labels each round tab with its name, shape, and both numbers', async () => {
    const two = state([
      {
        kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 4, startTime: 1000, endTime: 2000,
        items: [step([{ id: 'attempt:1:1:1', status: 'ok', usage: { inputTokens: 1, outputTokens: 100, totalTokens: 103 } }])],
      },
      {
        kind: 'turn', id: 'turn:2', turn: 2, status: 'ok', startSeq: 5, endSeq: 9, startTime: 3000, endTime: 5000,
        items: [{
          kind: 'step', id: 'step:2:1', turn: 2, step: 1, status: 'ok', startSeq: 5, endSeq: 9,
          startTime: 3000, endTime: 5000, inputSeq: 9,
          attempts: [{
            id: 'attempt:2:1:1', attempt: 1, inputSeq: 9, outputSeq: 9, status: 'ok',
            usage: { inputTokens: 10, outputTokens: 900, totalTokens: 910 },
          }],
          tools: [{ kind: 'tool', id: 'tool:8', callId: 'c8', name: 'search', status: 'ok', callSeq: 8 }],
        }],
      },
    ])
    const view = mount(session(two), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })

    const first = chipOf(view.host, 'turn:1')
    // The panel opens on the first content row, so the first round is current.
    expect(first?.getAttribute('aria-current')).toBe('true')
    expect(first?.textContent).toContain('turn 1')
    expect(first?.textContent).toContain(zh.summaryTurn.replace('{n}', '1'))
    expect(first?.querySelector('[data-chip-stat="elapsed"]')?.textContent).toContain(zh.elapsed)
    expect(first?.querySelector('[data-chip-stat="elapsed"]')?.textContent).toContain('1 s')
    expect(first?.querySelector('[data-chip-stat="total"]')?.textContent).toContain(zh.total)
    expect(first?.querySelector('[data-chip-stat="total"]')?.textContent).toContain('103')

    const second = chipOf(view.host, 'turn:2')
    expect(second?.getAttribute('aria-current')).not.toBe('true')
    expect(second?.textContent).toContain('turn 2')
    expect(second?.textContent).toContain(zh.summaryTools.replace('{n}', '1'))
    expect(second?.querySelector('[data-chip-stat="elapsed"]')?.textContent).toContain('2 s')
    expect(second?.querySelector('[data-chip-stat="total"]')?.textContent).toContain('910')
  })

  it('starts fully expanded and collapses the current row with the arrow keys', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const shell = panel(view.host)
    const tree = treePane(view.host)
    const press = async (key: string) => {
      await act(async () => { shell.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })) })
    }
    // Every level paints open, and the default selection lands on step 1's first call.
    expect(tree.textContent).toContain('step 1')
    expect(tree.textContent).toContain('llm_call 1')
    expect(rowOf(view.host, 'attempt:1:1:1')?.getAttribute('data-current')).toBe('true')
    // One step up from the call reaches its step, then the arrows fold each level.
    await press('ArrowUp')
    await press('ArrowLeft')
    expect(tree.textContent).not.toContain('llm_call 1')
    await press('ArrowRight')
    expect(tree.textContent).toContain('llm_call 1')
    await press('ArrowUp')
    await press('ArrowLeft')
    expect(tree.textContent).not.toContain('step 1')
    await press('ArrowRight')
    expect(tree.textContent).toContain('step 1')
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
    await openRow(view.host, 'turn:1')
    await openRow(view.host, 'step:1:1')
    expect(view.host.textContent).toContain('llm_call 1')
    expect(view.host.textContent).toContain('llm_call 2')
    await click(labelOf(view.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    expect(getNode).toHaveBeenCalledWith('sess', 'attempt:1:1:2')
    expect(view.host.querySelector('[data-facts]')?.textContent).toContain('attempt:1:1:2')
    await click(labelOf(view.host, 'attempt:1:1:1'))
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
    await act(async () => { await Promise.resolve() })
    const mark = view.host.querySelector('[data-mark="sidecar:3"]') as HTMLButtonElement
    expect(mark.textContent).not.toContain('turn')
    await click(mark)
    expect(bandPane(view.host)).toBeNull()
    expect(getNode).toHaveBeenCalledWith('sess', 'sidecar:3')
  })

  it('moves tool rows after the user message, keeps a dash off the total, and splits compaction', async () => {
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
    await expandBand(view.host)
    const rows = [...view.host.querySelectorAll('[data-compose] > [data-category]')]
    expect(rows.map(row => row.getAttribute('data-category'))).toEqual(['user', 'tool-results', 'tools', 'skill'])
    expect(rows[0]?.getAttribute('data-hue')).toBe('neutral')
    expect(rows[0]?.textContent).toContain(zh.catUser)
    expect(rows[0]?.textContent).toContain('9')
    expect(rows[0]?.querySelector('i')?.getAttribute('style')).toContain('18%')
    expect(rows[1]?.getAttribute('data-hue')).toBe('results')
    expect(rows[1]?.querySelector('i')?.getAttribute('style')).toContain('100%')
    expect(rows[2]?.getAttribute('data-hue')).toBe('tools')
    expect(view.host.querySelector('[data-head="total"]')?.textContent).toContain('103')
    expect(view.host.querySelector('[data-head="total"]')?.textContent).toContain(zh.exact)
    expect(view.host.querySelector('[data-compose] .dsh-context-track-badge')).toBeNull()
    expect(view.host.querySelector('[data-stat="reasoning"]')).toBeNull()
    expect(bandPane(view.host)?.textContent).not.toContain(zh.reasoningBlock)
    expect(bandPane(view.host)?.textContent).not.toContain(zh.delta)
    expect(bandPane(view.host)?.querySelector('[data-session-name]')).toBeNull()
    expect(bandPane(view.host)?.textContent).not.toContain(zh.titleExcluded)
    expect(bandPane(view.host)?.textContent).not.toContain('天气会话')
    expect(view.host.textContent).toContain('400 ms')
    const compaction = view.host.querySelector('[data-block="side"] [data-compaction]')
    expect(compaction?.textContent).toContain(zh.reclaimed)
    expect(compaction?.textContent).toContain('30')
    expect(compaction?.querySelector('[data-basis="estimated"]')?.textContent).toContain(zh.estimated)
    expect(compaction?.textContent).toContain(zh.compactionCost)
    expect(compaction?.querySelector('[data-full="12000"]')).not.toBeNull()
    expect(compaction?.querySelector('[data-basis="usage"]')?.textContent).toContain(zh.exact)
    expect(compaction?.textContent).toContain(zh.compactionIncluded)
    await openRow(view.host, 'turn:1')
    expect(view.host.textContent).toContain('turn 1')
    expect(view.host.textContent).toContain('step 1')
    expect(chipOf(view.host, 'turn:1')?.textContent).toContain('1')
    const tree = treePane(view.host)
    expect(tree.textContent).toContain(`${zh.title} -`)
    const compactRow = rowOf(view.host, 'side:compact')
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
    await expandBand(settled.host)
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
    await expandBand(waiting.host)
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
    await click(labelOf(live.host, 'step:1:1'))
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
    await expandBand(view.host)
    const band = bandPane(view.host)
    expect(band?.querySelector('[data-session-name]')).toBeNull()
    expect(band?.textContent).not.toContain(zh.title)
    expect(band?.textContent).not.toContain(zh.titleExcluded)
    expect(band?.textContent).not.toContain(zh.titleMissing)
    // Only the default selection (the sole content row) reads this node; the band stays out.
    expect(getNode.mock.calls).toEqual([['sess', 'side:title']])
  })

  it('copies the full decimal when the header total is abbreviated', async () => {
    const writeText = vi.fn(async () => undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const report = bill()
    report.consumption.total = { basis: 'usage', value: 25000 }
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: report }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const total = view.host.querySelector('[data-head="total"] [data-full="25000"]') as HTMLButtonElement
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
    expect(chipOf(view.host, 'turn:1')?.getAttribute('aria-current')).toBe('true')
  })

  it('defaults the band to one line and expands it into three blocks', async () => {
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const band = view.host.querySelector('.dsh-context-track-band') as HTMLElement
    expect(band.getAttribute('data-band')).toBe('closed')
    expect(view.host.querySelector('[data-band-panel]')).toBeNull()
    expect(view.host.querySelector('[data-compose-bar]')).not.toBeNull()
    expect(view.host.querySelector('[data-legend]')).not.toBeNull()
    // One disclosure only: a filled, caret-marked control in the header.
    const toggle = bandToggle(view.host) as HTMLButtonElement
    expect(view.host.querySelectorAll('[data-band-toggle]')).toHaveLength(1)
    expect(toggle.textContent).toContain(zh.bandTitle)
    expect(toggle.getAttribute('title')).toBe(zh.bandExpand)
    expect(toggle.querySelector('.dsh-context-track-head-band-icon')).not.toBeNull()
    expect(toggle.textContent).toContain('▾')
    await expandBand(view.host)
    expect(band.getAttribute('data-band')).toBe('open')
    expect(view.host.querySelector('[data-band-panel]')).not.toBeNull()
    expect(view.host.querySelector('[data-block="compose"]')).not.toBeNull()
    expect(view.host.querySelectorAll('[data-compose-bar]')).toHaveLength(1)
    expect(view.host.querySelector('[data-block="compose"] > h3')).toBeNull()
    expect(view.host.querySelector('[data-block="timing"]')).not.toBeNull()
    expect(view.host.querySelector('[data-block="side"]')).not.toBeNull()
    expect(bandToggle(view.host)?.getAttribute('aria-expanded')).toBe('true')
    expect(bandToggle(view.host)?.getAttribute('title')).toBe(zh.bandCollapse)
  })

  it('names the largest bar segments in the legend before folding the rest', async () => {
    const report = bill()
    report.window.categories = [
      { id: 'system', tokens: 1580 },
      { id: 'skill', tokens: 1245 },
      { id: 'history', tokens: 1960 },
      { id: 'injection', tokens: 325 },
      { id: 'user', tokens: 60 },
      { id: 'tool-results', tokens: 5200 },
      { id: 'tools', tokens: 4800 },
    ]
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: report }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const legend = [...view.host.querySelectorAll('[data-legend-list] [data-legend]')]
    expect(legend.map(item => item.getAttribute('data-legend'))).toEqual(['tool-results', 'tools', 'history', 'system'])
    expect(view.host.querySelector('[data-legend-more]')?.textContent).toBe('+3')
  })

  it('opens the header more menu, runs an action, and closes it with Escape', async () => {
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const more = view.host.querySelector('[data-more-menu]') as HTMLElement
    const trigger = more.querySelector('button[aria-haspopup="menu"]') as HTMLButtonElement
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(more.querySelector('[role="menu"]')).toBeNull()
    await click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    const items = [...more.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')]
    expect(items.map(item => item.textContent)).toEqual([zh.expandAll, zh.collapseAll, zh.resetSplit])
    await click(items[0])
    expect(more.querySelector('[role="menu"]')).toBeNull()
    expect(treePane(view.host).textContent).toContain('step 1')
    await click(trigger)
    await act(async () => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })) })
    expect(more.querySelector('[role="menu"]')).toBeNull()
  })

  it('lays out the timing card as labelled cells with a wait and think bar', async () => {
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    await expandBand(view.host)
    const timing = view.host.querySelector('[data-block="timing"] [data-card="timing"]') as HTMLElement
    expect(timing.querySelector('[data-time="elapsed"]')?.textContent).toContain(zh.elapsed)
    expect(timing.querySelector('[data-time="elapsed"]')?.textContent).toContain('3.2 s')
    expect(timing.querySelector('[data-time="wait"]')?.textContent).toContain('900 ms')
    expect(timing.querySelector('[data-time="think"]')?.textContent).toContain('400 ms')
    expect(timing.querySelector('[data-time="first"]')?.textContent).toContain('800 ms')
    expect(timing.querySelectorAll('[data-time-bar] > [data-time-seg]')).toHaveLength(3)
    expect(timing.querySelector('[data-time-seg="think"]')?.getAttribute('style')).toContain('flex-grow: 400')
    // The colored bar is opaque on its own: each segment is named with its duration beside it.
    const legend = [...timing.querySelectorAll('[data-time-legend] [data-time-key]')]
    expect(legend.map(item => item.getAttribute('data-time-key'))).toEqual(['wait', 'think', 'rest'])
    expect(timing.querySelector('[data-time-key="wait"]')?.textContent).toContain(zh.wait)
    expect(timing.querySelector('[data-time-key="wait"]')?.textContent).toContain('900 ms')
    expect(timing.querySelector('[data-time-key="think"]')?.textContent).toContain('400 ms')
    expect(timing.querySelector('[data-time-key="rest"]')?.textContent).toContain(zh.timingRest)
    expect(timing.querySelector('[data-time-key="rest"]')?.textContent).toContain('1.9 s')
  })

  it('explains an empty sidecar card instead of leaving it blank', async () => {
    const report = bill()
    report.consumption.compaction = { basis: 'absent' }
    report.events = report.events.filter(event => event.kind !== 'compaction')
    report.subagents = []
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: report }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    await expandBand(view.host)
    const side = view.host.querySelector('[data-block="side"]') as HTMLElement
    expect(side.querySelector('[data-compaction]')).toBeNull()
    expect(side.querySelector('[data-side-empty]')?.textContent).toBe(zh.sideEmpty)
    expect(side.textContent).not.toContain(zh.title)
  })

  it('jumps from a band category to the matching input card', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    await expandBand(view.host)
    await click(view.host.querySelector('[data-compose-bar] [data-category="user"]') as HTMLButtonElement)
    const focused = view.host.querySelector('[data-input] [data-category="user"]')
    expect(focused?.getAttribute('data-focus')).toBe('true')
  })

  it('shows the five largest tool definitions and leaves the rest as a count', async () => {
    const report = bill()
    report.window.categories = [{ id: 'tools', tokens: 40 }, { id: 'user', tokens: 9 }]
    report.window.toolDefinitions = Array.from({ length: 8 }, (_, index) => ({
      name: `tool-${index}`,
      tokens: (8 - index) * 10,
    }))
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: report }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    await expandBand(view.host)
    const row = view.host.querySelector('[data-compose] > [data-category="tools"]') as HTMLElement
    await click(row.querySelector('button[aria-expanded]') as HTMLButtonElement)
    const chart = row.querySelector('[data-breakdown]') as HTMLElement
    expect(chart.querySelectorAll('[data-tool]')).toHaveLength(5)
    expect(chart.querySelector('[data-tool="tool-0"]')).not.toBeNull()
    expect(chart.querySelector('[data-tool="tool-4"]')).not.toBeNull()
    expect(chart.textContent).not.toContain('tool-7')
    expect(chart.querySelector('[data-remaining]')?.getAttribute('data-remaining')).toBe('3')
    expect(chart.querySelector('[data-tool="tool-0"] .dsh-context-track-tool-meter i')?.getAttribute('style')).toContain('100%')
    const search = chart.querySelector('input') as HTMLInputElement
    await act(async () => { setInputValue(search, 'tool-7') })
    expect(chart.querySelector('[data-tool="tool-7"]')).not.toBeNull()
    expect(chart.querySelector('[data-tool="tool-0"]')).toBeNull()
    expect(chart.textContent).not.toContain(zh.noToolMatch)
    await act(async () => { setInputValue(search, 'missing-tool') })
    expect(chart.textContent).toContain(zh.noToolMatch)
    await act(async () => { setInputValue(search, '') })
    const buttons = [...chart.querySelectorAll('button')]
    await click(buttons.find(button => button.textContent === zh.sortName))
    const names = [...chart.querySelectorAll('[data-tool]')].map(node => node.getAttribute('data-tool'))
    expect(names).toEqual(['tool-0', 'tool-1', 'tool-2', 'tool-3', 'tool-4'])
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
    await expandBand(view.host)
    const row = view.host.querySelector('[data-compose] [data-category="tools"]') as HTMLElement
    expect(row.getAttribute('data-open')).toBe('false')
    expect(row.querySelector('[data-tool]')).toBeNull()
    const toggle = row.querySelector('button[aria-expanded]') as HTMLButtonElement
    expect(toggle.getAttribute('aria-label')).toBe(zh.catTools)
    await click(toggle)
    expect(row.getAttribute('data-open')).toBe('true')
    expect(row.querySelector('[data-tool="echo"]')).not.toBeNull()
    expect(row.querySelector('[data-nested="true"]')).not.toBeNull()
    expect(row.querySelector('[data-overhead]')?.textContent).toContain(zh.overhead)
    await click(toggle)
    expect(row.getAttribute('data-open')).toBe('false')
    expect(row.querySelector('[data-tool]')).toBeNull()
  })

  it('expands injection and skill sources with token totals and entry counts', async () => {
    const report = bill()
    report.window.categories = [
      { id: 'injection', tokens: 37 },
      { id: 'skill', tokens: 25 },
      { id: 'user', tokens: 9 },
    ]
    report.window.injections = [
      { name: 'AGENTS.md', tokens: 25, calls: 2 },
      { name: 'plugin-context', tokens: 12, calls: 1 },
    ]
    report.window.skills = [{ name: 'tdd', tokens: 25, calls: 1 }]
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: report }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    await expandBand(view.host)
    const band = bandPane(view.host) as HTMLElement
    for (const id of ['injection', 'skill']) {
      const row = band.querySelector(`[data-compose] > [data-category="${id}"]`) as HTMLElement
      expect(row.getAttribute('data-open')).toBe('false')
      expect(row.querySelector('[data-breakdown]')).toBeNull()
      await click(row.querySelector('button[aria-expanded]') as HTMLButtonElement)
      expect(row.getAttribute('data-open')).toBe('true')
    }
    const injection = band.querySelector('[data-breakdown][data-category="injection"]') as HTMLElement
    const sources = injection.querySelectorAll('[data-tool]')
    expect([...sources].map(row => row.getAttribute('data-tool'))).toEqual(['AGENTS.md', 'plugin-context'])
    expect(sources[0]?.textContent).toContain('25')
    expect(sources[0]?.textContent).toContain(zh.entries.replace('{n}', '2'))
    expect(injection.querySelector('[data-tool="AGENTS.md"] .dsh-context-track-tool-meter i')?.getAttribute('style')).toContain('100%')
    const search = injection.querySelector('input') as HTMLInputElement
    expect(search.getAttribute('aria-label')).toBe(zh.searchInjection)
    await act(async () => { setInputValue(search, 'plugin') })
    expect(injection.querySelectorAll('[data-tool]')).toHaveLength(1)
    expect(injection.querySelector('[data-tool="plugin-context"]')).not.toBeNull()
    await act(async () => { setInputValue(search, 'missing') })
    expect(injection.textContent).toContain(zh.noMatch)
    const skill = band.querySelector('[data-compose] > [data-category="skill"]') as HTMLElement
    expect(skill.querySelector('[data-tool="tdd"]')?.textContent).toContain('25')
    expect(skill.querySelector('input')?.getAttribute('aria-label')).toBe(zh.searchSkill)
    await click(skill.querySelector('button[aria-expanded]') as HTMLButtonElement)
    expect(skill.querySelector('[data-breakdown]')).toBeNull()
  })

  it('keeps tool definitions in the band and out of the detail', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    await expandBand(view.host)
    const detail = view.host.querySelector('[data-pane="detail"]') as HTMLElement
    const band = bandPane(view.host) as HTMLElement
    expect(detail.querySelector('[data-category="tools"]')).toBeNull()
    expect(detail.textContent).not.toContain(zh.catTools)
    expect(band.querySelector('[data-category="tools"]')).not.toBeNull()
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
    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    const detail = view.host.querySelector('[data-pane="detail"]') as HTMLElement
    const input = detail.querySelector('[data-input]')
    const output = detail.querySelector('[data-output]')
    expect(input).not.toBeNull()
    expect(output).not.toBeNull()
    expect(input!.compareDocumentPosition(output!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(detail.textContent).toContain('hello-in')
    expect(detail.textContent).toContain('hello-out')
    expect(output?.querySelector('h1')?.textContent).toContain('hello-out')
    expect(output?.querySelectorAll('[data-output-call]')).toHaveLength(2)
    expect(output?.textContent).toContain('echo')
    expect(output?.textContent).toContain('nope')
    await openRow(view.host, 'step:1:1')
    await click(labelOf(view.host, 'tool:2'))
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

    await click(labelOf(view.host, 'tool:9'))
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
    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'step:1:1'))
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
    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'step:1:1'))
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
    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    const detail = view.host.querySelector('[data-pane="detail"]') as HTMLElement
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
    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'step:1:1'))
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

  it('closes the detail, lets the tree take the width, and restores it from a row', async () => {
    const { observers, restore } = measured()
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    try {
      await setWidths(view.host, observers, { panel: 1200 })
      await openRow(view.host, 'turn:1')
      await click(labelOf(view.host, 'step:1:1'))
      await act(async () => { await Promise.resolve() })
      expect(view.host.querySelector('[data-pane="detail"]')).not.toBeNull()
      await click(view.host.querySelector('[data-detail-close]') as HTMLButtonElement)
      expect(view.host.querySelector('[data-pane="detail"]')).toBeNull()
      expect(panel(view.host).getAttribute('data-detail')).toBe('closed')
      await click(labelOf(view.host, 'step:1:1'))
      await act(async () => { await Promise.resolve() })
      expect(view.host.querySelector('[data-pane="detail"]')).not.toBeNull()
      expect(panel(view.host).getAttribute('data-detail')).toBe('open')
    } finally {
      restore()
    }
  })

  it('resizes the split, clamps it, resets on double click, and moves with the arrow keys', async () => {
    const { observers, restore } = measured()
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    try {
      await setWidths(view.host, observers, { panel: 1200, split: 1000, tree: 380 })
      const split = view.host.querySelector('[data-pane="split"]') as HTMLElement
      const tree = treePane(view.host)
      const grip = view.host.querySelector('[role="separator"]') as HTMLElement
      expect(grip.getAttribute('aria-orientation')).toBe('vertical')
      expect(tree.style.flex).toContain('38%')
      await act(async () => {
        grip.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 100, clientY: 100, pointerId: 1 }))
      })
      await act(async () => {
        grip.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 180, clientY: 100, pointerId: 1 }))
      })
      expect(parseFloat(tree.style.flex.split(' ')[2])).toBeCloseTo(46, 1)
      await act(async () => {
        grip.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }))
      })
      expect(grip.dataset.active).toBeUndefined()
      await act(async () => { grip.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })) })
      expect(parseFloat(tree.style.flex.split(' ')[2])).toBeCloseTo(43.6, 1)
      await act(async () => { grip.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })) })
      expect(parseFloat(tree.style.flex.split(' ')[2])).toBeCloseTo(38, 1)
      await act(async () => {
        grip.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 500, clientY: 100, pointerId: 2 }))
        grip.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: -500, clientY: 100, pointerId: 2 }))
        grip.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 2 }))
      })
      expect(parseFloat(tree.style.flex.split(' ')[2])).toBeGreaterThanOrEqual(24)
    } finally {
      restore()
    }
  })

  it('opens a narrow detail overlay, returns to the tree with focus, and closes on Escape', async () => {
    const view = mount(session(oneTurn), vi.fn(async () => ({ ok: true as const, value: attemptDetail() })), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const shell = panel(view.host)
    expect(shell.dataset.tier).not.toBe('wide')
    const tree = treePane(view.host)
    tree.scrollTop = 33
    await openRow(view.host, 'turn:1')
    const stepLabel = labelOf(view.host, 'step:1:1') as HTMLButtonElement
    stepLabel.focus()
    await click(stepLabel)
    await act(async () => { await Promise.resolve() })
    const overlay = view.host.querySelector('[data-pane="detail"]') as HTMLElement
    expect(overlay.getAttribute('data-overlay')).toBe('true')
    const back = overlay.querySelector('[data-detail-back]') as HTMLButtonElement
    expect(back).not.toBeNull()
    back.focus()
    await click(back)
    expect(view.host.querySelector('[data-pane="detail"]')).toBeNull()
    expect(tree.scrollTop).toBe(33)
    expect(document.activeElement).toBe(stepLabel)

    await click(stepLabel)
    await act(async () => { await Promise.resolve() })
    const close = view.host.querySelector('[data-detail-close]') as HTMLButtonElement
    close.focus()
    await act(async () => { shell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })) })
    expect(view.host.querySelector('[data-pane="detail"]')).toBeNull()
    expect(document.activeElement).toBe(stepLabel)
  })

  it('summarises a folded row and exposes tree semantics', async () => {
    const view = mount(session(oneTurn), vi.fn(), async () => ({ ok: true as const, value: bill() }))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    const tree = treePane(view.host)
    expect(tree.querySelector('[role="tree"]')).not.toBeNull()
    const turnRow = rowOf(view.host, 'turn:1') as HTMLElement
    expect(turnRow.getAttribute('role')).toBe('treeitem')
    expect(turnRow.getAttribute('aria-level')).toBe('1')
    expect(turnRow.getAttribute('data-depth')).toBe('0')
    await openRow(view.host, 'turn:1')
    const stepRow = rowOf(view.host, 'step:1:1') as HTMLElement
    expect(Number(stepRow.getAttribute('data-depth'))).toBeGreaterThan(0)
    const arrow = chevronOf(view.host, 'step:1:1') as HTMLButtonElement
    // Step rows paint open, so the summary only appears once the row is folded.
    expect(arrow.getAttribute('aria-label')).toBe(zh.collapse)
    expect(stepRow.querySelector('[data-summary]')).toBeNull()
    await click(arrow)
    expect(rowOf(view.host, 'step:1:1')?.querySelector('[data-summary]')?.textContent).toContain('1')
    expect(chevronOf(view.host, 'step:1:1')?.getAttribute('aria-label')).toBe(zh.expand)
    expect(arrow.textContent).not.toContain(zh.expand)
    expect(traceCss).toContain('@container tree (max-width: 359px)')
    expect(traceCss).toContain('@container tree (max-width: 299px)')
    expect(traceCss).toMatch(/\[data-row-kind="turn"\] \{[^}]*position: sticky/)
  })

  it('renders markdown, clamps prose, and opens one message as JSON', async () => {
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
    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    const toggles = [...view.host.querySelectorAll('[data-view-toggle]')].map(node => node.textContent)
    expect(toggles).toEqual([zh.reading, zh.jsonView])
    expect(view.host.querySelector('[data-view="reading"]')).not.toBeNull()
    const pane = view.host.querySelector('[data-pane="detail"]') as HTMLElement
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
    const facts = view.host.querySelector('[data-facts]')
    expect(facts?.querySelector('[data-fact="model"]')?.textContent).toContain('chat')
    expect(facts?.querySelector('[data-fact="provider"]')?.textContent).toContain('deepseek')
    expect(facts?.querySelector('[data-fact="temperature"]')?.textContent).toContain('1')
    expect(facts?.querySelector('[data-fact="maxTokens"]')?.textContent).toContain('256,000 token')
    expect(facts?.querySelector('[data-fact="maxTokens"]')?.textContent).toContain(zh.adapterDefault)
    expect(facts?.querySelector('[data-fact="window"]')?.textContent).toContain(zh.windowLabel)
    expect(facts?.querySelector('[data-fact="window"]')?.textContent).toContain('3')
    expect(facts?.querySelector('[data-fact="status"]')?.textContent).toContain(zh.ok)
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
    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'side:compact'))
    await act(async () => { await Promise.resolve() })
    const summary = view.host.querySelector('[data-sidecar-body]')
    expect(summary?.querySelector('h1')?.textContent).toContain('Freed')
    expect(summary?.querySelector('li')?.textContent).toContain('kept')
    await click(labelOf(view.host, 'side:title'))
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
    await openRow(view.host, 'step:1:1')
    await click(labelOf(view.host, 'tool:1'))
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
    await act(async () => { await Promise.resolve() })
    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'side:title'))
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
    await openRow(view.host, 'turn:1')
    await click(labelOf(view.host, 'side:search'))
    await act(async () => { await Promise.resolve() })
    const body = view.host.querySelector('[data-search-body]')
    expect(body?.textContent).toContain(zh.query)
    expect(body?.textContent).toContain('deepseek v4 发布')
    expect(body?.querySelector('[data-json-token]')).not.toBeNull()
    expect(body?.querySelector('.dsh-context-track-prose')).toBeNull()
    await click(labelOf(view.host, 'side:gone'))
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
    await openRow(view.host, 'turn:1')
    await openRow(view.host, 'step:1:1')
    const toolRow = rowOf(view.host, 'tool:3') as HTMLElement
    const searchRow = rowOf(view.host, 'side:search') as HTMLElement
    const toolDepth = Number(toolRow.getAttribute('data-depth'))
    const searchDepth = Number(searchRow.getAttribute('data-depth'))
    expect(searchDepth).toBeGreaterThan(toolDepth)
    await click(labelOf(view.host, 'side:search'))
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
    const turnRow = rowOf(view.host, 'turn:1') as HTMLElement
    const arrow = chevronOf(view.host, 'turn:1') as HTMLButtonElement
    // The tree paints expanded, so the control offers the collapse action first.
    expect(arrow.getAttribute('aria-label')).toBe(zh.collapse)
    expect(arrow.textContent).not.toContain(zh.expand)
    expect(turnRow.querySelector('.dsh-context-track-label')?.textContent).toContain('turn 1')
    await click(arrow)
    expect(treePane(view.host).textContent).not.toContain('step 1')
    expect(chevronOf(view.host, 'turn:1')?.getAttribute('aria-label')).toBe(zh.expand)
    await click(arrow)
    expect(treePane(view.host).textContent).toContain('step 1')
    await click(labelOf(view.host, 'step:1:1'))
    const stepRow = rowOf(view.host, 'step:1:1') as HTMLElement
    expect(stepRow.getAttribute('data-current')).toBe('true')
    expect(stepRow.querySelector('.dsh-context-track-label')?.textContent).toContain('deepseek-flash')
    expect(stepRow.querySelector('[data-column="tokens"]')?.textContent).not.toContain('deepseek-flash')
    expect(stepRow.querySelector('[data-column="tokens"]')?.textContent).toContain('→')
    const toolRow = rowOf(view.host, 'tool:1') as HTMLElement
    const sideRow = rowOf(view.host, 'side:1') as HTMLElement
    const attemptRow = rowOf(view.host, 'attempt:1:1:1') as HTMLElement
    expect(Number(toolRow.getAttribute('data-depth'))).toBeGreaterThan(Number(stepRow.getAttribute('data-depth')))
    expect(toolRow.querySelector('[data-column="duration"]')).not.toBeNull()
    expect(sideRow.querySelector('[data-column="tokens"]')?.textContent?.trim()).toBe('')
    expect(toolRow.contains(toolRow.querySelector('[data-column="duration"]'))).toBe(true)
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
    const parseButtons = [...scratch.querySelectorAll('button')].filter(button => button.textContent === zh.parseJson)
    expect(parseButtons).toHaveLength(1)
    await click(promptArrow)
    expect(promptArrow.parentElement?.textContent).toContain(tail)
    expect(promptArrow.parentElement?.querySelector('[data-json-token="string"]')).not.toBeNull()
    expect(messages.getAttribute('aria-expanded')).toBe('false')
    expect(scratch.querySelector('[data-json-key="line"]')?.getAttribute('aria-expanded')).toBe('false')
    await click([...scratch.querySelectorAll('button')].find(button => button.textContent === zh.expandAll))
    expect(scratch.textContent).toContain(tail)
    await click([...scratch.querySelectorAll('button')].find(button => button.textContent === zh.collapseAll))
    expect(rootArrow.getAttribute('aria-expanded')).toBe('false')
    expect(scratch.querySelector('[data-json-key="prompt"]')).toBeNull()
    render({ sentence: 'hello there', packed: '{"a":1}' })
    expect(scratch.querySelector('[data-json-key="packed"]')).toBeNull()
    await click([...scratch.querySelectorAll('button')].find(button => button.textContent === zh.parseJson))
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
