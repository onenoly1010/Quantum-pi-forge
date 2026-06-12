const fs = require("fs");
const crypto = require("crypto");
const manifestPath = "docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md";
const receiptPath = "receipts/governance/v2-funder-outreach-manifest-v1.json";
function fail(message) { console.error("FAIL v2-funder-outreach-manifest-v1: " + message); process.exit(1); }
if (!fs.existsSync(manifestPath)) fail("missing manifest");
if (!fs.existsSync(receiptPath)) fail("missing receipt");
const manifest = fs.readFileSync(manifestPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const sha = crypto.createHash("sha256").update(manifest).digest("hex");
if (receipt.artifact !== "v2-funder-outreach-manifest-v1") fail("artifact mismatch");
if (receipt.manifest_path !== manifestPath) fail("manifest path mismatch");
if (receipt.manifest_sha256 !== sha) fail("manifest sha mismatch");
const requiredText = [
  "# V2 Funder Outreach Manifest v1",
  "does not request investment",
  "does not offer tokens",
  "does not promise returns",
  "does not grant execution authority",
  "Funding review is separated from execution authority",
  "Technical feedback is preferred over general endorsement",
  "Do not describe this packet as a launch",
  "npm run governance:v2-funder-review-packet:v1:check",
  "npm run governance:pr-283-post-merge:v1:check"
];
for (const text of requiredText) if (!manifest.includes(text)) fail("missing required text: " + text);
const requiredLinks = [
  "https://github.com/onenoly1010/Quantum-pi-forge",
  "docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md",
  "receipts/governance/v2-funder-review-packet-v1.json",
  "docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md",
  "https://quantumpiforge.com"
];
for (const link of requiredLinks) if (!manifest.includes(link)) fail("missing required link/reference: " + link);
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
if (posture.outreach_manifest_created !== true) fail("outreach manifest flag must be true");
console.log("PASS v2-funder-outreach-manifest-v1");
