#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

const GATE = "receipts/governance/phase-35-final-reviewed-values-human-confirmation-gate-v1.json";
const REQUEST = "receipts/governance/public-mint-final-reviewed-values-confirmation-request-v1.json";
const PHASE34 = "receipts/governance/phase-34-public-mint-execution-preparation-lane-v1.json";
const VALUES = "receipts/governance/public-mint-final-reviewed-values-v1.json";
const PREVIEW = "receipts/governance/public-mint-dry-run-execution-preview-v1.json";
const NO_GO = "receipts/governance/phase-33-public-mint-execution-no-go-v1.json";

const fail = (msg) => {
  console.error("FAIL phase-35-final-reviewed-values-human-confirmation-gate-v1: " + msg);
  process.exit(1);
};

for (const path of [GATE, REQUEST, PHASE34, VALUES, PREVIEW, NO_GO]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const gate = JSON.parse(fs.readFileSync(GATE, "utf8"));
const request = JSON.parse(fs.readFileSync(REQUEST, "utf8"));
const phase34 = JSON.parse(fs.readFileSync(PHASE34, "utf8"));
const noGo = JSON.parse(fs.readFileSync(NO_GO, "utf8"));

if (phase34.status !== "PHASE_34_PREPARATION_LANE_OPEN_NO_EXECUTION") {
  fail("Phase 34 preparation lane must be open");
}

if (noGo.status !== "NO_GO_PUBLIC_MINT_EXECUTION_NOT_AUTHORIZED") {
  fail("Phase 33 NO-GO must remain recorded");
}

if (request.status !== "PENDING_KRIS_EXPLICIT_CONFIRMATION") {
  fail("confirmation request must remain pending");
}

if (request.kris_confirmation?.confirmed !== false) {
  fail("kris_confirmation.confirmed must be false");
}

if (gate.decision_outcome !== "NO_GO_FINAL_VALUES_NOT_CONFIRMED") {
  fail("gate must remain NO_GO until Kris explicit confirmation is recorded separately");
}

const fields = request.fields_requiring_human_confirmation;
if (fields.model_name !== "QPF Public Mint Model v1") fail("model_name missing");
if (!fields.metadataURI || fields.metadataURI.includes("<")) fail("metadataURI must be final literal");
if (fields.chainId !== 16661) fail("chainId must be 16661");
if (fields.mint_allowed_policy_state?.mint_allowed !== false) fail("mint_allowed must remain false");

for (const key of [
  "signing",
  "broadcast",
  "public_mint_execution",
  "wallet_prompt",
  "wallet_prompt_triggered",
  "automatic_execution",
  "phase_33_execution_authorization",
  "live_execution_script_enabled",
]) {
  if (request.execution_boundaries?.[key] !== false) {
    fail("request.execution_boundaries." + key + " must be false");
  }
  if (gate.execution_boundaries?.[key] !== false) {
    fail("gate.execution_boundaries." + key + " must be false");
  }
}

if (gate.execution_boundaries?.kris_final_values_confirmed !== false) {
  fail("kris_final_values_confirmed must be false");
}

execSync("npm run governance:phase-34-public-mint-execution-preparation-lane:v1:check", { stdio: "inherit" });
execSync("npm run governance:final-reviewed-values-human-confirmation:v1:check", { stdio: "inherit" });

console.log("PASS phase-35-final-reviewed-values-human-confirmation-gate-v1");
console.log("OUTCOME NO_GO_FINAL_VALUES_NOT_CONFIRMED");
console.log("MODEL_NAME " + fields.model_name);
console.log("METADATA_URI " + fields.metadataURI);
console.log("MINT_ALLOWED false");
console.log("LIVE_EXECUTION_SCRIPT null");
console.log("KRIS_CONFIRMED false");
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("RULE " + gate.live_action_rule);