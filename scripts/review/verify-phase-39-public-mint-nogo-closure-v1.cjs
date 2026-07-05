#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

const CLOSURE = "receipts/governance/phase-39-public-mint-nogo-closure-v1.json";
const INDEX = "receipts/governance/public-mint-nogo-next-requirements-index-v1.json";
const PHASE38_GATE = "receipts/governance/phase-38-public-mint-authorization-gate-v1.json";
const PHASE38_DECISION = "receipts/governance/phase-38-public-mint-authorization-decision-v1.json";
const REQUEST = "receipts/governance/public-mint-authorization-decision-request-v1.json";

const fail = (msg) => {
  console.error("FAIL phase-39-public-mint-nogo-closure-v1: " + msg);
  process.exit(1);
};

for (const path of [CLOSURE, INDEX, PHASE38_GATE, PHASE38_DECISION, REQUEST]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const closure = JSON.parse(fs.readFileSync(CLOSURE, "utf8"));
const index = JSON.parse(fs.readFileSync(INDEX, "utf8"));
const phase38Gate = JSON.parse(fs.readFileSync(PHASE38_GATE, "utf8"));
const phase38Decision = JSON.parse(fs.readFileSync(PHASE38_DECISION, "utf8"));
const request = JSON.parse(fs.readFileSync(REQUEST, "utf8"));

if (closure.status !== "PHASE_39_NOGO_CLOSURE_SEALED_NO_EXECUTION") {
  fail("closure must remain sealed no-execution");
}

if (phase38Decision.status !== "NO_GO_PUBLIC_MINT_AUTHORIZATION_NOT_GRANTED") {
  fail("Phase 38 NO-GO decision must remain sealed");
}

if (phase38Gate.decision_outcome !== "NO_GO_PUBLIC_MINT_AUTHORIZATION_NOT_GRANTED") {
  fail("Phase 38 gate outcome must remain NO-GO");
}

if (closure.closure_record?.public_mint_authorized !== false) {
  fail("public_mint_authorized must remain false");
}

if (closure.closure_record?.authorization_reopened !== false) {
  fail("authorization must not be reopened");
}

if (closure.closure_record?.live_execution_opened !== false) {
  fail("live execution must not be opened");
}

if (closure.decision?.reopen_public_mint_authorization !== false) {
  fail("closure must not reopen public mint authorization");
}

if (index.sealed_nogo_state?.public_mint_authorized !== false) {
  fail("index must preserve public_mint_authorized false");
}

if (!Array.isArray(index.remaining_requirements_before_future_authorization) || index.remaining_requirements_before_future_authorization.length < 8) {
  fail("next requirements index must list remaining requirements");
}

for (const req of index.remaining_requirements_before_future_authorization) {
  if (req.status !== "not_met") fail("requirement " + req.id + " must remain not_met at closure");
}

if (index.explicitly_not_reopened?.public_mint_authorization !== true) {
  fail("index must explicitly mark authorization not reopened");
}

if (request.human_decision?.decided !== false) {
  fail("authorization decision request must remain undecided for future YES path");
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
  "reopen_public_mint_authorization",
]) {
  for (const obj of [closure, index]) {
    const boundaries = obj.execution_boundaries || {};
    if (key in boundaries && boundaries[key] !== false) {
      fail(obj.receipt + ".execution_boundaries." + key + " must be false");
    }
  }
}

execSync("npm run governance:phase-38-public-mint-authorization-gate:v1:check", { stdio: "inherit" });

console.log("PASS phase-39-public-mint-nogo-closure-v1");
console.log("OUTCOME PHASE_39_NOGO_CLOSURE_SEALED_NO_EXECUTION");
console.log("PHASE_38_DECISION NO_GO_PUBLIC_MINT_AUTHORIZATION_NOT_GRANTED");
console.log("PUBLIC_MINT_AUTHORIZED false");
console.log("AUTHORIZATION_REOPENED false");
console.log("LIVE_EXECUTION_OPENED false");
console.log("REQUIREMENTS_INDEXED " + index.remaining_requirements_before_future_authorization.length);
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("RULE " + closure.live_action_rule);