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
  // Never re-sign (or upgrade) a record this service did not issue.
  if (!mac_ok) {
    return json({ state: "VERIFICATION_FAILED", mac_ok: false, error: "record MAC invalid", fabricated_tx: false }, 401);
  }

  async function rpc(method, params) {
    const r = await fetch(RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });
    return (await r.json()).result ?? null;
  }

  let receipt = null;
  let reason = null;
  const tx = record.attestation?.tx_hash;
  if (tx) receipt = await rpc("eth_getTransactionReceipt", [tx]);

  let state = record.state;
  if (tx && receipt && receipt.status === "0x1") {
    // A confirmed receipt alone is not enough: the tx must be this birth's attestation.
    const chain = await rpc("eth_chainId", []);
    const txo = await rpc("eth_getTransactionByHash", [tx]);
    const want = ("0x" + (record.attestation?.payload_hash || "")).toLowerCase();
    if (chain !== "0x4115") { state = "VERIFICATION_FAILED"; reason = "RPC chain id is not 16661"; }
    else if (!txo || String(txo.input || "").toLowerCase() !== want
      || String(txo.to || "").toLowerCase() !== "0x000000000000000000000000000000000000dead") {
      state = "VERIFICATION_FAILED"; reason = "transaction does not carry this birth_manifest_hash";
    } else state = "VERIFIED";
  } else if (tx && receipt && receipt.status !== "0x1") {
    state = "MAINNET_FAILED"; reason = "attestation transaction reverted (receipt status " + receipt.status + ")";
  } else if (tx && receipt === null) state = "MAINNET_PENDING";
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
    reason,
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
