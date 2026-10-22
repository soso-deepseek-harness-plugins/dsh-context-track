/**
 * Seats this plugin registers, matching dsh-context: a conversation tab and a
 * right-sidebar page. The host packages own the runtime slots. These rows exist
 * so this package can type its registrations without pulling those type graphs.
 */
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    /** Session tab beside Chat, beside dsh-context's 上下文 tab. */
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
