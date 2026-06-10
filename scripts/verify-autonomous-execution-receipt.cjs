#!/usr/bin/env node
const fs = require("fs");
const docPath = "docs/operations/AUTONOMOUS_EXECUTION_RECEIPT_V1.md";
const receiptPath = "receipts/execution/autonomous-execution-receipt-v1.json";
function fail(message) { console.error("FAIL: " + message); process.exit(1); }
function ok(message) { console.log("OK: " + message); }
if (!fs.existsSync(docPath)) fail("missing autonomous execution doc");
if (!fs.existsSync(receiptPath)) fail("missing autonomous execution receipt");
const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const requiredDocTerms = ["github_ci_blocked != execution_blocked", "external_runner_pass == autonomous_execution_evidence", "local_replay_pass == deterministic_fallback_evidence", "GitHub-hosted CI is not the protocol", "ops/external-runner-proof-v1"];
for (const term of requiredDocTerms) { if (!doc.includes(term)) fail("missing document term: " + term); }
if (receipt.schema !== "qpf.autonomous_execution_receipt.v1") fail("schema mismatch");
if (receipt.status !== "sealed") fail("receipt is not sealed");
if (receipt.trigger.previous_pull_request !== 175) fail("previous PR binding mismatch");
if (receipt.boundary.github_hosted_ci_required_for_truth !== false) fail("GitHub CI truth boundary mismatch");
if (receipt.boundary.github_repository_removed !== false) fail("GitHub removal non-claim mismatch");
if (receipt.boundary.local_execution_required !== true) fail("local execution requirement missing");
const requiredInvariants = ["github_ci_blocked != execution_blocked", "external_runner_pass == autonomous_execution_evidence", "local_replay_pass == deterministic_fallback_evidence"];
for (const invariant of requiredInvariants) { if (!receipt.invariants.includes(invariant)) fail("missing receipt invariant: " + invariant); }
if (receipt.execution_classes.local_execution.required !== true) fail("local execution class is not required");
if (receipt.execution_classes.external_runner_execution.required_next !== true) fail("external runner next requirement missing");
if (receipt.execution_classes.deterministic_fallback_execution.required !== true) fail("deterministic fallback requirement missing");
if (receipt.non_claims.github_removed !== false) fail("GitHub removal non-claim invalid");
if (receipt.next_target !== "ops/external-runner-proof-v1") fail("next target mismatch");
ok("autonomous execution receipt verified");
ok("GitHub CI dependency boundary documented");
ok("local deterministic fallback requirement recorded");
ok("external runner proof target declared");
