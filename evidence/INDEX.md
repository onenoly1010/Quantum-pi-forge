# Quantum Pi Forge Evidence Index

## Purpose

This index maps project evidence claims to their supporting files, verification commands, and authority boundaries.

The index is not a runtime system. It does not grant wallet, deployment, posting, governance, or chain authority.

## Current Evidence Lanes

| Evidence ID | Scope | Status | Primary Files | Verification |
|---|---|---:|---|---|
| QPF-HERMES-RECEIPT-REPLAY-v1 | Local Hermes/Ollama inference receipt replay | Active | `scripts/hermes-run.sh`, `scripts/hermes-write-receipt.cjs`, `scripts/verify-hermes-receipt.cjs`, `evidence/hermes/schemas/receipt-v1.schema.json` | `npm run verify:receipt -- <receipt.json>` |
| QPF-HERMES-RETENTION-POLICY-v1 | Receipt retention and commit eligibility policy | Active | `docs/evidence/HERMES_RECEIPT_RETENTION_POLICY.md` | Documentation review |
| QPF-LOCAL-CI-SURROGATE-v1 | Local build and verification substitute while hosted checks are unavailable | Active | `scripts/local-ci-surrogate.sh` | `bash scripts/local-ci-surrogate.sh` |
| QPF-CLAIM-MAP-v1 | Public claim-to-proof mapping | Active | `docs/EVIDENCE.md`, `PROOF-INDEX.md` | Documentation review |
| QPF-ARCHITECTURE-MAP-v1 | Reviewer architecture map | Active | `docs/ARCHITECTURE_MAP.md` | Documentation review |

## Hermes Evidence Rule

Generated Hermes artifacts are local-only by default.

These paths are not automatically retained:

- `evidence/hermes/inputs/`
- `evidence/hermes/outputs/`
- `evidence/hermes/receipts/`

A Hermes receipt may become repository evidence only when it is claim-bound, verified, safe to publish, and indexed here.

## Authority Boundary

All current evidence lanes are read-only and non-mutating.

They do not authorize:

- wallet signing
- token minting
- staking execution
- chain mutation
- autonomous posting
- deployment
- governance execution
- custody transfer

## Required Entry Format

Every new evidence entry should include:

- evidence id
- scope
- status
- primary files
- verification command
- related PR or commit
- authority boundary

## Current Status

This index establishes the repository evidence map for the current post-Hermes baseline.
