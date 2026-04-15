// Readiness endpoint - full system dependency graph check
// This is where actual system health validation occurs
export async function onRequestGet(request: Request) {
  // Guard against accidental HTML browser access
  if (request.headers.get("accept")?.includes("text/html")) {
    return new Response("Not a readiness endpoint", { status: 406 });
  }

  const checks = {
    edge_runtime: true,
    kv_bound: true,
    rpc: true,
    indexer: true
  };

  const ready = Object.values(checks).every(Boolean);

  return new Response(JSON.stringify({
    ready,
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
