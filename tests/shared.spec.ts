import { describe, expect, it } from 'vitest'
import { classifyWindow } from '../src/shared/classify.ts'
import { contentPrice, estimateMessage, estimateSystemText, estimateTools, imagePatchTokens } from '../src/shared/estimate.ts'
import { billOf, cacheHitRate, estimateDelta, formatHitPercent, sumUsage } from '../src/shared/figures.ts'
import { barGeometry, firstResponses, streamMetrics, toolClock, waitMs } from '../src/shared/timing.ts'

describe('estimate', () => {
  it('prices the text abcd at 5 and skips block overhead on a system prompt', () => {
    expect(contentPrice('abcd')).toBe(5)
    expect(estimateSystemText('12345678')).toBe(6)
    expect(estimateMessage({
      role: 'system',
      content: [{ type: 'text', text: '12345678' }],
    }, true)).toBe(6)
  })

  it('prices an empty assistant placeholder at 0', () => {
    expect(estimateMessage({ role: 'assistant', content: [] })).toBe(0)
  })

  it('prices a tool table above the sum of its tools and caps images with the patch formula', () => {
    const tools = [{ name: 'echo', description: 'Echo a string back to the caller', parameters: { type: 'object' } }]
    const priced = estimateTools(tools)
    expect(priced.tools).toHaveLength(1)
    expect(priced.overhead).toBe(priced.table - priced.tools[0]!.tokens)
    expect(priced.overhead).toBeGreaterThan(0)
    expect(estimateTools([])).toEqual({ table: 0, tools: [] })
    expect(imagePatchTokens(2000, 2000)).toBe(imagePatchTokens(5000, 5000))
    expect(imagePatchTokens(2000, 2000)).toBeLessThanOrEqual(1024)
    const block = { type: 'image', attachment: { id: 'pic' } }
    const json = JSON.stringify(block)
    expect(estimateMessage({ role: 'user', content: [block] })).toBe(Math.ceil(json.length / 4) + 4 + 4)
  })
})

describe('classify', () => {
  it('keeps a skill invocation out of injection and counts tool results exactly', () => {
    const skill = { role: 'user', content: [{ type: 'text', text: 'skill body' }], source: { kind: 'skill-invocation' } }
    const injected = { role: 'user', content: [{ type: 'text', text: 'from file' }], source: { kind: 'file', path: 'AGENTS.md' } }
    const user = { role: 'user', content: [{ type: 'text', text: 'hello' }], source: { kind: 'user' } }
    const call = { role: 'assistant', content: [{ type: 'tool-call', id: 'c1', name: 'echo', arguments: '{}' }] }
    const results = [1, 2, 3].map(() => ({
      role: 'tool',
      toolCallId: 'c1',
      content: [{ type: 'text', text: 'ok' }],
      source: { kind: 'tool', callId: 'c1' },
    }))
    const window = classifyWindow([skill, injected, user, call, ...results], [])
    expect(window.totals.skill).toBeGreaterThan(0)
    expect(window.items.filter(item => item.category === 'injection').map(item => item.message)).toEqual([injected])
    expect(window.items.some(item => item.category === 'skill' && item.message === skill)).toBe(true)
    expect(window.toolResults).toEqual([expect.objectContaining({ name: 'echo', calls: 3 })])
  })
})

describe('cache hit rate', () => {
  it('truncates 2/3 to 66.66% and sums attempts before dividing', () => {
    const one = cacheHitRate([{ inputTokens: 1, outputTokens: 1, cacheReadTokens: 2 }])
    expect(one).toEqual({ basis: 'usage', value: 66.66 })
    expect(formatHitPercent(66.66)).toBe('66.66%')
    const summed = cacheHitRate([
      { inputTokens: 100, outputTokens: 1, cacheReadTokens: 0 },
      { inputTokens: 0, outputTokens: 1, cacheReadTokens: 50 },
    ])
    expect(summed).toEqual({ basis: 'usage', value: 33.33 })
    expect(cacheHitRate([{ inputTokens: 0, outputTokens: 1 }])).toEqual({ basis: 'absent' })
    const bill = billOf({ inputTokens: 10, outputTokens: 100, reasoningTokens: 40 })
    expect(bill.output).toEqual({ basis: 'usage', value: 100 })
    expect(bill.reasoning).toEqual({ basis: 'usage', value: 40 })
    expect(bill.total).toEqual({ basis: 'usage', value: 110 })
  })

  it('does not scale an estimate toward the exact input', () => {
    const exact = { basis: 'usage' as const, value: 100 }
    const estimated = { basis: 'estimated' as const, value: 40 }
    expect(estimateDelta(exact, estimated)).toEqual({ delta: { basis: 'usage', value: 60 }, consistent: false })
    expect(estimateDelta(exact, { basis: 'estimated', value: 100 })).toEqual({
      delta: { basis: 'usage', value: 0 },
      consistent: true,
    })
    expect(sumUsage([
      { inputTokens: 1, outputTokens: 2, totalTokens: 3 },
      { inputTokens: 4, outputTokens: 5, totalTokens: 9 },
    ])).toMatchObject({ inputTokens: 5, outputTokens: 7, totalTokens: 12 })
  })
})

describe('timing', () => {
  it('ends the wait at the first stream record, even when that record is reasoning', () => {
    const stream = [
      { type: 'reasoning-chunks', time0: 1800, index: 0, dt: [400], texts: ['think'] },
      { type: 'text-chunks', time0: 2500, index: 1, dt: [10], texts: ['body'] },
    ]
    const metrics = streamMetrics(stream)
    expect(waitMs(1000, metrics.streamStart)).toBe(800)
    expect(metrics.thinkMs).toBe(400)
    expect(metrics.firstVisible).toBe(1800)
  })

  it('skips blank text, uses a named tool fragment, and leaves an unseen stream absent', () => {
    const blank = streamMetrics([
      { type: 'text-chunks', time0: 1800, index: 0, dt: [100, 0], texts: ['  ', 'hi'] },
    ])
    expect(blank.firstVisible).toBe(1900)
    const tool = streamMetrics([
      { type: 'tool-call-chunks', time0: 2000, index: 0, dt: [], id: 'c', name: 'spawn', args: [] },
    ])
    expect(tool.firstVisible).toBe(2000)
    expect(streamMetrics([]).firstVisible).toBeUndefined()
  })

  it('measures the opening response from turn/start and keeps a later user input separate', () => {
    const opening = firstResponses({
      startTime: 1000,
      startSeq: 0,
      userInputs: [{ seq: 2, time: 1300 }],
      visibles: [1800, 2500],
    })
    expect(opening).toHaveLength(1)
    expect(opening[0]?.duration).toEqual({ basis: 'usage', value: 800 })

    const later = firstResponses({
      startTime: 1000,
      startSeq: 0,
      userInputs: [{ seq: 2, time: 1300 }, { seq: 8, time: 5000 }],
      visibles: [1800, 5600],
    })
    expect(later.map(item => item.duration.value)).toEqual([800, 600])
    expect(later.filter(item => item.opening).map(item => item.duration.value)).toEqual([800])

    const unseen = firstResponses({ startTime: 1000, startSeq: 0, userInputs: [], visibles: [] })
    expect(unseen[0]).toMatchObject({ noUserMessage: true, duration: { basis: 'absent' } })

    const noUser = firstResponses({ startTime: 1000, startSeq: 0, userInputs: [], visibles: [1500] })
    expect(noUser[0]).toMatchObject({ noUserMessage: true, duration: { basis: 'usage', value: 500 } })
  })

  it('keeps a failed attempt’s earlier visible output and does not add a second response for a tool call', () => {
    const failed = firstResponses({
      startTime: 1000,
      startSeq: 0,
      userInputs: [{ seq: 2, time: 1300 }],
      visibles: [1800, 4000],
    })
    expect(failed).toHaveLength(1)
    expect(failed[0]?.duration.value).toBe(800)
  })

  it('reports the union and the sum of overlapping tools, and aligns later bars to the right', () => {
    expect(toolClock([{ start: 0, end: 100 }, { start: 50, end: 150 }])).toEqual({ union: 150, sum: 200 })
    const first = barGeometry(0, 100, 0, 200)
    const second = barGeometry(100, 200, 0, 200)
    expect(second.left).toBeGreaterThan(first.left)
  })
})
