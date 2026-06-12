const fs = require("fs");
function fail(m) { console.error("FAIL v2-governance-receipt-chain-index-v1: " + m); process.exit(1); }
const r = JSON.parse(fs.readFileSync("receipts/governance/v2-governance-receipt-chain-index-v1.json", "utf8"));
if (r.schema !== "qpf.governance.v2-receipt-chain-index.v1") fail("bad schema");
if (r.posture !== "pre_activation_index") fail("bad posture");
if (r.execution_posture !== "non-executing") fail("bad posture");
if (!r.all_flags_false) fail("flags");
if (r.stash_applied) fail("stash");
const md = fs.readFileSync("docs/governance/V2_GOVERNANCE_RECEIPT_CHAIN_INDEX_V1.md", "utf8");
if (!md.includes("non-executing")) fail("missing boundary");
if (!md.includes("STEWARD_PROOF_DECLARATION_V1.md")) fail("missing steward");
console.log("PASS v2-governance-receipt-chain-index-v1");
