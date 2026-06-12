const fs = require("fs");
const crypto = require("crypto");
const docPath = "docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md";
const receiptPath = "receipts/governance/pr-289-post-merge-governance-receipt-v1.json";
function fail(message) { console.error("FAIL pr-289-post-merge-governance-receipt-v1: " + message); process.exit(1); }
if (!fs.existsSync(docPath)) fail("missing document");
if (!fs.existsSync(receiptPath)) fail("missing receipt");
const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const sha = crypto.createHash("sha256").update(doc).digest("hex");
if (receipt.artifact !== "pr-289-post-merge-governance-receipt-v1") fail("artifact mismatch");
if (receipt.pr !== 289) fail("PR mismatch");
if (receipt.merged_artifact !== "v2-pre-unpark-readiness-gate-v1") fail("merged artifact mismatch");
if (receipt.canonical_branch !== "main") fail("canonical branch mismatch");
if (receipt.document_path !== docPath) fail("document path mismatch");
if (receipt.document_sha256 !== sha) fail("document sha mismatch");
if (receipt.direct_execution_allowed !== false) fail("direct execution must be false");
if (receipt.next_allowed_lane !== "governance/v2-operator-unpark-approval-candidate-v1") fail("next allowed lane mismatch");
const requiredText = [
  "# PR 289 Post-Merge Governance Receipt v1",
  "v2 pre-unpark readiness gate v1",
  "normal merge path",
  "does not approve or execute unpark",
  "does not unpark the system",
  "does not grant operator execution authority",
  "does not authorize deployment",
  "does not authorize broadcast",
  "does not authorize any state-changing transaction",
  "operator unpark approval candidate, not direct execution"
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
  "pre_unpark_readiness_gate_created",
  "pre_unpark_readiness_gate_merged",
  "funder_visibility_layer_closed",
  "public_funder_packet_index_available",
  "local_verifier_path_available",
  "post_merge_receipt_created",
  "local_governance_verifiers_green",
  "local_build_green",
  "explicit_operator_approval_still_required",
  "command_hash_receipt_still_required",
  "read_only_probe_still_required",
  "final_unpark_receipt_still_required"
];
for (const flag of trueFlags) if (posture[flag] !== true) fail("posture flag must be true: " + flag);
console.log("PASS pr-289-post-merge-governance-receipt-v1");
