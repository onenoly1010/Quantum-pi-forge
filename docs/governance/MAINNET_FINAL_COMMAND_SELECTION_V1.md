# Mainnet Final Command Selection v1

## Status

This document seals the final command text and hash for a possible future mainnet activation boundary.

This is command selection only.

It does not grant operator approval.

It does not authorize deployment.

It does not authorize broadcast.

It does not authorize mainnet cutover.

It does not authorize state-changing transactions.

## Canonical Baseline

```txt
main_commit = 18cdbceb749331cd170c0db28eaa91ad389e56c9
main_subject = Prepare mainnet operator approval v1 (#271)
```

## Final Command Boundary

```txt
final_command_file = receipts/governance/mainnet-final-command-text-v1.txt
final_command_sha256 = 93528ad84f5fb4e4b5bbc469f526f7d2b41d467c18b3c2cb3a71fe5fb85447ed
final_command_status = SELECTED_NOT_APPROVED
final_operator_command_selected = true
final_operator_command_approved = false
final_command_allowed_now = false
```

## Purpose

This lane separates command selection from command approval.

The exact command text is now sealed.

The exact command hash is now sealed.

The operator has not approved execution.

The system remains parked.

## Required Governance Model

```txt
outside_reviewer_required = false
outside_review_welcome = true
open_verification_required = true
operator_approval_required_for_mainnet = true
```

## Required Selection State

```txt
final_operator_command_selected = true
final_operator_command_hash_sealed = true
final_operator_command_approved = false
operator_approval_granted = false
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

This seal allows only:

1. final command text selection;
2. final command hash sealing;
3. later operator approval receipt preparation;
4. verification that the selected command matches this sealed hash.

## Invalid Work

This seal does not allow:

1. running the selected command;
2. transaction signing;
3. transaction broadcast;
4. contract deployment;
5. mainnet cutover;
6. state-changing mainnet interaction;
7. flipping authorization flags to true.

## Next Valid Boundary

The next valid boundary is:

```txt
mainnet-operator-approval-v1
```

That later boundary may grant explicit operator approval, but it must be separate from this final command selection receipt.

## Final Statement

Final command text is selected.

Final command hash is sealed.

Operator approval is not granted.

Execution remains parked.

Authorization remains false.
