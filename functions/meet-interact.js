/**
 * QPF counterpart acknowledges a visitor counterpart hello.
 * Verifies the claim shape. Does not store visitor text. Does not mint.
 *
 * POST /meet-interact
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

  const identity = body?.identity;
  const object = body?.object;
  const hello = body?.hello;
  const signature_b64 = body?.signature_b64;
  if (!identity?.did || !object?.object_id || !hello || !signature_b64) {
    return json({ error: "missing identity, object, hello, or signature" }, 400);
  }
  if (hello.kind && hello.kind !== "hello_qpf") {
    return json({
      decision: "STOP",
      breaker: "deny-unlisted-act",
      stored: false,
    });
  }
  if (hello.object_id !== object.object_id || hello.did !== identity.did) {
    return json({ decision: "STOP", breaker: "deny-identity-mismatch", stored: false });
  }
  if (!String(object.object_id).startsWith("qpfdc0:")) {
    return json({ decision: "STOP", breaker: "deny-unknown-schema", stored: false });
  }

  let signature_ok = false;
  try {
    const raw = Uint8Array.from(atob(identity.public_key_b64), (c) => c.charCodeAt(0));
    const helloBytes = new TextEncoder().encode(canonical(hello));
    const sig = Uint8Array.from(atob(signature_b64), (c) => c.charCodeAt(0));
    const algName = identity.algorithm === "ecdsa-p256" ? "ECDSA" : "Ed25519";
    const key = algName === "Ed25519"
      ? await crypto.subtle.importKey("raw", raw, { name: "Ed25519" }, false, ["verify"])
      : await crypto.subtle.importKey("raw", raw, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
    const sigAlg = algName === "Ed25519" ? { name: "Ed25519" } : { name: "ECDSA", hash: "SHA-256" };
    signature_ok = await crypto.subtle.verify(sigAlg, key, sig, helloBytes);
  } catch {
    signature_ok = false;
  }
  if (!signature_ok) {
    return json({ decision: "STOP", breaker: "deny-bad-signature", stored: false, verified_signature: false });
  }

  const ack = {
    schema: "qpf-front-door-interaction-receipt/v0",
    qpf_participant: "front-door",
    visitor_object_id: object.object_id,
    visitor_did: identity.did,
    decision: "ACKNOWLEDGE",
    hello_kind: hello.kind || "hello_qpf",
    verified_shape: true,
    verified_signature: true,
    stored: false,
    note: "QPF counterpart met a visitor counterpart. Signature shape checked. Private keys never left the visitor device. Protocol mint not authorized.",
    ts: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
  };
  ack.receipt_id = "qpfr0:" + await sha256Hex(canonical(ack));
  return json({
    decision: "EXECUTE",
    breaker: null,
    executed: true,
    verdict: "ESTABLISHED",
    qpf_receipt: ack,
    stored: false,
  });
}
