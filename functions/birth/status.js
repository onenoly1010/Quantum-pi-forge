import { publicRecord, hmacHex, canonical } from "../_lib/birth.js";
import { json, cors, secret } from "../_lib/http.js";

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") return cors();
  if (request.method !== "POST") return json({ error: "POST only" }, 405);
  let body;
  try { body = await request.json(); } catch {
    return json({ state: "VERIFICATION_FAILED", error: "invalid json" }, 400);
  }
  const record = body.record;
  if (!record || !record.birth_id) {
    return json({ state: "VERIFICATION_FAILED", error: "record required; client must not infer from animation" }, 400);
  }
  const stripped = publicRecord({ ...record, record_mac: undefined, ai_secret_jwk: undefined });
  const mac = await hmacHex(secret(env), canonical(stripped));
  const mac_ok = record.record_mac && record.record_mac === mac;
  return json({
    birth_id: record.birth_id,
    state: record.state,
    mac_ok,
    identity_id: record.ai_identity?.identity_id || null,
    attestation: record.attestation || null,
    boundaries: record.boundaries,
    note: mac_ok
      ? "Backend accepted the record MAC. State is the record state, not HTTP 200."
      : "Record MAC mismatch or missing. Do not treat this as verified.",
  });
}
