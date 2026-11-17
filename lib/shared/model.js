/** Trace index: sequence numbers and scalars only. No message bodies. */
export const TRACK_STATE_VERSION = 4;
export function emptyTrack() {
    return { stateVersion: TRACK_STATE_VERSION, root: [] };
}
export function attemptId(turn, step, attempt) {
    return `attempt:${turn}:${step}:${attempt}`;
}
export function stepId(turn, step) {
    return `step:${turn}:${step}`;
}
export function turnId(turn) {
    return `turn:${turn}`;
}
export function toolId(callSeq) {
    return `tool:${callSeq}`;
}
export function sidecarId(requestSeq) {
    return `sidecar:${requestSeq}`;
}
export function unlinkedId(childSessionId) {
    return `unlinked:${childSessionId}`;
}
/** Locate one index node by the id the client sends to `getNode`. */
export function findNode(state, id) {
    for (const root of state.root) {
        const found = findInRoot(root, id);
        if (found)
            return found;
    }
    return undefined;
}
function findInRoot(node, id) {
    if (node.kind === 'sidecar')
        return node.id === id ? { kind: 'sidecar', node } : undefined;
    if (node.kind === 'unlinked')
        return node.id === id ? { kind: 'unlinked', node } : undefined;
    if (node.id === id)
        return { kind: 'turn', node };
    for (const item of node.items) {
        if (item.kind === 'sidecar' && item.id === id)
            return { kind: 'sidecar', node: item };
        if (item.kind === 'unlinked' && item.id === id)
            return { kind: 'unlinked', node: item };
        if (item.kind !== 'step')
            continue;
        if (item.id === id)
            return { kind: 'step', node: item };
        for (const search of item.searches ?? []) {
            if (search.id === id)
                return { kind: 'sidecar', node: search };
        }
        for (const attempt of item.attempts) {
            if (attempt.id === id)
                return { kind: 'attempt', node: attempt, step: item };
        }
        for (const tool of item.tools) {
            if (tool.id === id)
                return { kind: 'tool', node: tool };
            for (const search of tool.searches ?? []) {
                if (search.id === id)
                    return { kind: 'sidecar', node: search };
            }
        }
    }
    return undefined;
}
/**
 * A fork header points at a parent but is not a call. Only `origin: "subagent"`
 * is a call relationship, and even then the parent log — not this header —
 * decides where the child hangs.
 */
export function isSubagentOrigin(header) {
    return header.origin === 'subagent' && typeof header.parentSession === 'string' && header.parentSession.length > 0;
}
/**
 * Every row starts open so the whole call tree is readable at first paint.
 * The choice stays in the component; a user collapse survives until a later
 * node is opened with the chevron.
 */
export function defaultExpanded(_kind, _status) {
    return true;
}
/** An external child has no local log, so the tree does not offer a chevron. */
export function childExpandable(mode) {
    return mode !== 'external';
}
/** Toggle one id. `open` is component state; this never writes a projection. */
export function toggleExpanded(open, id, fallback) {
    const current = open[id] ?? fallback;
    return { ...open, [id]: !current };
}
//# sourceMappingURL=model.js.map