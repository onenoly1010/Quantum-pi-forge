const fs = require("fs");
function fail(m) { console.error("FAIL final-preflight-checklist-v1: " + m); process.exit(1); }
const r = JSON.parse(fs.readFileSync("receipts/governance/final-preflight-checklist-v1.json", "utf8"));
if (r.schema !== "qpf.governance.final-preflight-checklist.v1") fail("bad schema");
if (r.posture !== "final_preflight") fail("bad posture");
if (!r.ready_to_unpark_candidate) fail("candidate must be true");
if (r.unpark_executed) fail("unpark must be false");
if (!r.all_flags_false) fail("flags false");
const md = fs.readFileSync("docs/governance/FINAL_PREFLIGHT_CHECKLIST_V1.md", "utf8");
if (!md.includes("No activation executed")) fail("missing boundary");
console.log("PASS final-preflight-checklist-v1");
