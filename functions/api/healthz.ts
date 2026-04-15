// Authoritative health endpoint - runtime alive check
// Zero dependencies, no external calls, always returns 200 when edge runtime is functional
export async function onRequestGet(request: Request) {
  // Guard against accidental HTML browser access
  const accept = request.headers.get("accept") || "";
  
  const isBrowser =
    accept.includes("text/html") ||
    accept.includes("*/*") ||
    accept === "";

  if (isBrowser) {
    return new Response("Not a health endpoint", { status: 406 });
  }

  return new Response(JSON.stringify({
    status: "ok",
    service: "quantum-pi-forge",
    layer: "liveness",
    version: "1.0",
    ts: Date.now()
  }), {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-healthz": "true"
    }
  });
}
