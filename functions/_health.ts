export async function onRequestGet() {
  return new Response(JSON.stringify({ 
    status: "ok",
    timestamp: Date.now(),
    service: "quantum-pi-forge",
    layer: "edge"
  }), {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store, no-cache, must-revalidate",
      "x-edge-health": "true"
    }
  });
}
