# GitHub Actions Workflow Review

**Project:** OINIO / Quantum Pi Forge
**Date:** 2026-05-29
**Status:** CI/deploy workflow noise reduced.

## Cloudflare Deployment Workflow Review

Duplicate Cloudflare Pages deployment workflows were found.

- Active canonical workflow: `.github/workflows/cloudflare-pages.yml`
- Archived duplicate workflow: `.github/workflows/deploy-cloudflare.yml.disabled`

The archived duplicate used Node 20 and `npm install`, while the canonical workflow uses Node 22, `npm ci`, builds static output, verifies Pages artifacts, and deploys `out/`.

## Escrow Deployment Workflow Review

The escrow deployment workflow was reviewed after the Cloudflare cleanup.

### Finding

`.github/workflows/deploy-escrow.yml` was not triggered by ordinary pushes to `main`; it only ran manually or on broad version tags like `v*.*.*`.

However, the workflow referenced a missing deployment script:

- `scripts/deploy-escrow.sh`

It also required deployment secrets:

- `RPC_URL`
- `DEPLOYER_PRIVATE_KEY`

### Decision

The incomplete escrow deployment workflow was archived:

- from: `.github/workflows/deploy-escrow.yml`
- to: `.github/workflows/deploy-escrow.yml.disabled`

### Rationale

Escrow or on-chain deployment workflows should not remain active when their deployment script is missing. Even a manual run or version-tag trigger would fail and create misleading red CI/deployment telemetry.

### Restore Criteria

Restore only after:

1. `scripts/deploy-escrow.sh` exists.
2. Required secrets are configured.
3. A dry-run mode exists.
4. Testnet execution is verified.
5. Mainnet execution is explicitly gated.

## Current Recommended Workflow Roles

| Workflow | Role | Status |
|---|---|---|
| `cloudflare-pages.yml` | Canonical Cloudflare Pages build/deploy | Active |
| `test-and-build.yml` | Branch and PR build verification | Active |
| `cloudflare-pages-status.yml` | PR Pages build artifact check | Active |
| `ci-healthcheck.yml` | Optional Python/FastAPI health check | Active |
| `deploy-cloudflare.yml.disabled` | Legacy duplicate Cloudflare deploy | Archived |
| `deploy-escrow.yml.disabled` | Incomplete escrow/on-chain deploy | Archived |

## Follow-up Review Targets

- `deploy-production.yml`
- `deploy-testnet.yml`
- `rollback.yml`
- `apply-branch-protection.yml`
- `dependabot-auto-merge.yml`

## Conclusion

Duplicate or incomplete deployment paths have been archived while preserving the canonical Cloudflare Pages deployment workflow.
