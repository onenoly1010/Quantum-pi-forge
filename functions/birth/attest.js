import { CHAIN_ID, RPC, publicRecord, hmacHex, canonical } from "../_lib/birth.js";
import { json, cors, secret } from "../_lib/http.js";

async function rpc(method, params) {
  const r = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  return r.json();
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") return cors();
  if (request.method !== "POST") return json({ error: "POST only", state: "ATTESTATION_FAILED" }, 405);

  let body;
  try { body = await request.json(); } catch {
    return json({ state: "ATTESTATION_FAILED", error: "invalid json" }, 400);
  }
  const record = body.record;
  if (!record?.birth_id || !record?.attestation?.payload_hash) {
    return json({ state: "ATTESTATION_FAILED", error: "birth record required" }, 400);
  }

  const stripped = publicRecord({ ...record, record_mac: undefined, ai_secret_jwk: undefined });
  const mac = await hmacHex(secret(env), canonical(stripped));
  if (!record.record_mac || record.record_mac !== mac) {
    return json({ state: "ATTESTATION_FAILED", error: "record MAC invalid" }, 401);
  }

  const chain = await rpc("eth_chainId", []);
  if (chain.result !== "0x4115") {
    return json({
      state: "VERIFICATION_FAILED",
      error: "RPC chain id is not 16661",
      observed: chain.result || null,
      fabricated_tx: false,
    }, 502);
  }

  const key = env && env.BIRTH_ATTESTOR_KEY;
  if (!key) {
    record.state = "MAINNET_FAILED";
    record.attestation = {
      ...record.attestation,
      chain_id: CHAIN_ID,
      tx_hash: null,
      reason: "No BIRTH_ATTESTOR_KEY. Identity exists. Mainnet verification did not complete. No fabricated transaction.",
    };
    record.record_mac = await hmacHex(secret(env), canonical(publicRecord({ ...record, record_mac: undefined, ai_secret_jwk: undefined })));
    return json({
      state: "MAINNET_FAILED",
      birth_id: record.birth_id,
      record,
      message: "VERIFICATION COULD NOT BE COMPLETED. Your AI identity was created, but mainnet verification did not complete.",
      fabricated_tx: false,
    });
  }

  // Attestor key present: submit a zero-value data tx carrying the manifest hash.
  // Not an invented contract method. Not Heartbeat.registerBirth (that requires an OINIO NFT).
  try {
    const { Wallet } = await import("ethers");
    const wallet = new Wallet(key);
    const hashHex = "0x" + record.attestation.payload_hash;
    const nonceHex = (await rpc("eth_getTransactionCount", [wallet.address, "latest"])).result;
    const gasPrice = (await rpc("eth_gasPrice", [])).result;
    const tx = {
      to: "0x000000000000000000000000000000000000dEaD",
      value: 0,
      data: hashHex,
      chainId: CHAIN_ID,
      nonce: parseInt(nonceHex, 16),
      gasLimit: 21000 + Math.ceil(hashHex.length / 2) * 16,
      gasPrice: BigInt(gasPrice),
    };
    const raw = await wallet.signTransaction(tx);
    const sent = await rpc("eth_sendRawTransaction", [raw]);
    if (sent.error || !sent.result) {
      record.state = "MAINNET_FAILED";
      record.attestation = {
        ...record.attestation,
        tx_hash: null,
        reason: sent.error?.message || "eth_sendRawTransaction failed",
      };
      record.record_mac = await hmacHex(secret(env), canonical(publicRecord({ ...record, record_mac: undefined, ai_secret_jwk: undefined })));
      return json({
        state: "MAINNET_FAILED",
        birth_id: record.birth_id,
        record,
        message: "VERIFICATION COULD NOT BE COMPLETED. Your AI identity was created, but mainnet verification did not complete.",
        fabricated_tx: false,
        rpc_error: sent.error || null,
      });
    }
    record.state = "MAINNET_PENDING";
    record.attestation = {
      ...record.attestation,
      tx_hash: sent.result,
      to: tx.to,
      note: "Data transaction of birth_manifest_hash on chain 16661. Not a token mint.",
    };
    record.record_mac = await hmacHex(secret(env), canonical(publicRecord({ ...record, record_mac: undefined, ai_secret_jwk: undefined })));
    return json({
      state: "MAINNET_PENDING",
      birth_id: record.birth_id,
      record,
      tx_hash: sent.result,
      fabricated_tx: false,
    });
  } catch (e) {
    record.state = "MAINNET_FAILED";
    record.attestation = {
      ...record.attestation,
      tx_hash: null,
      reason: String(e && e.message || e),
    };
    record.record_mac = await hmacHex(secret(env), canonical(publicRecord({ ...record, record_mac: undefined, ai_secret_jwk: undefined })));
    return json({
      state: "MAINNET_FAILED",
      birth_id: record.birth_id,
      record,
      message: "VERIFICATION COULD NOT BE COMPLETED. Your AI identity was created, but mainnet verification did not complete.",
      fabricated_tx: false,
    });
  }
}
