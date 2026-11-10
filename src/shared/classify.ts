/**
 * Split one model window into token buckets.
 * Tool results are grouped by name. Their call count is the number of result messages.
 */
import { estimateMessage, estimateTools, isNonEmptySystem, type PricedTool } from './estimate.js'

export type CategoryId =
  | 'system'
  | 'user'
  | 'tools'
  | 'tool-results'
  | 'injection'
  | 'skill'
  | 'history'

export interface ClassifiedItem {
  category: CategoryId
  tokens: number
  role?: string
  toolName?: string
  message: unknown
}

export interface ToolResultLine {
  name: string
  tokens: number
  calls: number
}

export interface ClassifiedWindow {
  items: ClassifiedItem[]
  totals: Record<CategoryId, number>
  tools: PricedTool[]
  definitionOverhead?: number
  toolResults: ToolResultLine[]
  injections: ToolResultLine[]
  skills: ToolResultLine[]
  estimatedTotal: number
}

const EMPTY_TOTALS = (): Record<CategoryId, number> => ({
  system: 0,
  user: 0,
  tools: 0,
  'tool-results': 0,
  injection: 0,
  skill: 0,
  history: 0,
})

/** Classify the messages and tool schemas one attempt actually saw. */
export function classifyWindow(messages: readonly unknown[], tools: unknown): ClassifiedWindow {
  const list = Array.isArray(messages) ? messages : []
  let systemIndex = -1
  for (let index = list.length - 1; index >= 0; index -= 1) {
    if (isNonEmptySystem(list[index])) {
      systemIndex = index
      break
    }
  }
  const names = toolNames(list)
  const totals = EMPTY_TOTALS()
  const items: ClassifiedItem[] = []
  const resultMap = new Map<string, ToolResultLine>()
  const injectionMap = new Map<string, ToolResultLine>()
  const skillMap = new Map<string, ToolResultLine>()
  list.forEach((message, index) => {
    const category = categoryOf(message, index === systemIndex)
    if (category === undefined) return
    const system = category === 'system'
    const tokens = estimateMessage(message, system)
    const toolName = category === 'tool-results' || category === 'skill' ? resultName(message, names) : undefined
    if (category === 'tool-results' && toolName !== undefined) {
      const line = resultMap.get(toolName) ?? { name: toolName, tokens: 0, calls: 0 }
      line.tokens += tokens
      line.calls += 1
      resultMap.set(toolName, line)
    }
    if (category === 'injection' || category === 'skill') {
      const map = category === 'skill' ? skillMap : injectionMap
      const name = sourceLabel(message)
      const line = map.get(name) ?? { name, tokens: 0, calls: 0 }
      line.tokens += tokens
      line.calls += 1
      map.set(name, line)
    }
    totals[category] += tokens
    items.push({
      category,
      tokens,
      ...(roleOf(message) !== undefined ? { role: roleOf(message) } : {}),
      ...(toolName !== undefined ? { toolName } : {}),
      message,
    })
  })
  const priced = estimateTools(tools)
  totals.tools = priced.table
  const estimatedTotal = Object.values(totals).reduce((sum, value) => sum + value, 0)
  return {
    items,
    totals,
    tools: priced.tools,
    ...(priced.overhead !== undefined ? { definitionOverhead: priced.overhead } : {}),
    toolResults: [...resultMap.values()],
    injections: [...injectionMap.values()],
    skills: [...skillMap.values()],
    estimatedTotal,
  }
}

function categoryOf(message: unknown, isSystemPrompt: boolean): CategoryId | undefined {
  if (message === null || typeof message !== 'object') return undefined
  if (isSystemPrompt) return 'system'
  if (isSkillMessage(message)) return 'skill'
  const role = roleOf(message)
  if (role === 'tool') return 'tool-results'
  if (isInjection(message)) return 'injection'
  if (role === 'assistant') return 'history'
  if (role === 'user' || role === 'developer') return 'user'
  return undefined
}

function isSkillMessage(message: unknown): boolean {
  const kind = sourceKind(message)
  if (kind === 'skill-invocation' || kind === 'skill-catalog') return true
  if (roleOf(message) !== 'tool') return false
  return toolText(message).includes('<skill_content>')
}

function isInjection(message: unknown): boolean {
  const source = sourceOf(message)
  if (source === undefined) return false
  const kind = typeof source.kind === 'string' ? source.kind : undefined
  if (kind === 'user' || kind === 'model' || kind === 'tool' || kind === 'system-prompt') return false
  if (kind === 'skill-invocation' || kind === 'skill-catalog') return false
  return kind !== undefined || source.form !== undefined
}

function resultName(message: unknown, names: ReadonlyMap<string, string>): string | undefined {
  const callId = toolCallId(message)
  if (callId !== undefined && names.has(callId)) return names.get(callId)
  return 'tool'
}

function toolNames(messages: readonly unknown[]): Map<string, string> {
  const names = new Map<string, string>()
  for (const message of messages) {
    for (const block of contentBlocks(message)) {
      if (block.type !== 'tool-call') continue
      if (typeof block.id !== 'string' || typeof block.name !== 'string' || block.name.length === 0) continue
      names.set(block.id, block.name)
    }
  }
  return names
}

function contentBlocks(message: unknown): readonly Record<string, unknown>[] {
  if (message === null || typeof message !== 'object') return []
  const content = (message as { content?: unknown }).content
  if (!Array.isArray(content)) return []
  return content.filter((block): block is Record<string, unknown> => block !== null && typeof block === 'object')
}

function toolText(message: unknown): string {
  return contentBlocks(message)
    .map(block => (typeof block.text === 'string' ? block.text : ''))
    .join('')
}

function roleOf(message: unknown): string | undefined {
  if (message === null || typeof message !== 'object') return undefined
  const role = (message as { role?: unknown }).role
  return typeof role === 'string' ? role : undefined
}

function sourceOf(message: unknown): Record<string, unknown> | undefined {
  if (message === null || typeof message !== 'object') return undefined
  const source = (message as { source?: unknown }).source
  return source !== null && typeof source === 'object' ? source as Record<string, unknown> : undefined
}

function sourceKind(message: unknown): string | undefined {
  const kind = sourceOf(message)?.kind
  return typeof kind === 'string' ? kind : undefined
}

function toolCallId(message: unknown): string | undefined {
  if (message === null || typeof message !== 'object') return undefined
  const direct = (message as { toolCallId?: unknown }).toolCallId
  if (typeof direct === 'string' && direct.length > 0) return direct
  const nested = sourceOf(message)?.callId
  return typeof nested === 'string' && nested.length > 0 ? nested : undefined
}

/** A short source label for an injection or skill row. Bodies stay out of the label. */
export function sourceLabel(message: unknown): string {
  const source = sourceOf(message)
  if (source === undefined) return 'injection'
  for (const key of ['path', 'file', 'filename', 'name', 'label', 'uri', 'skill']) {
    const value = source[key]
    if (typeof value === 'string' && value.length > 0) return value
  }
  return typeof source.kind === 'string' ? source.kind : 'injection'
}
