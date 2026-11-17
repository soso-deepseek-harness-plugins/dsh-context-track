/**
 * Split one model window into token buckets.
 * Tool results are grouped by name. Their call count is the number of result messages.
 */
import { estimateMessage, estimateTools, isNonEmptySystem, textTokens } from './estimate.js';
const EMPTY_TOTALS = () => ({
    system: 0,
    user: 0,
    tools: 0,
    'tool-results': 0,
    injection: 0,
    skill: 0,
    history: 0,
});
/** Classify the messages and tool schemas one attempt actually saw. */
export function classifyWindow(messages, tools) {
    const list = Array.isArray(messages) ? messages : [];
    let systemIndex = -1;
    for (let index = list.length - 1; index >= 0; index -= 1) {
        if (isNonEmptySystem(list[index])) {
            systemIndex = index;
            break;
        }
    }
    const names = toolNames(list);
    const totals = EMPTY_TOTALS();
    const items = [];
    const resultMap = new Map();
    const injectionMap = new Map();
    const skillMap = new Map();
    let skillOverhead = 0;
    list.forEach((message, index) => {
        const category = categoryOf(message, index === systemIndex);
        if (category === undefined)
            return;
        const system = category === 'system';
        const tokens = estimateMessage(message, system);
        const toolName = category === 'tool-results' || category === 'skill' ? resultName(message, names) : undefined;
        if (category === 'tool-results' && toolName !== undefined) {
            const line = resultMap.get(toolName) ?? { name: toolName, tokens: 0, calls: 0 };
            line.tokens += tokens;
            line.calls += 1;
            resultMap.set(toolName, line);
        }
        if (category === 'injection') {
            addLine(injectionMap, sourceLabel(message), tokens);
        }
        if (category === 'skill') {
            const catalog = catalogLines(message);
            if (catalog === undefined) {
                addLine(skillMap, sourceLabel(message), tokens);
            }
            else {
                const listed = catalog.reduce((sum, line) => sum + line.tokens, 0);
                skillOverhead += Math.max(0, tokens - listed);
                for (const line of catalog)
                    addLine(skillMap, line.name, line.tokens);
            }
        }
        totals[category] += tokens;
        items.push({
            category,
            tokens,
            ...(roleOf(message) !== undefined ? { role: roleOf(message) } : {}),
            ...(toolName !== undefined ? { toolName } : {}),
            message,
        });
    });
    const priced = estimateTools(tools);
    totals.tools = priced.table;
    const estimatedTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);
    return {
        items,
        totals,
        tools: priced.tools,
        ...(priced.overhead !== undefined ? { definitionOverhead: priced.overhead } : {}),
        toolResults: [...resultMap.values()],
        injections: [...injectionMap.values()],
        skills: [...skillMap.values()],
        ...(skillOverhead > 0 ? { skillOverhead } : {}),
        estimatedTotal,
    };
}
function addLine(map, name, tokens) {
    const line = map.get(name) ?? { name, tokens: 0, calls: 0 };
    line.tokens += tokens;
    line.calls += 1;
    map.set(name, line);
}
function categoryOf(message, isSystemPrompt) {
    if (message === null || typeof message !== 'object')
        return undefined;
    if (isSystemPrompt)
        return 'system';
    if (isSkillMessage(message))
        return 'skill';
    const role = roleOf(message);
    if (role === 'tool')
        return 'tool-results';
    if (isInjection(message))
        return 'injection';
    if (role === 'assistant')
        return 'history';
    if (role === 'user' || role === 'developer')
        return 'user';
    return undefined;
}
function isSkillMessage(message) {
    const kind = sourceKind(message);
    if (kind === 'skill-invocation' || kind === 'skill-catalog')
        return true;
    if (roleOf(message) !== 'tool')
        return false;
    return toolText(message).includes('<skill_content>');
}
function isInjection(message) {
    const source = sourceOf(message);
    if (source === undefined)
        return false;
    const kind = typeof source.kind === 'string' ? source.kind : undefined;
    if (kind === 'user' || kind === 'model' || kind === 'tool' || kind === 'system-prompt')
        return false;
    if (kind === 'skill-invocation' || kind === 'skill-catalog')
        return false;
    return kind !== undefined || source.form !== undefined;
}
function resultName(message, names) {
    const callId = toolCallId(message);
    if (callId !== undefined && names.has(callId))
        return names.get(callId);
    return 'tool';
}
function toolNames(messages) {
    const names = new Map();
    for (const message of messages) {
        for (const block of contentBlocks(message)) {
            if (block.type !== 'tool-call')
                continue;
            if (typeof block.id !== 'string' || typeof block.name !== 'string' || block.name.length === 0)
                continue;
            names.set(block.id, block.name);
        }
    }
    return names;
}
function contentBlocks(message) {
    if (message === null || typeof message !== 'object')
        return [];
    const content = message.content;
    if (!Array.isArray(content))
        return [];
    return content.filter((block) => block !== null && typeof block === 'object');
}
function toolText(message) {
    return contentBlocks(message)
        .map(block => (typeof block.text === 'string' ? block.text : ''))
        .join('');
}
function roleOf(message) {
    if (message === null || typeof message !== 'object')
        return undefined;
    const role = message.role;
    return typeof role === 'string' ? role : undefined;
}
function sourceOf(message) {
    if (message === null || typeof message !== 'object')
        return undefined;
    const source = message.source;
    return source !== null && typeof source === 'object' ? source : undefined;
}
function sourceKind(message) {
    const kind = sourceOf(message)?.kind;
    return typeof kind === 'string' ? kind : undefined;
}
function toolCallId(message) {
    if (message === null || typeof message !== 'object')
        return undefined;
    const direct = message.toolCallId;
    if (typeof direct === 'string' && direct.length > 0)
        return direct;
    const nested = sourceOf(message)?.callId;
    return typeof nested === 'string' && nested.length > 0 ? nested : undefined;
}
/** A short source label for an injection or skill row. Bodies stay out of the label. */
export function sourceLabel(message) {
    const source = sourceOf(message);
    if (source === undefined)
        return 'injection';
    for (const key of ['path', 'file', 'filename', 'name', 'label', 'uri', 'skill']) {
        const value = source[key];
        if (typeof value === 'string' && value.length > 0)
            return value;
    }
    return typeof source.kind === 'string' ? source.kind : 'injection';
}
/**
 * Split a skill catalog into one line per listed skill, the way tools are split.
 * The structured source carries each entry; older logs fall back to the list text.
 */
function catalogLines(message) {
    const source = sourceOf(message);
    if (source?.kind !== 'skill-catalog')
        return undefined;
    const entries = source.entries;
    const lines = [];
    if (Array.isArray(entries)) {
        for (const entry of entries) {
            if (entry === null || typeof entry !== 'object')
                continue;
            const row = entry;
            const name = typeof row.name === 'string' && row.name.length > 0 ? row.name : undefined;
            if (name === undefined)
                continue;
            const description = typeof row.description === 'string' ? row.description : '';
            lines.push({ name, tokens: textTokens(`- \`${name}\`: ${description}\n`) });
        }
    }
    return lines.length > 0 ? lines : catalogTextLines(message);
}
function catalogTextLines(message) {
    const body = /<available_skills>([\s\S]*?)<\/available_skills>/.exec(toolText(message))?.[1];
    if (body === undefined)
        return undefined;
    const lines = [];
    for (const line of body.split('\n')) {
        const match = /^\s*-\s+`([^`]+)`/.exec(line);
        if (match === null)
            continue;
        lines.push({ name: match[1], tokens: textTokens(`${line}\n`) });
    }
    return lines.length > 0 ? lines : undefined;
}
//# sourceMappingURL=classify.js.map