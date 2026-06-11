# Supervised Activation Dry-Run #1 Evidence v1

## Status

Sealed governed evidence receipt.

## Baseline

main == origin/main == be89e4c
runtime_receipt_path == runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-34-59-905Z.json
runtime_receipt_sha256 == 3563ac7996b1f92479b7d95bfce3bad68632273a3bb1b65e1cc8d8277afd0941
runtime_receipt_git_ignored == true

## Result

activation_command_executed == true
activation_status == dry_run_complete
activation_mode == dry-run-only
operator_intent_required == true
operator_supervision_required == true

## Safety

live_execution_performed == false
wallet_mutation_performed == false
network_mutation_performed == false
unsupervised_execution_performed == false
persistent_state_mutation_performed == false

## Evidence Policy

does_not_commit_runtime_receipt == true
does_not_expand_activation_authority == true
does_not_claim_live_execution == true

## Verification

governance:pr-215-post-merge:v1:check == PASS
autonomous:supervised-activation-runbook:v1:check == PASS
autonomous:supervised-activation-readiness-index:v1:check == PASS
autonomous:supervised-activation-refusal-tests:v1:check == PASS
autonomous:supervised-activation-runtime-hygiene:v1:check == PASS
autonomous:supervised-activation:v1:check == PASS
autonomous:network-activation-readiness:v2:check == PASS
governance:pr-213-post-merge:v1:check == PASS
governance:pr-209-211-post-merge:v1:check == PASS
governance:pr-207-post-merge:v1:check == PASS
governance:pr-205-post-merge:v1:check == PASS
build == PASS

## Conclusion

Supervised activation dry-run #1 completed successfully under the v1 runbook.

The raw runtime receipt remains ignored under runtime/autonomous/runs/.
