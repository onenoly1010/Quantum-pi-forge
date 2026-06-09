# Local CI Surrogate Verification Guide

## Purpose

This guide defines the bounded local verification path for reviewers who want to validate Quantum Pi Forge without relying first on GitHub Actions, hosted deployment logs, or external CI authority.

The local surrogate validates repository-local proof structure. It does not claim live chain settlement, wallet authority, relayer authority, funding authority, or deployment authority.

## Reviewer Command Path

Run from the repository root:

```bash
npm ci
npm run build
npm run verify:evidence-index
npm run evidence:receipt:check
npm run claim-map:check
npm run verify:evidence
```

If present, the convenience wrapper may also be run:

```bash
bash scripts/local-ci-surrogate.sh
```

The npm command chain remains the explicit reviewer-readable verification path.

## Expected Local Success Surface

- `npm ci` completes without dependency resolution failure.
- `npm run build` completes without static build failure.
- `npm run verify:evidence-index` confirms evidence index structure.
- `npm run evidence:receipt:check` confirms receipt consistency.
- `npm run claim-map:check` confirms claim-map alignment.
- `npm run verify:evidence` confirms the repository evidence path.

## Expected Non-Blocking Warnings

Warnings from optional runtime systems are not automatically proof failures.

- Missing Telegram or Twitter credentials are out of scope for documentation, build, and evidence verification.
- External RPC timeout or fallback warnings are live-network concerns unless the current lane explicitly claims telemetry stability.
- GitHub Projects/classic metadata warnings are platform-side API noise and do not invalidate local verification.

## Boundary

In scope: static build generation, evidence index integrity, evidence receipt consistency, claim-map alignment, repository evidence verification, and local reviewer reproducibility.

Out of scope: live chain settlement, active relayer execution, production wallet authority, third-party API availability, social bot credentials, hosted deployment status, and live 0G RPC uptime unless separately targeted.

## Reviewer Standard

> Do not trust the hosted surface first.
> Run the local evidence path first.

A clean local surrogate result means the repository proof surface is structurally valid locally. Remaining external warnings belong in separate runtime, credential, deployment, or telemetry lanes.
