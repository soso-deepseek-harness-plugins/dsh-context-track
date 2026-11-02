/** A tiny JSON scanner. Invalid JSON stays plain text; no highlighter dependency. */

export type JsonKind = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'plain'

export interface JsonPiece {
  kind: JsonKind
  text: string
}

export type HighlightedJson =
  | { ok: true; pieces: JsonPiece[] }
  | { ok: false; text: string }

export function highlightJson(text: string): HighlightedJson {
  try {
    JSON.parse(text)
  } catch {
    return { ok: false, text }
  }
  const pieces = tokenize(text)
  return pieces === undefined ? { ok: false, text } : { ok: true, pieces }
}

function tokenize(text: string): JsonPiece[] | undefined {
  const pieces: JsonPiece[] = []
  const stack: Array<'object' | 'array'> = []
  let expect: 'value' | 'key' | 'colon' | 'comma' = 'value'
  let index = 0
  const push = (kind: JsonKind, value: string) => {
    const last = pieces.at(-1)
    if (last !== undefined && last.kind === kind) last.text += value
    else pieces.push({ kind, text: value })
  }
  while (index < text.length) {
    const char = text[index] ?? ''
    if (char === ' ' || char === '\n' || char === '\r' || char === '\t') {
      push('plain', char)
      index += 1
      continue
    }
    if (char === '"') {
      const end = readString(text, index)
      if (end === undefined) return undefined
      const value = text.slice(index, end)
      push(expect === 'key' ? 'key' : 'string', value)
      expect = expect === 'key' ? 'colon' : 'comma'
      index = end
      continue
    }
    if (char === '-' || (char >= '0' && char <= '9')) {
      const end = readNumber(text, index)
      if (end === undefined) return undefined
      push('number', text.slice(index, end))
      expect = 'comma'
      index = end
      continue
    }
    if (text.startsWith('true', index) || text.startsWith('false', index)) {
      const word = text.startsWith('true', index) ? 'true' : 'false'
      push('boolean', word)
      expect = 'comma'
      index += word.length
      continue
    }
    if (text.startsWith('null', index)) {
      push('null', 'null')
      expect = 'comma'
      index += 4
      continue
    }
    if (char === '{' || char === '[') {
      push('plain', char)
      stack.push(char === '{' ? 'object' : 'array')
      expect = char === '{' ? 'key' : 'value'
      index += 1
      continue
    }
    if (char === '}' || char === ']') {
      push('plain', char)
      stack.pop()
      expect = 'comma'
      index += 1
      continue
    }
    if (char === ':') {
      push('plain', char)
      expect = 'value'
      index += 1
      continue
    }
    if (char === ',') {
      push('plain', char)
      expect = stack.at(-1) === 'object' ? 'key' : 'value'
      index += 1
      continue
    }
    return undefined
  }
  return pieces
}

function readString(text: string, start: number): number | undefined {
  let index = start + 1
  while (index < text.length) {
    const char = text[index]
    if (char === '\\') {
      index += 2
      continue
    }
    if (char === '"') return index + 1
    index += 1
  }
  return undefined
}

function readNumber(text: string, start: number): number | undefined {
  const match = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(text.slice(start))
  if (match === null) return undefined
  return start + match[0].length
}
