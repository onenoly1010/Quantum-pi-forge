// Local tests for the qpf-birth Pages Functions. The 0G RPC and the attestor
// signer are MOCKED here. Nothing in this file is evidence of a live mainnet
// attestation; a PASS means only that the handlers behave as specified.
import { test } from "node:test";
import assert from "node:assert/strict";
import { Wallet } from "ethers";
import * as authorize from "../../functions/birth/authorize.js";
import * as create from "../../functions/birth/create.js";
import * as attest from "../../functions/birth/attest.js";
import * as proof from "../../functions/birth/proof.js";
import * as status from "../../functions/birth/status.js";
import * as session from "../../functions/ai/session.js";

const ENV = { BIRTH_MAC_SECRET: "test-only-mac-secret" };
const DEAD = "0x000000000000000000000000000000000000dEaD";

function req(body, method = "POST") {
  return new Request("https://local.test/x", {
    method, headers: { "content-type": "application/json" },
    body: method === "POST" ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
  });
}
async function call(mod, body, env = ENV) {
  const r = await mod.onRequest({ request: req(body), env });
  return { status: r.status, body: await r.json() };
}

// Mock RPC: handlers keyed by JSON-RPC method. Restored after each use.
function mockRpc(handlers) {
  const orig = globalThis.fetch;
  const seen = [];
  globalThis.fetch = async (url, init) => {
    const { method, params } = JSON.parse(init.body);
    seen.push(method);
    const h = handlers[method];
    const out = h ? h(params) : { error: { message: "unmocked " + method } };
    return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, ...out }));
  };
  return { seen, restore: () => { globalThis.fetch = orig; } };
}

async function newRecord() {
  const ch = (await call(authorize, {})).body;
  const created = await call(create, {
    challenge: ch.challenge, issued_at: ch.issued_at, mac: ch.mac,
    credential_id: "cred-test",
    client_data_json: JSON.stringify({ type: "webauthn.create", challenge: ch.challenge }),
  });
  assert.equal(created.status, 200);
  assert.equal(created.body.state, "IDENTITY_CREATED");
  return created.body.record;
}

const TXH = "0x" + "ab".repeat(32);
function okChain(extra = {}) {
  return { eth_chainId: () => ({ result: "0x4115" }), ...extra };
}

test("authorize issues a MAC'd challenge", async () => {
  const r = await call(authorize, {});
  assert.equal(r.body.state, "AUTH_REQUIRED");
  assert.ok(r.body.challenge && r.body.mac);
});

test("create rejects invalid / tampered / mismatched authorization", async () => {
  const ch = (await call(authorize, {})).body;
  const cdj = JSON.stringify({ challenge: ch.challenge });
  let r = await call(create, { ...ch, mac: "00", credential_id: "c", client_data_json: cdj });
  assert.equal(r.status, 401); assert.equal(r.body.state, "AUTH_FAILED");
  r = await call(create, { ...ch, issued_at: Date.now() - 600000, credential_id: "c", client_data_json: cdj });
  assert.equal(r.status, 401);
  r = await call(create, { ...ch, credential_id: "c", client_data_json: JSON.stringify({ challenge: "other" }) });
  assert.equal(r.status, 401); assert.match(r.body.error, /mismatch/);
  r = await call(create, { ...ch, client_data_json: cdj });
  assert.equal(r.status, 401);
});

test("attest without BIRTH_ATTESTOR_KEY: MAINNET_FAILED, identity kept, no tx", async () => {
  const rec = await newRecord();
  const m = mockRpc(okChain());
  try {
    const r = await call(attest, { record: rec });
    assert.equal(r.body.state, "MAINNET_FAILED");
    assert.equal(r.body.fabricated_tx, false);
    assert.equal(r.body.record.attestation.tx_hash, null);
    assert.equal(r.body.record.ai_identity.identity_id, rec.ai_identity.identity_id);
    assert.deepEqual(m.seen, ["eth_chainId"]);
    const s = await call(status, { record: r.body.record });
    assert.equal(s.body.mac_ok, true);
  } finally { m.restore(); }
});

test("attest rejects a tampered record", async () => {
  const rec = await newRecord();
  rec.state = "VERIFIED";
  const r = await call(attest, { record: rec });
  assert.equal(r.status, 401);
});

test("attest on wrong chain id: VERIFICATION_FAILED, no signing", async () => {
  const rec = await newRecord();
  const m = mockRpc({ eth_chainId: () => ({ result: "0x1" }) });
  try {
    const r = await call(attest, { record: rec }, { ...ENV, BIRTH_ATTESTOR_KEY: Wallet.createRandom().privateKey });
    assert.equal(r.status, 502); assert.equal(r.body.state, "VERIFICATION_FAILED");
    assert.deepEqual(m.seen, ["eth_chainId"]);
  } finally { m.restore(); }
});

test("attest: RPC rejects raw tx -> MAINNET_FAILED, tx_hash null", async () => {
  const rec = await newRecord();
  const m = mockRpc(okChain({
    eth_getTransactionCount: () => ({ result: "0x0" }),
    eth_gasPrice: () => ({ result: "0x3b9aca00" }),
    eth_sendRawTransaction: () => ({ error: { code: -32000, message: "insufficient funds" } }),
  }));
  try {
    const r = await call(attest, { record: rec }, { ...ENV, BIRTH_ATTESTOR_KEY: Wallet.createRandom().privateKey });
    assert.equal(r.body.state, "MAINNET_FAILED");
    assert.equal(r.body.record.attestation.tx_hash, null);
  } finally { m.restore(); }
});

async function pendingRecord() {
  const rec = await newRecord();
  const m = mockRpc(okChain({
    eth_getTransactionCount: () => ({ result: "0x0" }),
    eth_gasPrice: () => ({ result: "0x3b9aca00" }),
    eth_sendRawTransaction: () => ({ result: TXH }),
  }));
  try {
    const r = await call(attest, { record: rec }, { ...ENV, BIRTH_ATTESTOR_KEY: Wallet.createRandom().privateKey });
    assert.equal(r.body.state, "MAINNET_PENDING");
    assert.equal(r.body.tx_hash, TXH);
    return r.body.record;
  } finally { m.restore(); }
}
function txFor(rec, over = {}) {
  return { hash: TXH, to: DEAD, input: "0x" + rec.attestation.payload_hash, chainId: "0x4115", ...over };
}

test("proof: no receipt yet -> MAINNET_PENDING (not verified)", async () => {
  const rec = await pendingRecord();
  const m = mockRpc(okChain({ eth_getTransactionReceipt: () => ({ result: null }), eth_getTransactionByHash: () => ({ result: txFor(rec) }) }));
  try {
    const p = await call(proof, { record: rec });
    assert.equal(p.body.state, "MAINNET_PENDING");
  } finally { m.restore(); }
});

test("proof: confirmed matching receipt -> READY, then session INTERACTING", async () => {
  const rec = await pendingRecord();
  const m = mockRpc(okChain({
    eth_getTransactionReceipt: () => ({ result: { status: "0x1", blockNumber: "0x10", to: DEAD } }),
    eth_getTransactionByHash: () => ({ result: txFor(rec) }),
  }));
  try {
    const p = await call(proof, { record: rec });
    assert.equal(p.body.state, "READY");
    const s = await call(session, { record: p.body.record });
    assert.equal(s.body.state, "INTERACTING");
    assert.equal(s.body.session.mainnet_verified, true);
  } finally { m.restore(); }
});

test("proof: reverted tx (status 0x0) -> MAINNET_FAILED, not pending forever", async () => {
  const rec = await pendingRecord();
  const m = mockRpc(okChain({
    eth_getTransactionReceipt: () => ({ result: { status: "0x0", blockNumber: "0x10", to: DEAD } }),
    eth_getTransactionByHash: () => ({ result: txFor(rec) }),
  }));
  try {
    const p = await call(proof, { record: rec });
    assert.equal(p.body.state, "MAINNET_FAILED");
  } finally { m.restore(); }
});

test("proof: forged record carrying someone else's successful tx is NOT upgraded", async () => {
  const rec = await newRecord();
  rec.state = "MAINNET_PENDING";
  rec.attestation = { ...rec.attestation, tx_hash: TXH };
  rec.record_mac = "f".repeat(64);
  const m = mockRpc(okChain({
    eth_getTransactionReceipt: () => ({ result: { status: "0x1", blockNumber: "0x10" } }),
    eth_getTransactionByHash: () => ({ result: txFor(rec) }),
  }));
  try {
    const p = await call(proof, { record: rec });
    assert.notEqual(p.body.state, "READY");
    assert.equal(p.body.mac_ok, false);
    assert.ok(!p.body.record || p.body.record.state !== "READY");
  } finally { m.restore(); }
});

test("proof: confirmed tx that does not carry this birth's hash is NOT verified", async () => {
  const rec = await pendingRecord();
  const m = mockRpc(okChain({
    eth_getTransactionReceipt: () => ({ result: { status: "0x1", blockNumber: "0x10" } }),
    eth_getTransactionByHash: () => ({ result: txFor(rec, { input: "0x" + "00".repeat(32) }) }),
  }));
  try {
    const p = await call(proof, { record: rec });
    assert.notEqual(p.body.state, "READY");
    assert.equal(p.body.state, "VERIFICATION_FAILED");
  } finally { m.restore(); }
});

test("session: unverified identity gets an honest non-verified session", async () => {
  const rec = await newRecord();
  const s = await call(session, { record: rec });
  assert.equal(s.body.session.mainnet_verified, false);
  assert.equal(s.body.state, "IDENTITY_CREATED");
  rec.state = "READY";
  const bad = await call(session, { record: rec });
  assert.equal(bad.status, 401);
});
