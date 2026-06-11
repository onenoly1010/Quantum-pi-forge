# Mainnet Cutover Operator Approval Gate v1

## Status

SEALED_OPERATOR_APPROVAL_GATE.

This document defines the operator approval gate required before any future mainnet cutover.

No cutover was executed.

No deployment was executed.

No broadcast was executed.

Operator approval is not currently granted.

## Base State

- Base main commit: `b7f90f2`
- Branch: `autonomous/mainnet-cutover-operator-approval-gate-v1`

## Required Baseline Verification

The following checks must pass before any future approval can be valid:

- `autonomous:mainnet-cutover-rollback-plan:v1:check`
- `autonomous:mainnet-cutover-gate-definition:v1:check`
- `autonomous:mainnet-cutover-preflight-boundary:v1:check`
- `autonomous:mainnet-cutover-readiness-boundary:v1:check`
- `governance:pr-231-post-merge:v1:check`
- `governance:supervised-activation-dry-run-4-evidence:v1:check`
- `press-agent:credential-completion-boundary:v1:check`
- `autonomous:supervised-activation:v1:check`
- `autonomous:network-activation-readiness:v2:check`
- `build`

## Required Approval Phrase

A future cutover approval is valid only if the operator explicitly states:

`I APPROVE MAINNET CUTOVER EXECUTION FOR THIS EXACT HASHED COMMAND`

## Approval Rules

Operator approval must be:

- explicit
- receipt-backed
- single use
- bound to an exact command hash
- bound to the current main commit
- invalidated by any command change
- invalidated by any mainline change
- invalidated by any failed verifier

## Forbidden Without Approval

The following are forbidden without a valid approval receipt:

- mainnet cutover
- contract deployment
- state-changing transaction
- external multichannel broadcast
- automatic retry
- secret printing
- runtime receipt commit

## Claim Boundary

This approval gate confirms:

- operator approval gate defined
- explicit approval phrase defined
- approval is required before cutover
- approval is not currently granted

This approval gate does not claim:

- mainnet cutover ready to execute
- mainnet cutover complete
- deployment complete
- broadcast complete
- unsupervised autonomy active

## Next Authorized Lane

The next valid lane is:

`mainnet-cutover-secret-completion-gate-v1`

That lane may define secret completion requirements.

It must not perform mainnet cutover.
