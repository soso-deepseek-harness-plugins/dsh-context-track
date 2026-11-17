import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/** Highlighted JSON source. Objects, arrays, and long strings fold from the gutter. */
import { useState } from 'react';
import { copyText } from './format.js';
const STRING_LIMIT = 120;
const PREVIEW_CHARS = 40;
export function JsonView({ value, t, chrome = true, }) {
    const text = typeof value === 'string' ? value : stringify(value);
    const parsed = tryParse(text);
    const [fold, setFold] = useState({ text, bulk: 'default', overrides: {}, parsed: {} });
    const live = fold.text === text ? fold : { text, bulk: 'default', overrides: {}, parsed: {} };
    if (fold.text !== text)
        setFold(live);
    const copyValue = parsed === undefined ? text : JSON.stringify(parsed, null, 2);
    const toggle = (path, open) => {
        setFold(current => {
            const base = current.text === text ? current : live;
            return { ...base, overrides: { ...base.overrides, [path]: !open } };
        });
    };
    const parseString = (path) => {
        setFold(current => {
            const base = current.text === text ? current : live;
            return { ...base, parsed: { ...base.parsed, [path]: base.parsed[path] !== true } };
        });
    };
    return (_jsxs("div", { "data-json-view": true, children: [chrome ? _jsxs("div", { className: "dsh-context-track-json-tools", children: [_jsx("button", { type: "button", "data-copy-json": true, onClick: () => { void copyText(copyValue); }, children: t('copyJson') }), parsed !== undefined ? (_jsxs("div", { className: "dsh-context-track-json-bulk", children: [_jsx("button", { type: "button", onClick: () => { setFold(current => ({ ...(current.text === text ? current : live), bulk: 'open', overrides: {} })); }, children: t('expandAll') }), _jsx("button", { type: "button", onClick: () => { setFold(current => ({ ...(current.text === text ? current : live), bulk: 'shut', overrides: {} })); }, children: t('collapseAll') })] })) : null] }) : null, parsed === undefined ? (_jsx("pre", { className: "dsh-context-track-pre", "data-json": "plain", children: text })) : (_jsx("div", { className: "dsh-context-track-json-source", "data-json": "source", children: _jsx(JsonNode, { path: "", value: parsed, depth: 0, fold: live, t: t, onToggle: toggle, onParse: parseString }) }))] }));
}
/** Object or array text embeds in a message card. Sentences and scalars stay prose. */
export function compositeJson(text) {
    const parsed = tryParse(text);
    if (parsed === undefined || parsed === null || typeof parsed !== 'object')
        return undefined;
    return parsed;
}
function JsonNode({ name, path, value, depth, fold, t, onToggle, onParse, }) {
    const key = name === undefined ? null : (_jsxs(_Fragment, { children: [_jsx("span", { "data-json-token": "key", className: "dsh-context-track-json-key", children: JSON.stringify(name) }), _jsx("span", { children: ": " })] }));
    if (typeof value === 'string')
        return (_jsx(StringNode, { name: key, path: path, value: value, depth: depth, fold: fold, t: t, onToggle: onToggle, onParse: onParse }));
    if (value === null || typeof value !== 'object') {
        return (_jsxs("div", { className: "dsh-context-track-json-line", children: [key, _jsx(Scalar, { value: value })] }));
    }
    const array = Array.isArray(value);
    const entries = array
        ? value.map((item, index) => [String(index), item])
        : Object.entries(value);
    const open = isOpen(fold, path, depth, false);
    return (_jsxs("div", { children: [_jsxs("div", { className: "dsh-context-track-json-line", children: [_jsx(Arrow, { path: path, open: open, count: entries.length, onToggle: onToggle }), key, _jsx("span", { children: open ? (array ? '[' : '{') : array ? `[${entries.length}]` : '{…}' })] }), open ? (_jsxs(_Fragment, { children: [entries.map(([entry, item]) => (_jsx("div", { className: "dsh-context-track-json-nest", children: _jsx(JsonNode, { name: array ? undefined : entry, path: childPath(path, entry), value: item, depth: depth + 1, fold: fold, t: t, onToggle: onToggle, onParse: onParse }) }, entry))), _jsx("div", { className: "dsh-context-track-json-line", children: array ? ']' : '}' })] })) : null] }));
}
function StringNode({ name, path, value, depth, fold, t, onToggle, onParse, }) {
    const long = value.length > STRING_LIMIT || value.includes('\n');
    const nested = compositeJson(value);
    const open = long ? isOpen(fold, path, depth, true) : true;
    const showNested = open && nested !== undefined && fold.parsed[path] === true;
    return (_jsxs("div", { className: "dsh-context-track-json-line", children: [long ? _jsx(Arrow, { path: path, open: open, onToggle: onToggle }) : null, name, showNested ? (_jsx(JsonNode, { path: `${path}#`, value: nested, depth: 0, fold: fold, t: t, onToggle: onToggle, onParse: onParse })) : (_jsx("span", { "data-json-token": "string", className: "dsh-context-track-json-string", "data-truncated": long && !open ? 'true' : undefined, children: long && !open ? preview(value) : JSON.stringify(value) })), nested !== undefined ? (_jsx("button", { type: "button", onClick: () => { onParse(path); }, children: t('parseJson') })) : null] }));
}
function Arrow({ path, open, count, onToggle, }) {
    return (_jsx("button", { type: "button", className: "dsh-context-track-chevron", "data-json-key": path, "data-count": count, "aria-expanded": open, onClick: () => { onToggle(path, open); }, children: _jsx("span", { "aria-hidden": "true", children: open ? '▾' : '▸' }) }));
}
function Scalar({ value }) {
    if (value === null)
        return _jsx("span", { "data-json-token": "null", className: "dsh-context-track-json-null", children: "null" });
    if (typeof value === 'number') {
        return _jsx("span", { "data-json-token": "number", className: "dsh-context-track-json-number", children: JSON.stringify(value) });
    }
    if (typeof value === 'boolean') {
        return _jsx("span", { "data-json-token": "boolean", className: "dsh-context-track-json-boolean", children: JSON.stringify(value) });
    }
    return _jsx("span", { "data-json-token": "string", className: "dsh-context-track-json-string", children: JSON.stringify(value) });
}
function isOpen(fold, path, depth, long) {
    const override = fold.overrides[path];
    if (override !== undefined)
        return override;
    if (fold.bulk === 'open')
        return true;
    if (fold.bulk === 'shut')
        return false;
    if (long)
        return false;
    return depth <= 2;
}
function preview(value) {
    const body = JSON.stringify(value).slice(1, -1);
    return `"${body.slice(0, PREVIEW_CHARS)}…"`;
}
function childPath(parent, key) {
    return parent.length === 0 ? key : `${parent}.${key}`;
}
function tryParse(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return undefined;
    }
}
function stringify(value) {
    if (value === undefined)
        return '';
    try {
        return JSON.stringify(value, null, 2) ?? '';
    }
    catch {
        return '';
    }
}
//# sourceMappingURL=JsonView.js.map