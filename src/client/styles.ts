/**
 * Panel chrome. Colors come from the host alias tokens. The conversation tab
 * and the right sidebar own the surrounding frame, so this panel does not add
 * window-control clearance of its own.
 */
export const traceCss = `
.dsh-context-track {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;
  min-width: 0;
  /* The centre column clips overflow. A content-sized panel is cut off and cannot scroll. */
  min-height: 0;
  height: 100%;
  overflow: hidden;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
}
.dsh-context-track-tree,
.dsh-context-track-detail {
  box-sizing: border-box;
  flex: 1 1 16rem;
  min-width: 0;
  /* auto would keep each column as tall as its text, so overflow never starts. */
  min-height: 0;
  overflow: auto;
  padding: 0.75rem;
}
.dsh-context-track-detail {
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-empty,
.dsh-context-track-muted {
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track button {
  margin: 0;
  padding: 0;
  font: inherit;
  /* Author color: the user-agent button color is canvas black and disappears on the dark panel. */
  color: var(--dsw-alias-label-primary);
  background: transparent;
  border: 0;
  cursor: pointer;
}
.dsh-context-track-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  width: 100%;
  text-align: start;
  color: inherit;
}
.dsh-context-track-row[aria-current="true"] {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-status-ok { color: var(--dsw-alias-state-success-primary); }
.dsh-context-track-status-error,
.dsh-context-track-status-aborted { color: var(--dsw-alias-state-error-primary); }
.dsh-context-track-status-running { color: var(--dsw-alias-label-tertiary); }
.dsh-context-track-children {
  margin-inline-start: 0.75rem;
  border-inline-start: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-block {
  margin: 0 0 0.75rem;
}
.dsh-context-track-block h3 {
  margin: 0 0 0.25rem;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.75rem;
  font-weight: 600;
}
.dsh-context-track-pre {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: inherit;
}
`

let installed = false

/** Inject the panel stylesheet once. Safe to call during render. */
export function ensureStyles(): void {
  if (installed || typeof document === 'undefined') return
  if (document.querySelector('style[data-dsh-context-track]') !== null) {
    installed = true
    return
  }
  const style = document.createElement('style')
  style.dataset.dshContextTrack = ''
  style.textContent = traceCss
  document.head.appendChild(style)
  installed = true
}
