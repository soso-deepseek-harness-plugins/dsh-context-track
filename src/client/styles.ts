/**
 * Panel chrome. Status colors come from the host alias tokens. Category bars
 * and JSON tokens use the small palette below. The conversation tab
 * and the right sidebar own the surrounding frame. The centre page opened
 * from the left sidebar starts below the macOS window strip.
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
  /* palette */
  --dsh-cat-tools: light-dark(#c2410c, #fb923c);
  --dsh-cat-results: light-dark(#1d4ed8, #60a5fa);
  --dsh-cat-system: light-dark(#7e22ce, #c084fc);
  --dsh-cat-skill: light-dark(#15803d, #4ade80);
  --dsh-cat-history: light-dark(#a16207, #facc15);
  --dsh-cat-injection: light-dark(#92400e, #d6a06a);
  --dsh-cat-neutral: var(--dsw-alias-label-tertiary);
  --dsh-json-key: light-dark(#0451a5, #9cdcfe);
  --dsh-json-string: light-dark(#a31515, #ce9178);
  --dsh-json-number: light-dark(#098658, #b5cea8);
  --dsh-json-boolean: light-dark(#0000ff, #569cd6);
  /* /palette */
}
/* The centre column reaches the window edge when the left sidebar is collapsed. */
[data-platform='darwin'] .dsh-context-track-main {
  padding-top: var(--dsh-frame-top-clearance, 0px);
}
.dsh-context-track-tree,
.dsh-context-track-detail {
  box-sizing: border-box;
  flex: 1 1 16rem;
  min-width: 0;
  /* auto would keep each column as tall as its text, so overflow never starts. */
  min-height: 0;
  overflow: auto;
  /* A scrollbar popping in would otherwise shove the wrapped text sideways. */
  scrollbar-gutter: stable;
  padding: 0.75rem;
}
.dsh-context-track-detail {
  background: var(--dsw-alias-bg-base);
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
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4.75rem 8.5rem;
  align-items: center;
  column-gap: 0.5rem;
  min-width: 0;
  width: 100%;
  text-align: start;
  color: inherit;
}
.dsh-context-track-row[aria-current="true"] {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-cluster {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  min-width: 0;
}
.dsh-context-track-chevron {
  flex: 0 0 1rem;
  width: 1rem;
  text-align: center;
}
.dsh-context-track-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  overflow: hidden;
}
.dsh-context-track-label > span:first-child {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-status-ok { color: var(--dsw-alias-state-success-primary); }
.dsh-context-track-status-error,
.dsh-context-track-status-aborted { color: var(--dsw-alias-state-error-primary); }
.dsh-context-track-status-running { color: var(--dsw-alias-label-tertiary); }
.dsh-context-track-children {
  min-width: 0;
}
.dsh-context-track-card,
.dsh-context-track-block {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-block {
  margin: 0 0 0.7rem;
  padding: 0.7rem 0.8rem 0.6rem;
  border-radius: 0.55rem;
}
.dsh-context-track-block[data-category="system"] { border-inline-start: 3px solid var(--dsh-cat-system); }
.dsh-context-track-block[data-category="user"] { border-inline-start: 3px solid var(--dsw-alias-label-secondary); }
.dsh-context-track-block[data-category="injection"] { border-inline-start: 3px solid var(--dsh-cat-injection); }
.dsh-context-track-block[data-category="skill"] { border-inline-start: 3px solid var(--dsh-cat-skill); }
.dsh-context-track-block[data-category="tool-results"] { border-inline-start: 3px solid var(--dsh-cat-results); }
.dsh-context-track-block[data-category="history"] { border-inline-start: 3px solid var(--dsh-cat-history); }
.dsh-context-track-block h3,
.dsh-context-track-section {
  margin: 0 0 0.45rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.72rem;
  font-weight: 650;
}
.dsh-context-track [data-facts] {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
  gap: 0.85rem 1.35rem;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 0 0 0.75rem;
  padding: 0.8rem 0.95rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 0.55rem;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track [data-facts] [data-fact] {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.22rem;
  min-width: 0;
}
.dsh-context-track [data-facts] [data-fact="retry"] {
  grid-column: 1 / -1;
}
.dsh-context-track-fact-label {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  font-weight: 550;
  line-height: 1.3;
}
.dsh-context-track-fact-value {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  color: var(--dsw-alias-label-primary);
  font-size: 0.84rem;
  font-weight: 620;
  font-variant-numeric: tabular-nums;
  line-height: 1.35;
  overflow-wrap: anywhere;
}
.dsh-context-track-fact-note {
  padding: 0.02rem 0.38rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.65rem;
  font-weight: 550;
  line-height: 1.45;
}
.dsh-context-track [data-facts] [data-status="ok"] { color: var(--dsw-alias-state-success-primary); }
.dsh-context-track [data-facts] [data-status="error"],
.dsh-context-track [data-facts] [data-status="aborted"] { color: var(--dsw-alias-state-error-primary); }
.dsh-context-track [data-facts] [data-status="running"] { color: var(--dsw-alias-label-tertiary); }
.dsh-context-track-views {
  display: inline-flex;
  gap: 0.15rem;
  margin: 0 0 0.75rem;
  padding: 0.15rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-views button {
  padding: 0.12rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-pre {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: ui-monospace, monospace;
}
.dsh-context-track-rail {
  box-sizing: border-box;
  flex: 0 0 12rem;
  min-width: 7rem;
  min-height: 0;
  /* A horizontal scrollbar here is the round label escaping the column. */
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
}
/* One line glued the round, the clock, and the token total into "112.3 s46.4k". */
.dsh-context-track button.dsh-context-track-turn {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.15rem;
  width: 100%;
  min-width: 0;
  padding: 0.3rem 0.35rem;
  overflow: hidden;
  text-align: start;
}
.dsh-context-track-turn-line,
.dsh-context-track-turn-meta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}
.dsh-context-track-turn-line .dsh-context-track-dot {
  flex: 0 0 auto;
}
.dsh-context-track-turn-name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-turn-line > .dsh-context-track-status-running,
.dsh-context-track-turn-line > .dsh-context-track-status-error,
.dsh-context-track-turn-line > .dsh-context-track-status-aborted {
  flex: 0 0 auto;
  font-size: 0.75rem;
  white-space: nowrap;
}
.dsh-context-track-turn-meta {
  padding-inline-start: 0.85rem;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.75rem;
  white-space: nowrap;
}
.dsh-context-track-turn-meta .dsh-context-track-num + .dsh-context-track-num::before {
  content: "·";
  margin-inline-end: 0.35rem;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track button.dsh-context-track-turn[data-hover="true"] {
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track button.dsh-context-track-turn[aria-current="true"] {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track button.dsh-context-track-turn[data-pinned="true"] {
  box-shadow: inset 0.125rem 0 0 var(--dsw-alias-label-secondary);
}
.dsh-context-track button.dsh-context-track-mark {
  display: block;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  padding: 0.25rem 0.35rem;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-body {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.dsh-context-track-split {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.dsh-context-track-bill {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 0 1 22rem;
  gap: 0.35rem;
  min-width: 11rem;
  min-height: 0;
  overflow: auto;
  padding: 0.75rem;
}
/* The grip is the column edge. Dragging it sizes the previous pane; the next pane keeps what remains. */
.dsh-context-track-grip {
  box-sizing: border-box;
  flex: 0 0 0.45rem;
  align-self: stretch;
  position: relative;
  z-index: 1;
  cursor: col-resize;
  touch-action: none;
}
.dsh-context-track-grip::before {
  content: "";
  position: absolute;
  inset-block: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background: var(--dsw-alias-border-l2);
}
.dsh-context-track-grip:hover::before,
.dsh-context-track-grip:focus-visible::before,
.dsh-context-track-grip[data-active="true"]::before {
  width: 3px;
  background: var(--dsw-alias-label-tertiary);
}
.dsh-context-track-bill-figures {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.75rem;
  min-width: 0;
}
.dsh-context-track-num {
  font-family: ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-badge {
  color: var(--dsw-alias-label-secondary);
  font-size: 0.75rem;
}
.dsh-context-track-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: currentColor;
}
.dsh-context-track-cats {
  display: grid;
  /* Shared tracks: the tools caret sits after its label and cannot push that row alone. */
  grid-template-columns: max-content minmax(0, 1fr) max-content;
  column-gap: 0.5rem;
  row-gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: 0;
}
.dsh-context-track-cats > li {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: center;
  min-width: 0;
  row-gap: 0.25rem;
}
.dsh-context-track-cat-line {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: center;
  min-width: 0;
  min-height: 1.35rem;
  padding-block: 0.1rem;
  border-radius: 0.35rem;
}
.dsh-context-track-cat-line[data-fold="true"] {
  cursor: pointer;
}
.dsh-context-track-cat-line[data-fold="true"]:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-cat-name {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.28rem;
  min-width: 0;
}
.dsh-context-track-cat-name > span:first-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track button.dsh-context-track-cat-toggle {
  display: inline-grid;
  box-sizing: border-box;
  flex: 0 0 auto;
  place-items: center;
  width: 1.15rem;
  height: 1.15rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-cat-line[data-fold="true"]:hover button.dsh-context-track-cat-toggle,
.dsh-context-track-cats > li[data-open="true"] button.dsh-context-track-cat-toggle,
.dsh-context-track button.dsh-context-track-cat-toggle:focus-visible {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track button.dsh-context-track-cat-toggle:focus-visible {
  outline: 1px solid var(--dsw-alias-label-tertiary);
  outline-offset: 1px;
}
.dsh-context-track-cat-caret {
  width: 0.7rem;
  height: 0.7rem;
  transition: transform 160ms ease;
}
.dsh-context-track-cats > li[data-open="true"] .dsh-context-track-cat-caret {
  transform: rotate(90deg);
}
.dsh-context-track-cat-line > .dsh-context-track-num {
  justify-self: end;
}
.dsh-context-track-cat {
  display: block;
  height: 0.45rem;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-cat i {
  display: block;
  height: 100%;
}
.dsh-context-track-cats [data-hue="tools"] i { background: var(--dsh-cat-tools); }
.dsh-context-track-cats [data-hue="results"] i { background: var(--dsh-cat-results); }
.dsh-context-track-cats [data-hue="system"] i { background: var(--dsh-cat-system); }
.dsh-context-track-cats [data-hue="skill"] i { background: var(--dsh-cat-skill); }
.dsh-context-track-cats [data-hue="history"] i { background: var(--dsh-cat-history); }
.dsh-context-track-cats [data-hue="injection"] i { background: var(--dsh-cat-injection); }
.dsh-context-track-cats [data-hue="neutral"] i { background: var(--dsh-cat-neutral); }
.dsh-context-track-tools {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
  margin: 0.15rem 0 0.35rem;
}
.dsh-context-track-cats li > .dsh-context-track-tools {
  grid-column: 1 / -1;
  box-sizing: border-box;
  margin: 0.15rem 0 0.3rem 0.52rem;
  padding: 0.3rem 0 0.15rem 0.65rem;
  border-left: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-cats > li[data-open="true"] {
  row-gap: 0.35rem;
}
.dsh-context-track-tools-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}
.dsh-context-track-tools-head h3 {
  margin: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.72rem;
  font-weight: 650;
}
.dsh-context-track-tools-count {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-tools-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}
.dsh-context-track-tools-bar input {
  flex: 1 1 6.5rem;
  min-width: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 0.22rem 0.55rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 0.75rem;
}
.dsh-context-track-tools-bar input::placeholder {
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track-tools-bar input:focus {
  outline: 1px solid var(--dsw-alias-label-tertiary);
  outline-offset: 1px;
}
.dsh-context-track-tools-sort {
  display: inline-flex;
  flex: 0 0 auto;
  padding: 0.1rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-tools-sort button {
  padding: 0.08rem 0.45rem;
  border-radius: 999px;
  font-size: 0.72rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-tools-sort button[aria-pressed="true"] {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-tool-chart {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.dsh-context-track-tool-chart li {
  display: grid;
  grid-template-columns: minmax(4.25rem, 7rem) minmax(2rem, 1fr) auto;
  gap: 0.4rem;
  align-items: center;
  min-width: 0;
}
.dsh-context-track-tool-name {
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-size: 0.75rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-tool-calls {
  margin-left: 0.3rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
}
.dsh-context-track-tool-meter {
  display: block;
  height: 0.42rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-tool-meter i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--dsh-cat-tools);
}
.dsh-context-track-tools[data-hue="injection"] .dsh-context-track-tool-meter i { background: var(--dsh-cat-injection); }
.dsh-context-track-tools[data-hue="skill"] .dsh-context-track-tool-meter i { background: var(--dsh-cat-skill); }
.dsh-context-track-tools button[data-remaining] {
  align-self: flex-start;
  padding: 0.08rem 0.45rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  font-size: 0.72rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-tools button[data-remaining]:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-tools-overhead {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.75rem;
}
.dsh-context-track button.dsh-context-track-gap {
  background: transparent;
  border: 1px dashed var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-output-meta {
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  margin-bottom: 0.35rem;
}
.dsh-context-track-output-meta h3 {
  margin: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.72rem;
  font-weight: 650;
}
.dsh-context-track-output-meta .dsh-context-track-num {
  font-size: 0.75rem;
}
.dsh-context-track-output-tokens {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.75rem;
}
.dsh-context-track-output-call {
  margin-top: 0.7rem;
  padding-top: 0.55rem;
  border-top: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-output-call-name {
  margin: 0 0 0.25rem;
  font-size: 0.78rem;
  font-weight: 650;
}
.dsh-context-track-output-call [data-json-view] {
  margin: 0;
}
.dsh-context-track-detail .dsh-context-track-output-meta button[data-open-json] {
  margin: 0 0 0 auto;
}
.dsh-context-track-reasoning {
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track-views button[aria-pressed="true"] {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-detail button[data-more],
.dsh-context-track-detail button[data-open-json] {
  margin-top: 0.45rem;
  margin-inline-end: 0.35rem;
  padding: 0.1rem 0.5rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-detail button[data-more]:hover,
.dsh-context-track-detail button[data-open-json]:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-meta {
  display: block;
  margin: 0 0 0.55rem;
  padding-bottom: 0.45rem;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-meta tbody {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.2rem 0.9rem;
}
.dsh-context-track-meta tr {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}
.dsh-context-track-meta th,
.dsh-context-track-meta td {
  padding: 0;
  text-align: start;
  vertical-align: baseline;
}
.dsh-context-track-meta th {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  font-weight: 550;
}
.dsh-context-track-meta td {
  font-size: 0.8rem;
}
.dsh-context-track-prose {
  line-height: 1.6;
  font-size: 0.875rem;
}
.dsh-context-track-prose :is(h1, h2, h3, h4, p, ul, ol, blockquote, pre) {
  margin: 0.4rem 0;
}
.dsh-context-track-prose :is(h1, h2, h3, h4) {
  color: var(--dsw-alias-label-primary);
  font-size: 1rem;
  font-weight: 650;
  line-height: 1.35;
}
.dsh-context-track-prose :is(ul, ol) {
  padding-inline-start: 1.15rem;
}
.dsh-context-track-prose li + li {
  margin-top: 0.2rem;
}
.dsh-context-track-prose blockquote {
  padding-inline-start: 0.7rem;
  border-inline-start: 2px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-prose pre {
  padding: 0.45rem 0.6rem;
  overflow-x: auto;
  border-radius: 0.35rem;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-prose :not(pre) > code {
  padding: 0.05rem 0.28rem;
  border-radius: 0.2rem;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-prose :is(pre, code) {
  font-family: ui-monospace, monospace;
  font-size: 0.82em;
}
.dsh-context-track-prose a {
  color: var(--dsw-alias-label-primary);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.dsh-context-track-json-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0 0 0.65rem;
  padding: 0.25rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-json-tools button {
  padding: 0.18rem 0.7rem;
  border: 0;
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-json-tools button:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-json-tools button[data-copy-json] {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-json-bulk {
  display: inline-flex;
  gap: 0.1rem;
  padding: 0.1rem;
  border-radius: 999px;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-json-source {
  font-family: ui-monospace, monospace;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.dsh-context-track-json-line {
  display: block;
}
.dsh-context-track-json-nest {
  padding-inline-start: 2ch;
}
.dsh-context-track-json-string[data-truncated="true"] {
  display: inline-block;
  max-width: 24rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
.dsh-context-track-json-key { color: var(--dsh-json-key); }
.dsh-context-track-json-string { color: var(--dsh-json-string); }
.dsh-context-track-json-number { color: var(--dsh-json-number); }
.dsh-context-track-json-boolean { color: var(--dsh-json-boolean); }
.dsh-context-track-json-null { color: var(--dsh-json-boolean); font-style: italic; }
.dsh-context-track-mark {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.75rem;
}
.dsh-context-track[data-layout="narrow"] {
  flex-direction: column;
}
.dsh-context-track[data-layout="narrow"] .dsh-context-track-rail {
  flex: 0 0 auto;
  flex-direction: row;
  min-width: 0;
  min-height: 2.5rem;
  overflow-x: auto;
  overflow-y: hidden;
}
.dsh-context-track[data-layout="narrow"] button.dsh-context-track-turn {
  flex: 0 0 auto;
  width: auto;
  max-width: 12rem;
}
.dsh-context-track[data-layout="narrow"] .dsh-context-track-grip {
  cursor: row-resize;
}
.dsh-context-track[data-layout="narrow"] .dsh-context-track-grip::before {
  inset-block: auto;
  inset-inline: 0;
  top: 50%;
  left: 0;
  width: auto;
  height: 1px;
  transform: translateY(-50%);
}
.dsh-context-track[data-layout="narrow"] .dsh-context-track-grip:hover::before,
.dsh-context-track[data-layout="narrow"] .dsh-context-track-grip:focus-visible::before,
.dsh-context-track[data-layout="narrow"] .dsh-context-track-grip[data-active="true"]::before {
  width: auto;
  height: 3px;
}
.dsh-context-track[data-layout="narrow"] .dsh-context-track-body {
  flex-direction: column;
  overflow: auto;
  /* Narrow mode scrolls one shared column; a taller view must not shift it sideways. */
  scrollbar-gutter: stable;
}
.dsh-context-track[data-layout="narrow"] .dsh-context-track-split {
  flex: 0 0 auto;
  flex-direction: column;
  overflow: visible;
}
.dsh-context-track[data-layout="narrow"] .dsh-context-track-bill {
  flex: 0 0 auto;
  overflow: visible;
  max-height: none;
  min-width: 0;
  padding: 0.35rem 0.5rem;
}
.dsh-context-track[data-layout="narrow"] .dsh-context-track-tree,
.dsh-context-track[data-layout="narrow"] .dsh-context-track-detail {
  flex: 0 0 auto;
  overflow: visible;
}
.dsh-context-track-detail {
  display: flex;
  flex-direction: column;
  /* Collapsing flips flex-grow and flex-basis; transitioning both turns the jump into a slide. */
  transition: flex-grow 180ms ease, flex-basis 180ms ease, padding 180ms ease;
}
.dsh-context-track-detail-body {
  min-width: 0;
  min-height: 0;
}
/* A fresh pane fades in instead of popping, so a swap never reads as a flicker. */
.dsh-context-track-detail-body:not([hidden]),
.dsh-context-track-detail [data-view-pane]:not([hidden]) {
  animation: dsh-context-track-pane-in 150ms ease-out;
}
@keyframes dsh-context-track-pane-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-context-track-detail {
    transition: none;
  }
  .dsh-context-track-detail-body:not([hidden]),
  .dsh-context-track-detail [data-view-pane]:not([hidden]) {
    animation: none;
  }
  .dsh-context-track-cat-caret {
    transition: none;
  }
}
.dsh-context-track-detail-toggle {
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin: 0 0 0.45rem;
  padding: 0.12rem 0.5rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-detail-toggle:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-detail[data-collapsed="true"] {
  flex: 0 0 2.4rem;
  align-items: center;
  padding: 0.45rem 0.2rem;
  overflow: hidden;
}
.dsh-context-track-detail[data-collapsed="true"] .dsh-context-track-detail-toggle {
  align-self: center;
  writing-mode: vertical-rl;
  margin: 0;
  padding: 0.55rem 0.15rem;
}
.dsh-context-track-lines {
  margin: 0.25rem 0 0;
  padding: 0;
  list-style: none;
}
.dsh-context-track-facts {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.25rem 0.75rem;
  margin: 0;
}
.dsh-context-track-facts dt {
  color: var(--dsw-alias-label-secondary);
}
/*
 * Conversation tab: the chat composer is a sticky sibling of this full-height
 * pane and paints over it. Hide that seat while the pane is mounted, and leave
 * it when it is holding an approval, a
 * question, or a plan review. Width handles are following siblings of the
 * scroller, so a descendant combinator would match nothing.
 */
[data-conversation-scroll]:has(.dsh-context-track) > [data-composer-seat]:not(:has([data-approval-key], [data-question-key], [data-plan-review-key])) {
  display: none;
}
[data-conversation-scroll]:has(.dsh-context-track) ~ [data-width-handle] {
  display: none;
}
`

let installed = false

/** Inject the panel stylesheet once. A later bundle replaces the text in place. */
export function ensureStyles(): void {
  if (installed || typeof document === 'undefined') return
  const current = document.querySelector('style[data-dsh-context-track]')
  if (current !== null) {
    if (current.textContent !== traceCss) current.textContent = traceCss
    installed = true
    return
  }
  const style = document.createElement('style')
  style.dataset.dshContextTrack = ''
  style.textContent = traceCss
  document.head.appendChild(style)
  installed = true
}
