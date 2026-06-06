#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const receiptPath = process.argv[2];
if (!receiptPath) {
  console.error("Usage: node scripts/verify-hermes-receipt.cjs <receipt.json>");
  process.exit(1);
}

function sha256File(path, trim = false) {
  let data = fs.readFileSync(path);
  if (trim) data = Buffer.from(data.toString("utf8").trim(), "utf8");
  return crypto.createHash("sha256").update(data).digest("hex");
}

let receipt;
try {
  receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
} catch (e) {
  console.error("Failed to parse receipt:", e.message);
  process.exit(1);
}

if (receipt.schemaVersion !== "hermes-receipt-v1") {
  console.error(`Invalid schemaVersion: ${receipt.schemaVersion}`);
  process.exit(1);
}

if (receipt.mode !== "local-read-only" && receipt.mode !== "replay-verify") {
  console.error(`Invalid mode: ${receipt.mode}`);
  process.exit(1);
}

if (!receipt.model || receipt.model.provider !== "ollama") {
  console.error(`Unsupported provider: ${receipt.model && receipt.model.provider}`);
  process.exit(1);
}

if (!receipt.input || receipt.input.kind !== "prompt" || !receipt.input.path || !receipt.input.sha256) {
  console.error("Invalid input receipt block");
  process.exit(1);
}

if (!receipt.output || !receipt.output.path || !receipt.output.sha256) {
  console.error("Invalid output receipt block");
  process.exit(1);
}

const authority = receipt.authority || {};
for (const key of ["readOnly", "noPosting", "noWalletSigning", "noDeployment", "noChainMutation"]) {
  if (authority[key] !== true) {
    console.error(`Invalid authority boundary: ${key}`);
    process.exit(1);
  }
}

try {
  const inputHash = sha256File(receipt.input.path, false);
  if (inputHash !== receipt.input.sha256) {
    console.error(`Input hash mismatch.\nExpected: ${receipt.input.sha256}\nGot:      ${inputHash}`);
    process.exit(1);
  }

  const outputHash = sha256File(receipt.output.path, true);
  if (outputHash !== receipt.output.sha256) {
    console.error(`Output hash mismatch.\nExpected: ${receipt.output.sha256}\nGot:      ${outputHash}`);
    process.exit(1);
  }

  console.log("✓ Receipt verified: schema, authority, input hash, and output hash match.");
  process.exit(0);
} catch (err) {
  console.error("Receipt verification failed:", err.message);
  process.exit(1);
}
