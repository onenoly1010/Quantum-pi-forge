const fs = require("fs");
const crypto = require("crypto");
const docPath = "docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md";
const receiptPath = "receipts/governance/v2-operator-unpark-approval-candidate-v1.json";
function fail(message) { console.error("FAIL v2-operator-unpark-approval-candidate-v1: " + message); process.exit(1); }
if (!fs.existsSync(docPath)) fail("missing document");
if (!fs.existsSync(receiptPath)) fail("missing receipt");
const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const sha = crypto.createHash("sha256").update(doc).digest("hex");
if (receipt.artifact !== "v2-operator-unpark-approval-candidate-v1") fail("artifact mismatch");
if (receipt.document_path !== docPath) fail("document path mismatch");
if (receipt.document_sha256 !== sha) fail("document sha mismatch");
if (receipt.direct_execution_allowed !== false) fail("direct execution must be false");
if (receipt.next_allowed_lane !== "governance/v2-final-operator-unpark-approval-receipt-v1") fail("next allowed lane mismatch");
const requiredText = [
  "# V2 Operator Unpark Approval Candidate v1",
  "This is a candidate only",
  "does not grant final approval",
  "does not unpark the system",
  "does not authorize deployment",
  "does not authorize broadcast",
  "does not authorize command execution",
  "does not authorize a state-changing transaction",
  "final operator approval receipt candidate, not execution",
  "Execution remains blocked"
];
for (const text of requiredText) if (!doc.includes(text)) fail("missing required text: " + text);
const posture = receipt.posture || {};
const falseFlags = [
  "mainnet_cutover_approval_granted",
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed",
  "unpark_final_approval_granted",
  "unpark_executed",
  "operator_execution_authority_granted",
  "command_hash_execution_authorized",
  "command_hash_sealed_for_execution",
  "read_only_probe_passed_for_execution",
  "live_state_change_authorized",
  "investment_offer_created",
  "token_sale_created",
  "guaranteed_return_promised",
  "funder_execution_authority_granted"
];
for (const flag of falseFlags) if (posture[flag] !== false) fail("posture flag must be false: " + flag);
const trueFlags = [
  "operator_unpark_approval_candidate_created",
  "pre_unpark_readiness_gate_required",
  "final_operator_approval_still_required",
  "command_hash_receipt_still_required",
  "read_only_probe_still_required",
  "final_unpark_receipt_still_required",
  "separate_execution_receipt_still_required"
];
for (const flag of trueFlags) if (posture[flag] !== true) fail("posture flag must be true: " + flag);
if (posture.direct_execution_allowed !== false) fail("posture direct execution must be false");
console.log("PASS v2-operator-unpark-approval-candidate-v1");
