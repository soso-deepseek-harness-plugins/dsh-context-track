/**
 * Panel chrome. Status colors come from the host alias tokens. Category bars
 * and JSON tokens use the small palette below. The shell is a header, a
 * horizontal round strip, a collapsible context band, and a tree beside a
 * detail pane. Narrow panels keep the tree full width and slide the detail over it.
 */
export const traceCss = `
.dsh-context-track {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
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
  /* hit rate reads high-good, so the tones are their own scale, not category hues */
  --dsh-hit-high: light-dark(#15803d, #4ade80);
  --dsh-hit-mid: light-dark(#a16207, #facc15);
  --dsh-hit-low: light-dark(#b91c1c, #f87171);
  /* The timing bar is its own scale: wait, think, and the remainder. */
  --dsh-time-wait: light-dark(#a16207, #facc15);
  --dsh-time-think: light-dark(#7e22ce, #c084fc);
  --dsh-time-rest: color-mix(in srgb, var(--dsw-alias-label-tertiary) 45%, transparent);
  --dsh-json-key: light-dark(#0451a5, #9cdcfe);
  --dsh-json-string: light-dark(#a31515, #ce9178);
  --dsh-json-number: light-dark(#098658, #b5cea8);
  --dsh-json-boolean: light-dark(#0000ff, #569cd6);
  --dsh-tree-bar: 2rem;
  /* /palette */
}
/* The centre column reaches the window edge when the left sidebar is collapsed. */
[data-platform='darwin'] .dsh-context-track-main {
  padding-top: var(--dsh-frame-top-clearance, 0px);
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
.dsh-context-track button:focus-visible,
.dsh-context-track [role="separator"]:focus-visible {
  outline: 2px solid var(--dsw-alias-label-tertiary);
  outline-offset: 1px;
}
.dsh-context-track-num {
  font-family: ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}

/* ---------- header ---------- */
.dsh-context-track-head {
  box-sizing: border-box;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2.5rem;
  padding: 0.25rem 0.75rem;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  /* The More menu is an absolutely positioned child, so this box must not clip it. */
  position: relative;
  z-index: 7;
}
.dsh-context-track-head-title {
  flex: 0 0 auto;
  font-size: 0.82rem;
  font-weight: 650;
  white-space: nowrap;
}
.dsh-context-track-head-watching {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-head-spacer {
  flex: 1 1 auto;
  min-width: 0.25rem;
}
.dsh-context-track-head-stat {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: baseline;
  gap: 0.3rem;
  color: var(--dsw-alias-label-primary);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.dsh-context-track-head-label {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
}
/* Cache hit rate: a tinted pill so the percentage is the first figure the eye lands on. */
.dsh-context-track-hit {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: baseline;
  gap: 0.3rem;
  padding: 0.06rem 0.45rem;
  border: 1px solid color-mix(in srgb, currentColor 42%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 12%, transparent);
  line-height: 1.25;
  white-space: nowrap;
}
.dsh-context-track-hit-label {
  color: var(--dsw-alias-label-secondary);
  font-size: 0.66rem;
}
.dsh-context-track-hit-value {
  color: inherit;
  font-family: ui-monospace, monospace;
  font-size: 0.76rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-hit[data-hit-tone="high"] { color: var(--dsh-hit-high); }
.dsh-context-track-hit[data-hit-tone="mid"] { color: var(--dsh-hit-mid); }
.dsh-context-track-hit[data-hit-tone="low"] { color: var(--dsh-hit-low); }
.dsh-context-track-hit[data-hit-tone="absent"] {
  color: var(--dsw-alias-label-tertiary);
  border-color: var(--dsw-alias-border-l2);
  background: transparent;
}
.dsh-context-track-head-band,
.dsh-context-track-more-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.22rem;
  padding: 0.1rem 0.5rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.72rem;
  white-space: nowrap;
  cursor: pointer;
}
/* Filled, bordered, and caret-marked: the band disclosure must read as a
   control among the header's plain figures, not as another caption. */
.dsh-context-track-head-band {
  gap: 0.28rem;
  padding: 0.14rem 0.45rem 0.14rem 0.4rem;
  border-color: color-mix(in srgb, var(--dsw-alias-label-tertiary) 45%, transparent);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font-weight: 550;
  transition: background 140ms ease, border-color 140ms ease;
}
.dsh-context-track-head-band:hover,
.dsh-context-track-more-button:hover,
.dsh-context-track-more-button[aria-expanded="true"] {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-head-band[aria-expanded="true"] {
  border-color: color-mix(in srgb, var(--dsw-alias-label-secondary) 70%, transparent);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-head-band-icon {
  flex: 0 0 auto;
  width: 0.72rem;
  height: 0.72rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-head-band:hover .dsh-context-track-head-band-icon,
.dsh-context-track-head-band[aria-expanded="true"] .dsh-context-track-head-band-icon {
  color: var(--dsw-alias-label-primary);
}
.dsh-context-track-head-band-caret {
  font-size: 0.56rem;
  line-height: 1;
  transition: transform 140ms ease;
}
.dsh-context-track-head-band[aria-expanded="true"] .dsh-context-track-head-band-caret {
  transform: rotate(180deg);
}
.dsh-context-track-more-caret {
  font-size: 0.58rem;
  line-height: 1;
  transition: transform 140ms ease;
}
.dsh-context-track-more-button[aria-expanded="true"] .dsh-context-track-more-caret {
  transform: rotate(180deg);
}
.dsh-context-track-more {
  position: relative;
  flex: 0 0 auto;
}
.dsh-context-track-more-menu {
  position: absolute;
  /* Clear the header's bottom border, not just the trigger's box. */
  top: calc(100% + 0.6rem);
  right: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 10rem;
  padding: 0.3rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 0.55rem;
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: 0 10px 26px color-mix(in srgb, currentColor 20%, transparent);
  animation: dsh-context-track-menu-in 120ms ease-out;
}
.dsh-context-track-more-menu button {
  padding: 0.32rem 0.55rem;
  border-radius: 0.35rem;
  color: var(--dsw-alias-label-primary);
  font-size: 0.75rem;
  text-align: start;
  white-space: nowrap;
}
.dsh-context-track-more-menu button:hover,
.dsh-context-track-more-menu button:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-more-divider {
  display: block;
  height: 1px;
  margin: 0.15rem 0.2rem;
  background: var(--dsw-alias-border-l2);
}
@keyframes dsh-context-track-menu-in {
  from { opacity: 0; transform: translateY(-3px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---------- round strip ---------- */
/* A tab rail: each round reads as a tab, the current one sits on the pane
   border with an ink bar, and the arrows switch rounds without hunting for a
   click target in a long, scrolled strip. */
.dsh-context-track-strip {
  box-sizing: border-box;
  display: flex;
  flex: 0 0 auto;
  align-items: stretch;
  gap: 0.35rem;
  min-width: 0;
  min-height: 2rem;
  padding: 0.2rem 0.45rem 0 0.6rem;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-tabs {
  display: flex;
  flex: 1 1 auto;
  align-items: flex-end;
  gap: 0.25rem;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
}
.dsh-context-track-tabs::-webkit-scrollbar {
  display: none;
}
.dsh-context-track button.dsh-context-track-turn {
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: stretch;
  gap: 0.14rem;
  min-width: 0;
  padding: 0.26rem 0.6rem 0.32rem;
  border: 1px solid transparent;
  border-radius: 0.5rem 0.5rem 0.3rem 0.3rem;
  font-size: 0.75rem;
  line-height: 1.25;
  white-space: nowrap;
  scroll-snap-align: start;
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
}
.dsh-context-track button.dsh-context-track-turn[data-hover="true"],
.dsh-context-track button.dsh-context-track-turn:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  border-color: var(--dsw-alias-border-l2);
}
/* The current tab owns a filled surface and an ink bar, so a mouse hover never
   looks selected and a selected tab never looks merely hovered. */
.dsh-context-track button.dsh-context-track-turn[aria-current="true"] {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: inset 0 -2px 0 var(--dsw-alias-label-primary);
}
.dsh-context-track button.dsh-context-track-turn[aria-current="true"]:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-turn-top {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 0;
}
.dsh-context-track-turn-name {
  color: var(--dsw-alias-label-secondary);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  transition: color 140ms ease;
}
.dsh-context-track button.dsh-context-track-turn:hover .dsh-context-track-turn-name,
.dsh-context-track button.dsh-context-track-turn[data-hover="true"] .dsh-context-track-turn-name,
.dsh-context-track button.dsh-context-track-turn[aria-current="true"] .dsh-context-track-turn-name {
  color: var(--dsw-alias-label-primary);
}
.dsh-context-track-turn-flag {
  font-size: 0.68rem;
}
.dsh-context-track-turn-summary {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.7rem;
  font-weight: 400;
}
.dsh-context-track-turn-meta {
  display: inline-flex;
  align-items: baseline;
  gap: 0.28rem;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-turn-stat {
  display: inline-flex;
  align-items: baseline;
  gap: 0.2rem;
}
.dsh-context-track-turn-stat-label {
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track-turn-sep {
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track button.dsh-context-track-mark {
  flex: 0 0 auto;
  padding: 0.08rem 0.4rem;
  border: 1px dashed var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  white-space: nowrap;
}
.dsh-context-track button.dsh-context-track-mark:hover {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track-strip-nav {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.15rem;
  padding-inline-start: 0.35rem;
  border-inline-start: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-strip-nav button {
  display: inline-grid;
  place-items: center;
  width: 1.35rem;
  height: 1.35rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 0.35rem;
  color: var(--dsw-alias-label-secondary);
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
}
.dsh-context-track-strip-nav button:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-strip-nav button:disabled {
  opacity: 0.35;
  cursor: default;
}
.dsh-context-track-strip-nav svg {
  width: 0.72rem;
  height: 0.72rem;
}
.dsh-context-track-strip-count {
  flex: 0 0 auto;
  margin-inline-end: 0.1rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
/* A dense panel needs the room for tabs more than it needs a counter. */
.dsh-context-track[data-tier="dense"] .dsh-context-track-strip-count {
  display: none;
}

/* ---------- context band ---------- */
.dsh-context-track-band-wrap {
  position: relative;
  flex: 0 0 auto;
  min-width: 0;
}
.dsh-context-track-band {
  position: relative;
  box-sizing: border-box;
  min-width: 0;
}
.dsh-context-track-band-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 1.75rem;
  padding: 0.1rem 0.75rem;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  font-size: 0.72rem;
}
.dsh-context-track-band-caption {
  flex: 0 0 auto;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
}
.dsh-context-track-band-bar {
  display: flex;
  flex: 1 1 6rem;
  align-items: stretch;
  gap: 2px;
  min-width: 3rem;
  max-width: 22rem;
  height: 0.4rem;
  padding: 0;
  overflow: hidden;
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-band-bar[data-empty="true"] {
  opacity: 0.4;
}
.dsh-context-track-band-seg {
  flex: 0 1 auto;
  min-width: 3px;
  height: 100%;
  border-radius: 999px;
  background: var(--dsh-cat-neutral);
  --cat: var(--dsh-cat-neutral);
}
.dsh-context-track-band-seg[data-hue="tools"] { background: var(--dsh-cat-tools); }
.dsh-context-track-band-seg[data-hue="results"] { background: var(--dsh-cat-results); }
.dsh-context-track-band-seg[data-hue="system"] { background: var(--dsh-cat-system); }
.dsh-context-track-band-seg[data-hue="skill"] { background: var(--dsh-cat-skill); }
.dsh-context-track-band-seg[data-hue="history"] { background: var(--dsh-cat-history); }
.dsh-context-track-band-seg[data-hue="injection"] { background: var(--dsh-cat-injection); }
.dsh-context-track-band-seg[data-hue="neutral"] { background: var(--dsh-cat-neutral); }
.dsh-context-track-band-gap {
  flex: 0 0 3px;
  height: 100%;
  border-radius: 2px;
  background: repeating-linear-gradient(135deg, var(--dsw-alias-label-tertiary) 0 1px, transparent 1px 3px);
}
.dsh-context-track-band-gap[data-active="true"] {
  outline: 1px solid var(--dsw-alias-state-error-primary);
  outline-offset: 1px;
}
.dsh-context-track-legend {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 0.1rem 0.55rem;
  min-width: 0;
  overflow: hidden;
}
.dsh-context-track-legend-item {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.25rem;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.68rem;
  white-space: nowrap;
}
.dsh-context-track-legend-item:hover {
  color: var(--dsw-alias-label-primary);
}
.dsh-context-track-legend-item i {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 2px;
  background: var(--dsh-cat-neutral);
}
.dsh-context-track-legend-item[data-hue="tools"] i { background: var(--dsh-cat-tools); }
.dsh-context-track-legend-item[data-hue="results"] i { background: var(--dsh-cat-results); }
.dsh-context-track-legend-item[data-hue="system"] i { background: var(--dsh-cat-system); }
.dsh-context-track-legend-item[data-hue="skill"] i { background: var(--dsh-cat-skill); }
.dsh-context-track-legend-item[data-hue="history"] i { background: var(--dsh-cat-history); }
.dsh-context-track-legend-item[data-hue="injection"] i { background: var(--dsh-cat-injection); }
.dsh-context-track-legend-item[data-hue="neutral"] i { background: var(--dsh-cat-neutral); }
.dsh-context-track-legend-item b {
  font-weight: 550;
}
.dsh-context-track-legend-more {
  flex: 0 0 auto;
  padding: 0 0.35rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
}
.dsh-context-track-band-panel {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 0.5rem;
  width: 100%;
  max-height: 40vh;
  padding: 0.5rem 0.75rem 0.65rem;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  overflow: auto;
  animation: dsh-context-track-band-in 150ms ease-out;
}
.dsh-context-track-band-block {
  min-width: 0;
  padding: 0.45rem 0.55rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 0.5rem;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-band-block h3 {
  margin: 0 0 0.35rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  font-weight: 650;
}
.dsh-context-track-band-figures {
  display: flex;
  flex-wrap: wrap;
  gap: 0.15rem 0.6rem;
  margin: 0.4rem 0 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.7rem;
}
.dsh-context-track-band-figures span {
  white-space: nowrap;
}
.dsh-context-track-band-block > .dsh-context-track-band-figures:first-child {
  margin-top: 0;
}

/* ---------- timing card ---------- */
.dsh-context-track-timing {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}
.dsh-context-track-timing-bar {
  display: flex;
  align-items: stretch;
  gap: 2px;
  height: 0.42rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-timing-bar span {
  display: block;
  flex-basis: 0;
  min-width: 2px;
  height: 100%;
  border-radius: 999px;
}
.dsh-context-track-timing-bar [data-time-seg="wait"] { background: var(--dsh-time-wait); }
.dsh-context-track-timing-bar [data-time-seg="think"] { background: var(--dsh-time-think); }
.dsh-context-track-timing-bar [data-time-seg="rest"] { background: var(--dsh-time-rest); }
.dsh-context-track-timing-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.15rem 0.7rem;
  min-width: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.68rem;
}
.dsh-context-track-timing-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  white-space: nowrap;
}
.dsh-context-track-timing-legend-item i {
  flex: 0 0 auto;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 2px;
  background: var(--dsh-time-rest);
}
.dsh-context-track-timing-legend-item[data-time-key="wait"] i { background: var(--dsh-time-wait); }
.dsh-context-track-timing-legend-item[data-time-key="think"] i { background: var(--dsh-time-think); }
.dsh-context-track-timing-legend-item b {
  color: var(--dsw-alias-label-primary);
  font-weight: 550;
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-timing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 6.25rem), 1fr));
  gap: 0.4rem;
  min-width: 0;
}
.dsh-context-track-timing-cell {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  min-width: 0;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 0.45rem;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-timing-label {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
  white-space: nowrap;
}
.dsh-context-track-timing-value {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.28rem;
  min-width: 0;
  font-size: 0.95rem;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  line-height: 1.25;
}
.dsh-context-track-timing-value .dsh-context-track-muted {
  font-size: 0.8rem;
  font-weight: 500;
}
.dsh-context-track-timing-note {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
  font-weight: 500;
}
.dsh-context-track-timing-later {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.35rem;
  border-top: 1px dashed var(--dsw-alias-border-l2);
}
.dsh-context-track-timing-later-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
}
.dsh-context-track-timing-later-row .dsh-context-track-timing-label { font-size: 0.7rem; }
.dsh-context-track-timing-later-row .dsh-context-track-timing-value { font-size: 0.8rem; }

/* ---------- sidecar card ---------- */
.dsh-context-track-side-group {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  min-width: 0;
}
.dsh-context-track-side-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
  font-size: 0.74rem;
}
.dsh-context-track-side-group + .dsh-context-track-side-group {
  margin-top: 0.55rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--dsw-alias-border-l2);
}
.dsh-context-track-side-group + .dsh-context-track-side-row,
.dsh-context-track-side-row + .dsh-context-track-side-row {
  margin-top: 0.32rem;
}
.dsh-context-track-side-label {
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-side-value {
  flex: 0 0 auto;
  color: var(--dsw-alias-label-primary);
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-side-note {
  margin: 0.1rem 0 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
}
.dsh-context-track-side-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.dsh-context-track-side-empty {
  margin: 0;
  padding: 0.55rem 0.6rem;
  border: 1px dashed var(--dsw-alias-border-l2);
  border-radius: 0.45rem;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.72rem;
  line-height: 1.5;
}
@keyframes dsh-context-track-band-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ---------- split ---------- */
.dsh-context-track-split {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.dsh-context-track-tree,
.dsh-context-track-detail {
  box-sizing: border-box;
  min-width: 0;
  /* auto would keep each column as tall as its text, so overflow never starts. */
  min-height: 0;
  overflow: auto;
  /* A scrollbar popping in would otherwise shove the wrapped text sideways. */
  scrollbar-gutter: stable;
  padding: 0.6rem 0.75rem;
}
.dsh-context-track-tree {
  container-type: inline-size;
  container-name: tree;
  min-width: 240px;
  border-inline-end: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-detail {
  /* Zero basis keeps the column width on the split ratio. An auto basis grows
     to the JSON pane's max-content and shoves the call tree sideways whenever
     the reading/JSON switch changes the widest line. */
  flex: 1 1 0;
  min-width: 320px;
  background: var(--dsw-alias-bg-base);
}
/* The edge is an 8px hit area with a single hairline down the middle. */
.dsh-context-track-grip {
  box-sizing: border-box;
  flex: 0 0 8px;
  align-self: stretch;
  position: relative;
  z-index: 2;
  margin-inline: -4px;
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
  width: 2px;
  background: var(--dsw-alias-label-tertiary);
}

/* ---------- call tree ---------- */
.dsh-context-track-tree-bar {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: var(--dsh-tree-bar);
  padding: 0 0.15rem;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-tree-title {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  font-weight: 650;
}
.dsh-context-track-tree-actions {
  display: inline-flex;
  gap: 0.3rem;
}
.dsh-context-track-tree-actions button {
  padding: 0.05rem 0.4rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
}
.dsh-context-track-tree-actions button:hover {
  color: var(--dsw-alias-label-primary);
}
.dsh-context-track-row {
  position: relative;
  display: grid;
  grid-template-columns: 1rem 1rem minmax(0, 1fr) 3.5rem 6.5rem;
  align-items: center;
  column-gap: 0.25rem;
  min-width: 0;
  min-height: 1.75rem;
  padding-inline: 0.15rem;
  border-radius: 0.375rem;
  color: inherit;
  text-align: start;
  transition: background 120ms ease;
}
.dsh-context-track-row[data-row-kind="turn"] {
  position: sticky;
  top: var(--dsh-tree-bar);
  z-index: 2;
  min-height: 2rem;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-row:hover {
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-row[data-current="true"] {
  background: var(--dsw-alias-interactive-bg-hover);
  box-shadow: inset 2px 0 0 var(--dsw-alias-label-secondary);
}
.dsh-context-track-row[data-status="error"]::before,
.dsh-context-track-row[data-status="aborted"]::before {
  content: "";
  position: absolute;
  inset-block: 0.2rem;
  inset-inline-start: 0;
  width: 2px;
  border-radius: 2px;
  background: var(--dsw-alias-state-error-primary);
}
.dsh-context-track-row-rail {
  display: none;
}
.dsh-context-track-children {
  min-width: 0;
  border-inline-start: 1px solid var(--dsw-alias-border-l2);
  padding-inline-start: 0.25rem;
}
.dsh-context-track-turn-block + .dsh-context-track-turn-block {
  margin-top: 0.6rem;
}
.dsh-context-track-chevron {
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  width: 1rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.65rem;
}
.dsh-context-track-row .dsh-context-track-chevron:hover {
  color: var(--dsw-alias-label-primary);
}
.dsh-context-track-glyph {
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  width: 1rem;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track-row[data-status="error"] .dsh-context-track-glyph,
.dsh-context-track-row[data-status="aborted"] .dsh-context-track-glyph {
  color: var(--dsw-alias-state-error-primary);
}
.dsh-context-track-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 0;
  overflow: hidden;
  text-align: start;
}
.dsh-context-track-label-text {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 0.8rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-label-extra {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 0.7rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-summary {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.68rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-label-status {
  flex: 0 0 auto;
  font-size: 0.68rem;
}
.dsh-context-track-status-ok { color: var(--dsw-alias-state-success-primary); }
.dsh-context-track-status-error,
.dsh-context-track-status-aborted { color: var(--dsw-alias-state-error-primary); }
.dsh-context-track-status-running { color: var(--dsw-alias-label-tertiary); }
.dsh-context-track-dot {
  flex: 0 0 auto;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 999px;
  background: currentColor;
}
.dsh-context-track-dot[data-status="running"] {
  animation: dsh-context-track-breathe 1600ms ease-in-out infinite;
}
@keyframes dsh-context-track-breathe {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 45%, transparent); }
  50% { box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 0%, transparent); }
}
.dsh-context-track-col {
  justify-self: end;
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
  text-align: end;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Number columns shrink with the tree, never with the window. */
@container tree (max-width: 359px) {
  .dsh-context-track-row { grid-template-columns: 1rem 1rem minmax(0, 1fr) 6.5rem; }
  .dsh-context-track-row > [data-column="duration"] { display: none; }
}
@container tree (max-width: 299px) {
  .dsh-context-track-row { grid-template-columns: 1rem 1rem minmax(0, 1fr); }
  .dsh-context-track-row > [data-column="tokens"] { display: none; }
}
/* Tighter rows in the compact and dense tiers. */
.dsh-context-track[data-tier="compact"] .dsh-context-track-row { min-height: 1.625rem; }
.dsh-context-track[data-tier="narrow"] .dsh-context-track-row { min-height: 1.6rem; }
.dsh-context-track[data-tier="dense"] .dsh-context-track-row { min-height: 1.5rem; }
.dsh-context-track[data-tier="dense"] .dsh-context-track-label-text { font-size: 0.75rem; }
.dsh-context-track[data-tier="dense"] .dsh-context-track-head-stat[data-head="elapsed"],
.dsh-context-track[data-tier="dense"] .dsh-context-track-head-watching { display: none; }
/* Narrow headers keep the colored number but drop its label so the chrome still fits. */
.dsh-context-track:not([data-tier="wide"]):not([data-tier="compact"]) .dsh-context-track-head .dsh-context-track-hit-label { display: none; }
.dsh-context-track[data-tier="dense"] .dsh-context-track-head { padding: 0.2rem 0.5rem; gap: 0.35rem; }
/* The dense header keeps the label and the caret; the mark yields the space. */
.dsh-context-track[data-tier="dense"] .dsh-context-track-head-band-icon { display: none; }

/* Narrow panels: the tree is full width and the detail is an overlay. */
.dsh-context-track:not([data-tier="wide"]):not([data-tier="compact"]) .dsh-context-track-tree {
  flex: 1 1 auto;
  min-width: 0;
  border-inline-end: 0;
}
.dsh-context-track-detail[data-overlay="true"] {
  position: absolute;
  inset: 0;
  z-index: 6;
  min-width: 0;
  background: var(--dsw-alias-bg-base);
  animation: dsh-context-track-slide-in 160ms ease-out;
}
@keyframes dsh-context-track-slide-in {
  from { opacity: 0; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}
/* Narrow panels expand the band downward as an overlay, never pushing the tree. */
.dsh-context-track:not([data-tier="wide"]):not([data-tier="compact"]) .dsh-context-track-band[data-band="open"] .dsh-context-track-band-panel {
  position: absolute;
  top: 100%;
  inset-inline: 0;
  z-index: 5;
  max-height: 60vh;
  box-shadow: 0 10px 24px color-mix(in srgb, currentColor 18%, transparent);
}

/* ---------- detail header ---------- */
.dsh-context-track-detail-inner {
  min-width: 0;
}
.dsh-context-track-detail-head {
  position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  min-height: 2rem;
  margin: -0.1rem 0 0.55rem;
  padding: 0.2rem 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-crumbs {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 0.1rem;
  min-width: 0;
  overflow: hidden;
  font-size: 0.72rem;
  white-space: nowrap;
}
.dsh-context-track-crumb {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}
.dsh-context-track-crumb button {
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-crumb button:hover {
  color: var(--dsw-alias-label-primary);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.dsh-context-track-crumb-sep {
  margin: 0 0.22rem;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-context-track [data-crumb-current] {
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
  text-overflow: ellipsis;
}
.dsh-context-track-detail-head .dsh-context-track-views {
  flex: 0 0 auto;
  margin: 0;
}
.dsh-context-track-detail-head [data-copy-node],
.dsh-context-track-detail-head [data-detail-close],
.dsh-context-track-detail-head [data-detail-back] {
  flex: 0 0 auto;
  padding: 0.1rem 0.45rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.7rem;
  white-space: nowrap;
}
.dsh-context-track-detail-head [data-copy-node]:hover,
.dsh-context-track-detail-head [data-detail-close]:hover,
.dsh-context-track-detail-head [data-detail-back]:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-detail-body {
  min-width: 0;
  min-height: 0;
}

/* ---------- detail reading ---------- */
.dsh-context-track-card,
.dsh-context-track-block {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-block {
  margin: 0 0 0.55rem;
  padding: 0.65rem 0.8rem 0.6rem;
  border-radius: 0.5rem;
}
.dsh-context-track-block[data-category="system"] { border-inline-start: 3px solid var(--dsh-cat-system); }
.dsh-context-track-block[data-category="user"] { border-inline-start: 3px solid var(--dsw-alias-label-secondary); }
.dsh-context-track-block[data-category="injection"] { border-inline-start: 3px solid var(--dsh-cat-injection); }
.dsh-context-track-block[data-category="skill"] { border-inline-start: 3px solid var(--dsh-cat-skill); }
.dsh-context-track-block[data-category="tool-results"] { border-inline-start: 3px solid var(--dsh-cat-results); }
.dsh-context-track-block[data-category="history"] { border-inline-start: 3px solid var(--dsh-cat-history); }
.dsh-context-track-block[data-focus="true"] {
  outline: 1px solid var(--dsw-alias-label-tertiary);
  outline-offset: 1px;
}
/* The first card a call added over the previous call's window: a marked seam
   with a filled badge, so a cumulative window shows where new context starts. */
.dsh-context-track-block[data-new="true"] {
  border-color: color-mix(in srgb, var(--dsw-alias-label-primary) 38%, var(--dsw-alias-border-l2));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);
}
.dsh-context-track-new {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.55rem;
}
.dsh-context-track-new-badge {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  padding: 0.08rem 0.5rem;
  border-radius: 999px;
  background: var(--dsw-alias-label-primary);
  color: var(--dsw-alias-bg-base);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.4;
}
.dsh-context-track-new-rule {
  flex: 1 1 auto;
  min-width: 1rem;
  height: 1px;
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 34%, transparent);
}
.dsh-context-track-block h3,
.dsh-context-track-section {
  margin: 0 0 0.4rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.7rem;
  font-weight: 650;
}
.dsh-context-track [data-facts] {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
  gap: 0.6rem 1.1rem;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 0 0 0.6rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 0.5rem;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track [data-facts] [data-fact] {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.18rem;
  min-width: 0;
}
.dsh-context-track [data-facts] [data-fact="retry"] {
  grid-column: 1 / -1;
}
.dsh-context-track-fact-label {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
  font-weight: 550;
  line-height: 1.3;
}
.dsh-context-track-fact-value {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  color: var(--dsw-alias-label-primary);
  font-size: 0.8rem;
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
  font-size: 0.64rem;
  font-weight: 550;
  line-height: 1.45;
}
.dsh-context-track [data-facts] [data-status="ok"] { color: var(--dsw-alias-state-success-primary); }
.dsh-context-track [data-facts] [data-status="error"],
.dsh-context-track [data-facts] [data-status="aborted"] { color: var(--dsw-alias-state-error-primary); }
.dsh-context-track [data-facts] [data-status="running"] { color: var(--dsw-alias-label-tertiary); }
.dsh-context-track-views {
  display: inline-flex;
  gap: 0.12rem;
  padding: 0.12rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-views button {
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-views button[aria-pressed="true"] {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-pre {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: ui-monospace, monospace;
}
.dsh-context-track-badge {
  color: var(--dsw-alias-label-secondary);
  font-size: 0.72rem;
}
.dsh-context-track-hero {
  display: none;
}

/* ---------- category list (expanded band) ---------- */
.dsh-context-track-cats {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr) max-content;
  column-gap: 0.45rem;
  row-gap: 0.3rem;
  margin: 0.35rem 0 0;
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
  row-gap: 0.2rem;
}
.dsh-context-track-cat-line {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: center;
  min-width: 0;
  min-height: 1.25rem;
  padding-block: 0.08rem;
  border-radius: 0.3rem;
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
  gap: 0.25rem;
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
  width: 1.05rem;
  height: 1.05rem;
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
  width: 0.65rem;
  height: 0.65rem;
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
  height: 0.35rem;
  border-radius: 999px;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-cat i {
  display: block;
  height: 100%;
  border-radius: inherit;
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
  gap: 0.35rem;
  min-width: 0;
  margin: 0.1rem 0 0.3rem;
}
.dsh-context-track-cats li > .dsh-context-track-tools {
  grid-column: 1 / -1;
  box-sizing: border-box;
  margin: 0.1rem 0 0.25rem 0.45rem;
  padding: 0.25rem 0 0.1rem 0.55rem;
  border-left: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-cats > li[data-open="true"] {
  row-gap: 0.3rem;
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
  font-size: 0.7rem;
  font-weight: 650;
}
.dsh-context-track-tools-count {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
}
.dsh-context-track-tools-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
}
.dsh-context-track-tools-bar input {
  flex: 1 1 6rem;
  min-width: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 0.18rem 0.5rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 0.72rem;
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
  padding: 0.08rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-tools-sort button {
  padding: 0.06rem 0.4rem;
  border-radius: 999px;
  font-size: 0.7rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-tools-sort button[aria-pressed="true"] {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-tool-chart {
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.dsh-context-track-tool-chart li {
  display: grid;
  grid-template-columns: minmax(4.25rem, 7rem) minmax(2rem, 1fr) auto;
  gap: 0.35rem;
  align-items: center;
  min-width: 0;
}
.dsh-context-track-tool-name {
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-context-track-tool-calls {
  margin-left: 0.25rem;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
}
.dsh-context-track-tool-meter {
  display: block;
  height: 0.35rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--dsw-alias-bg-base);
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
  padding: 0.06rem 0.4rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  font-size: 0.7rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-tools button[data-remaining]:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-tools-overhead {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.72rem;
}
.dsh-context-track button.dsh-context-track-gap {
  margin-top: 0.3rem;
  padding: 0.06rem 0.4rem;
  background: transparent;
  border: 1px dashed var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.7rem;
}
.dsh-context-track button.dsh-context-track-gap[data-active="true"] {
  border-color: var(--dsw-alias-state-error-primary);
  color: var(--dsw-alias-state-error-primary);
}
.dsh-context-track-output-meta {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}
.dsh-context-track-output-meta h3 {
  margin: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.7rem;
  font-weight: 650;
}
.dsh-context-track-output-meta .dsh-context-track-num {
  font-size: 0.72rem;
}
.dsh-context-track-output-tokens {
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.72rem;
}
.dsh-context-track-output-call {
  margin-top: 0.55rem;
  padding-top: 0.45rem;
  border-top: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-output-call-name {
  margin: 0 0 0.2rem;
  font-size: 0.75rem;
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
.dsh-context-track-detail button[data-more],
.dsh-context-track-detail button[data-open-json] {
  margin-top: 0.35rem;
  margin-inline-end: 0.3rem;
  padding: 0.08rem 0.45rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  font-size: 0.7rem;
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-detail button[data-more]:hover,
.dsh-context-track-detail button[data-open-json]:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-context-track-meta {
  display: block;
  margin: 0 0 0.45rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}
.dsh-context-track-meta tbody {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.15rem 0.8rem;
}
.dsh-context-track-meta tr {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}
.dsh-context-track-meta th,
.dsh-context-track-meta td {
  padding: 0;
  text-align: start;
  vertical-align: baseline;
}
.dsh-context-track-meta th {
  color: var(--dsw-alias-label-tertiary);
  font-size: 0.66rem;
  font-weight: 550;
}
.dsh-context-track-meta td {
  font-size: 0.77rem;
}
/* The body follows the card's width, so a wide pane is not half empty; the
   card's own padding is the only inset. */
.dsh-context-track-prose {
  min-width: 0;
  line-height: 1.62;
  font-size: 0.84rem;
  overflow-wrap: break-word;
  text-wrap: pretty;
}
.dsh-context-track-prose :is(h1, h2, h3, h4) {
  margin: 1.1rem 0 0.45rem;
  color: var(--dsw-alias-label-primary);
  font-size: 0.95rem;
  font-weight: 650;
  line-height: 1.35;
}
.dsh-context-track-prose :is(ul, ol, blockquote, pre) {
  margin: 0.7rem 0;
}
/* Reading keeps one line per source line, so a single newline stays visible:
   lines in one source paragraph sit closer than blank-line separated blocks. */
.dsh-context-track-prose p {
  margin: 0.5rem 0;
}
.dsh-context-track-prose > * + p[data-line="first"] {
  margin-top: 1rem;
}
.dsh-context-track-prose > :first-child {
  margin-top: 0;
}
.dsh-context-track-prose > :last-child {
  margin-bottom: 0;
}
.dsh-context-track-prose :is(ul, ol) {
  padding-inline-start: 1.1rem;
}
.dsh-context-track-prose li + li {
  margin-top: 0.3rem;
}
.dsh-context-track-prose li p {
  margin: 0.15rem 0;
}
.dsh-context-track-prose blockquote p {
  margin: 0.2rem 0;
}
.dsh-context-track-prose blockquote {
  padding-inline-start: 0.65rem;
  border-inline-start: 2px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
}
.dsh-context-track-prose pre {
  padding: 0.4rem 0.55rem;
  overflow-x: auto;
  border-radius: 0.3rem;
  background: var(--dsw-alias-bg-base);
}
.dsh-context-track-prose :not(pre) > code {
  padding: 0.04rem 0.25rem;
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
  gap: 0.4rem;
  margin: 0 0 0.55rem;
  padding: 0.2rem;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-context-track-json-tools button {
  padding: 0.15rem 0.6rem;
  border: 0;
  border-radius: 999px;
  font-size: 0.72rem;
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
  padding: 0.08rem;
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
.dsh-context-track-json-line > .dsh-context-track-chevron {
  display: inline-grid;
  width: 1ch;
  height: auto;
  min-height: 0;
  vertical-align: baseline;
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
.dsh-context-track-facts {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.2rem 0.7rem;
  margin: 0;
}
.dsh-context-track-facts dt {
  color: var(--dsw-alias-label-secondary);
}

/* Motion is short and always skippable. */
.dsh-context-track-cat-caret,
.dsh-context-track-row,
.dsh-context-track button.dsh-context-track-turn {
  transition-duration: 140ms;
}
@media (prefers-reduced-motion: reduce) {
  .dsh-context-track * {
    transition: none !important;
    animation: none !important;
  }
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
