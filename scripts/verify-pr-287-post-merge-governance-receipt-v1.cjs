const fs = require("fs");
const crypto = require("crypto");
const docPath = "docs/governance/PR_287_POST_MERGE_GOVERNANCE_RECEIPT_V1.md";
const receiptPath = "receipts/governance/pr-287-post-merge-governance-receipt-v1.json";
function fail(message) { console.error("FAIL pr-287-post-merge-governance-receipt-v1: " + message); process.exit(1); }
if (!fs.existsSync(docPath)) fail("missing document");
if (!fs.existsSync(receiptPath)) fail("missing receipt");
const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const sha = crypto.createHash("sha256").update(doc).digest("hex");
if (receipt.artifact !== "pr-287-post-merge-governance-receipt-v1") fail("artifact mismatch");
if (receipt.pr !== 287) fail("PR mismatch");
if (receipt.merged_artifact !== "v2-public-funder-packet-index-v1") fail("merged artifact mismatch");
if (receipt.canonical_branch !== "main") fail("canonical branch mismatch");
if (receipt.document_path !== docPath) fail("document path mismatch");
if (receipt.document_sha256 !== sha) fail("document sha mismatch");
const requiredText = [
  "# PR 287 Post-Merge Governance Receipt v1",
  "v2 public funder packet index v1",
  "normal merge path",
  "bounded, non-executing governance state",
  "does not create an investment offer",
  "token sale",
  "guaranteed return",
  "mainnet cutover approval",
  "separate from execution authority"
];
for (const text of requiredText) if (!doc.includes(text)) fail("missing required text: " + text);
const posture = receipt.posture || {};
const falseFlags = [
  "mainnet_cutover_approval_granted",
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed",
  "investment_offer_created",
  "token_sale_created",
  "guaranteed_return_promised",
  "funder_execution_authority_granted"
];
for (const flag of falseFlags) if (posture[flag] !== false) fail("posture flag must be false: " + flag);
const trueFlags = [
  "public_funder_packet_index_created",
  "public_funder_packet_index_merged",
  "post_merge_receipt_created",
  "local_governance_verifiers_green",
  "local_build_green"
];
for (const flag of trueFlags) if (posture[flag] !== true) fail("posture flag must be true: " + flag);
console.log("PASS pr-287-post-merge-governance-receipt-v1");
