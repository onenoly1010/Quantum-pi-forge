#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

const GATE = "receipts/governance/phase-34-public-mint-execution-preparation-lane-v1.json";
const NO_GO = "receipts/governance/phase-33-public-mint-execution-no-go-v1.json";
const VALUES = "receipts/governance/public-mint-final-reviewed-values-v1.json";
const PREVIEW = "receipts/governance/public-mint-dry-run-execution-preview-v1.json";
const METADATA = "metadata/qpf-public-mint-model-v1.json";

const fail = (msg) => {
  console.error("FAIL phase-34-public-mint-execution-preparation-lane-v1: " + msg);
  process.exit(1);
};

for (const path of [GATE, NO_GO, VALUES, METADATA]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const gate = JSON.parse(fs.readFileSync(GATE, "utf8"));
const noGo = JSON.parse(fs.readFileSync(NO_GO, "utf8"));
const values = JSON.parse(fs.readFileSync(VALUES, "utf8"));

if (noGo.status !== "NO_GO_PUBLIC_MINT_EXECUTION_NOT_AUTHORIZED") {
  fail("Phase 33 NO-GO receipt required");
}

if (noGo.execution_boundaries?.signing_performed !== false) {
  fail("Phase 33 NO-GO signing_performed must be false");
}

if (values.status !== "FINAL_REVIEWED_VALUES_SEALED_NO_EXECUTION") {
  fail("final reviewed values must be sealed no-execution");
}

const step2args = values.reviewed_execution_sequence?.step_2?.function_args;
for (const key of ["name", "metadataURI", "stakeAmount"]) {
  const v = step2args?.[key];
  if (!v || String(v).includes("<")) fail("placeholder still present in final reviewed values: " + key);
}

if (!fs.existsSync(METADATA)) fail("metadata file missing");

execSync("node scripts/review/public-mint-dry-run-execution-preview-v1.cjs", { stdio: "inherit" });

if (!fs.existsSync(PREVIEW)) fail("dry-run preview receipt missing after harness run");

const preview = JSON.parse(fs.readFileSync(PREVIEW, "utf8"));

if (preview.status !== "DRY_RUN_PREVIEW_NO_BROADCAST") fail("preview must remain dry-run no broadcast");
if (preview.live_execution_script !== null) fail("live execution script must remain null");

for (const tx of preview.preview_transactions || []) {
  if (tx.broadcast !== false || tx.signed !== false) fail("preview tx must not be broadcast or signed");
  if (!tx.calldata || !tx.calldata.startsWith("0x")) fail("preview calldata missing for step " + tx.step);
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
  if (gate.execution_boundaries?.[key] !== false) fail("gate.execution_boundaries." + key + " must be false");
  if (preview.execution_boundaries?.[key] !== false) fail("preview.execution_boundaries." + key + " must be false");
}

console.log("PASS phase-34-public-mint-execution-preparation-lane-v1");
console.log("OUTCOME PHASE_34_PREPARATION_LANE_OPEN_NO_EXECUTION");
console.log("PHASE_33_NO_GO NO_GO_PUBLIC_MINT_EXECUTION_NOT_AUTHORIZED");
console.log("FINAL_NAME " + step2args.name);
console.log("FINAL_METADATA_URI " + step2args.metadataURI);
console.log("LIVE_EXECUTION_SCRIPT null");
console.log("LIVE_GAS_ESTIMATE null");
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("RULE " + gate.live_action_rule);