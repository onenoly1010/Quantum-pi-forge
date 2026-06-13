#!/usr/bin/env node
const fs = require("fs");
const p = "receipts/governance/public-surface-post-pr-314-verification-v1.json";
function fail(msg) { console.error("FAIL public-surface-post-pr-314-verification-v1: " + msg); process.exit(1); }
if (!fs.existsSync(p)) fail("missing receipt");
const r = JSON.parse(fs.readFileSync(p, "utf8"));
if (r.schema !== "qpf.governance.public_surface_post_pr_314_verification.v1") fail("bad schema");
if (r.posture.parked !== true) fail("not parked");
if (r.posture.report_only !== true) fail("not report only");
if (r.posture.non_executing !== true) fail("not non-executing");
for (const k of ["unpark_executed", "activation_executed", "deployment_executed", "broadcast_executed", "state_changing_transaction_executed", "key_access_performed", "zero_g_action_performed"]) {
  if (r.posture[k] !== false) fail("boundary flag must be false: " + k);
}
for (const [k, v] of Object.entries(r.verified_surfaces || {})) {
  if (v !== "PASS") fail("surface not PASS: " + k);
}
if (r.determinism.file_count !== 2281) fail("bad file count");
if (r.evidence.lanes !== 3 || r.evidence.paths !== 6 || r.evidence.claims !== 3) fail("bad evidence counts");
console.log("PASS public-surface-post-pr-314-verification-v1");
