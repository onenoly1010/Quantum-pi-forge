#!/usr/bin/env node
const fs = require("fs");

const REQUEST = "receipts/governance/public-mint-execution-authorization-retry-request-v1.json";
const PHASE35 = "receipts/governance/phase-35-final-reviewed-values-human-confirmation-v1.json";
const POLICY = "receipts/governance/public-mint-policy-final-v1.json";
const SPEC = "receipts/governance/public-mint-execution-path-spec-v1.json";

const fail = (msg) => {
  console.error("FAIL phase-33-execution-authorization-retry-review-v1: " + msg);
  process.exit(1);
};

for (const path of [REQUEST, PHASE35, POLICY, SPEC]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const request = JSON.parse(fs.readFileSync(REQUEST, "utf8"));
const phase35 = JSON.parse(fs.readFileSync(PHASE35, "utf8"));
const policy = JSON.parse(fs.readFileSync(POLICY, "utf8"));
const spec = JSON.parse(fs.readFileSync(SPEC, "utf8"));

console.log("=== PHASE 33 EXECUTION AUTHORIZATION RETRY GATE (review only) ===");
console.log("");
console.log("RULE: Governance/review only. No signing. No broadcast. No wallet prompt. No execution.");
console.log("");
console.log("phase_35_final_values_confirmed.status: " + phase35.status);
console.log("phase_35_final_values_confirmed.model_name: " + phase35.confirmed_values.model_name);
console.log("phase_35_final_values_confirmed.metadataURI: " + phase35.confirmed_values.metadataURI);
console.log("phase_35_final_values_confirmed.chainId: " + phase35.confirmed_values.chainId);
console.log("phase_35_final_values_confirmed.dry_run_preview_fingerprint: " + phase35.dry_run_preview_fingerprint);
console.log("");
console.log("mint_allowed_policy_state.mint_allowed: " + policy.policy_decisions.mint_allowed);
console.log("mint_allowed_policy_state.public_mint_active: " + policy.policy_decisions.public_mint_active);
console.log("mint_allowed_policy_state.path_spec_status: " + spec.status);
console.log("");
console.log("live_execution_script_status.path_spec_live_execution_script: " + spec.exact_frontend_or_script_call.live_execution_script);
console.log("live_execution_script_status.live_execution_script_enabled: false");
console.log("");
console.log("live_gas_preview_requirement.live_gas_estimate: " + request.live_gas_preview_requirement.live_gas_estimate);
console.log("live_gas_preview_requirement.transaction_count: " + request.live_gas_preview_requirement.transaction_count);
console.log("live_gas_preview_requirement.payer: " + request.live_gas_preview_requirement.payer);
console.log("live_gas_preview_requirement.requirement: " + request.live_gas_preview_requirement.requirement);
console.log("live_gas_preview_requirement.current_status: " + request.live_gas_preview_requirement.current_status);
console.log("");
console.log("--- exact_two_transaction_sequence step 1 ---");
console.log(JSON.stringify(request.exact_two_transaction_sequence.step_1, null, 2));
console.log("");
console.log("--- exact_two_transaction_sequence step 2 ---");
console.log(JSON.stringify(request.exact_two_transaction_sequence.step_2, null, 2));
console.log("");
console.log("abort_conditions:");
for (const item of request.abort_conditions) console.log("- " + item);
console.log("");
console.log("execution_boundaries:");
for (const [key, value] of Object.entries(request.execution_boundaries)) {
  console.log("  " + key + ": " + value);
}
console.log("");
const mintAllowed = policy.policy_decisions.mint_allowed;
const liveScript = spec.exact_frontend_or_script_call.live_execution_script;
const forcedNoGo = mintAllowed === false || liveScript === null;
console.log("retry_outcome_auto_check.mint_allowed_false_forces_no_go: " + (mintAllowed === false));
console.log("retry_outcome_auto_check.live_execution_script_null_forces_no_go: " + (liveScript === null));
console.log("retry_outcome: " + (forcedNoGo ? "NO_GO_PHASE_33_EXECUTION_AUTHORIZATION_RETRY_NOT_AUTHORIZED" : "REVIEW_PENDING_EXPLICIT_APPROVAL"));
console.log("");
console.log("PASS phase-33-execution-authorization-retry-review-v1");
console.log("MODE governance_review_only_no_execution");
console.log("KRIS_RETRY_APPROVAL false");
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("PUBLIC_MINT_EXECUTION false");