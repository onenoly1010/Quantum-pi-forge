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

## Production Deployment Workflow Review

The production deployment workflow was reviewed after Cloudflare and escrow workflow cleanup.

### Finding

`.github/workflows/deploy-production.yml` was manual-only through `workflow_dispatch`, which prevented ordinary push noise.

However, the workflow still represented a high-impact production deployment surface because it:

- built and pushed GHCR images
- published a mutable `latest` image tag
- installed Railway CLI using floating `@latest`
- deployed directly to Railway using `RAILWAY_TOKEN`
- used a hardcoded production health endpoint
- mutated submodules inside CI using `git checkout main` and `git pull origin main`

The submodule mutation was the primary determinism concern. A production workflow should deploy the exact reviewed commit and pinned submodule state, not pull fresh submodule `main` branches during deployment.

### Decision

The workflow was archived:

- from: `.github/workflows/deploy-production.yml`
- to: `.github/workflows/deploy-production.yml.disabled`

### Rationale

Production deployment should remain unavailable until the workflow is deterministic, explicitly confirmed, and environment-protected. Manual-only triggering is necessary but not sufficient for production safety.

### Restore Criteria

Restore only after:

1. Submodules are verified but not mutated during CI.
2. Railway CLI versioning is pinned or otherwise controlled.
3. Production deploy requires an explicit confirmation input.
4. GHCR tags are immutable or release-scoped instead of relying on `latest`.
5. Health checks are aligned with the actual production service and failure policy.
6. `RAILWAY_TOKEN` is scoped to the protected production environment.

### Recommended Future Trigger

The restored workflow should remain manual-only and require an explicit typed confirmation such as `DEPLOY-PRODUCTION`.
