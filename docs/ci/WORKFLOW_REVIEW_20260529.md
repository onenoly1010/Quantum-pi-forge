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

## Deployment Verification Workflow Review

The deployment verification workflow was reviewed after 0G DEX deployment workflow archival.

### Finding

`.github/workflows/verify-deployments.yml` is a manual verification workflow. Unlike deployment workflows, it can provide useful audit evidence if it remains read-only and deterministic.

### Decision

The workflow remains active only if its referenced verification scripts exist, avoid transaction broadcasting, and operate as read-only state checks.

### Hardening Applied

- Foundry toolchain version was changed from `nightly` to `stable` to reduce upstream drift risk.

### Ongoing Requirements

1. Verification scripts must not broadcast transactions.
2. Verification must not require wallet private keys.
3. Missing verification paths must fail clearly.
4. Reports may be uploaded as artifacts, but deployment state must not be mutated.
5. Any mainnet verification must remain manual-only.

## Rollback Validation Workflow Review

The rollback validation workflow was reviewed after the rollback execution workflow was archived.

### Finding

`.github/workflows/validate-rollback.yml` remained active after `.github/workflows/rollback.yml` was disabled.

Rollback validation logic should not outlive the rollback execution path it validates unless it independently verifies a current local recovery mechanism.

### Decision

The workflow was archived:

- from: `.github/workflows/validate-rollback.yml`
- to: `.github/workflows/validate-rollback.yml.disabled`

### Rationale

Keeping rollback validation active after rollback execution is disabled can create ghost-gate telemetry and reviewer confusion. Validation workflows should map to active, supported operational paths.

### Restore Criteria

Restore only after:

1. A supported rollback or recovery workflow is reintroduced.
2. Referenced rollback scripts exist and are tested.
3. Validation checks are deterministic and do not require privileged secrets.
4. The workflow validates current recovery behavior rather than archived Railway templates.
5. Trigger behavior is limited to manual or clearly relevant file-path changes.

## Dependabot Auto-Merge Workflow Review

The Dependabot auto-merge workflow was reviewed after deployment and rollback workflow cleanup.

### Finding

`.github/workflows/dependabot-auto-merge.yml` represented an unattended repository mutation surface because dependency updates can introduce third-party code changes into the default branch.

Automated dependency merging treats green CI as sufficient evidence of safety. For a sovereign infrastructure repository, dependency changes should remain human-reviewed unless deep runtime and supply-chain validation are in place.

### Decision

The workflow was archived:

- from: `.github/workflows/dependabot-auto-merge.yml`
- to: `.github/workflows/dependabot-auto-merge.yml.disabled`

### Rationale

Dependency updates are supply-chain ingress points. They should not be merged automatically into `main` without explicit human review, especially while dependency vulnerabilities are still being documented and triaged.

### Restore Criteria

Restore only after:

1. Auto-merge is limited to tightly scoped patch updates.
2. Required CI checks include build, test, audit, and runtime smoke validation.
3. Major and minor dependency updates require human review.
4. Permissions are minimized.
5. The workflow cannot approve or merge arbitrary pull requests.

## Release-on-Merge Workflow Review

The release-on-merge workflow was reviewed after Dependabot auto-merge was archived.

### Finding

`.github/workflows/release-on-merge.yml` represented an unattended repository mutation surface because release automation can create tags, release records, and externally visible project artifacts.

Automated release creation on ordinary merges can pollute version history and create confusing reviewer telemetry, especially when commits are documentation, workflow cleanup, or audit-only changes.

### Decision

The workflow was archived:

- from: `.github/workflows/release-on-merge.yml`
- to: `.github/workflows/release-on-merge.yml.disabled`

### Rationale

Releases should represent deliberate semantic milestones, not automatic side effects of every merge to `main`. Release automation should remain inactive until it is manual, scoped, and pinned.

### Restore Criteria

Restore only after:

1. The workflow is manual-only or tag-triggered.
2. Releases are created as drafts unless explicitly approved.
3. Third-party actions are pinned to immutable commit SHAs.
4. Version tags are semantic and milestone-based.
5. `contents: write` is limited to the release job that requires it.
6. Documentation-only and workflow-only commits do not trigger release creation.

## FastAPI Auto-Fix Workflow Review

The FastAPI auto-fix workflow was reviewed after release automation was archived.

### Finding

`.github/workflows/auto-fix-fastapi.yml` represented an automated repository mutation surface because it could create commits, push branches, or open pull requests with generated code changes.

Automated formatter or fixer workflows can be useful, but they should not mutate repository state unless dependencies are pinned, triggers are narrow, and the workflow cannot loop on its own generated changes.

### Decision

The workflow was archived:

- from: `.github/workflows/auto-fix-fastapi.yml`
- to: `.github/workflows/auto-fix-fastapi.yml.disabled`

### Rationale

Formatting and lint corrections should preferably run as deterministic check-only gates. Developer-local fixes preserve authorship and avoid CI-generated mutation noise.

### Restore Criteria

Restore only after:

1. Formatter and fixer dependencies are pinned.
2. The workflow runs on narrow, relevant paths.
3. The workflow cannot push directly to protected branches.
4. Generated changes are proposed only through clearly labeled pull requests.
5. The workflow avoids infinite PR/update loops.
6. Check-only enforcement is considered as the default alternative.

## Canon Auto-Merge Workflow Review

The canon auto-merge workflow was reviewed after automated dependency and release mutation workflows were archived.

### Finding

`.github/workflows/canon-auto-merge.yml` represented a privileged repository mutation surface because it could merge pull requests using automation.

Canon workflows may be core governance infrastructure, but auto-merge authority must be narrowly gated by deterministic validation, conflict checks, trusted labels, and branch protection.

### Decision

The auto-merge executor was archived:

- from: `.github/workflows/canon-auto-merge.yml`
- to: `.github/workflows/canon-auto-merge.yml.disabled`

### Rationale

Canon validation can remain active as a read-only or comment-only proof system, but automatic merge authority should remain disabled unless its trust boundary is fully documented and enforced.

### Restore Criteria

Restore only after:

1. Auto-merge is limited to canon-only paths.
2. Required validation and conflict checks are mandatory.
3. Merge labels can only be applied by trusted maintainers.
4. The workflow cannot merge arbitrary code changes.
5. Permissions are minimized to the final merge job.
6. Branch protection requires the canon validation suite before merge.
