# Protocol Pipeline Orchestrator v0.1

## Status

PROTOCOL_PIPELINE_ORCHESTRATOR_V0_1=true
DRY_RUN_COORDINATOR_V0_1=true
MODE=LOCAL_DRY_RUN_ONLY
ACTIVE_DEVELOPMENT_GATE=true
SEQUENCES_ADAPTER=true
SEQUENCES_NORMALIZATION=true
SEQUENCES_CLASSIFIER_GUARD=true
RPC_MUTATION_AUTHORIZED=false
SIGNING_AUTHORIZED=false
DEPLOYMENT_AUTHORIZED=false
FUNDING_AUTHORIZED=false
LIQUIDITY_AUTHORIZED=false
LIVE_EXECUTION_AUTHORIZED=false

## Purpose

Protocol Pipeline Orchestrator v0.1 provides a single local dry-run entrypoint that sequences adapter-shaped input through normalization and intent classification.

It produces a master receipt for the full local pipeline while enforcing that no private keys, wallet actions, RPC mutation, deployment, funding, liquidity, or live execution paths are opened.

## Flow

1. Accept raw local dry-run intent.
2. Shape it as an adapter-style evidence receipt payload.
3. Normalize it using Normalization Engine v0.1.
4. Classify and guard it using Protocol Intent Classifier v0.1.
5. Emit a master orchestrator receipt.

## Allowed Outcome

- Pure local simulation accepted.
- Unsafe or live-intent requests quarantined.

## Boundaries

- No private keys.
- No wallet signing.
- No RPC mutation.
- No deployment.
- No funding movement.
- No liquidity actions.
- No mainnet state change.
