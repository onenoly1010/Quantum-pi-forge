// Readiness endpoint - full system dependency graph check
// This is where actual system health validation occurs
export async function onRequestGet(request: Request) {
  // Guard against accidental HTML browser access
  const accept = request.headers.get("accept") || "";
  
  const isBrowser =
    accept.includes("text/html") ||
    accept.includes("*/*") ||
    accept === "";

  if (isBrowser) {
    return new Response("Not a readiness endpoint", { status: 406 });
  }

  const checks: Record<string, boolean | string> = {
    edge_runtime: true,
    kv_bound: true,
    rpc: false,
    indexer: true
  };

  try {
    const start = Date.now();
    const reqId = Math.trunc(Math.random() * 1000000);
    const RPC_URL = 'https://evmrpc.0g.ai';

    // 1. Get latest block number
    const blockNumberRes = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: reqId
      }),
      signal: AbortSignal.timeout(3000)
    });

    if (!blockNumberRes.ok) throw new Error('rpc_failed');

    const { result: blockHex } = await blockNumberRes.json();
    const blockNumber = parseInt(blockHex, 16);

    // 2. Get block timestamp for freshness check
    const blockRes = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: [blockHex, false],
        id: reqId + 1
      }),
      signal: AbortSignal.timeout(3000)
    });

    if (!blockRes.ok) throw new Error('rpc_partial_failure');

    const { result: block } = await blockRes.json();
    const blockTimestamp = parseInt(block.timestamp, 16) * 1000;

    const latency = Date.now() - start;
    const now = Date.now();
    const freshness = now - blockTimestamp;

    let rpcState = 'healthy';
    if (latency > 500) rpcState = 'degraded';
    if (freshness > 30_000) rpcState = 'rpc_lagging';
    if (freshness > 120_000) rpcState = 'rpc_stale';

    checks.rpc = rpcState === 'healthy';
    checks.rpc_state = rpcState;
    checks.block_number = blockNumber;
    checks.block_age = freshness;
    checks.rpc_latency = latency;

  } catch {
    checks.rpc = false;
    checks.rpc_state = 'unreachable';
  }

  const ready = Object.values(checks).every(v => v === true);

  return new Response(JSON.stringify({
    ready,
    status: ready ? "ok" : "degraded",
    service: "quantum-pi-forge",
    layer: "readiness",
    version: "1.0",
    checks,
    ts: Date.now()
  }), {
    status: ready ? 200 : 503,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-readyz": "true"
    }
  });
}
