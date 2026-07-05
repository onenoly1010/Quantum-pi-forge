#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

const GATE = "receipts/governance/phase-33-public-mint-execution-gate-v1.json";
const REQUEST = "receipts/governance/public-mint-execution-approval-request-v1.json";
const PHASE32 = "receipts/governance/phase-32-human-signing-approval-v1.json";
const SPEC = "receipts/governance/public-mint-execution-path-spec-v1.json";
const EXPECTED_FINGERPRINT = "5389c18c03bc9adaf6cb251d21ce5aef07ca07b5b5425ae62ba0f0adf75b56ad";

const fail = (msg) => {
  console.error("FAIL phase-33-public-mint-execution-gate-v1: " + msg);
  process.exit(1);
};

for (const path of [GATE, REQUEST, PHASE32, SPEC]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const gate = JSON.parse(fs.readFileSync(GATE, "utf8"));
const request = JSON.parse(fs.readFileSync(REQUEST, "utf8"));
const phase32 = JSON.parse(fs.readFileSync(PHASE32, "utf8"));
const spec = JSON.parse(fs.readFileSync(SPEC, "utf8"));

if (phase32.status !== "KRIS_EXPLICIT_SIGNING_APPROVAL_RECORDED") {
  fail("Phase 32 approval must be recorded before Phase 33 gate opens");
}

if (phase32.approved_fingerprint !== EXPECTED_FINGERPRINT) {
  fail("Phase 32 fingerprint mismatch");
}

if (phase32.execution_boundaries?.signing_performed !== false) {
  fail("Phase 32 signing_performed must remain false");
}

if (phase32.execution_boundaries?.broadcast_performed !== false) {
  fail("Phase 32 broadcast_performed must remain false");
}

if (request.status !== "PENDING_KRIS_EXPLICIT_EXECUTION_APPROVAL") {
  fail("execution approval request must remain pending until Kris explicitly approves");
}

if (request.kris_execution_approval?.approved !== false) {
  fail("kris_execution_approval.approved must be false");
}

if (gate.decision_outcome !== "NO_GO_PUBLIC_MINT_EXECUTION_NOT_AUTHORIZED") {
  fail("gate must remain NO_GO until Kris explicit execution approval is recorded separately");
}

if (spec.status !== "REVIEW_ONLY_NOT_EXECUTABLE") {
  fail("path spec must remain REVIEW_ONLY_NOT_EXECUTABLE");
}

if (spec.exact_frontend_or_script_call?.live_execution_script !== null) {
  fail("live execution script must remain null");
}

const seq = request.exact_execution_sequence;
if (seq.chain_id !== 16661) fail("chainId must be 16661");
if (seq.step_1.contract !== "0x75995EC0fdf881189850aeD864cB3f43c0DFCb58") fail("step 1 contract mismatch");
if (seq.step_2.contract !== "0x67aD7169184581f23D1E10B39d4eb4e98293E87a") fail("step 2 contract mismatch");
if (seq.live_execution_script !== null) fail("live_execution_script must be null in approval request");

for (const key of [
  "signing",
  "broadcast",
  "public_mint_execution",
  "wallet_actions",
  "wallet_prompt",
  "wallet_prompt_triggered",
  "automatic_execution",
  "live_execution_script_enabled",
]) {
  if (request.execution_boundaries?.[key] !== false) {
    fail("request.execution_boundaries." + key + " must be false");
  }
  if (gate.execution_boundaries?.[key] !== false) {
    fail("gate.execution_boundaries." + key + " must be false");
  }
}

execSync("npm run governance:public-mint-execution-path-review:v1:check", { stdio: "inherit" });
execSync("npm run governance:human-wallet-prompt-inspection:v1:check", { stdio: "inherit" });

console.log("PASS phase-33-public-mint-execution-gate-v1");
console.log("OUTCOME NO_GO_PUBLIC_MINT_EXECUTION_NOT_AUTHORIZED");
console.log("PHASE_32_APPROVAL KRIS_EXPLICIT_SIGNING_APPROVAL_RECORDED");
console.log("KRIS_EXECUTION_APPROVAL false");
console.log("LIVE_EXECUTION_SCRIPT null");
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("WALLET_PROMPT_TRIGGERED false");
console.log("RULE " + gate.live_action_rule);