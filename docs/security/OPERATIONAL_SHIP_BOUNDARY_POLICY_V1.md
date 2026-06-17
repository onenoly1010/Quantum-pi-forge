# Operational Ship Boundary Policy v1

**Policy ID:** `ship-boundary-policy-v1`

## Purpose

This policy defines the boundary for the future `ship` capability before any orchestrator implementation exists. It is policy-only and non-executing.

## Prerequisites

| Prerequisite | Receipt | Status |
| --- | --- | --- |
| Security Evidence Walkthrough v1 | `receipts/security/evidence/security-evidence-walkthrough-v1.json` | Validated |
| 0G Storage/DA Lane Status v1 | `receipts/security/evidence/0g-storage-da-lane-status-v1.json` | Sealed |

## Allowed actions

- Read security documents.
- Read machine-readable receipts.
- Run local verifiers.
- Run dry-run-only commands.
- Emit non-executing receipts.
- Fail closed on missing or invalid evidence.

## Forbidden actions

- Read or use private keys.
- Sign transactions.
- Broadcast transactions.
- Submit storage writes.
- Mutate chain state.
- Fund wallets.
- Approve tokens.
- Create liquidity.
- Bypass wallet preflight gates.
- Bypass payload hash verification.
- Bypass negative tests.

## Required gates before future orchestration

- `security-evidence-walkthrough-v1` must pass.
- Wallet/preflight receipts must be discoverable.
- `0g-storage-da-lane-status-v1` must remain sealed.
- `npm run verify:evidence` must pass.
- Future orchestration must first ship as dry-run only.
- Future orchestration must include a negative test before final status.

## Current posture

- Private key used: `false`
- Transaction signed: `false`
- Transaction broadcast: `false`
- Storage write attempted: `false`
- Chain-state mutated: `false`
- Orchestrator implemented: `false`

## Final policy status

`BOUNDARY_DEFINED`
