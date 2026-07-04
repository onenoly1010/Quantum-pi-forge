#!/usr/bin/env node
const fs = require("fs");

const REQUEST = "receipts/governance/public-mint-final-reviewed-values-confirmation-request-v1.json";
const VALUES = "receipts/governance/public-mint-final-reviewed-values-v1.json";
const PREVIEW = "receipts/governance/public-mint-dry-run-execution-preview-v1.json";
const POLICY = "receipts/governance/public-mint-policy-final-v1.json";
const SPEC = "receipts/governance/public-mint-execution-path-spec-v1.json";

const fail = (msg) => {
  console.error("FAIL final-reviewed-values-human-confirmation-v1: " + msg);
  process.exit(1);
};

for (const path of [REQUEST, VALUES, PREVIEW, POLICY, SPEC]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const request = JSON.parse(fs.readFileSync(REQUEST, "utf8"));
const values = JSON.parse(fs.readFileSync(VALUES, "utf8"));
const preview = JSON.parse(fs.readFileSync(PREVIEW, "utf8"));
const policy = JSON.parse(fs.readFileSync(POLICY, "utf8"));
const spec = JSON.parse(fs.readFileSync(SPEC, "utf8"));

if (request.status !== "PENDING_KRIS_EXPLICIT_CONFIRMATION") {
  fail("confirmation request must remain pending");
}

if (request.kris_confirmation?.confirmed !== false) {
  fail("kris_confirmation.confirmed must be false");
}

const fields = request.fields_requiring_human_confirmation;
const step2 = fields.exact_execution_path.step_2.function_args;

if (step2.name !== values.reviewed_execution_sequence.step_2.function_args.name) {
  fail("model name mismatch between request and final reviewed values");
}
if (step2.metadataURI !== values.reviewed_execution_sequence.step_2.function_args.metadataURI) {
  fail("metadataURI mismatch between request and final reviewed values");
}

console.log("=== PHASE 35 FINAL REVIEWED VALUES CONFIRMATION SHEET (Kris review only) ===");
console.log("");
console.log("RULE: No Phase 33 execution authorization retry until Kris explicitly confirms these exact literal values.");
console.log("");
console.log("model_name: " + fields.model_name);
console.log("metadataURI: " + fields.metadataURI);
console.log("metadataURI_backup: " + fields.metadataURI_backup);
console.log("metadata_file: " + fields.metadata_file);
console.log("chainId: " + fields.chainId);
console.log("network: " + fields.network);
console.log("");
console.log("--- exact_execution_path step 1 ---");
console.log(JSON.stringify(fields.exact_execution_path.step_1, null, 2));
console.log("");
console.log("--- exact_execution_path step 2 ---");
console.log(JSON.stringify(fields.exact_execution_path.step_2, null, 2));
console.log("");
console.log("expected_value: " + JSON.stringify(fields.expected_value, null, 2));
console.log("");
console.log("gas_behavior: " + JSON.stringify(fields.gas_behavior, null, 2));
console.log("");
console.log("two_transaction_prompt_preview.prompt_1: " + fields.two_transaction_prompt_preview.prompt_1);
console.log("two_transaction_prompt_preview.prompt_2: " + fields.two_transaction_prompt_preview.prompt_2);
console.log("");
console.log("mint_allowed_policy_state.mint_allowed: " + fields.mint_allowed_policy_state.mint_allowed);
console.log("mint_allowed_policy_state.public_mint_active: " + fields.mint_allowed_policy_state.public_mint_active);
console.log("mint_allowed_policy_state.path_spec_status: " + fields.mint_allowed_policy_state.path_spec_status);
console.log("mint_allowed_policy_state.policy_receipt: " + fields.mint_allowed_policy_state.policy_receipt);
console.log("");
console.log("abort_conditions:");
for (const item of fields.abort_conditions) console.log("- " + item);
console.log("");
console.log("dry_run_preview.sha256: " + preview.sha256);
console.log("path_spec.status: " + spec.status);
console.log("path_spec.live_execution_script: " + spec.exact_frontend_or_script_call.live_execution_script);
console.log("policy.policy_decisions.mint_allowed: " + policy.policy_decisions.mint_allowed);
console.log("");
console.log("PASS final-reviewed-values-human-confirmation-v1");
console.log("MODE human_confirmation_request_no_execution");
console.log("KRIS_CONFIRMED false");
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("PHASE_33_EXECUTION_AUTHORIZATION false");