const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/pr-319-fresh-observer-receipt-v1.json";
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

function fail(msg) {
  console.error(`FAIL pr-319-fresh-observer-receipt-v1: ${msg}`);
  process.exit(1);
}

function requireFalse(key) {
  if (receipt.execution_flags?.[key] !== false) {
    fail(`${key} must be false`);
  }
}

if (receipt.schema !== "qpf.governance.fresh_observer_receipt.v1") fail("bad schema");
if (receipt.receipt !== "pr-319-fresh-observer-receipt-v1") fail("bad receipt id");
if (receipt.observer_report_path !== "local-autonomy/state/latest-pre-unpark-observer-report.md") fail("bad report path");

const report = fs.readFileSync(receipt.observer_report_path, "utf8");
const reportHash = crypto.createHash("sha256").update(report).digest("hex");

if (receipt.observer_report_sha256 !== reportHash) fail("observer report hash mismatch");

const requiredText = [
  `timestamp_utc=${receipt.observer_timestamp_utc}`,
  `head=${receipt.observer_head}`,
  `branch=${receipt.observer_branch}`,
  `posture=${receipt.observer_posture}`
];

for (const text of requiredText) {
  if (!report.includes(text)) fail(`report missing ${text}`);
}

if (receipt.observer_branch !== "main") fail("observer branch must be main");
if (receipt.observer_posture !== "REPORT_ONLY_NO_UNPARK_NO_DEPLOY_NO_BROADCAST_NO_KEYS") {
  fail("unsafe observer posture");
}

[
  "unpark_executed",
  "activation_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed",
  "key_access_performed"
].forEach(requireFalse);

console.log("PASS pr-319-fresh-observer-receipt-v1");
console.log(`observer_head=${receipt.observer_head}`);
console.log(`observer_report_sha256=${receipt.observer_report_sha256}`);
