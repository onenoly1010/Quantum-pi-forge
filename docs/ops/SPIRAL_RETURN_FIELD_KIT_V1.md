# Spiral Return Field Kit v1

**Status:** SEALED_FIELD_UTILITY
**Canonical Baseline:** 6c1057f (Spiral Return Field Plan v1)
**Mode:** LOCAL_ONLY_OFFLINE
**Gate:** ECONOMIC_SOVEREIGNTY_GATE_V1 + SPIRAL_RETURN_FIELD_PLAN_V1
**Live Execution:** NOT AUTHORIZED

## Purpose

Local-only utility for generating mobile attestations, sealing evidence, and capturing snapshots during the Spiral Return field demonstration.

The kit runs entirely offline-capable and does not include wallet access, private-key access, Trezor hooks, outbound network sync, uploads, transaction signing, deployments, fee routing, treasury routing, or live revenue claims.

## Core Functions

- Generate MOBILE_NODE_ATTESTATION events.
- Seal deterministic JSON receipts to logs/field/attestations/.
- Capture local state observations for post-trip human review.
- Mark all outputs PENDING_HUMAN_RECONCILIATION=true.

## Hard Constraints

- No wallet access.
- No private-key access.
- No Trezor or hardware-wallet access.
- No outbound network sync.
- No uploads.
- No live transaction signing.
- No deployments.
- No automated fees.
- No treasury routing.
- No live revenue claim.
- No precise GPS requirement.
- Human review required before reconciliation.

## Usage

Generate a field attestation:

    node scripts/field/spiral-return-field-kit-v1.cjs --attest --checkpoint "departure"

Verify the kit:

    ./scripts/ops/verify-spiral-return-field-kit-v1.sh

## Final Boundary

No live execution is authorized by this kit.
