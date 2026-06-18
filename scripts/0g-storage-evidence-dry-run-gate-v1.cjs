#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const RPC_URL = process.env.ZERO_G_RPC_URL || "https://evmrpc.0g.ai";
const INDEXER_URL = process.env.ZERO_G_STORAGE_INDEXER_URL || "https://indexer-storage-turbo.0g.ai";
const EXPECTED_CHAIN_ID = 16661;
const OUT_DIR = "receipts/integration/0g-storage-evidence-dry-run-v1";
const RECEIPT = "receipts/integration/0g-storage-evidence-dry-run-v1.json";
async function rpc(method, params = []) {
  const res = await fetch(RPC_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
  if (!res.ok) throw new Error(`RPC_HTTP_${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`RPC_ERROR_${JSON.stringify(json.error)}`);
  return json.result;
}
function sha256(buf) { return crypto.createHash("sha256").update(buf).digest("hex"); }
async function main() {
  if (process.env.QPF_0G_STORAGE_UPLOAD === "YES") throw new Error("LIVE_UPLOAD_BLOCKED_BY_DRY_RUN_GATE_V1");
  if (process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY_PRESENT_BLOCKED_BY_DRY_RUN_GATE_V1");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(RECEIPT), { recursive: true });
  const chainHex = await rpc("eth_chainId");
  const chainId = Number.parseInt(chainHex, 16);
  if (chainId !== EXPECTED_CHAIN_ID) throw new Error(`CHAIN_ID_MISMATCH expected=${EXPECTED_CHAIN_ID} got=${chainId}`);
  const latestBlockHex = await rpc("eth_blockNumber");
  const latestBlock = Number.parseInt(latestBlockHex, 16);
  let indexerStatus = null;
  try {
    const r = await fetch(INDEXER_URL, { method: "GET" });
    indexerStatus = r.status;
  } catch (err) {
    throw new Error(`INDEXER_UNREACHABLE_${err.message}`);
  }
  const artifact = {
    qpf_artifact: "0g-storage-evidence-dry-run-test-artifact-v1",
    mode: "DRY_RUN_ONLY",
    network: "0G Aristotle Mainnet",
    chain_id: chainId,
    rpc_url: RPC_URL,
    storage_indexer_url: INDEXER_URL,
    latest_block_observed: latestBlock,
    live_upload_authorized: false,
    private_key_required: false,
    private_key_present: false,
    generated_at: new Date().toISOString()
  };
  const artifactPath = path.join(OUT_DIR, "artifact.json");
  const artifactBytes = Buffer.from(JSON.stringify(artifact, null, 2) + "\n");
  fs.writeFileSync(artifactPath, artifactBytes);
  const artifactSha256 = sha256(artifactBytes);
  const merkleRootPlaceholder = sha256(Buffer.from(`qpf-single-leaf:${artifactSha256}`));
  const receipt = {
    receipt: "0g-storage-evidence-dry-run-gate-v1",
    status: "PASS",
    mode: "DRY_RUN_ONLY",
    chain_id_expected: EXPECTED_CHAIN_ID,
    chain_id_observed: chainId,
    rpc_url: RPC_URL,
    storage_indexer_url: INDEXER_URL,
    storage_indexer_http_status: indexerStatus,
    latest_block_observed: latestBlock,
    artifact_path: artifactPath,
    artifact_sha256: artifactSha256,
    merkle_root_placeholder_sha256: merkleRootPlaceholder,
    upload_attempted: false,
    transaction_broadcast: false,
    private_key_present: false,
    live_execution: false,
    generated_at: new Date().toISOString()
  };
  fs.writeFileSync(RECEIPT, JSON.stringify(receipt, null, 2) + "\n");
  console.log("PASS 0g-storage-evidence-dry-run-gate-v1");
  console.log(`CHAIN_ID=${chainId}`);
  console.log(`LATEST_BLOCK=${latestBlock}`);
  console.log(`ARTIFACT_SHA256=${artifactSha256}`);
  console.log(`MERKLE_ROOT_PLACEHOLDER_SHA256=${merkleRootPlaceholder}`);
  console.log(`RECEIPT=${RECEIPT}`);
}
main().catch(err => { console.error(`FAIL 0g-storage-evidence-dry-run-gate-v1 ${err.message}`); process.exit(1); });
