# Supervised Autonomous Activation Command v1

## Status

Prepared supervised activation command lane.

This lane defines a dry-run-only autonomous activation command.

## Baseline

- main == origin/main == c5b4e6a at lane creation.
- PR #207 autonomous network activation readiness v2 is sealed on main.
- PR #208 post-merge governance receipt is sealed on main.
- Self-hosted runner implementation remains frozen.

## Safety Boundary

The supervised activation command must:

- default to dry-run mode
- refuse irreversible network action
- refuse private key access
- require explicit operator confirmation before any future live mode
- emit a local receipt for every run
- preserve operator override

## Non-Claims

This lane does not claim full autonomous network operation.

This lane does not execute live deployment.

This lane does not modify self-hosted runner implementation.

## Command

The command is:

npm run autonomous:supervised-activation:v1

## Final Invariant

supervised_activation_command_defined == true
dry_run_default == true
irreversible_network_actions_refused == true
private_key_access_refused == true
operator_override_preserved == true
run_receipt_emitted == true
full_autonomy_claimed == false
