import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { billOf } from '../shared/figures.js';
import { childExpandable, defaultExpanded, } from '../shared/model.js';
import { copyText, formatDuration } from './format.js';
import { NodeGlyph } from './Icon.js';
import { FigureView } from './widgets.js';
/** Render one session's index, nesting a child session's own index under its tool. */
export function Tree(props) {
    const { track, t } = props;
    const depth = props.depth ?? 0;
    if (track === undefined)
        return _jsx("p", { className: "dsh-context-track-muted", children: t('unavailable') });
    return (_jsxs("div", { role: depth === 0 ? 'tree' : 'group', "aria-label": depth === 0 ? t('treeTitle') : undefined, "data-tree": depth === 0 ? 'root' : undefined, children: [depth === 0 && props.onBulk !== undefined ? (_jsxs("div", { className: "dsh-context-track-tree-bar", "data-tree-bar": true, children: [_jsx("span", { className: "dsh-context-track-tree-title", children: t('treeTitle') }), _jsxs("span", { className: "dsh-context-track-tree-actions", children: [_jsx("button", { type: "button", "data-bulk": "expand", onClick: () => { props.onBulk?.(true, collectKeys(props.sessionId, track, props.trackOf)); }, children: t('expandAll') }), _jsx("button", { type: "button", "data-bulk": "collapse", onClick: () => { props.onBulk?.(false, collectKeys(props.sessionId, track, props.trackOf)); }, children: t('collapseAll') })] })] })) : null, track.root.map(node => (_jsx(RootRow, { ...props, node: node }, `${props.sessionId}:${node.id}`)))] }));
}
function RootRow(props) {
    const { node } = props;
    if (node.kind === 'turn')
        return _jsx(TurnRow, { ...props, node: node });
    if (node.kind === 'sidecar')
        return _jsx(SidecarRow, { ...props, node: node });
    return _jsx(UnlinkedRow, { ...props, node: node });
}
function TurnRow({ node, ...props }) {
    const key = rowKey(props.sessionId, node.id);
    const expanded = props.open[key] ?? defaultExpanded('turn', node.status);
    const origin = node.startTime;
    const end = node.endTime ?? props.now;
    const steps = node.items.filter(item => item.kind === 'step').length;
    const cursor = {
        sessionId: props.sessionId, nodeId: node.id, key, kind: 'turn', status: node.status,
        expandable: node.items.length > 0, activateId: node.id,
    };
    return (_jsxs("div", { className: "dsh-context-track-turn-block", "data-turn-block": node.id, children: [_jsx(Row, { kind: "turn", nodeId: node.id, glyph: "turn", label: props.t('turn').replace('{n}', String(node.turn)), status: node.status, expanded: expanded, canExpand: node.items.length > 0, summary: steps > 0 ? props.t('summaryTurn').replace('{n}', String(steps)) : undefined, current: isCurrent(props, node.id), duration: origin !== undefined && end !== undefined ? end - origin : undefined, depth: nest(props), t: props.t, onToggle: () => { props.onToggle(key, 'turn', node.status); }, onSelect: () => { activate(props, cursor); } }), expanded ? (_jsx("div", { className: "dsh-context-track-children", style: guideStyle(nest(props)), children: node.items.map(item => (_jsx(ItemRow, { ...props, item: item, origin: origin, depth: nest(props) + 1, parentTurnId: node.id }, item.id))) })) : null] }));
}
function ItemRow(props) {
    const { item } = props;
    if (item.kind === 'step')
        return _jsx(StepRow, { ...props, node: item });
    if (item.kind === 'sidecar')
        return _jsx(SidecarRow, { ...props, node: item });
    return _jsx(UnlinkedRow, { ...props, node: item });
}
function StepRow({ node, origin, ...props }) {
    if (!rowVisible('step', undefined, props.filter))
        return null;
    const key = rowKey(props.sessionId, node.id);
    const expanded = props.open[key] ?? defaultExpanded('step', node.status);
    const depth = nest(props);
    const latest = node.attempts[node.attempts.length - 1];
    const target = latest?.id ?? node.id;
    const canExpand = node.attempts.length > 0 || node.tools.length > 0 || (node.searches?.length ?? 0) > 0;
    const start = node.startTime ?? origin;
    const end = node.endTime ?? props.now;
    const cursor = {
        sessionId: props.sessionId, nodeId: node.id, key, kind: 'step', status: node.status,
        expandable: canExpand, activateId: target, ...(latest !== undefined ? { attemptId: latest.id } : {}),
    };
    const tools = node.tools.length + (node.searches?.length ?? 0);
    return (_jsxs("div", { children: [_jsx(Row, { kind: "step", nodeId: node.id, glyph: "step", label: props.t('step').replace('{n}', String(node.step)), secondary: node.model, status: node.status, expanded: expanded, canExpand: canExpand, summary: canExpand ? props.t('summaryStep')
                    .replace('{calls}', String(node.attempts.length))
                    .replace('{tools}', String(tools)) : undefined, current: isCurrent(props, target) || isCurrent(props, node.id), usage: node.usage, duration: start !== undefined && end !== undefined ? end - start : undefined, depth: depth, t: props.t, onToggle: () => { props.onToggle(key, 'step', node.status); }, onSelect: () => { activate(props, cursor); } }), expanded ? (_jsx("div", { className: "dsh-context-track-children", style: guideStyle(depth), children: stepEntries(node).map(entry => {
                    if (entry.kind === 'attempt') {
                        if (!rowVisible('attempt', undefined, props.filter))
                            return null;
                        return (_jsx(AttemptRow, { ...props, attempt: entry.attempt, depth: depth + 1 }, entry.attempt.id));
                    }
                    if (entry.kind === 'search') {
                        if (!rowVisible('sidecar', entry.search.purpose, props.filter))
                            return null;
                        return _jsx(SidecarRow, { ...props, node: entry.search, depth: depth + 1 }, entry.search.id);
                    }
                    if (!rowVisible('tool', undefined, props.filter))
                        return null;
                    const tool = entry.tool;
                    const childKey = rowKey(props.sessionId, tool.id);
                    const childOpen = props.open[childKey] ?? defaultExpanded('tool', tool.status);
                    const expandable = tool.childSessionId !== undefined && childExpandable(tool.childMode);
                    const childTrack = expandable && tool.childSessionId !== undefined ? props.trackOf(tool.childSessionId) : undefined;
                    const shown = displayStatus(tool.status, childTrack);
                    const cursor = {
                        sessionId: props.sessionId, nodeId: tool.id, key: childKey, kind: 'tool', status: shown,
                        expandable, activateId: tool.id,
                    };
                    return (_jsxs("div", { children: [_jsx(Row, { kind: "tool", nodeId: tool.id, glyph: tool.childSessionId !== undefined ? 'child' : 'tool', label: tool.name, status: shown, expanded: childOpen, canExpand: expandable, current: isCurrent(props, tool.id), duration: tool.startTime !== undefined && tool.endTime !== undefined ? tool.endTime - tool.startTime : undefined, depth: depth + 1, t: props.t, onToggle: () => { props.onToggle(childKey, 'tool', shown); }, onSelect: () => { activate(props, cursor); } }), (tool.searches ?? []).some(search => rowVisible('sidecar', search.purpose, props.filter)) ? (_jsx("div", { className: "dsh-context-track-children", style: guideStyle(depth + 1), children: (tool.searches ?? []).map(search => (rowVisible('sidecar', search.purpose, props.filter)
                                    ? _jsx(SidecarRow, { ...props, node: search, depth: depth + 2 }, search.id)
                                    : null)) })) : null, childOpen && expandable && tool.childSessionId !== undefined ? (_jsx("div", { className: "dsh-context-track-children", style: guideStyle(depth + 1), children: _jsx(Tree, { ...props, sessionId: tool.childSessionId, track: childTrack, depth: depth + 2 }) })) : null] }, tool.id));
                }) })) : null] }));
}
function AttemptRow({ attempt, ...props }) {
    const end = attempt.endTime;
    const start = attempt.streamStart ?? end;
    const key = rowKey(props.sessionId, attempt.id);
    const cursor = {
        sessionId: props.sessionId, nodeId: attempt.id, key, kind: 'attempt', status: attempt.status,
        expandable: false, activateId: attempt.id, attemptId: attempt.id,
    };
    return (_jsx(Row, { kind: "attempt", nodeId: attempt.id, glyph: "attempt", label: props.t('attempt').replace('{n}', String(attempt.attempt)), status: attempt.status, expanded: false, canExpand: false, current: isCurrent(props, attempt.id), usage: attempt.usage, duration: start !== undefined && end !== undefined ? end - start : undefined, depth: nest(props), t: props.t, onToggle: () => undefined, onSelect: () => { activate(props, cursor); } }));
}
function figureText(figure, t) {
    if (figure === undefined || figure.basis === 'absent' || figure.value === undefined)
        return '-';
    const basis = figure.basis === 'usage' ? t('exact') : t('estimated');
    return `${String(figure.value)} ${basis}`;
}
function SidecarRow(props) {
    if (!rowVisible('sidecar', props.node.purpose, props.filter))
        return null;
    const bill = props.turnBill?.turnId === props.parentTurnId ? props.turnBill : undefined;
    const label = props.node.purpose === 'session-title'
        ? `${props.t('title')} -`
        : props.node.purpose === 'compaction'
            ? bill === undefined
                ? props.t('compaction')
                : `${props.t('compaction')} ${props.t('reclaimed')} ${figureText(bill.reclaimed, props.t)} · ${props.t('compactionCost')} ${figureText(bill.cost, props.t)}`
            : props.t('search');
    const key = rowKey(props.sessionId, props.node.id);
    const cursor = {
        sessionId: props.sessionId, nodeId: props.node.id, key, kind: 'sidecar', status: props.node.status,
        expandable: false, activateId: props.node.id,
    };
    return (_jsx(Row, { kind: "sidecar", nodeId: props.node.id, glyph: "sidecar", label: label, status: props.node.status, expanded: false, canExpand: false, current: isCurrent(props, props.node.id), depth: nest(props), t: props.t, onToggle: () => undefined, onSelect: () => { activate(props, cursor); } }));
}
function UnlinkedRow(props) {
    const key = rowKey(props.sessionId, props.node.id);
    const expanded = props.open[key] ?? defaultExpanded('unlinked', 'ok');
    const expandable = childExpandable(props.node.childMode);
    const childTrack = expandable ? props.trackOf(props.node.childSessionId) : undefined;
    const cursor = {
        sessionId: props.sessionId, nodeId: props.node.id, key, kind: 'unlinked', status: 'ok',
        expandable, activateId: props.node.id,
    };
    if (!rowVisible('unlinked', undefined, props.filter))
        return null;
    return (_jsxs("div", { children: [_jsx(Row, { kind: "unlinked", nodeId: props.node.id, glyph: "unlinked", label: props.node.childLabel ?? props.t('unlinked'), status: "ok", expanded: expanded, canExpand: expandable, current: isCurrent(props, props.node.id), depth: nest(props), t: props.t, onToggle: () => { props.onToggle(key, 'unlinked', 'ok'); }, onSelect: () => { activate(props, cursor); } }), expanded && expandable ? (_jsx("div", { className: "dsh-context-track-children", style: guideStyle(nest(props)), children: _jsx(Tree, { ...props, sessionId: props.node.childSessionId, track: childTrack, depth: nest(props) + 1 }) })) : null] }));
}
function Row({ kind, nodeId, glyph, label, secondary, status, expanded, canExpand, summary, current, usage, duration, depth, t, onToggle, onSelect, }) {
    const bill = usage === undefined ? undefined : billOf(usage);
    const tokenText = bill === undefined ? undefined : `${String(bill.input.value ?? '')} → ${String(bill.output.value ?? '')}`;
    const clockText = duration === undefined ? undefined : `${String(duration)} ms`;
    const tip = [label, secondary, clockText, tokenText].filter(part => part !== undefined && part.length > 0).join(' · ');
    return (_jsxs("div", { className: "dsh-context-track-row", "data-row-kind": kind, "data-node-id": nodeId, "data-depth": depth, "data-status": status, "data-current": current ? 'true' : undefined, role: "treeitem", "aria-level": depth + 1, "aria-expanded": canExpand ? expanded : undefined, "aria-selected": current, title: tip, children: [_jsx("span", { className: "dsh-context-track-row-rail", "aria-hidden": "true" }), canExpand ? (_jsx("button", { type: "button", className: "dsh-context-track-chevron", "aria-expanded": expanded, "aria-label": expanded ? t('collapse') : t('expand'), onClick: onToggle, children: _jsx("span", { "aria-hidden": "true", children: expanded ? '▾' : '▸' }) })) : (_jsx("span", { className: "dsh-context-track-chevron", "aria-hidden": "true" })), _jsx("span", { className: "dsh-context-track-glyph", "aria-hidden": "true", children: _jsx(NodeGlyph, { kind: glyph }) }), _jsxs("button", { type: "button", className: "dsh-context-track-label", onClick: onSelect, children: [_jsx("span", { className: `dsh-context-track-dot dsh-context-track-status-${status}`, "data-status": status, "aria-hidden": "true" }), _jsx("span", { className: "dsh-context-track-label-text", children: label }), secondary !== undefined && secondary.length > 0 ? (_jsx("span", { className: "dsh-context-track-muted dsh-context-track-label-extra", children: secondary })) : null, summary !== undefined && !expanded ? (_jsx("span", { className: "dsh-context-track-summary", "data-summary": true, children: summary })) : null, status === 'ok' ? null : (_jsx("span", { className: `dsh-context-track-status-${status} dsh-context-track-label-status`, children: t(status) }))] }), _jsx("span", { "data-column": "duration", className: "dsh-context-track-col", children: duration !== undefined ? _jsx(DurationView, { ms: duration }) : null }), _jsx("span", { "data-column": "tokens", className: "dsh-context-track-col", children: bill !== undefined ? (_jsxs("span", { className: "dsh-context-track-num", children: [_jsx(FigureView, { figure: bill.input, t: t, showBasis: false }), ' → ', _jsx(FigureView, { figure: bill.output, t: t, showBasis: false })] })) : null })] }));
}
function DurationView({ ms }) {
    const shown = formatDuration(ms);
    if (!shown.abbreviated)
        return _jsx("span", { className: "dsh-context-track-num", children: shown.text });
    return (_jsx("button", { type: "button", className: "dsh-context-track-num", title: shown.full, "data-full": shown.full, onClick: event => {
            event.stopPropagation();
            void copyText(shown.full);
        }, children: shown.text }));
}
/** 12px per level, 6px past the sixth, so a deep subagent never loses its label. */
function guideStyle(depth) {
    return { marginInlineStart: depth < 6 ? '12px' : '6px' };
}
function rowKey(sessionId, nodeId) {
    return `${sessionId}:${nodeId}`;
}
function isCurrent(props, nodeId) {
    return props.selected?.sessionId === props.sessionId && props.selected.nodeId === nodeId;
}
/** A parent tool stays "running" in the tree while the child still has an open turn. */
function displayStatus(status, child) {
    if (child?.root.some(node => node.kind === 'turn' && node.status === 'running'))
        return 'running';
    return status;
}
function activate(props, cursor) {
    props.onSelect(cursor);
}
function nest(props) {
    return props.depth ?? 0;
}
/** Every expandable key in a session tree, whether or not it is open now. */
export function collectKeys(sessionId, track, trackOf) {
    const keys = [];
    if (track === undefined)
        return keys;
    const walk = (owner, state) => {
        if (state === undefined)
            return;
        for (const node of state.root) {
            if (node.kind === 'turn') {
                keys.push(rowKey(owner, node.id));
                for (const item of node.items)
                    walkItem(owner, item);
                continue;
            }
            if (node.kind === 'unlinked') {
                keys.push(rowKey(owner, node.id));
                if (childExpandable(node.childMode))
                    walk(node.childSessionId, trackOf(node.childSessionId));
                continue;
            }
        }
    };
    const walkItem = (owner, item) => {
        if (item.kind === 'step') {
            keys.push(rowKey(owner, item.id));
            if (item.tools.length > 0) {
                for (const tool of item.tools) {
                    if (tool.childSessionId !== undefined && childExpandable(tool.childMode)) {
                        keys.push(rowKey(owner, tool.id));
                        walk(tool.childSessionId, trackOf(tool.childSessionId));
                    }
                }
            }
            return;
        }
        if (item.kind === 'unlinked') {
            keys.push(rowKey(owner, item.id));
            if (childExpandable(item.childMode))
                walk(item.childSessionId, trackOf(item.childSessionId));
        }
    };
    walk(sessionId, trackOf(sessionId) ?? track);
    return keys;
}
/** Attempts, tools, and step-level searches in log order. Tool-owned searches stay on the tool. */
function stepEntries(step) {
    const entries = [
        ...step.attempts.map(attempt => ({ seq: attempt.outputSeq ?? attempt.inputSeq, kind: 'attempt', attempt })),
        ...step.tools.map(tool => ({ seq: tool.callSeq, kind: 'tool', tool })),
        ...(step.searches ?? []).map(search => ({ seq: search.requestSeq, kind: 'search', search })),
    ];
    return entries.sort((left, right) => left.seq - right.seq);
}
/** Kind filter for the tree. Turns always stay so the rail of the loop is still there. */
export function rowVisible(kind, purpose, filter) {
    if (filter === undefined)
        return true;
    if (kind === 'turn')
        return true;
    if (kind === 'step')
        return filter === 'model' || filter === 'tool';
    if (kind === 'attempt')
        return filter === 'model';
    if (kind === 'tool')
        return filter === 'tool';
    if (kind === 'sidecar') {
        if (filter === 'compaction')
            return purpose === 'compaction';
        if (filter === 'title')
            return purpose === 'session-title';
        return false;
    }
    return false;
}
/** Visible rows in paint order. Keyboard moves through this list. */
export function visibleTargets(sessionId, track, open, trackOf, filter) {
    const rows = [];
    walk(sessionId, track, open, trackOf, filter, rows);
    return rows;
}
function walk(sessionId, track, open, trackOf, filter, rows) {
    if (track === undefined)
        return;
    for (const node of track.root) {
        if (node.kind === 'turn') {
            const key = rowKey(sessionId, node.id);
            const expanded = open[key] ?? defaultExpanded('turn', node.status);
            rows.push({
                sessionId, nodeId: node.id, key, kind: 'turn', status: node.status,
                expandable: node.items.length > 0, activateId: node.id,
            });
            if (!expanded)
                continue;
            for (const item of node.items)
                pushItem(sessionId, item, open, trackOf, filter, rows);
            continue;
        }
        if (node.kind === 'sidecar' || node.kind === 'unlinked') {
            pushItem(sessionId, node, open, trackOf, filter, rows);
        }
    }
}
function pushItem(sessionId, item, open, trackOf, filter, rows) {
    if (item.kind === 'sidecar') {
        if (!rowVisible('sidecar', item.purpose, filter))
            return;
        const key = rowKey(sessionId, item.id);
        rows.push({
            sessionId, nodeId: item.id, key, kind: 'sidecar', status: item.status,
            expandable: false, activateId: item.id,
        });
        return;
    }
    if (item.kind === 'unlinked') {
        if (!rowVisible('unlinked', undefined, filter))
            return;
        const key = rowKey(sessionId, item.id);
        const expandable = childExpandable(item.childMode);
        const expanded = open[key] ?? defaultExpanded('unlinked', 'ok');
        rows.push({
            sessionId, nodeId: item.id, key, kind: 'unlinked', status: 'ok', expandable, activateId: item.id,
        });
        if (expanded && expandable)
            walk(item.childSessionId, trackOf(item.childSessionId), open, trackOf, filter, rows);
        return;
    }
    if (!rowVisible('step', undefined, filter))
        return;
    const key = rowKey(sessionId, item.id);
    const expanded = open[key] ?? defaultExpanded('step', item.status);
    const latest = item.attempts[item.attempts.length - 1];
    const canExpand = item.attempts.length > 0 || item.tools.length > 0 || (item.searches?.length ?? 0) > 0;
    rows.push({
        sessionId, nodeId: item.id, key, kind: 'step', status: item.status, expandable: canExpand,
        activateId: latest?.id ?? item.id,
        ...(latest !== undefined ? { attemptId: latest.id } : {}),
    });
    if (!expanded)
        return;
    for (const entry of stepEntries(item)) {
        if (entry.kind === 'attempt') {
            if (!rowVisible('attempt', undefined, filter))
                continue;
            rows.push({
                sessionId, nodeId: entry.attempt.id, key: rowKey(sessionId, entry.attempt.id), kind: 'attempt',
                status: entry.attempt.status, expandable: false, activateId: entry.attempt.id, attemptId: entry.attempt.id,
            });
            continue;
        }
        if (entry.kind === 'search') {
            if (!rowVisible('sidecar', entry.search.purpose, filter))
                continue;
            rows.push({
                sessionId, nodeId: entry.search.id, key: rowKey(sessionId, entry.search.id), kind: 'sidecar',
                status: entry.search.status, expandable: false, activateId: entry.search.id,
            });
            continue;
        }
        if (!rowVisible('tool', undefined, filter))
            continue;
        const childKey = rowKey(sessionId, entry.tool.id);
        const expandable = entry.tool.childSessionId !== undefined && childExpandable(entry.tool.childMode);
        const childOpen = open[childKey] ?? defaultExpanded('tool', entry.tool.status);
        rows.push({
            sessionId, nodeId: entry.tool.id, key: childKey, kind: 'tool', status: entry.tool.status,
            expandable, activateId: entry.tool.id,
        });
        for (const search of entry.tool.searches ?? []) {
            if (!rowVisible('sidecar', search.purpose, filter))
                continue;
            rows.push({
                sessionId, nodeId: search.id, key: rowKey(sessionId, search.id), kind: 'sidecar',
                status: search.status, expandable: false, activateId: search.id,
            });
        }
        if (childOpen && expandable && entry.tool.childSessionId !== undefined) {
            walk(entry.tool.childSessionId, trackOf(entry.tool.childSessionId), open, trackOf, filter, rows);
        }
    }
}
//# sourceMappingURL=Tree.js.map