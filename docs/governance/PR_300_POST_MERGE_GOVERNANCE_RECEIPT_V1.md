# PR #300 Post-Merge Governance Receipt v1

This receipt seals the normal merge of PR #300, which recorded the read-only failed-attempt review for PR #298.

No stash was applied.
No execution wrapper was run.
No deployment, broadcast, or state-changing transaction was executed.

## Canonical main after PR #300 merge

- HEAD: d81c94f935c8a269759c0f84232f702c9d78cc73
- Subject: Seal PR 298 execution wrapper failed-attempt review v1 (#300)

## PR #300 merge details

- PR: #300
- Title: Seal PR 298 execution wrapper failed-attempt review v1
- State: MERGED
- Merged at: 2026-06-12T06:51:34Z
- URL: https://github.com/onenoly1010/Quantum-pi-forge/pull/300
- Base: main
- Head: governance/pr-298-execution-wrapper-failed-attempt-review-v1
- Merge commit: d81c94f935c8a269759c0f84232f702c9d78cc73

## Sealed review carried by PR #300

- review_schema: qpf.governance.pr-298-execution-wrapper-failed-attempt-review.v1
- review_posture: failed_attempt_review_only
- pr_under_review: 298
- post_merge_receipt_pr: 299
- wrapper_status: failed_or_missing
- exit_code: 1
- successful_exit_artifact_present: false
- stash_applied: false
- wrapper_executed_during_review: false
- deployment_executed: false
- broadcast_executed: false
- state_changing_transaction_executed: false

## Verification command present

```text
governance:pr-298-execution-wrapper-failed-attempt-review:v1:check=node scripts/verify-pr-298-execution-wrapper-failed-attempt-review-v1.cjs
```

## Stash inventory remained untouched during this receipt lane

```text
stash@{0}: On main: temp stash of cross verifier patch for clean tree in failed-attempt review lane
stash@{1}: On main: temporary stash of workspace verifier patches and runtime evidence for clean execution tree
stash@{2}: On docs/claim-posture-cleanup: park stewardship continuity draft files
```

## Status / exit-code fields observed on canonical tree

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
