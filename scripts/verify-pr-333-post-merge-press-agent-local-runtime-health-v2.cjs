#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/governance/pr-333-post-merge-press-agent-local-runtime-health-v2.json";

function fail(msg) {
  console.error(`FAIL pr-333-post-merge-press-agent-local-runtime-health-v2: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);

const r = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (r.schema !== "qpf.governance.pr_333_post_merge_press_agent_local_runtime_health_v2") fail("schema mismatch");
if (r.pr !== 333) fail("PR mismatch");
if (r.canonical_branch !== "main") fail("canonical branch mismatch");

for (const p of [
  r.evidence.runtime_health_receipt,
  r.evidence.runtime_health_doc,
  r.evidence.runtime_health_verifier
]) {
  if (!fs.existsSync(p)) fail(`missing evidence path: ${p}`);
}

if (r.verified_checks.press_agent_local_runtime_health_v2 !== "PASS") fail("local runtime health not PASS");
if (r.verified_checks.cross_platform_determinism_v1 !== "PASS") fail("determinism not PASS");
if (r.verified_checks.press_agent_readonly_readiness_v1 !== "PASS") fail("readonly readiness not PASS");

const posture = r.posture || {};
if (posture.evidence_only !== true) fail("evidence_only posture mismatch");
if (posture.execution_receipt_present !== false) fail("execution receipt posture mismatch");
if (posture.deployments !== false) fail("deployment posture mismatch");
if (posture.chain_actions !== false) fail("chain action posture mismatch");
if (posture.keys_used !== false) fail("keys used posture mismatch");
if (posture.runtime_send_authorized !== false) fail("runtime send authorization mismatch");

console.log("PASS pr-333-post-merge-press-agent-local-runtime-health-v2");
console.log(`receipt=${receiptPath}`);
console.log(`merged_head=${r.merged_head_commit_short}`);
