const fs = require("fs");
const required = [
  "docs/governance/FUNDING_CONSTRAINT_RESILIENCE_MODE_V1.md",
  "receipts/governance/funding-constraint-resilience-mode-v1.json",
  "docs/reviewer/PUBLIC_EVIDENCE_MIRROR_OFFLINE_REVIEW_PACKET_V1.md",
  "receipts/reviewer/public-evidence-mirror-offline-review-packet-v1.json",
  "docs/governance/SUSTAINABILITY_READINESS_GATE_V1.md",
  "receipts/governance/sustainability-readiness-gate-v1.json",
  "docs/reviewer/REVIEWER_FUNDER_PACKET_V1.md",
  "receipts/reviewer/reviewer-funder-packet-v1.json",
  "receipts/governance/local-autonomous-worker-loop-v1.json"
];
function assert(condition, message) { if (!condition) { console.error("FAIL verify-local-autonomous-worker-loop-v1:", message); process.exit(1); } }
for (const file of required) assert(fs.existsSync(file), "missing " + file);
const receipt = JSON.parse(fs.readFileSync("receipts/governance/local-autonomous-worker-loop-v1.json", "utf8"));
assert(receipt.mode === "BOUNDED_LOCAL_AUTONOMY", "mode mismatch");
for (const key of ["seed_phrase_access_authorized","private_key_access_authorized","wallet_signing_authorized","funds_movement_authorized","token_approval_authorized","bridge_authorized","deployment_authorized","liquidity_authorized","mainnet_mutation_authorized"]) assert(receipt[key] === false, key + " must remain false");
assert(typeof receipt.canonical_hash === "string" && receipt.canonical_hash.length === 64, "invalid canonical hash");
console.log("PASS verify-local-autonomous-worker-loop-v1");
