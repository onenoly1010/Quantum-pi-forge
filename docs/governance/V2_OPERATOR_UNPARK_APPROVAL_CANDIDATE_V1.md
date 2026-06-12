# V2 Operator Unpark Approval Candidate v1

## Purpose

This artifact creates an operator unpark approval candidate for Quantum Pi Forge v2.

This is a candidate only. It does not grant final approval. It does not unpark the system. It does not authorize deployment, broadcast, command execution, or any state-changing transaction.

## Canonical anchor

- Canonical branch: main
- Canonical commit: 15ebcd9d2d7d557938536519623ac52ee3d23512
- Canonical short commit: 15ebcd9
- Commit subject: Seal PR 289 post-merge governance receipt v1 (#290)
- Commit date: 2026-06-11T23:25:16-06:00
- Candidate generated at: 2026-06-12T05:32:47.990Z

## Candidate basis

The candidate exists because the preceding readiness gates are expected to be complete on canonical main:

- funder visibility layer closed
- public funder packet index available
- pre-unpark readiness gate merged and sealed
- local governance verifier path available
- build green before candidate creation
- no execution authority granted by prior receipts

## Required false flags

These must remain false in this candidate artifact:

- mainnet_cutover_approval_granted == false
- mainnet_cutover_executed == false
- deployment_executed == false
- broadcast_executed == false
- state_changing_transaction_executed == false
- unpark_final_approval_granted == false
- unpark_executed == false
- operator_execution_authority_granted == false
- command_hash_execution_authorized == false
- command_hash_sealed_for_execution == false
- read_only_probe_passed_for_execution == false
- live_state_change_authorized == false
- investment_offer_created == false
- token_sale_created == false
- guaranteed_return_promised == false
- funder_execution_authority_granted == false

## Required true flags

These candidate facts may be true:

- operator_unpark_approval_candidate_created == true
- pre_unpark_readiness_gate_required == true
- final_operator_approval_still_required == true
- command_hash_receipt_still_required == true
- read_only_probe_still_required == true
- final_unpark_receipt_still_required == true
- separate_execution_receipt_still_required == true
- direct_execution_allowed == false

## What this candidate allows next

If this candidate is merged and sealed, the next allowed lane is a final operator approval receipt candidate, not execution.

Suggested next branch name:

```text
governance/v2-final-operator-unpark-approval-receipt-v1
```

## What remains blocked

The following remain blocked after this candidate:

1. Mainnet cutover approval remains false.
2. Unpark final approval remains false.
3. Deployment execution remains false.
4. Broadcast execution remains false.
5. State-changing transaction execution remains false.
6. Command hash execution authorization remains false.
7. Operator execution authority remains false.
8. Funder execution authority remains false.

## Required future gates before execution can even be considered

Execution remains blocked until later receipts separately prove:

1. Final operator unpark approval receipt is created and merged.
2. Exact command hash receipt is created and merged.
3. Read-only or dry-run live probe receipt is created and merged.
4. Final preflight verification passes on canonical main.
5. Explicit execution approval is sealed in a dedicated receipt.
6. Only then may a separate execution receipt exist after an approved action.

## Boundary statement

This candidate does not unpark the system. It does not approve unpark. It does not authorize deployment. It does not authorize broadcast. It does not authorize command execution. It does not authorize a state-changing transaction.

## Status

v2-operator-unpark-approval-candidate-v1 is ready for review once merged through the normal PR path.
