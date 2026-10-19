// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { NodeDetail } from '../src/shared/detail.ts'
import { TRACK_STATE_VERSION, type TrackState } from '../src/shared/model.ts'
import { en, zh, type TrackKey } from '../src/client/locales.ts'
import { TracePage, type TracePageProps } from '../src/client/TracePage.tsx'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const dictionaries = { zh, en }

function page(list: ListState, getNode: TracePageProps['getNode'], language: 'zh' | 'en' = 'zh'): TracePageProps {
  return {
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

  it('hides a finished turn’s children without writing the projection', async () => {
    const track = structuredClone(finishedTurn)
    const getNode = vi.fn()
    const view = mount(page(session(track), getNode))
    roots.push(view.root)
    expect(view.host.textContent).not.toContain('步骤 1')
    await click(buttons(view.host, zh.expand)[0])
    expect(view.host.textContent).toContain('步骤 1')
    await click(buttons(view.host, zh.collapse)[0])
    expect(view.host.textContent).not.toContain('步骤 1')
    expect(track).toEqual(finishedTurn)
  })

  it('nests the child session’s own track under its tool', async () => {
    const getNode = vi.fn()
    const list = session(linkedTool)
    list.projectionsBySession['child-1'] = { values: { track: childTrack } }
    const view = mount(page(list, getNode))
    roots.push(view.root)
    await click(buttons(view.host, zh.expand).find(button => button.parentElement?.textContent?.includes('步骤')))
    await click(buttons(view.host, zh.expand).find(button => button.parentElement?.textContent?.includes('spawn')))
    expect(view.host.textContent).toContain('回合 7')
    expect(view.host.textContent).not.toContain(zh.unavailable)
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
    await click(buttons(view.host, '步骤 1')[0])
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
    await click(buttons(liveView.host, '步骤 1')[0])
    await act(async () => { await Promise.resolve() })
    expect(live).toHaveBeenCalledWith('sess', 'step:1:1')
    expect(liveView.host.textContent).toContain('live-prefix')
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
