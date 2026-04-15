/**
 * Canonical Head Durable Object
 * 
 * Maintains global verified chain state across all Worker instances
 * Persists header chain in Durable Object storage
 * Enforces single source of truth for canonical head
 * 
 * Cloudflare Durable Object implementation
 */

import { HeaderChain, BlockHeader, ValidationResult } from './header-chain'

export class CanonicalHeadDO {
  private state: DurableObjectState
  private chain: HeaderChain
  private initialized: boolean

  constructor(state: DurableObjectState) {
    this.state = state
    this.chain = new HeaderChain()
    this.initialized = false
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const method = request.method

    // Initialize chain from storage on first request
    if (!this.initialized) {
      await this.loadChainState()
      this.initialized = true
    }

    // API Routes
    if (method === 'GET' && url.pathname === '/head') {
      return Response.json(this.chain.getStatus())
    }

    if (method === 'POST' && url.pathname === '/header') {
      const header = await request.json() as BlockHeader
      // Convert number from string to bigint if needed
      if (typeof header.number === 'string') {
        header.number = BigInt(header.number)
      }

      const result = this.chain.addHeader(header)
      
      // Persist chain state after successful addition
      if (result.valid) {
        await this.persistChainState()
      }

      return Response.json(result)
    }

    if (method === 'POST' && url.pathname === '/verify') {
      const { stateRoot, proof } = await request.json()
      const valid = this.chain.verifyStateProof(stateRoot, proof)
      return Response.json({ valid })
    }

    if (method === 'POST' && url.pathname === '/reset') {
      this.chain.reset()
      await this.state.storage.deleteAll()
      return Response.json({ success: true })
    }

    return new Response('Not found', { status: 404 })
  }

  /**
   * Load chain state from Durable Object storage
   */
  private async loadChainState(): Promise<void> {
    try {
      const storedHeaders = await this.state.storage.get<BlockHeader[]>('headers') || []
      const headHash = await this.state.storage.get<string>('canonicalHead')

      // Reconstruct header chain
      for (const header of storedHeaders) {
        if (typeof header.number === 'string') {
          header.number = BigInt(header.number)
        }
        // Add without full validation (we already verified these before storage)
        this.chain['headers'].set(header.hash, header)
      }

      // Restore canonical head
      if (headHash && this.chain['headers'].has(headHash)) {
        this.chain['canonicalHead'] = this.chain['headers'].get(headHash) || null
      }

      console.log(`Loaded ${storedHeaders.length} headers from storage`)
    } catch (e) {
      console.error('Failed to load chain state:', e)
    }
  }

  /**
   * Persist chain state to Durable Object storage
   */
  private async persistChainState(): Promise<void> {
    const headers = Array.from(this.chain['headers'].values())
    const headHash = this.chain.getHead()?.hash

    await this.state.storage.put('headers', headers)
    
    if (headHash) {
      await this.state.storage.put('canonicalHead', headHash)
    }
  }
}

export default {
  async fetch(request: Request, env: any) {
    const id = env.CANONICAL_HEAD_DO.idFromName('global')
    const stub = env.CANONICAL_HEAD_DO.get(id)
    return stub.fetch(request)
  }
}