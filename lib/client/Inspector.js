import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Named breakdowns for tool definitions, injected content, and skills. */
import { useState } from 'react';
import { FigureView } from './widgets.js';
export const TOOL_PREVIEW = 5;
/** Largest entries first. Search runs before the preview cut. */
export function ToolList({ tools, overhead, category = 'tools', t, nested = false, }) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('size');
    const [showAll, setShowAll] = useState(false);
    if (tools.length === 0 && overhead === undefined)
        return null;
    const nameKey = category === 'tools' ? 'catTools' : category === 'skill' ? 'catSkill' : 'catInjection';
    const searchKey = category === 'tools' ? 'searchTools' : category === 'skill' ? 'searchSkill' : 'searchInjection';
    const overheadKey = category === 'skill' ? 'skillOverhead' : 'overhead';
    const needle = query.trim().toLowerCase();
    const filtered = needle.length === 0
        ? [...tools]
        : tools.filter(tool => tool.name.toLowerCase().includes(needle));
    const ordered = [...filtered].sort((left, right) => compareTools(left, right, sort));
    const shown = showAll ? ordered : ordered.slice(0, TOOL_PREVIEW);
    const rest = ordered.length - shown.length;
    const peak = Math.max(1, ...tools.map(tool => tool.tokens));
    return (_jsxs("section", { "data-category": category, "data-breakdown": true, className: "dsh-context-track-tools", "data-sort": sort, "data-hue": category, "data-nested": nested ? 'true' : undefined, children: [nested ? null : (_jsxs("div", { className: "dsh-context-track-tools-head", children: [_jsx("h3", { children: t(nameKey) }), _jsx("span", { className: "dsh-context-track-tools-count", children: ordered.length })] })), tools.length > 0 ? (_jsxs("div", { className: "dsh-context-track-tools-bar", children: [_jsx("input", { "aria-label": t(searchKey), placeholder: t(searchKey), value: query, onChange: event => { setQuery(event.target.value); } }), _jsxs("div", { className: "dsh-context-track-tools-sort", role: "group", "aria-label": t(nameKey), children: [_jsx("button", { type: "button", "aria-pressed": sort === 'size', onClick: () => { setSort('size'); }, children: t('sortSize') }), _jsx("button", { type: "button", "aria-pressed": sort === 'name', onClick: () => { setSort('name'); }, children: t('sortName') })] }), nested ? _jsx("span", { className: "dsh-context-track-tools-count", children: ordered.length }) : null] })) : null, shown.length > 0 ? (_jsx("ol", { className: "dsh-context-track-tool-chart", children: shown.map(tool => (_jsxs("li", { "data-tool": tool.name, ...(tool.calls !== undefined ? { 'data-calls': tool.calls } : {}), children: [_jsxs("span", { className: "dsh-context-track-tool-name", title: tool.name, children: [_jsx("span", { children: tool.name }), category !== 'tools' && tool.calls !== undefined && (category !== 'skill' || tool.calls > 1) ? (_jsx("small", { className: "dsh-context-track-tool-calls", children: t('entries').replace('{n}', String(tool.calls)) })) : null] }), _jsx("span", { className: "dsh-context-track-tool-meter", "aria-hidden": "true", children: _jsx("i", { style: { width: `${(tool.tokens / peak) * 100}%`, ...(tool.tokens > 0 ? { minWidth: '2px' } : {}) } }) }), _jsx(FigureView, { figure: { basis: 'estimated', value: tool.tokens }, t: t, showBasis: false })] }, tool.name))) })) : needle.length > 0 ? (_jsx("p", { className: "dsh-context-track-muted", children: t(category === 'tools' ? 'noToolMatch' : 'noMatch') })) : null, rest > 0 ? (_jsx("button", { type: "button", "data-remaining": rest, onClick: () => { setShowAll(true); }, children: t('remaining').replace('{n}', String(rest)) })) : null, overhead !== undefined ? (_jsxs("p", { className: "dsh-context-track-tools-overhead", "data-overhead": true, children: [t(overheadKey), " ", _jsx(FigureView, { figure: { basis: 'estimated', value: overhead }, t: t, showBasis: false })] })) : null] }));
}
function compareTools(left, right, sort) {
    if (sort === 'name')
        return left.name.localeCompare(right.name) || right.tokens - left.tokens;
    return right.tokens - left.tokens || left.name.localeCompare(right.name);
}
//# sourceMappingURL=Inspector.js.map