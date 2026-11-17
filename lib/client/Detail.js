import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/** Reading view of one node, or the same node as JSON. The call result sits after the input. */
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { classifyWindow, sourceLabel } from '../shared/classify.js';
import { isMissing } from '../shared/detail.js';
import { estimateMessage } from '../shared/estimate.js';
import { parseUsage } from '../shared/figures.js';
import { childExpandable } from '../shared/model.js';
import { compositeJson, JsonView } from './JsonView.js';
import { MarkdownView } from './MarkdownView.js';
import { abbreviate, copyText } from './format.js';
import { CATEGORY_KEY } from './widgets.js';
const PREVIEW_LINES = 8;
/** One node. A visited view stays mounted, so its folds and scroll survive the round trip. */
export function Detail({ detail, nodeKey, t, scrollerRef, onOpenChild, crumbs, onCrumb, onClose, onBack, focusCategory, }) {
    const [view, setView] = useState('reading');
    const [slice, setSlice] = useState(undefined);
    const [visited, setVisited] = useState({ reading: true, json: false });
    const [copied, setCopied] = useState(false);
    const memory = useRef({ reading: 0, json: 0 });
    const viewRef = useRef(view);
    viewRef.current = view;
    useLayoutEffect(() => {
        const scroller = scrollerRef.current;
        if (scroller !== null)
            scroller.scrollTop = memory.current[view];
    }, [view, nodeKey, scrollerRef]);
    useLayoutEffect(() => {
        if (focusCategory === undefined)
            return;
        const scroller = scrollerRef.current;
        const card = scroller?.querySelector(`[data-focus="true"]`);
        if (card instanceof HTMLElement)
            card.scrollIntoView?.({ block: 'nearest' });
    }, [focusCategory, scrollerRef]);
    const rememberScroll = () => {
        const scroller = scrollerRef.current;
        if (scroller !== null)
            memory.current[viewRef.current] = scroller.scrollTop;
    };
    const choose = (next) => {
        rememberScroll();
        setSlice(undefined);
        setVisited(current => ({ ...current, [next]: true }));
        setView(next);
    };
    const openSlice = (value) => {
        rememberScroll();
        setSlice(value);
        setVisited(current => ({ ...current, json: true }));
        setView('json');
    };
    const copyNode = () => {
        if (detail === undefined)
            return;
        void copyText(JSON.stringify(detail, null, 2));
        setCopied(true);
        setTimeout(() => { setCopied(false); }, 1200);
    };
    const failed = detail !== undefined && isMissing(detail);
    return (_jsxs("div", { "data-view": view, "data-node": nodeKey, className: "dsh-context-track-detail-inner", children: [_jsxs("header", { className: "dsh-context-track-detail-head", "data-detail-head": true, children: [onBack !== undefined ? (_jsxs("button", { type: "button", "data-detail-back": true, onClick: onBack, children: [_jsx("span", { "aria-hidden": "true", children: "\u2190" }), " ", t('back')] })) : null, _jsx("nav", { className: "dsh-context-track-crumbs", "data-crumbs": true, "aria-label": t('detailPane'), children: (crumbs ?? []).map((crumb, index) => {
                            const crumbId = crumb.id;
                            return (_jsxs("span", { className: "dsh-context-track-crumb", children: [index > 0 ? _jsx("span", { "aria-hidden": "true", className: "dsh-context-track-crumb-sep", children: "/" }) : null, crumbId === undefined || onCrumb === undefined ? (_jsx("span", { "data-crumb-current": true, children: crumb.label })) : (_jsx("button", { type: "button", "data-crumb": crumbId, onClick: () => { onCrumb(crumbId); }, children: crumb.label }))] }, `${crumbId ?? 'self'}-${index}`));
                        }) }), _jsxs("div", { className: "dsh-context-track-views", children: [_jsx("button", { type: "button", "data-view-toggle": "reading", "aria-pressed": view === 'reading', onClick: () => { choose('reading'); }, children: t('reading') }), _jsx("button", { type: "button", "data-view-toggle": "json", "aria-pressed": view === 'json', onClick: () => { choose('json'); }, children: t('jsonView') })] }), _jsx("button", { type: "button", "data-copy-node": true, "aria-live": "polite", onClick: copyNode, children: copied ? t('copied') : t('copyJson') }), onClose !== undefined ? (_jsx("button", { type: "button", "data-detail-close": true, "aria-label": t('closeDetail'), onClick: onClose, children: _jsx("span", { "aria-hidden": "true", children: "\u2715" }) })) : null] }), detail === undefined ? _jsx("p", { className: "dsh-context-track-muted", children: t('hint') }) : null, failed ? _jsx("p", { className: "dsh-context-track-muted", children: t('missing') }) : null, detail === undefined || failed ? null : (_jsxs(_Fragment, { children: [visited.json ? (_jsx("div", { "data-view-pane": "json", hidden: view !== 'json', children: _jsx(JsonPane, { detail: detail, slice: slice, t: t }) })) : null, _jsx("div", { "data-view-pane": "reading", hidden: view !== 'reading', children: _jsx(Structured, { detail: detail, t: t, onOpenChild: onOpenChild, onSlice: openSlice, focusCategory: focusCategory }) })] }))] }));
}
function Structured({ detail, t, onOpenChild, onSlice, focusCategory, }) {
    if (detail.kind === 'attempt' || detail.kind === 'step') {
        return (_jsxs("div", { "data-io": true, children: [_jsx(Facts, { detail: detail, t: t }), _jsx(InputCards, { messages: detail.messages, tools: detail.tools, newFrom: detail.newFrom, t: t, onSlice: onSlice, focusCategory: focusCategory }), detail.kind === 'attempt' ? (_jsx(OutputCards, { output: detail.output, usage: detail.usage, t: t, onSlice: onSlice })) : (_jsxs("section", { "data-output": "unseen", className: "dsh-context-track-block", children: [_jsx("h3", { children: t('output') }), _jsx("p", { className: "dsh-context-track-muted", children: t('notSeen') })] }))] }));
    }
    if (detail.kind === 'tool') {
        return _jsx(ToolBody, { detail: detail, t: t, onOpenChild: onOpenChild, onSlice: onSlice });
    }
    if (detail.kind === 'sidecar') {
        if (detail.purpose === 'session-title') {
            return _jsx(TitleBody, { detail: detail, t: t, onSlice: onSlice });
        }
        if (detail.purpose === 'web-search') {
            return _jsx(SearchBody, { detail: detail, t: t });
        }
        return (_jsx("div", { className: "dsh-context-track-prose", "data-sidecar-body": true, children: _jsx(MarkdownView, { text: typeof detail.summary === 'string' ? detail.summary : stringify(detail.summary) }) }));
    }
    if (detail.kind === 'turn') {
        return _jsx("p", { children: detail.status === 'ok' ? null : detail.status });
    }
    return _jsx("pre", { className: "dsh-context-track-pre", children: stringify(detail) });
}
function Facts({ detail, t, }) {
    const config = record(detail.config);
    const defaults = record(detail.adapterDefaults);
    const facts = [];
    pushFact(facts, 'model', t('model'), text(config.model));
    pushFact(facts, 'provider', t('provider'), text(config.provider));
    pushFact(facts, 'temperature', t('temperature'), text(config.temperature));
    pushFact(facts, 'reasoning', t('reasoning'), text(config.reasoningEffort), defaults.reasoningEffort === true ? t('adapterDefault') : undefined);
    const maxTokens = text(config.maxTokens);
    if (maxTokens !== undefined) {
        facts.push({
            key: 'maxTokens',
            label: t('maxOutput'),
            value: `${formatCount(config.maxTokens)} token`,
            ...(defaults.maxTokens === true ? { note: t('adapterDefault') } : {}),
        });
    }
    facts.push({ key: 'window', label: t('windowLabel'), value: String(detail.inputSeq) });
    facts.push({ key: 'status', label: t('finish'), value: labelStatus(detail.status, t), status: detail.status });
    if (detail.kind === 'attempt' && detail.retry !== undefined) {
        pushFact(facts, 'retry', t('retry'), summarize(detail.retry.failure));
        facts.push({ key: 'delay', label: t('retryDelay'), value: `${detail.retry.delayMs} ms` });
    }
    return _jsx(FactList, { facts: facts });
}
/** Session naming uses the same reading shape as a model call: facts, input, then output. */
function TitleBody({ detail, t, onSlice, }) {
    const named = typeof detail.output === 'string' && detail.output.length > 0;
    return (_jsxs("div", { "data-io": true, "data-title-body": true, children: [_jsx(TitleFacts, { detail: detail, t: t }), _jsx(InputCards, { messages: titleMessages(detail), tools: undefined, t: t, onSlice: onSlice }), named ? (_jsx(OutputCards, { output: detail.output, t: t, onSlice: onSlice })) : (_jsxs("section", { "data-output": "unseen", className: "dsh-context-track-block", children: [_jsx("h3", { children: t('output') }), _jsx("p", { "data-session-name": true, className: "dsh-context-track-muted", children: t('titleMissing') })] }))] }));
}
function TitleFacts({ detail, t, }) {
    const route = record(detail.route);
    const facts = [];
    if (typeof detail.route === 'string') {
        pushFact(facts, 'route', t('routeLabel'), text(detail.route));
    }
    else {
        pushFact(facts, 'model', t('model'), text(route.model));
        pushFact(facts, 'provider', t('provider'), text(route.provider));
    }
    pushFact(facts, 'reasoning', t('reasoning'), text(detail.reasoningEffort));
    const maxTokens = text(detail.maxTokens);
    if (maxTokens !== undefined) {
        facts.push({ key: 'maxTokens', label: t('maxOutput'), value: `${formatCount(detail.maxTokens)} token` });
    }
    facts.push({ key: 'status', label: t('finish'), value: labelStatus(detail.status, t), status: detail.status });
    return _jsx(FactList, { facts: facts });
}
function titleMessages(detail) {
    const list = Array.isArray(detail.messages) ? detail.messages : [];
    const system = systemMessage(detail.system);
    return system === undefined ? list : [system, ...list];
}
function systemMessage(system) {
    if (typeof system === 'string') {
        if (system.trim().length === 0)
            return undefined;
        return { role: 'system', content: [{ type: 'text', text: system }] };
    }
    if (system === null || typeof system !== 'object')
        return undefined;
    const row = system;
    if (row.role === undefined && row.content === undefined && typeof row.text !== 'string')
        return undefined;
    return system;
}
function FactList({ facts }) {
    return (_jsx("div", { className: "dsh-context-track-facts", "data-facts": true, children: facts.map(fact => (_jsxs("div", { "data-fact": fact.key, children: [_jsx("span", { className: "dsh-context-track-fact-label", children: fact.label }), _jsxs("span", { className: "dsh-context-track-fact-value", children: [_jsx("span", { "data-fact-value": true, "data-status": fact.status, children: fact.value }), fact.note !== undefined ? _jsx("span", { className: "dsh-context-track-fact-note", children: fact.note }) : null] })] }, fact.key))) }));
}
function pushFact(facts, key, label, value, note) {
    if (value === undefined)
        return;
    facts.push({ key, label, value, ...(note !== undefined ? { note } : {}) });
}
function text(value) {
    if (typeof value === 'number' && Number.isFinite(value))
        return formatCount(value);
    if (typeof value === 'string' && value.length > 0)
        return value;
    return undefined;
}
function formatCount(value) {
    if (typeof value !== 'number' || !Number.isFinite(value))
        return '';
    if (!Number.isInteger(value) || Math.abs(value) < 1000)
        return String(value);
    const sign = value < 0 ? '-' : '';
    return sign + String(Math.abs(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function InputCards({ messages, tools, newFrom, t, onSlice, focusCategory, }) {
    const list = Array.isArray(messages) ? messages : [];
    const classified = useMemo(() => classifyWindow(list, tools), [list, tools]);
    return (_jsxs("div", { "data-input": true, children: [_jsx("h3", { className: "dsh-context-track-section", children: t('messages') }), list.map((message, index) => {
                const item = classified.items.find(entry => entry.message === message);
                const focused = focusCategory !== undefined && item?.category === focusCategory;
                return (_jsx(MessageCard, { message: message, item: item, t: t, onSlice: onSlice, focused: focused, isNew: newFrom !== undefined && index === newFrom }, index));
            })] }));
}
/** Thinking sits in its own card. The result card keeps the written answer, tool calls, and output tokens. */
function OutputCards({ output, usage, t, onSlice, }) {
    if (output === undefined) {
        return (_jsxs("section", { "data-output": "unseen", className: "dsh-context-track-block", children: [_jsx("h3", { children: t('output') }), _jsx("p", { className: "dsh-context-track-muted", children: t('pending') })] }));
    }
    const answer = outputAnswer(output);
    const thought = outputThought(output);
    const calls = outputCalls(output);
    const outputTokens = parseUsage(usage)?.outputTokens;
    return (_jsxs("div", { "data-output": true, children: [thought.length > 0 ? (_jsxs("section", { "data-reasoning": true, className: "dsh-context-track-block dsh-context-track-reasoning", children: [_jsx("header", { className: "dsh-context-track-output-meta", children: _jsx("h3", { children: t('think') }) }), _jsx(ReadingBody, { text: thought, faint: true, t: t })] })) : null, _jsxs("section", { className: "dsh-context-track-block dsh-context-track-output", "data-category": "history", children: [_jsxs("header", { className: "dsh-context-track-output-meta", children: [_jsx("h3", { children: t('output') }), outputTokens !== undefined ? (_jsx("span", { "data-output-tokens": true, className: "dsh-context-track-output-tokens", children: _jsx(TokenMark, { basis: "usage", value: outputTokens }) })) : null, _jsx("button", { type: "button", "data-open-json": true, onClick: () => { onSlice(output); }, children: t('openInJson') })] }), answer.length > 0 ? _jsx(ReadingBody, { text: answer, t: t }) : null, calls.map((block, index) => _jsx(OutputCall, { block: block, t: t }, callKey(block, index)))] })] }));
}
/** A tool call the model wrote: its name, then the arguments as highlighted JSON. */
function OutputCall({ block, t }) {
    const name = typeof block.name === 'string' && block.name.length > 0 ? block.name : t('tools');
    const args = block.arguments;
    const hasArgs = args !== undefined && args !== null && args !== '';
    return (_jsxs("div", { "data-output-call": true, children: [_jsx("p", { className: "dsh-context-track-output-call-name", children: name }), hasArgs ? _jsx(JsonView, { value: args, t: t, chrome: false }) : null] }));
}
/** Exact usage is `token=n`. A character estimate is `token≈n`. No exact or estimated caption. */
function TokenMark({ basis, value }) {
    const shown = abbreviate(value);
    const mark = basis === 'usage' ? `token=${shown.text}` : `token≈${shown.text}`;
    if (!shown.abbreviated) {
        return _jsx("span", { className: "dsh-context-track-num", "data-basis": basis, children: mark });
    }
    return (_jsx("button", { type: "button", className: "dsh-context-track-num", title: basis === 'usage' ? `token=${shown.full}` : `token≈${shown.full}`, "data-full": shown.full, onClick: (event) => {
            event.stopPropagation();
            void copyText(shown.full);
        }, children: mark }));
}
function callKey(block, index) {
    return typeof block.id === 'string' && block.id.length > 0 ? block.id : `${index}`;
}
function outputCalls(output) {
    return contentBlocks(output).filter(block => block.type === 'tool-call');
}
/** Written answer. A plain string is the whole output. Reasoning never fills this card. */
function outputAnswer(output) {
    if (typeof output === 'string')
        return output;
    const blocks = contentBlocks(output);
    const answer = blockText(blocks, 'text');
    if (answer.length > 0)
        return answer;
    return blocks.length === 0 ? messageText(output) : '';
}
function outputThought(output) {
    if (typeof output === 'string')
        return '';
    return blockText(contentBlocks(output), 'reasoning');
}
function blockText(blocks, type) {
    return blocks
        .filter(block => block.type === type && typeof block.text === 'string' && block.text.trim().length > 0)
        .map(block => String(block.text))
        .join('\n\n');
}
/** Full-node JSON is two documents. A sliced message stays a single document. */
function JsonPane({ detail, slice, t, }) {
    if (slice !== undefined)
        return _jsx(JsonView, { value: slice, t: t });
    const parts = jsonParts(detail);
    if (parts === undefined)
        return _jsx(JsonView, { value: detail, t: t });
    return (_jsxs("div", { "data-json-split": true, children: [_jsxs("section", { "data-json-part": "input", className: "dsh-context-track-block", children: [_jsx("h3", { children: t('input') }), _jsx(JsonView, { value: parts.input, t: t })] }), _jsxs("section", { "data-json-part": "output", className: "dsh-context-track-block", children: [_jsx("h3", { children: t('output') }), _jsx(JsonView, { value: parts.output, t: t })] })] }));
}
function jsonParts(detail) {
    if (detail.kind === 'attempt' || detail.kind === 'step') {
        return {
            input: pick(detail, ['inputSeq', 'messages', 'tools', 'toolHistory', 'config', 'adapterDefaults', 'context']),
            output: detail.kind === 'step'
                ? { status: detail.status }
                : pick(detail, ['status', 'output', 'usage', 'firstTokenTime', 'streamDuration', 'interrupted', 'retry']),
        };
    }
    if (detail.kind === 'tool') {
        return {
            input: pick(detail, ['name', 'callId', 'arguments', 'childSessionId', 'childLabel', 'childMode']),
            output: pick(detail, ['status', 'result']),
        };
    }
    if (detail.kind === 'sidecar' && detail.purpose === 'compaction') {
        return {
            input: pick(detail, ['messages', 'tools', 'toolHistory', 'config', 'instruction', 'provider', 'model', 'maxTokens']),
            output: pick(detail, ['status', 'summary', 'rawOutput', 'usage', 'error']),
        };
    }
    if (detail.kind === 'sidecar' && detail.purpose === 'session-title') {
        return {
            input: pick(detail, ['system', 'messages', 'route', 'maxTokens', 'reasoningEffort']),
            output: pick(detail, ['status', 'output']),
        };
    }
    return undefined;
}
function pick(source, keys) {
    const row = source;
    const out = {};
    for (const key of keys) {
        if (row[key] !== undefined)
            out[key] = row[key];
    }
    return out;
}
/** Markdown, or foldable JSON when the whole block is an object or array. */
function ReadingBody({ text, faint = false, t, }) {
    const embedded = faint ? undefined : compositeJson(text);
    const [open, setOpen] = useState(false);
    const lines = text.split('\n');
    const clampable = embedded === undefined && lines.length > PREVIEW_LINES;
    const clamped = clampable && !open;
    const shown = clamped ? lines.slice(0, PREVIEW_LINES).join('\n') : text;
    return (_jsxs("div", { className: faint ? 'dsh-context-track-reasoning' : undefined, "data-folded": faint && !open ? 'true' : undefined, "data-clamped": clamped ? 'true' : undefined, children: [embedded !== undefined ? (_jsx(JsonView, { value: embedded, t: t })) : (_jsx("div", { className: "dsh-context-track-prose", children: _jsx(MarkdownView, { text: shown }) })), clampable ? (_jsx("button", { type: "button", "data-more": true, onClick: () => { setOpen(value => !value); }, children: open ? t('collapse') : t('showRest') })) : null] }));
}
function MessageCard({ message, item, t, onSlice, faint = false, focused = false, isNew = false, }) {
    const text = messageText(message);
    const embedded = faint ? undefined : compositeJson(text);
    const [open, setOpen] = useState(false);
    const lines = text.split('\n');
    const clampable = embedded === undefined && lines.length > PREVIEW_LINES;
    const clamped = clampable && !open;
    const shown = clamped ? lines.slice(0, PREVIEW_LINES).join('\n') : text;
    const role = item?.role ?? roleOf(message) ?? '';
    const category = item?.category;
    const folded = category === 'system' || faint;
    const tokens = item?.tokens ?? estimateMessage(message, category === 'system');
    const source = sourceCell(message, category);
    const tool = category === 'tool-results' || category === 'skill' ? item?.toolName : undefined;
    const callId = callIdOf(message);
    return (_jsxs("section", { className: faint ? 'dsh-context-track-block dsh-context-track-reasoning' : 'dsh-context-track-block', "data-category": category, "data-folded": folded && !open ? 'true' : undefined, "data-clamped": clamped ? 'true' : undefined, "data-focus": focused ? 'true' : undefined, "data-new": isNew ? 'true' : undefined, children: [isNew ? (_jsxs("header", { className: "dsh-context-track-new", "data-new-mark": true, children: [_jsx("span", { className: "dsh-context-track-new-badge", children: t('newMessages') }), _jsx("span", { className: "dsh-context-track-new-rule", "aria-hidden": "true" })] })) : null, _jsx("table", { className: "dsh-context-track-meta", children: _jsxs("tbody", { children: [role.length > 0 ? _jsx(MetaRow, { label: t('role'), value: role }) : null, category !== undefined ? _jsx(MetaRow, { label: t('category'), value: t(CATEGORY_KEY[category]) }) : null, _jsx("tr", { children: _jsx("td", { colSpan: 2, children: _jsx(TokenMark, { basis: "estimated", value: tokens }) }) }), source !== undefined ? _jsx(MetaRow, { label: t('source'), value: source }) : null, tool !== undefined ? _jsx(MetaRow, { label: t('toolName'), value: tool }) : null, callId !== undefined ? _jsx(MetaRow, { label: t('call'), value: callId }) : null] }) }), embedded !== undefined ? (_jsx(JsonView, { value: embedded, t: t })) : (_jsx("div", { className: "dsh-context-track-prose", children: _jsx(MarkdownView, { text: shown }) })), clampable ? (_jsx("button", { type: "button", "data-more": true, onClick: () => { setOpen(value => !value); }, children: open ? t('collapse') : t('showRest') })) : null, _jsx("button", { type: "button", "data-open-json": true, onClick: () => { onSlice(message); }, children: t('openInJson') })] }));
}
function MetaRow({ label, value }) {
    return (_jsxs("tr", { children: [_jsx("th", { scope: "row", children: label }), _jsx("td", { children: value })] }));
}
function ToolBody({ detail, t, onOpenChild, onSlice, }) {
    const local = detail.childSessionId !== undefined && childExpandable(detail.childMode);
    return (_jsxs("div", { "data-tool-view": true, children: [_jsxs("section", { "data-pane": "arguments", className: "dsh-context-track-block", children: [_jsx("h3", { children: t('arguments') }), _jsx(JsonView, { value: detail.arguments, t: t })] }), _jsxs("section", { "data-pane": "result", className: "dsh-context-track-block", children: [_jsx("h3", { children: t('result') }), detail.result === undefined ? (_jsx("p", { className: "dsh-context-track-muted", children: t('pending') })) : (_jsx(JsonView, { value: detail.result, t: t })), _jsx("button", { type: "button", "data-slice": "result", onClick: () => { onSlice(detail.result === undefined ? '' : detail.result); }, children: t('openInJson') })] }), local ? (_jsx("button", { type: "button", "data-open-child": true, onClick: onOpenChild, children: t('openChild') })) : null] }));
}
/** Search sidecar: who triggered it, then the query and the scrubbed request. */
function SearchBody({ detail, t, }) {
    const query = record(detail.request).query;
    const source = detail.source;
    const trigger = source?.kind === 'tool'
        ? source.name
        : source?.kind === 'attempt'
            ? source.attempt !== undefined
                ? `${t('step').replace('{n}', String(source.step))} · ${t('attempt').replace('{n}', String(source.attempt))}`
                : t('step').replace('{n}', String(source.step))
            : undefined;
    return (_jsxs("div", { "data-search-body": true, children: [source !== undefined && trigger !== undefined ? (_jsxs("section", { "data-pane": "source", className: "dsh-context-track-block", children: [_jsx("h3", { children: t('trigger') }), _jsx("p", { "data-search-trigger": true, children: trigger }), source.kind === 'tool' && source.arguments !== undefined ? (_jsxs(_Fragment, { children: [_jsx("h3", { children: t('arguments') }), _jsx(JsonView, { value: source.arguments, t: t })] })) : null, source.kind === 'attempt' && source.output !== undefined ? (_jsx(JsonView, { value: source.output, t: t })) : null] })) : null, _jsxs("section", { "data-pane": "request", className: "dsh-context-track-block", children: [_jsx("h3", { children: t('request') }), typeof query === 'string' && query.length > 0 ? (_jsx("table", { className: "dsh-context-track-meta", children: _jsx("tbody", { children: _jsx(MetaRow, { label: t('query'), value: query }) }) })) : null, detail.request === undefined ? (_jsx("p", { className: "dsh-context-track-muted", children: t('notSeen') })) : (_jsx(JsonView, { value: detail.request, t: t }))] })] }));
}
function contentBlocks(value) {
    if (value === null || typeof value !== 'object')
        return [];
    const content = value.content;
    if (!Array.isArray(content))
        return [];
    return content.filter((block) => block !== null && typeof block === 'object');
}
function messageText(message) {
    if (typeof message === 'string')
        return message;
    if (message === null || typeof message !== 'object')
        return stringify(message);
    const row = message;
    if (typeof row.text === 'string')
        return row.text;
    if (typeof row.content === 'string')
        return row.content;
    const blocks = contentBlocks(message);
    if (blocks.length === 0)
        return stringify(message);
    return blocks.map(block => (typeof block.text === 'string' ? block.text : '')).join('');
}
function roleOf(message) {
    if (message === null || typeof message !== 'object')
        return undefined;
    const role = message.role;
    return typeof role === 'string' ? role : undefined;
}
function callIdOf(message) {
    if (message === null || typeof message !== 'object')
        return undefined;
    const direct = message.toolCallId;
    if (typeof direct === 'string' && direct.length > 0)
        return direct;
    const source = message.source;
    if (source === null || typeof source !== 'object')
        return undefined;
    const nested = source.callId;
    return typeof nested === 'string' && nested.length > 0 ? nested : undefined;
}
function sourceCell(message, category) {
    if (category !== 'injection' && category !== 'skill')
        return undefined;
    if (message === null || typeof message !== 'object')
        return undefined;
    const source = message.source;
    if (source === null || typeof source !== 'object')
        return undefined;
    return sourceLabel(message);
}
function summarize(value) {
    const text = typeof value === 'string' ? value : value === undefined ? '' : stringify(value);
    const flat = text.replace(/\s+/g, ' ').trim();
    return flat.length > 80 ? `${flat.slice(0, 80)}…` : flat;
}
function labelStatus(status, t) {
    if (status === 'ok' || status === 'running' || status === 'error' || status === 'aborted')
        return t(status);
    return status;
}
function record(value) {
    return value !== null && typeof value === 'object' ? value : {};
}
function stringify(value) {
    if (typeof value === 'string')
        return value;
    if (value === undefined)
        return '';
    try {
        return JSON.stringify(value, null, 2);
    }
    catch {
        return '';
    }
}
//# sourceMappingURL=Detail.js.map