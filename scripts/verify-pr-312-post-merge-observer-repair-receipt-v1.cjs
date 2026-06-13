#!/usr/bin/env node
const fs = require("fs");
const receiptPath = "receipts/governance/pr-312-post-merge-observer-repair-receipt-v1.json";
function fail(msg) { console.error("FAIL pr-312-post-merge-observer-repair-receipt-v1: " + msg); process.exit(1); }
if (!fs.existsSync(receiptPath)) fail("missing receipt");
const r = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
if (r.schema !== "qpf.governance.pr_312_post_merge_observer_repair_receipt.v1") fail("bad schema");
if (r.pr_number !== 312) fail("bad pr number");
if (r.posture.parked !== true) fail("not parked");
if (r.posture.report_only !== true) fail("not report only");
if (r.posture.non_executing !== true) fail("not non-executing");
for (const k of ["activation_executed", "unpark_executed", "deployment_executed", "broadcast_executed", "state_changing_transaction_executed", "key_access_performed", "zero_g_action_performed"]) {
  if (r.posture[k] !== false) fail("posture flag must be false: " + k);
}
if (r.observer_result.repaired_observer_ran_on_canonical_main !== true) fail("observer not marked run");
if (r.observer_result.boundary_scan_completed_without_shell_quoting_failure !== true) fail("boundary scan not clean");
if (r.verification["local-autonomy:runtime-evidence-index:v1:check"] !== "PASS") fail("runtime evidence not pass");
if (r.verification["local-autonomy:tedious-worker-repair:v1:check"] !== "PASS") fail("tedious worker not pass");
if (r.verification["governance:cross-platform-determinism:v1:check"] !== "PASS") fail("determinism not pass");
if (r.verification["verify:evidence"] !== "PASS") fail("evidence not pass");
if (r.verification.cross_platform_manifest_sha256 !== "fef934b2f411dab581b0e03a5b21efa496eaef6f2d81098f67605704fbbc8a44") fail("manifest hash mismatch");
if (r.verification.cross_platform_file_count !== 2229) fail("file count mismatch");
if (r.next_allowed_lane !== "governance/v2-final-operator-unpark-approval-receipt-v1") fail("bad next lane");
console.log("PASS pr-312-post-merge-observer-repair-receipt-v1");
