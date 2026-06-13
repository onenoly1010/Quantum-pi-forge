const fs = require("fs");
const crypto = require("crypto");

function fail(message) {
  console.error("FAIL current-public-status-handoff-v1: " + message);
  process.exit(1);
}

const docPath = "docs/governance/CURRENT_PUBLIC_STATUS_HANDOFF_V1.md";
const receiptPath = "receipts/governance/current-public-status-handoff-v1.json";
const executionReceiptPath = "receipts/execution/v2-mainnet-cutover-execution-v1.json";

if (!fs.existsSync(docPath)) fail("missing document");
if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (fs.existsSync(executionReceiptPath)) fail("execution receipt present");

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (receipt.schema !== "qpf.governance.current-public-status-handoff.v1") fail("bad schema");
if (receipt.posture !== "PARKED_PUBLIC_STATUS_HANDOFF_NO_UNPARK_NO_DEPLOY_NO_BROADCAST_NO_KEYS") fail("bad posture");
if (receipt.document !== docPath) fail("bad document path");

for (const phrase of [
  "sealed parked posture",
  "No unpark is performed",
  "No activation is performed",
  "No deployment is performed",
  "No broadcast is performed",
  "No key access is performed",
  "No 0G transaction or state-changing transaction is performed"
]) {
  if (!doc.includes(phrase)) fail("missing phrase: " + phrase);
}

const boundary = receipt.boundary || {};
for (const key of [
  "unpark_executed",
  "activation_executed",
  "deployment_executed",
  "broadcast_executed",
  "key_access_performed",
  "state_changing_transaction_executed",
  "execution_receipt_present"
]) {
  if (boundary[key] !== false) fail("boundary flag not false: " + key);
}

const hash = crypto.createHash("sha256").update(doc).digest("hex");
console.log("PASS current-public-status-handoff-v1");
console.log("document_sha256=" + hash);
console.log("canonical_head=" + receipt.canonical_head);
