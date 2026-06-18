# Normalization Engine v0.1

## Status

NORMALIZATION_ENGINE_V0_1=true
MODE=LOCAL_DRY_RUN_ONLY
RPC_MUTATION_AUTHORIZED=false
SIGNING_AUTHORIZED=false
DEPLOYMENT_AUTHORIZED=false
FUNDING_AUTHORIZED=false
LIQUIDITY_AUTHORIZED=false

## Purpose

Normalization Engine v0.1 converts raw adapter output into canonical internal objects before any future protocol integration layer can consume them.

This layer is local-only. It validates object shape, enforces version fields, adds deterministic canonical hashes, and quarantines malformed or unsafe inputs.

## Supported Object Kinds

- sovereign_claim
- resonance_oracle_io
- evidence_receipt
- gate_state_transition
- qualia_fragment_minimal

## Rules

- Every object must include kind, version, and payload.
- Version must be v0.1.
- Payload must be a plain object.
- Unsafe execution fields are rejected.
- Canonical JSON is sorted before hashing.
- Rejected inputs are quarantined with reasons.

## Boundaries

- No private keys.
- No wallet signing.
- No RPC mutation.
- No deployment.
- No funding movement.
- No liquidity actions.
- No mainnet state change.
