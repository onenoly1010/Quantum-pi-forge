# Execution Wrapper Readiness Corrective v1

This lane prepares the next corrective wrapper-readiness step after the sealed failed attempt for PR #298 and the post-merge closure of PR #300/#301.

This is not an execution lane.

## Hard boundaries

- stash_applied: false
- wrapper_executed: false
- deployment_executed: false
- broadcast_executed: false
- state_changing_transaction_executed: false
- successful_exit_artifact_present: false

## Prior sealed finding

- PR #298 review wrapper_status: failed_or_missing
- PR #298 review exit_code: 1
- PR #300 post-merge wrapper_status: failed_or_missing
- PR #300 post-merge exit_code: 1

## Corrective readiness objective

Before any future execution attempt, the wrapper lane must expose a deterministic inspection surface that can distinguish:

1. wrapper not found
2. wrapper found but not executable
3. wrapper dry inspection pass
4. wrapper execution attempted and failed
5. wrapper execution attempted and succeeded

The next execution attempt must not be treated as successful unless a runtime receipt explicitly records exit_code=0 and wrapper_status=success.

## Inspection helper added

- scripts/inspect-execution-wrapper-readiness-v1.cjs

The helper is read-only and reports wrapper-related files, package scripts, and status/exit-code fields. It does not run the wrapper.

## Canonical head at corrective lane creation

- HEAD: 4dc6344edd81b3952abb976af1119f082315d5a9
- Subject: Seal PR 300 post-merge governance receipt v1 (#301)

## Wrapper/execution files observed

```text
docs/autonomous/SUPERVISED_ACTIVATION_RUNTIME_HYGIENE_V1.md
docs/governance/MAINNET_EXECUTION_RESULT_V1.md
docs/governance/MAINNET_EXECUTION_WINDOW_V1.md
docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md
docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md
docs/governance/V2_MAINNET_CUTOVER_EXECUTION_V1.md
docs/operations/AUTONOMOUS_EXECUTION_RECEIPT_V1.md
docs/operations/CONSOLIDATED_EXECUTION_EVIDENCE_INDEX_V1.md
receipts/execution/autonomous-execution-receipt-v1.json
receipts/execution/consolidated-execution-evidence-index-v1.json
receipts/governance/mainnet-execution-result-v1.json
receipts/governance/mainnet-execution-window-notice-v1.txt
receipts/governance/mainnet-execution-window-v1.json
receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json
receipts/governance/v2-cutover-execution-command-hash-v1.json
receipts/governance/v2-mainnet-cutover-execution-governance-wrapper-v1.json
scripts/verify-autonomous-execution-receipt.cjs
scripts/verify-consolidated-execution-evidence-index.cjs
scripts/verify-mainnet-execution-result-v1.cjs
scripts/verify-mainnet-execution-window-v1.cjs
scripts/verify-pr-298-execution-wrapper-failed-attempt-review-v1.cjs
scripts/verify-supervised-activation-runtime-hygiene-v1.cjs
scripts/verify-v2-cutover-execution-command-hash-v1.cjs
scripts/verify-v2-mainnet-cutover-execution-v1.cjs
```

## Wrapper/package scripts observed

```text
execution:autonomous:check=node scripts/verify-autonomous-execution-receipt.cjs
execution:external-runner:check=node scripts/verify-external-runner-proof.cjs
execution:external-runner-live-log:check=node scripts/verify-external-runner-live-log.cjs
execution:evidence-index:check=node scripts/verify-consolidated-execution-evidence-index.cjs
execution:external-runner-live-attempt:check=node scripts/verify-external-runner-live-attempt.cjs
execution:external-runner-live-result:check=node scripts/verify-external-runner-live-result.cjs
execution:external-runner-live-failure:check=node scripts/verify-external-runner-live-failure.cjs
execution:snapshot-ancestor-runner-context:check=node scripts/verify-snapshot-ancestor-runner-context.cjs
execution:external-runner-fixed-run-observation:check=node scripts/verify-external-runner-fixed-run-observation.cjs
execution:external-runner-3c32f91-inaccessible:check=node scripts/verify-external-runner-3c32f91-inaccessible.cjs
execution:selfhosted-forgejo-runner-target:check=node scripts/verify-selfhosted-forgejo-runner-target.cjs
execution:selfhosted-forgejo-runner-task-observation:check=node scripts/verify-selfhosted-forgejo-runner-task-observation.cjs
execution:selfhosted-forgejo-runner-pass:check=node scripts/verify-selfhosted-forgejo-runner-pass.cjs
execution:autonomous-network-readiness-v1:check=node scripts/verify-autonomous-network-readiness-v1.cjs
execution:selfhosted-runner-live-attempt-v2:check=node scripts/verify-selfhosted-runner-live-attempt-v2.cjs
execution:selfhosted-runner-live-pass-v2:check=node scripts/verify-selfhosted-runner-live-pass-v2.cjs
governance:mainnet-execution-window:v1:check=node scripts/verify-mainnet-execution-window-v1.cjs
governance:mainnet-execution-result:v1:check=node scripts/verify-mainnet-execution-result-v1.cjs
governance:ultimate-baseline:v1:check=npm run governance:open-verification-gate:v1:check && npm run governance:open-verification-gate-post-merge:v1:check && npm run governance:current-state:v1:check && npm run governance:mainnet-activation-preflight:v1:check && npm run governance:mainnet-activation-command-hash-readiness:v1:check && npm run governance:mainnet-operator-approval-preparation:v1:check && npm run governance:mainnet-final-command-selection:v1:check && npm run governance:mainnet-operator-approval:v1:check && npm run governance:mainnet-execution-window:v1:check && npm run governance:mainnet-execution-result:v1:check && npm run governance:mainnet-final-state-seal:v1:check && node scripts/verify-v2-scope-definition.cjs
governance:v2-cutover-execution-command-hash:v1:check=node scripts/verify-v2-cutover-execution-command-hash-v1.cjs
governance:v2-mainnet-cutover-execution:v1:check=node scripts/verify-v2-mainnet-cutover-execution-v1.cjs
governance:pr-298-post-merge:v1:check=node scripts/verify-pr-298-post-merge-governance-receipt-v1.cjs
governance:pr-298-execution-wrapper-failed-attempt-review:v1:check=node scripts/verify-pr-298-execution-wrapper-failed-attempt-review-v1.cjs
governance:pr-300-post-merge:v1:check=node scripts/verify-pr-300-post-merge-governance-receipt-v1.cjs
```

## Status and exit-code fields observed

```text
docs/CONTRACT_STATE_VALIDATION.md:215:The Pi Vault is a planned component for managing Pi Network token interactions. Current status:
docs/VERIFICATION.md:233:  "verification_status": "passed",
docs/VERIFICATION.md:239:Visual reports with color-coded status:
docs/DEPLOYMENT_MONITOR.md:8:status: approved
docs/review/READINESS_INDEX_V1.md:9:mainnet_cutover_executed: false
docs/review/READINESS_INDEX_V1.md:10:deployment_executed: false
docs/review/READINESS_INDEX_V1.md:11:broadcast_executed: false
docs/review/READINESS_INDEX_V1.md:12:state_changing_transaction_executed: false
docs/PI_PAYMENT_API_REFERENCE.md:46:  "status": "approved",
docs/PI_PAYMENT_API_REFERENCE.md:88:  "status": "completed",
docs/PI_PAYMENT_API_REFERENCE.md:127:  "status": "completed",
docs/PI_PAYMENT_API_REFERENCE.md:135:  "status": "pending",
docs/PI_PAYMENT_API_REFERENCE.md:160:  "status": "completed",
docs/PI_PAYMENT_API_REFERENCE.md:176:  "status": "received",
docs/PI_PAYMENT_API_REFERENCE.md:308:WHERE status = 'completed'
docs/PI_PAYMENT_API_REFERENCE.md:413:        //   status: "completed",
docs/AI_SOCIAL_NETWORK_WORKFLOW.md:551:        assert response.status_code == 201
docs/AI_SOCIAL_NETWORK_WORKFLOW.md:557:        assert response.status_code == 409
docs/AI_SOCIAL_NETWORK_WORKFLOW.md:574:        assert response.status_code == 200
docs/QUICK_START.md:445:    assert response.status_code == 200
docs/governance/PRE_CUTOVER_EXIT_CRITERION_CHECKPOINT_V1.md:45:cutover_executed: false  
docs/governance/PRE_CUTOVER_EXIT_CRITERION_CHECKPOINT_V1.md:46:deployment_executed: false  
docs/governance/PRE_CUTOVER_EXIT_CRITERION_CHECKPOINT_V1.md:47:broadcast_executed: false  
docs/governance/PRE_CUTOVER_EXIT_CRITERION_CHECKPOINT_V1.md:48:state_changing_transaction_executed: false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md:23:- governance:public-status:v1:check = PASS
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md:31:mainnet_cutover_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md:32:deployment_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md:33:broadcast_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md:34:state_changing_transaction_executed = false
docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:25:- mainnet_cutover_executed = false
docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:26:- deployment_executed = false
docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:27:- broadcast_executed = false
docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:28:- state_changing_transaction_executed = false
docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:29:- wallet_signing_executed = false
docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:30:- liquidity_action_executed = false
docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:31:- staking_action_executed = false
docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:32:- relayer_action_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_209_211.md:71:irreversible_network_action_executed == false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_247.md:22:- mainnet_cutover_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_247.md:23:- deployment_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_247.md:24:- broadcast_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_247.md:25:- state_changing_transaction_executed = false
docs/governance/CURRENT_GOVERNANCE_STATE_V1.md:43:mainnet_cutover_executed = false
docs/governance/CURRENT_GOVERNANCE_STATE_V1.md:44:deployment_executed = false
docs/governance/CURRENT_GOVERNANCE_STATE_V1.md:45:broadcast_executed = false
docs/governance/CURRENT_GOVERNANCE_STATE_V1.md:46:state_changing_transaction_executed = false
docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md:31:approval_checklist_status = PREPARATION_ONLY
docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md:69:mainnet_cutover_executed = false
docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md:70:deployment_executed = false
docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md:71:broadcast_executed = false
docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md:72:state_changing_transaction_executed = false
docs/governance/PR_291_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:- mainnet_cutover_executed == false
docs/governance/PR_291_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:- deployment_executed == false
docs/governance/PR_291_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:- broadcast_executed == false
docs/governance/PR_291_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:30:- state_changing_transaction_executed == false
docs/governance/PR_291_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:32:- unpark_executed == false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_298.md:23:- Execution wrapper status: `execution_command_failed_or_missing_receipt`
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_298.md:25:- Execution command exit code: `1`
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_292.md:22:- mainnet_cutover_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_292.md:23:- deployment_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_292.md:24:- broadcast_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_292.md:25:- state_changing_transaction_executed = false
docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_1_EVIDENCE_V1.md:16:activation_command_executed == true
docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_1_EVIDENCE_V1.md:17:activation_status == dry_run_complete
docs/governance/templates/REVIEWER_ATTESTATION_V1.template.txt:7:Finding status: pass | fail | concern
docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md:36:- mainnet_cutover_executed == false
docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md:37:- deployment_executed == false
docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md:38:- broadcast_executed == false
docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md:39:- state_changing_transaction_executed == false
docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md:41:- unpark_executed == false
docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:- mainnet_cutover_executed == false
docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:- deployment_executed == false
docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:- broadcast_executed == false
docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:30:- state_changing_transaction_executed == false
docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:32:- unpark_executed == false
docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md:43:mainnet_cutover_executed = false
docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md:44:deployment_executed = false
docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md:45:broadcast_executed = false
docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md:46:state_changing_transaction_executed = false
docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md:31:final_command_status = SELECTED_NOT_APPROVED
docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md:71:mainnet_cutover_executed = false
docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md:72:deployment_executed = false
docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md:73:broadcast_executed = false
docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md:74:state_changing_transaction_executed = false
docs/governance/REVIEWER_ATTESTATION_INTAKE_V1.md:81:cutover_executed: false  
docs/governance/REVIEWER_ATTESTATION_INTAKE_V1.md:82:deployment_executed: false  
docs/governance/REVIEWER_ATTESTATION_INTAKE_V1.md:83:broadcast_executed: false  
docs/governance/REVIEWER_ATTESTATION_INTAKE_V1.md:84:state_changing_transaction_executed: false
docs/governance/EXTERNAL_ATTESTATION_VERIFIER_V1.md:55:cutover_executed: false  
docs/governance/EXTERNAL_ATTESTATION_VERIFIER_V1.md:56:deployment_executed: false  
docs/governance/EXTERNAL_ATTESTATION_VERIFIER_V1.md:57:broadcast_executed: false  
docs/governance/EXTERNAL_ATTESTATION_VERIFIER_V1.md:58:state_changing_transaction_executed: false
docs/governance/V2_MAINNET_CUTOVER_EXECUTION_V1.md:13:- Exit code: `1`
docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md:29:command_candidate_status = HASHED_FOR_READINESS_ONLY
docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md:69:mainnet_cutover_executed = false
docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md:70:deployment_executed = false
docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md:71:broadcast_executed = false
docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md:72:state_changing_transaction_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_220.md:37:activation_status == dry_run_complete
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_220.md:46:irreversible_network_action_executed == false
docs/governance/MAINNET_EXECUTION_RESULT_V1.md:22:result_status = EXECUTION_COMMAND_FAILED
docs/governance/MAINNET_EXECUTION_RESULT_V1.md:23:exit_code = 1
docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md:34:- mainnet_cutover_executed == false
docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md:35:- deployment_executed == false
docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md:36:- broadcast_executed == false
docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md:37:- state_changing_transaction_executed == false
docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md:39:- unpark_executed == false
docs/governance/V2_PUBLIC_FUNDER_PACKET_INDEX_V1.md:71:- mainnet_cutover_executed == false
docs/governance/V2_PUBLIC_FUNDER_PACKET_INDEX_V1.md:72:- deployment_executed == false
docs/governance/V2_PUBLIC_FUNDER_PACKET_INDEX_V1.md:73:- broadcast_executed == false
docs/governance/V2_PUBLIC_FUNDER_PACKET_INDEX_V1.md:74:- state_changing_transaction_executed == false
docs/governance/PRE_CUTOVER_REVIEW_WINDOW_V1.md:20:- mainnet_cutover_executed = false
docs/governance/PRE_CUTOVER_REVIEW_WINDOW_V1.md:21:- deployment_executed = false
docs/governance/PRE_CUTOVER_REVIEW_WINDOW_V1.md:22:- broadcast_executed = false
docs/governance/PRE_CUTOVER_REVIEW_WINDOW_V1.md:23:- state_changing_transaction_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md:33:mainnet_cutover_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md:34:deployment_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md:35:broadcast_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md:36:state_changing_transaction_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_251.md:29:mainnet_cutover_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_251.md:30:deployment_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_251.md:31:broadcast_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_251.md:32:state_changing_transaction_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_224.md:35:activation_status == dry_run_complete
docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:- mainnet_cutover_executed == false
docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:- deployment_executed == false
docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:- broadcast_executed == false
docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:30:- state_changing_transaction_executed == false
docs/governance/CROSS_PLATFORM_DETERMINISM_V1.md:63:cutover_executed: false  
docs/governance/CROSS_PLATFORM_DETERMINISM_V1.md:64:deployment_executed: false  
docs/governance/CROSS_PLATFORM_DETERMINISM_V1.md:65:broadcast_executed: false  
docs/governance/CROSS_PLATFORM_DETERMINISM_V1.md:66:state_changing_transaction_executed: false
docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md:66:- mainnet_cutover_executed == false
docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md:67:- deployment_executed == false
docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md:68:- broadcast_executed == false
docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md:69:- state_changing_transaction_executed == false
docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_2_EVIDENCE_V1.md:20:activation_command_executed == true
docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_2_EVIDENCE_V1.md:21:activation_status == dry_run_complete
docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_2_EVIDENCE_V1.md:28:irreversible_network_action_executed == false
docs/governance/OPEN_VERIFICATION_GATE_V1_POST_MERGE.md:56:mainnet_cutover_executed = false
docs/governance/OPEN_VERIFICATION_GATE_V1_POST_MERGE.md:57:deployment_executed = false
docs/governance/OPEN_VERIFICATION_GATE_V1_POST_MERGE.md:58:broadcast_executed = false
docs/governance/OPEN_VERIFICATION_GATE_V1_POST_MERGE.md:59:state_changing_transaction_executed = false
docs/governance/MAINNET_OPERATOR_APPROVAL_V1.md:55:mainnet_cutover_executed = false
docs/governance/MAINNET_OPERATOR_APPROVAL_V1.md:56:deployment_executed = false
docs/governance/MAINNET_OPERATOR_APPROVAL_V1.md:57:broadcast_executed = false
docs/governance/MAINNET_OPERATOR_APPROVAL_V1.md:58:state_changing_transaction_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:27:- mainnet_cutover_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:28:- deployment_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:29:- broadcast_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:30:- state_changing_transaction_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:31:- wallet_signing_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:32:- liquidity_action_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:33:- staking_action_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:34:- relayer_action_executed = false
docs/governance/PR_285_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:- mainnet_cutover_executed == false
docs/governance/PR_285_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:- deployment_executed == false
docs/governance/PR_285_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:- broadcast_executed == false
docs/governance/PR_285_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:30:- state_changing_transaction_executed == false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_249.md:22:mainnet_cutover_executed: false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_249.md:23:deployment_executed: false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_249.md:24:broadcast_executed: false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_249.md:25:state_changing_transaction_executed: false
docs/governance/MAINNET_ACTIVATION_PREFLIGHT_V1.md:46:mainnet_cutover_executed = false
docs/governance/MAINNET_ACTIVATION_PREFLIGHT_V1.md:47:deployment_executed = false
docs/governance/MAINNET_ACTIVATION_PREFLIGHT_V1.md:48:broadcast_executed = false
docs/governance/MAINNET_ACTIVATION_PREFLIGHT_V1.md:49:state_changing_transaction_executed = false
docs/governance/PR_287_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:- mainnet_cutover_executed == false
docs/governance/PR_287_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:- deployment_executed == false
docs/governance/PR_287_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:- broadcast_executed == false
docs/governance/PR_287_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:30:- state_changing_transaction_executed == false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:29:- execution_command_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:30:- mainnet_cutover_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:31:- deployment_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:32:- broadcast_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:33:- state_changing_transaction_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:34:- wallet_signing_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:35:- liquidity_action_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:36:- staking_action_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:37:- relayer_action_executed = false
docs/governance/PR_186_SELFHOSTED_MERGE_BOUNDARY_V1.md:12:- Merge status: not merged; admin merge attempt blocked by required approving review
docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md:16:- wrapper_status: failed_or_missing
docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md:17:- exit_code: 1
docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md:21:- deployment_executed: false
docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md:22:- broadcast_executed: false
docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md:23:- state_changing_transaction_executed: false
docs/governance/MAINNET_EXECUTION_WINDOW_V1.md:58:deployment_executed = false
docs/governance/MAINNET_EXECUTION_WINDOW_V1.md:59:broadcast_executed = false
docs/governance/MAINNET_EXECUTION_WINDOW_V1.md:60:mainnet_cutover_executed = false
docs/governance/MAINNET_EXECUTION_WINDOW_V1.md:61:state_changing_transaction_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_258.md:22:- mainnet_cutover_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_258.md:23:- deployment_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_258.md:24:- broadcast_executed = false
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_258.md:25:- state_changing_transaction_executed = false
docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:32:- execution_command_executed = false
docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:33:- mainnet_cutover_executed = false
docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:34:- deployment_executed = false
docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:35:- broadcast_executed = false
docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:36:- state_changing_transaction_executed = false
docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:37:- wallet_signing_executed = false
docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:38:- liquidity_action_executed = false
docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:39:- staking_action_executed = false
docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:40:- relayer_action_executed = false
docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md:24:- mainnet_cutover_executed == false
docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md:25:- deployment_executed == false
docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md:26:- broadcast_executed == false
docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md:27:- state_changing_transaction_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:31:- wrapper_status: failed_or_missing
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:32:- exit_code: 1
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:36:- deployment_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:37:- broadcast_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:38:- state_changing_transaction_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:57:docs/CONTRACT_STATE_VALIDATION.md:215:The Pi Vault is a planned component for managing Pi Network token interactions. Current status:
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:58:docs/VERIFICATION.md:233:  "verification_status": "passed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:59:docs/VERIFICATION.md:239:Visual reports with color-coded status:
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:60:docs/DEPLOYMENT_MONITOR.md:8:status: approved
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:61:docs/review/READINESS_INDEX_V1.md:9:mainnet_cutover_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:62:docs/review/READINESS_INDEX_V1.md:10:deployment_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:63:docs/review/READINESS_INDEX_V1.md:11:broadcast_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:64:docs/review/READINESS_INDEX_V1.md:12:state_changing_transaction_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:65:docs/PI_PAYMENT_API_REFERENCE.md:46:  "status": "approved",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:66:docs/PI_PAYMENT_API_REFERENCE.md:88:  "status": "completed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:67:docs/PI_PAYMENT_API_REFERENCE.md:127:  "status": "completed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:68:docs/PI_PAYMENT_API_REFERENCE.md:135:  "status": "pending",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:69:docs/PI_PAYMENT_API_REFERENCE.md:160:  "status": "completed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:70:docs/PI_PAYMENT_API_REFERENCE.md:176:  "status": "received",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:71:docs/PI_PAYMENT_API_REFERENCE.md:308:WHERE status = 'completed'
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:72:docs/PI_PAYMENT_API_REFERENCE.md:413:        //   status: "completed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:73:docs/AI_SOCIAL_NETWORK_WORKFLOW.md:551:        assert response.status_code == 201
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:74:docs/AI_SOCIAL_NETWORK_WORKFLOW.md:557:        assert response.status_code == 409
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:75:docs/AI_SOCIAL_NETWORK_WORKFLOW.md:574:        assert response.status_code == 200
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:76:docs/QUICK_START.md:445:    assert response.status_code == 200
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:77:docs/governance/PRE_CUTOVER_EXIT_CRITERION_CHECKPOINT_V1.md:45:cutover_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:78:docs/governance/PRE_CUTOVER_EXIT_CRITERION_CHECKPOINT_V1.md:46:deployment_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:79:docs/governance/PRE_CUTOVER_EXIT_CRITERION_CHECKPOINT_V1.md:47:broadcast_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:80:docs/governance/PRE_CUTOVER_EXIT_CRITERION_CHECKPOINT_V1.md:48:state_changing_transaction_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:81:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md:23:- governance:public-status:v1:check = PASS
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:82:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md:31:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:83:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md:32:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:84:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md:33:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:85:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md:34:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:86:docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:25:- mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:87:docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:26:- deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:88:docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:27:- broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:89:docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:28:- state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:90:docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:29:- wallet_signing_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:91:docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:30:- liquidity_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:92:docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:31:- staking_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:93:docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md:32:- relayer_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:94:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_209_211.md:71:irreversible_network_action_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:95:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_247.md:22:- mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:96:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_247.md:23:- deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:97:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_247.md:24:- broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:98:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_247.md:25:- state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:99:docs/governance/CURRENT_GOVERNANCE_STATE_V1.md:43:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:100:docs/governance/CURRENT_GOVERNANCE_STATE_V1.md:44:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:101:docs/governance/CURRENT_GOVERNANCE_STATE_V1.md:45:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:102:docs/governance/CURRENT_GOVERNANCE_STATE_V1.md:46:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:103:docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md:31:approval_checklist_status = PREPARATION_ONLY
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:104:docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md:69:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:105:docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md:70:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:106:docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md:71:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:107:docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md:72:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:108:docs/governance/PR_291_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:- mainnet_cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:109:docs/governance/PR_291_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:110:docs/governance/PR_291_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:111:docs/governance/PR_291_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:30:- state_changing_transaction_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:112:docs/governance/PR_291_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:32:- unpark_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:113:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_298.md:23:- Execution wrapper status: `execution_command_failed_or_missing_receipt`
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:114:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_298.md:25:- Execution command exit code: `1`
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:115:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_292.md:22:- mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:116:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_292.md:23:- deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:117:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_292.md:24:- broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:118:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_292.md:25:- state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:119:docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_1_EVIDENCE_V1.md:16:activation_command_executed == true
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:120:docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_1_EVIDENCE_V1.md:17:activation_status == dry_run_complete
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:121:docs/governance/templates/REVIEWER_ATTESTATION_V1.template.txt:7:Finding status: pass | fail | concern
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:122:docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md:36:- mainnet_cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:123:docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md:37:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:124:docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md:38:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:125:docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md:39:- state_changing_transaction_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:126:docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md:41:- unpark_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:127:docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:- mainnet_cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:128:docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:129:docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:130:docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:30:- state_changing_transaction_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:131:docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:32:- unpark_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:132:docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md:43:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:133:docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md:44:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:134:docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md:45:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:135:docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md:46:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:136:docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md:31:final_command_status = SELECTED_NOT_APPROVED
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:137:docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md:71:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:138:docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md:72:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:139:docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md:73:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:140:docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md:74:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:141:docs/governance/REVIEWER_ATTESTATION_INTAKE_V1.md:81:cutover_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:142:docs/governance/REVIEWER_ATTESTATION_INTAKE_V1.md:82:deployment_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:143:docs/governance/REVIEWER_ATTESTATION_INTAKE_V1.md:83:broadcast_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:144:docs/governance/REVIEWER_ATTESTATION_INTAKE_V1.md:84:state_changing_transaction_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:145:docs/governance/EXTERNAL_ATTESTATION_VERIFIER_V1.md:55:cutover_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:146:docs/governance/EXTERNAL_ATTESTATION_VERIFIER_V1.md:56:deployment_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:147:docs/governance/EXTERNAL_ATTESTATION_VERIFIER_V1.md:57:broadcast_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:148:docs/governance/EXTERNAL_ATTESTATION_VERIFIER_V1.md:58:state_changing_transaction_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:149:docs/governance/V2_MAINNET_CUTOVER_EXECUTION_V1.md:13:- Exit code: `1`
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:150:docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md:29:command_candidate_status = HASHED_FOR_READINESS_ONLY
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:151:docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md:69:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:152:docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md:70:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:153:docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md:71:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:154:docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md:72:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:155:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_220.md:37:activation_status == dry_run_complete
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:156:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_220.md:46:irreversible_network_action_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:157:docs/governance/MAINNET_EXECUTION_RESULT_V1.md:22:result_status = EXECUTION_COMMAND_FAILED
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:158:docs/governance/MAINNET_EXECUTION_RESULT_V1.md:23:exit_code = 1
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:159:docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md:34:- mainnet_cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:160:docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md:35:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:161:docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md:36:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:162:docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md:37:- state_changing_transaction_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:163:docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md:39:- unpark_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:164:docs/governance/V2_PUBLIC_FUNDER_PACKET_INDEX_V1.md:71:- mainnet_cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:165:docs/governance/V2_PUBLIC_FUNDER_PACKET_INDEX_V1.md:72:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:166:docs/governance/V2_PUBLIC_FUNDER_PACKET_INDEX_V1.md:73:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:167:docs/governance/V2_PUBLIC_FUNDER_PACKET_INDEX_V1.md:74:- state_changing_transaction_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:168:docs/governance/PRE_CUTOVER_REVIEW_WINDOW_V1.md:20:- mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:169:docs/governance/PRE_CUTOVER_REVIEW_WINDOW_V1.md:21:- deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:170:docs/governance/PRE_CUTOVER_REVIEW_WINDOW_V1.md:22:- broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:171:docs/governance/PRE_CUTOVER_REVIEW_WINDOW_V1.md:23:- state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:172:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md:33:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:173:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md:34:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:174:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md:35:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:175:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md:36:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:176:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_251.md:29:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:177:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_251.md:30:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:178:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_251.md:31:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:179:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_251.md:32:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:180:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_224.md:35:activation_status == dry_run_complete
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:181:docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:- mainnet_cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:182:docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:183:docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:184:docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:30:- state_changing_transaction_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:185:docs/governance/CROSS_PLATFORM_DETERMINISM_V1.md:63:cutover_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:186:docs/governance/CROSS_PLATFORM_DETERMINISM_V1.md:64:deployment_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:187:docs/governance/CROSS_PLATFORM_DETERMINISM_V1.md:65:broadcast_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:188:docs/governance/CROSS_PLATFORM_DETERMINISM_V1.md:66:state_changing_transaction_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:189:docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md:66:- mainnet_cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:190:docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md:67:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:191:docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md:68:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:192:docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md:69:- state_changing_transaction_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:193:docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_2_EVIDENCE_V1.md:20:activation_command_executed == true
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:194:docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_2_EVIDENCE_V1.md:21:activation_status == dry_run_complete
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:195:docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_2_EVIDENCE_V1.md:28:irreversible_network_action_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:196:docs/governance/OPEN_VERIFICATION_GATE_V1_POST_MERGE.md:56:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:197:docs/governance/OPEN_VERIFICATION_GATE_V1_POST_MERGE.md:57:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:198:docs/governance/OPEN_VERIFICATION_GATE_V1_POST_MERGE.md:58:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:199:docs/governance/OPEN_VERIFICATION_GATE_V1_POST_MERGE.md:59:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:200:docs/governance/MAINNET_OPERATOR_APPROVAL_V1.md:55:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:201:docs/governance/MAINNET_OPERATOR_APPROVAL_V1.md:56:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:202:docs/governance/MAINNET_OPERATOR_APPROVAL_V1.md:57:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:203:docs/governance/MAINNET_OPERATOR_APPROVAL_V1.md:58:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:204:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:27:- mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:205:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:28:- deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:206:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:29:- broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:207:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:30:- state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:208:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:31:- wallet_signing_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:209:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:32:- liquidity_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:210:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:33:- staking_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:211:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md:34:- relayer_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:212:docs/governance/PR_285_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:- mainnet_cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:213:docs/governance/PR_285_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:214:docs/governance/PR_285_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:215:docs/governance/PR_285_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:30:- state_changing_transaction_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:216:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_249.md:22:mainnet_cutover_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:217:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_249.md:23:deployment_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:218:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_249.md:24:broadcast_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:219:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_249.md:25:state_changing_transaction_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:220:docs/governance/MAINNET_ACTIVATION_PREFLIGHT_V1.md:46:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:221:docs/governance/MAINNET_ACTIVATION_PREFLIGHT_V1.md:47:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:222:docs/governance/MAINNET_ACTIVATION_PREFLIGHT_V1.md:48:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:223:docs/governance/MAINNET_ACTIVATION_PREFLIGHT_V1.md:49:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:224:docs/governance/PR_287_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:- mainnet_cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:225:docs/governance/PR_287_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:226:docs/governance/PR_287_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:227:docs/governance/PR_287_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:30:- state_changing_transaction_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:228:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:29:- execution_command_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:229:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:30:- mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:230:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:31:- deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:231:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:32:- broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:232:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:33:- state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:233:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:34:- wallet_signing_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:234:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:35:- liquidity_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:235:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:36:- staking_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:236:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md:37:- relayer_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:237:docs/governance/PR_186_SELFHOSTED_MERGE_BOUNDARY_V1.md:12:- Merge status: not merged; admin merge attempt blocked by required approving review
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:238:docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md:16:- wrapper_status: failed_or_missing
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:239:docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md:17:- exit_code: 1
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:240:docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md:21:- deployment_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:241:docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md:22:- broadcast_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:242:docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md:23:- state_changing_transaction_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:243:docs/governance/MAINNET_EXECUTION_WINDOW_V1.md:58:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:244:docs/governance/MAINNET_EXECUTION_WINDOW_V1.md:59:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:245:docs/governance/MAINNET_EXECUTION_WINDOW_V1.md:60:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:246:docs/governance/MAINNET_EXECUTION_WINDOW_V1.md:61:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:247:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_258.md:22:- mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:248:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_258.md:23:- deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:249:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_258.md:24:- broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:250:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_258.md:25:- state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:251:docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:32:- execution_command_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:252:docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:33:- mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:253:docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:34:- deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:254:docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:35:- broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:255:docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:36:- state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:256:docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:37:- wallet_signing_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:257:docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:38:- liquidity_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:258:docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:39:- staking_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:259:docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md:40:- relayer_action_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:260:docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md:24:- mainnet_cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:261:docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md:25:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:262:docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md:26:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:263:docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md:27:- state_changing_transaction_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:264:docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_213.md:57:irreversible_network_action_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:265:docs/governance/AUDIT_HARDENING_READINESS_V1.md:51:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:266:docs/governance/AUDIT_HARDENING_READINESS_V1.md:52:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:267:docs/governance/AUDIT_HARDENING_READINESS_V1.md:53:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:268:docs/governance/AUDIT_HARDENING_READINESS_V1.md:54:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:269:docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_3_EVIDENCE_V1.md:21:activation_status == dry_run_complete
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:270:docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_3_EVIDENCE_V1.md:28:irreversible_network_action_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:271:docs/governance/OPEN_VERIFICATION_GATE_V1.md:45:mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:272:docs/governance/OPEN_VERIFICATION_GATE_V1.md:46:deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:273:docs/governance/OPEN_VERIFICATION_GATE_V1.md:47:broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:274:docs/governance/OPEN_VERIFICATION_GATE_V1.md:48:state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:275:docs/governance/PR_260_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:26:cutover_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:276:docs/governance/PR_260_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:deployment_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:277:docs/governance/PR_260_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:broadcast_executed: false  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:278:docs/governance/PR_260_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:state_changing_transaction_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:279:docs/mainnet-cutover/MAINNET_CUTOVER_READINESS_INDEX_V1.md:12:- mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:280:docs/mainnet-cutover/MAINNET_CUTOVER_READINESS_INDEX_V1.md:13:- deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:281:docs/mainnet-cutover/MAINNET_CUTOVER_READINESS_INDEX_V1.md:14:- broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:282:docs/mainnet-cutover/MAINNET_CUTOVER_READINESS_INDEX_V1.md:15:- state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:283:docs/AI_AGENT_HANDOFF_RUNBOOK.md:625:- Health status: degraded
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:284:docs/operations/EXTERNAL_RUNNER_FIXED_RUN_OBSERVATION_V1.md:58:external_runner_executed == unknown_for_fixed_run
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:285:docs/operations/EXTERNAL_RUNNER_LIVE_FAILURE_V1.md:32:external_runner_executed == true
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:286:docs/operations/SELFHOSTED_FORGEJO_RUNNER_PASS_V1.md:23:- Forgejo proof receipt emitted with `"status": "completed"`.
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:287:docs/GUARDIAN_PLAYBOOK.md:170:curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision-history?requires_guardian=true&status=pending | jq .
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:288:docs/GUARDIAN_PLAYBOOK.md:440:- Overall status: healthy/degraded/critical
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:289:docs/GUARDIAN_APPROVAL_SYSTEM.md:86:  "status": "recorded"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:290:docs/AUTONOMOUS_HANDOVER.md:113:  "overall_status": "healthy|degraded|unhealthy|critical",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:291:docs/AUTONOMOUS_HANDOVER.md:117:      "status": "healthy",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:292:docs/AUTONOMOUS_HANDOVER.md:145:      "status": "healthy",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:293:docs/AUTONOMOUS_HANDOVER.md:181:  "status": "approved|rejected|pending|override",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:294:docs/AUTONOMOUS_HANDOVER.md:213:#### `GET /api/guardian/validation-history?status={status}&limit={limit}`
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:295:docs/AUTONOMOUS_HANDOVER.md:226:      "status": "active|inactive|error|degraded",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:296:docs/QUANTUM_BLOG_SERIES.md:270:        "status": "healthy", 
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:297:docs/PI_NETWORK_DEPLOYMENT_GUIDE.md:131:  "status": "healthy",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:298:docs/PI_NETWORK_DEPLOYMENT_GUIDE.md:353:WHERE status = 'failed' 
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:299:docs/execution/SELFHOSTED_RUNNER_LIVE_PASS_V2.md:66:visible_steps_executed == true  
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:300:docs/MAINNET_USER_GUIDE.md:110:  "status": "verified",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:301:docs/MAINNET_USER_GUIDE.md:196:    "contract_code": "pragma solidity ^0.8.0; contract MyToken { ... }",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:302:docs/autonomous/MAINNET_CUTOVER_COMMAND_HASH_V1.md:25:- command_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:303:docs/autonomous/MAINNET_CUTOVER_COMMAND_HASH_V1.md:26:- cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:304:docs/autonomous/MAINNET_CUTOVER_COMMAND_HASH_V1.md:27:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:305:docs/autonomous/MAINNET_CUTOVER_COMMAND_HASH_V1.md:28:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:306:docs/autonomous/MAINNET_CUTOVER_PARKED_NOTICE_V1.md:24:- mainnet_cutover_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:307:docs/autonomous/MAINNET_CUTOVER_PARKED_NOTICE_V1.md:25:- deployment_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:308:docs/autonomous/MAINNET_CUTOVER_PARKED_NOTICE_V1.md:26:- broadcast_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:309:docs/autonomous/MAINNET_CUTOVER_PARKED_NOTICE_V1.md:27:- state_changing_transaction_executed = false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:310:docs/autonomous/SUPERVISED_ACTIVATION_OPERATIONS_INDEX_V1.md:43:dry_run_1_status == dry_run_complete
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:311:docs/autonomous/SUPERVISED_ACTIVATION_REFUSAL_TESTS_V1.md:35:irreversible_network_action_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:312:docs/autonomous/MAINNET_CUTOVER_FINAL_OPERATOR_APPROVAL_V1.md:34:- command_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:313:docs/autonomous/MAINNET_CUTOVER_FINAL_OPERATOR_APPROVAL_V1.md:35:- cutover_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:314:docs/autonomous/MAINNET_CUTOVER_FINAL_OPERATOR_APPROVAL_V1.md:36:- deployment_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:315:docs/autonomous/MAINNET_CUTOVER_FINAL_OPERATOR_APPROVAL_V1.md:37:- broadcast_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:316:docs/autonomous/SUPERVISED_ACTIVATION_READINESS_INDEX_V1.md:46:- irreversible network action executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:317:docs/autonomous/SUPERVISED_ACTIVATION_READINESS_INDEX_V1.md:79:irreversible_network_action_executed == false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:318:docs/autonomous/SUPERVISED_ACTIVATION_DRY_RUN_EVIDENCE_SUMMARY_V1.md:33:dry_run_1_status == dry_run_complete
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:319:docs/autonomous/SUPERVISED_ACTIVATION_DRY_RUN_EVIDENCE_SUMMARY_V1.md:43:dry_run_2_status == dry_run_complete
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:320:docs/PRODUCTION_DEPLOYMENT.md:101:  "status": "healthy",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:321:docs/API.md:65:  "status": "healthy",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:322:docs/API.md:78:  "status": "healthy",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:323:docs/API.md:202:  "system_status": "healthy",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:324:docs/API.md:507:    "code": "ERROR_CODE",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:325:docs/API.md:608:  "status": "healthy",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:326:docs/VERIFICATION_GUIDE.md:292:- [ ] All transactions confirmed (status: success)
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:327:docs/GUARDIAN_QUICK_REFERENCE.md:16:curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision-history?requires_guardian=true&status=pending | jq .
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:328:docs/PI_NETWORK_INTEGRATION.md:157:  "status": "authenticated",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:329:docs/PI_NETWORK_INTEGRATION.md:208:  "status": "pending",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:330:docs/PI_NETWORK_INTEGRATION.md:259:    "status": "completed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:331:docs/PI_NETWORK_INTEGRATION.md:274:GET /api/pi-network/payments/user/{user_id}?status=completed&limit=50
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:332:docs/PI_NETWORK_INTEGRATION.md:294:    "status": "healthy",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:333:docs/CANON_AUTO_MERGE_SETUP.md:151:status: draft
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:334:docs/ARCHITECTURE.md:97:  - Error code: `insufficient_balance`
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:335:receipts/press-agent/discord-only-proof-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:336:receipts/press-agent/press-agent-credential-completion-boundary-v1.json:3:  "status": "SEALED_BOUNDARY",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:337:receipts/rcpt-pre-cutover-review-window-v1.json:3:  "status": "active_review_window",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:338:receipts/rcpt-pre-cutover-review-window-v1.json:9:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:339:receipts/rcpt-pre-cutover-review-window-v1.json:10:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:340:receipts/rcpt-pre-cutover-review-window-v1.json:11:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:341:receipts/rcpt-pre-cutover-review-window-v1.json:12:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:342:receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:343:receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json:15:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:344:receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json:16:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:345:receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json:17:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:346:receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json:18:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:347:receipts/governance/pr-298-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:348:receipts/governance/pr-298-post-merge-governance-receipt-v1.json:13:  "execution_wrapper_status": "execution_command_failed_or_missing_receipt",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:349:receipts/governance/pr-298-post-merge-governance-receipt-v1.json:15:  "execution_command_executed": true,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:350:receipts/governance/pr-298-post-merge-governance-receipt-v1.json:16:  "execution_command_exit_code": 1,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:351:receipts/governance/mainnet-execution-window-notice-v1.txt:30:deployment_executed=false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:352:receipts/governance/mainnet-execution-window-notice-v1.txt:31:broadcast_executed=false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:353:receipts/governance/mainnet-execution-window-notice-v1.txt:32:mainnet_cutover_executed=false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:354:receipts/governance/mainnet-execution-window-notice-v1.txt:33:state_changing_transaction_executed=false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:355:receipts/governance/pr-243-post-merge-governance-receipt-v1.json:3:  "status": "SEALED",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:356:receipts/governance/pr-243-post-merge-governance-receipt-v1.json:8:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:357:receipts/governance/pr-243-post-merge-governance-receipt-v1.json:9:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:358:receipts/governance/pr-243-post-merge-governance-receipt-v1.json:10:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:359:receipts/governance/pr-243-post-merge-governance-receipt-v1.json:11:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:360:receipts/governance/audit-hardening-readiness-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:361:receipts/governance/audit-hardening-readiness-v1.json:7:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:362:receipts/governance/audit-hardening-readiness-v1.json:8:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:363:receipts/governance/audit-hardening-readiness-v1.json:9:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:364:receipts/governance/audit-hardening-readiness-v1.json:10:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:365:receipts/governance/pr-188-autonomous-readiness-merge-boundary-v1.json:24:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:366:receipts/governance/pr-215-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:367:receipts/governance/external-attestation-verifier-v1.json:4:  "status": "blocking_control_active",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:368:receipts/governance/external-attestation-verifier-v1.json:25:    "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:369:receipts/governance/external-attestation-verifier-v1.json:26:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:370:receipts/governance/external-attestation-verifier-v1.json:27:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:371:receipts/governance/external-attestation-verifier-v1.json:28:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:372:receipts/governance/apply-lone-steward-branch-protection-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:373:receipts/governance/pr-251-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:374:receipts/governance/pr-251-post-merge-governance-receipt-v1.json:14:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:375:receipts/governance/pr-251-post-merge-governance-receipt-v1.json:15:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:376:receipts/governance/pr-251-post-merge-governance-receipt-v1.json:16:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:377:receipts/governance/pr-251-post-merge-governance-receipt-v1.json:17:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:378:receipts/governance/pr-249-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:379:receipts/governance/pr-249-post-merge-governance-receipt-v1.json:8:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:380:receipts/governance/pr-249-post-merge-governance-receipt-v1.json:9:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:381:receipts/governance/pr-249-post-merge-governance-receipt-v1.json:10:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:382:receipts/governance/pr-249-post-merge-governance-receipt-v1.json:11:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:383:receipts/governance/pr-218-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:384:receipts/governance/mainnet-final-command-selection-v1.json:14:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:385:receipts/governance/mainnet-final-command-selection-v1.json:15:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:386:receipts/governance/mainnet-final-command-selection-v1.json:17:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:387:receipts/governance/mainnet-final-command-selection-v1.json:18:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:388:receipts/governance/mainnet-final-command-selection-v1.json:22:    "approval_status": "not_approved",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:389:receipts/governance/mainnet-final-command-selection-v1.json:25:    "status": "SELECTED_NOT_APPROVED"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:390:receipts/governance/mainnet-operator-approval-v1.json:26:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:391:receipts/governance/mainnet-operator-approval-v1.json:27:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:392:receipts/governance/mainnet-operator-approval-v1.json:28:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:393:receipts/governance/mainnet-operator-approval-v1.json:29:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:394:receipts/governance/pr-285-post-merge-governance-receipt-v1.json:15:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:395:receipts/governance/pr-285-post-merge-governance-receipt-v1.json:16:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:396:receipts/governance/pr-285-post-merge-governance-receipt-v1.json:17:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:397:receipts/governance/pr-285-post-merge-governance-receipt-v1.json:18:    "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:398:receipts/governance/mainnet-activation-preflight-v1.json:14:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:399:receipts/governance/mainnet-activation-preflight-v1.json:15:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:400:receipts/governance/mainnet-activation-preflight-v1.json:17:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:401:receipts/governance/mainnet-activation-preflight-v1.json:18:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:402:receipts/governance/supervised-activation-dry-run-1-evidence-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:403:receipts/governance/supervised-activation-dry-run-1-evidence-v1.json:8:  "activation_command_executed": true,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:404:receipts/governance/supervised-activation-dry-run-1-evidence-v1.json:9:  "activation_status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:405:receipts/governance/cross-platform-determinism-manifest-v1.json:8:    "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:406:receipts/governance/cross-platform-determinism-manifest-v1.json:9:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:407:receipts/governance/cross-platform-determinism-manifest-v1.json:10:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:408:receipts/governance/cross-platform-determinism-manifest-v1.json:11:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:409:receipts/governance/pr-247-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:410:receipts/governance/pr-247-post-merge-governance-receipt-v1.json:8:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:411:receipts/governance/pr-247-post-merge-governance-receipt-v1.json:9:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:412:receipts/governance/pr-247-post-merge-governance-receipt-v1.json:10:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:413:receipts/governance/pr-247-post-merge-governance-receipt-v1.json:11:  "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:414:receipts/governance/pr-207-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:415:receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:3:  "status": "operator_approval_granted",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:416:receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:15:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:417:receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:16:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:418:receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:17:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:419:receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:18:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:420:receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:19:  "wallet_signing_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:421:receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:20:  "liquidity_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:422:receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:21:  "staking_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:423:receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:22:  "relayer_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:424:receipts/governance/v2-operator-unpark-approval-candidate-v1.json:13:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:425:receipts/governance/v2-operator-unpark-approval-candidate-v1.json:14:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:426:receipts/governance/v2-operator-unpark-approval-candidate-v1.json:15:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:427:receipts/governance/v2-operator-unpark-approval-candidate-v1.json:16:    "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:428:receipts/governance/v2-operator-unpark-approval-candidate-v1.json:18:    "unpark_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:429:receipts/governance/pr-228-post-merge-governance-receipt-v1.json:3:  "status": "SEALED",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:430:receipts/governance/cross-platform-determinism-v1.json:13:    "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:431:receipts/governance/cross-platform-determinism-v1.json:14:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:432:receipts/governance/cross-platform-determinism-v1.json:15:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:433:receipts/governance/cross-platform-determinism-v1.json:16:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:434:receipts/governance/cross-platform-determinism-v1.json:35:      "status": "declared_volatile_field_normalized",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:435:receipts/governance/cross-platform-determinism-v1.json:42:      "status": "declared_volatile_field_normalized",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:436:receipts/governance/v2-funder-outreach-manifest-v1.json:19:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:437:receipts/governance/v2-funder-outreach-manifest-v1.json:20:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:438:receipts/governance/v2-funder-outreach-manifest-v1.json:21:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:439:receipts/governance/v2-funder-outreach-manifest-v1.json:22:    "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:440:receipts/governance/reviewer-attestation-intake-v1.json:4:  "status": "intake_boundary_sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:441:receipts/governance/reviewer-attestation-intake-v1.json:14:    "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:442:receipts/governance/reviewer-attestation-intake-v1.json:15:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:443:receipts/governance/reviewer-attestation-intake-v1.json:16:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:444:receipts/governance/reviewer-attestation-intake-v1.json:17:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:445:receipts/governance/supervised-activation-dry-run-2-evidence-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:446:receipts/governance/supervised-activation-dry-run-2-evidence-v1.json:9:  "activation_command_executed": true,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:447:receipts/governance/supervised-activation-dry-run-2-evidence-v1.json:10:  "activation_status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:448:receipts/governance/supervised-activation-dry-run-2-evidence-v1.json:14:  "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:449:receipts/governance/pr-231-post-merge-governance-receipt-v1.json:3:  "status": "SEALED",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:450:receipts/governance/pr-213-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:451:receipts/governance/pr-213-post-merge-governance-receipt-v1.json:27:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:452:receipts/governance/current-governance-state-v1.json:10:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:453:receipts/governance/current-governance-state-v1.json:11:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:454:receipts/governance/current-governance-state-v1.json:13:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:455:receipts/governance/current-governance-state-v1.json:14:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:456:receipts/governance/mainnet-execution-result-v1.json:18:    "exit_code": 1,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:457:receipts/governance/mainnet-execution-result-v1.json:19:    "result_status": "EXECUTION_COMMAND_FAILED",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:458:receipts/governance/mainnet-execution-result-v1.json:23:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:459:receipts/governance/mainnet-execution-result-v1.json:24:    "command_executed": true,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:460:receipts/governance/mainnet-execution-result-v1.json:26:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:461:receipts/governance/mainnet-execution-result-v1.json:27:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:462:receipts/governance/mainnet-execution-result-v1.json:28:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:463:receipts/governance/pr-226-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:464:receipts/governance/v2-mainnet-cutover-execution-governance-wrapper-v1.json:3:  "status": "execution_command_failed_or_missing_receipt",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:465:receipts/governance/v2-mainnet-cutover-execution-governance-wrapper-v1.json:10:  "execution_command_executed": true,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:466:receipts/governance/v2-mainnet-cutover-execution-governance-wrapper-v1.json:11:  "execution_command_exit_code": 1,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:467:receipts/governance/mainnet-execution-window-v1.json:23:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:468:receipts/governance/mainnet-execution-window-v1.json:24:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:469:receipts/governance/mainnet-execution-window-v1.json:25:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:470:receipts/governance/mainnet-execution-window-v1.json:26:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:471:receipts/governance/supervised-activation-v1-milestone-snapshot.json:3:  "status": "SEALED",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:472:receipts/governance/supervised-activation-v1-milestone-snapshot.json:42:    "status": "non_blocking_for_supervised_activation_v1"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:473:receipts/governance/v2-cutover-execution-command-hash-v1.json:3:  "status": "command_hash_sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:474:receipts/governance/v2-cutover-execution-command-hash-v1.json:13:  "execution_command_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:475:receipts/governance/v2-cutover-execution-command-hash-v1.json:14:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:476:receipts/governance/v2-cutover-execution-command-hash-v1.json:15:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:477:receipts/governance/v2-cutover-execution-command-hash-v1.json:16:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:478:receipts/governance/v2-cutover-execution-command-hash-v1.json:17:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:479:receipts/governance/v2-cutover-execution-command-hash-v1.json:18:  "wallet_signing_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:480:receipts/governance/v2-cutover-execution-command-hash-v1.json:19:  "liquidity_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:481:receipts/governance/v2-cutover-execution-command-hash-v1.json:20:  "staking_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:482:receipts/governance/v2-cutover-execution-command-hash-v1.json:21:  "relayer_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:483:receipts/governance/lone-steward-governance-baseline-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:484:receipts/governance/v2-funder-review-packet-v1.json:10:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:485:receipts/governance/v2-funder-review-packet-v1.json:11:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:486:receipts/governance/v2-funder-review-packet-v1.json:12:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:487:receipts/governance/v2-funder-review-packet-v1.json:13:    "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:488:receipts/governance/pr-296-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:489:receipts/governance/pr-296-post-merge-governance-receipt-v1.json:16:  "execution_command_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:490:receipts/governance/pr-296-post-merge-governance-receipt-v1.json:17:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:491:receipts/governance/pr-296-post-merge-governance-receipt-v1.json:18:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:492:receipts/governance/pr-296-post-merge-governance-receipt-v1.json:19:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:493:receipts/governance/pr-296-post-merge-governance-receipt-v1.json:20:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:494:receipts/governance/pr-296-post-merge-governance-receipt-v1.json:21:  "wallet_signing_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:495:receipts/governance/pr-296-post-merge-governance-receipt-v1.json:22:  "liquidity_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:496:receipts/governance/pr-296-post-merge-governance-receipt-v1.json:23:  "staking_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:497:receipts/governance/pr-296-post-merge-governance-receipt-v1.json:24:  "relayer_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:498:receipts/governance/open-verification-gate-v1-post-merge.json:15:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:499:receipts/governance/open-verification-gate-v1-post-merge.json:16:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:500:receipts/governance/open-verification-gate-v1-post-merge.json:18:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:501:receipts/governance/open-verification-gate-v1-post-merge.json:22:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:502:receipts/governance/mainnet-operator-approval-preparation-v1.json:5:    "status": "PREPARATION_ONLY"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:503:receipts/governance/mainnet-operator-approval-preparation-v1.json:19:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:504:receipts/governance/mainnet-operator-approval-preparation-v1.json:20:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:505:receipts/governance/mainnet-operator-approval-preparation-v1.json:22:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:506:receipts/governance/mainnet-operator-approval-preparation-v1.json:23:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:507:receipts/governance/post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:508:receipts/governance/pr-292-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:509:receipts/governance/pr-292-post-merge-governance-receipt-v1.json:10:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:510:receipts/governance/pr-292-post-merge-governance-receipt-v1.json:11:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:511:receipts/governance/pr-292-post-merge-governance-receipt-v1.json:12:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:512:receipts/governance/pr-292-post-merge-governance-receipt-v1.json:13:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:513:receipts/governance/pr-253-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:514:receipts/governance/pr-253-post-merge-governance-receipt-v1.json:15:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:515:receipts/governance/pr-253-post-merge-governance-receipt-v1.json:16:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:516:receipts/governance/pr-253-post-merge-governance-receipt-v1.json:17:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:517:receipts/governance/pr-253-post-merge-governance-receipt-v1.json:18:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:518:receipts/governance/pr-222-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:519:receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json:50:  "exit_criteria_status": {
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:520:receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json:60:    "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:521:receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json:61:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:522:receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json:62:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:523:receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json:63:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:524:receipts/governance/supervised-activation-dry-run-3-evidence-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:525:receipts/governance/supervised-activation-dry-run-3-evidence-v1.json:10:  "activation_status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:526:receipts/governance/supervised-activation-dry-run-3-evidence-v1.json:14:  "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:527:receipts/governance/pr-283-post-merge-governance-receipt-v1.json:15:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:528:receipts/governance/pr-283-post-merge-governance-receipt-v1.json:16:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:529:receipts/governance/pr-283-post-merge-governance-receipt-v1.json:17:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:530:receipts/governance/pr-283-post-merge-governance-receipt-v1.json:18:    "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:531:receipts/governance/pr-186-selfhosted-merge-boundary-v1.json:3:  "status": "sealed_pre_merge_boundary",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:532:receipts/governance/pr-256-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:533:receipts/governance/pr-256-post-merge-governance-receipt-v1.json:16:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:534:receipts/governance/pr-256-post-merge-governance-receipt-v1.json:17:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:535:receipts/governance/pr-256-post-merge-governance-receipt-v1.json:18:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:536:receipts/governance/pr-256-post-merge-governance-receipt-v1.json:19:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:537:receipts/governance/v2-public-funder-packet-index-v1.json:21:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:538:receipts/governance/v2-public-funder-packet-index-v1.json:22:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:539:receipts/governance/v2-public-funder-packet-index-v1.json:23:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:540:receipts/governance/v2-public-funder-packet-index-v1.json:24:    "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:541:receipts/governance/pr-291-post-merge-governance-receipt-v1.json:15:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:542:receipts/governance/pr-291-post-merge-governance-receipt-v1.json:16:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:543:receipts/governance/pr-291-post-merge-governance-receipt-v1.json:17:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:544:receipts/governance/pr-291-post-merge-governance-receipt-v1.json:18:    "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:545:receipts/governance/pr-291-post-merge-governance-receipt-v1.json:20:    "unpark_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:546:receipts/governance/pr-205-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:547:receipts/governance/current-sovereign-state-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:548:receipts/governance/pr-258-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:549:receipts/governance/pr-258-post-merge-governance-receipt-v1.json:9:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:550:receipts/governance/pr-258-post-merge-governance-receipt-v1.json:10:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:551:receipts/governance/pr-258-post-merge-governance-receipt-v1.json:11:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:552:receipts/governance/pr-258-post-merge-governance-receipt-v1.json:12:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:553:receipts/governance/pr-209-211-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:554:receipts/governance/pr-209-211-post-merge-governance-receipt-v1.json:43:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:555:receipts/governance/pr-209-211-post-merge-governance-receipt-v1.json:64:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:556:receipts/governance/pr-260-post-merge-governance-receipt-v1.json:16:    "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:557:receipts/governance/pr-260-post-merge-governance-receipt-v1.json:17:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:558:receipts/governance/pr-260-post-merge-governance-receipt-v1.json:18:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:559:receipts/governance/pr-260-post-merge-governance-receipt-v1.json:19:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:560:receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json:7:  "wrapper_status": "failed_or_missing",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:561:receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json:8:  "exit_code": 1,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:562:receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json:12:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:563:receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json:13:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:564:receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json:14:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:565:receipts/governance/pr-287-post-merge-governance-receipt-v1.json:15:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:566:receipts/governance/pr-287-post-merge-governance-receipt-v1.json:16:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:567:receipts/governance/pr-287-post-merge-governance-receipt-v1.json:17:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:568:receipts/governance/pr-287-post-merge-governance-receipt-v1.json:18:    "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:569:receipts/governance/pr-294-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:570:receipts/governance/pr-294-post-merge-governance-receipt-v1.json:13:  "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:571:receipts/governance/pr-294-post-merge-governance-receipt-v1.json:14:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:572:receipts/governance/pr-294-post-merge-governance-receipt-v1.json:15:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:573:receipts/governance/pr-294-post-merge-governance-receipt-v1.json:16:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:574:receipts/governance/pr-294-post-merge-governance-receipt-v1.json:17:  "wallet_signing_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:575:receipts/governance/pr-294-post-merge-governance-receipt-v1.json:18:  "liquidity_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:576:receipts/governance/pr-294-post-merge-governance-receipt-v1.json:19:  "staking_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:577:receipts/governance/pr-294-post-merge-governance-receipt-v1.json:20:  "relayer_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:578:receipts/governance/open-verification-gate-v1.json:8:  "status": {
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:579:receipts/governance/open-verification-gate-v1.json:9:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:580:receipts/governance/open-verification-gate-v1.json:10:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:581:receipts/governance/open-verification-gate-v1.json:12:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:582:receipts/governance/open-verification-gate-v1.json:13:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:583:receipts/governance/pr-220-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:584:receipts/governance/pr-220-post-merge-governance-receipt-v1.json:19:  "activation_status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:585:receipts/governance/pr-220-post-merge-governance-receipt-v1.json:25:  "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:586:receipts/governance/pr-224-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:587:receipts/governance/pr-224-post-merge-governance-receipt-v1.json:18:  "activation_status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:588:receipts/governance/pr-289-post-merge-governance-receipt-v1.json:15:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:589:receipts/governance/pr-289-post-merge-governance-receipt-v1.json:16:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:590:receipts/governance/pr-289-post-merge-governance-receipt-v1.json:17:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:591:receipts/governance/pr-289-post-merge-governance-receipt-v1.json:18:    "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:592:receipts/governance/pr-289-post-merge-governance-receipt-v1.json:20:    "unpark_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:593:receipts/governance/v2-pre-unpark-readiness-gate-v1.json:13:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:594:receipts/governance/v2-pre-unpark-readiness-gate-v1.json:14:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:595:receipts/governance/v2-pre-unpark-readiness-gate-v1.json:15:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:596:receipts/governance/v2-pre-unpark-readiness-gate-v1.json:16:    "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:597:receipts/governance/v2-pre-unpark-readiness-gate-v1.json:18:    "unpark_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:598:receipts/governance/mainnet-activation-command-hash-readiness-v1.json:17:    "status": "HASHED_FOR_READINESS_ONLY"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:599:receipts/governance/mainnet-activation-command-hash-readiness-v1.json:21:    "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:600:receipts/governance/mainnet-activation-command-hash-readiness-v1.json:22:    "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:601:receipts/governance/mainnet-activation-command-hash-readiness-v1.json:24:    "mainnet_cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:602:receipts/governance/mainnet-activation-command-hash-readiness-v1.json:25:    "state_changing_transaction_executed": false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:603:receipts/comms/press-agent-discord-parked-broadcast-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:604:receipts/comms/press-agent-discord-parked-broadcast-v1.json:13:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:605:receipts/comms/press-agent-discord-parked-broadcast-v1.json:15:  "state_changing_transaction_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:606:receipts/execution/selfhosted-runner-live-pass-v2.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:607:receipts/execution/autonomous-execution-receipt-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:608:receipts/execution/snapshot-ancestor-runner-context-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:609:receipts/execution/selfhosted-forgejo-runner-pass-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:610:receipts/execution/selfhosted-forgejo-runner-pass-v1.json:20:  "forgejo_proof_receipt_status": "completed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:611:receipts/execution/selfhosted-forgejo-runner-task-observation-v1.json:3:  "status": "observed_lifecycle_result_unproven",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:612:receipts/execution/selfhosted-runner-live-attempt-v2.json:3:  "status": "prepared",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:613:receipts/execution/external-runner-live-result-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:614:receipts/execution/external-runner-live-log-v1.json:3:  "status": "live_log_absent",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:615:receipts/execution/external-runner-live-log-v1.json:9:  "external_runner_proof_receipt_status": "prepared",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:616:receipts/execution/external-runner-live-failure-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:617:receipts/execution/external-runner-live-failure-v1.json:15:  "external_runner_executed": true,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:618:receipts/execution/consolidated-execution-evidence-index-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:619:receipts/execution/consolidated-execution-evidence-index-v1.json:10:      "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:620:receipts/execution/consolidated-execution-evidence-index-v1.json:16:      "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:621:receipts/execution/consolidated-execution-evidence-index-v1.json:22:      "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:622:receipts/execution/consolidated-execution-evidence-index-v1.json:28:      "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:623:receipts/execution/selfhosted-forgejo-runner-target-v1.json:3:  "status": "prepared",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:624:receipts/execution/external-runner-fixed-run-observation-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:625:receipts/execution/external-runner-3c32f91-inaccessible-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:626:receipts/execution/external-runner-proof-v1.json:3:  "status": "prepared",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:627:receipts/execution/external-runner-live-attempt-v1.json:3:  "status": "attempt_prepared",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:628:receipts/autonomous/autonomous-public-health-surface-v1.json:36:    "may_publish_status": true,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:629:receipts/autonomous/mainnet-cutover-secret-remediation-plan-v1.json:3:  "status": "SEALED_SECRET_REMEDIATION_PLAN",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:630:receipts/autonomous/mainnet-cutover-secret-remediation-plan-v1.json:6:  "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:631:receipts/autonomous/mainnet-cutover-secret-remediation-plan-v1.json:7:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:632:receipts/autonomous/mainnet-cutover-secret-remediation-plan-v1.json:8:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:633:receipts/autonomous/supervised-activation-runbook-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:634:receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json:3:  "status": "SEALED_READONLY_LIVE_PROBE",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:635:receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json:9:  "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:636:receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json:10:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:637:receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json:11:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:638:receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json:32:    "readonly_live_probe_executed": true,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:639:receipts/autonomous/dry-run-output-hygiene-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:640:receipts/autonomous/mainnet-cutover-readiness-boundary-v1.json:3:  "status": "SEALED_BOUNDARY",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:641:receipts/autonomous/mainnet-cutover-readiness-boundary-v1.json:7:  "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:642:receipts/autonomous/mainnet-cutover-readiness-boundary-v1.json:8:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:643:receipts/autonomous/mainnet-cutover-readiness-boundary-v1.json:9:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:644:receipts/autonomous/autonomous-network-readiness-v1.json:20:  "status": "sealed"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:645:receipts/autonomous/mainnet-cutover-secret-completion-gate-v1.json:3:  "status": "SEALED_SECRET_COMPLETION_BLOCKED",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:646:receipts/autonomous/mainnet-cutover-secret-completion-gate-v1.json:6:  "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:647:receipts/autonomous/mainnet-cutover-secret-completion-gate-v1.json:7:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:648:receipts/autonomous/mainnet-cutover-secret-completion-gate-v1.json:8:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:649:receipts/autonomous/supervised-autonomous-dry-run-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:650:receipts/autonomous/supervised-autonomous-dry-run-script-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:651:receipts/autonomous/supervised-activation-dry-run-evidence-summary-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:652:receipts/autonomous/supervised-activation-dry-run-evidence-summary-v1.json:13:  "dry_run_1_status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:653:receipts/autonomous/supervised-activation-dry-run-evidence-summary-v1.json:20:  "dry_run_2_status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:654:receipts/autonomous/mainnet-cutover-command-hash-v1.json:3:  "status": "SEALED_COMMAND_HASH",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:655:receipts/autonomous/mainnet-cutover-command-hash-v1.json:8:  "command_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:656:receipts/autonomous/mainnet-cutover-command-hash-v1.json:9:  "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:657:receipts/autonomous/mainnet-cutover-command-hash-v1.json:10:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:658:receipts/autonomous/mainnet-cutover-command-hash-v1.json:11:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:659:receipts/autonomous/mainnet-cutover-command-hash-v1.json:28:    "command_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:660:receipts/autonomous/mainnet-cutover-preflight-boundary-v1.json:3:  "status": "SEALED_PREFLIGHT_BLOCKED",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:661:receipts/autonomous/mainnet-cutover-preflight-boundary-v1.json:7:  "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:662:receipts/autonomous/mainnet-cutover-preflight-boundary-v1.json:8:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:663:receipts/autonomous/mainnet-cutover-preflight-boundary-v1.json:9:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:664:receipts/autonomous/supervised-activation-readiness-index-v1.json:3:  "status": "prepared",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:665:receipts/autonomous/supervised-activation-readiness-index-v1.json:24:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:666:receipts/autonomous/supervised-activation-dry-run-4-evidence-v1.json:3:  "status": "SEALED",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:667:receipts/autonomous/supervised-activation-dry-run-4-evidence-v1.json:14:    "status": "dry_run_complete"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:668:receipts/autonomous/mainnet-cutover-rollback-plan-v1.json:3:  "status": "SEALED_ROLLBACK_PLAN",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:669:receipts/autonomous/mainnet-cutover-rollback-plan-v1.json:6:  "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:670:receipts/autonomous/mainnet-cutover-rollback-plan-v1.json:7:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:671:receipts/autonomous/mainnet-cutover-rollback-plan-v1.json:8:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:672:receipts/autonomous/network-activation-readiness-v2.json:4:  "status": "prepared",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:673:receipts/autonomous/autonomous-agent-quarantine-manifest-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:674:receipts/autonomous/mainnet-cutover-final-operator-approval-v1.json:3:  "status": "SEALED_APPROVAL_NOT_GRANTED",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:675:receipts/autonomous/mainnet-cutover-final-operator-approval-v1.json:12:  "command_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:676:receipts/autonomous/mainnet-cutover-final-operator-approval-v1.json:13:  "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:677:receipts/autonomous/mainnet-cutover-final-operator-approval-v1.json:14:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:678:receipts/autonomous/mainnet-cutover-final-operator-approval-v1.json:15:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:679:receipts/autonomous/supervised-activation-receipt-hash-semantics-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:680:receipts/autonomous/mainnet-cutover-gate-definition-v1.json:3:  "status": "SEALED_GATE_DEFINITION",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:681:receipts/autonomous/mainnet-cutover-gate-definition-v1.json:6:  "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:682:receipts/autonomous/mainnet-cutover-gate-definition-v1.json:7:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:683:receipts/autonomous/mainnet-cutover-gate-definition-v1.json:8:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:684:receipts/autonomous/mainnet-cutover-operator-approval-gate-v1.json:3:  "status": "SEALED_OPERATOR_APPROVAL_GATE",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:685:receipts/autonomous/mainnet-cutover-operator-approval-gate-v1.json:6:  "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:686:receipts/autonomous/mainnet-cutover-operator-approval-gate-v1.json:7:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:687:receipts/autonomous/mainnet-cutover-operator-approval-gate-v1.json:8:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:688:receipts/autonomous/supervised-activation-operations-index-v1.json:3:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:689:receipts/autonomous/supervised-activation-operations-index-v1.json:12:  "dry_run_1_status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:690:receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-45-51-662Z.json:3:  "status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:691:receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-45-51-662Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:692:receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-47-34-237Z.json:3:  "status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:693:receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-47-34-237Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:694:receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-47-23-615Z.json:3:  "status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:695:receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-47-23-615Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:696:receipts/autonomous/autonomous-runner-observation-v1.json:3:  "status": "observed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:697:receipts/autonomous/autonomous-worker-monitor-attempt-v1.json:4:  "status": "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:698:scripts/verify-pr-298-execution-wrapper-failed-attempt-review-v1.cjs:21:if (!doc.includes("wrapper_status: failed_or_missing")) fail("missing failed_or_missing conclusion");
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:699:scripts/verify-pr-298-execution-wrapper-failed-attempt-review-v1.cjs:22:if (!doc.includes("exit_code: 1")) fail("missing exit_code conclusion");
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:700:scripts/verify-pr-213-post-merge-governance-receipt-v1.cjs:19:  ["status", receipt.status === "sealed"],
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:701:scripts/verify-pr-213-post-merge-governance-receipt-v1.cjs:30:  ["no irreversible action", receipt.verified_state && receipt.verified_state.irreversible_network_action_executed === false],
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:702:scripts/check-0g-compute-router.js:27:  console.log(`HTTP status: ${res.status}`);
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:703:scripts/query-0g-direct-provider.js:61:console.log(`HTTP status: ${res.status}`);
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:704:scripts/discover-0g-router.js:37:    const code = await provider.getCode(address);
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:705:scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:33:  irreversible_network_action_executed: false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:706:scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:55:  "activation_status == dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:707:scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:59:  "irreversible_network_action_executed == false",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:708:scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:76:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:709:scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:82:  activation_command_executed: true,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:710:scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:83:  activation_status: "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:711:scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:87:  irreversible_network_action_executed: false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:712:scripts/autonomous-worker-monitor-attempt-v1.cjs:18:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:713:scripts/verify-v2-read-only-status-dashboard-v1.cjs:23:const status = JSON.parse(fs.readFileSync(statusJsonPath, "utf8"));
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:714:scripts/verify-v2-mainnet-cutover-execution-v1.cjs:14:if (receipt.execution_command_exit_code === 0 && receipt.execution_receipt_exists !== true) fail("successful command must produce execution receipt");
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:715:scripts/verify-autonomous-network-activation-readiness-v2.cjs:19:  ["status", receipt.status === "prepared"],
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:716:scripts/verify-external-attestation-v1.cjs:67:  "state_changing_transaction_executed: false"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:717:scripts/verify-external-attestation-v1.cjs:109:  const m = text.match(/Finding status:\s*(pass|fail|concern)/i);
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:718:scripts/verify-autonomous-agent-quarantine-manifest-v1.cjs:26:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:719:scripts/write-0g-router-billing-report.cjs:37:        resolve({ json, stderr, exitCode: code });
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:720:scripts/write-0g-router-billing-report.cjs:62:  const status = routerChat.status || 'UNKNOWN';
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:721:scripts/verify-pre-cutover-review-window-v1.cjs:20:const status = fs.readFileSync(statusPath, "utf8");
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:722:scripts/safe-deploy.js:37:  if (!artifact.abi || !artifact.bytecode || artifact.bytecode === "0x") {
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:723:scripts/verify-supervised-autonomous-dry-run-script-v1.cjs:31:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:724:scripts/verify-supervised-activation-runbook-v1.cjs:63:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:725:scripts/deploy_0g_dex.py:154:    def deploy_contract(self, name: str, bytecode: str, abi: list, *args) -> Tuple[str, str]:
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:726:scripts/deploy_0g_dex.py:159:        Contract = self.w3.eth.contract(abi=abi, bytecode=bytecode)
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:727:scripts/deploy_0g_dex.py:211:                w0g_bytecode = artifact['bytecode']['object']
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:728:scripts/generate-determinism-manifest.cjs:152:    cutover_executed: false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:729:scripts/generate-determinism-manifest.cjs:153:    deployment_executed: false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:730:scripts/generate-determinism-manifest.cjs:154:    broadcast_executed: false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:731:scripts/generate-determinism-manifest.cjs:155:    state_changing_transaction_executed: false
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:732:scripts/verify-current-sovereign-state-v1.cjs:9:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:733:scripts/health-0g-compute.cjs:20:  ROUTER_MODELS: { status: 'UNKNOWN', details: {} },
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:734:scripts/health-0g-compute.cjs:21:  ROUTER_CHAT: { status: 'UNKNOWN', details: {} },
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:735:scripts/health-0g-compute.cjs:22:  DIRECT_PROVIDER: { status: 'UNKNOWN', details: {} }
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:736:scripts/health-0g-compute.cjs:76:        status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:737:scripts/health-0g-compute.cjs:97:          status: 'PASS',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:738:scripts/health-0g-compute.cjs:106:          status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:739:scripts/health-0g-compute.cjs:112:        status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:740:scripts/health-0g-compute.cjs:118:      status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:741:scripts/health-0g-compute.cjs:131:        status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:742:scripts/health-0g-compute.cjs:162:          status: 'PASS',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:743:scripts/health-0g-compute.cjs:171:          status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:744:scripts/health-0g-compute.cjs:179:          status: 'WARN',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:745:scripts/health-0g-compute.cjs:190:          status: 'WARN',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:746:scripts/health-0g-compute.cjs:198:          status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:747:scripts/health-0g-compute.cjs:207:          status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:748:scripts/health-0g-compute.cjs:214:      status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:749:scripts/health-0g-compute.cjs:229:        status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:750:scripts/health-0g-compute.cjs:252:      if (code === 0) {
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:751:scripts/health-0g-compute.cjs:254:          status: 'PASS',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:752:scripts/health-0g-compute.cjs:256:            exitCode: 0,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:753:scripts/health-0g-compute.cjs:262:          status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:754:scripts/health-0g-compute.cjs:264:            exitCode: code,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:755:scripts/health-0g-compute.cjs:274:        status: 'FAIL',
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:756:scripts/verify-pr-209-211-post-merge-governance-receipt-v1.cjs:22:  ["status", receipt.status === "sealed"],
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:757:scripts/verify-pr-209-211-post-merge-governance-receipt-v1.cjs:37:  ["no irreversible action", receipt.verified_safety && receipt.verified_safety.irreversible_network_action_executed === false],
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:758:scripts/verify-pr-207-post-merge-governance-receipt-v1.cjs:19:  ["status", receipt.status === "sealed"],
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:759:scripts/verify-pr-251-post-merge-governance-receipt-v1.cjs:47:  "state_changing_transaction_executed = false"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:760:scripts/verify-dry-run-output-hygiene-v1.cjs:37:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:761:scripts/verify-selfhosted-runner-live-attempt-v2.cjs:22:assert(receipt.status === 'prepared', 'status must remain prepared before evidence capture');
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:762:scripts/verify-pr-222-post-merge-governance-receipt-v1.cjs:51:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:763:scripts/check-0g-router-chat.cjs:74:        console.log(`  error.code: ${parsedResponse.error.code || 'N/A'}`);
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:764:scripts/local-ci-surrogate.sh:23:  nvm_source_status=$?
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:765:scripts/verify-pr-224-post-merge-governance-receipt-v1.cjs:28:  "activation_status == dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:766:scripts/verify-pr-224-post-merge-governance-receipt-v1.cjs:53:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:767:scripts/verify-pr-224-post-merge-governance-receipt-v1.cjs:68:  activation_status: "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:768:scripts/generate-grant-evidence.cjs:27:      exit_code: result.status,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:769:scripts/generate-grant-evidence.cjs:37:      exit_code: null,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:770:scripts/generate-grant-evidence.cjs:71:    `**Exit code:** \`${result.exit_code}\`  `,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:771:scripts/generate-grant-evidence.cjs:171:      exit_code: null,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:772:scripts/verify-autonomous-public-health-surface-v1.cjs:3:const status = JSON.parse(fs.readFileSync("public/status/autonomous-health.json", "utf8"));
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:773:scripts/verify-cross-platform-determinism-v1.cjs:141:const status = git("git status --short");
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:774:scripts/verify-supervised-activation-dry-run-evidence-summary-v1.cjs:54:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:775:scripts/verify-supervised-activation-dry-run-evidence-summary-v1.cjs:57:  dry_run_1_status: "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:776:scripts/verify-supervised-activation-dry-run-evidence-summary-v1.cjs:63:  dry_run_2_status: "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:777:scripts/verify-selfhosted-runner-live-pass-v2.cjs:19:assert(receipt.status === 'sealed', 'status must be sealed');
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:778:scripts/verify-pr-253-post-merge-governance-receipt-v1.cjs:48:  "state_changing_transaction_executed = false"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:779:scripts/verify-supervised-activation-runtime-hygiene-v1.cjs:26:  ["script still refuses irreversible action", script.includes("irreversible_network_action_executed: false")],
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:780:scripts/verify-external-runner-live-failure.cjs:6:for (const phrase of ["supersedes the prior `ABSENT` classification", "external_runner_executed == true", "external_runner_pass == false", "canonicalCommit is not an ancestor of HEAD"]) { if (!doc.includes(phrase)) { console.error(`FAIL: doc missing ${phrase}`); process.exit(1); } }
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:781:scripts/verify-external-runner-live-failure.cjs:7:for (const phrase of ["status: FAILURE", "job_id: 6249479", "This supersedes the earlier ABSENT classification."]) { if (!log.includes(phrase)) { console.error(`FAIL: log missing ${phrase}`); process.exit(1); } }
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:782:scripts/verify-external-runner-live-failure.cjs:8:const required = {schema:"qpf.external_runner_live_failure.v1", previous_result:"ABSENT", corrected_result:"FAILURE", job_id:"6249479", external_runner_executed:true, external_runner_pass:false, false_pass_claimed:false, truth_boundary:"local_verifier_pass != external_runner_pass"};
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:783:scripts/verify-supervised-activation-receipt-hash-semantics-v1.cjs:54:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:784:scripts/verify-discord-only-proof-v1.cjs:9:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:785:scripts/verify-supervised-autonomous-activation-command-v1.cjs:32:  "irreversible_network_action_executed: false",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:786:scripts/verify-pr-251-hosted-ci-failure-opacity-boundary-v1.cjs:45:  "state_changing_transaction_executed = false"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:787:scripts/verify-supervised-activation-dry-run-3-evidence-v1.cjs:27:  "activation_status == dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:788:scripts/verify-supervised-activation-dry-run-3-evidence-v1.cjs:31:  "irreversible_network_action_executed == false",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:789:scripts/verify-supervised-activation-dry-run-3-evidence-v1.cjs:49:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:790:scripts/verify-supervised-activation-dry-run-3-evidence-v1.cjs:56:  activation_status: "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:791:scripts/verify-supervised-activation-dry-run-3-evidence-v1.cjs:60:  irreversible_network_action_executed: false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:792:scripts/verify-pr-220-post-merge-governance-receipt-v1.cjs:27:  "activation_status == dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:793:scripts/verify-pr-220-post-merge-governance-receipt-v1.cjs:33:  "irreversible_network_action_executed == false",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:794:scripts/verify-pr-220-post-merge-governance-receipt-v1.cjs:47:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:795:scripts/verify-pr-220-post-merge-governance-receipt-v1.cjs:63:  activation_status: "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:796:scripts/verify-pr-220-post-merge-governance-receipt-v1.cjs:69:  irreversible_network_action_executed: false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:797:scripts/verify-public-status-v1.cjs:12:const status = fs.readFileSync("STATUS.md", "utf8");
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:798:scripts/verify-public-status-v1.cjs:20:  "mainnet_cutover_executed = false",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:799:scripts/verify-public-status-v1.cjs:21:  "deployment_executed = false",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:800:scripts/verify-public-status-v1.cjs:22:  "broadcast_executed = false",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:801:scripts/verify-public-status-v1.cjs:23:  "state_changing_transaction_executed = false",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:802:scripts/supervised-autonomous-activation-v1.cjs:18:  status: "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:803:scripts/supervised-autonomous-activation-v1.cjs:25:    irreversible_network_action_executed: false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:804:scripts/supervised-autonomous-activation-v1.cjs:39:  receipt.status = "refused_live_mode";
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:805:scripts/supervised-autonomous-activation-v1.cjs:44:  receipt.status = "refused_private_key_context";
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:806:scripts/verification/universal/verify-erc20.sh:125:    local contract_code=$(cast code "$TOKEN_ADDRESS" --rpc-url "$RPC_URL" 2>/dev/null)
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:807:scripts/verification/universal/verify-erc20.sh:127:    if [[ "$contract_code" == *"42966c68"* ]]; then
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:808:scripts/verification/universal/verify-erc20.sh:136:    if [[ "$contract_code" == *"40c10f19"* ]]; then
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:809:scripts/verification/universal/verify-erc20.sh:196:  "verification_status": "passed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:810:scripts/verification/lib/assertions.sh:139:    local code=$(cast code "$addr" --rpc-url "$rpc" 2>/dev/null)
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:811:scripts/verification/lib/assertions.sh:141:    if [ -z "$code" ] || [ "$code" == "0x" ]; then
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:812:scripts/verification/lib/validators.sh:23:    local code=$(cast code "$addr" --rpc-url "$rpc" 2>/dev/null)
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:813:scripts/verification/lib/validators.sh:25:    if [ -z "$code" ] || [ "$code" == "0x" ]; then
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:814:scripts/verification/pi-network/verify-catalyst.sh:205:  "verification_status": "passed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:815:scripts/verification/zero-g/verify-uniswap.sh:283:  "verification_status": "passed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:816:scripts/preflight-0g-deploy.js:23:  if (!artifact.abi || !artifact.bytecode || artifact.bytecode === "0x") {
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:817:scripts/supervised-autonomous-dry-run-v1.cjs:20:const status = git(["status", "--short"]);
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:818:scripts/supervised-autonomous-dry-run-v1.cjs:42:  status: "completed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:819:scripts/verify-pr-218-post-merge-governance-receipt-v1.cjs:41:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:820:scripts/verify_0g_dex.py:127:            code = self.w3.eth.get_code(address)
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:821:scripts/verify_0g_dex.py:128:            if code == b'' or code == '0x':
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:822:scripts/verify_0g_dex.py:326:                status = "✅ PASS" if result['passed'] else "❌ FAIL"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:823:scripts/verify-reviewer-attestation-intake-v1.cjs:88:for (const field of ["OS:", "Architecture:", "Node version:", "npm version:", "Commit tested:", "Commands run:", "Verifier output:", "Manifest SHA256:", "File count:", "Finding status:", "Notes:"]) {
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:824:scripts/verify-reviewer-attestation-intake-v1.cjs:135:  "state_changing_transaction_executed: false",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:825:scripts/monitor.ps1:56:            $status = "HEALTHY"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:826:scripts/monitor.ps1:60:                Write-Host "   Expected status: $($endpoint.ExpectedStatus), Got: $($response.StatusCode)"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:827:scripts/monitor.ps1:65:            $status = "WARNING"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:828:scripts/monitor.ps1:76:        $status = "FAILED"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:829:scripts/guardians.ps1:94:                $status = Invoke-WebRequest "http://localhost:8080/sentinel/status" -UseBasicParsing -TimeoutSec 5
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:830:scripts/verify-pr-256-post-merge-governance-receipt-v1.cjs:19:const status = fs.readFileSync("STATUS.md", "utf8");
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:831:scripts/verify-pr-256-post-merge-governance-receipt-v1.cjs:50:  "deployment_executed = false",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:832:scripts/verify-pr-256-post-merge-governance-receipt-v1.cjs:51:  "state_changing_transaction_executed = false",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:833:scripts/verify-pr-186-selfhosted-merge-boundary.cjs:7:  status: "sealed_pre_merge_boundary",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:834:scripts/verify-pr-205-post-merge-governance-receipt-v1.cjs:19:  ["status sealed", receipt.status === "sealed"],
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:835:scripts/verify-supervised-activation-readiness-index-v1.cjs:37:  ["status", receipt.status === "prepared"],
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:836:scripts/verify-supervised-activation-readiness-index-v1.cjs:44:  ["no irreversible", receipt.safety_state && receipt.safety_state.irreversible_network_action_executed === false],
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:837:scripts/verify-autonomous-runner-observation-v1.cjs:11:assert(receipt.status === "observed", "status must be observed");
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:838:scripts/verify-pr-226-post-merge-governance-receipt-v1.cjs:53:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:839:scripts/verify-consolidated-execution-evidence-index.cjs:41:  if (!receipt.receipt_chain.some((entry) => entry.pr === pr && entry.status === "sealed")) {
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:840:scripts/verify-supervised-activation-dry-run-1-evidence-v1.cjs:37:  "activation_status == dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:841:scripts/verify-supervised-activation-dry-run-1-evidence-v1.cjs:54:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:842:scripts/verify-supervised-activation-dry-run-1-evidence-v1.cjs:59:  activation_command_executed: true,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:843:scripts/verify-supervised-activation-dry-run-1-evidence-v1.cjs:60:  activation_status: "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:844:scripts/query-0g-compute-model.js:61:  console.log(`HTTP status: ${res.status}`);
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:845:scripts/verify-pr-215-post-merge-governance-receipt-v1.cjs:46:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:846:scripts/hud.py:92:        return jsonify({"status": "offline"}), 500
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:847:scripts/verify-audit-hardening-readiness-v1.cjs:69:  "state_changing_transaction_executed = false"
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:848:scripts/generate-external-runner-live-failure.cjs:7:"status: FAILURE",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:849:scripts/generate-external-runner-live-failure.cjs:69:"external_runner_executed == true",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:850:scripts/generate-external-runner-live-failure.cjs:86:const receipt = {schema:"qpf.external_runner_live_failure.v1",status:"sealed",supersedes:"receipts/execution/external-runner-live-result-v1.json",previous_result:"ABSENT",corrected_result:"FAILURE",runner_target:"Codeberg Forgejo Actions",workflow:"local-proof.yml",job_id:"6249479",runner_host:"actions-tiny.aburayama.m.codeberg.org",runner_version:"v12.10.1",container_image:"ghcr.io/catthehacker/ubuntu:act-latest",node:"v22.22.3",npm:"10.9.8",external_runner_executed:true,external_runner_pass:false,failure_stage:"snapshot_verification",failure_reason:"canonicalCommit is not an ancestor of HEAD",log_path:"logs/external-runner/codeberg-live-failure-6249479-20260610.txt",truth_boundary:"local_verifier_pass != external_runner_pass",false_pass_claimed:false,next_repair_boundary:"Forgejo/Codeberg PR checkout ancestry handling"};
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:851:scripts/generate-external-runner-live-failure.cjs:94:"for (const phrase of [\"supersedes the prior `ABSENT` classification\", \"external_runner_executed == true\", \"external_runner_pass == false\", \"canonicalCommit is not an ancestor of HEAD\"]) { if (!doc.includes(phrase)) { console.error(`FAIL: doc missing ${phrase}`); process.exit(1); } }",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:852:scripts/generate-external-runner-live-failure.cjs:95:"for (const phrase of [\"status: FAILURE\", \"job_id: 6249479\", \"This supersedes the earlier ABSENT classification.\"]) { if (!log.includes(phrase)) { console.error(`FAIL: log missing ${phrase}`); process.exit(1); } }",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:853:scripts/generate-external-runner-live-failure.cjs:96:"const required = {schema:\"qpf.external_runner_live_failure.v1\", previous_result:\"ABSENT\", corrected_result:\"FAILURE\", job_id:\"6249479\", external_runner_executed:true, external_runner_pass:false, false_pass_claimed:false, truth_boundary:\"local_verifier_pass != external_runner_pass\"};",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:854:scripts/verify-supervised-autonomous-dry-run-v1.cjs:28:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:855:scripts/seed_first_six_models.py:262:        #     "success": receipt.status == 1,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:856:scripts/seed_first_six_models.py:368:                "status": "success",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:857:scripts/seed_first_six_models.py:392:                "status": "failed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:858:scripts/verify-supervised-activation-operations-index-v1.cjs:25:  "dry_run_1_status == dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:859:scripts/verify-supervised-activation-operations-index-v1.cjs:43:  status: "sealed",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:860:scripts/verify-supervised-activation-operations-index-v1.cjs:51:  dry_run_1_status: "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:861:runtime/static-site-verification-v1/config-inspection.json:119:    "governance:public-status:v1:check": "node scripts/verify-public-status-v1.cjs",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:862:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-49-18-148Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:863:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-49-18-148Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:864:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-05-47-677Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:865:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-05-47-677Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:866:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-14-51-930Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:867:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-14-51-930Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:868:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-41-894Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:869:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-41-894Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:870:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-05-12-247Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:871:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-05-12-247Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:872:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-46-00-611Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:873:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-46-00-611Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:874:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-01-544Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:875:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-01-544Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:876:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-15-689Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:877:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-15-689Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:878:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-22-917Z.json:3:  "status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:879:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-22-917Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:880:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-56-03-907Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:881:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-56-03-907Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:882:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-49-120Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:883:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-49-120Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:884:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-19-24-676Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:885:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-19-24-676Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:886:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-28-27-869Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:887:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-28-27-869Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:888:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-56-18-972Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:889:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-56-18-972Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:890:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-30-980Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:891:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-30-980Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:892:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-30-530Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:893:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-30-530Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:894:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-25-38-379Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:895:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-25-38-379Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:896:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-43-28-555Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:897:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-43-28-555Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:898:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-54-03-230Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:899:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-54-03-230Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:900:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-41-912Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:901:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-41-912Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:902:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-05-47-762Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:903:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-05-47-762Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:904:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-04-56-472Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:905:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-04-56-472Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:906:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-43-28-621Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:907:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-43-28-621Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:908:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-28-28-065Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:909:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-28-28-065Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:910:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-44-736Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:911:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-44-736Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:912:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-54-822Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:913:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-54-822Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:914:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-00-05-393Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:915:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-00-05-393Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:916:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-54-03-302Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:917:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-54-03-302Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:918:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-44-04-270Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:919:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-44-04-270Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:920:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-52-280Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:921:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-52-280Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:922:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-48-06-418Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:923:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-48-06-418Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:924:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-33-54-297Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:925:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-33-54-297Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:926:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-19-24-280Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:927:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-19-24-280Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:928:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-57-48-628Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:929:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-57-48-628Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:930:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-25-38-267Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:931:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-25-38-267Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:932:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-49-18-056Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:933:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-49-18-056Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:934:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-02-18-846Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:935:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-02-18-846Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:936:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-03-39-559Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:937:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-03-39-559Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:938:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-00-05-260Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:939:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-00-05-260Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:940:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-06-13-567Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:941:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-06-13-567Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:942:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-31-15-717Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:943:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-31-15-717Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:944:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-46-859Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:945:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-46-859Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:946:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-10-612Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:947:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-10-612Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:948:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-46-00-460Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:949:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-46-00-460Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:950:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-38-902Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:951:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-38-902Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:952:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-08-724Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:953:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-08-724Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:954:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-09-21-455Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:955:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-09-21-455Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:956:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-19-222Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:957:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-19-222Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:958:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-59-905Z.json:3:  "status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:959:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-59-905Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:960:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-31-46-482Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:961:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-31-46-482Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:962:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-31-46-350Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:963:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-31-46-350Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:964:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-55-21-706Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:965:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-55-21-706Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:966:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-02-18-490Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:967:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-02-18-490Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:968:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-56-19-068Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:969:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-56-19-068Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:970:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-09-21-348Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:971:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-09-21-348Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:972:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-30-748Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:973:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-30-748Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:974:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-13-606Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:975:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-13-606Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:976:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-52-18-717Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:977:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-52-18-717Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:978:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-41-812Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:979:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-41-812Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:980:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-50-36-730Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:981:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-50-36-730Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:982:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-15-865Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:983:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-15-865Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:984:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-13-685Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:985:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-13-685Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:986:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-13-03-726Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:987:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-13-03-726Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:988:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-10-526Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:989:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-10-526Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:990:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-17-271Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:991:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-17-271Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:992:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-33-54-433Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:993:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-33-54-433Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:994:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-27-423Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:995:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-27-423Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:996:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-55-05-892Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:997:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-55-05-892Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:998:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-52-18-591Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:999:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-52-18-591Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1000:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-42-000Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1001:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-42-000Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1002:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-41-56-243Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1003:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-41-56-243Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1004:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-08-864Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1005:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-08-864Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1006:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-27-335Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1007:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-27-335Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1008:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-55-21-565Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1009:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-55-21-565Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1010:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-19-380Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1011:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-19-380Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1012:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-30-463Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1013:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-30-463Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1014:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-51-26-907Z.json:3:  "status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1015:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-51-26-907Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1016:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-56-03-976Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1017:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-56-03-976Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1018:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-48-06-336Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1019:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-48-06-336Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1020:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-13-03-797Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1021:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-13-03-797Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1022:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-14-10-215Z.json:3:  "status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1023:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-14-10-215Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1024:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-53-52-828Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1025:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-53-52-828Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1026:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-31-15-517Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1027:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-31-15-517Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1028:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-28-27-987Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1029:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-28-27-987Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1030:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-04-56-387Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1031:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-04-56-387Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1032:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-03-39-473Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1033:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-03-39-473Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1034:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-41-977Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1035:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-41-977Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1036:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-01-425Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1037:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-01-425Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1038:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-30-32-307Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1039:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-30-32-307Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1040:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-57-48-703Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1041:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-57-48-703Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1042:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-50-36-532Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1043:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-50-36-532Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1044:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-05-12-156Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1045:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-05-12-156Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1046:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-46-991Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1047:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-46-991Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1048:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-12-34-604Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1049:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-12-34-604Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1050:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-42-045Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1051:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-42-045Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1052:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-21-51-875Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1053:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-21-51-875Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1054:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-21-52-242Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1055:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-21-52-242Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1056:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-44-04-190Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1057:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-44-04-190Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1058:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-55-05-819Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1059:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-55-05-819Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1060:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-53-52-721Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1061:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-53-52-721Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1062:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-52-30-498Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1063:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-52-30-498Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1064:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-59-08-567Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1065:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-59-08-567Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1066:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-38-990Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1067:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-38-990Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1068:runtime/autonomous/runs/mainnet-cutover-readonly-live-probe-v1-20260611T093347Z.json:3:  "status": "READONLY_PROBE_COMPLETE",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1069:runtime/autonomous/runs/mainnet-cutover-readonly-live-probe-v1-20260611T093347Z.json:6:  "cutover_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1070:runtime/autonomous/runs/mainnet-cutover-readonly-live-probe-v1-20260611T093347Z.json:7:  "deployment_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1071:runtime/autonomous/runs/mainnet-cutover-readonly-live-probe-v1-20260611T093347Z.json:8:  "broadcast_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1072:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-12-34-480Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1073:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-12-34-480Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1074:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-54-697Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1075:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-54-697Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1076:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-49-12-940Z.json:3:  "status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1077:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-49-12-940Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1078:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-39-49-865Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1079:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-39-49-865Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1080:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-39-49-944Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1081:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-39-49-944Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1082:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-28-27-807Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1083:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-28-27-807Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1084:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-41-56-316Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1085:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-41-56-316Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1086:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-52-353Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1087:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-52-353Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1088:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-30-32-238Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1089:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-30-32-238Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1090:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-59-08-636Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1091:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-59-08-636Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1092:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-52-30-604Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1093:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-52-30-604Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1094:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-49-210Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1095:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-49-210Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1096:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-14-51-778Z.json:3:  "status": "refused_live_mode",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1097:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-14-51-778Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1098:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-06-13-699Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1099:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-06-13-699Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1100:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-44-876Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1101:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-44-876Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1102:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-17-406Z.json:3:  "status": "refused_private_key_context",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1103:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-17-406Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1104:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-12-949Z.json:3:  "status": "dry_run_complete",
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1105:runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-12-949Z.json:10:    "irreversible_network_action_executed": false,
docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:1106:package.json:98:    "governance:public-status:v1:check": "node scripts/verify-public-status-v1.cjs",
docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_213.md:57:irreversible_network_action_executed == false
docs/governance/AUDIT_HARDENING_READINESS_V1.md:51:mainnet_cutover_executed = false
docs/governance/AUDIT_HARDENING_READINESS_V1.md:52:deployment_executed = false
docs/governance/AUDIT_HARDENING_READINESS_V1.md:53:broadcast_executed = false
docs/governance/AUDIT_HARDENING_READINESS_V1.md:54:state_changing_transaction_executed = false
docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_3_EVIDENCE_V1.md:21:activation_status == dry_run_complete
docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_3_EVIDENCE_V1.md:28:irreversible_network_action_executed == false
docs/governance/OPEN_VERIFICATION_GATE_V1.md:45:mainnet_cutover_executed = false
docs/governance/OPEN_VERIFICATION_GATE_V1.md:46:deployment_executed = false
docs/governance/OPEN_VERIFICATION_GATE_V1.md:47:broadcast_executed = false
docs/governance/OPEN_VERIFICATION_GATE_V1.md:48:state_changing_transaction_executed = false
docs/governance/PR_260_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:26:cutover_executed: false  
docs/governance/PR_260_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:27:deployment_executed: false  
docs/governance/PR_260_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:28:broadcast_executed: false  
docs/governance/PR_260_POST_MERGE_GOVERNANCE_RECEIPT_V1.md:29:state_changing_transaction_executed: false
docs/mainnet-cutover/MAINNET_CUTOVER_READINESS_INDEX_V1.md:12:- mainnet_cutover_executed = false
docs/mainnet-cutover/MAINNET_CUTOVER_READINESS_INDEX_V1.md:13:- deployment_executed = false
docs/mainnet-cutover/MAINNET_CUTOVER_READINESS_INDEX_V1.md:14:- broadcast_executed = false
docs/mainnet-cutover/MAINNET_CUTOVER_READINESS_INDEX_V1.md:15:- state_changing_transaction_executed = false
docs/AI_AGENT_HANDOFF_RUNBOOK.md:625:- Health status: degraded
docs/operations/EXTERNAL_RUNNER_FIXED_RUN_OBSERVATION_V1.md:58:external_runner_executed == unknown_for_fixed_run
docs/operations/EXTERNAL_RUNNER_LIVE_FAILURE_V1.md:32:external_runner_executed == true
docs/operations/SELFHOSTED_FORGEJO_RUNNER_PASS_V1.md:23:- Forgejo proof receipt emitted with `"status": "completed"`.
docs/GUARDIAN_PLAYBOOK.md:170:curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision-history?requires_guardian=true&status=pending | jq .
docs/GUARDIAN_PLAYBOOK.md:440:- Overall status: healthy/degraded/critical
docs/GUARDIAN_APPROVAL_SYSTEM.md:86:  "status": "recorded"
docs/AUTONOMOUS_HANDOVER.md:113:  "overall_status": "healthy|degraded|unhealthy|critical",
docs/AUTONOMOUS_HANDOVER.md:117:      "status": "healthy",
docs/AUTONOMOUS_HANDOVER.md:145:      "status": "healthy",
docs/AUTONOMOUS_HANDOVER.md:181:  "status": "approved|rejected|pending|override",
docs/AUTONOMOUS_HANDOVER.md:213:#### `GET /api/guardian/validation-history?status={status}&limit={limit}`
docs/AUTONOMOUS_HANDOVER.md:226:      "status": "active|inactive|error|degraded",
docs/QUANTUM_BLOG_SERIES.md:270:        "status": "healthy", 
docs/PI_NETWORK_DEPLOYMENT_GUIDE.md:131:  "status": "healthy",
docs/PI_NETWORK_DEPLOYMENT_GUIDE.md:353:WHERE status = 'failed' 
docs/execution/SELFHOSTED_RUNNER_LIVE_PASS_V2.md:66:visible_steps_executed == true  
docs/MAINNET_USER_GUIDE.md:110:  "status": "verified",
docs/MAINNET_USER_GUIDE.md:196:    "contract_code": "pragma solidity ^0.8.0; contract MyToken { ... }",
docs/autonomous/MAINNET_CUTOVER_COMMAND_HASH_V1.md:25:- command_executed == false
docs/autonomous/MAINNET_CUTOVER_COMMAND_HASH_V1.md:26:- cutover_executed == false
docs/autonomous/MAINNET_CUTOVER_COMMAND_HASH_V1.md:27:- deployment_executed == false
docs/autonomous/MAINNET_CUTOVER_COMMAND_HASH_V1.md:28:- broadcast_executed == false
docs/autonomous/MAINNET_CUTOVER_PARKED_NOTICE_V1.md:24:- mainnet_cutover_executed = false
docs/autonomous/MAINNET_CUTOVER_PARKED_NOTICE_V1.md:25:- deployment_executed = false
docs/autonomous/MAINNET_CUTOVER_PARKED_NOTICE_V1.md:26:- broadcast_executed = false
docs/autonomous/MAINNET_CUTOVER_PARKED_NOTICE_V1.md:27:- state_changing_transaction_executed = false
docs/autonomous/SUPERVISED_ACTIVATION_OPERATIONS_INDEX_V1.md:43:dry_run_1_status == dry_run_complete
docs/autonomous/SUPERVISED_ACTIVATION_REFUSAL_TESTS_V1.md:35:irreversible_network_action_executed == false
docs/autonomous/MAINNET_CUTOVER_FINAL_OPERATOR_APPROVAL_V1.md:34:- command_executed == false
docs/autonomous/MAINNET_CUTOVER_FINAL_OPERATOR_APPROVAL_V1.md:35:- cutover_executed == false
docs/autonomous/MAINNET_CUTOVER_FINAL_OPERATOR_APPROVAL_V1.md:36:- deployment_executed == false
docs/autonomous/MAINNET_CUTOVER_FINAL_OPERATOR_APPROVAL_V1.md:37:- broadcast_executed == false
docs/autonomous/SUPERVISED_ACTIVATION_READINESS_INDEX_V1.md:46:- irreversible network action executed: false
docs/autonomous/SUPERVISED_ACTIVATION_READINESS_INDEX_V1.md:79:irreversible_network_action_executed == false
docs/autonomous/SUPERVISED_ACTIVATION_DRY_RUN_EVIDENCE_SUMMARY_V1.md:33:dry_run_1_status == dry_run_complete
docs/autonomous/SUPERVISED_ACTIVATION_DRY_RUN_EVIDENCE_SUMMARY_V1.md:43:dry_run_2_status == dry_run_complete
docs/PRODUCTION_DEPLOYMENT.md:101:  "status": "healthy",
docs/API.md:65:  "status": "healthy",
docs/API.md:78:  "status": "healthy",
docs/API.md:202:  "system_status": "healthy",
docs/API.md:507:    "code": "ERROR_CODE",
docs/API.md:608:  "status": "healthy",
docs/VERIFICATION_GUIDE.md:292:- [ ] All transactions confirmed (status: success)
docs/GUARDIAN_QUICK_REFERENCE.md:16:curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision-history?requires_guardian=true&status=pending | jq .
docs/PI_NETWORK_INTEGRATION.md:157:  "status": "authenticated",
docs/PI_NETWORK_INTEGRATION.md:208:  "status": "pending",
docs/PI_NETWORK_INTEGRATION.md:259:    "status": "completed",
docs/PI_NETWORK_INTEGRATION.md:274:GET /api/pi-network/payments/user/{user_id}?status=completed&limit=50
docs/PI_NETWORK_INTEGRATION.md:294:    "status": "healthy",
docs/CANON_AUTO_MERGE_SETUP.md:151:status: draft
docs/ARCHITECTURE.md:97:  - Error code: `insufficient_balance`
receipts/press-agent/discord-only-proof-v1.json:3:  "status": "sealed",
receipts/press-agent/press-agent-credential-completion-boundary-v1.json:3:  "status": "SEALED_BOUNDARY",
receipts/rcpt-pre-cutover-review-window-v1.json:3:  "status": "active_review_window",
receipts/rcpt-pre-cutover-review-window-v1.json:9:  "mainnet_cutover_executed": false,
receipts/rcpt-pre-cutover-review-window-v1.json:10:  "deployment_executed": false,
receipts/rcpt-pre-cutover-review-window-v1.json:11:  "broadcast_executed": false,
receipts/rcpt-pre-cutover-review-window-v1.json:12:  "state_changing_transaction_executed": false,
receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json:3:  "status": "sealed",
receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json:15:  "mainnet_cutover_executed": false,
receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json:16:  "deployment_executed": false,
receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json:17:  "broadcast_executed": false,
receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json:18:  "state_changing_transaction_executed": false,
receipts/governance/pr-298-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
receipts/governance/pr-298-post-merge-governance-receipt-v1.json:13:  "execution_wrapper_status": "execution_command_failed_or_missing_receipt",
receipts/governance/pr-298-post-merge-governance-receipt-v1.json:15:  "execution_command_executed": true,
receipts/governance/pr-298-post-merge-governance-receipt-v1.json:16:  "execution_command_exit_code": 1,
receipts/governance/mainnet-execution-window-notice-v1.txt:30:deployment_executed=false
receipts/governance/mainnet-execution-window-notice-v1.txt:31:broadcast_executed=false
receipts/governance/mainnet-execution-window-notice-v1.txt:32:mainnet_cutover_executed=false
receipts/governance/mainnet-execution-window-notice-v1.txt:33:state_changing_transaction_executed=false
receipts/governance/pr-243-post-merge-governance-receipt-v1.json:3:  "status": "SEALED",
receipts/governance/pr-243-post-merge-governance-receipt-v1.json:8:  "mainnet_cutover_executed": false,
receipts/governance/pr-243-post-merge-governance-receipt-v1.json:9:  "deployment_executed": false,
receipts/governance/pr-243-post-merge-governance-receipt-v1.json:10:  "broadcast_executed": false,
receipts/governance/pr-243-post-merge-governance-receipt-v1.json:11:  "state_changing_transaction_executed": false,
receipts/governance/audit-hardening-readiness-v1.json:3:  "status": "sealed",
receipts/governance/audit-hardening-readiness-v1.json:7:  "mainnet_cutover_executed": false,
receipts/governance/audit-hardening-readiness-v1.json:8:  "deployment_executed": false,
receipts/governance/audit-hardening-readiness-v1.json:9:  "broadcast_executed": false,
receipts/governance/audit-hardening-readiness-v1.json:10:  "state_changing_transaction_executed": false,
receipts/governance/pr-188-autonomous-readiness-merge-boundary-v1.json:24:  "status": "sealed",
receipts/governance/pr-215-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/external-attestation-verifier-v1.json:4:  "status": "blocking_control_active",
receipts/governance/external-attestation-verifier-v1.json:25:    "cutover_executed": false,
receipts/governance/external-attestation-verifier-v1.json:26:    "deployment_executed": false,
receipts/governance/external-attestation-verifier-v1.json:27:    "broadcast_executed": false,
receipts/governance/external-attestation-verifier-v1.json:28:    "state_changing_transaction_executed": false
receipts/governance/apply-lone-steward-branch-protection-v1.json:3:  "status": "sealed",
receipts/governance/pr-251-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/pr-251-post-merge-governance-receipt-v1.json:14:  "mainnet_cutover_executed": false,
receipts/governance/pr-251-post-merge-governance-receipt-v1.json:15:  "deployment_executed": false,
receipts/governance/pr-251-post-merge-governance-receipt-v1.json:16:  "broadcast_executed": false,
receipts/governance/pr-251-post-merge-governance-receipt-v1.json:17:  "state_changing_transaction_executed": false,
receipts/governance/pr-249-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/pr-249-post-merge-governance-receipt-v1.json:8:  "mainnet_cutover_executed": false,
receipts/governance/pr-249-post-merge-governance-receipt-v1.json:9:  "deployment_executed": false,
receipts/governance/pr-249-post-merge-governance-receipt-v1.json:10:  "broadcast_executed": false,
receipts/governance/pr-249-post-merge-governance-receipt-v1.json:11:  "state_changing_transaction_executed": false,
receipts/governance/pr-218-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/mainnet-final-command-selection-v1.json:14:    "broadcast_executed": false,
receipts/governance/mainnet-final-command-selection-v1.json:15:    "deployment_executed": false,
receipts/governance/mainnet-final-command-selection-v1.json:17:    "mainnet_cutover_executed": false,
receipts/governance/mainnet-final-command-selection-v1.json:18:    "state_changing_transaction_executed": false
receipts/governance/mainnet-final-command-selection-v1.json:22:    "approval_status": "not_approved",
receipts/governance/mainnet-final-command-selection-v1.json:25:    "status": "SELECTED_NOT_APPROVED"
receipts/governance/mainnet-operator-approval-v1.json:26:    "broadcast_executed": false,
receipts/governance/mainnet-operator-approval-v1.json:27:    "deployment_executed": false,
receipts/governance/mainnet-operator-approval-v1.json:28:    "mainnet_cutover_executed": false,
receipts/governance/mainnet-operator-approval-v1.json:29:    "state_changing_transaction_executed": false
receipts/governance/pr-285-post-merge-governance-receipt-v1.json:15:    "mainnet_cutover_executed": false,
receipts/governance/pr-285-post-merge-governance-receipt-v1.json:16:    "deployment_executed": false,
receipts/governance/pr-285-post-merge-governance-receipt-v1.json:17:    "broadcast_executed": false,
receipts/governance/pr-285-post-merge-governance-receipt-v1.json:18:    "state_changing_transaction_executed": false,
receipts/governance/mainnet-activation-preflight-v1.json:14:    "broadcast_executed": false,
receipts/governance/mainnet-activation-preflight-v1.json:15:    "deployment_executed": false,
receipts/governance/mainnet-activation-preflight-v1.json:17:    "mainnet_cutover_executed": false,
receipts/governance/mainnet-activation-preflight-v1.json:18:    "state_changing_transaction_executed": false
receipts/governance/supervised-activation-dry-run-1-evidence-v1.json:3:  "status": "sealed",
receipts/governance/supervised-activation-dry-run-1-evidence-v1.json:8:  "activation_command_executed": true,
receipts/governance/supervised-activation-dry-run-1-evidence-v1.json:9:  "activation_status": "dry_run_complete",
receipts/governance/cross-platform-determinism-manifest-v1.json:8:    "cutover_executed": false,
receipts/governance/cross-platform-determinism-manifest-v1.json:9:    "deployment_executed": false,
receipts/governance/cross-platform-determinism-manifest-v1.json:10:    "broadcast_executed": false,
receipts/governance/cross-platform-determinism-manifest-v1.json:11:    "state_changing_transaction_executed": false
receipts/governance/pr-247-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/pr-247-post-merge-governance-receipt-v1.json:8:  "mainnet_cutover_executed": false,
receipts/governance/pr-247-post-merge-governance-receipt-v1.json:9:  "deployment_executed": false,
receipts/governance/pr-247-post-merge-governance-receipt-v1.json:10:  "broadcast_executed": false,
receipts/governance/pr-247-post-merge-governance-receipt-v1.json:11:  "state_changing_transaction_executed": false
receipts/governance/pr-207-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:3:  "status": "operator_approval_granted",
receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:15:  "mainnet_cutover_executed": false,
receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:16:  "deployment_executed": false,
receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:17:  "broadcast_executed": false,
receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:18:  "state_changing_transaction_executed": false,
receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:19:  "wallet_signing_executed": false,
receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:20:  "liquidity_action_executed": false,
receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:21:  "staking_action_executed": false,
receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json:22:  "relayer_action_executed": false,
receipts/governance/v2-operator-unpark-approval-candidate-v1.json:13:    "mainnet_cutover_executed": false,
receipts/governance/v2-operator-unpark-approval-candidate-v1.json:14:    "deployment_executed": false,
receipts/governance/v2-operator-unpark-approval-candidate-v1.json:15:    "broadcast_executed": false,
receipts/governance/v2-operator-unpark-approval-candidate-v1.json:16:    "state_changing_transaction_executed": false,
receipts/governance/v2-operator-unpark-approval-candidate-v1.json:18:    "unpark_executed": false,
receipts/governance/pr-228-post-merge-governance-receipt-v1.json:3:  "status": "SEALED",
receipts/governance/cross-platform-determinism-v1.json:13:    "cutover_executed": false,
receipts/governance/cross-platform-determinism-v1.json:14:    "deployment_executed": false,
receipts/governance/cross-platform-determinism-v1.json:15:    "broadcast_executed": false,
receipts/governance/cross-platform-determinism-v1.json:16:    "state_changing_transaction_executed": false
receipts/governance/cross-platform-determinism-v1.json:35:      "status": "declared_volatile_field_normalized",
receipts/governance/cross-platform-determinism-v1.json:42:      "status": "declared_volatile_field_normalized",
receipts/governance/v2-funder-outreach-manifest-v1.json:19:    "mainnet_cutover_executed": false,
receipts/governance/v2-funder-outreach-manifest-v1.json:20:    "deployment_executed": false,
receipts/governance/v2-funder-outreach-manifest-v1.json:21:    "broadcast_executed": false,
receipts/governance/v2-funder-outreach-manifest-v1.json:22:    "state_changing_transaction_executed": false,
receipts/governance/reviewer-attestation-intake-v1.json:4:  "status": "intake_boundary_sealed",
receipts/governance/reviewer-attestation-intake-v1.json:14:    "cutover_executed": false,
receipts/governance/reviewer-attestation-intake-v1.json:15:    "deployment_executed": false,
receipts/governance/reviewer-attestation-intake-v1.json:16:    "broadcast_executed": false,
receipts/governance/reviewer-attestation-intake-v1.json:17:    "state_changing_transaction_executed": false
receipts/governance/supervised-activation-dry-run-2-evidence-v1.json:3:  "status": "sealed",
receipts/governance/supervised-activation-dry-run-2-evidence-v1.json:9:  "activation_command_executed": true,
receipts/governance/supervised-activation-dry-run-2-evidence-v1.json:10:  "activation_status": "dry_run_complete",
receipts/governance/supervised-activation-dry-run-2-evidence-v1.json:14:  "irreversible_network_action_executed": false,
receipts/governance/pr-231-post-merge-governance-receipt-v1.json:3:  "status": "SEALED",
receipts/governance/pr-213-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
receipts/governance/pr-213-post-merge-governance-receipt-v1.json:27:    "irreversible_network_action_executed": false,
receipts/governance/current-governance-state-v1.json:10:    "broadcast_executed": false,
receipts/governance/current-governance-state-v1.json:11:    "deployment_executed": false,
receipts/governance/current-governance-state-v1.json:13:    "mainnet_cutover_executed": false,
receipts/governance/current-governance-state-v1.json:14:    "state_changing_transaction_executed": false
receipts/governance/mainnet-execution-result-v1.json:18:    "exit_code": 1,
receipts/governance/mainnet-execution-result-v1.json:19:    "result_status": "EXECUTION_COMMAND_FAILED",
receipts/governance/mainnet-execution-result-v1.json:23:    "broadcast_executed": false,
receipts/governance/mainnet-execution-result-v1.json:24:    "command_executed": true,
receipts/governance/mainnet-execution-result-v1.json:26:    "deployment_executed": false,
receipts/governance/mainnet-execution-result-v1.json:27:    "mainnet_cutover_executed": false,
receipts/governance/mainnet-execution-result-v1.json:28:    "state_changing_transaction_executed": false
receipts/governance/pr-226-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/v2-mainnet-cutover-execution-governance-wrapper-v1.json:3:  "status": "execution_command_failed_or_missing_receipt",
receipts/governance/v2-mainnet-cutover-execution-governance-wrapper-v1.json:10:  "execution_command_executed": true,
receipts/governance/v2-mainnet-cutover-execution-governance-wrapper-v1.json:11:  "execution_command_exit_code": 1,
receipts/governance/mainnet-execution-window-v1.json:23:    "broadcast_executed": false,
receipts/governance/mainnet-execution-window-v1.json:24:    "deployment_executed": false,
receipts/governance/mainnet-execution-window-v1.json:25:    "mainnet_cutover_executed": false,
receipts/governance/mainnet-execution-window-v1.json:26:    "state_changing_transaction_executed": false
receipts/governance/supervised-activation-v1-milestone-snapshot.json:3:  "status": "SEALED",
receipts/governance/supervised-activation-v1-milestone-snapshot.json:42:    "status": "non_blocking_for_supervised_activation_v1"
receipts/governance/v2-cutover-execution-command-hash-v1.json:3:  "status": "command_hash_sealed",
receipts/governance/v2-cutover-execution-command-hash-v1.json:13:  "execution_command_executed": false,
receipts/governance/v2-cutover-execution-command-hash-v1.json:14:  "mainnet_cutover_executed": false,
receipts/governance/v2-cutover-execution-command-hash-v1.json:15:  "deployment_executed": false,
receipts/governance/v2-cutover-execution-command-hash-v1.json:16:  "broadcast_executed": false,
receipts/governance/v2-cutover-execution-command-hash-v1.json:17:  "state_changing_transaction_executed": false,
receipts/governance/v2-cutover-execution-command-hash-v1.json:18:  "wallet_signing_executed": false,
receipts/governance/v2-cutover-execution-command-hash-v1.json:19:  "liquidity_action_executed": false,
receipts/governance/v2-cutover-execution-command-hash-v1.json:20:  "staking_action_executed": false,
receipts/governance/v2-cutover-execution-command-hash-v1.json:21:  "relayer_action_executed": false,
receipts/governance/lone-steward-governance-baseline-v1.json:3:  "status": "sealed",
receipts/governance/v2-funder-review-packet-v1.json:10:    "mainnet_cutover_executed": false,
receipts/governance/v2-funder-review-packet-v1.json:11:    "deployment_executed": false,
receipts/governance/v2-funder-review-packet-v1.json:12:    "broadcast_executed": false,
receipts/governance/v2-funder-review-packet-v1.json:13:    "state_changing_transaction_executed": false,
receipts/governance/pr-296-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
receipts/governance/pr-296-post-merge-governance-receipt-v1.json:16:  "execution_command_executed": false,
receipts/governance/pr-296-post-merge-governance-receipt-v1.json:17:  "mainnet_cutover_executed": false,
receipts/governance/pr-296-post-merge-governance-receipt-v1.json:18:  "deployment_executed": false,
receipts/governance/pr-296-post-merge-governance-receipt-v1.json:19:  "broadcast_executed": false,
receipts/governance/pr-296-post-merge-governance-receipt-v1.json:20:  "state_changing_transaction_executed": false,
receipts/governance/pr-296-post-merge-governance-receipt-v1.json:21:  "wallet_signing_executed": false,
receipts/governance/pr-296-post-merge-governance-receipt-v1.json:22:  "liquidity_action_executed": false,
receipts/governance/pr-296-post-merge-governance-receipt-v1.json:23:  "staking_action_executed": false,
receipts/governance/pr-296-post-merge-governance-receipt-v1.json:24:  "relayer_action_executed": false,
receipts/governance/open-verification-gate-v1-post-merge.json:15:    "broadcast_executed": false,
receipts/governance/open-verification-gate-v1-post-merge.json:16:    "deployment_executed": false,
receipts/governance/open-verification-gate-v1-post-merge.json:18:    "mainnet_cutover_executed": false,
receipts/governance/open-verification-gate-v1-post-merge.json:22:    "state_changing_transaction_executed": false
receipts/governance/mainnet-operator-approval-preparation-v1.json:5:    "status": "PREPARATION_ONLY"
receipts/governance/mainnet-operator-approval-preparation-v1.json:19:    "broadcast_executed": false,
receipts/governance/mainnet-operator-approval-preparation-v1.json:20:    "deployment_executed": false,
receipts/governance/mainnet-operator-approval-preparation-v1.json:22:    "mainnet_cutover_executed": false,
receipts/governance/mainnet-operator-approval-preparation-v1.json:23:    "state_changing_transaction_executed": false
receipts/governance/post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/pr-292-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
receipts/governance/pr-292-post-merge-governance-receipt-v1.json:10:  "mainnet_cutover_executed": false,
receipts/governance/pr-292-post-merge-governance-receipt-v1.json:11:  "deployment_executed": false,
receipts/governance/pr-292-post-merge-governance-receipt-v1.json:12:  "broadcast_executed": false,
receipts/governance/pr-292-post-merge-governance-receipt-v1.json:13:  "state_changing_transaction_executed": false,
receipts/governance/pr-253-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/pr-253-post-merge-governance-receipt-v1.json:15:  "mainnet_cutover_executed": false,
receipts/governance/pr-253-post-merge-governance-receipt-v1.json:16:  "deployment_executed": false,
receipts/governance/pr-253-post-merge-governance-receipt-v1.json:17:  "broadcast_executed": false,
receipts/governance/pr-253-post-merge-governance-receipt-v1.json:18:  "state_changing_transaction_executed": false,
receipts/governance/pr-222-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json:50:  "exit_criteria_status": {
receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json:60:    "cutover_executed": false,
receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json:61:    "deployment_executed": false,
receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json:62:    "broadcast_executed": false,
receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json:63:    "state_changing_transaction_executed": false
receipts/governance/supervised-activation-dry-run-3-evidence-v1.json:3:  "status": "sealed",
receipts/governance/supervised-activation-dry-run-3-evidence-v1.json:10:  "activation_status": "dry_run_complete",
receipts/governance/supervised-activation-dry-run-3-evidence-v1.json:14:  "irreversible_network_action_executed": false,
receipts/governance/pr-283-post-merge-governance-receipt-v1.json:15:    "mainnet_cutover_executed": false,
receipts/governance/pr-283-post-merge-governance-receipt-v1.json:16:    "deployment_executed": false,
receipts/governance/pr-283-post-merge-governance-receipt-v1.json:17:    "broadcast_executed": false,
receipts/governance/pr-283-post-merge-governance-receipt-v1.json:18:    "state_changing_transaction_executed": false,
receipts/governance/pr-186-selfhosted-merge-boundary-v1.json:3:  "status": "sealed_pre_merge_boundary",
receipts/governance/pr-256-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/pr-256-post-merge-governance-receipt-v1.json:16:  "mainnet_cutover_executed": false,
receipts/governance/pr-256-post-merge-governance-receipt-v1.json:17:  "deployment_executed": false,
receipts/governance/pr-256-post-merge-governance-receipt-v1.json:18:  "broadcast_executed": false,
receipts/governance/pr-256-post-merge-governance-receipt-v1.json:19:  "state_changing_transaction_executed": false,
receipts/governance/v2-public-funder-packet-index-v1.json:21:    "mainnet_cutover_executed": false,
receipts/governance/v2-public-funder-packet-index-v1.json:22:    "deployment_executed": false,
receipts/governance/v2-public-funder-packet-index-v1.json:23:    "broadcast_executed": false,
receipts/governance/v2-public-funder-packet-index-v1.json:24:    "state_changing_transaction_executed": false,
receipts/governance/pr-300-post-merge-governance-receipt-v1.json:14:  "wrapper_status": "failed_or_missing",
receipts/governance/pr-300-post-merge-governance-receipt-v1.json:15:  "exit_code": 1,
receipts/governance/pr-300-post-merge-governance-receipt-v1.json:19:  "deployment_executed": false,
receipts/governance/pr-300-post-merge-governance-receipt-v1.json:20:  "broadcast_executed": false,
receipts/governance/pr-300-post-merge-governance-receipt-v1.json:21:  "state_changing_transaction_executed": false,
receipts/governance/pr-291-post-merge-governance-receipt-v1.json:15:    "mainnet_cutover_executed": false,
receipts/governance/pr-291-post-merge-governance-receipt-v1.json:16:    "deployment_executed": false,
receipts/governance/pr-291-post-merge-governance-receipt-v1.json:17:    "broadcast_executed": false,
receipts/governance/pr-291-post-merge-governance-receipt-v1.json:18:    "state_changing_transaction_executed": false,
receipts/governance/pr-291-post-merge-governance-receipt-v1.json:20:    "unpark_executed": false,
receipts/governance/pr-205-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
receipts/governance/current-sovereign-state-v1.json:3:  "status": "sealed",
receipts/governance/pr-258-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
receipts/governance/pr-258-post-merge-governance-receipt-v1.json:9:  "mainnet_cutover_executed": false,
receipts/governance/pr-258-post-merge-governance-receipt-v1.json:10:  "deployment_executed": false,
receipts/governance/pr-258-post-merge-governance-receipt-v1.json:11:  "broadcast_executed": false,
receipts/governance/pr-258-post-merge-governance-receipt-v1.json:12:  "state_changing_transaction_executed": false,
receipts/governance/pr-209-211-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
receipts/governance/pr-209-211-post-merge-governance-receipt-v1.json:43:    "irreversible_network_action_executed": false,
receipts/governance/pr-209-211-post-merge-governance-receipt-v1.json:64:    "irreversible_network_action_executed": false,
receipts/governance/pr-260-post-merge-governance-receipt-v1.json:16:    "cutover_executed": false,
receipts/governance/pr-260-post-merge-governance-receipt-v1.json:17:    "deployment_executed": false,
receipts/governance/pr-260-post-merge-governance-receipt-v1.json:18:    "broadcast_executed": false,
receipts/governance/pr-260-post-merge-governance-receipt-v1.json:19:    "state_changing_transaction_executed": false
receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json:7:  "wrapper_status": "failed_or_missing",
receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json:8:  "exit_code": 1,
receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json:12:  "deployment_executed": false,
receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json:13:  "broadcast_executed": false,
receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json:14:  "state_changing_transaction_executed": false,
receipts/governance/pr-287-post-merge-governance-receipt-v1.json:15:    "mainnet_cutover_executed": false,
receipts/governance/pr-287-post-merge-governance-receipt-v1.json:16:    "deployment_executed": false,
receipts/governance/pr-287-post-merge-governance-receipt-v1.json:17:    "broadcast_executed": false,
receipts/governance/pr-287-post-merge-governance-receipt-v1.json:18:    "state_changing_transaction_executed": false,
receipts/governance/pr-294-post-merge-governance-receipt-v1.json:4:  "status": "sealed",
receipts/governance/pr-294-post-merge-governance-receipt-v1.json:13:  "mainnet_cutover_executed": false,
receipts/governance/pr-294-post-merge-governance-receipt-v1.json:14:  "deployment_executed": false,
receipts/governance/pr-294-post-merge-governance-receipt-v1.json:15:  "broadcast_executed": false,
receipts/governance/pr-294-post-merge-governance-receipt-v1.json:16:  "state_changing_transaction_executed": false,
receipts/governance/pr-294-post-merge-governance-receipt-v1.json:17:  "wallet_signing_executed": false,
receipts/governance/pr-294-post-merge-governance-receipt-v1.json:18:  "liquidity_action_executed": false,
receipts/governance/pr-294-post-merge-governance-receipt-v1.json:19:  "staking_action_executed": false,
receipts/governance/pr-294-post-merge-governance-receipt-v1.json:20:  "relayer_action_executed": false,
receipts/governance/open-verification-gate-v1.json:8:  "status": {
receipts/governance/open-verification-gate-v1.json:9:    "broadcast_executed": false,
receipts/governance/open-verification-gate-v1.json:10:    "deployment_executed": false,
receipts/governance/open-verification-gate-v1.json:12:    "mainnet_cutover_executed": false,
receipts/governance/open-verification-gate-v1.json:13:    "state_changing_transaction_executed": false
receipts/governance/pr-220-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/pr-220-post-merge-governance-receipt-v1.json:19:  "activation_status": "dry_run_complete",
receipts/governance/pr-220-post-merge-governance-receipt-v1.json:25:  "irreversible_network_action_executed": false,
receipts/governance/pr-224-post-merge-governance-receipt-v1.json:3:  "status": "sealed",
receipts/governance/pr-224-post-merge-governance-receipt-v1.json:18:  "activation_status": "dry_run_complete",
receipts/governance/pr-289-post-merge-governance-receipt-v1.json:15:    "mainnet_cutover_executed": false,
receipts/governance/pr-289-post-merge-governance-receipt-v1.json:16:    "deployment_executed": false,
receipts/governance/pr-289-post-merge-governance-receipt-v1.json:17:    "broadcast_executed": false,
receipts/governance/pr-289-post-merge-governance-receipt-v1.json:18:    "state_changing_transaction_executed": false,
receipts/governance/pr-289-post-merge-governance-receipt-v1.json:20:    "unpark_executed": false,
receipts/governance/v2-pre-unpark-readiness-gate-v1.json:13:    "mainnet_cutover_executed": false,
receipts/governance/v2-pre-unpark-readiness-gate-v1.json:14:    "deployment_executed": false,
receipts/governance/v2-pre-unpark-readiness-gate-v1.json:15:    "broadcast_executed": false,
receipts/governance/v2-pre-unpark-readiness-gate-v1.json:16:    "state_changing_transaction_executed": false,
receipts/governance/v2-pre-unpark-readiness-gate-v1.json:18:    "unpark_executed": false,
receipts/governance/mainnet-activation-command-hash-readiness-v1.json:17:    "status": "HASHED_FOR_READINESS_ONLY"
receipts/governance/mainnet-activation-command-hash-readiness-v1.json:21:    "broadcast_executed": false,
receipts/governance/mainnet-activation-command-hash-readiness-v1.json:22:    "deployment_executed": false,
receipts/governance/mainnet-activation-command-hash-readiness-v1.json:24:    "mainnet_cutover_executed": false,
receipts/governance/mainnet-activation-command-hash-readiness-v1.json:25:    "state_changing_transaction_executed": false
receipts/comms/press-agent-discord-parked-broadcast-v1.json:3:  "status": "sealed",
receipts/comms/press-agent-discord-parked-broadcast-v1.json:13:  "deployment_executed": false,
receipts/comms/press-agent-discord-parked-broadcast-v1.json:15:  "state_changing_transaction_executed": false,
receipts/execution/selfhosted-runner-live-pass-v2.json:3:  "status": "sealed",
receipts/execution/autonomous-execution-receipt-v1.json:3:  "status": "sealed",
receipts/execution/snapshot-ancestor-runner-context-v1.json:3:  "status": "sealed",
receipts/execution/selfhosted-forgejo-runner-pass-v1.json:3:  "status": "sealed",
receipts/execution/selfhosted-forgejo-runner-pass-v1.json:20:  "forgejo_proof_receipt_status": "completed",
receipts/execution/selfhosted-forgejo-runner-task-observation-v1.json:3:  "status": "observed_lifecycle_result_unproven",
receipts/execution/selfhosted-runner-live-attempt-v2.json:3:  "status": "prepared",
receipts/execution/external-runner-live-result-v1.json:3:  "status": "sealed",
receipts/execution/external-runner-live-log-v1.json:3:  "status": "live_log_absent",
receipts/execution/external-runner-live-log-v1.json:9:  "external_runner_proof_receipt_status": "prepared",
receipts/execution/external-runner-live-failure-v1.json:3:  "status": "sealed",
receipts/execution/external-runner-live-failure-v1.json:15:  "external_runner_executed": true,
receipts/execution/consolidated-execution-evidence-index-v1.json:3:  "status": "sealed",
receipts/execution/consolidated-execution-evidence-index-v1.json:10:      "status": "sealed",
receipts/execution/consolidated-execution-evidence-index-v1.json:16:      "status": "sealed",
receipts/execution/consolidated-execution-evidence-index-v1.json:22:      "status": "sealed",
receipts/execution/consolidated-execution-evidence-index-v1.json:28:      "status": "sealed",
receipts/execution/selfhosted-forgejo-runner-target-v1.json:3:  "status": "prepared",
receipts/execution/external-runner-fixed-run-observation-v1.json:3:  "status": "sealed",
receipts/execution/external-runner-3c32f91-inaccessible-v1.json:3:  "status": "sealed",
receipts/execution/external-runner-proof-v1.json:3:  "status": "prepared",
receipts/execution/external-runner-live-attempt-v1.json:3:  "status": "attempt_prepared",
receipts/autonomous/autonomous-public-health-surface-v1.json:36:    "may_publish_status": true,
receipts/autonomous/mainnet-cutover-secret-remediation-plan-v1.json:3:  "status": "SEALED_SECRET_REMEDIATION_PLAN",
receipts/autonomous/mainnet-cutover-secret-remediation-plan-v1.json:6:  "cutover_executed": false,
receipts/autonomous/mainnet-cutover-secret-remediation-plan-v1.json:7:  "deployment_executed": false,
receipts/autonomous/mainnet-cutover-secret-remediation-plan-v1.json:8:  "broadcast_executed": false,
receipts/autonomous/supervised-activation-runbook-v1.json:3:  "status": "sealed",
receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json:3:  "status": "SEALED_READONLY_LIVE_PROBE",
receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json:9:  "cutover_executed": false,
receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json:10:  "deployment_executed": false,
receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json:11:  "broadcast_executed": false,
receipts/autonomous/mainnet-cutover-readonly-live-probe-v1.json:32:    "readonly_live_probe_executed": true,
receipts/autonomous/dry-run-output-hygiene-v1.json:3:  "status": "sealed",
receipts/autonomous/mainnet-cutover-readiness-boundary-v1.json:3:  "status": "SEALED_BOUNDARY",
receipts/autonomous/mainnet-cutover-readiness-boundary-v1.json:7:  "cutover_executed": false,
receipts/autonomous/mainnet-cutover-readiness-boundary-v1.json:8:  "deployment_executed": false,
receipts/autonomous/mainnet-cutover-readiness-boundary-v1.json:9:  "broadcast_executed": false,
receipts/autonomous/autonomous-network-readiness-v1.json:20:  "status": "sealed"
receipts/autonomous/mainnet-cutover-secret-completion-gate-v1.json:3:  "status": "SEALED_SECRET_COMPLETION_BLOCKED",
receipts/autonomous/mainnet-cutover-secret-completion-gate-v1.json:6:  "cutover_executed": false,
receipts/autonomous/mainnet-cutover-secret-completion-gate-v1.json:7:  "deployment_executed": false,
receipts/autonomous/mainnet-cutover-secret-completion-gate-v1.json:8:  "broadcast_executed": false,
receipts/autonomous/supervised-autonomous-dry-run-v1.json:3:  "status": "sealed",
receipts/autonomous/supervised-autonomous-dry-run-script-v1.json:3:  "status": "sealed",
receipts/autonomous/supervised-activation-dry-run-evidence-summary-v1.json:3:  "status": "sealed",
receipts/autonomous/supervised-activation-dry-run-evidence-summary-v1.json:13:  "dry_run_1_status": "dry_run_complete",
receipts/autonomous/supervised-activation-dry-run-evidence-summary-v1.json:20:  "dry_run_2_status": "dry_run_complete",
receipts/autonomous/mainnet-cutover-command-hash-v1.json:3:  "status": "SEALED_COMMAND_HASH",
receipts/autonomous/mainnet-cutover-command-hash-v1.json:8:  "command_executed": false,
receipts/autonomous/mainnet-cutover-command-hash-v1.json:9:  "cutover_executed": false,
receipts/autonomous/mainnet-cutover-command-hash-v1.json:10:  "deployment_executed": false,
receipts/autonomous/mainnet-cutover-command-hash-v1.json:11:  "broadcast_executed": false,
receipts/autonomous/mainnet-cutover-command-hash-v1.json:28:    "command_executed": false,
receipts/autonomous/mainnet-cutover-preflight-boundary-v1.json:3:  "status": "SEALED_PREFLIGHT_BLOCKED",
receipts/autonomous/mainnet-cutover-preflight-boundary-v1.json:7:  "cutover_executed": false,
receipts/autonomous/mainnet-cutover-preflight-boundary-v1.json:8:  "deployment_executed": false,
receipts/autonomous/mainnet-cutover-preflight-boundary-v1.json:9:  "broadcast_executed": false,
receipts/autonomous/supervised-activation-readiness-index-v1.json:3:  "status": "prepared",
receipts/autonomous/supervised-activation-readiness-index-v1.json:24:    "irreversible_network_action_executed": false,
receipts/autonomous/supervised-activation-dry-run-4-evidence-v1.json:3:  "status": "SEALED",
receipts/autonomous/supervised-activation-dry-run-4-evidence-v1.json:14:    "status": "dry_run_complete"
receipts/autonomous/mainnet-cutover-rollback-plan-v1.json:3:  "status": "SEALED_ROLLBACK_PLAN",
receipts/autonomous/mainnet-cutover-rollback-plan-v1.json:6:  "cutover_executed": false,
receipts/autonomous/mainnet-cutover-rollback-plan-v1.json:7:  "deployment_executed": false,
receipts/autonomous/mainnet-cutover-rollback-plan-v1.json:8:  "broadcast_executed": false,
receipts/autonomous/network-activation-readiness-v2.json:4:  "status": "prepared",
receipts/autonomous/autonomous-agent-quarantine-manifest-v1.json:3:  "status": "sealed",
receipts/autonomous/mainnet-cutover-final-operator-approval-v1.json:3:  "status": "SEALED_APPROVAL_NOT_GRANTED",
receipts/autonomous/mainnet-cutover-final-operator-approval-v1.json:12:  "command_executed": false,
receipts/autonomous/mainnet-cutover-final-operator-approval-v1.json:13:  "cutover_executed": false,
receipts/autonomous/mainnet-cutover-final-operator-approval-v1.json:14:  "deployment_executed": false,
receipts/autonomous/mainnet-cutover-final-operator-approval-v1.json:15:  "broadcast_executed": false,
receipts/autonomous/supervised-activation-receipt-hash-semantics-v1.json:3:  "status": "sealed",
receipts/autonomous/mainnet-cutover-gate-definition-v1.json:3:  "status": "SEALED_GATE_DEFINITION",
receipts/autonomous/mainnet-cutover-gate-definition-v1.json:6:  "cutover_executed": false,
receipts/autonomous/mainnet-cutover-gate-definition-v1.json:7:  "deployment_executed": false,
receipts/autonomous/mainnet-cutover-gate-definition-v1.json:8:  "broadcast_executed": false,
receipts/autonomous/mainnet-cutover-operator-approval-gate-v1.json:3:  "status": "SEALED_OPERATOR_APPROVAL_GATE",
receipts/autonomous/mainnet-cutover-operator-approval-gate-v1.json:6:  "cutover_executed": false,
receipts/autonomous/mainnet-cutover-operator-approval-gate-v1.json:7:  "deployment_executed": false,
receipts/autonomous/mainnet-cutover-operator-approval-gate-v1.json:8:  "broadcast_executed": false,
receipts/autonomous/supervised-activation-operations-index-v1.json:3:  "status": "sealed",
receipts/autonomous/supervised-activation-operations-index-v1.json:12:  "dry_run_1_status": "dry_run_complete",
receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-45-51-662Z.json:3:  "status": "dry_run_complete",
receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-45-51-662Z.json:10:    "irreversible_network_action_executed": false,
receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-47-34-237Z.json:3:  "status": "dry_run_complete",
receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-47-34-237Z.json:10:    "irreversible_network_action_executed": false,
receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-47-23-615Z.json:3:  "status": "dry_run_complete",
receipts/autonomous/runs/supervised-activation-v1-2026-06-11T03-47-23-615Z.json:10:    "irreversible_network_action_executed": false,
receipts/autonomous/autonomous-runner-observation-v1.json:3:  "status": "observed",
receipts/autonomous/autonomous-worker-monitor-attempt-v1.json:4:  "status": "sealed",
scripts/verify-pr-298-execution-wrapper-failed-attempt-review-v1.cjs:21:if (!doc.includes("wrapper_status: failed_or_missing")) fail("missing failed_or_missing conclusion");
scripts/verify-pr-298-execution-wrapper-failed-attempt-review-v1.cjs:22:if (!doc.includes("exit_code: 1")) fail("missing exit_code conclusion");
scripts/verify-pr-213-post-merge-governance-receipt-v1.cjs:19:  ["status", receipt.status === "sealed"],
scripts/verify-pr-213-post-merge-governance-receipt-v1.cjs:30:  ["no irreversible action", receipt.verified_state && receipt.verified_state.irreversible_network_action_executed === false],
scripts/check-0g-compute-router.js:27:  console.log(`HTTP status: ${res.status}`);
scripts/query-0g-direct-provider.js:61:console.log(`HTTP status: ${res.status}`);
scripts/discover-0g-router.js:37:    const code = await provider.getCode(address);
scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:33:  irreversible_network_action_executed: false,
scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:55:  "activation_status == dry_run_complete",
scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:59:  "irreversible_network_action_executed == false",
scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:76:  status: "sealed",
scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:82:  activation_command_executed: true,
scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:83:  activation_status: "dry_run_complete",
scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs:87:  irreversible_network_action_executed: false,
scripts/autonomous-worker-monitor-attempt-v1.cjs:18:  status: "sealed",
scripts/verify-v2-read-only-status-dashboard-v1.cjs:23:const status = JSON.parse(fs.readFileSync(statusJsonPath, "utf8"));
scripts/verify-v2-mainnet-cutover-execution-v1.cjs:14:if (receipt.execution_command_exit_code === 0 && receipt.execution_receipt_exists !== true) fail("successful command must produce execution receipt");
scripts/verify-autonomous-network-activation-readiness-v2.cjs:19:  ["status", receipt.status === "prepared"],
scripts/verify-external-attestation-v1.cjs:67:  "state_changing_transaction_executed: false"
scripts/verify-external-attestation-v1.cjs:109:  const m = text.match(/Finding status:\s*(pass|fail|concern)/i);
scripts/verify-autonomous-agent-quarantine-manifest-v1.cjs:26:  status: "sealed",
scripts/write-0g-router-billing-report.cjs:37:        resolve({ json, stderr, exitCode: code });
scripts/write-0g-router-billing-report.cjs:62:  const status = routerChat.status || 'UNKNOWN';
scripts/verify-pre-cutover-review-window-v1.cjs:20:const status = fs.readFileSync(statusPath, "utf8");
scripts/safe-deploy.js:37:  if (!artifact.abi || !artifact.bytecode || artifact.bytecode === "0x") {
scripts/verify-supervised-autonomous-dry-run-script-v1.cjs:31:  status: "sealed",
scripts/verify-supervised-activation-runbook-v1.cjs:63:  status: "sealed",
scripts/deploy_0g_dex.py:154:    def deploy_contract(self, name: str, bytecode: str, abi: list, *args) -> Tuple[str, str]:
scripts/deploy_0g_dex.py:159:        Contract = self.w3.eth.contract(abi=abi, bytecode=bytecode)
scripts/deploy_0g_dex.py:211:                w0g_bytecode = artifact['bytecode']['object']
scripts/generate-determinism-manifest.cjs:152:    cutover_executed: false,
scripts/generate-determinism-manifest.cjs:153:    deployment_executed: false,
scripts/generate-determinism-manifest.cjs:154:    broadcast_executed: false,
scripts/generate-determinism-manifest.cjs:155:    state_changing_transaction_executed: false
scripts/verify-current-sovereign-state-v1.cjs:9:  status: "sealed",
scripts/health-0g-compute.cjs:20:  ROUTER_MODELS: { status: 'UNKNOWN', details: {} },
scripts/health-0g-compute.cjs:21:  ROUTER_CHAT: { status: 'UNKNOWN', details: {} },
scripts/health-0g-compute.cjs:22:  DIRECT_PROVIDER: { status: 'UNKNOWN', details: {} }
scripts/health-0g-compute.cjs:76:        status: 'FAIL',
scripts/health-0g-compute.cjs:97:          status: 'PASS',
scripts/health-0g-compute.cjs:106:          status: 'FAIL',
scripts/health-0g-compute.cjs:112:        status: 'FAIL',
scripts/health-0g-compute.cjs:118:      status: 'FAIL',
scripts/health-0g-compute.cjs:131:        status: 'FAIL',
scripts/health-0g-compute.cjs:162:          status: 'PASS',
scripts/health-0g-compute.cjs:171:          status: 'FAIL',
scripts/health-0g-compute.cjs:179:          status: 'WARN',
scripts/health-0g-compute.cjs:190:          status: 'WARN',
scripts/health-0g-compute.cjs:198:          status: 'FAIL',
scripts/health-0g-compute.cjs:207:          status: 'FAIL',
scripts/health-0g-compute.cjs:214:      status: 'FAIL',
scripts/health-0g-compute.cjs:229:        status: 'FAIL',
scripts/health-0g-compute.cjs:252:      if (code === 0) {
scripts/health-0g-compute.cjs:254:          status: 'PASS',
scripts/health-0g-compute.cjs:256:            exitCode: 0,
scripts/health-0g-compute.cjs:262:          status: 'FAIL',
scripts/health-0g-compute.cjs:264:            exitCode: code,
scripts/health-0g-compute.cjs:274:        status: 'FAIL',
scripts/verify-pr-209-211-post-merge-governance-receipt-v1.cjs:22:  ["status", receipt.status === "sealed"],
scripts/verify-pr-209-211-post-merge-governance-receipt-v1.cjs:37:  ["no irreversible action", receipt.verified_safety && receipt.verified_safety.irreversible_network_action_executed === false],
scripts/verify-pr-207-post-merge-governance-receipt-v1.cjs:19:  ["status", receipt.status === "sealed"],
scripts/verify-pr-251-post-merge-governance-receipt-v1.cjs:47:  "state_changing_transaction_executed = false"
scripts/verify-dry-run-output-hygiene-v1.cjs:37:  status: "sealed",
scripts/verify-selfhosted-runner-live-attempt-v2.cjs:22:assert(receipt.status === 'prepared', 'status must remain prepared before evidence capture');
scripts/verify-pr-222-post-merge-governance-receipt-v1.cjs:51:  status: "sealed",
scripts/check-0g-router-chat.cjs:74:        console.log(`  error.code: ${parsedResponse.error.code || 'N/A'}`);
scripts/local-ci-surrogate.sh:23:  nvm_source_status=$?
scripts/verify-pr-224-post-merge-governance-receipt-v1.cjs:28:  "activation_status == dry_run_complete",
scripts/verify-pr-224-post-merge-governance-receipt-v1.cjs:53:  status: "sealed",
scripts/verify-pr-224-post-merge-governance-receipt-v1.cjs:68:  activation_status: "dry_run_complete",
scripts/generate-grant-evidence.cjs:27:      exit_code: result.status,
scripts/generate-grant-evidence.cjs:37:      exit_code: null,
scripts/generate-grant-evidence.cjs:71:    `**Exit code:** \`${result.exit_code}\`  `,
scripts/generate-grant-evidence.cjs:171:      exit_code: null,
scripts/verify-autonomous-public-health-surface-v1.cjs:3:const status = JSON.parse(fs.readFileSync("public/status/autonomous-health.json", "utf8"));
scripts/verify-cross-platform-determinism-v1.cjs:141:const status = git("git status --short");
scripts/verify-supervised-activation-dry-run-evidence-summary-v1.cjs:54:  status: "sealed",
scripts/verify-supervised-activation-dry-run-evidence-summary-v1.cjs:57:  dry_run_1_status: "dry_run_complete",
scripts/verify-supervised-activation-dry-run-evidence-summary-v1.cjs:63:  dry_run_2_status: "dry_run_complete",
scripts/verify-selfhosted-runner-live-pass-v2.cjs:19:assert(receipt.status === 'sealed', 'status must be sealed');
scripts/verify-pr-253-post-merge-governance-receipt-v1.cjs:48:  "state_changing_transaction_executed = false"
scripts/verify-supervised-activation-runtime-hygiene-v1.cjs:26:  ["script still refuses irreversible action", script.includes("irreversible_network_action_executed: false")],
scripts/verify-external-runner-live-failure.cjs:6:for (const phrase of ["supersedes the prior `ABSENT` classification", "external_runner_executed == true", "external_runner_pass == false", "canonicalCommit is not an ancestor of HEAD"]) { if (!doc.includes(phrase)) { console.error(`FAIL: doc missing ${phrase}`); process.exit(1); } }
scripts/verify-external-runner-live-failure.cjs:7:for (const phrase of ["status: FAILURE", "job_id: 6249479", "This supersedes the earlier ABSENT classification."]) { if (!log.includes(phrase)) { console.error(`FAIL: log missing ${phrase}`); process.exit(1); } }
scripts/verify-external-runner-live-failure.cjs:8:const required = {schema:"qpf.external_runner_live_failure.v1", previous_result:"ABSENT", corrected_result:"FAILURE", job_id:"6249479", external_runner_executed:true, external_runner_pass:false, false_pass_claimed:false, truth_boundary:"local_verifier_pass != external_runner_pass"};
scripts/verify-supervised-activation-receipt-hash-semantics-v1.cjs:54:  status: "sealed",
scripts/verify-discord-only-proof-v1.cjs:9:  status: "sealed",
scripts/verify-supervised-autonomous-activation-command-v1.cjs:32:  "irreversible_network_action_executed: false",
scripts/verify-pr-300-post-merge-governance-receipt-v1.cjs:25:if (!postDocRaw.includes("wrapper_status: failed_or_missing")) fail("missing wrapper_status evidence");
scripts/verify-pr-300-post-merge-governance-receipt-v1.cjs:26:if (!postDocRaw.includes("exit_code: 1")) fail("missing exit_code evidence");
scripts/verify-pr-251-hosted-ci-failure-opacity-boundary-v1.cjs:45:  "state_changing_transaction_executed = false"
scripts/verify-supervised-activation-dry-run-3-evidence-v1.cjs:27:  "activation_status == dry_run_complete",
scripts/verify-supervised-activation-dry-run-3-evidence-v1.cjs:31:  "irreversible_network_action_executed == false",
scripts/verify-supervised-activation-dry-run-3-evidence-v1.cjs:49:  status: "sealed",
scripts/verify-supervised-activation-dry-run-3-evidence-v1.cjs:56:  activation_status: "dry_run_complete",
scripts/verify-supervised-activation-dry-run-3-evidence-v1.cjs:60:  irreversible_network_action_executed: false,
scripts/verify-pr-220-post-merge-governance-receipt-v1.cjs:27:  "activation_status == dry_run_complete",
scripts/verify-pr-220-post-merge-governance-receipt-v1.cjs:33:  "irreversible_network_action_executed == false",
scripts/verify-pr-220-post-merge-governance-receipt-v1.cjs:47:  status: "sealed",
scripts/verify-pr-220-post-merge-governance-receipt-v1.cjs:63:  activation_status: "dry_run_complete",
scripts/verify-pr-220-post-merge-governance-receipt-v1.cjs:69:  irreversible_network_action_executed: false,
scripts/verify-public-status-v1.cjs:12:const status = fs.readFileSync("STATUS.md", "utf8");
scripts/verify-public-status-v1.cjs:20:  "mainnet_cutover_executed = false",
scripts/verify-public-status-v1.cjs:21:  "deployment_executed = false",
scripts/verify-public-status-v1.cjs:22:  "broadcast_executed = false",
scripts/verify-public-status-v1.cjs:23:  "state_changing_transaction_executed = false",
scripts/supervised-autonomous-activation-v1.cjs:18:  status: "dry_run_complete",
scripts/supervised-autonomous-activation-v1.cjs:25:    irreversible_network_action_executed: false,
scripts/supervised-autonomous-activation-v1.cjs:39:  receipt.status = "refused_live_mode";
scripts/supervised-autonomous-activation-v1.cjs:44:  receipt.status = "refused_private_key_context";
scripts/verification/universal/verify-erc20.sh:125:    local contract_code=$(cast code "$TOKEN_ADDRESS" --rpc-url "$RPC_URL" 2>/dev/null)
scripts/verification/universal/verify-erc20.sh:127:    if [[ "$contract_code" == *"42966c68"* ]]; then
scripts/verification/universal/verify-erc20.sh:136:    if [[ "$contract_code" == *"40c10f19"* ]]; then
scripts/verification/universal/verify-erc20.sh:196:  "verification_status": "passed",
scripts/verification/lib/assertions.sh:139:    local code=$(cast code "$addr" --rpc-url "$rpc" 2>/dev/null)
scripts/verification/lib/assertions.sh:141:    if [ -z "$code" ] || [ "$code" == "0x" ]; then
scripts/verification/lib/validators.sh:23:    local code=$(cast code "$addr" --rpc-url "$rpc" 2>/dev/null)
scripts/verification/lib/validators.sh:25:    if [ -z "$code" ] || [ "$code" == "0x" ]; then
scripts/verification/pi-network/verify-catalyst.sh:205:  "verification_status": "passed",
scripts/verification/zero-g/verify-uniswap.sh:283:  "verification_status": "passed",
scripts/preflight-0g-deploy.js:23:  if (!artifact.abi || !artifact.bytecode || artifact.bytecode === "0x") {
scripts/supervised-autonomous-dry-run-v1.cjs:20:const status = git(["status", "--short"]);
scripts/supervised-autonomous-dry-run-v1.cjs:42:  status: "completed",
scripts/verify-pr-218-post-merge-governance-receipt-v1.cjs:41:  status: "sealed",
scripts/verify_0g_dex.py:127:            code = self.w3.eth.get_code(address)
scripts/verify_0g_dex.py:128:            if code == b'' or code == '0x':
scripts/verify_0g_dex.py:326:                status = "✅ PASS" if result['passed'] else "❌ FAIL"
scripts/verify-reviewer-attestation-intake-v1.cjs:88:for (const field of ["OS:", "Architecture:", "Node version:", "npm version:", "Commit tested:", "Commands run:", "Verifier output:", "Manifest SHA256:", "File count:", "Finding status:", "Notes:"]) {
scripts/verify-reviewer-attestation-intake-v1.cjs:135:  "state_changing_transaction_executed: false",
scripts/monitor.ps1:56:            $status = "HEALTHY"
scripts/monitor.ps1:60:                Write-Host "   Expected status: $($endpoint.ExpectedStatus), Got: $($response.StatusCode)"
scripts/monitor.ps1:65:            $status = "WARNING"
scripts/monitor.ps1:76:        $status = "FAILED"
scripts/guardians.ps1:94:                $status = Invoke-WebRequest "http://localhost:8080/sentinel/status" -UseBasicParsing -TimeoutSec 5
scripts/verify-pr-256-post-merge-governance-receipt-v1.cjs:19:const status = fs.readFileSync("STATUS.md", "utf8");
scripts/verify-pr-256-post-merge-governance-receipt-v1.cjs:50:  "deployment_executed = false",
scripts/verify-pr-256-post-merge-governance-receipt-v1.cjs:51:  "state_changing_transaction_executed = false",
scripts/verify-pr-186-selfhosted-merge-boundary.cjs:7:  status: "sealed_pre_merge_boundary",
scripts/verify-pr-205-post-merge-governance-receipt-v1.cjs:19:  ["status sealed", receipt.status === "sealed"],
scripts/verify-supervised-activation-readiness-index-v1.cjs:37:  ["status", receipt.status === "prepared"],
scripts/verify-supervised-activation-readiness-index-v1.cjs:44:  ["no irreversible", receipt.safety_state && receipt.safety_state.irreversible_network_action_executed === false],
scripts/verify-autonomous-runner-observation-v1.cjs:11:assert(receipt.status === "observed", "status must be observed");
scripts/verify-pr-226-post-merge-governance-receipt-v1.cjs:53:  status: "sealed",
scripts/verify-consolidated-execution-evidence-index.cjs:41:  if (!receipt.receipt_chain.some((entry) => entry.pr === pr && entry.status === "sealed")) {
scripts/verify-supervised-activation-dry-run-1-evidence-v1.cjs:37:  "activation_status == dry_run_complete",
scripts/verify-supervised-activation-dry-run-1-evidence-v1.cjs:54:  status: "sealed",
scripts/verify-supervised-activation-dry-run-1-evidence-v1.cjs:59:  activation_command_executed: true,
scripts/verify-supervised-activation-dry-run-1-evidence-v1.cjs:60:  activation_status: "dry_run_complete",
scripts/query-0g-compute-model.js:61:  console.log(`HTTP status: ${res.status}`);
scripts/verify-pr-215-post-merge-governance-receipt-v1.cjs:46:  status: "sealed",
scripts/hud.py:92:        return jsonify({"status": "offline"}), 500
scripts/verify-audit-hardening-readiness-v1.cjs:69:  "state_changing_transaction_executed = false"
scripts/generate-external-runner-live-failure.cjs:7:"status: FAILURE",
scripts/generate-external-runner-live-failure.cjs:69:"external_runner_executed == true",
scripts/generate-external-runner-live-failure.cjs:86:const receipt = {schema:"qpf.external_runner_live_failure.v1",status:"sealed",supersedes:"receipts/execution/external-runner-live-result-v1.json",previous_result:"ABSENT",corrected_result:"FAILURE",runner_target:"Codeberg Forgejo Actions",workflow:"local-proof.yml",job_id:"6249479",runner_host:"actions-tiny.aburayama.m.codeberg.org",runner_version:"v12.10.1",container_image:"ghcr.io/catthehacker/ubuntu:act-latest",node:"v22.22.3",npm:"10.9.8",external_runner_executed:true,external_runner_pass:false,failure_stage:"snapshot_verification",failure_reason:"canonicalCommit is not an ancestor of HEAD",log_path:"logs/external-runner/codeberg-live-failure-6249479-20260610.txt",truth_boundary:"local_verifier_pass != external_runner_pass",false_pass_claimed:false,next_repair_boundary:"Forgejo/Codeberg PR checkout ancestry handling"};
scripts/generate-external-runner-live-failure.cjs:94:"for (const phrase of [\"supersedes the prior `ABSENT` classification\", \"external_runner_executed == true\", \"external_runner_pass == false\", \"canonicalCommit is not an ancestor of HEAD\"]) { if (!doc.includes(phrase)) { console.error(`FAIL: doc missing ${phrase}`); process.exit(1); } }",
scripts/generate-external-runner-live-failure.cjs:95:"for (const phrase of [\"status: FAILURE\", \"job_id: 6249479\", \"This supersedes the earlier ABSENT classification.\"]) { if (!log.includes(phrase)) { console.error(`FAIL: log missing ${phrase}`); process.exit(1); } }",
scripts/generate-external-runner-live-failure.cjs:96:"const required = {schema:\"qpf.external_runner_live_failure.v1\", previous_result:\"ABSENT\", corrected_result:\"FAILURE\", job_id:\"6249479\", external_runner_executed:true, external_runner_pass:false, false_pass_claimed:false, truth_boundary:\"local_verifier_pass != external_runner_pass\"};",
scripts/verify-supervised-autonomous-dry-run-v1.cjs:28:  status: "sealed",
scripts/seed_first_six_models.py:262:        #     "success": receipt.status == 1,
scripts/seed_first_six_models.py:368:                "status": "success",
scripts/seed_first_six_models.py:392:                "status": "failed",
scripts/verify-supervised-activation-operations-index-v1.cjs:25:  "dry_run_1_status == dry_run_complete",
scripts/verify-supervised-activation-operations-index-v1.cjs:43:  status: "sealed",
scripts/verify-supervised-activation-operations-index-v1.cjs:51:  dry_run_1_status: "dry_run_complete",
runtime/static-site-verification-v1/config-inspection.json:119:    "governance:public-status:v1:check": "node scripts/verify-public-status-v1.cjs",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-49-18-148Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-49-18-148Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-05-47-677Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-05-47-677Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-14-51-930Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-14-51-930Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-41-894Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-41-894Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-05-12-247Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-05-12-247Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-46-00-611Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-46-00-611Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-01-544Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-01-544Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-15-689Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-15-689Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-22-917Z.json:3:  "status": "dry_run_complete",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-22-917Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-56-03-907Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-56-03-907Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-49-120Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-49-120Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-19-24-676Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-19-24-676Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-28-27-869Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-28-27-869Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-56-18-972Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-56-18-972Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-30-980Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-30-980Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-30-530Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-30-530Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-25-38-379Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-25-38-379Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-43-28-555Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-43-28-555Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-54-03-230Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-54-03-230Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-41-912Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-41-912Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-05-47-762Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-05-47-762Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-04-56-472Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-04-56-472Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-43-28-621Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-43-28-621Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-28-28-065Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-28-28-065Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-44-736Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-44-736Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-54-822Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-54-822Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-00-05-393Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-00-05-393Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-54-03-302Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-54-03-302Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-44-04-270Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-44-04-270Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-52-280Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-52-280Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-48-06-418Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-48-06-418Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-33-54-297Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-33-54-297Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-19-24-280Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-19-24-280Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-57-48-628Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-57-48-628Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-25-38-267Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-25-38-267Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-49-18-056Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-49-18-056Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-02-18-846Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-02-18-846Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-03-39-559Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-03-39-559Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-00-05-260Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-00-05-260Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-06-13-567Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-06-13-567Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-31-15-717Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-31-15-717Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-46-859Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-46-859Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-10-612Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-10-612Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-46-00-460Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-46-00-460Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-38-902Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-38-902Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-08-724Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-08-724Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-09-21-455Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-09-21-455Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-19-222Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-19-222Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-59-905Z.json:3:  "status": "dry_run_complete",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-59-905Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-31-46-482Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-31-46-482Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-31-46-350Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-31-46-350Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-55-21-706Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-55-21-706Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-02-18-490Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-02-18-490Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-56-19-068Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-56-19-068Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-09-21-348Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-09-21-348Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-30-748Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-30-748Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-13-606Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-13-606Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-52-18-717Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-52-18-717Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-41-812Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-59-41-812Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-50-36-730Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-50-36-730Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-15-865Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-15-865Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-13-685Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-13-685Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-13-03-726Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-13-03-726Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-10-526Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-10-526Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-17-271Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-17-271Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-33-54-433Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-33-54-433Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-27-423Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-27-423Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-55-05-892Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-55-05-892Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-52-18-591Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-52-18-591Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-42-000Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-42-000Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-41-56-243Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-41-56-243Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-08-864Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-01-08-864Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-27-335Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-27-335Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-55-21-565Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-55-21-565Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-19-380Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-19-380Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-30-463Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-30-463Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-51-26-907Z.json:3:  "status": "dry_run_complete",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-51-26-907Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-56-03-976Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-56-03-976Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-48-06-336Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-48-06-336Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-13-03-797Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-13-03-797Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-14-10-215Z.json:3:  "status": "dry_run_complete",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T07-14-10-215Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-53-52-828Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-53-52-828Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-31-15-517Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-31-15-517Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-28-27-987Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-28-27-987Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-04-56-387Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-04-56-387Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-03-39-473Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-03-39-473Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-41-977Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-41-977Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-01-425Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-55-01-425Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-30-32-307Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-30-32-307Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-57-48-703Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-57-48-703Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-50-36-532Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-50-36-532Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-05-12-156Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-05-12-156Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-46-991Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-31-46-991Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-12-34-604Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-12-34-604Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-42-045Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-36-42-045Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-21-51-875Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-21-51-875Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-21-52-242Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T04-21-52-242Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-44-04-190Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-44-04-190Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-55-05-819Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-55-05-819Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-53-52-721Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-53-52-721Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-52-30-498Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-52-30-498Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-59-08-567Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-59-08-567Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-38-990Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-38-990Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/mainnet-cutover-readonly-live-probe-v1-20260611T093347Z.json:3:  "status": "READONLY_PROBE_COMPLETE",
runtime/autonomous/runs/mainnet-cutover-readonly-live-probe-v1-20260611T093347Z.json:6:  "cutover_executed": false,
runtime/autonomous/runs/mainnet-cutover-readonly-live-probe-v1-20260611T093347Z.json:7:  "deployment_executed": false,
runtime/autonomous/runs/mainnet-cutover-readonly-live-probe-v1-20260611T093347Z.json:8:  "broadcast_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-12-34-480Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-12-34-480Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-54-697Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-54-697Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-49-12-940Z.json:3:  "status": "dry_run_complete",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-49-12-940Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-39-49-865Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-39-49-865Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-39-49-944Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-39-49-944Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-28-27-807Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-28-27-807Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-41-56-316Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-41-56-316Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-52-353Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-24-52-353Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-30-32-238Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-30-32-238Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-59-08-636Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-59-08-636Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-52-30-604Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-52-30-604Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-49-210Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T03-56-49-210Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-14-51-778Z.json:3:  "status": "refused_live_mode",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-14-51-778Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-06-13-699Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-06-13-699Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-44-876Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-44-44-876Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-17-406Z.json:3:  "status": "refused_private_key_context",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-17-406Z.json:10:    "irreversible_network_action_executed": false,
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-12-949Z.json:3:  "status": "dry_run_complete",
runtime/autonomous/runs/supervised-activation-v1-2026-06-11T06-26-12-949Z.json:10:    "irreversible_network_action_executed": false,
package.json:98:    "governance:public-status:v1:check": "node scripts/verify-public-status-v1.cjs",
```

## Stash inventory at corrective lane creation

```text
stash@{0}: On main: temp stash of cross verifier patch for clean tree in failed-attempt review lane
stash@{1}: On main: temporary stash of workspace verifier patches and runtime evidence for clean execution tree
stash@{2}: On docs/claim-posture-cleanup: park stewardship continuity draft files
```
