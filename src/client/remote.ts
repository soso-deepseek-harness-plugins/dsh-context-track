/**
 * Client face of the host `track` remote. Methods return promises.
 * The web profile does not pre-mount third-party namespaces, so the client
 * contribution below is what creates `remote.track`.
 */
import type { RemoteResult, TypertRemoteContribution, TypertRemoteNamespace } from '@deepseek-ai/dsh-typert-protocol'
import type { NodeDetail } from '../shared/detail.js'

/** Strict boundary codec. The gateway checks the mode; parsing stays local. */
function strictCodec(typeSymbol: string, parse: (value: unknown) => unknown): TypertRemoteContribution['descriptors'][number]['result'] {
  return {
    mode: 'strict',
    typeSymbol,
    create: () => ({ parse }),
    jsonSchema: { description: typeSymbol },
  }
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteMap {
    'track/getNode'(
      sessionId: string,
      nodeId: string,
      signal?: AbortSignal,
    ): Promise<RemoteResult<NodeDetail>>
  }

  interface TypertRemoteNamespaceMap {
    track: TypertRemoteNamespace<'track'>
  }
}

const stringCodec = strictCodec('string', value => {
  if (typeof value !== 'string') throw new Error('dsh-context-track: remote argument must be a string')
  return value
})

/** Mount this before reading `ctx.remote.track`. Nothing else publishes the namespace. */
export const trackRemote: TypertRemoteContribution = {
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
  }],
}

export type { NodeDetail }
