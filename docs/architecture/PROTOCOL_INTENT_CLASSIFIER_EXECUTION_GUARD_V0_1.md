# Protocol Intent Classifier and Execution Guard v0.1

## Status

PROTOCOL_INTENT_CLASSIFIER_V0_1=true
EXECUTION_GUARD_V0_1=true
MODE=LOCAL_DRY_RUN_ONLY
ACTIVE_DEVELOPMENT_GATE=true
RPC_MUTATION_AUTHORIZED=false
SIGNING_AUTHORIZED=false
DEPLOYMENT_AUTHORIZED=false
FUNDING_AUTHORIZED=false
LIQUIDITY_AUTHORIZED=false
LIVE_EXECUTION_AUTHORIZED=false

## Purpose

This layer consumes normalized objects and classifies their protocol intent before any future executor, router, adapter, or external protocol handler can consume them.

It applies the current active-development gate policy. Only pure local simulation is allowed. Anything requiring signing, RPC mutation, deployment, funding, liquidity, wallet actions, or live execution is quarantined.

## Classification Types

- read_only
- governance
- resonance_oracle
- soul_data
- write_mutation
- execution

## Guard Rules

- Normalized objects must come from Normalization Engine v0.1.
- LOCAL_DRY_RUN_ONLY mode is required.
- Pure local read/governance/oracle/soul-data simulation may pass.
- Signing intent is blocked.
- RPC mutation intent is blocked.
- Deployment intent is blocked.
- Funding intent is blocked.
- Liquidity intent is blocked.
- Wallet action intent is blocked.
- Live execution intent is blocked.

## Boundaries

- No private keys.
- No wallet signing.
- No RPC mutation.
- No deployment.
- No funding movement.
- No liquidity actions.
- No mainnet state change.
