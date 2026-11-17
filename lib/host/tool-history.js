/**
 * `ToolHistoryProjection` ships inside the session package but is not a
 * public export. Load the compiled file that the package already publishes
 * next to its declarations, so an installed bundle does not depend on this checkout.
 */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
const sessionRoot = dirname(require.resolve('@deepseek-ai/dsh-session/package.json'));
const href = pathToFileURL(join(sessionRoot, 'lib/types/tool-history.js')).href;
const loaded = await import(href);
export const ToolHistoryProjection = loaded.ToolHistoryProjection;
//# sourceMappingURL=tool-history.js.map