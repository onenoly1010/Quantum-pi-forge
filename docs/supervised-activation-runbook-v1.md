# Supervised Activation Runbook v1

## Status

Governed dry-run procedure.

This runbook defines the only permitted procedure for invoking, observing, refusing, and archiving supervised autonomous activation in the current system state.

## Scope

This document is procedural only.

It does not grant new autonomous capability.
It does not authorize live execution.
It does not authorize wallet mutation.
It does not authorize network mutation.
It does not remove the operator intent gate.

## Current Activation Mode

supervised_activation_mode == dry-run-only

The supervised activation command may only be used to produce governed dry-run receipts under operator supervision.

## Required Preconditions

operator_intent_required == true
activation_mode == dry-run-only
runtime_receipts_written_to_ignored_path == true
historical_governance_receipts_preserved == true
refusal_tests_pass == true
network_mutation_allowed == false
wallet_mutation_allowed == false
unsupervised_execution_allowed == false

## Invocation Procedure

The operator may invoke the supervised activation command only after confirming the repo is synchronized and the governed verifier chain is green.

Minimum local checks:

npm run autonomous:supervised-activation:v1:check
npm run autonomous:supervised-activation-runtime-hygiene:v1:check
npm run autonomous:supervised-activation-refusal-tests:v1:check
npm run autonomous:supervised-activation-readiness-index:v1:check
npm run build

Only after these checks pass may the operator run the dry-run activation command:

npm run autonomous:supervised-activation:v1

## Observation Procedure

The operator must inspect the generated runtime receipt and confirm:

receipt_path_is_runtime_ignored == true
receipt_is_dry_run_only == true
operator_intent_recorded == true
no_wallet_mutation_occurred == true
no_network_mutation_occurred == true
no_unsupervised_loop_started == true

Runtime receipts are operational artifacts and must remain outside tracked git state unless explicitly promoted into governed historical evidence by a later receipt lane.

## Refusal Procedure

The activation process must refuse execution when any of the following are true:

operator_intent_missing == true
requested_mode_is_live == true
requested_wallet_mutation == true
requested_network_mutation == true
requested_unsupervised_loop == true
runtime_receipt_path_is_tracked == true
governance_chain_not_green == true

A refusal is a valid safety outcome.

Refusal must not be bypassed, softened, or converted into partial execution.

## Archival Procedure

Dry-run runtime receipts remain in the ignored runtime path by default.

A runtime receipt may be promoted into tracked evidence only by a separate governed receipt lane that:

states_the_reason_for_promotion == true
preserves_original_runtime_context == true
does_not_claim_live_execution == true
does_not_expand_activation_authority == true
includes_a_matching_verifier == true

## Explicit Non-Goals

This runbook does not:

- enable autonomous live operation
- create a daemon
- create a scheduler
- create a wallet agent
- create a network-writing agent
- create auto-merge behavior
- bypass branch protection
- bypass review requirements
- weaken refusal behavior

## Safety Invariants

supervised_activation_runbook_v1_defined == true
activation_requires_operator_intent == true
activation_remains_dry_run_only == true
refusal_cases_documented == true
runtime_receipts_ignored_by_git == true
historical_receipts_preserved == true
no_new_autonomous_capability == true
no_live_execution_authorized == true
no_wallet_mutation_authorized == true
no_network_mutation_authorized == true

## Conclusion

The supervised activation layer remains parked in dry-run-only mode.

This runbook formalizes the human-in-the-loop procedure without expanding system authority.
