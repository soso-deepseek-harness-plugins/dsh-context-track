/**
 * Fixed-density token heuristic.
 * About four characters make one token. Ordinary blocks add 4. A role adds 4.
 * System prompts skip the per-block add. Images with a size use a patch grid.
 */
const CHARS_PER_TOKEN = 4;
const BLOCK_OVERHEAD = 4;
const ROLE_OVERHEAD = 4;
/** Vision constants: patch 14, 3× downsample, 1024 token cap, 544² minimum. */
const PATCH = 14;
const DOWNSAMPLE = 3;
const MAX_IMAGE_TOKENS = 1024;
const MIN_PIXELS = 295936;
/** Content price of one text block, including the block overhead. `abcd` is 5. */
export function contentPrice(text) {
    return charTokens(text) + BLOCK_OVERHEAD;
}
/** Bare character tokens for one fragment, without block or role overhead. */
export function textTokens(text) {
    return charTokens(text);
}
/** System prompt price: character tokens plus the role, and no per-block overhead. */
export function estimateSystemText(text) {
    return charTokens(text) + ROLE_OVERHEAD;
}
function charTokens(text) {
    return Math.ceil(text.length / CHARS_PER_TOKEN);
}
function jsonLength(value) {
    try {
        const json = JSON.stringify(value);
        return json === undefined ? 0 : json.length;
    }
    catch {
        return 0;
    }
}
function density(value) {
    return Math.ceil(jsonLength(value) / CHARS_PER_TOKEN);
}
/**
 * LLM tokens for one image after the official resize.
 * `[IMAGE_START] + ([IMAGE] * width + newline) * height + [IMAGE_END]`, capped at 1024.
 */
export function imagePatchTokens(width, height) {
    let w = width;
    let h = height;
    if (w > 0 && h > 0 && w * h < MIN_PIXELS) {
        const ratio = Math.sqrt(MIN_PIXELS / (w * h));
        w = Math.trunc(w * ratio);
        h = Math.trunc(h * ratio);
    }
    let bestWidth = Math.ceil(w / PATCH) * PATCH;
    let bestHeight = Math.ceil(h / PATCH) * PATCH;
    let [rows, cols] = llmGrid(bestHeight, bestWidth);
    if (numImageTokens(rows, cols) > MAX_IMAGE_TOKENS) {
        const solved = solveResize(h, w);
        bestHeight = solved.height;
        bestWidth = solved.width;
        [rows, cols] = llmGrid(bestHeight, bestWidth);
    }
    return numImageTokens(rows, cols);
}
function llmGrid(bestHeight, bestWidth) {
    return [
        Math.ceil(Math.floor(bestHeight / PATCH) / DOWNSAMPLE),
        Math.ceil(Math.floor(bestWidth / PATCH) / DOWNSAMPLE),
    ];
}
function numImageTokens(rows, cols) {
    return rows * (cols + 1) + 2;
}
function solveResize(height, width) {
    const ratio = width === 0 ? 0 : height / width;
    const maxWidth = ratio === 0 ? 0 : Math.sqrt((MAX_IMAGE_TOKENS - 2) / ratio + 0.25) - 0.5;
    const maxHeight = maxWidth * ratio;
    const cell = PATCH * DOWNSAMPLE;
    if (maxWidth < 1)
        return { height: Math.floor((MAX_IMAGE_TOKENS - 2) / 2) * cell, width: cell };
    if (maxHeight < 1)
        return { height: cell, width: (MAX_IMAGE_TOKENS - 3) * cell };
    const beta = Math.min((Math.floor(maxWidth) * cell) / width, (Math.floor(maxHeight) * cell) / height);
    return {
        height: Math.floor((height * beta) / PATCH) * PATCH,
        width: Math.floor((width * beta) / PATCH) * PATCH,
    };
}
export function imageSize(block) {
    if (block === null || typeof block !== 'object')
        return undefined;
    const attachment = block.attachment;
    if (attachment === null || typeof attachment !== 'object')
        return undefined;
    const source = attachment;
    const width = sizeField(source, ['width', 'pixelWidth']);
    const height = sizeField(source, ['height', 'pixelHeight']);
    if (width === undefined || height === undefined)
        return undefined;
    return { width, height };
}
function sizeField(source, keys) {
    for (const key of keys) {
        const value = source[key];
        if (typeof value === 'number' && Number.isFinite(value) && value > 0)
            return value;
    }
    return undefined;
}
function blockPrice(block, system) {
    if (block === null || typeof block !== 'object')
        return 0;
    const row = block;
    if (row.type === 'text' || row.type === 'reasoning') {
        const text = typeof row.text === 'string' ? row.text : '';
        const chars = charTokens(text);
        return system ? chars : chars + BLOCK_OVERHEAD;
    }
    if (row.type === 'image') {
        const size = imageSize(row);
        if (size !== undefined)
            return imagePatchTokens(size.width, size.height);
    }
    const tokens = density(row);
    return system ? tokens : tokens + BLOCK_OVERHEAD;
}
function contentOf(message) {
    if (message === null || typeof message !== 'object')
        return [];
    const content = message.content;
    return Array.isArray(content) ? content : [];
}
/** An assistant placeholder with no content is free. It does not pay the role overhead. */
export function isEmptyAssistant(message) {
    if (message === null || typeof message !== 'object')
        return false;
    if (message.role !== 'assistant')
        return false;
    const content = contentOf(message);
    if (content.length === 0)
        return true;
    return content.every(block => {
        if (block === null || typeof block !== 'object')
            return false;
        const row = block;
        if (row.type !== 'text' && row.type !== 'reasoning')
            return false;
        return typeof row.text !== 'string' || row.text.length === 0;
    });
}
export function isNonEmptySystem(message) {
    if (message === null || typeof message !== 'object')
        return false;
    if (message.role !== 'system')
        return false;
    return contentOf(message).some(block => {
        if (block === null || typeof block !== 'object')
            return false;
        const row = block;
        if (row.type === 'text' || row.type === 'reasoning')
            return typeof row.text === 'string' && row.text.trim().length > 0;
        return true;
    });
}
/** Price one message. System messages skip the per-block overhead. */
export function estimateMessage(message, system = false) {
    if (isEmptyAssistant(message))
        return 0;
    const blocks = contentOf(message).reduce((sum, block) => sum + blockPrice(block, system), 0);
    return blocks + ROLE_OVERHEAD;
}
/** Whole tool table, each tool, and the wrapper gap when the table is more expensive. */
export function estimateTools(tools) {
    if (!Array.isArray(tools) || tools.length === 0)
        return { table: 0, tools: [] };
    const table = density(tools) + BLOCK_OVERHEAD;
    const priced = tools.map(tool => ({
        name: toolName(tool),
        tokens: density(tool),
        definition: tool,
    }));
    const parts = priced.reduce((sum, tool) => sum + tool.tokens, 0);
    const overhead = table - parts;
    return {
        table,
        tools: priced,
        ...(overhead > 0 ? { overhead } : {}),
    };
}
function toolName(tool) {
    if (tool !== null && typeof tool === 'object' && typeof tool.name === 'string') {
        const name = tool.name;
        if (name.length > 0)
            return name;
    }
    return 'tool';
}
//# sourceMappingURL=estimate.js.map