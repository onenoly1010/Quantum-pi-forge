# Mainnet Cutover Gate Definition v1

## Status

SEALED_GATE_DEFINITION.

This document defines the required go/no-go gates for a future mainnet cutover.

No cutover was executed.

No deployment was executed.

No broadcast was executed.

## Base State

- Base main commit: `939f0b5`
- Branch: `autonomous/mainnet-cutover-gate-definition-v1`

## Required Baseline Verification

The following checks must pass before any later cutover lane:

- `autonomous:mainnet-cutover-preflight-boundary:v1:check`
- `autonomous:mainnet-cutover-readiness-boundary:v1:check`
- `governance:pr-231-post-merge:v1:check`
- `governance:supervised-activation-dry-run-4-evidence:v1:check`
- `press-agent:credential-completion-boundary:v1:check`
- `autonomous:supervised-activation:v1:check`
- `autonomous:network-activation-readiness:v2:check`
- `build`

## Go / No-Go Gates

### Gate 0 — Mainline Clean

Go only when:

- `main == origin/main`
- working tree is clean
- no uncommitted runtime artifacts are staged

### Gate 1 — Local Verifiers Green

Go only when all required local verifiers pass.

### Gate 2 — Secret Completion

Go only when all required Telegram, Twitter, Cloudflare, 0G, Pi verification, and signing inputs are present.

Secret values must never be printed.

### Gate 3 — Operator Approval

Go only when an explicit operator approval receipt is sealed.

### Gate 4 — Rollback Plan

Go only when a rollback plan is sealed and verified.

The rollback plan must define:

- stop condition
- revert command or disable path
- post-rollback verification
- operator notification
- receipt path
- no-secret logging policy

### Gate 5 — Dry-Run Replay

Go only when the supervised dry-run evidence chain remains reproducible.

### Gate 6 — Read-Only Live Surface Probe

Go only when read-only live probes pass without state mutation.

### Gate 7 — Cutover Command Hash

Go only when the exact cutover command is documented and hash-sealed before execution.

## Blocked Until

Mainnet cutover remains blocked until the following receipts exist:

- secret completion receipt
- operator approval receipt
- rollback plan receipt
- read-only live surface probe receipt
- cutover command hash receipt

## Claim Boundary

This gate definition confirms:

- go/no-go gates are defined
- rollback requirements are defined
- cutover remains blocked

This gate definition does not claim:

- mainnet cutover ready to execute
- mainnet cutover complete
- deployment complete
- broadcast complete
- unsupervised autonomy active

## Next Authorized Lane

The next valid lane is:

`mainnet-cutover-rollback-plan-v1`

That lane may define rollback procedures.

It must not perform mainnet cutover.
