# Mainnet Operator Approval v1

## Status

This document records explicit operator approval for the sealed final command.

This is an approval seal.

It is not an execution seal.

It does not execute deployment.

It does not execute broadcast.

It does not execute mainnet cutover.

It does not execute a state-changing transaction.

## Canonical Baseline

```txt
main_commit = f035b5ff58a052c80671497d05e0a93398208499
main_subject = Seal mainnet final command selection v1 (#272)
```

## Approved Command Boundary

```txt
final_command_file = receipts/governance/mainnet-final-command-text-v1.txt
final_command_sha256 = 93528ad84f5fb4e4b5bbc469f526f7d2b41d467c18b3c2cb3a71fe5fb85447ed
operator_approval_statement_file = receipts/governance/mainnet-operator-approval-statement-v1.txt
operator_approval_statement_sha256 = 2e59dff4e27d81b2ffcf853f9243e0a737e8da864e000daf279b806110a65f51
```

## Approval State

```txt
operator_approval_granted = true
final_operator_command_approved = true
mainnet_cutover_approval_granted = true
```

## Authorization State

```txt
deployment_authorized = true
broadcast_authorized = true
mainnet_cutover_authorized = true
state_changing_transaction_authorized = true
```

## Execution State

```txt
mainnet_cutover_executed = false
deployment_executed = false
broadcast_executed = false
state_changing_transaction_executed = false
```

## Boundary Rule

This approval may be consumed only by a later execution boundary.

Direct execution from this approval receipt is not allowed.

The execution boundary must verify:

1. this approval receipt passes;
2. the final command hash matches;
3. the selected command has not drifted;
4. the execution command references this receipt;
5. execution receipts are written after the run;
6. executed flags are not changed inside this approval lane.

## Required Governance Model

```txt
outside_reviewer_required = false
outside_review_welcome = true
open_verification_required = true
operator_approval_required_for_mainnet = true
```

## Next Valid Boundary

```txt
mainnet-execution-window-v1
```

That later boundary may perform the actual execution step if, and only if, all verifier checks pass and the final command hash matches this approval.

## Final Statement

Operator approval is granted.

The final command is approved.

Execution has not occurred.

The next boundary must be an explicit execution window.
