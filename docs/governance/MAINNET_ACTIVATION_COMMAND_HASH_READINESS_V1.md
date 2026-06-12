# Mainnet Activation Command Hash Readiness v1

## Status

This document seals command-hash readiness for a possible future mainnet activation path.

This is a readiness seal only.

It does not authorize deployment.

It does not authorize broadcast.

It does not authorize mainnet cutover.

It does not authorize state-changing transactions.

## Canonical Baseline

```txt
main_commit = fb8c921e5292a75c34f44afd687e44fc9a2c9fb8
main_subject = Define mainnet activation preflight v1 (#269)
```

## Command Candidate Boundary

```txt
command_candidate_file = receipts/governance/mainnet-activation-command-candidate-v1.txt
command_candidate_sha256 = 795d6849299e251e1e141e7678ce0f54e8a64c1d24dea3d842946b266961e14f
command_candidate_status = HASHED_FOR_READINESS_ONLY
candidate_command_text = PENDING_FINAL_OPERATOR_SELECTION
candidate_command_allowed_now = false
```

## Purpose

This seal proves that the project has entered the command-hash readiness phase without collapsing readiness into execution.

The command-hash framework is prepared.

The final execution command is not selected.

The final execution command is not approved.

The final execution command is not authorized.

## Required Governance Model

```txt
outside_reviewer_required = false
outside_review_welcome = true
open_verification_required = true
operator_approval_required_for_mainnet = true
```

## Required Readiness State

```txt
activation_preflight_ready = true
command_hash_readiness_ready = true
command_candidate_hashed = true
final_operator_command_selected = false
final_operator_command_approved = false
```

## Required Execution State

```txt
mainnet_cutover_approval_granted = false
mainnet_cutover_executed = false
deployment_executed = false
broadcast_executed = false
state_changing_transaction_executed = false
```

## Required Authorization State

```txt
deployment_authorized = false
broadcast_authorized = false
mainnet_cutover_authorized = false
state_changing_transaction_authorized = false
```

## Valid Work Allowed By This Seal

This seal allows only non-executing readiness work:

1. command-candidate hashing;
2. readiness evidence collection;
3. wallet readiness inspection;
4. RPC readiness inspection;
5. dry-run validation;
6. preparation of a later explicit operator approval receipt.

## Invalid Work

This seal does not allow:

1. final command execution;
2. transaction signing;
3. transaction broadcast;
4. contract deployment;
5. state-changing mainnet interaction;
6. flipping authorization flags to true.

## Next Valid Boundary

The next valid boundary is:

```txt
mainnet-operator-approval-preparation-v1
```

That later boundary may prepare the exact operator approval text, but it must still remain separate from actual execution.

## Final Statement

Command-hash readiness is sealed.

Execution remains parked.

Approval remains false.

The final operator command is not selected or authorized by this receipt.
