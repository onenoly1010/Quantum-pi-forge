const fs = require("fs");

const receiptPath = "receipts/governance/pr-249-post-merge-governance-receipt-v1.json";
const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_249.md";
const indexPath = "docs/review/READINESS_INDEX_V1.md";

for (const path of [receiptPath, docPath, indexPath]) {
  if (!fs.existsSync(path)) {
    throw new Error(`Missing required file: ${path}`);
  }
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredFalse = [
  "mainnet_cutover_approval_granted",
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
];

if (receipt.receipt !== "pr-249-post-merge-governance-receipt-v1") {
  throw new Error("Unexpected receipt id");
}

if (receipt.status !== "sealed") {
  throw new Error("Receipt is not sealed");
}

if (receipt.pr !== 249) {
  throw new Error("Receipt does not bind to PR 249");
}

for (const key of requiredFalse) {
  if (receipt[key] !== false) {
    throw new Error(`${key} must remain false`);
  }
}

const index = fs.readFileSync(indexPath, "utf8");
if (!index.includes("Quantum Pi Forge Readiness Index v1")) {
  throw new Error("Readiness index title missing");
}
if (!index.includes("current_posture: PARKED")) {
  throw new Error("Readiness index must preserve parked posture");
}

console.log("PASS pr-249-post-merge-governance-receipt-v1");
