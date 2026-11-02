/**
 * Seats this plugin registers: a conversation tab, a right-sidebar page, and a
 * left-sidebar panel row. The host packages own the
 * runtime slots. These rows exist so this package can type its registrations
 * without pulling those type graphs.
 */
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    /** Session tab beside Chat. */
    'conversation.view': {
      kind: 'list'
      scope: 'session'
    }
    /** Body of one right-sidebar tab, keyed by the tab type id. */
    'sidebar.right.pane.tab': {
      kind: 'keyed'
      scope: 'session'
    }
    /** Chip title for that tab. */
    'sidebar.right.pane.tab.title': {
      kind: 'keyed'
      scope: 'session'
    }
    /**
     * Icon for one row in the left sidebar's panel list, under New Session.
     * The row id is the main panel it opens. The sidebar owns the button.
     */
    'sidebar.panellist': {
      kind: 'list'
      scope: 'root'
      owner: {
        /** Requested square edge in pixels. */
        size: number
        /** Whether this panel is selected in the centre column. */
        active: boolean
      }
    }
    /**
     * Centre column selected by a left-sidebar panel row. The reserved
     * `conversation` key is the chat; other keys get the session list, not a
     * session binding.
     */
    'main': {
      kind: 'keyed'
      scope: 'root'
    }
  }
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /**
     * Right-sidebar tab registry. Optional at startup: register through
     * `inject(['sidebarRightTabs'])` so a host without it does not pend.
     */
    sidebarRightTabs: {
      register(definition: {
        id: string
        kind: string
        title: (address: string) => string
        guide?: readonly {
          id: string
          order: number
          title: () => string
          description?: () => string
          icon?: import('react').ComponentType<{ size?: number; className?: string }>
        }[]
      }): () => void
    }
  }
}

export {}
