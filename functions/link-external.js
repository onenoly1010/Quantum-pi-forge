/**
 * Optional external identity link (Pi first).
 * LINK ≠ CONTROL. Never retain access token, password, or keys.
 * Never request payments / wallet scopes. Never spend Pi.
 *
 * POST /link-external
 * { qpf_object_id, qpf_did, accessToken }
 */
function canonical(obj) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return "[" + obj.map(canonical).join(",") + "]";
  const keys = Object.keys(obj).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonical(obj[k])).join(",") + "}";
}

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "https://quantumpiforge.com",
    },
  });
}

export async function onRequest(context) {
  const { request } = context;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "https://quantumpiforge.com",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
      },
    });
  }
  if (request.method !== "POST") return json({ error: "POST only" }, 405);

  let body;
  try { body = await request.json(); } catch { return json({ error: "invalid json" }, 400); }

  const objectId = String(body?.qpf_object_id || "");
  const did = String(body?.qpf_did || "");
  const accessToken = String(body?.accessToken || "");
  if (!objectId.startsWith("qpfdc0:") || !did.startsWith("did:qpf:") || !accessToken) {
    return json({ decision: "STOP", breaker: "deny-missing-fields", stored: false }, 400);
  }

  let me;
  try {
    const r = await fetch("https://api.minepi.com/v2/me", {
      headers: { authorization: "Bearer " + accessToken, accept: "application/json" },
    });
    if (r.status === 401) {
      return json({
        decision: "STOP",
        breaker: "deny-pi-token-invalid",
        stored: false,
        note: "Pi /me rejected the token. No credentials retained. No link created.",
      });
    }
    if (!r.ok) {
      return json({
        decision: "STOP",
        breaker: "deny-pi-me-http",
        stored: false,
        http: r.status,
      });
    }
    me = await r.json();
  } catch {
    return json({
      decision: "STOP",
      breaker: "deny-pi-me-unreachable",
      stored: false,
    });
  }

  const uid = String(me?.uid || me?.user?.uid || "");
  if (!uid) {
    return json({ decision: "STOP", breaker: "deny-pi-uid-missing", stored: false });
  }

  const commitment = await sha256Hex("pi:v2:uid:" + uid);
  const binding = {
    schema: "qpf-external-link/v1",
    protocol_version: "qpf-external-link/v1",
    qpf_identity_id: objectId,
    qpf_did: did,
    external_network: "pi",
    external_identity_reference: "pi:v2:uid-hash:" + commitment,
    human_authorization_commitment: commitment,
    link_equals_control: false,
    retained: {
      access_token: false,
      password: false,
      private_key: false,
      seed: false,
      wallet_secret: false,
      username: false,
      raw_uid: false,
    },
    spend_authority: false,
    optional: true,
    ts: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
  };
  binding.receipt_id = "qpfr0:" + await sha256Hex(canonical(binding));

  return json({
    decision: "EXECUTE",
    breaker: null,
    executed: true,
    verdict: "ESTABLISHED",
    stored: false,
    qpf_receipt: binding,
    note: "LINK ≠ CONTROL. Token discarded. Pi assets not spendable by QPF.",
  });
}
