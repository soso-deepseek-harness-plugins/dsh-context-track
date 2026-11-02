/**
 * Quantities shown in the console. `usage` is an exact model or clock figure,
 * `estimated` is the fixed-density heuristic, and `absent` is not a zero.
 */
import type { TokenUsageScalars } from './model.js'

export type FigureBasis = 'usage' | 'estimated' | 'absent'

export interface Figure {
  basis: FigureBasis
  /** Omitted when the figure is absent. Zero is a real measurement. */
  value?: number
}

/** Read a model usage object. Anything without both input and output counts is ignored. */
export function parseUsage(value: unknown): TokenUsageScalars | undefined {
  if (value === null || typeof value !== 'object') return undefined
  const source = value as Record<string, unknown>
  if (typeof source.inputTokens !== 'number' || typeof source.outputTokens !== 'number') return undefined
  const usage: TokenUsageScalars = { inputTokens: source.inputTokens, outputTokens: source.outputTokens }
  for (const key of ['totalTokens', 'cacheReadTokens', 'cacheWriteTokens', 'reasoningTokens'] as const) {
    const item = source[key]
    if (typeof item === 'number') usage[key] = item
  }
  return usage
}

export function usageFigure(value: number): Figure {
  return { basis: 'usage', value }
}

export function estimatedFigure(value: number): Figure {
  return { basis: 'estimated', value }
}

export function absentFigure(): Figure {
  return { basis: 'absent' }
}

export interface UsageBill {
  input: Figure
  output: Figure
  total: Figure
  reasoning: Figure
  cacheRead: Figure
  cacheWrite: Figure
}

/** One call's bill. Reasoning is reported beside output and is not added again. */
export function billOf(usage: TokenUsageScalars | undefined): UsageBill {
  if (usage === undefined) {
    const absent = absentFigure()
    return {
      input: absent,
      output: absent,
      total: absent,
      reasoning: absent,
      cacheRead: absent,
      cacheWrite: absent,
    }
  }
  const cacheRead = usage.cacheReadTokens
  const cacheWrite = usage.cacheWriteTokens
  const input = usage.inputTokens + (cacheRead ?? 0) + (cacheWrite ?? 0)
  const output = usage.outputTokens
  const total = usage.totalTokens ?? input + output
  return {
    input: usageFigure(input),
    output: usageFigure(output),
    total: usageFigure(total),
    reasoning: usage.reasoningTokens === undefined ? absentFigure() : usageFigure(usage.reasoningTokens),
    cacheRead: cacheRead === undefined ? absentFigure() : usageFigure(cacheRead),
    cacheWrite: cacheWrite === undefined ? absentFigure() : usageFigure(cacheWrite),
  }
}

/**
 * Cache reads divided by billed input, truncated to two decimal percent points.
 * Unreported cache fields count as 0. A billed input that is not positive is absent.
 * Callers sum the attempts first; this does not average percents.
 */
export function cacheHitRate(usages: readonly TokenUsageScalars[]): Figure {
  if (usages.length === 0) return absentFigure()
  let read = 0
  let billed = 0
  for (const usage of usages) {
    const cacheRead = usage.cacheReadTokens ?? 0
    const cacheWrite = usage.cacheWriteTokens ?? 0
    read += cacheRead
    billed += usage.inputTokens + cacheRead + cacheWrite
  }
  if (billed <= 0) return absentFigure()
  const percent = Math.trunc((read / billed) * 10000) / 100
  return usageFigure(percent)
}

/** Sum reported calls. A call without `totalTokens` makes the sum fall back to input plus output. */
export function sumUsage(usages: readonly TokenUsageScalars[]): TokenUsageScalars | undefined {
  if (usages.length === 0) return undefined
  const sum: TokenUsageScalars = { inputTokens: 0, outputTokens: 0 }
  let total = 0
  let totalKnown = true
  let cacheRead = 0
  let cacheReadKnown = false
  let cacheWrite = 0
  let cacheWriteKnown = false
  let reasoning = 0
  let reasoningKnown = false
  for (const usage of usages) {
    sum.inputTokens += usage.inputTokens
    sum.outputTokens += usage.outputTokens
    if (usage.totalTokens === undefined) totalKnown = false
    else total += usage.totalTokens
    if (usage.cacheReadTokens !== undefined) {
      cacheRead += usage.cacheReadTokens
      cacheReadKnown = true
    }
    if (usage.cacheWriteTokens !== undefined) {
      cacheWrite += usage.cacheWriteTokens
      cacheWriteKnown = true
    }
    if (usage.reasoningTokens !== undefined) {
      reasoning += usage.reasoningTokens
      reasoningKnown = true
    }
  }
  if (cacheReadKnown) sum.cacheReadTokens = cacheRead
  if (cacheWriteKnown) sum.cacheWriteTokens = cacheWrite
  if (reasoningKnown) sum.reasoningTokens = reasoning
  if (totalKnown) sum.totalTokens = total
  return sum
}

/** Exact input minus the unscaled estimate. Both have to be present. Zero means they agree. */
export function estimateDelta(exactInput: Figure, estimated: Figure): { delta: Figure; consistent: boolean } | undefined {
  if (exactInput.basis !== 'usage' || exactInput.value === undefined) return undefined
  if (estimated.basis !== 'estimated' || estimated.value === undefined) return undefined
  const value = exactInput.value - estimated.value
  if (value === 0) return { delta: usageFigure(0), consistent: true }
  return { delta: usageFigure(value), consistent: false }
}

/** Sum the attempts stored on a session index. Child sessions are totaled on their own. */
export function sessionUsage(root: readonly { kind: string; items?: readonly unknown[] }[]): Figure {
  const usages: TokenUsageScalars[] = []
  for (const node of root) {
    if (node.kind !== 'turn' || !Array.isArray(node.items)) continue
    for (const item of node.items) {
      if (item === null || typeof item !== 'object' || (item as { kind?: unknown }).kind !== 'step') continue
      const attempts = (item as { attempts?: readonly { usage?: TokenUsageScalars }[] }).attempts ?? []
      for (const attempt of attempts) {
        if (attempt.usage !== undefined) usages.push(attempt.usage)
      }
    }
  }
  return billOf(sumUsage(usages)).total
}

/** `66.66` renders as `66.66%` without rounding up. */
export function formatHitPercent(value: number): string {
  const truncated = Math.trunc(value * 100) / 100
  const [whole, fraction = ''] = String(truncated).split('.')
  return `${whole}.${fraction.padEnd(2, '0')}%`
}
