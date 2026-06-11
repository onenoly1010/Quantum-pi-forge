# Supervised Activation Receipt Hash Semantics v1

## Status

Sealed semantics definition.

## Mainline Baseline

main == origin/main == 10fce10

## Purpose

This document defines how supervised activation receipt hashes are interpreted.

The dry-run campaign exposed a recurring distinction between the byte hash of the final runtime receipt file and the internal `receipt_sha256` field emitted by the runtime command.

This is not treated as failure.

It is treated as a semantics boundary that must be explicit before further dry-run campaigns or readiness advancement.

## Canonical Terms

### disk_sha256

`disk_sha256` means the SHA-256 hash of the final runtime receipt file bytes exactly as written to disk.

This is the governed artifact hash for evidence receipts.

disk_sha256_is_governed_artifact_hash == true

### receipt_sha256

`receipt_sha256` is the legacy/internal hash field currently emitted inside supervised activation runtime receipts.

It is preserved for historical continuity.

It must not be treated as the final disk artifact hash unless explicitly proven equal to `disk_sha256`.

receipt_sha256_is_legacy_internal_field == true
receipt_sha256_is_not_assumed_to_equal_disk_sha256 == true

### payload_sha256

`payload_sha256` is reserved for a future canonical payload hash.

It should represent a deterministic canonical payload before final file serialization, if implemented.

payload_sha256_reserved_for_future_runtime_semantics == true

## Current Historical Evidence

Dry-run #1, #2, and #3 evidence preserve the distinction between governed disk hash and internal receipt hash.

dry_run_1_hash_distinction_preserved == true
dry_run_2_hash_distinction_preserved == true
dry_run_3_hash_distinction_preserved == true

## Governance Rule

For governed evidence:

1. Record the runtime receipt path.
2. Record `disk_sha256` as the governed artifact hash.
3. Record `receipt_sha256` as internal/legacy receipt field.
4. Disclose any mismatch.
5. Do not claim equality unless directly verified.

governed_evidence_uses_disk_sha256 == true
internal_receipt_sha256_recorded_separately == true
hash_mismatch_disclosure_required == true
false_hash_equivalence_claim_forbidden == true

## Runtime Safety Boundary

This semantics lane does not authorize any new runtime capability.

no_new_autonomous_capability == true
activation_mode_remains_dry_run_only == true
live_execution_authorized == false
wallet_mutation_authorized == false
network_mutation_authorized == false
private_key_access_authorized == false
irreversible_network_action_authorized == false
full_autonomy_claimed == false
authority_expanded == false

## Next Allowed Lane

After this semantics lane is merged and post-merge sealed, the next valid operational lane is one of:

- supervised activation dry-run #4 using the clarified hash semantics
- supervised activation readiness index v2 incorporating dry-runs #1-#3 and this semantics rule
- runtime receipt format v2 adding explicit `payload_sha256` and `disk_sha256` fields

live_activation_preparation_allowed == false
live_activation_allowed == false

## Verification Chain

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

Receipt hash semantics are now explicit.

The governed hash for runtime evidence is the final disk byte hash.

The internal `receipt_sha256` field remains preserved, but cannot be conflated with the disk artifact hash.
