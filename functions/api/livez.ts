// Liveness probe - only indicates process is running
// No dependencies, no external calls, zero logic
export async function onRequestGet() {
  return new Response(null, {
    status: 204,
    headers: {
      "cache-control": "no-store",
      "x-livez": "true"
    }
  });
}