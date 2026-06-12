# Mainnet Activation Preflight v1

## Status

This document prepares the Quantum Pi Forge / OINIO Soul System for a possible future mainnet activation path.

This is a preflight seal only.

It does not authorize deployment.

It does not authorize broadcast.

It does not authorize mainnet cutover.

It does not authorize state-changing transactions.

## Canonical Baseline

```txt
main_commit = 7c23eeb647377ec21ccc7a3bec376218205efc2d
main_subject = Seal current governance state v1 (#268)
```

## Purpose

Mainnet Activation Preflight v1 records that the system may proceed into readiness packaging without leaving the parked state.

This separates preparation from approval.

The project may now package proof, identify exact deployment commands, inspect wallet and network readiness, and prepare a later operator approval receipt.

## Required Governance Model

```txt
outside_reviewer_required = false
outside_review_welcome = true
open_verification_required = true
operator_approval_required_for_mainnet = true
```

## Required Execution State

```txt
activation_preflight_ready = true
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

## Valid Preflight Work

This preflight allows only non-executing preparation:

1. proof package assembly;
2. exact command hash preparation;
3. wallet readiness inspection;
4. RPC/network readiness inspection;
5. dry-run simulation;
6. operator approval document preparation.

## Invalid Work

This preflight does not allow:

1. contract deployment;
2. transaction broadcast;
3. mainnet cutover;
4. mutation of live state;
5. flipping execution authorization flags to true.

## Next Valid Boundary

The next valid boundary is a command-hash and readiness seal.

Only after that may a separate operator approval receipt be considered.

## Final Statement

The system is preflight-ready.

The system remains parked.

Preparation is authorized.

Execution is not authorized.
