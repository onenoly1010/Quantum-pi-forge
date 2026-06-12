const fs = require("fs");
const crypto = require("crypto");
const indexPath = "docs/governance/V2_PUBLIC_FUNDER_PACKET_INDEX_V1.md";
const receiptPath = "receipts/governance/v2-public-funder-packet-index-v1.json";
function fail(message) { console.error("FAIL v2-public-funder-packet-index-v1: " + message); process.exit(1); }
if (!fs.existsSync(indexPath)) fail("missing index");
if (!fs.existsSync(receiptPath)) fail("missing receipt");
const index = fs.readFileSync(indexPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const sha = crypto.createHash("sha256").update(index).digest("hex");
if (receipt.artifact !== "v2-public-funder-packet-index-v1") fail("artifact mismatch");
if (receipt.index_path !== indexPath) fail("index path mismatch");
if (receipt.index_sha256 !== sha) fail("index sha mismatch");
const requiredText = [
  "# V2 Public Funder Packet Index v1",
  "stable public entry point",
  "navigation artifact only",
  "does not create new execution authority",
  "If an endpoint is unavailable",
  "repository evidence and local deterministic verifiers remain canonical",
  "Technical feedback is preferred over endorsement",
  "npm run governance:v2-funder-review-packet:v1:check",
  "npm run governance:v2-funder-outreach-manifest:v1:check",
  "npm run governance:pr-283-post-merge:v1:check",
  "npm run governance:pr-285-post-merge:v1:check"
];
for (const text of requiredText) if (!index.includes(text)) fail("missing required text: " + text);
const requiredRefs = [
  "docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md",
  "docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md",
  "receipts/governance/v2-funder-review-packet-v1.json",
  "receipts/governance/v2-funder-outreach-manifest-v1.json",
  "docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md",
  "docs/governance/PR_285_POST_MERGE_GOVERNANCE_RECEIPT_V1.md",
  "https://quantumpiforge.com"
];
for (const ref of requiredRefs) if (!index.includes(ref)) fail("missing required reference: " + ref);
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
  "funder_review_packet_created",
  "funder_review_packet_merged",
  "outreach_manifest_created",
  "outreach_manifest_merged",
  "public_funder_packet_index_created",
  "local_verifier_path_available"
];
for (const flag of trueFlags) if (posture[flag] !== true) fail("posture flag must be true: " + flag);
console.log("PASS v2-public-funder-packet-index-v1");
