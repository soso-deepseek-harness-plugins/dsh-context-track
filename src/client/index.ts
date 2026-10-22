/**
 * One web client for browser Harness and the Desktop Electron shell.
 * The entries match dsh-context: a conversation tab, a right-sidebar guide
 * page, and a left-sidebar panel row that opens the same panel in the centre.
 */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-gateway/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import { TraceIcon, TraceTabTitle } from './Icon.js'
import { en, NS, zh } from './locales.js'
import { trackRemote } from './remote.js'
import './slots.js'
import { TraceMain, TracePage, type TrackInject } from './TracePage.js'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Context-trace panel copy. */
    'dsh-context-track': keyof typeof zh
  }
}

/** Conversation tab id. Sits after dsh-context's `context` tab (order 20). */
export const VIEW_ID = 'context-track'

/** Right-sidebar type id and kind. A bare name could collide with another plugin. */
export const TAB_ID = 'dsh-context-track'

/**
 * Left-sidebar row and the centre panel it opens.
 * Sits after Plugins (0), Automation tasks (10), and dsh-context's insights row (20).
 */
export const PANEL_ID = 'dsh-context-track'

/**
 * Cordis services this plugin waits for before `apply`.
 * `remote.track` is not in this list: nothing else mounts it, so waiting here
 * would leave the plugin pending. `apply` mounts it, then a child context
 * injects it. Cordis only allows reading a service from a context that injects it.
 * `sidebarRightTabs` is also deferred: the conversation tab still registers
 * when a host has no right sidebar.
 */
export const inject = ['slots', 'locale', 'remote']

/**
 * Register the three entries. They share one panel and one remote.
 * @param ctx - browser plugin context.
 */
export async function apply(ctx: Context): Promise<void> {
  await ctx.remote.$mount(trackRemote)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-context-track: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.inject(['remote.track'], (trackCtx) => {
    const getNode = (sessionId: string, nodeId: string) => trackCtx.remote.track.getNode(sessionId, nodeId)
    trackCtx.slots.inject('conversation.view', () => trackCtx.slots.register({
      name: 'conversation.view',
      id: VIEW_ID,
      order: 30,
      locale: NS,
      label: () => t('panel'),
      inject: (): TrackInject => ({ getNode }),
    }, TracePage))
    trackCtx.inject(['sidebarRightTabs'], (sideCtx) => {
      sideCtx.effect(() => sideCtx.sidebarRightTabs.register({
        id: TAB_ID,
        kind: TAB_ID,
        title: () => t('panel'),
        guide: [{
          id: VIEW_ID,
          order: 30,
          title: () => t('panel'),
          description: () => t('guide'),
          icon: TraceIcon,
        }],
      }), 'dsh-context-track: sidebar type')
      sideCtx.slots.inject('sidebar.right.pane.tab', () => sideCtx.slots.register({
        name: 'sidebar.right.pane.tab',
        key: TAB_ID,
        locale: NS,
        inject: (): TrackInject => ({ getNode }),
      }, TracePage))
      sideCtx.slots.inject('sidebar.right.pane.tab.title', () => sideCtx.slots.register({
        name: 'sidebar.right.pane.tab.title',
        key: TAB_ID,
        locale: NS,
      }, TraceTabTitle))
    })
    // The row and the centre page share one id. `slots.inject` waits until the
    // shell declares each seat, so a host without the left sidebar still mounts
    // the conversation tab and the right-sidebar page.
    trackCtx.slots.inject('sidebar.panellist', () => trackCtx.slots.register({
      name: 'sidebar.panellist',
      id: PANEL_ID,
      order: 30,
      locale: NS,
      label: () => t('panel'),
    }, TraceIcon))
    trackCtx.slots.inject('main', () => trackCtx.slots.register({
      name: 'main',
      key: PANEL_ID,
      locale: NS,
      inject: (): TrackInject => ({ getNode }),
    }, TraceMain))
  })
}
