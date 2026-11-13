/** Markdown subset for message bodies. Raw HTML stays text. */
import type { ReactNode } from 'react'
import Markdown, { RuleType, type MarkdownToJSX } from 'markdown-to-jsx/react'

type Node = MarkdownToJSX.ASTNode

export function MarkdownView({ text }: { text: string }): ReactNode {
  return (
    <Markdown
      options={{
        disableParsingRawHTML: true,
        ignoreHTMLBlocks: true,
        /* Markdown folds a single newline into a space. Reading a message means
           reading its lines, so a paragraph keeps one line per source line. */
        renderRule(next, node, renderChildren, state) {
          if (node.type === RuleType.paragraph && !state.inList && !state.inBlockQuote) {
            return paragraphs(node, renderChildren, state)
          }
          if (node.type === RuleType.text) return breakLines(node.text, state.key)
          return next()
        },
        overrides: {
          a: { component: Link },
          img: { component: ImageText },
        },
      }}
    >
      {text}
    </Markdown>
  )
}

/**
 * One paragraph of the source, split at its single newlines. Each line becomes
 * its own paragraph so the reading view shows the breaks; a first line carries
 * `data-line="first"` so CSS can space source blocks apart wider than lines.
 */
function paragraphs(
  node: MarkdownToJSX.ParagraphNode,
  renderChildren: MarkdownToJSX.ASTRender,
  state: MarkdownToJSX.State,
): ReactNode {
  const lines = splitLines(node.children) ?? [node.children]
  return lines.map((line, index) => (
    <p key={`${state.key ?? 'para'}:${index}`} data-line={index === 0 ? 'first' : undefined}>
      {renderChildren(line, state)}
    </p>
  ))
}

/** Split a paragraph's inline nodes at newlines. `undefined` means no break. */
function splitLines(children: readonly Node[]): Node[][] | undefined {
  const lines: Node[][] = [[]]
  let broken = false
  for (const child of children) {
    if (child.type !== RuleType.text) {
      lines[lines.length - 1].push(child)
      continue
    }
    const pieces = child.text.split('\n')
    if (pieces.length === 1) {
      lines[lines.length - 1].push(child)
      continue
    }
    broken = true
    pieces.forEach((piece, index) => {
      if (index > 0) lines.push([])
      if (piece.length > 0) lines[lines.length - 1].push({ ...child, text: piece })
    })
  }
  return broken ? lines.filter(line => line.length > 0) : undefined
}

/** Newlines outside a paragraph keep their own line as a bare break. */
function breakLines(text: string, key: string | number | undefined): ReactNode {
  if (!text.includes('\n')) return text
  const parts: ReactNode[] = []
  text.split('\n').forEach((line, index) => {
    if (index > 0) parts.push(<br key={`${key ?? 'text'}:break:${index}`} />)
    if (line.length > 0) parts.push(line)
  })
  return parts
}

function Link({ href, children }: { href?: string; children?: ReactNode }): ReactNode {
  return <a href={href} target="_blank" rel="noreferrer noopener">{children}</a>
}

/** Images are outside the supported subset, so the alt text stays words. */
function ImageText({ alt, children }: { alt?: string; children?: ReactNode }): ReactNode {
  return <span>{children ?? alt}</span>
}
