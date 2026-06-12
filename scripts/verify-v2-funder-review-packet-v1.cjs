const fs = require("fs");
const crypto = require("crypto");
const docPath = "docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md";
const receiptPath = "receipts/governance/v2-funder-review-packet-v1.json";
function fail(message) { console.error("FAIL v2-funder-review-packet-v1: " + message); process.exit(1); }
if (!fs.existsSync(docPath)) fail("missing document");
if (!fs.existsSync(receiptPath)) fail("missing receipt");
const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const sha = crypto.createHash("sha256").update(doc).digest("hex");
if (receipt.artifact !== "v2-funder-review-packet-v1") fail("artifact mismatch");
if (receipt.document_path !== docPath) fail("document path mismatch");
if (receipt.document_sha256 !== sha) fail("document sha mismatch");
const requiredText = [
  "# V2 Funder Review Packet v1",
  "bounded, non-executing review state",
  "Funding can support continued audit",
  "No mainnet cutover approval is granted here.",
  "No deployment execution is performed here.",
  "No broadcast transaction is performed here.",
  "No token sale, investment contract, or guaranteed return is created here.",
  "v2-funder-review-packet-v1 is ready for review once merged"
];
for (const text of requiredText) if (!doc.includes(text)) fail("missing required text: " + text);
const posture = receipt.posture || {};
const falseFlags = [
  "mainnet_cutover_approval_granted",
  "mainnet_cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
];
for (const flag of falseFlags) if (posture[flag] !== false) fail("posture flag must be false: " + flag);
const trueFlags = [
  "reviewer_evidence_index_created",
  "static_site_public_verification_created",
  "funder_review_packet_created"
];
for (const flag of trueFlags) if (posture[flag] !== true) fail("posture flag must be true: " + flag);
console.log("PASS v2-funder-review-packet-v1");
