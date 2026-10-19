/**
 * Client face of the host `track` remote. Methods return promises.
 */
import type { RemoteResult, TypertRemoteNamespace } from '@deepseek-ai/dsh-typert-protocol'
import type { NodeDetail } from '../shared/detail.js'

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

export type { NodeDetail }
