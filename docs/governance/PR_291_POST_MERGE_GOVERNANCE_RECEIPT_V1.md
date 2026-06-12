# PR 291 Post-Merge Governance Receipt v1

## Purpose

This receipt seals the normal post-merge state for PR 291, which added the v2 operator unpark approval candidate v1.

The receipt proves that the operator unpark approval candidate landed on canonical main through the normal merge path and that the local governance verifier stack plus build remained green after merge.

## Canonical merge anchor

- PR: #291
- Merged artifact: v2-operator-unpark-approval-candidate-v1
- Canonical branch: main
- Post-merge commit: 4e50e1c100d99fc59c483111b24da3c7cde65837
- Post-merge short commit: 4e50e1c
- Post-merge subject: Add v2 operator unpark approval candidate v1 (#291)
- Post-merge commit date: 2026-06-11T23:57:53-06:00
- Receipt generated at: 2026-06-12T05:59:46.192Z

## Verified post-merge posture

The system remains parked after PR 291. This receipt confirms a candidate only; it does not grant final approval and does not execute unpark.

Required false flags:

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

Required true flags:

- operator_unpark_approval_candidate_created == true
- operator_unpark_approval_candidate_merged == true
- pre_unpark_readiness_gate_required == true
- final_operator_approval_still_required == true
- command_hash_receipt_still_required == true
- read_only_probe_still_required == true
- final_unpark_receipt_still_required == true
- separate_execution_receipt_still_required == true
- post_merge_receipt_created == true
- local_governance_verifiers_green == true
- local_build_green == true

## Boundary statement

PR 291 does not approve unpark, does not execute unpark, does not grant operator execution authority, does not authorize deployment, does not authorize broadcast, does not authorize command execution, and does not authorize any state-changing transaction.

The next allowed lane remains a final operator unpark approval receipt, not command execution and not deployment.

Suggested next branch name:

```text
governance/v2-final-operator-unpark-approval-receipt-v1
```

## Status

PR 291 post-merge receipt v1 is ready for review once this receipt lane is merged through the normal PR path.
