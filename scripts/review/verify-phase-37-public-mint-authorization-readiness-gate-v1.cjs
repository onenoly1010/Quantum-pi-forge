#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

const GATE = "receipts/governance/phase-37-public-mint-authorization-readiness-gate-v1.json";
const PROOF = "receipts/governance/public-mint-authorization-readiness-proof-v1.json";
const PHASE36 = "receipts/governance/phase-36-public-mint-policy-live-preview-readiness-repair-gate-v1.json";
const PHASE35 = "receipts/governance/phase-35-final-reviewed-values-human-confirmation-v1.json";
const POLICY_REPAIR = "receipts/governance/public-mint-policy-readiness-repair-v1.json";
const APPROVED_PATH = "receipts/governance/public-mint-approved-execution-path-v1.json";
const GAS_PREVIEW = "receipts/governance/public-mint-live-gas-rpc-preview-v1.json";
const NO_GO = "receipts/governance/phase-33-public-mint-execution-no-go-v1.json";

const fail = (msg) => {
  console.error("FAIL phase-37-public-mint-authorization-readiness-gate-v1: " + msg);
  process.exit(1);
};

for (const path of [GATE, PROOF, PHASE36, PHASE35, POLICY_REPAIR, APPROVED_PATH, GAS_PREVIEW, NO_GO]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const gate = JSON.parse(fs.readFileSync(GATE, "utf8"));
const proof = JSON.parse(fs.readFileSync(PROOF, "utf8"));
const phase36 = JSON.parse(fs.readFileSync(PHASE36, "utf8"));
const phase35 = JSON.parse(fs.readFileSync(PHASE35, "utf8"));
const policyRepair = JSON.parse(fs.readFileSync(POLICY_REPAIR, "utf8"));
const approvedPath = JSON.parse(fs.readFileSync(APPROVED_PATH, "utf8"));
const gasPreview = JSON.parse(fs.readFileSync(GAS_PREVIEW, "utf8"));
const noGo = JSON.parse(fs.readFileSync(NO_GO, "utf8"));

if (gate.status !== "PHASE_37_AUTHORIZATION_READINESS_GATE_OPEN_NO_EXECUTION") {
  fail("gate must remain authorization readiness open no-execution");
}

if (proof.status !== "AUTHORIZATION_READINESS_PROVED_NOT_AUTHORIZED") {
  fail("proof must remain proved-not-authorized");
}

if (phase36.status !== "PHASE_36_READINESS_REPAIR_GATE_OPEN_NO_EXECUTION") {
  fail("Phase 36 readiness repair gate must be present");
}

if (phase35.status !== "KRIS_FINAL_REVIEWED_VALUES_CONFIRMED") {
  fail("Phase 35 human confirmation must be recorded");
}

if (noGo.status !== "NO_GO_PUBLIC_MINT_EXECUTION_NOT_AUTHORIZED") {
  fail("Phase 33 NO-GO must remain recorded");
}

if (policyRepair.status !== "POLICY_READINESS_REPAIRED_NOT_AUTHORIZED") {
  fail("mint_allowed policy state must remain repaired-not-authorized");
}

if (policyRepair.policy_decisions?.mint_allowed !== false) {
  fail("mint_allowed must remain false");
}

if (policyRepair.policy_decisions?.public_mint_active !== false) {
  fail("public_mint_active must remain false");
}

if (approvedPath.live_execution_script !== null) {
  fail("live_execution_script must remain null");
}

if (!approvedPath.approved_manual_ui_path?.surface) {
  fail("approved manual UI path must be defined when live_execution_script is null");
}

if (approvedPath.approved_manual_ui_path?.mint_button_enabled !== false) {
  fail("approved manual UI path mint button must remain disabled");
}

const allowedGasStatuses = proof.live_gas_rpc_preview_gate_state?.allowed_statuses || [];
if (!allowedGasStatuses.includes(gasPreview.status)) {
  fail("live gas RPC preview status must be recorded or attempted without broadcast");
}

if (gasPreview.network?.chain_id !== 16661) {
  fail("live gas preview must target chain 16661");
}

const phase35Values = phase35.confirmed_values || {};
const proofValues = proof.preserved_phase_35_confirmed_values || {};
const repairedValues = policyRepair.preserved_phase_35_confirmed_values || {};
for (const key of [
  "model_name",
  "metadataURI",
  "chainId",
  "oinio_token",
  "oiniomodel_registry",
  "stake_amount_wei",
]) {
  if (phase35Values[key] !== proofValues[key]) fail("proof Phase 35 value drift on " + key);
  if (phase35Values[key] !== repairedValues[key]) fail("policy repair Phase 35 value drift on " + key);
}

const fingerprint = phase35.dry_run_preview_fingerprint;
if (fingerprint !== proofValues.dry_run_preview_fingerprint) {
  fail("proof dry_run_preview_fingerprint drift");
}
if (fingerprint !== repairedValues.dry_run_preview_fingerprint) {
  fail("policy repair dry_run_preview_fingerprint drift");
}

for (const key of [
  "signing",
  "broadcast",
  "public_mint_execution",
  "wallet_prompt",
  "wallet_prompt_triggered",
  "automatic_execution",
  "phase_33_live_execution_authorization_retry",
  "live_execution_authorization",
  "live_execution_script_enabled",
]) {
  for (const obj of [gate, proof, policyRepair, approvedPath, gasPreview]) {
    const boundaries = obj.execution_boundaries || {};
    if (key in boundaries && boundaries[key] !== false) {
      fail(obj.receipt + ".execution_boundaries." + key + " must be false");
    }
  }
}

if (gate.decision?.authorize_public_mint !== false) {
  fail("gate must not authorize public mint");
}

if (gate.decision?.open_live_execution_authorization !== false) {
  fail("gate must not open live execution authorization");
}

if (gate.decision?.open_phase_33_live_execution_authorization_retry !== false) {
  fail("gate must not open Phase 33 live execution authorization retry");
}

if (proof.authorization_readiness?.public_mint_authorized !== false) {
  fail("proof must not mark public mint authorized");
}

if (proof.authorization_readiness?.live_execution_authorization_opened !== false) {
  fail("proof must not mark live execution authorization opened");
}

execSync("npm run governance:phase-36-public-mint-readiness-repair-gate:v1:check", { stdio: "inherit" });

console.log("PASS phase-37-public-mint-authorization-readiness-gate-v1");
console.log("OUTCOME PHASE_37_AUTHORIZATION_READINESS_GATE_OPEN_NO_EXECUTION");
console.log("PROOF_STATUS AUTHORIZATION_READINESS_PROVED_NOT_AUTHORIZED");
console.log("MINT_ALLOWED false");
console.log("PUBLIC_MINT_ACTIVE false");
console.log("APPROVED_MANUAL_UI_PATH " + approvedPath.approved_manual_ui_path.surface);
console.log("LIVE_EXECUTION_SCRIPT null");
console.log("LIVE_GAS_PREVIEW_STATUS " + gasPreview.status);
console.log("PHASE_35_FINGERPRINT " + proofValues.dry_run_preview_fingerprint);
console.log("PHASE_33_NO_GO " + noGo.status);
console.log("LIVE_EXECUTION_AUTHORIZATION false");
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("RULE " + gate.live_action_rule);