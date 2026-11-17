import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Context summary band. Collapsed it is one line: a stacked make-up bar, a
 * legend, and the expand control. Expanded it is a grid of make-up, timing,
 * and sidecars that scrolls on its own.
 */
import { useState } from 'react';
import { sessionUsage } from '../shared/figures.js';
import { TimingCard } from './TimingCard.js';
import { abbreviate } from './format.js';
import { CATEGORY_KEY, FigureView, HitRateBadge } from './widgets.js';
import { ToolList } from './Inspector.js';
/** Identity, not rank. A seventh category keeps its name and a neutral bar. */
const HUE = {
    tools: 'tools',
    'tool-results': 'results',
    system: 'system',
    skill: 'skill',
    history: 'history',
    injection: 'injection',
    user: 'neutral',
};
/** Tool rows follow the user row. The rest of the window stays ranked by size. */
const AFTER_USER = new Set(['tool-results', 'tools']);
/** Only four legend entries before the rest fold into `+N`. */
const LEGEND_PREVIEW = 4;
function bySize(left, right) {
    return right.tokens - left.tokens || left.id.localeCompare(right.id);
}
export function composeRows(categories) {
    const head = categories.filter(category => !AFTER_USER.has(category.id)).sort(bySize);
    const tail = categories.filter(category => AFTER_USER.has(category.id)).sort(bySize);
    const userAt = head.findIndex(category => category.id === 'user');
    if (userAt < 0)
        return [...head, ...tail];
    return [...head.slice(0, userAt + 1), ...tail, ...head.slice(userAt + 1)];
}
export function reclaimedOf(events) {
    const parts = events.filter(event => event.kind === 'compaction' && event.tokens?.value !== undefined);
    if (parts.length === 0)
        return undefined;
    return {
        basis: parts.every(event => event.tokens?.basis === 'estimated') ? 'estimated' : 'usage',
        value: parts.reduce((sum, event) => sum + (event.tokens?.value ?? 0), 0),
    };
}
export function compactionPresent(report) {
    return report.consumption.compaction.basis !== 'absent' || report.events.some(event => event.kind === 'compaction');
}
export function titlePresent(report) {
    return report.consumption.title !== undefined || report.events.some(event => event.kind === 'title');
}
export function ContextBand({ report, open, activeSeq, titleName, trackOf, t, onCategory, onGap, }) {
    const { consumption, window } = report;
    const ranked = composeRows(window.categories);
    const [allLegend, setAllLegend] = useState(false);
    const [detailOpen, setDetailOpen] = useState({});
    const details = {
        tools: window.toolDefinitions,
        injection: window.injections ?? [],
        skill: window.skills ?? [],
    };
    const overheadOf = (id) => (id === 'tools' ? window.definitionOverhead : id === 'skill' ? window.skillOverhead : undefined);
    const hasDetail = (id) => (details[id]?.length ?? 0) > 0 || overheadOf(id) !== undefined;
    const toggleDetail = (id) => { setDetailOpen(current => ({ ...current, [id]: current[id] !== true })); };
    const reclaimed = reclaimedOf(report.events);
    const gaps = report.events.filter(event => event.kind === 'compaction' && event.inWindow);
    return (_jsxs("div", { className: "dsh-context-track-band", "data-band": open ? 'open' : 'closed', children: [_jsxs("div", { className: "dsh-context-track-band-line", children: [_jsx("span", { className: "dsh-context-track-band-caption", children: t('blockCompose') }), _jsx(StackedBar, { ranked: ranked, gaps: gaps, activeSeq: activeSeq, t: t, onCategory: onCategory, onGap: onGap }), _jsx(Legend, { ranked: ranked, all: allLegend, t: t, onMore: () => { setAllLegend(value => !value); }, onCategory: onCategory })] }), open ? (_jsxs("div", { className: "dsh-context-track-band-panel", "data-band-panel": true, children: [_jsxs("section", { "data-block": "compose", className: "dsh-context-track-band-block", "aria-label": t('blockCompose'), children: [_jsxs("p", { className: "dsh-context-track-band-figures", "data-figures": true, children: [_jsxs("span", { "data-stat": "input", children: [t('input'), " ", _jsx(FigureView, { figure: consumption.input, t: t, showBasis: false })] }), _jsxs("span", { "data-stat": "output", children: [t('output'), " ", _jsx(FigureView, { figure: consumption.output, t: t, showBasis: false, pending: report.outputPending })] }), consumption.reasoning.basis === 'absent' ? null : (_jsxs("span", { "data-stat": "reasoning", children: [t('reasoningBlock'), " ", _jsx(FigureView, { figure: consumption.reasoning, t: t, showBasis: false })] })), _jsx(HitRateBadge, { figure: consumption.hitRate, t: t, stat: "hit" })] }), _jsx("ol", { className: "dsh-context-track-cats", "data-compose": true, children: ranked.map(category => {
                                    const detailCategory = category.id === 'tools' || category.id === 'injection' || category.id === 'skill' ? category.id : undefined;
                                    const fold = detailCategory !== undefined && hasDetail(detailCategory);
                                    const expanded = fold && detailOpen[detailCategory] === true;
                                    const name = t(CATEGORY_KEY[category.id]);
                                    return (_jsxs("li", { "data-category": category.id, "data-hue": HUE[category.id], "data-open": fold ? (expanded ? 'true' : 'false') : undefined, children: [_jsxs("div", { className: "dsh-context-track-cat-line", "data-fold": fold ? 'true' : undefined, onClick: fold ? () => { toggleDetail(detailCategory); } : undefined, children: [_jsxs("span", { className: "dsh-context-track-cat-name", children: [_jsx("span", { children: name }), fold ? (_jsx("button", { type: "button", className: "dsh-context-track-cat-toggle", "aria-expanded": expanded, "aria-label": name, onClick: (event) => {
                                                                    event.stopPropagation();
                                                                    toggleDetail(detailCategory);
                                                                }, children: _jsx(Caret, {}) })) : null] }), _jsx("span", { className: `dsh-context-track-cat dsh-context-track-cat-${HUE[category.id]}`, children: _jsx("i", { style: { width: `${barShare(ranked, category)}%` } }) }), _jsx(FigureView, { figure: { basis: 'estimated', value: category.tokens }, t: t, showBasis: false })] }), expanded ? (_jsx(ToolList, { tools: details[detailCategory] ?? [], overhead: overheadOf(detailCategory), category: detailCategory, t: t, nested: true })) : null] }, category.id));
                                }) }), hasDetail('tools') && !ranked.some(category => category.id === 'tools') ? (_jsx(ToolList, { tools: window.toolDefinitions, overhead: window.definitionOverhead, t: t })) : null] }), _jsxs("section", { "data-block": "timing", className: "dsh-context-track-band-block", children: [_jsx("h3", { children: t('blockTiming') }), _jsx(TimingCard, { report: report, t: t })] }), _jsxs("section", { "data-block": "side", className: "dsh-context-track-band-block", children: [_jsx("h3", { children: t('blockSide') }), !compactionPresent(report) && !titlePresent(report) && report.subagents.length === 0 ? (_jsx("p", { className: "dsh-context-track-side-empty", "data-side-empty": true, children: t('sideEmpty') })) : null, titlePresent(report) ? (_jsxs("div", { className: "dsh-context-track-side-group", "data-title": true, children: [_jsxs("div", { className: "dsh-context-track-side-row", children: [_jsx("span", { className: "dsh-context-track-side-label", children: t('title') }), _jsx("span", { className: "dsh-context-track-side-value", "data-session-name": true, children: titleName !== undefined && titleName.length > 0 ? titleName : t('titleMissing') })] }), _jsx("p", { className: "dsh-context-track-side-note", children: t('titleExcluded') }), _jsx("div", { className: "dsh-context-track-side-links", children: report.events.filter(event => event.kind === 'title').map(event => (_jsx("button", { type: "button", className: "dsh-context-track-gap", "data-seq": event.seq, "data-active": activeSeq === event.seq ? 'true' : undefined, onClick: () => { onGap(event.seq); }, children: t('title') }, event.seq))) })] })) : null, compactionPresent(report) ? (_jsxs("div", { className: "dsh-context-track-side-group", "data-compaction": true, children: [_jsxs("div", { className: "dsh-context-track-side-row", children: [_jsx("span", { className: "dsh-context-track-side-label", children: t('reclaimed') }), _jsx("span", { className: "dsh-context-track-side-value", children: _jsx(FigureView, { figure: reclaimed ?? { basis: 'absent' }, t: t }) })] }), _jsxs("div", { className: "dsh-context-track-side-row", children: [_jsx("span", { className: "dsh-context-track-side-label", children: t('compactionCost') }), _jsx("span", { className: "dsh-context-track-side-value", children: _jsx(FigureView, { figure: consumption.compaction, t: t }) })] }), consumption.compaction.basis !== 'absent' ? _jsx("p", { className: "dsh-context-track-side-note", children: t('compactionIncluded') }) : null, _jsx("div", { className: "dsh-context-track-side-links", children: report.events.filter(event => event.kind === 'compaction').map(event => (_jsx("button", { type: "button", className: "dsh-context-track-gap", "data-seq": event.seq, "data-active": activeSeq === event.seq ? 'true' : undefined, onClick: () => { onGap(event.seq); }, children: t('kindCompaction') }, event.seq))) })] })) : null, report.subagents.map(child => {
                                const track = trackOf(child.sessionId);
                                const usage = sessionUsage(track?.root ?? []);
                                return (_jsxs("div", { className: "dsh-context-track-side-row", "data-subagent": child.sessionId, children: [_jsxs("span", { className: "dsh-context-track-side-label", children: [t('subagentLine'), " ", child.label ?? child.sessionId] }), _jsx("span", { className: "dsh-context-track-side-value", children: _jsx(FigureView, { figure: usage, t: t, showBasis: false }) })] }, child.sessionId));
                            })] })] })) : null] }));
}
function barShare(ranked, category) {
    const peak = ranked.reduce((max, item) => Math.max(max, item.tokens), 0);
    return peak > 0 ? (category.tokens / peak) * 100 : 0;
}
function StackedBar({ ranked, gaps, activeSeq, t, onCategory, onGap, }) {
    const visible = ranked.filter(category => category.tokens > 0);
    if (visible.length === 0 && gaps.length === 0) {
        return _jsx("span", { className: "dsh-context-track-band-bar", "data-compose-bar": true, "data-empty": "true" });
    }
    return (_jsxs("span", { className: "dsh-context-track-band-bar", "data-compose-bar": true, role: "group", "aria-label": t('compose'), children: [visible.map(category => (_jsx("button", { type: "button", className: "dsh-context-track-band-seg", "data-category": category.id, "data-hue": HUE[category.id], style: { flexGrow: category.tokens }, title: `${t(CATEGORY_KEY[category.id])} ${abbreviate(category.tokens).text}`, onClick: () => { onCategory(category.id); } }, category.id))), gaps.map(event => (_jsx("button", { type: "button", className: "dsh-context-track-band-gap", "data-gap-seq": event.seq, "data-active": activeSeq === event.seq ? 'true' : undefined, title: t('compaction'), onClick: () => { onGap(event.seq); } }, `gap-${event.seq}`)))] }));
}
function Legend({ ranked, all, t, onMore, onCategory, }) {
    if (ranked.length === 0)
        return null;
    /* Size order, not compose order: tool definitions and tool results sit after
       the user row in the bar, yet often own its widest segments. Naming the four
       largest keeps every big swatch in the legend and pushes only the small ones
       behind `+N`. */
    const order = [...ranked].sort(bySize);
    const shown = all ? order : order.slice(0, LEGEND_PREVIEW);
    const rest = order.length - shown.length;
    return (_jsxs("span", { className: "dsh-context-track-legend", "data-legend-list": true, children: [shown.map(category => (_jsxs("button", { type: "button", className: "dsh-context-track-legend-item", "data-legend": category.id, "data-hue": HUE[category.id], onClick: () => { onCategory(category.id); }, children: [_jsx("i", { "aria-hidden": "true" }), _jsx("span", { children: t(CATEGORY_KEY[category.id]) }), _jsx("b", { className: "dsh-context-track-num", children: abbreviate(category.tokens).text })] }, category.id))), rest > 0 ? (_jsx("button", { type: "button", className: "dsh-context-track-legend-more", "data-legend-more": true, onClick: onMore, children: `+${rest}` })) : null] }));
}
/** Same glyph either way; the row rotates it, so open and closed stay the same width. */
function Caret() {
    return (_jsx("svg", { className: "dsh-context-track-cat-caret", viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { d: "M6 4.25 10.25 8 6 11.75", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
//# sourceMappingURL=TokenCard.js.map