/** Strict boundary codec. The gateway checks the mode; parsing stays local. */
function strictCodec(typeSymbol, parse) {
    return {
        mode: 'strict',
        typeSymbol,
        create: () => ({ parse }),
        jsonSchema: { description: typeSymbol },
    };
}
const stringCodec = strictCodec('string', value => {
    if (typeof value !== 'string')
        throw new Error('dsh-context-track: remote argument must be a string');
    return value;
});
/** Mount this before reading `ctx.remote.track`. Nothing else publishes the namespace. */
export const trackRemote = {
    package: 'dsh-context-track',
    descriptors: [{
            id: 'dsh-context-track#track/getNode',
            service: 'track',
            namespace: 'track',
            method: 'getNode',
            invocation: { kind: 'direct' },
            parameters: [
                { name: 'sessionId', wire: 'sessionId', source: 'json', codec: stringCodec },
                { name: 'nodeId', wire: 'nodeId', source: 'json', codec: stringCodec },
            ],
            cancellation: { parameter: 'signal' },
            result: strictCodec('dsh-context-track#NodeDetail', value => value),
        }, {
            id: 'dsh-context-track#track/getTurn',
            service: 'track',
            namespace: 'track',
            method: 'getTurn',
            invocation: { kind: 'direct' },
            parameters: [
                { name: 'sessionId', wire: 'sessionId', source: 'json', codec: stringCodec },
                { name: 'turnId', wire: 'turnId', source: 'json', codec: stringCodec },
                { name: 'attemptId', wire: 'attemptId', source: 'json', codec: stringCodec },
            ],
            cancellation: { parameter: 'signal' },
            result: strictCodec('dsh-context-track#TurnReport', value => value),
        }],
};
//# sourceMappingURL=remote.js.map