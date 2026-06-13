# Current Funder Audit Handoff v1

## Purpose

This document provides a current reviewer/funder-facing status handoff after the npm audit hardening evidence lane and PR #325 / PR #326 closure.

## Canonical State

Canonical `main` has been verified after:

- PR #325: npm audit hardening evidence v1
- PR #326: PR #325 post-merge governance receipt and determinism refresh

## Verification Status

The following checks pass on canonical `main`:

- `npm run governance:cross-platform-determinism:v1:check`
- `npm run governance:pr-325-post-merge:v1:check`
- `npm run governance:npm-audit-hardening-evidence:v1:check`
- `npm run governance:current-public-status-handoff:v1:check`
- `npm run verify:evidence`

## Audit Hardening Posture

The npm audit lane records current advisory state and rejects unsafe semver-major downgrade behavior.

The remaining audit advisories are documented as evidence, not silently forced through a risky dependency downgrade.

No unsafe dependency downgrade is committed in the hardening lane.

## Execution Posture

This handoff is evidence-only and non-executing.

The following remain false:

- deployment
- unpark
- key use
- chain mutation
- token action
- Cloudflare publish
- mainnet action

The execution receipt remains absent:

- `receipts/execution/v2-mainnet-cutover-execution-v1.json`

## Reviewer/Funder Reading Path

Recommended review order:

1. `docs/governance/CURRENT_PUBLIC_STATUS_HANDOFF_V1.md`
2. `docs/governance/NPM_AUDIT_HARDENING_EVIDENCE_V1.md`
3. `receipts/governance/pr-325-post-merge-governance-receipt-v1.json`
4. `receipts/governance/npm-audit-hardening-evidence-v1.json`
5. `receipts/governance/cross-platform-determinism-v1.json`

## Summary

The project is currently in a clean deterministic governance state with audit hardening evidence sealed, public handoff intact, and no execution receipt present.

