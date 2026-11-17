/** Detail payloads. Message bodies are JSON values read from the session log at click time. */
export function isMissing(detail) {
    return 'missing' in detail && detail.missing === true;
}
//# sourceMappingURL=detail.js.map