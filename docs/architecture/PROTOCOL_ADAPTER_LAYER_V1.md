# Protocol Adapter Layer v1

## Status

PROTOCOL_ADAPTER_LAYER_V1=true
MODE=DRY_RUN_ONLY
RPC_MUTATION_AUTHORIZED=false
SIGNING_AUTHORIZED=false
DEPLOYMENT_AUTHORIZED=false
FUNDING_AUTHORIZED=false
LIQUIDITY_AUTHORIZED=false

## Purpose

This layer defines a dry-run protocol interface shape for future implementation work.

It does not authorize live execution. It only proves that protocol requests can be normalized, classified, and receipt-sealed before any future operational gate exists.

## Adapter Responsibilities

- Accept a protocol intent object.
- Normalize the target, action, chain, and payload fields.
- Classify whether the requested action would require signing, RPC mutation, deployment, funding, or liquidity.
- Reject live execution by default.
- Emit a deterministic dry-run receipt.

## Explicit Boundaries

- No private keys.
- No wallet signing.
- No RPC mutation.
- No token approvals.
- No liquidity actions.
- No contract deployment.
- No funding movement.
- No mainnet state changes.

## Current Authorized Scope

AUTHORIZED_SCOPE=LOCAL_DRY_RUN_ONLY
LIVE_EXECUTION=false
RECEIPT_REQUIRED=true
FUTURE_OPERATIONAL_GATE_REQUIRED=true
