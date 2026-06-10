#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL: " + msg);
  process.exit(1);
}

function ok(msg) {
  console.log("OK: " + msg);
}

const doc = fs.readFileSync("docs/operations/EXTERNAL_RUNNER_LIVE_LOG_V1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/execution/external-runner-live-log-v1.json", "utf8"));

for (const term of [
  "live_log_absent != live_runner_pass",
  "prepared_receipt != live_runner_pass",
  "local_workflow_log != external_runner_pass",
  "No external runner pass may be claimed until a real runner log exists"
]) {
  if (!doc.includes(term)) fail("missing doc term: " + term);
}

if (receipt.schema !== "qpf.external_runner_live_log.v1") fail("schema mismatch");
if (receipt.status !== "live_log_absent") fail("status must be live_log_absent");
if (receipt.live_runner_pass_claimed !== false) fail("must not claim live runner pass");
if (receipt.external_runner_proof_receipt_status !== "prepared") fail("proof receipt status must remain prepared");

ok("external runner live-log absence receipt verified");
ok("no false live runner pass claimed");
ok("prepared receipt boundary preserved");
ok("future real runner log requirement recorded");
