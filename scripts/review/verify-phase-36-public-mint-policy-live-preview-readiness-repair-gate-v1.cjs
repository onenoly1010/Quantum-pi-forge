#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

const GATE = "receipts/governance/phase-36-public-mint-policy-live-preview-readiness-repair-gate-v1.json";
const PHASE35 = "receipts/governance/phase-35-final-reviewed-values-human-confirmation-v1.json";
const POLICY_REPAIR = "receipts/governance/public-mint-policy-readiness-repair-v1.json";
const APPROVED_PATH = "receipts/governance/public-mint-approved-execution-path-v1.json";
const GAS_PREVIEW = "receipts/governance/public-mint-live-gas-rpc-preview-v1.json";
const SPEC = "receipts/governance/public-mint-execution-path-spec-v1.json";
const NO_GO = "receipts/governance/phase-33-public-mint-execution-no-go-v1.json";

const fail = (msg) => {
  console.error("FAIL phase-36-public-mint-policy-live-preview-readiness-repair-gate-v1: " + msg);
  process.exit(1);
};

for (const path of [GATE, PHASE35, POLICY_REPAIR, APPROVED_PATH, GAS_PREVIEW, SPEC, NO_GO]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const gate = JSON.parse(fs.readFileSync(GATE, "utf8"));
const phase35 = JSON.parse(fs.readFileSync(PHASE35, "utf8"));
const policyRepair = JSON.parse(fs.readFileSync(POLICY_REPAIR, "utf8"));
const approvedPath = JSON.parse(fs.readFileSync(APPROVED_PATH, "utf8"));
const gasPreview = JSON.parse(fs.readFileSync(GAS_PREVIEW, "utf8"));
const spec = JSON.parse(fs.readFileSync(SPEC, "utf8"));
const noGo = JSON.parse(fs.readFileSync(NO_GO, "utf8"));

if (phase35.status !== "KRIS_FINAL_REVIEWED_VALUES_CONFIRMED") {
  fail("Phase 35 human confirmation must be recorded");
}

if (noGo.status !== "NO_GO_PUBLIC_MINT_EXECUTION_NOT_AUTHORIZED") {
  fail("Phase 33 NO-GO must remain recorded");
}

if (gate.status !== "PHASE_36_READINESS_REPAIR_GATE_OPEN_NO_EXECUTION") {
  fail("gate must remain readiness repair open no-execution");
}

if (policyRepair.status !== "POLICY_READINESS_REPAIRED_NOT_AUTHORIZED") {
  fail("policy repair receipt must remain not authorized");
}

if (policyRepair.policy_decisions?.mint_allowed !== false) {
  fail("mint_allowed must remain false after repair");
}

if (policyRepair.policy_decisions?.public_mint_active !== false) {
  fail("public_mint_active must remain false after repair");
}

if (approvedPath.status !== "APPROVED_MANUAL_UI_PATH_DEFINED_NOT_EXECUTABLE") {
  fail("approved execution path must remain not executable");
}

if (approvedPath.live_execution_script !== null) {
  fail("live_execution_script must remain null");
}

if (!approvedPath.approved_manual_ui_path?.surface) {
  fail("approved manual UI path must be defined");
}

if (approvedPath.approved_manual_ui_path?.mint_button_enabled !== false) {
  fail("mint button must remain disabled on approved manual UI path");
}

const allowedGasStatuses = [
  "LIVE_GAS_RPC_PREVIEW_RECORDED_NO_BROADCAST",
  "LIVE_GAS_RPC_PREVIEW_ATTEMPTED_NO_BROADCAST",
];
if (!allowedGasStatuses.includes(gasPreview.status)) {
  fail("live gas RPC preview status invalid");
}

if (gasPreview.network?.chain_id !== 16661) {
  fail("live gas preview must target chain 16661");
}

if (spec.status !== "REVIEW_ONLY_NOT_EXECUTABLE") {
  fail("path spec base status must remain REVIEW_ONLY_NOT_EXECUTABLE");
}

if (approvedPath.path_spec_status_repaired_classification !== "LIVE_PREVIEW_READY_NOT_EXECUTABLE") {
  fail("repaired path classification missing");
}

const phase35Values = phase35.confirmed_values || {};
const repairedValues = policyRepair.preserved_phase_35_confirmed_values || {};
for (const key of [
  "model_name",
  "metadataURI",
  "chainId",
  "oinio_token",
  "oiniomodel_registry",
  "stake_amount_wei",
]) {
  if (phase35Values[key] !== repairedValues[key]) {
    fail("Phase 35 value drift on " + key);
  }
}

for (const key of [
  "signing",
  "broadcast",
  "public_mint_execution",
  "wallet_prompt",
  "wallet_prompt_triggered",
  "automatic_execution",
  "phase_33_live_execution_authorization_retry",
  "live_execution_script_enabled",
]) {
  for (const obj of [gate, policyRepair, approvedPath, gasPreview]) {
    const boundaries = obj.execution_boundaries || {};
    if (key in boundaries && boundaries[key] !== false) {
      fail(obj.receipt + ".execution_boundaries." + key + " must be false");
    }
  }
}

if (gate.decision?.execute_public_mint !== false) {
  fail("gate must not authorize public mint execution");
}

if (gate.decision?.open_phase_33_live_execution_authorization !== false) {
  fail("gate must not open Phase 33 live execution authorization");
}

execSync("npm run governance:public-mint-live-gas-rpc-preview:v1:check", { stdio: "inherit" });
execSync("npm run governance:phase-35-final-reviewed-values-human-confirmation-gate:v1:check", { stdio: "inherit" });

console.log("PASS phase-36-public-mint-policy-live-preview-readiness-repair-gate-v1");
console.log("OUTCOME PHASE_36_READINESS_REPAIR_GATE_OPEN_NO_EXECUTION");
console.log("MINT_ALLOWED false");
console.log("PUBLIC_MINT_ACTIVE false");
console.log("PATH_SPEC_REPAIRED " + approvedPath.path_spec_status_repaired_classification);
console.log("APPROVED_MANUAL_UI_PATH " + approvedPath.approved_manual_ui_path.surface);
console.log("LIVE_EXECUTION_SCRIPT null");
console.log("LIVE_GAS_PREVIEW_STATUS " + gasPreview.status);
console.log("PHASE_33_NO_GO " + noGo.status);
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("RULE " + gate.live_action_rule);