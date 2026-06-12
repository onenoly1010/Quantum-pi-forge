# V2 Pre-Unpark Readiness Gate v1

## Purpose

This gate moves Quantum Pi Forge from a fully parked review posture toward an unpark-readiness posture without granting approval and without executing any state-changing action.

This is not an unpark receipt. This is not an operator approval receipt. This is not a deployment command. This is not a transaction broadcast.

## Canonical anchor

`- Canonical branch: main`
`- Canonical commit: ${head}`
`- Canonical short commit: ${short}`
`- Commit subject: ${subject}`
`- Commit date: ${committedAt}`
`- Gate generated at: ${generatedAt}`

## Current state

The funder visibility layer is expected to be closed before this gate is merged:

- v2 funder review packet exists
- v2 funder outreach manifest exists
- v2 public funder packet index exists
- packet receipts exist
- outreach receipts exist
- post-merge receipts exist where available
- local governance verifier stack is green
- build is green

## Required false flags

These must remain false in this gate:

- mainnet_cutover_approval_granted == false
- mainnet_cutover_executed == false
- deployment_executed == false
- broadcast_executed == false
- state_changing_transaction_executed == false
- unpark_approval_granted == false
- unpark_executed == false
- operator_execution_authority_granted == false
- command_hash_execution_authorized == false
- live_state_change_authorized == false
- investment_offer_created == false
- token_sale_created == false
- guaranteed_return_promised == false
- funder_execution_authority_granted == false

## Required true flags

These readiness facts may be true:

- funder_visibility_layer_closed == true
- public_funder_packet_index_available == true
- local_verifier_path_available == true
- pre_unpark_readiness_gate_created == true
- pre_unpark_review_required == true
- explicit_operator_approval_still_required == true
- command_hash_receipt_still_required == true
- read_only_probe_still_required == true
- final_unpark_receipt_still_required == true

## Conditions before any future unpark approval candidate

Before an operator approval candidate may be created, the following must be checked again on canonical main:

1. Full governance verifier stack passes.
2. Build passes.
3. Public funder packet index is present or repository-canonical fallback is documented.
4. Reviewer/funder evidence path is complete enough for outside review.
5. No non-execution posture flags have been flipped.
6. No deployment, transaction broadcast, state-changing execution, token sale, or investment-offer language has been introduced.
7. Operator explicitly requests an approval-candidate lane in a separate step.

## Conditions before any future unpark execution

Even after this gate, execution is still blocked until all of the following exist in later receipts:

1. Operator approval candidate receipt.
2. Final operator approval receipt.
3. Sealed command hash for the exact future command path.
4. Dry-run or read-only live probe receipt.
5. Final preflight verification on canonical main.
6. Explicit approval flag flip in a dedicated receipt.
7. Separate execution receipt after any approved action.

## Boundary statement

This gate only establishes readiness to begin reviewing unpark conditions. It does not approve unpark. It does not execute unpark. It does not authorize deployment. It does not authorize broadcast. It does not authorize a state-changing transaction.

## Next allowed lane

If this gate is merged and sealed, the next allowed lane is an operator approval candidate, not direct execution.

Suggested next branch name:

```text
governance/v2-operator-unpark-approval-candidate-v1
```

## Status

v2-pre-unpark-readiness-gate-v1 is ready for review once merged through the normal PR path.
