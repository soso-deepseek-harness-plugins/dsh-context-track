/**
 * One web client for the browser host and the Desktop Electron shell.
 * Entries: a conversation tab, a right-sidebar guide page, and a left-sidebar
 * panel row that opens the same panel in the centre.
 */
import type { Context } from '@deepseek-ai/cordis';
import { zh } from './locales.js';
import './slots.js';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Context-trace panel copy. */
        'dsh-context-track': keyof typeof zh;
    }
}
/** Conversation tab id. Registered at order 30, after the tab at order 20. */
export declare const VIEW_ID = "context-track";
/** Right-sidebar type id and kind. A bare name could collide with another plugin. */
export declare const TAB_ID = "dsh-context-track";
/**
 * Left-sidebar row and the centre panel it opens.
 * Order 30, after the rows at 0, 10, and 20.
 */
export declare const PANEL_ID = "dsh-context-track";
/**
 * Cordis services this plugin waits for before `apply`.
 * `remote.track` is not in this list: nothing else mounts it, so waiting here
 * would leave the plugin pending. `apply` mounts it, then a child context
 * injects it. Cordis only allows reading a service from a context that injects it.
 * `sidebarRightTabs` is also deferred: the conversation tab still registers
 * when a host has no right sidebar.
 */
export declare const inject: string[];
/**
 * Register the three entries. They share one panel and one remote.
 * @param ctx - browser plugin context.
 */
export declare function apply(ctx: Context): Promise<void>;
//# sourceMappingURL=index.d.ts.map