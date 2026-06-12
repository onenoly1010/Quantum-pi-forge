const fs = require("fs");
const crypto = require("crypto");
const docPath = "docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md";
const receiptPath = "receipts/governance/v2-pre-unpark-readiness-gate-v1.json";
function fail(message) { console.error("FAIL v2-pre-unpark-readiness-gate-v1: " + message); process.exit(1); }
if (!fs.existsSync(docPath)) fail("missing document");
if (!fs.existsSync(receiptPath)) fail("missing receipt");
const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const sha = crypto.createHash("sha256").update(doc).digest("hex");
if (receipt.artifact !== "v2-pre-unpark-readiness-gate-v1") fail("artifact mismatch");
if (receipt.document_path !== docPath) fail("document path mismatch");
if (receipt.document_sha256 !== sha) fail("document sha mismatch");
if (receipt.direct_execution_allowed !== false) fail("direct execution must be false");
if (receipt.next_allowed_lane !== "governance/v2-operator-unpark-approval-candidate-v1") fail("next allowed lane mismatch");
const requiredText = [
  "# V2 Pre-Unpark Readiness Gate v1",
  "This is not an unpark receipt",
  "This is not an operator approval receipt",
  "This is not a deployment command",
  "This is not a transaction broadcast",
  "does not approve unpark",
  "does not execute unpark",
  "does not authorize deployment",
  "does not authorize broadcast",
  "does not authorize a state-changing transaction",
  "operator approval candidate, not direct execution"
];
for (const text of requiredText) if (!doc.includes(text)) fail("missing required text: " + text);
const posture = receipt.posture || {};
const falseFlags = [
  "mainnet_cutover_approval_granted",
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed",
  "unpark_approval_granted",
  "unpark_executed",
  "operator_execution_authority_granted",
  "command_hash_execution_authorized",
  "live_state_change_authorized",
  "investment_offer_created",
  "token_sale_created",
  "guaranteed_return_promised",
  "funder_execution_authority_granted"
];
for (const flag of falseFlags) if (posture[flag] !== false) fail("posture flag must be false: " + flag);
const trueFlags = [
  "funder_visibility_layer_closed",
  "public_funder_packet_index_available",
  "local_verifier_path_available",
  "pre_unpark_readiness_gate_created",
  "pre_unpark_review_required",
  "explicit_operator_approval_still_required",
  "command_hash_receipt_still_required",
  "read_only_probe_still_required",
  "final_unpark_receipt_still_required"
];
for (const flag of trueFlags) if (posture[flag] !== true) fail("posture flag must be true: " + flag);
console.log("PASS v2-pre-unpark-readiness-gate-v1");
