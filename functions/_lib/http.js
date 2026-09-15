export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "https://quantumpiforge.com",
    },
  });
}

export function cors() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "https://quantumpiforge.com",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

export function secret(env) {
  return (env && (env.BIRTH_MAC_SECRET || env.XAI_API_KEY)) || "qpf-birth-dev-mac-not-for-production";
}
