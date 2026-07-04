#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

const GATE = "receipts/governance/phase-38-public-mint-authorization-gate-v1.json";
const DECISION = "receipts/governance/phase-38-public-mint-authorization-decision-v1.json";
const REQUEST = "receipts/governance/public-mint-authorization-decision-request-v1.json";
const PHASE37 = "receipts/governance/phase-37-public-mint-authorization-readiness-gate-v1.json";
const PROOF37 = "receipts/governance/public-mint-authorization-readiness-proof-v1.json";
const PHASE36 = "receipts/governance/phase-36-public-mint-policy-live-preview-readiness-repair-gate-v1.json";
const PHASE35 = "receipts/governance/phase-35-final-reviewed-values-human-confirmation-v1.json";
const NO_GO33 = "receipts/governance/phase-33-public-mint-execution-no-go-v1.json";

const fail = (msg) => {
  console.error("FAIL phase-38-public-mint-authorization-gate-v1: " + msg);
  process.exit(1);
};

for (const path of [GATE, DECISION, REQUEST, PHASE37, PROOF37, PHASE36, PHASE35, NO_GO33]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const gate = JSON.parse(fs.readFileSync(GATE, "utf8"));
const decision = JSON.parse(fs.readFileSync(DECISION, "utf8"));
const request = JSON.parse(fs.readFileSync(REQUEST, "utf8"));
const phase37 = JSON.parse(fs.readFileSync(PHASE37, "utf8"));
const proof37 = JSON.parse(fs.readFileSync(PROOF37, "utf8"));
const phase36 = JSON.parse(fs.readFileSync(PHASE36, "utf8"));
const phase35 = JSON.parse(fs.readFileSync(PHASE35, "utf8"));
const noGo33 = JSON.parse(fs.readFileSync(NO_GO33, "utf8"));

if (gate.status !== "PHASE_38_AUTHORIZATION_GATE_OPEN_NO_EXECUTION") {
  fail("gate must remain authorization open no-execution");
}

if (phase37.status !== "PHASE_37_AUTHORIZATION_READINESS_GATE_OPEN_NO_EXECUTION") {
  fail("Phase 37 authorization-readiness gate must be sealed present");
}

if (proof37.status !== "AUTHORIZATION_READINESS_PROVED_NOT_AUTHORIZED") {
  fail("Phase 37 proof must remain proved-not-authorized");
}

if (phase36.status !== "PHASE_36_READINESS_REPAIR_GATE_OPEN_NO_EXECUTION") {
  fail("Phase 36 readiness repair gate must be sealed present");
}

if (phase35.status !== "KRIS_FINAL_REVIEWED_VALUES_CONFIRMED") {
  fail("Phase 35 final values must remain confirmed");
}

if (noGo33.status !== "NO_GO_PUBLIC_MINT_EXECUTION_NOT_AUTHORIZED") {
  fail("Phase 33 execution NO-GO must remain recorded");
}

if (gate.decision_outcome !== decision.decision_outcome) {
  fail("gate and decision outcomes must match");
}

if (decision.decision_outcome !== "NO_GO_PUBLIC_MINT_AUTHORIZATION_NOT_GRANTED") {
  fail("Phase 38 default decision must remain NO-GO until explicit human YES is recorded separately");
}

if (decision.authorization_state?.public_mint_authorized !== false) {
  fail("public_mint_authorized must remain false at NO-GO decision");
}

if (decision.authorization_state?.mint_allowed !== false) {
  fail("mint_allowed must remain false");
}

if (decision.authorization_state?.public_mint_active !== false) {
  fail("public_mint_active must remain false");
}

if (decision.authorization_state?.live_execution_authorization !== false) {
  fail("live execution authorization must remain false and separate");
}

if (request.human_decision?.decided !== false) {
  fail("human authorization decision must remain undecided for YES path");
}

const phase35Values = phase35.confirmed_values || {};
const decisionValues = decision.preserved_phase_35_confirmed_values || {};
for (const key of ["model_name", "metadataURI", "chainId", "oinio_token", "oiniomodel_registry", "stake_amount_wei"]) {
  if (phase35Values[key] !== decisionValues[key]) {
    fail("Phase 35 value drift on " + key);
  }
}
if (phase35.dry_run_preview_fingerprint !== decisionValues.dry_run_preview_fingerprint) {
  fail("Phase 35 fingerprint drift");
}

for (const key of [
  "signing",
  "broadcast",
  "public_mint_execution",
  "wallet_prompt",
  "wallet_prompt_triggered",
  "automatic_execution",
  "live_execution_authorization",
  "phase_33_live_execution_authorization_retry",
  "live_execution_script_enabled",
  "transaction_receipt_created",
]) {
  for (const obj of [gate, decision, request]) {
    const boundaries = obj.execution_boundaries || {};
    if (key in boundaries && boundaries[key] !== false) {
      fail(obj.receipt + ".execution_boundaries." + key + " must be false");
    }
  }
}

if (gate.decision?.authorize_public_mint !== false) {
  fail("gate must not authorize public mint without explicit YES");
}

if (gate.decision?.open_live_execution_authorization !== false) {
  fail("gate must not open live execution authorization");
}

if (gate.decision?.create_transaction_receipt !== false) {
  fail("gate must not create transaction receipts");
}

execSync("npm run governance:phase-37-public-mint-authorization-readiness-gate:v1:check", { stdio: "inherit" });
execSync("npm run governance:public-mint-authorization-decision-review:v1:check", { stdio: "inherit" });

console.log("PASS phase-38-public-mint-authorization-gate-v1");
console.log("OUTCOME PHASE_38_AUTHORIZATION_GATE_OPEN_NO_EXECUTION");
console.log("DECISION " + gate.decision_outcome);
console.log("PUBLIC_MINT_AUTHORIZED false");
console.log("MINT_ALLOWED false");
console.log("PUBLIC_MINT_ACTIVE false");
console.log("LIVE_EXECUTION_AUTHORIZATION false");
console.log("PHASE_37_PROOF " + proof37.status);
console.log("PHASE_36_GATE " + phase36.status);
console.log("PHASE_35_CONFIRMED " + phase35.status);
console.log("PHASE_33_NO_GO " + noGo33.status);
console.log("TRANSACTION_RECEIPT_CREATED false");
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("RULE " + gate.live_action_rule);