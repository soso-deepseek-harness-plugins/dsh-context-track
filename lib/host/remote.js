var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
/**
 * `getNode` reads one index node. Agent steps replay a log prefix. Sidecars read
 * the events that recorded them. A missing session is a normal result, not an exception.
 */
import { join } from 'node:path';
import { SessionId } from '@deepseek-ai/dsh-session';
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { findNode, } from '../shared/model.js';
import { foldAll } from './fold.js';
import { inputFields, materializePrefix, withAttemptOutput } from './materialize.js';
import { buildTurnReport, selectAttempt } from './turn.js';
import { compactionDetail, compactionOrdinal, searchDetail, titleDetail } from './sidecar.js';
import { pairInstruction, Supplement } from './supplement.js';
/** One observation's detail cache. The same `inputSeq` is not folded twice. */
export class ObservationCache {
    values = new Map();
    get(sessionId, key) {
        return this.values.get(sessionId)?.get(key);
    }
    set(sessionId, key, value) {
        let bucket = this.values.get(sessionId);
        if (bucket === undefined) {
            bucket = new Map();
            this.values.set(sessionId, bucket);
        }
        bucket.set(key, value);
        return value;
    }
    getOr(sessionId, key, produce) {
        const hit = this.get(sessionId, key);
        if (hit !== undefined)
            return hit;
        return this.set(sessionId, key, produce());
    }
    end(sessionId) {
        this.values.delete(sessionId);
    }
}
/** Host remote. Requires `sessionProjections` and `sessions`; persistence is optional. */
let TrackRemote = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _getTurn_decorators;
    let _getNode_decorators;
    return class TrackRemote extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getTurn_decorators = [Remote];
            _getNode_decorators = [Remote];
            __esDecorate(this, null, _getTurn_decorators, { kind: "method", name: "getTurn", static: false, private: false, access: { has: obj => "getTurn" in obj, get: obj => obj.getTurn }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getNode_decorators, { kind: "method", name: "getNode", static: false, private: false, access: { has: obj => "getNode" in obj, get: obj => obj.getNode }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static inject = ['sessionProjections', 'sessions'];
        reader = __runInitializers(this, _instanceExtraInitializers);
        cache = new ObservationCache();
        supplement;
        constructor(ctx, config) {
            super(ctx, 'track');
            this.supplement = new Supplement(isSupplementOptions(config) ? config : { directory: () => directoryOf(ctx) });
            ctx.inject(['sessionPersistence'], (child) => {
                const service = child.sessionPersistence;
                if (service !== undefined)
                    this.reader = service;
            });
            ctx.on('session/disposed', (session) => {
                this.cache.end(session.id);
            }, { global: true });
        }
        /**
         * Bill, window, clocks, and event list for one turn.
         * An empty `attemptId` uses the last successful attempt, or the last attempt.
         * The same `inputSeq` reuses the prefix fold `getNode` already fills. That fold
         * is only the input. Output and status are read from the current attempt.
         */
        async getTurn(sessionId, turnId, attemptId) {
            try {
                const loaded = await this.load(sessionId);
                if (loaded === undefined)
                    return { missing: true, target: 'session' };
                const found = findNode(loaded.state, turnId);
                if (found === undefined || found.kind !== 'turn')
                    return { missing: true, target: 'turn' };
                const selected = selectAttempt(found.node, attemptId);
                const projections = hostSessions(this.ctx).messageProjections;
                const inputSeq = selected.attempt?.inputSeq ?? loaded.events.length;
                const prefix = this.prefixAt(sessionId, loaded.events, inputSeq, projections);
                const attemptKey = selected.attempt?.id ?? 'running';
                return this.cache.getOr(sessionId, `report:${found.node.id}:${attemptKey}:${loaded.events.length}`, () => buildTurnReport({
                    events: loaded.events,
                    turn: found.node,
                    ...(selected.attempt !== undefined ? { attempt: selected.attempt } : {}),
                    messages: prefix.messages,
                    tools: prefix.tools,
                    readAt: Date.now(),
                }));
            }
            catch {
                return { missing: true, target: 'turn' };
            }
        }
        /**
         * Detail for one tree node.
         * @param sessionId - the session that owns the node. A child session is its own id.
         * @param nodeId - id from the trace index.
         * @returns the detail, or `{ missing: true }` when the session or node cannot be read.
         */
        async getNode(sessionId, nodeId) {
            try {
                const loaded = await this.load(sessionId);
                if (loaded === undefined)
                    return { missing: true };
                const found = findNode(loaded.state, nodeId);
                if (found === undefined)
                    return { missing: true };
                const projections = hostSessions(this.ctx).messageProjections;
                switch (found.kind) {
                    case 'attempt':
                        return this.attemptDetail(sessionId, loaded.events, found.node, found.step, loaded.state, projections);
                    case 'step': {
                        const latest = found.node.attempts.at(-1);
                        if (latest !== undefined) {
                            return this.attemptDetail(sessionId, loaded.events, latest, found.node, loaded.state, projections);
                        }
                        return this.runningDetail(sessionId, loaded.events, found.node, loaded.state, projections);
                    }
                    case 'tool':
                        return this.cache.getOr(sessionId, toolCacheKey(found.node), () => toolDetail(loaded.events, found.node));
                    case 'turn':
                        return turnDetail(found.node);
                    case 'unlinked':
                        return unlinkedDetail(found.node);
                    case 'sidecar':
                        return await this.sidecarDetail(sessionId, loaded.events, found.node, projections);
                    default:
                        return { missing: true };
                }
            }
            catch {
                return { missing: true };
            }
        }
        async sidecarDetail(sessionId, events, node, projections) {
            const key = `side:${node.requestSeq}:${node.status}:${node.outputSeq ?? 'open'}:${node.endSeq ?? 'open'}`;
            const hit = this.cache.get(sessionId, key);
            if (hit !== undefined)
                return hit;
            if (node.purpose === 'session-title')
                return this.cache.set(sessionId, key, titleDetail(events, node));
            if (node.purpose === 'web-search')
                return this.cache.set(sessionId, key, searchDetail(events, node));
            const instruction = await this.instruction(sessionId, events, node.requestSeq);
            return this.cache.set(sessionId, key, compactionDetail(events, node, projections, instruction));
        }
        async instruction(sessionId, events, requestSeq) {
            try {
                const lines = await this.supplement.lines(sessionId);
                return pairInstruction(lines, compactionOrdinal(events, requestSeq));
            }
            catch {
                return { recorded: false };
            }
        }
        /** Fold of `seq < inputSeq`. Stable for an append-only log, so it can be reused. */
        prefixAt(sessionId, events, inputSeq, projections) {
            return this.cache.getOr(sessionId, `input:${inputSeq}`, () => materializePrefix(events, inputSeq, projections));
        }
        /**
         * A step with no assistant event yet.
         * Keyed by the step and the log length: the next assistant event uses that
         * same seq as its input and must not inherit this running snapshot, and two
         * running steps share the window but not the added-context boundary.
         */
        runningDetail(sessionId, events, step, state, projections) {
            const inputSeq = events.length;
            const prefix = this.prefixAt(sessionId, events, inputSeq, projections);
            const newFrom = firstNewMessage(prefix.messageSeqs, newFromSeq(state, step));
            return this.cache.getOr(sessionId, `running:${step.id}:${inputSeq}`, () => ({
                kind: 'step',
                status: 'running',
                inputSeq,
                ...inputFields(prefix),
                ...(newFrom !== undefined ? { newFrom } : {}),
            }));
        }
        /** Status and output come from the attempt as it stands now. A later retry must not see the first snapshot. */
        attemptDetail(sessionId, events, attempt, step, state, projections) {
            const prefix = this.prefixAt(sessionId, events, attempt.inputSeq, projections);
            const newFrom = firstNewMessage(prefix.messageSeqs, newFromSeq(state, step, attempt.id));
            return withAttemptOutput(events, attempt, prefix, newFrom);
        }
        async load(sessionId) {
            const live = hostSessions(this.ctx).get(SessionId(sessionId));
            if (live !== undefined) {
                // The detail path has to replay a prefix. The index itself keeps no message bodies.
                const events = live.snapshotEvents();
                const state = this.ctx.sessionProjections.stateOf(live, 'track') ?? foldAll(events);
                return { events, state };
            }
            const reader = this.reader;
            if (reader === undefined)
                return undefined;
            let page;
            try {
                page = await reader.open(sessionId, 'read');
                const read = await page.read(0);
                return { events: read.events, state: foldAll(read.events) };
            }
            catch {
                return undefined;
            }
            finally {
                await page?.close().catch(() => undefined);
            }
        }
    };
})();
export { TrackRemote };
function hostSessions(ctx) {
    return ctx.sessions;
}
function isSupplementOptions(value) {
    return value !== null && typeof value === 'object' && typeof value.directory === 'function';
}
/** Result, status, and child label can all arrive after the call is first opened. */
function toolCacheKey(node) {
    return [
        'tool',
        node.callSeq,
        node.status,
        node.resultSeq ?? 'open',
        node.childSessionId ?? '',
        node.childLabel ?? '',
        node.childMode ?? '',
    ].join(':');
}
function toolDetail(events, node) {
    const call = events.find(event => event.seq === node.callSeq);
    const result = node.resultSeq === undefined ? undefined : events.find(event => event.seq === node.resultSeq);
    const callData = call?.data !== null && typeof call?.data === 'object' ? call.data : undefined;
    return {
        kind: 'tool',
        name: node.name,
        callId: node.callId,
        status: node.status,
        arguments: typeof callData?.arguments === 'string' ? callData.arguments : '',
        ...(result !== undefined ? { result: result.data } : {}),
        ...(node.childSessionId !== undefined ? { childSessionId: node.childSessionId } : {}),
        ...(node.childLabel !== undefined ? { childLabel: node.childLabel } : {}),
        ...(node.childMode !== undefined ? { childMode: node.childMode } : {}),
    };
}
function turnDetail(node) {
    return {
        kind: 'turn',
        turn: node.turn,
        status: node.status,
        ...(node.reason !== undefined ? { reason: node.reason } : {}),
        startSeq: node.startSeq,
        ...(node.endSeq !== undefined ? { endSeq: node.endSeq } : {}),
    };
}
function unlinkedDetail(node) {
    return {
        kind: 'unlinked',
        childSessionId: node.childSessionId,
        ...(node.childLabel !== undefined ? { childLabel: node.childLabel } : {}),
        ...(node.childMode !== undefined ? { childMode: node.childMode } : {}),
    };
}
/**
 * Log seq where this call's added context starts. A retry adds the failed
 * call's output; a later step adds the previous step's output and tool results;
 * a turn's first step adds the user message that opened the round.
 */
function newFromSeq(state, step, attemptId) {
    const attemptIndex = attemptId === undefined ? -1 : step.attempts.findIndex(item => item.id === attemptId);
    if (attemptIndex > 0)
        return step.attempts[attemptIndex - 1]?.inputSeq;
    const turn = state.root.find((node) => node.kind === 'turn' && node.turn === step.turn);
    if (turn === undefined)
        return undefined;
    const steps = turn.items.filter((item) => item.kind === 'step');
    const index = steps.findIndex(item => item.id === step.id);
    const previous = index > 0 ? steps[index - 1] : undefined;
    if (previous !== undefined)
        return previous.attempts.at(-1)?.inputSeq ?? previous.startSeq;
    return turn.userInputs?.[0]?.seq;
}
/** Index of the first message at or after the boundary. Undefined means no marked card. */
function firstNewMessage(seqs, boundary) {
    if (boundary === undefined)
        return undefined;
    const index = seqs.findIndex(seq => seq >= boundary);
    return index >= 0 ? index : undefined;
}
function directoryOf(ctx) {
    try {
        const profile = ctx.profileContext?.dir;
        if (typeof profile === 'string' && profile.length > 0)
            return join(profile, 'dsh-context-track');
    }
    catch {
        // profileContext is absent outside a profile launch.
    }
    const home = process.env.DSH_HOME;
    if (home === undefined || home.length === 0)
        return undefined;
    return join(home, 'profiles', process.env.DSH_PROFILE ?? 'default', 'dsh-context-track');
}
//# sourceMappingURL=remote.js.map