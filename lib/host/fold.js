import { attemptId, emptyTrack, sidecarId, stepId, toolId, turnId, unlinkedId, } from '../shared/model.js';
import { streamMetrics, waitMs } from '../shared/timing.js';
/** Fold one event. A throw leaves the previous state in place so session append continues. */
export function applyTrack(state, event) {
    try {
        return fold(state, event);
    }
    catch {
        return state;
    }
}
/** Fold a whole log from an empty index. */
export function foldAll(events) {
    let state = emptyTrack();
    for (const event of events)
        state = applyTrack(state, event);
    return state;
}
export function fold(state, event) {
    const type = event.type;
    switch (type) {
        case 'turn/start':
            return onTurnStart(state, event);
        case 'turn/end':
            return onTurnEnd(state, event);
        case 'step/start':
            return onStepStart(state, event);
        case 'step/end':
            return onStepEnd(state, event);
        case 'assistant/message':
            return onAssistantMessage(state, event);
        case 'assistant/attempt':
            return onAssistantAttempt(state, event);
        case 'llm/retry':
            return onRetry(state, event);
        case 'tool/call':
            return onToolCall(state, event);
        case 'tool/result':
            return onToolResult(state, event);
        case 'request/header':
            return onHeader(state, event);
        case 'user/message':
            return onUserMessage(state, event);
        case 'request/context':
        case 'system/message':
        case 'developer/message':
            return bumpRunning(state, event);
        case 'subagent/catalog':
            return onCatalog(state, event);
        case 'session/title-llm-request':
            return onTitleRequest(state, event);
        case 'session/title':
            return onTitle(state, event);
        case 'compaction/start':
            return onCompactionStart(state, event);
        case 'compaction/summary':
            return onCompactionSummary(state, event);
        case 'compaction/end':
            return onCompactionEnd(state, event);
        case 'web/deepseek-search-llm-request':
            return onSearch(state, event);
        default:
            return state;
    }
}
function record(event) {
    const data = event.data;
    return data !== null && typeof data === 'object' ? data : {};
}
function num(value) {
    return typeof value === 'number' && Number.isSafeInteger(value) ? value : undefined;
}
function str(value) {
    return typeof value === 'string' ? value : undefined;
}
function usageOf(value) {
    if (value === null || typeof value !== 'object')
        return undefined;
    const source = value;
    if (typeof source.inputTokens !== 'number' || typeof source.outputTokens !== 'number')
        return undefined;
    const usage = { inputTokens: source.inputTokens, outputTokens: source.outputTokens };
    for (const key of ['totalTokens', 'cacheReadTokens', 'cacheWriteTokens', 'reasoningTokens']) {
        const item = source[key];
        if (typeof item === 'number')
            usage[key] = item;
    }
    return usage;
}
function seqOf(node) {
    if (node.kind === 'turn' || node.kind === 'step')
        return node.startSeq ?? 0;
    if (node.kind === 'sidecar')
        return node.requestSeq ?? 0;
    return node.catalogSeq ?? 0;
}
function replaceRoot(state, id, next) {
    let changed = false;
    const root = state.root.map(node => {
        if (node.id !== id)
            return node;
        changed = true;
        return next;
    });
    return changed ? { ...state, root } : state;
}
function mapTurn(state, turnNumber, update) {
    let changed = false;
    const root = state.root.map(node => {
        if (node.kind !== 'turn' || node.turn !== turnNumber)
            return node;
        const next = update(node);
        if (next !== node)
            changed = true;
        return next;
    });
    return changed ? { ...state, root } : state;
}
function openTurn(state) {
    for (let index = state.root.length - 1; index >= 0; index -= 1) {
        const node = state.root[index];
        if (node?.kind === 'turn' && node.status === 'running')
            return node;
    }
    return undefined;
}
function turnByNumber(state, turnNumber) {
    return state.root.find((node) => node.kind === 'turn' && node.turn === turnNumber);
}
function runningStep(turn) {
    for (let index = turn.items.length - 1; index >= 0; index -= 1) {
        const item = turn.items[index];
        if (item?.kind === 'step' && item.status === 'running')
            return item;
    }
    return undefined;
}
function withBodyItem(turn, item) {
    const unlinked = turn.items.filter(entry => entry.kind === 'unlinked');
    const body = [...turn.items.filter(entry => entry.kind !== 'unlinked'), item];
    body.sort((left, right) => seqOf(left) - seqOf(right));
    return { ...turn, items: [...body, ...unlinked] };
}
function replaceItem(turn, id, next) {
    let changed = false;
    const items = turn.items.map(item => {
        if (item.id !== id)
            return item;
        changed = true;
        return next;
    });
    return changed ? { ...turn, items } : turn;
}
function placeRoot(state, node) {
    const unlinked = state.root.filter(entry => entry.kind === 'unlinked');
    const body = [...state.root.filter(entry => entry.kind !== 'unlinked'), node];
    body.sort((left, right) => seqOf(left) - seqOf(right));
    return { ...state, root: [...body, ...unlinked] };
}
function onTurnStart(state, event) {
    const turnNumber = num(record(event).turn);
    if (turnNumber === undefined)
        return state;
    if (turnByNumber(state, turnNumber))
        return state;
    const turn = {
        kind: 'turn',
        id: turnId(turnNumber),
        turn: turnNumber,
        status: 'running',
        startSeq: event.seq,
        startTime: event.time,
        items: [],
    };
    return placeRoot(state, turn);
}
function statusOfReason(kind) {
    if (kind === 'aborted')
        return 'aborted';
    if (kind === 'error' || kind === 'blocked')
        return 'error';
    return 'ok';
}
function closeStep(step, status, endSeq, endTime) {
    if (step.status !== 'running')
        return step;
    return { ...step, status, endSeq, endTime };
}
function onTurnEnd(state, event) {
    const data = record(event);
    const turnNumber = num(data.turn);
    if (turnNumber === undefined)
        return state;
    const reason = data.reason;
    const kind = reason !== null && typeof reason === 'object' ? str(reason.kind) : undefined;
    const status = statusOfReason(kind);
    return mapTurn(state, turnNumber, turn => {
        if (turn.endSeq !== undefined)
            return turn;
        return {
            ...turn,
            status,
            endSeq: event.seq,
            endTime: event.time,
            ...(kind !== undefined ? { reason: kind } : {}),
            items: turn.items.map(item => item.kind === 'step' ? closeStep(item, status === 'running' ? 'ok' : status, event.seq, event.time) : item),
        };
    });
}
function onStepStart(state, event) {
    const data = record(event);
    const turnNumber = num(data.turn);
    const stepNumber = num(data.step);
    if (turnNumber === undefined || stepNumber === undefined)
        return state;
    const turn = turnByNumber(state, turnNumber);
    if (!turn)
        return state;
    if (turn.items.some(item => item.kind === 'step' && item.step === stepNumber))
        return state;
    const step = {
        kind: 'step',
        id: stepId(turnNumber, stepNumber),
        turn: turnNumber,
        step: stepNumber,
        status: 'running',
        startSeq: event.seq,
        startTime: event.time,
        inputSeq: event.seq + 1,
        attempts: [],
        tools: [],
    };
    return replaceRoot(state, turn.id, withBodyItem(turn, step));
}
function onStepEnd(state, event) {
    const data = record(event);
    const turnNumber = num(data.turn);
    const stepNumber = num(data.step);
    if (turnNumber === undefined || stepNumber === undefined)
        return state;
    return mapTurn(state, turnNumber, turn => {
        const step = turn.items.find((item) => item.kind === 'step' && item.step === stepNumber);
        if (!step || step.status !== 'running')
            return turn;
        const failed = step.attempts.some(attempt => attempt.status === 'error' || attempt.status === 'aborted');
        const succeeded = step.attempts.some(attempt => attempt.status === 'ok');
        const status = succeeded || step.attempts.length === 0 ? 'ok' : failed ? 'error' : 'ok';
        return replaceItem(turn, step.id, { ...step, status, endSeq: event.seq, endTime: event.time });
    });
}
function addAttempt(state, event, status, usage, interrupted) {
    const data = record(event);
    const turnNumber = num(data.turn);
    const stepNumber = num(data.step);
    if (turnNumber === undefined || stepNumber === undefined)
        return state;
    return mapTurn(state, turnNumber, turn => {
        const step = turn.items.find((item) => item.kind === 'step' && item.step === stepNumber);
        if (!step)
            return turn;
        const attemptNumber = step.attempts.length + 1;
        const metrics = streamMetrics(Array.isArray(data.stream) ? data.stream : []);
        const waited = waitMs(step.startTime, metrics.streamStart);
        const attempt = {
            id: attemptId(turnNumber, stepNumber, attemptNumber),
            attempt: attemptNumber,
            inputSeq: event.seq,
            outputSeq: event.seq,
            status,
            endTime: event.time,
            thinkMs: metrics.hasReasoning ? metrics.thinkMs : 0,
            ...(usage !== undefined ? { usage } : {}),
            ...(metrics.streamStart !== undefined ? { streamStart: metrics.streamStart } : {}),
            ...(waited !== undefined ? { waitMs: waited } : {}),
            ...(metrics.firstVisible !== undefined ? { firstVisible: metrics.firstVisible } : {}),
        };
        const searches = step.searches?.map(search => {
            if (search.origin?.kind !== 'step' || search.origin.attemptId !== undefined)
                return search;
            if (search.requestSeq > event.seq)
                return search;
            return {
                ...search,
                origin: { ...search.origin, attemptId: attempt.id, attempt: attemptNumber, outputSeq: event.seq },
            };
        });
        const next = {
            ...step,
            inputSeq: event.seq + 1,
            attempts: [...step.attempts, attempt],
            ...(usage !== undefined ? { usage } : {}),
            ...(searches !== undefined ? { searches } : {}),
        };
        void interrupted;
        return replaceItem(turn, step.id, next);
    });
}
function onAssistantMessage(state, event) {
    const data = record(event);
    const interrupted = data.interrupted === true ? true : undefined;
    return addAttempt(state, event, interrupted ? 'aborted' : 'ok', usageOf(data.usage), interrupted);
}
function onAssistantAttempt(state, event) {
    return addAttempt(state, event, 'error', undefined);
}
function onRetry(state, event) {
    const data = record(event);
    const turnNumber = num(data.turn);
    const stepNumber = num(data.step);
    if (turnNumber === undefined || stepNumber === undefined)
        return state;
    return mapTurn(state, turnNumber, turn => {
        const step = turn.items.find((item) => item.kind === 'step' && item.step === stepNumber);
        const last = step?.attempts.at(-1);
        if (!step || !last || last.retrySeq !== undefined)
            return turn;
        const delayMs = typeof data.delayMs === 'number' ? data.delayMs : undefined;
        const attempts = step.attempts.map((attempt, index) => index === step.attempts.length - 1
            ? {
                ...attempt,
                retrySeq: event.seq,
                status: 'error',
                ...(delayMs !== undefined ? { delayMs } : {}),
            }
            : attempt);
        return replaceItem(turn, step.id, { ...step, inputSeq: event.seq + 1, attempts });
    });
}
function onToolCall(state, event) {
    const data = record(event);
    const turnNumber = num(data.turn);
    const stepNumber = num(data.step);
    const callId = str(data.callId);
    const name = str(data.name);
    if (turnNumber === undefined || stepNumber === undefined || callId === undefined || name === undefined)
        return state;
    return mapTurn(state, turnNumber, turn => {
        const step = turn.items.find((item) => item.kind === 'step' && item.step === stepNumber);
        if (!step || step.tools.some(tool => tool.callId === callId))
            return turn;
        const tool = {
            kind: 'tool',
            id: toolId(event.seq),
            callId,
            name,
            status: 'running',
            callSeq: event.seq,
            startTime: event.time,
        };
        return replaceItem(turn, step.id, { ...step, inputSeq: event.seq + 1, tools: [...step.tools, tool] });
    });
}
function subagentIdFromResult(message) {
    if (message === null || typeof message !== 'object')
        return undefined;
    const content = message.content;
    if (!Array.isArray(content))
        return undefined;
    for (const block of content) {
        if (block === null || typeof block !== 'object')
            continue;
        const recordBlock = block;
        if (recordBlock.type !== 'text' || typeof recordBlock.text !== 'string')
            continue;
        try {
            const parsed = JSON.parse(recordBlock.text);
            if (typeof parsed.subagentId === 'string' && parsed.subagentId.length > 0)
                return parsed.subagentId;
        }
        catch {
            // Tool text that is not the activation JSON stays a normal tool.
        }
    }
    return undefined;
}
function onToolResult(state, event) {
    const data = record(event);
    const turnNumber = num(data.turn);
    const stepNumber = num(data.step);
    const message = data.message;
    const callId = message !== null && typeof message === 'object' ? str(message.toolCallId) : undefined;
    if (turnNumber === undefined || stepNumber === undefined || callId === undefined)
        return state;
    const childSessionId = subagentIdFromResult(message);
    const isError = message !== null && typeof message === 'object' && message.isError === true;
    return mapTurn(state, turnNumber, turn => {
        const step = turn.items.find((item) => item.kind === 'step' && item.step === stepNumber);
        if (!step)
            return turn;
        const tool = step.tools.find(entry => entry.callId === callId);
        if (!tool)
            return turn;
        const unlinked = childSessionId === undefined
            ? undefined
            : turn.items.find((item) => item.kind === 'unlinked' && item.childSessionId === childSessionId);
        const nextTool = {
            ...tool,
            status: isError ? 'error' : 'ok',
            resultSeq: event.seq,
            endTime: event.time,
            ...(childSessionId !== undefined ? { childSessionId } : {}),
            ...(unlinked?.childLabel !== undefined ? { childLabel: unlinked.childLabel } : {}),
            ...(unlinked?.childMode !== undefined ? { childMode: unlinked.childMode } : {}),
        };
        const tools = step.tools.map(entry => entry.id === tool.id ? nextTool : entry);
        let nextTurn = replaceItem(turn, step.id, { ...step, inputSeq: event.seq + 1, tools });
        if (unlinked) {
            nextTurn = { ...nextTurn, items: nextTurn.items.filter(item => item.id !== unlinked.id) };
        }
        return nextTurn;
    });
}
function onHeader(state, event) {
    const header = record(event).header;
    const config = header !== null && typeof header === 'object' ? header.config : undefined;
    const provider = config !== null && typeof config === 'object' ? str(config.provider) : undefined;
    const model = config !== null && typeof config === 'object' ? str(config.model) : undefined;
    const bumped = bumpRunning(state, event);
    if (provider === undefined && model === undefined)
        return bumped;
    const turn = openTurn(bumped);
    const step = turn ? runningStep(turn) : undefined;
    if (!turn || !step)
        return bumped;
    if (step.provider === provider && step.model === model)
        return bumped;
    return replaceRoot(bumped, turn.id, replaceItem(turn, step.id, {
        ...step,
        ...(provider !== undefined ? { provider } : {}),
        ...(model !== undefined ? { model } : {}),
    }));
}
function onUserMessage(state, event) {
    return bumpRunning(rememberUser(state, event), event);
}
function rememberUser(state, event) {
    const data = record(event);
    const source = data.source;
    const kind = source !== null && typeof source === 'object' ? str(source.kind) : undefined;
    if (kind !== 'user')
        return state;
    const turn = openTurn(state);
    if (!turn || turn.userInputs?.some(input => input.seq === event.seq))
        return state;
    return replaceRoot(state, turn.id, {
        ...turn,
        userInputs: [...(turn.userInputs ?? []), { seq: event.seq, time: event.time }],
    });
}
function bumpRunning(state, event) {
    const turn = openTurn(state);
    const step = turn ? runningStep(turn) : undefined;
    if (!turn || !step)
        return state;
    const inputSeq = event.seq + 1;
    if (step.inputSeq === inputSeq)
        return state;
    return replaceRoot(state, turn.id, replaceItem(turn, step.id, { ...step, inputSeq }));
}
function catalogFields(data) {
    const childId = str(data.childId);
    if (childId === undefined || childId.length === 0)
        return undefined;
    return { childId, mode: str(data.mode), label: str(data.label) };
}
function toolWithChild(turn, childId) {
    for (const item of turn.items) {
        if (item.kind !== 'step')
            continue;
        const tool = item.tools.find(entry => entry.childSessionId === childId);
        if (tool)
            return { step: item, tool };
    }
    return undefined;
}
function onCatalog(state, event) {
    const fields = catalogFields(record(event));
    if (!fields)
        return state;
    const turn = openTurn(state) ?? [...state.root].reverse().find((node) => node.kind === 'turn');
    if (!turn) {
        if (state.root.some(node => node.kind === 'unlinked' && node.childSessionId === fields.childId))
            return state;
        const node = {
            kind: 'unlinked',
            id: unlinkedId(fields.childId),
            childSessionId: fields.childId,
            catalogSeq: event.seq,
            ...(fields.label !== undefined ? { childLabel: fields.label } : {}),
            ...(fields.mode !== undefined ? { childMode: fields.mode } : {}),
        };
        return placeRoot(state, node);
    }
    const linked = toolWithChild(turn, fields.childId);
    if (linked) {
        const tool = {
            ...linked.tool,
            ...(fields.label !== undefined ? { childLabel: fields.label } : {}),
            ...(fields.mode !== undefined ? { childMode: fields.mode } : {}),
        };
        const tools = linked.step.tools.map(entry => entry.id === tool.id ? tool : entry);
        return replaceRoot(state, turn.id, replaceItem(turn, linked.step.id, { ...linked.step, tools }));
    }
    if (turn.items.some(item => item.kind === 'unlinked' && item.childSessionId === fields.childId))
        return state;
    const unlinked = {
        kind: 'unlinked',
        id: unlinkedId(fields.childId),
        childSessionId: fields.childId,
        catalogSeq: event.seq,
        ...(fields.label !== undefined ? { childLabel: fields.label } : {}),
        ...(fields.mode !== undefined ? { childMode: fields.mode } : {}),
    };
    return replaceRoot(state, turn.id, { ...turn, items: [...turn.items, unlinked] });
}
function hostTurn(state) {
    return openTurn(state);
}
function addSidecar(state, sidecar, turnNumber) {
    if (turnNumber === null)
        return placeRoot(state, sidecar);
    const turn = turnNumber === undefined ? hostTurn(state) : turnByNumber(state, turnNumber) ?? hostTurn(state);
    if (!turn)
        return placeRoot(state, sidecar);
    if (turn.items.some(item => item.id === sidecar.id))
        return state;
    return replaceRoot(state, turn.id, withBodyItem(turn, sidecar));
}
function onTitleRequest(state, event) {
    const sidecar = {
        kind: 'sidecar',
        id: sidecarId(event.seq),
        purpose: 'session-title',
        status: 'running',
        requestSeq: event.seq,
    };
    const closed = closePreviousTitle(state, event.seq);
    const turn = hostTurn(closed);
    return addSidecar(closed, sidecar, turn ? turn.turn : null);
}
function closePreviousTitle(state, beforeSeq) {
    return mapSidecars(state, sidecar => {
        if (sidecar.purpose !== 'session-title' || sidecar.requestSeq >= beforeSeq || sidecar.status !== 'running')
            return sidecar;
        return { ...sidecar, status: 'ok' };
    });
}
function onTitle(state, event) {
    const source = record(event).source;
    const kind = source !== null && typeof source === 'object' ? str(source.kind) : undefined;
    if (kind !== 'provider')
        return state;
    let target;
    for (const sidecar of sidecarsOf(state)) {
        if (sidecar.purpose !== 'session-title' || sidecar.requestSeq >= event.seq)
            continue;
        if (target === undefined || sidecar.requestSeq > target.requestSeq)
            target = sidecar;
    }
    if (!target || target.outputSeq !== undefined)
        return state;
    return mapSidecars(state, sidecar => sidecar.id === target?.id
        ? { ...sidecar, outputSeq: event.seq, status: 'ok' }
        : sidecar);
}
function onCompactionStart(state, event) {
    const data = record(event);
    const compactionId = str(data.compactionId);
    const turn = data.turn === null ? null : num(data.turn) ?? null;
    const sidecar = {
        kind: 'sidecar',
        id: sidecarId(event.seq),
        purpose: 'compaction',
        status: 'running',
        requestSeq: event.seq,
        ...(compactionId !== undefined ? { compactionId } : {}),
    };
    return addSidecar(state, sidecar, turn);
}
function onCompactionSummary(state, event) {
    const compactionId = str(record(event).compactionId);
    return mapSidecars(state, sidecar => {
        if (sidecar.purpose !== 'compaction' || sidecar.outputSeq !== undefined)
            return sidecar;
        if (compactionId !== undefined && sidecar.compactionId !== compactionId)
            return sidecar;
        return { ...sidecar, outputSeq: event.seq };
    });
}
function onCompactionEnd(state, event) {
    const data = record(event);
    const compactionId = str(data.compactionId);
    const error = str(data.error);
    return mapSidecars(state, sidecar => {
        if (sidecar.purpose !== 'compaction' || sidecar.endSeq !== undefined)
            return sidecar;
        if (compactionId !== undefined && sidecar.compactionId !== compactionId)
            return sidecar;
        return { ...sidecar, endSeq: event.seq, status: error !== undefined && error.length > 0 ? 'error' : 'ok' };
    });
}
function onSearch(state, event) {
    const sidecar = {
        kind: 'sidecar',
        id: sidecarId(event.seq),
        purpose: 'web-search',
        status: 'ok',
        requestSeq: event.seq,
        outputSeq: event.seq,
    };
    const turn = hostTurn(state);
    if (!turn)
        return placeRoot(state, sidecar);
    if (turnHasSearch(turn, sidecar.id))
        return state;
    const owner = webSearchOwner(turn, event.seq);
    if (owner) {
        const { step, tool } = owner;
        const nextTool = {
            ...tool,
            searches: [...(tool.searches ?? []), {
                    ...sidecar,
                    origin: { kind: 'tool', toolId: tool.id, callId: tool.callId, name: tool.name, callSeq: tool.callSeq },
                }],
        };
        const tools = step.tools.map(entry => entry.id === tool.id ? nextTool : entry);
        return replaceRoot(state, turn.id, replaceItem(turn, step.id, { ...step, tools }));
    }
    const step = stepForSeq(turn, event.seq);
    if (!step)
        return addSidecar(state, sidecar, turn.turn);
    const attempt = [...step.attempts].reverse().find(item => (item.outputSeq ?? item.inputSeq) <= event.seq);
    const placed = {
        ...sidecar,
        origin: {
            kind: 'step',
            stepId: step.id,
            step: step.step,
            ...(attempt !== undefined ? { attemptId: attempt.id, attempt: attempt.attempt, outputSeq: attempt.outputSeq } : {}),
        },
    };
    return replaceRoot(state, turn.id, replaceItem(turn, step.id, {
        ...step,
        searches: [...(step.searches ?? []), placed],
    }));
}
/** The step whose window contains `seq`, or the latest step that had already started. */
function stepForSeq(turn, seq) {
    const steps = turn.items.filter((item) => item.kind === 'step');
    const inside = [...steps].reverse().find(step => step.startSeq <= seq && (step.endSeq === undefined || seq <= step.endSeq));
    if (inside)
        return inside;
    return [...steps].reverse().find(step => step.startSeq <= seq);
}
/** The `web_search` call that is still running at `seq`. Other tools do not own a search. */
function webSearchOwner(turn, seq) {
    let open;
    for (const item of turn.items) {
        if (item.kind !== 'step')
            continue;
        for (const tool of item.tools) {
            if (tool.name !== 'web_search' || tool.callSeq > seq)
                continue;
            if (tool.resultSeq !== undefined && seq > tool.resultSeq)
                continue;
            if (open === undefined || tool.callSeq >= open.tool.callSeq)
                open = { step: item, tool };
        }
    }
    return open;
}
function turnHasSearch(turn, id) {
    for (const item of turn.items) {
        if (item.kind === 'sidecar' && item.id === id)
            return true;
        if (item.kind !== 'step')
            continue;
        if (item.searches?.some(search => search.id === id))
            return true;
        if (item.tools.some(tool => tool.searches?.some(search => search.id === id)))
            return true;
    }
    return false;
}
function* sidecarsOf(state) {
    for (const node of state.root) {
        if (node.kind === 'sidecar')
            yield node;
        if (node.kind !== 'turn')
            continue;
        for (const item of node.items) {
            if (item.kind === 'sidecar')
                yield item;
        }
    }
}
function mapSidecars(state, update) {
    let changed = false;
    const mapNode = (node) => {
        if (node.kind === 'sidecar') {
            const next = update(node);
            if (next !== node)
                changed = true;
            return next;
        }
        if (node.kind !== 'turn')
            return node;
        let turnChanged = false;
        const items = node.items.map(item => {
            if (item.kind !== 'sidecar')
                return item;
            const next = update(item);
            if (next !== item)
                turnChanged = true;
            return next;
        });
        if (!turnChanged)
            return node;
        changed = true;
        return { ...node, items };
    };
    const root = state.root.map(mapNode);
    return changed ? { ...state, root } : state;
}
//# sourceMappingURL=fold.js.map