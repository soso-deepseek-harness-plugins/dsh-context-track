/** Markdown subset for message bodies. Raw HTML stays text. */
import type { ReactNode } from 'react'
import Markdown from 'markdown-to-jsx/react'

export function MarkdownView({ text }: { text: string }): ReactNode {
  return (
    <Markdown
      options={{
        disableParsingRawHTML: true,
        ignoreHTMLBlocks: true,
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

function Link({ href, children }: { href?: string; children?: ReactNode }): ReactNode {
  return <a href={href} target="_blank" rel="noreferrer noopener">{children}</a>
}

/** Images are outside the supported subset, so the alt text stays words. */
function ImageText({ alt, children }: { alt?: string; children?: ReactNode }): ReactNode {
  return <span>{children ?? alt}</span>
}
