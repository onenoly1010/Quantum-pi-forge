# Mainnet Execution Window v1

## Status

This document opens the first single-use mainnet execution window for Quantum Pi Forge / OINIO Soul System.

This is the live execution boundary.

It does not automatically execute the command.

It authorizes the operator to run the previously sealed final command after this receipt is merged and verified on canonical `main`.

## Canonical Baseline

```txt
main_commit = 71778b142788f89fcbd9f14b71f91a4e451b17c4
main_subject = Grant mainnet operator approval v1 (#273)
```

## Approved Command

```txt
final_command_file = receipts/governance/mainnet-final-command-text-v1.txt
final_command_sha256 = 93528ad84f5fb4e4b5bbc469f526f7d2b41d467c18b3c2cb3a71fe5fb85447ed
operator_approval_receipt = receipts/governance/mainnet-operator-approval-v1.json
execution_window_notice = receipts/governance/mainnet-execution-window-notice-v1.txt
execution_window_notice_sha256 = a0cb683cd157c85c617b7b974ba13cdd21ee0cad464bea80107cb3858d59aeef
```

## Window State

```txt
execution_window_open = true
single_use_execution_window = true
post_execution_receipt_required = true
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

## Execution State Before Run

```txt
deployment_executed = false
broadcast_executed = false
mainnet_cutover_executed = false
state_changing_transaction_executed = false
```

## Boundary Rule

This lane opens the execution window only.

It does not mark execution complete.

After the operator runs the sealed command, a separate post-execution receipt must record:

1. exact command run;
2. command hash match;
3. transaction hash, if any;
4. deployment result, if any;
5. broadcast result, if any;
6. final execution flags;
7. failure state if no transaction was broadcast.

## Next Valid Boundary

```txt
mainnet-execution-result-v1
```

## Final Statement

The execution window is open.

The command is approved.

The system has not yet executed.

A post-execution result receipt is mandatory.
