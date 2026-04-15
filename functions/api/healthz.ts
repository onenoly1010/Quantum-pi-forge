// Authoritative health endpoint - runtime alive check
// Zero dependencies, no external calls, always returns 200 when edge runtime is functional
export async function onRequestGet(request: Request) {
  // Guard against accidental HTML browser access
  if (request.headers.get("accept")?.includes("text/html")) {
    return new Response("Not a health endpoint", { status: 406 });
  }

  return new Response(JSON.stringify({
    status: "ok",
    service: "quantum-pi-forge",
    layer: "edge",
    ts: Date.now()
  }), {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-healthz": "true"
    }
  });
}
