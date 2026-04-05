/**
 * Guardian Sentinel v2.0
 * Cloudflare Worker - Ported from Vercel Edge Middleware
 * Monitors resonance against Root Anchor on Polygon
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 1. Verify Resonance Key (1010hz logic)
    const resonanceKey = request.headers.get("X-Resonance-Key");
    if (resonanceKey !== env.RESONANCE_KEY) {
      return new Response("Unauthorized: Resonance Mismatch", { status: 403 });
    }

    // 2. Zero-Trust Bridge to Polygon Root Anchor
    try {
      const response = await fetch(env.RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_call",
          params: [{ to: env.ROOT_ANCHOR_ADDRESS, data: "0x..." }, "latest"],
          id: 1
        })
      });

      const { result } = await response.json();
      
      // If the Root Anchor is valid, allow the request to proceed
      if (result) {
        return fetch(request);
      }
    } catch (e) {
      return new Response("Guardian Sentinel: Protocol Offline", { status: 502 });
    }

    return new Response("Forbidden: Anchor Verification Failed", { status: 403 });
  }
};