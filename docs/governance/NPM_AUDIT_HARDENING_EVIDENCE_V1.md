# NPM Audit Hardening Evidence v1

## Status

This document records the npm audit hardening investigation performed from canonical main head `a6738ce`.

This lane is evidence-only. It does not claim that all npm audit findings were resolved.

## Baseline

- Canonical head: `a6738ce75f7d2d9f6a0279b1852500fca3e2a6f2`
- Cross-platform determinism: PASS before mutation
- Current public status handoff v1: PASS
- Evidence bundle: PASS
- Execution receipt present: false

## Audit finding

The audit reports 3 high-severity findings in the dev tooling chain:

- `esbuild`
- `tsx`
- `wrangler`

Observed dependency path:

- `hardhat@3.9.0 -> tsx@4.21.0 -> esbuild@0.27.7`
- `wrangler@4.98.0 -> esbuild@0.27.3`

Audit advisory range:

- `esbuild >=0.17.0 <0.28.1`

## Remediation attempts

### Attempt 1: npm-suggested Wrangler downgrade path

The audit suggested `wrangler@3.6.0`.

This was not accepted as a safe fix path because the install attempted to build an older native dependency chain and failed on Node 22 through `better-sqlite3`.

### Attempt 2: modern Wrangler v4 update

A targeted update from `wrangler@4.98.0` to `wrangler@4.100.0` installed and built successfully, but it did not reduce the npm audit count.

Because it did not reduce the reported risk, the mutation was reverted.

## Final posture

No dependency mutation is committed in this evidence lane.

The finding remains open and documented as a dev-tooling dependency-chain audit issue. Further remediation should wait for one of the following:

1. Upstream `wrangler`, `hardhat`, or `tsx` releases that pull `esbuild >=0.28.1`.
2. A narrowly tested override that does not break `hardhat`, `wrangler`, build, or governance verification.
3. A future dedicated package-maintenance lane with explicit acceptance of dependency-tree risk.

## Boundary

This lane does not perform activation, deployment, broadcast, key handling, unpark, runner execution, or on-chain execution.

