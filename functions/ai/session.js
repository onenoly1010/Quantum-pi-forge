import { canMeet, publicRecord, hmacHex, canonical } from "../_lib/birth.js";
import { json, cors, secret } from "../_lib/http.js";

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") return cors();
  if (request.method !== "POST") return json({ error: "POST only" }, 405);
  let body;
  try { body = await request.json(); } catch {
    return json({ error: "invalid json" }, 400);
  }
  const record = body.record;
  if (!record?.birth_id) return json({ error: "record required" }, 400);
  const pub = publicRecord({ ...record, record_mac: undefined, ai_secret_jwk: undefined });
  const mac_ok = record.record_mac === await hmacHex(secret(env), canonical(pub));
  if (!mac_ok) return json({ state: "VERIFICATION_FAILED", error: "record MAC invalid" }, 401);

  const verified = record.state === "VERIFIED" || record.state === "READY" || record.state === "INTERACTING";
  const hello = {
    text: "HELLO.\n\nI'm here.\n\nWhat should we do first?",
    identity_id: record.ai_identity.identity_id,
    birth_id: record.birth_id,
    mainnet_verified: verified,
    boundaries: record.boundaries,
  };

  if (!verified) {
    return json({
      state: record.state,
      session: hello,
      note: "Identity exists. Mainnet verification did not complete. This is still a real session with that identity, not a fake verified badge.",
    });
  }

  record.state = "INTERACTING";
  return json({
    state: "INTERACTING",
    session: hello,
    record: {
      ...record,
      ai_secret_jwk: undefined,
      record_mac: await hmacHex(secret(env), canonical(publicRecord({ ...record, record_mac: undefined, ai_secret_jwk: undefined }))),
    },
  });
}
