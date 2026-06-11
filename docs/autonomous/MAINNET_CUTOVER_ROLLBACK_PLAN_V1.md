# Mainnet Cutover Rollback Plan v1

## Status

SEALED_ROLLBACK_PLAN.

This document defines the rollback and stop plan required before any future mainnet cutover.

No cutover was executed.

No deployment was executed.

No broadcast was executed.

## Base State

- Base main commit: `2da4ebe`
- Branch: `autonomous/mainnet-cutover-rollback-plan-v1`

## Required Baseline Verification

The following checks must pass before and after any stop event:

- `autonomous:mainnet-cutover-gate-definition:v1:check`
- `autonomous:mainnet-cutover-preflight-boundary:v1:check`
- `autonomous:mainnet-cutover-readiness-boundary:v1:check`
- `governance:pr-231-post-merge:v1:check`
- `governance:supervised-activation-dry-run-4-evidence:v1:check`
- `press-agent:credential-completion-boundary:v1:check`
- `autonomous:supervised-activation:v1:check`
- `autonomous:network-activation-readiness:v2:check`
- `build`

## Stop Conditions

The cutover sequence must stop immediately if any of the following occurs:

- any verifier fails
- working tree becomes dirty during preflight
- unexpected network mutation is detected
- secret presence check fails
- operator approval receipt is missing
- runtime receipt cannot be written
- broadcast target is unavailable
- deployment verification fails

## Immediate Actions

On stop:

1. Stop the cutover sequence.
2. Do not retry automatically.
3. Preserve logs.
4. Write a runtime rollback observation receipt.
5. Return to `main` without committing runtime artifacts.
6. Run the local verifier stack.

## Post-Stop Verification

After any stop event, run:

- `autonomous:mainnet-cutover-gate-definition:v1:check`
- `autonomous:mainnet-cutover-preflight-boundary:v1:check`
- `autonomous:network-activation-readiness:v2:check`
- `build`

## Forbidden Actions

The following are forbidden during rollback:

- force push
- secret printing
- unreviewed deploy retry
- unbounded broadcast retry
- mainnet transaction retry without new operator approval
- committing runtime receipts

## Receipt Policy

Runtime receipts must be written under:

`runtime/autonomous/runs/`

Runtime receipts must not be committed.

A governed summary receipt is required before any durable claim is committed.

No secret values may be logged.

## Claim Boundary

This rollback plan confirms:

- rollback plan defined
- stop conditions defined
- forbidden actions defined
- receipt policy defined

This rollback plan does not claim:

- mainnet cutover ready to execute
- mainnet cutover complete
- deployment complete
- broadcast complete
- unsupervised autonomy active

## Next Authorized Lane

The next valid lane is:

`mainnet-cutover-operator-approval-gate-v1`

That lane may define the explicit operator approval receipt.

It must not perform mainnet cutover.
