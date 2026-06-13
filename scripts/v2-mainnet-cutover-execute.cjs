#!/usr/bin/env node
const crypto = require("crypto");
const EXPECTED_COMMAND = "npm run autonomous:v2-mainnet-cutover:execute -- --require-command-hash --receipt receipts/execution/v2-mainnet-cutover-execution-v1.json";
const EXPECTED_HASH = "37f8940d93130365e0bf395912b4eef134fa558db92c82c254b1f0af838a20a8";
const EXPECTED_RECEIPT = "receipts/execution/v2-mainnet-cutover-execution-v1.json";
const args = process.argv.slice(2);
const receiptIndex = args.indexOf("--receipt");
const receiptPath = receiptIndex >= 0 ? args[receiptIndex + 1] : null;
const hash = crypto.createHash("sha256").update(EXPECTED_COMMAND).digest("hex");
function block(code, msg) {
  console.error("BLOCKED v2-mainnet-cutover-execute: " + msg);
  console.error("No deployment executed. No broadcast executed. No wallet signing executed. No state-changing transaction executed.");
  process.exit(code);
}
if (!args.includes("--require-command-hash")) block(2, "missing --require-command-hash");
if (hash !== EXPECTED_HASH) block(3, "sealed command hash mismatch");
if (receiptPath !== EXPECTED_RECEIPT) block(4, "receipt path mismatch");
if (process.env.QPF_MAINNET_CUTOVER_EXECUTE !== "YES") block(5, "explicit QPF_MAINNET_CUTOVER_EXECUTE=YES not present");
block(6, "live execution body intentionally not implemented in this repair lane");
