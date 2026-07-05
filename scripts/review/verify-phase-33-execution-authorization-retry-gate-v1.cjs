#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

const GATE = "receipts/governance/phase-33-execution-authorization-retry-gate-v1.json";
const REQUEST = "receipts/governance/public-mint-execution-authorization-retry-request-v1.json";
const PHASE35 = "receipts/governance/phase-35-final-reviewed-values-human-confirmation-v1.json";
const POLICY = "receipts/governance/public-mint-policy-final-v1.json";
const SPEC = "receipts/governance/public-mint-execution-path-spec-v1.json";

const fail = (msg) => {
  console.error("FAIL phase-33-execution-authorization-retry-gate-v1: " + msg);
  process.exit(1);
};

for (const path of [GATE, REQUEST, PHASE35, POLICY, SPEC]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const gate = JSON.parse(fs.readFileSync(GATE, "utf8"));
const request = JSON.parse(fs.readFileSync(REQUEST, "utf8"));
const phase35 = JSON.parse(fs.readFileSync(PHASE35, "utf8"));
const policy = JSON.parse(fs.readFileSync(POLICY, "utf8"));
const spec = JSON.parse(fs.readFileSync(SPEC, "utf8"));

if (phase35.status !== "KRIS_FINAL_REVIEWED_VALUES_CONFIRMED") {
  fail("Phase 35 final values must be confirmed");
}

const mintAllowed = policy.policy_decisions?.mint_allowed;
const liveScript = spec.exact_frontend_or_script_call?.live_execution_script;

if (mintAllowed !== false) fail("mint_allowed must be false for current NO-GO posture");
if (liveScript !== null) fail("live_execution_script must remain null");

if (gate.decision_outcome !== "NO_GO_PHASE_33_EXECUTION_AUTHORIZATION_RETRY_NOT_AUTHORIZED") {
  fail("retry gate must be NO_GO while mint_allowed is false or live_execution_script is null");
}

if (request.status !== "PENDING_KRIS_EXPLICIT_RETRY_APPROVAL") {
  fail("retry request must remain pending");
}

if (request.kris_retry_approval?.approved !== false) {
  fail("kris_retry_approval.approved must be false");
}

if (request.phase_35_final_values_confirmed?.status !== "KRIS_FINAL_REVIEWED_VALUES_CONFIRMED") {
  fail("retry request must show Phase 35 confirmed");
}

for (const key of [
  "signing",
  "broadcast",
  "public_mint_execution",
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

if (gate.execution_boundaries?.kris_retry_approval_recorded !== false) {
  fail("kris_retry_approval_recorded must be false");
}

execSync("npm run governance:phase-33-execution-authorization-retry-review:v1:check", { stdio: "inherit" });

console.log("PASS phase-33-execution-authorization-retry-gate-v1");
console.log("OUTCOME NO_GO_PHASE_33_EXECUTION_AUTHORIZATION_RETRY_NOT_AUTHORIZED");
console.log("PHASE_35_CONFIRMED KRIS_FINAL_REVIEWED_VALUES_CONFIRMED");
console.log("MINT_ALLOWED false");
console.log("LIVE_EXECUTION_SCRIPT null");
console.log("LIVE_GAS_PREVIEW NOT_SATISFIED");
console.log("KRIS_RETRY_APPROVAL false");
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("RULE " + gate.live_action_rule);