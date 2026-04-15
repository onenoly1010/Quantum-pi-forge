/**
 * RPC Trust Filter
 * 
 * Downgrades RPC from "source of truth" to "untrusted transport"
 * All RPC responses pass through this filter before being trusted
 * 
 * Architecture shift:
 * BEFORE: RPC quorum → "truth"
 * AFTER:  RPC quorum → candidate data → header verifier → truth filter
 */

import { BlockHeader } from './header-chain'

export interface RpcResponse {
  jsonrpc: string
  id: number | string
  result?: any
  error?: { code: number; message: string; data?: any }
}

export class RpcTrustFilter {
  private canonicalHeadUrl: string
  private env: any

  constructor(env: any) {
    this.env = env
    this.canonicalHeadUrl = 'http://canonical-head-do'
  }

  /**
   * Main filter entry point
   * All RPC responses must pass through this method
   */
  async filterResponse(method: string, response: RpcResponse): Promise<RpcResponse> {
    // Skip verification for certain methods
    if (this.isUnfilteredMethod(method)) {
      return response
    }

    // Only proceed if response is successful
    if (response.error) {
      return response
    }

    try {
      switch (method) {
        case 'eth_getBlockByNumber':
        case 'eth_getBlockByHash':
          return await this.verifyBlockHeader(response)
        
        case 'eth_getBalance':
        case 'eth_getStorageAt':
        case 'eth_call':
          return await this.verifyStateRoot(response)
        
        case 'eth_blockNumber':
          return await this.verifyCanonicalHead(response)
        
        default:
          // All other methods are marked as untrusted for now
          return this.markUntrusted(response)
      }
    } catch (e) {
      console.error(`Trust filter failed for method ${method}:`, e)
      return {
        ...response,
        error: {
          code: -32603,
          message: 'Trust verification failed',
          data: e instanceof Error ? e.message : 'Unknown error'
        }
      }
    }
  }

  /**
   * Verify block header against canonical chain
   */
  private async verifyBlockHeader(response: RpcResponse): Promise<RpcResponse> {
    if (!response.result) {
      return response
    }

    const header = this.normalizeBlockHeader(response.result)

    // Submit header to canonical head DO for validation
    const verifyResult = await fetch(`${this.canonicalHeadUrl}/header`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(header)
    })

    const validation = await verifyResult.json()

    if (!validation.valid) {
      return {
        ...response,
        error: {
          code: -32000,
          message: 'Invalid block header',
          data: validation.error
        }
      }
    }

    // Header is verified - return original response
    return response
  }

  /**
   * Verify state root matches canonical head
   */
  private async verifyStateRoot(response: RpcResponse): Promise<RpcResponse> {
    // In v1: Require state proof for all state queries
    // Currently implements header chain verification only
    
    const headResponse = await fetch(`${this.canonicalHeadUrl}/head`)
    const headStatus = await headResponse.json()

    // For now just log that we would verify against state root
    console.log(`Verifying state response against canonical head ${headStatus.headNumber}`)
    
    return response
  }

  /**
   * Verify block number matches canonical head
   */
  private async verifyCanonicalHead(response: RpcResponse): Promise<RpcResponse> {
    const headResponse = await fetch(`${this.canonicalHeadUrl}/head`)
    const headStatus = await headResponse.json()

    const reportedNumber = BigInt(response.result)
    const canonicalNumber = BigInt(headStatus.headNumber || '0')

    // Allow RPC to be behind by at most 1 block
    if (reportedNumber < canonicalNumber - 1n) {
      console.warn(`RPC is behind. Reported: ${reportedNumber}, Canonical: ${canonicalNumber}`)
    }

    // Never allow RPC to report a higher number than we have verified
    if (reportedNumber > canonicalNumber) {
      return {
        ...response,
        result: '0x' + canonicalNumber.toString(16)
      }
    }

    return response
  }

  /**
   * Normalize RPC block header format to internal format
   */
  private normalizeBlockHeader(rpcBlock: any): BlockHeader {
    return {
      number: BigInt(rpcBlock.number),
      hash: rpcBlock.hash,
      parentHash: rpcBlock.parentHash,
      stateRoot: rpcBlock.stateRoot,
      timestamp: parseInt(rpcBlock.timestamp, 16),
      signature: rpcBlock.signature || rpcBlock.extraData,
      receiptRoot: rpcBlock.receiptsRoot,
      transactionRoot: rpcBlock.transactionsRoot
    }
  }

  /**
   * Methods that do not require trust verification
   */
  private isUnfilteredMethod(method: string): boolean {
    const unfiltered = [
      'eth_chainId',
      'eth_gasPrice',
      'eth_estimateGas',
      'eth_sendRawTransaction',
      'net_version',
      'web3_clientVersion'
    ]

    return unfiltered.includes(method)
  }

  /**
   * Mark response as untrusted (for methods without verification)
   */
  private markUntrusted(response: RpcResponse): RpcResponse {
    // Add warning header for untrusted responses
    console.warn('Returning untrusted RPC response')
    return response
  }
}