# Quantum Pi Forge Evidence Index

## Purpose

This index maps current repository evidence claims to their supporting files, verification commands, and authority boundaries.

The index is not a runtime system. It does not grant wallet, deployment, posting, governance, or chain authority.

## Current Evidence Lanes

| Evidence ID | Scope | Status | Primary Files | Verification |
|---|---|---:|---|---|
| QPF-HERMES-RECEIPT-REPLAY-v1 | Local Hermes/Ollama inference receipt replay | Active | `scripts/hermes-run.sh`, `scripts/hermes-write-receipt.cjs`, `scripts/verify-hermes-receipt.cjs`, `evidence/hermes/schemas/receipt-v1.schema.json` | `npm run verify:receipt -- <receipt.json>` |
| QPF-HERMES-RETENTION-POLICY-v1 | Receipt retention and commit eligibility policy | Active | `docs/evidence/HERMES_RECEIPT_RETENTION_POLICY.md` | Documentation review |
| QPF-LOCAL-CI-SURROGATE-v1 | Local build and verification substitute while hosted checks are unavailable | Active | `scripts/local-ci-surrogate.sh` | `bash scripts/local-ci-surrogate.sh` |

## Deferred Evidence Lanes

These lanes are intentionally excluded from current verifier enforcement until their files are restored or reintroduced:

- QPF-CLAIM-MAP-v1
- QPF-ARCHITECTURE-MAP-v1

## Hermes Evidence Rule

Generated Hermes artifacts are local-only by default.

These paths are not automatically retained:

- `evidence/hermes/inputs/`
- `evidence/hermes/outputs/`
- `evidence/hermes/receipts/`

A Hermes receipt may become repository evidence only when it is claim-bound, verified, safe to publish, and indexed here.


## Snapshot Receipt

The current evidence index snapshot receipt is stored at `evidence/receipt.json`.

Generate or refresh it with:

```bash
npm run evidence:receipt
```

The receipt records the SHA-256 hash of `evidence/INDEX.md`, the verifier result, the current git commit, and the read-only authority boundary.

Check receipt drift without rewriting the receipt:

```bash
npm run evidence:receipt:check
```

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

This index establishes the current repository evidence map for the post-Hermes baseline.

## Claim Map v1

Machine-readable public claim map.

- `evidence/claim-map.json`
- `scripts/verify-claim-map.cjs`

Verification:

```bash
npm run verify:claim-map
```

Authority boundary: read-only evidence verification only; no wallet signing, deployment, posting, governance execution, custody transfer, token minting, staking, or chain mutation.

## Claim Map Drift Guard

Read-only drift guard for the machine-readable claim map.

- `scripts/check-claim-map.cjs`

Verification:

```bash
npm run claim-map:check
```

Authority boundary: read-only claim map drift verification only; no wallet signing, deployment, posting, governance execution, custody transfer, token minting, staking, or chain mutation.

## Verification Bundle v1

Single-command local evidence verification bundle.

- `scripts/verify-evidence.cjs`

Verification:

```bash
npm run verify:evidence
```

Authority boundary: read-only local evidence verification only; no wallet signing, deployment, posting, governance execution, custody transfer, token minting, staking, or chain mutation.

## README Reviewer Proof Command

Repository front-door pointer to the canonical local evidence verifier.

- `README.md`

Verification:

```bash
npm run verify:evidence
```

Authority boundary: read-only reviewer evidence verification only; no wallet signing, deployment, posting, governance execution, custody transfer, token minting, staking, or chain mutation.

## Evidence Snapshot v1

Machine-checkable checkpoint for the reviewer-proof canonical state.

- `evidence/snapshot-v1.json`
- `scripts/verify-snapshot.cjs`

Verification:

```bash
npm run verify:snapshot
npm run verify:evidence
```

Snapshot baseline:

- Canonical commit: `7e6281d`
- Baseline receipt hash: `b720d54e7a07b89edd4e7dd20ce6631d5d252bef273e8c59ab62cffa2fd27fb1`
- Proof command: `npm run verify:evidence`

Authority boundary: read-only evidence verification only; no wallet signing, deployment, posting, governance execution, custody transfer, token minting, staking, or chain mutation.

