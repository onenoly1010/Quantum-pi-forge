import { RPC, publicRecord, hmacHex, canonical, CHAIN_ID } from "../_lib/birth.js";
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
  if (!record?.birth_id) {
    return json({ state: "VERIFICATION_FAILED", error: "record required" }, 400);
  }
  const pub = publicRecord({ ...record, record_mac: undefined, ai_secret_jwk: undefined });
  const mac_ok = record.record_mac === await hmacHex(secret(env), canonical(pub));

  let receipt = null;
  const tx = record.attestation?.tx_hash;
  if (tx) {
    const r = await fetch(RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_getTransactionReceipt", params: [tx] }),
    });
    const j = await r.json();
    receipt = j.result;
  }

  let state = record.state;
  if (tx && receipt && receipt.status === "0x1") state = "VERIFIED";
  else if (tx && receipt === null) state = "MAINNET_PENDING";
  else if (record.state === "MAINNET_FAILED") state = "MAINNET_FAILED";

  const out = {
    ...record,
    state,
    ai_secret_jwk: undefined,
  };
  if (state === "VERIFIED") out.state = "READY";

  return json({
    birth_id: record.birth_id,
    state: out.state,
    mac_ok,
    identity_id: record.ai_identity?.identity_id,
    chain_id: CHAIN_ID,
    tx_hash: tx || null,
    tx_status: receipt ? receipt.status : null,
    block_number: receipt ? receipt.blockNumber : null,
    fabricated_tx: false,
    offchain: {
      manifest: true,
      identity: true,
      authorization_commitment: true,
      ai_private_key: "not in proof",
    },
    onchain: {
      tx_hash: tx || null,
      payload_hash: record.attestation?.payload_hash || null,
    },
    boundaries: record.boundaries,
    record: { ...out, record_mac: await hmacHex(secret(env), canonical(publicRecord({ ...out, record_mac: undefined, ai_secret_jwk: undefined }))) },
  });
}
