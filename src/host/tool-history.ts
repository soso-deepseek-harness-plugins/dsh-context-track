/**
 * `ToolHistoryProjection` ships inside `@deepseek-ai/dsh-session` but is not a
 * public export. Load the compiled file that the package already publishes
 * next to its declarations, so an installed bundle does not depend on this checkout.
 */
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { SessionEvent } from '@deepseek-ai/dsh-session'

export interface ToolHistoryFold {
  apply(event: SessionEvent): void
  snapshot(): unknown
}

const require = createRequire(import.meta.url)
const sessionRoot = dirname(require.resolve('@deepseek-ai/dsh-session/package.json'))
const href = pathToFileURL(join(sessionRoot, 'lib/types/tool-history.js')).href
const loaded = await import(href) as { ToolHistoryProjection: new () => ToolHistoryFold }

export const ToolHistoryProjection = loaded.ToolHistoryProjection
