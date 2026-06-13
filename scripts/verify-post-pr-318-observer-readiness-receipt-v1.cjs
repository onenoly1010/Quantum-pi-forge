#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/governance/post-pr-318-observer-readiness-receipt-v1.json";
const docPath = "docs/governance/POST_PR_318_OBSERVER_READINESS_RECEIPT_V1.md";

function fail(message) {
  console.error("FAIL post-pr-318-observer-readiness-receipt-v1: " + message);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing doc");
if (!fs.existsSync("local-autonomy/parked-observer-v1.cjs")) fail("missing parked observer runtime");
if (!fs.existsSync("local-autonomy/tedious-task-worker-v1.cjs")) fail("missing tedious worker runtime");
if (!fs.existsSync("scripts/run-local-ai-pre-unpark-loop.sh")) fail("missing pre-unpark loop script");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.post_pr_318_observer_readiness_receipt.v1") fail("bad schema");
if (receipt.canonical_branch !== "main") fail("canonical branch must be main");
if (receipt.observer_runtime_present !== true) fail("observer runtime not present");
if (receipt.tedious_worker_present !== true) fail("tedious worker not present");
if (receipt.pre_unpark_loop_script_present !== true) fail("pre-unpark loop script not present");
if (receipt.observer_current_against_canonical_head !== false) fail("stale observer finding must be explicit");
if (receipt.fresh_post_pr_318_observer_cycle_required !== true) fail("fresh observer cycle requirement missing");

for (const key of [
  "non_executing",
  "approval_granted",
  "unpark_executed",
  "deployment_executed",
  "broadcast_executed",
  "wallet_signing_executed",
  "key_access_executed",
  "zero_g_state_changing_action_executed",
  "execution_receipt_created"
]) {
  if (key === "non_executing") {
    if (receipt[key] !== true) fail(`${key} must be true`);
  } else {
    if (receipt[key] !== false) fail(`${key} must be false`);
  }
}

for (const text of [
  "No unpark occurred.",
  "No deployment occurred.",
  "No broadcast occurred.",
  "No wallet signing occurred.",
  "fresh post-PR-318 observer cycle",
  "non-executing"
]) {
  if (!doc.includes(text)) fail("doc missing required text: " + text);
}

console.log("PASS post-pr-318-observer-readiness-receipt-v1");
console.log("canonical_head=" + receipt.canonical_head_short);
console.log("latest_observer_head=" + receipt.latest_observer_head);
