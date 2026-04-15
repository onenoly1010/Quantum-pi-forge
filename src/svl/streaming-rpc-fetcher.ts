export class StreamingRPCFetcher {
  constructor(private rpcUrl: string) {}

  async *streamProofs(stateRoot: string, address: string): AsyncGenerator<Uint8Array> {
    // Use eth_getProof with streaming flag (if supported) or chunked response
    const payload = {
      jsonrpc: "2.0",
      method: "eth_getProof",
      params: [address, [], "latest"],
      id: 1
    };
    
    const response = await fetch(this.rpcUrl, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });
    
    const reader = response.body?.getReader();
    if (!reader) return;
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value; // streaming chunks of proof data
    }
  }
}