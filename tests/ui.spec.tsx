// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { NodeDetail } from '../src/shared/detail.ts'
import { TRACK_STATE_VERSION, type TrackState } from '../src/shared/model.ts'
import { en, zh, type TrackKey } from '../src/client/locales.ts'
import { ensureStyles, traceCss } from '../src/client/styles.ts'
import { TraceMain, TracePage, type TracePageProps } from '../src/client/TracePage.tsx'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const dictionaries = { zh, en }

function page(list: ListState, getNode: TracePageProps['getNode'], language: 'zh' | 'en' = 'zh'): TracePageProps {
  return {
    sessionId: list.ids[0],
    useSessions: (selector: (state: ListState) => unknown) => selector(list),
    t: (key: TrackKey) => dictionaries[language][key],
    getNode,
  } as unknown as TracePageProps
}

interface ListState {
  ids: string[]
  byId: Record<string, { id: string; retainedBy?: { mainView?: number } }>
  projectionsBySession: Record<string, { values: { track?: TrackState } }>
}

function mount(props: TracePageProps): { host: HTMLDivElement; root: Root } {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  act(() => { root.render(<TracePage {...props} />) })
  return { host, root }
}

function panel(host: ParentNode): HTMLElement {
  return host.querySelector('[data-tier]') as HTMLElement
}

function row(host: ParentNode, nodeId: string): HTMLElement | null {
  return host.querySelector(`[data-row-kind][data-node-id="${nodeId}"]`)
}

function label(host: ParentNode, nodeId: string): HTMLButtonElement | null {
  return row(host, nodeId)?.querySelector('.dsh-context-track-label') ?? null
}

function chevron(host: ParentNode, nodeId: string): HTMLButtonElement | null {
  return row(host, nodeId)?.querySelector('button[aria-expanded]') ?? null
}

function buttons(host: ParentNode, selector: string): HTMLButtonElement[] {
  return [...host.querySelectorAll<HTMLButtonElement>(selector)]
}

async function click(button: HTMLButtonElement | null | undefined): Promise<void> {
  await act(async () => {
    button?.click()
    await Promise.resolve()
  })
}

/** Open a row without depending on its default expansion. */
async function open(host: ParentNode, nodeId: string): Promise<void> {
  const control = chevron(host, nodeId)
  if (control !== null && control.getAttribute('aria-expanded') === 'false') await click(control)
}

const finishedTurn: TrackState = {
  stateVersion: TRACK_STATE_VERSION,
  root: [{
    kind: 'turn', id: 'turn:1', turn: 1, status: 'ok', startSeq: 0, endSeq: 4,
    items: [{
      kind: 'step', id: 'step:1:1', turn: 1, step: 1, status: 'ok', startSeq: 1, endSeq: 3, inputSeq: 3,
      attempts: [{ id: 'attempt:1:1:1', attempt: 1, inputSeq: 3, outputSeq: 3, status: 'ok' }],
      tools: [],
    }],
  }],
}

const runningStep: TrackState = {
  stateVersion: TRACK_STATE_VERSION,
  root: [{
    kind: 'turn', id: 'turn:1', turn: 1, status: 'running', startSeq: 0,
    items: [{
      kind: 'step', id: 'step:1:1', turn: 1, step: 1, status: 'running', startSeq: 1, inputSeq: 2,
      attempts: [], tools: [],
    }],
  }],
}

const childTrack: TrackState = {
  stateVersion: TRACK_STATE_VERSION,
  root: [{ kind: 'turn', id: 'turn:7', turn: 7, status: 'running', startSeq: 0, items: [] }],
}

const linkedTool: TrackState = {
  stateVersion: TRACK_STATE_VERSION,
  root: [{
    kind: 'turn', id: 'turn:1', turn: 1, status: 'running', startSeq: 0,
    items: [{
      kind: 'step', id: 'step:1:1', turn: 1, step: 1, status: 'running', startSeq: 1, inputSeq: 2,
      attempts: [],
      tools: [{
        kind: 'tool', id: 'tool:2', callId: 'c1', name: 'spawn', status: 'ok', callSeq: 2,
        childSessionId: 'child-1', childMode: 'one-shot', childLabel: 'Helper',
      }],
    }],
  }],
}

describe('trace panel', () => {
  const roots: Root[] = []
  afterEach(() => {
    for (const root of roots) act(() => { root.unmount() })
    roots.length = 0
    document.body.innerHTML = ''
    for (const node of document.head.querySelectorAll('style')) {
      if (node.dataset.dshContextTrack === undefined) node.remove()
    }
  })

  it('follows the retained session from the left-sidebar centre page', async () => {
    const getNode = vi.fn()
    const list = session(finishedTurn)
    const host = document.createElement('div')
    document.body.appendChild(host)
    const root = createRoot(host)
    roots.push(root)
    const props = {
      useSessions: (selector: (state: ListState) => unknown) => selector(list),
      t: (key: TrackKey) => zh[key],
      getNode,
    } as unknown as Parameters<typeof TraceMain>[0]
    act(() => { root.render(<TraceMain {...props} />) })
    expect(host.textContent).toContain('turn 1')
    expect(host.querySelector('.dsh-context-track-main')).not.toBeNull()
    expect(panel(host)).not.toBeNull()

    list.byId.sess = { id: 'sess', retainedBy: {} }
    act(() => { root.render(<TraceMain {...props} />) })
    expect(host.textContent).toContain(zh.empty)
    expect(getNode).not.toHaveBeenCalled()
  })

  it('shows the empty state and does not request a node when no session is open', async () => {
    const getNode = vi.fn()
    const view = mount(page({ ids: [], byId: {}, projectionsBySession: {} }, getNode))
    roots.push(view.root)
    await act(async () => { await Promise.resolve() })
    expect(view.host.textContent).toContain(zh.empty)
    expect(getNode).not.toHaveBeenCalled()
  })

  it('uses the dictionary for the active language', () => {
    const getNode = vi.fn()
    const chinese = mount(page({ ids: [], byId: {}, projectionsBySession: {} }, getNode, 'zh'))
    roots.push(chinese.root)
    expect(chinese.host.textContent).toContain(zh.empty)
    const english = mount(page({ ids: [], byId: {}, projectionsBySession: {} }, getNode, 'en'))
    roots.push(english.root)
    expect(english.host.textContent).toContain(en.empty)
  })

  it('paints tree labels with the panel color instead of the user-agent button color', () => {
    const userAgent = document.createElement('style')
    userAgent.textContent = 'button { color: black; }'
    document.head.appendChild(userAgent)
    const view = mount(page(session(finishedTurn), vi.fn()))
    roots.push(view.root)
    const shell = panel(view.host)
    shell.style.setProperty('--dsw-alias-label-primary', 'rgb(240, 240, 240)')
    const turnLabel = label(view.host, 'turn:1')
    expect(turnLabel).not.toBeNull()
    expect(getComputedStyle(turnLabel!).color).toBe('rgb(240, 240, 240)')
  })

  it('hides a finished turn’s children without writing the projection', async () => {
    const track = structuredClone(finishedTurn)
    const getNode = vi.fn()
    const view = mount(page(session(track), getNode))
    roots.push(view.root)
    expect(view.host.textContent).not.toContain('step 1')
    await click(chevron(view.host, 'turn:1'))
    expect(view.host.textContent).toContain('step 1')
    await click(chevron(view.host, 'turn:1'))
    expect(view.host.textContent).not.toContain('step 1')
    expect(track).toEqual(finishedTurn)
  })

  it('nests the child session’s own track under its tool', async () => {
    const getNode = vi.fn()
    const list = session(linkedTool)
    list.projectionsBySession['child-1'] = { values: { track: childTrack } }
    const view = mount(page(list, getNode))
    roots.push(view.root)
    await open(view.host, 'turn:1')
    await open(view.host, 'step:1:1')
    await open(view.host, 'tool:2')
    expect(view.host.textContent).toContain('turn 7')
    expect(view.host.textContent).not.toContain(zh.unavailable)
  })

  it('keeps the tree visible when reading a node throws', async () => {
    const getNode = vi.fn(() => {
      throw new Error('cannot get property "remote.track" without inject')
    })
    const view = mount(page(session(finishedTurn), getNode))
    roots.push(view.root)
    await click(chevron(view.host, 'turn:1'))
    await click(label(view.host, 'step:1:1'))
    expect(view.host.textContent).toContain('turn 1')
    expect(view.host.textContent).toContain(zh.missing)
    expect(panel(view.host).querySelector('[data-pane="tree"]')).not.toBeNull()
  })

  it('hides the chat composer on this tab and keeps an approval, question, or plan card', () => {
    ensureStyles()
    const body = document.createElement('div')
    const scroll = document.createElement('div')
    scroll.setAttribute('data-conversation-scroll', '')
    const pane = document.createElement('div')
    pane.className = 'dsh-context-track'
    const seat = document.createElement('div')
    seat.setAttribute('data-composer-seat', '')
    const handle = document.createElement('div')
    handle.setAttribute('data-width-handle', 'right')
    scroll.append(pane, seat)
    body.append(scroll, handle)
    document.body.append(body)
    expect(getComputedStyle(seat).display).toBe('none')
    expect(getComputedStyle(handle).display).toBe('none')
    for (const name of ['data-approval-key', 'data-question-key', 'data-plan-review-key']) {
      const card = document.createElement('div')
      card.setAttribute(name, '1')
      seat.replaceChildren(card)
      expect(getComputedStyle(seat).display).not.toBe('none')
    }
    seat.replaceChildren()
    expect(getComputedStyle(seat).display).toBe('none')
  })

  it('scrolls the detail pane independently of the tree', async () => {
    const attempt: NodeDetail = {
      kind: 'attempt', status: 'ok', inputSeq: 3,
      messages: [{ text: `${'line\n'.repeat(80)}tail-marker` }],
      tools: [], toolHistory: { tools: [], updates: [] }, config: {}, output: { text: 'seen-output' },
    }
    const view = mount(page(session(finishedTurn), vi.fn(async () => ({ ok: true as const, value: attempt }))))
    roots.push(view.root)
    view.host.style.cssText = 'display:flex;flex-direction:column;height:160px;overflow:hidden;'
    await click(chevron(view.host, 'turn:1'))
    await click(label(view.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    expect(view.host.textContent).not.toContain('tail-marker')
    await click(view.host.querySelector('[data-more]') as HTMLButtonElement)
    const detail = view.host.querySelector('[data-pane="detail"]') as HTMLElement
    const tree = view.host.querySelector('[data-pane="tree"]') as HTMLElement
    const track = panel(view.host)
    expect(getComputedStyle(track).minHeight).not.toBe('auto')
    expect(getComputedStyle(detail).minHeight).not.toBe('auto')
    expect(getComputedStyle(tree).minHeight).not.toBe('auto')
    expect(traceCss).toMatch(/\.dsh-context-track \{[^}]*overflow:\s*hidden/)
    expect(traceCss).toMatch(/\.dsh-context-track-detail \{[^}]*overflow:\s*auto/)
    expect(view.host.textContent).toContain('turn 1')
    expect(view.host.textContent).toContain('tail-marker')
    tree.scrollTop = 15
    detail.scrollTop = 40
    expect(tree.scrollTop).toBe(15)
    expect(detail.scrollTop).toBe(40)
  })

  it('loads the latest attempt and a running prefix without a token subscription', async () => {
    const attempt: NodeDetail = {
      kind: 'attempt', status: 'ok', inputSeq: 3,
      messages: [{ text: 'seen-input' }], tools: [], toolHistory: { tools: [], updates: [] },
      config: { model: 'chat' }, usage: { inputTokens: 1, outputTokens: 1 }, output: { text: 'seen-output' },
    }
    const getNode = vi.fn(async () => ({ ok: true as const, value: attempt }))
    const list = session(finishedTurn)
    const view = mount(page(list, getNode))
    roots.push(view.root)
    await click(chevron(view.host, 'turn:1'))
    await click(label(view.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    expect(getNode).toHaveBeenCalledWith('sess', 'attempt:1:1:1')
    expect(view.host.textContent).toContain('seen-input')
    expect(view.host.textContent).toContain('seen-output')
    const calls = getNode.mock.calls.length
    act(() => { view.root.render(<TracePage {...page(list, getNode)} />) })
    await act(async () => { await Promise.resolve() })
    expect(getNode.mock.calls.length).toBe(calls)

    const running: NodeDetail = {
      kind: 'step', status: 'running', inputSeq: 2,
      messages: [{ text: 'live-prefix' }], tools: [], toolHistory: { tools: [], updates: [] }, config: {},
    }
    const live = vi.fn(async () => ({ ok: true as const, value: running }))
    const liveView = mount(page(session(runningStep), live))
    roots.push(liveView.root)
    await click(label(liveView.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    expect(live).toHaveBeenCalledWith('sess', 'step:1:1')
    expect(liveView.host.textContent).toContain('live-prefix')
    expect(liveView.host.textContent).toContain(zh.notSeen)
    expect(liveView.host.textContent).not.toContain('token-delta')
  })

  it('updates the open reading and json views when a running call finishes', async () => {
    const running: NodeDetail = {
      kind: 'step', status: 'running', inputSeq: 2,
      messages: [{ text: 'live-prefix' }], tools: [], toolHistory: { tools: [], updates: [] }, config: {},
    }
    const settled: NodeDetail = {
      kind: 'attempt', status: 'ok', inputSeq: 3,
      messages: [{ text: 'live-prefix' }], tools: [], toolHistory: { tools: [], updates: [] }, config: {},
      output: { text: 'finished-answer' },
      usage: { outputTokens: 3 },
    }
    let value: NodeDetail = running
    const getNode = vi.fn(async () => ({ ok: true as const, value }))
    const view = mount(page(session(runningStep), getNode))
    roots.push(view.root)
    await click(label(view.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    expect(view.host.querySelector('[data-output="unseen"]')?.textContent).toContain(zh.notSeen)
    await click(view.host.querySelector('[data-view-toggle="json"]') as HTMLButtonElement)
    expect(view.host.querySelector('[data-json-part="output"]')?.textContent).toContain('running')
    expect(view.host.querySelector('[data-json-part="output"]')?.textContent).not.toContain('finished-answer')

    value = settled
    await act(async () => {
      view.root.render(<TracePage {...page(session(finishedTurn), getNode)} />)
      await Promise.resolve()
    })
    const reading = view.host.querySelector('[data-view-pane="reading"]')
    const output = view.host.querySelector('[data-json-part="output"]')
    expect(reading?.textContent).toContain('finished-answer')
    expect(reading?.textContent).not.toContain(zh.notSeen)
    expect(reading?.querySelector('[data-facts]')?.textContent).toContain(zh.ok)
    expect(output?.textContent).toContain('finished-answer')
    expect(output?.textContent).toContain('ok')
    expect(output?.textContent).not.toContain('running')
  })

  it('refreshes turn 1 step 1 when the same track object gains the finished attempt', async () => {
    const track: TrackState = JSON.parse(JSON.stringify(runningStep)) as TrackState
    const running: NodeDetail = {
      kind: 'step', status: 'running', inputSeq: 2,
      messages: [{ text: 'live-prefix' }], tools: [], toolHistory: { tools: [], updates: [] }, config: {},
    }
    const settled: NodeDetail = {
      kind: 'attempt', status: 'ok', inputSeq: 3,
      messages: [{ text: 'live-prefix' }], tools: [], toolHistory: { tools: [], updates: [] }, config: {},
      output: { text: 'second-round-answer' },
      usage: { outputTokens: 4 },
    }
    let value: NodeDetail = running
    const getNode = vi.fn(async () => ({ ok: true as const, value }))
    const list = session(track)
    const view = mount(page(list, getNode))
    roots.push(view.root)
    await click(label(view.host, 'step:1:1'))
    await act(async () => { await Promise.resolve() })
    await click(view.host.querySelector('[data-view-toggle="json"]') as HTMLButtonElement)
    expect(view.host.querySelector('[data-output="unseen"]')?.textContent).toContain(zh.notSeen)
    expect(view.host.querySelector('[data-json-part="output"]')?.textContent).toContain('running')

    const turn = track.root[0]
    if (turn?.kind !== 'turn') throw new Error('missing turn')
    const item = turn.items[0]
    if (item?.kind !== 'step') throw new Error('missing step')
    item.status = 'ok'
    item.attempts = [{ id: 'attempt:1:1:1', attempt: 1, inputSeq: 3, outputSeq: 3, status: 'ok' }]
    value = settled
    const calls = getNode.mock.calls.length
    await act(async () => {
      view.root.render(<TracePage {...page(list, getNode)} />)
      await Promise.resolve()
    })
    expect(getNode.mock.calls.length).toBeGreaterThan(calls)
    const reading = view.host.querySelector('[data-view-pane="reading"]')
    const output = view.host.querySelector('[data-json-part="output"]')
    expect(reading?.textContent).toContain('second-round-answer')
    expect(reading?.textContent).not.toContain(zh.notSeen)
    expect(reading?.querySelector('[data-facts]')?.textContent).toContain(zh.ok)
    expect(output?.textContent).toContain('second-round-answer')
    expect(output?.textContent).not.toContain('running')
  })
})

function session(track: TrackState): ListState {
  return {
    ids: ['sess'],
    byId: { sess: { id: 'sess', retainedBy: { mainView: 1 } } },
    projectionsBySession: { sess: { values: { track } } },
  }
}
