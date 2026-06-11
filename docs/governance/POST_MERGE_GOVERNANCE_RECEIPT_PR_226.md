# Post-Merge Governance Receipt - PR #226

## Status

Sealed post-merge governance receipt.

## Subject

PR #226: Define supervised activation receipt hash semantics v1

## Mainline Baseline

main == origin/main == 8e66ada

## Merge Posture

PR #226 was merged normally by squash merge.

github_hosted_bypass_used == false
branch_protection_respected == true
branch_deleted_after_merge == true
main_fast_forwarded == true

## Landed Scope

receipt_hash_semantics_v1_on_main == true
disk_sha256_is_governed_artifact_hash == true
receipt_sha256_is_legacy_internal_field == true
receipt_sha256_is_not_assumed_to_equal_disk_sha256 == true
payload_sha256_reserved_for_future_runtime_semantics == true
false_hash_equivalence_claim_forbidden == true
hash_mismatch_disclosure_required == true

## Dry-Run Evidence Boundary

dry_run_1_hash_distinction_preserved == true
dry_run_2_hash_distinction_preserved == true
dry_run_3_hash_distinction_preserved == true
dry_run_1_2_3_evidence_on_main == true

## Safety Boundary

no_new_autonomous_capability == true
activation_mode_remains_dry_run_only == true
operator_intent_required == true
operator_supervision_required == true
live_execution_authorized == false
wallet_mutation_authorized == false
network_mutation_authorized == false
private_key_access_authorized == false
irreversible_network_action_authorized == false
full_autonomy_claimed == false
authority_expanded == false

## Verification Chain

autonomous:supervised-activation-receipt-hash-semantics:v1:check == PASS
governance:pr-224-post-merge:v1:check == PASS
governance:supervised-activation-dry-run-3-evidence:v1:check == PASS
governance:pr-222-post-merge:v1:check == PASS
autonomous:supervised-activation-dry-run-evidence-summary:v1:check == PASS
governance:pr-220-post-merge:v1:check == PASS
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

PR #226 is sealed as governed mainline evidence.

The supervised activation system remains dry-run-only, non-mutating, and human-supervised.
