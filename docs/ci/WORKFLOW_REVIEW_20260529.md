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

## Testnet Deployment Workflow Review

The testnet deployment workflow was reviewed after production deployment hardening.

### Finding

`.github/workflows/deploy-testnet.yml` was manual-only and required a typed `testnet` confirmation, which reduced ordinary push noise.

However, the workflow still represented a noisy deployment surface if manually triggered before full environment configuration.

Specific concerns included:

- GHCR image publishing for multiple services
- mutable `testnet-latest` image tags
- Railway CLI installation without a pinned version
- dependency on `RAILWAY_TOKEN`
- Railway deployment commands documented as template placeholders
- placeholder deployment and smoke-test URLs
- manual configuration messages that could appear as failed deployment telemetry

### Decision

The workflow was archived:

- from: `.github/workflows/deploy-testnet.yml`
- to: `.github/workflows/deploy-testnet.yml.disabled`

### Rationale

Testnet deployment workflows should remain inactive until they are fully configured, deterministic, and reviewer-safe. Manual-only triggering reduces risk, but does not prevent a reviewer or operator from creating avoidable red deployment telemetry by running an incomplete pipeline.

### Restore Criteria

Restore only after:

1. Railway project and service IDs are explicitly configured.
2. Required secrets are scoped to a protected testnet environment.
3. Smoke-test URLs are real and documented.
4. Placeholder deployment commands are replaced with verified commands.
5. GHCR image tags are release-scoped or commit-scoped.
6. The workflow can complete successfully from a clean checkout.


## Rollback Workflow Review

The rollback workflow was reviewed after production and testnet deployment workflows were archived.

### Finding

`.github/workflows/rollback.yml` was manual-only and required a typed rollback confirmation, which reduced accidental execution risk.

However, rollback workflows represent a high-impact operational safety surface. If the workflow relies on placeholder Railway commands, floating CLI installs, missing deployment IDs, or manual verification steps, it can create misleading failure telemetry and provide a false sense of recovery readiness.

### Decision

The workflow was archived:

- from: `.github/workflows/rollback.yml`
- to: `.github/workflows/rollback.yml.disabled`

### Rationale

Rollback automation should not remain active unless it is deterministic, environment-protected, and verified against real deployment state. A partially configured rollback action is riskier than an explicitly documented manual recovery procedure.

### Restore Criteria

Restore only after:

1. Railway project and service targets are explicitly configured.
2. Rollback targets are resolved from verified deployment records.
3. Required secrets are scoped to a protected rollback environment.
4. Railway CLI versioning is pinned or otherwise controlled.
5. Health checks and smoke tests use real documented endpoints.
6. The workflow has been tested against a non-production rollback target.

## 0G DEX Deployment Workflow Review

The 0G DEX deployment workflow was reviewed after rollback workflow archival.

### Finding

`.github/workflows/deploy-0g-dex.yml` represented a high-optics on-chain deployment surface because it referenced 0G and DEX deployment behavior from the active workflow set.

Any workflow that deploys or verifies DEX infrastructure can imply wallet signing, liquidity routing, contract deployment, or privileged RPC access. If not fully hardened, this creates unnecessary reviewer risk for the current OINIO grant-review scope.

### Decision

The workflow was archived:

- from: `.github/workflows/deploy-0g-dex.yml`
- to: `.github/workflows/deploy-0g-dex.yml.disabled`

### Rationale

0G DEX deployment automation should remain inactive unless it is explicitly in-scope, deterministic, environment-protected, and verified against the current deployment state. Leaving experimental or roadmap deployment workflows active creates avoidable security and telemetry noise.

### Restore Criteria

Restore only after:

1. The DEX deployment scope is confirmed as current and grant-relevant.
2. All RPC and wallet secrets are scoped to protected environments.
3. Deployment scripts are present and verified from a clean checkout.
4. Contract addresses and chain IDs are documented.
5. Mainnet execution is explicitly gated.
6. Dry-run or testnet execution is proven before any live deployment path is enabled.
