#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const mappingReceiptPath = "receipts/security/0g-wallet-access-control-mapping-v1.json";
const outputReceiptPath = "receipts/security/wallet-preflight-verifier-v1.json";
const expectedChainId = 16661;
const expectedRpc = "https://evmrpc.0g.ai";
const forbiddenEnv = [
  "PRIVATE_KEY",
  "DEPLOYER_PRIVATE_KEY",
  "FEE_TO_SETTER_PRIVATE_KEY",
  "MNEMONIC",
  "SEED",
  "PI_PRIVATE_KEY",
  "AI_PRIVATE_KEY"
];

const failures = [];

for (const key of forbiddenEnv) {
  if (process.env[key]) failures.push(`forbidden environment variable present: ${key}`);
}

if (!fs.existsSync(mappingReceiptPath)) {
  failures.push(`missing wallet access-control mapping receipt: ${mappingReceiptPath}`);
}

let mappingReceipt = {};
if (fs.existsSync(mappingReceiptPath)) {
  mappingReceipt = JSON.parse(fs.readFileSync(mappingReceiptPath, "utf8"));

  const chainId = mappingReceipt?.network?.aristotle_chain_id;
  const rpc =
    mappingReceipt?.network?.aristotle_rpc ||
    mappingReceipt?.network?.rpc ||
    mappingReceipt?.network?.rpc_url ||
    mappingReceipt?.network?.aristotle_rpc_url;

  if (chainId !== expectedChainId) {
    failures.push(`aristotle_chain_id mismatch: expected ${expectedChainId}, got ${chainId}`);
  }

  if (rpc !== expectedRpc) {
    failures.push(`aristotle_rpc mismatch: expected ${expectedRpc}, got ${rpc}`);
  }

  if (mappingReceipt.result !== "PASS") failures.push("mapping receipt result must be PASS");
  if (mappingReceipt.private_key_used !== false) failures.push("mapping receipt private_key_used must be false");
  if (mappingReceipt.transaction_signed !== false) failures.push("mapping receipt transaction_signed must be false");
  if (mappingReceipt.transaction_broadcast !== false) failures.push("mapping receipt transaction_broadcast must be false");
}

const scriptSha256 = crypto.createHash("sha256").update(fs.readFileSync(__filename)).digest("hex");

const result = {
  id: "wallet-preflight-verifier-v1",
  result: failures.length === 0 ? "PASS" : "FAIL",
  posture: "non_executing_wallet_preflight",
  source_mapping_receipt: mappingReceiptPath,
  expected_chain_id: expectedChainId,
  expected_rpc: expectedRpc,
  forbidden_env_checked: forbiddenEnv,
  private_key_used: false,
  transaction_signed: false,
  transaction_broadcast: false,
  failures,
  script_sha256: scriptSha256,
  created_at_utc: new Date().toISOString().replace(/\.\d{3}Z$/, "Z")
};

fs.writeFileSync(outputReceiptPath, JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));

if (failures.length > 0) process.exit(1);
