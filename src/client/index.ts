/**
 * One web client for browser Harness and the Desktop Electron shell.
 * The sidebar entry and the main panel share the `trace` id.
 */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-gateway/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from './remote.js'
import { TraceIcon } from './Icon.js'
import { en, NS, zh, type TrackKey } from './locales.js'
import { TracePage, type TrackInject } from './TracePage.js'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Trace panel copy. */
    'dsh-track': TrackKey
  }
}

/** Sidebar row and main panel key. */
export const PANEL_ID = 'trace' as MainPanelId

/** Cordis services. `remote.track` is the host detail method. */
export const inject = ['slots', 'locale', 'layout', 'remote', 'remote.track']

/**
 * Register the Trace entry and the panel it opens. Both are registered once.
 * @param ctx - browser plugin context.
 */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-track: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main',
    key: PANEL_ID,
    locale: NS,
    inject: (): TrackInject => ({
      getNode: (sessionId, nodeId) => ctx.remote.track.getNode(sessionId, nodeId),
    }),
  }, TracePage))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist',
    id: PANEL_ID,
    order: 30,
    label: () => t('panel'),
    locale: NS,
  }, TraceIcon))
}
