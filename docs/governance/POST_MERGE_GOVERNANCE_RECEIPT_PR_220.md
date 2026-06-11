# Post-Merge Governance Receipt - PR #220

## Status

Sealed post-merge governance receipt.

## Subject

PR #220: Seal supervised activation dry-run 2 evidence v1

## Mainline Baseline

main == origin/main == fd42e12

## Merge Posture

PR #220 was merged normally by squash merge.

github_hosted_bypass_used == false
branch_protection_respected == true
branch_deleted_after_merge == true
main_fast_forwarded == true

## Landed Scope

supervised_activation_dry_run_2_evidence_on_main == true
runtime_receipt_disk_sha_governed == true
internal_receipt_sha_recorded == true
runtime_receipt_committed == false
runtime_receipt_git_ignored == true

## Dry-Run #2 Evidence

runtime_receipt_path == runtime/autonomous/runs/supervised-activation-v1-2026-06-11T05-57-22-917Z.json
runtime_receipt_disk_sha256 == fde9cd7f7029c844fc1f8ffe308ace886500d305159b2e57502e7053a521b477
runtime_receipt_internal_sha256 == 4b285fc472355896c3b356d0ddc59ec666c3d74bcc22ce2437b8d13f93b4c863
activation_status == dry_run_complete

## Safety Boundary

no_new_autonomous_capability == true
live_execution_authorized == false
wallet_mutation_authorized == false
network_mutation_authorized == false
private_key_accessed == false
irreversible_network_action_executed == false
full_autonomy_claimed == false
authority_expanded == false

## Verification Chain

governance:supervised-activation-dry-run-2-evidence:v1:check == PASS
governance:pr-218-post-merge:v1:check == PASS
autonomous:supervised-activation-operations-index:v1:check == PASS
governance:supervised-activation-dry-run-1-evidence:v1:check == PASS
governance:pr-215-post-merge:v1:check == PASS
autonomous:supervised-activation-runbook:v1:check == PASS
autonomous:supervised-activation-readiness-index:v1:check == PASS
autonomous:supervised-activation-refusal-tests:v1:check == PASS
autonomous:supervised-activation-runtime-hygiene:v1:check == PASS
autonomous:supervised-activation:v1:check == PASS
autonomous:network-activation-readiness:v2:check == PASS
build == PASS

## Conclusion

PR #220 is sealed as governed mainline evidence.

The supervised activation system remains dry-run-only and human-supervised.
