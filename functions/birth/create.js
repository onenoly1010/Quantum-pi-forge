import {
  verifyChallenge, createIdentity, buildManifest,
  sha256Hex, canonical, publicRecord, hmacHex,
} from "../_lib/birth.js";
import { json, cors, secret } from "../_lib/http.js";

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") return cors();
  if (request.method !== "POST") return json({ error: "POST only", state: "CREATION_FAILED" }, 405);

  let body;
  try { body = await request.json(); } catch {
    return json({ state: "CREATION_FAILED", error: "invalid json" }, 400);
  }

  const ok = await verifyChallenge(secret(env), body);
  if (!ok) {
    return json({ state: "AUTH_FAILED", error: "authorization challenge invalid or expired" }, 401);
  }

  const credentialId = String(body.credential_id || "");
  const clientDataJSON = String(body.client_data_json || "");
  if (!credentialId || !clientDataJSON) {
    return json({ state: "AUTH_FAILED", error: "webauthn credential missing" }, 401);
  }
  let parsed;
  try { parsed = JSON.parse(clientDataJSON); } catch {
    return json({ state: "AUTH_FAILED", error: "clientDataJSON invalid" }, 401);
  }
  if (parsed.challenge !== body.challenge) {
    return json({ state: "AUTH_FAILED", error: "webauthn challenge mismatch" }, 401);
  }

  const authorization_commitment = await sha256Hex(`webauthn:${credentialId}:${body.challenge}`);
  const { identity } = await createIdentity();
  const protocol_commit = (env && (env.CF_PAGES_COMMIT_SHA || env.GITHUB_SHA)) || "unknown";
  const manifest = await buildManifest({ authorization_commitment, identity, protocol_commit });

  const record = {
    ...manifest,
    state: "IDENTITY_CREATED",
    http_status_is_not_success: true,
  };
  record.record_mac = await hmacHex(
    secret(env),
    canonical(publicRecord({ ...record, ai_secret_jwk: undefined, record_mac: undefined })),
  );

  return json({
    state: record.state,
    birth_id: record.birth_id,
    record,
    note: "Identity created. Mainnet verification has not occurred. No fabricated hash.",
  });
}
