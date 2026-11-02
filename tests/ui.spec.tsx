// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { NodeDetail } from '../src/shared/detail.ts'
import { TRACK_STATE_VERSION, type TrackState } from '../src/shared/model.ts'
import { en, zh, type TrackKey } from '../src/client/locales.ts'
import { traceCss } from '../src/client/styles.ts'
import { TraceMain, TracePage, type TracePageProps } from '../src/client/TracePage.tsx'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const dictionaries = { zh, en }

function page(list: ListState, getNode: TracePageProps['getNode'], language: 'zh' | 'en' = 'zh'): TracePageProps {
  return {
    sessionId: list.ids[0],
    useSessions: selector => selector(list as never),
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

function buttons(host: ParentNode, label: string): HTMLButtonElement[] {
  return [...host.querySelectorAll('button')].filter(button => button.textContent?.includes(label))
}

async function click(button: HTMLButtonElement | undefined): Promise<void> {
  await act(async () => {
    button?.click()
    await Promise.resolve()
  })
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
    expect(host.textContent).toContain('轮次 1')
    expect(host.querySelector('.dsh-context-track-main')).not.toBeNull()

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
    const panel = view.host.querySelector('.dsh-context-track') as HTMLElement
    panel.style.setProperty('--dsw-alias-label-primary', 'rgb(240, 240, 240)')
    const label = buttons(view.host, '轮次 1')[0]
    expect(label).toBeDefined()
    expect(getComputedStyle(label!).color).toBe('rgb(240, 240, 240)')
  })

  it('hides a finished turn’s children without writing the projection', async () => {
    const track = structuredClone(finishedTurn)
    const getNode = vi.fn()
    const view = mount(page(session(track), getNode))
    roots.push(view.root)
    expect(view.host.textContent).not.toContain('step 1')
    await click(buttons(view.host, zh.expand)[0])
    expect(view.host.textContent).toContain('step 1')
    await click(buttons(view.host, zh.collapse)[0])
    expect(view.host.textContent).not.toContain('step 1')
    expect(track).toEqual(finishedTurn)
  })

  it('nests the child session’s own track under its tool', async () => {
    const getNode = vi.fn()
    const list = session(linkedTool)
    list.projectionsBySession['child-1'] = { values: { track: childTrack } }
    const view = mount(page(list, getNode))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand).find(button => button.parentElement?.textContent?.includes('step')))
    await click(buttons(view.host, zh.expand).find(button => button.parentElement?.textContent?.includes('spawn')))
    expect(view.host.textContent).toContain('turn 7')
    expect(view.host.textContent).not.toContain(zh.unavailable)
  })

  it('keeps the tree visible when reading a node throws', async () => {
    const getNode = vi.fn(() => {
      throw new Error('cannot get property "remote.track" without inject')
    })
    const view = mount(page(session(finishedTurn), getNode))
    roots.push(view.root)
    await click(buttons(view.host, '轮次 1')[0])
    expect(view.host.textContent).toContain('轮次 1')
    expect(view.host.textContent).toContain(zh.missing)
    expect(view.host.querySelector('.dsh-context-track-tree')).not.toBeNull()
  })

  it('scrolls the detail pane when the node body is taller than the panel', async () => {
    const attempt: NodeDetail = {
      kind: 'attempt', status: 'ok', inputSeq: 3,
      messages: [{ text: `${'line\n'.repeat(80)}tail-marker` }],
      tools: [], toolHistory: { tools: [], updates: [] }, config: {}, output: { text: 'seen-output' },
    }
    const view = mount(page(session(finishedTurn), vi.fn(async () => ({ ok: true as const, value: attempt }))))
    roots.push(view.root)
    view.host.style.cssText = 'display:flex;flex-direction:column;height:160px;overflow:hidden;'
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    expect(view.host.textContent).not.toContain('tail-marker')
    await click(view.host.querySelector('[data-more]') as HTMLButtonElement)
    const detail = view.host.querySelector('.dsh-context-track-detail') as HTMLElement
    const tree = view.host.querySelector('.dsh-context-track-tree') as HTMLElement
    const track = view.host.querySelector('.dsh-context-track') as HTMLElement
    expect(getComputedStyle(track).minHeight).not.toBe('auto')
    expect(getComputedStyle(detail).minHeight).not.toBe('auto')
    expect(getComputedStyle(tree).minHeight).not.toBe('auto')
    expect(traceCss).toMatch(/\.dsh-context-track \{[^}]*overflow:\s*hidden/)
    expect(traceCss).toMatch(/\.dsh-context-track-detail \{[^}]*overflow:\s*auto/)
    expect(view.host.textContent).toContain('轮次 1')
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
    await click(buttons(view.host, zh.expand)[0])
    await click(buttons(view.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    expect(getNode).toHaveBeenCalledWith('sess', 'attempt:1:1:1')
    expect(view.host.textContent).toContain('seen-input')
    expect(view.host.textContent).toContain('seen-output')
    expect(buttons(view.host, '概览')).toHaveLength(0)
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
    await click(buttons(liveView.host, 'step 1')[0])
    await act(async () => { await Promise.resolve() })
    expect(live).toHaveBeenCalledWith('sess', 'step:1:1')
    expect(liveView.host.textContent).toContain('live-prefix')
    expect(liveView.host.textContent).toContain(zh.notSeen)
    expect(liveView.host.textContent).not.toContain('token-delta')
  })
})

function session(track: TrackState): ListState {
  return {
    ids: ['sess'],
    byId: { sess: { id: 'sess', retainedBy: { mainView: 1 } } },
    projectionsBySession: { sess: { values: { track } } },
  }
}
