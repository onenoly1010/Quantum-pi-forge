# Protocol Adapter to Normalization Pipeline v0.1

## Status

PROTOCOL_ADAPTER_NORMALIZATION_PIPELINE_V0_1=true
MODE=LOCAL_DRY_RUN_ONLY
COMPOSES_PROTOCOL_ADAPTER=true
COMPOSES_NORMALIZATION_ENGINE=true
RPC_MUTATION_AUTHORIZED=false
SIGNING_AUTHORIZED=false
DEPLOYMENT_AUTHORIZED=false
FUNDING_AUTHORIZED=false
LIQUIDITY_AUTHORIZED=false

## Purpose

This pipeline proves that protocol adapter dry-run output can be converted into a canonical normalized object and receipt without authorizing live execution.

The pipeline is local-only. It composes the protocol adapter posture with Normalization Engine v0.1 and rejects unsafe intent fields before any future external protocol layer exists.

## Flow

1. Construct a local adapter output object.
2. Convert it into a normalization input object.
3. Normalize and canonical-hash the object.
4. Emit a pipeline receipt.
5. Verify no signing, RPC mutation, deployment, funding, or liquidity action occurred.

## Boundaries

- No private keys.
- No wallet signing.
- No RPC mutation.
- No deployment.
- No funding movement.
- No liquidity actions.
- No mainnet state change.
