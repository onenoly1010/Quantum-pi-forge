import { issueChallenge } from "../_lib/birth.js";
import { json, cors, secret } from "../_lib/http.js";

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") return cors();
  if (request.method !== "POST") return json({ error: "POST only" }, 405);
  const ch = await issueChallenge(secret(env));
  return json({
    protocol: "qpf-birth",
    state: ch.state,
    challenge: ch.challenge,
    issued_at: ch.issued_at,
    mac: ch.mac,
    expires_in_ms: ch.expires_in_ms,
  });
}
