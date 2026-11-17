import { classifyWindow } from '../shared/classify.js';
import { absentFigure, billOf, cacheHitRate, estimateDelta, estimatedFigure, parseUsage, sumUsage, usageFigure, } from '../shared/figures.js';
import { firstResponses, toolClock } from '../shared/timing.js';
import { summarizeTurnEvents } from './events.js';
const CATEGORIES = [
    'system', 'user', 'tools', 'tool-results', 'injection', 'skill', 'history',
];
export function selectAttempt(turn, attemptId) {
    if (attemptId !== undefined && attemptId.length > 0) {
        for (const step of stepsOf(turn)) {
            const attempt = step.attempts.find(item => item.id === attemptId);
            if (attempt !== undefined)
                return { attempt, step };
        }
    }
    let last;
    let lastOk;
    for (const step of stepsOf(turn)) {
        for (const attempt of step.attempts) {
            last = { attempt, step };
            if (attempt.status === 'ok')
                lastOk = last;
        }
    }
    return lastOk ?? last ?? {};
}
export function buildTurnReport(input) {
    const { turn } = input;
    const attempts = stepsOf(turn).flatMap(step => step.attempts);
    const attemptUsages = attempts.flatMap(attempt => attempt.usage === undefined ? [] : [attempt.usage]);
    const compaction = compactionUsages(input.events, turn);
    const reported = [...attemptUsages, ...compaction];
    const outputPending = turn.status === 'running' && reported.length === 0;
    const consumption = consumptionOf(attemptUsages, reported, compaction, turn, outputPending);
    const window = windowOf(input.messages, input.tools, input.attempt);
    const timing = timingOf(turn, input.readAt);
    return {
        kind: 'turn-report',
        id: turn.id,
        turn: turn.turn,
        status: turn.status,
        ...(turn.reason !== undefined ? { reason: turn.reason } : {}),
        startSeq: turn.startSeq,
        ...(turn.endSeq !== undefined ? { endSeq: turn.endSeq } : {}),
        ...(turn.startTime !== undefined ? { startTime: turn.startTime } : {}),
        ...(turn.endTime !== undefined ? { endTime: turn.endTime } : {}),
        readAt: input.readAt,
        outputPending,
        consumption,
        window,
        timing,
        events: summarizeTurnEvents(input.events, turn, window.inputSeq),
        subagents: subagentsOf(turn),
    };
}
function consumptionOf(attemptUsages, reported, compaction, turn, outputPending) {
    const bill = billOf(sumUsage(reported));
    const compactionBill = billOf(sumUsage(compaction));
    return {
        input: bill.input,
        output: outputPending ? absentFigure() : bill.output,
        total: bill.total,
        reasoning: bill.reasoning,
        cacheRead: bill.cacheRead,
        cacheWrite: bill.cacheWrite,
        hitRate: cacheHitRate(attemptUsages),
        compaction: compaction.length === 0 ? absentFigure() : compactionBill.total,
        ...(hasTitle(turn) ? { title: absentFigure() } : {}),
    };
}
function windowOf(messages, tools, attempt) {
    const classified = classifyWindow(Array.isArray(messages) ? messages : [], tools);
    const exact = billOf(attempt?.usage);
    const estimated = estimatedFigure(classified.estimatedTotal);
    const delta = estimateDelta(exact.input, estimated);
    return {
        ...(attempt !== undefined ? { attemptId: attempt.id, inputSeq: attempt.inputSeq } : {}),
        categories: CATEGORIES.filter(id => classified.totals[id] > 0).map(id => ({
            id,
            tokens: classified.totals[id],
        })),
        toolDefinitions: classified.tools.map(tool => ({ name: tool.name, tokens: tool.tokens })),
        ...(classified.definitionOverhead !== undefined ? { definitionOverhead: classified.definitionOverhead } : {}),
        toolResults: classified.toolResults.map(tool => ({ name: tool.name, tokens: tool.tokens, calls: tool.calls })),
        injections: classified.injections,
        skills: classified.skills,
        ...(classified.skillOverhead !== undefined ? { skillOverhead: classified.skillOverhead } : {}),
        estimated,
        exactInput: exact.input,
        ...(delta !== undefined ? { delta: delta.delta, consistent: delta.consistent } : {}),
        hitRate: cacheHitRate(attempt?.usage === undefined ? [] : [attempt.usage]),
    };
}
function timingOf(turn, readAt) {
    const attempts = stepsOf(turn).flatMap(step => step.attempts.map(attempt => ({ step, attempt })));
    const calls = attempts.map(({ step, attempt }) => ({
        attemptId: attempt.id,
        label: step.model ?? String(step.step),
        wait: attempt.waitMs === undefined ? absentFigure() : usageFigure(attempt.waitMs),
        think: attempt.thinkMs === undefined ? absentFigure() : usageFigure(attempt.thinkMs),
        ...(attempt.thinkMs === 0 ? { thinkNote: 'none' } : {}),
        ...(attempt.delayMs !== undefined ? { delayMs: attempt.delayMs } : {}),
        ...(attempt.firstVisible !== undefined ? { firstVisible: attempt.firstVisible } : {}),
    }));
    const waits = calls.flatMap(call => call.wait.basis === 'usage' && call.wait.value !== undefined ? [call.wait.value] : []);
    const thinks = calls.flatMap(call => call.think.basis === 'usage' && call.think.value !== undefined ? [call.think.value] : []);
    const responses = firstResponses({
        startTime: turn.startTime,
        startSeq: turn.startSeq,
        userInputs: turn.userInputs ?? [],
        visibles: attempts.flatMap(({ attempt }) => attempt.firstVisible === undefined ? [] : [attempt.firstVisible]),
    });
    const firsts = responses.map(response => ({
        opening: response.opening,
        noUserMessage: response.noUserMessage,
        seq: response.seq,
        start: response.start,
        ...(response.end !== undefined ? { end: response.end } : {}),
        duration: response.duration,
        pending: turn.status === 'running' && response.duration.basis === 'absent',
    }));
    const tools = stepsOf(turn).flatMap(step => step.tools.map(tool => ({
        id: tool.id,
        name: tool.name,
        ...(tool.startTime !== undefined ? { start: tool.startTime } : {}),
        ...(tool.endTime !== undefined ? { end: tool.endTime } : {}),
    })));
    const clock = toolClock(tools.flatMap(tool => (tool.start !== undefined && tool.end !== undefined ? [{ start: tool.start, end: tool.end }] : [])));
    const elapsed = elapsedOf(turn, readAt);
    return {
        elapsed: elapsed.figure,
        elapsedRunning: elapsed.running,
        wait: waits.length === 0 ? absentFigure() : usageFigure(waits.reduce((sum, value) => sum + value, 0)),
        think: thinks.length === 0 ? absentFigure() : usageFigure(thinks.reduce((sum, value) => sum + value, 0)),
        calls,
        firstResponses: firsts,
        tools,
        ...(tools.some(tool => tool.start !== undefined && tool.end !== undefined)
            ? { toolUnion: clock.union, toolSum: clock.sum }
            : {}),
    };
}
function elapsedOf(turn, readAt) {
    if (turn.startTime === undefined)
        return { figure: absentFigure(), running: false };
    if (turn.endTime !== undefined)
        return { figure: usageFigure(turn.endTime - turn.startTime), running: false };
    if (turn.status === 'running')
        return { figure: usageFigure(Math.max(0, readAt - turn.startTime)), running: true };
    return { figure: absentFigure(), running: false };
}
function compactionUsages(events, turn) {
    const usages = [];
    for (const event of events) {
        if (event.type !== 'compaction/summary')
            continue;
        if (event.seq < turn.startSeq)
            continue;
        if (turn.endSeq !== undefined && event.seq > turn.endSeq)
            continue;
        const data = event.data;
        const usage = data !== null && typeof data === 'object'
            ? parseUsage(data.usage)
            : undefined;
        if (usage !== undefined)
            usages.push(usage);
    }
    return usages;
}
function hasTitle(turn) {
    return turn.items.some(item => item.kind === 'sidecar' && item.purpose === 'session-title');
}
function subagentsOf(turn) {
    const lines = [];
    for (const item of turn.items) {
        if (item.kind === 'unlinked') {
            lines.push({
                sessionId: item.childSessionId,
                ...(item.childLabel !== undefined ? { label: item.childLabel } : {}),
                ...(item.childMode !== undefined ? { mode: item.childMode } : {}),
            });
        }
        if (item.kind !== 'step')
            continue;
        for (const tool of item.tools) {
            if (tool.childSessionId === undefined)
                continue;
            lines.push({
                sessionId: tool.childSessionId,
                ...(tool.childLabel !== undefined ? { label: tool.childLabel } : {}),
                ...(tool.childMode !== undefined ? { mode: tool.childMode } : {}),
            });
        }
    }
    return lines;
}
function stepsOf(turn) {
    return turn.items.filter((item) => item.kind === 'step');
}
//# sourceMappingURL=turn.js.map