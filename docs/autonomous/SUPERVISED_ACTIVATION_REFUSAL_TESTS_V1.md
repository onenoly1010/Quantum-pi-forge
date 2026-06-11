# Supervised Activation Refusal Tests v1

## Status

Prepared refusal-test lane for supervised autonomous activation v1.

## Baseline

- main == origin/main == 293d70c at lane creation.
- PR #209 supervised activation command is on main.
- PR #210 runtime hygiene is on main.
- Runtime receipts default to ignored path: runtime/autonomous/runs/.

## Purpose

This lane proves the supervised activation command refuses unsafe contexts.

## Required Refusals

- `npm run autonomous:supervised-activation:v1 -- --live` must refuse live mode.
- `PRIVATE_KEY=redacted npm run autonomous:supervised-activation:v1` must refuse private-key context.

## Safety Boundary

The refusal tests must not execute live deployment.

The refusal tests must not expose or require real secrets.

The refusal tests must not modify self-hosted runner implementation.

## Final Invariant

live_mode_refused == true
private_key_context_refused == true
irreversible_network_action_executed == false
real_secret_required == false
runner_implementation_frozen == true
full_autonomy_claimed == false
