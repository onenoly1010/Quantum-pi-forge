# Quantum Pi Forge Audit Runbook

## Status

Canonical reviewer onboarding runbook.

This runbook is non-executing. It does not authorize deployment, broadcast, mainnet cutover, approval flag changes, wallet actions, or state-changing transactions.

## Purpose

This file gives outside reviewers one deterministic path to verify the repository locally without relying on hosted GitHub Actions and without touching mainnet.

## Current Canonical Posture

- Project state: parked
- Deployment execution: false
- Broadcast execution: false
- Mainnet cutover approval granted: false
- Mainnet cutover executed: false
- State-changing transaction executed: false
- Hosted CI success is not claimed as canonical truth
- Local deterministic verification is the reviewer baseline

## Prerequisites

- Linux shell environment
- Git
- Node.js 22.x
- npm 10.x
- No private keys required
- No funded wallet required
- No .env secrets required for read-only audit

## Fresh Clone Setup

```bash
git clone --recurse-submodules https://github.com/onenoly1010/Quantum-pi-forge.git
cd Quantum-pi-forge
git submodule sync --recursive
git submodule update --init --recursive
npm ci
```

## One-Command Local Audit

```bash
npm run audit:full-local
```

## Manual Local Verification Path

```bash
npm run build
npm run governance:audit-hardening-readiness:v1:check
npm run governance:pr-251-hosted-ci-failure-opacity:v1:check
npm run governance:pr-251-post-merge:v1:check
npm run autonomous:mainnet-cutover-command-hash:v1:check
npm run autonomous:mainnet-cutover-final-operator-approval:v1:check
npm run governance:pr-243-post-merge:v1:check
```

## Hosted CI Guidance

GitHub-hosted checks may fail or be opaque due to platform, billing, runner, or environment drift. Hosted CI failure is not hidden and is not treated as canonical proof.

Reviewers should treat local deterministic verification, committed receipts, and verifier scripts as the primary audit surface.

## Reviewer Allowed Actions

- Clone the repository
- Inspect receipts and verifier scripts
- Run local build and local verification commands
- Open issues or PR comments with findings
- Verify that non-execution flags remain false

## Reviewer Forbidden Actions

- Do not deploy
- Do not broadcast
- Do not run wallet-funded actions
- Do not flip mainnet approval flags
- Do not perform state-changing transactions
- Do not add private keys, seed phrases, or secrets
- Do not reinterpret hosted CI failure as hosted CI success

## Reviewer Focus Areas

1. Non-transferable state-transition proof semantics
2. Local-first deterministic verification
3. Hosted CI opacity handling
4. No unauthorized cloud fallback
5. Dependency and submodule pinning
6. Receipt integrity and verifier coverage
7. Mainnet cutover remains parked until explicit approval

## Key Audit Files

- docs/governance/AUDIT_HARDENING_READINESS_V1.md
- docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md
- docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_251.md
- receipts/governance/audit-hardening-readiness-v1.json
- receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json
- receipts/governance/pr-251-post-merge-governance-receipt-v1.json
- scripts/verify-audit-hardening-readiness-v1.cjs
- scripts/verify-pr-251-hosted-ci-failure-opacity-boundary-v1.cjs
- scripts/verify-pr-251-post-merge-governance-receipt-v1.cjs

## Expected Audit Result

A clean local audit should produce PASS results for the listed verifier scripts and a successful static build.

The expected conclusion is not production readiness. The expected conclusion is that the repository is parked, locally verifiable, and ready for deeper audit without execution.
