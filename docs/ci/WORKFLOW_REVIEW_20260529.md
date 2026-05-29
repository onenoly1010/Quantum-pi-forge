# GitHub Actions Workflow Review

**Project:** OINIO / Quantum Pi Forge  
**Date:** 2026-05-29  
**Status:** CI/deploy workflow noise reduced.

## Summary

The workflow inventory identified duplicate Cloudflare Pages deployment workflows:

1. `.github/workflows/cloudflare-pages.yml`
2. `.github/workflows/deploy-cloudflare.yml`

Both used the display name `Deploy to Cloudflare Pages`, but only `cloudflare-pages.yml` is the canonical active workflow for this repository.

## Decision

The duplicate manual workflow was archived:

- from: `.github/workflows/deploy-cloudflare.yml`
- to: `.github/workflows/deploy-cloudflare.yml.disabled`

The canonical active Cloudflare workflow remains:

- `.github/workflows/cloudflare-pages.yml`

## Rationale

Keeping two Cloudflare deployment workflows increases review noise and creates ambiguity over which one represents production deployment.

The canonical workflow:

- uses Node 22
- uses `npm ci`
- runs `npm run build`
- verifies `out/index.html` and `out/_redirects`
- deploys `out/` to Cloudflare Pages
- is triggered by relevant pushes to `main`
- remains manually runnable through `workflow_dispatch`

The archived duplicate workflow:

- used Node 20
- used `npm install`
- duplicated the deployment destination
- carried repository-specific comments from an older/alternate Cloudflare migration path
- was manual-only and not necessary for normal deployment review

## Current Recommended Workflow Roles

| Workflow | Role | Status |
|---|---|---|
| `cloudflare-pages.yml` | Canonical Cloudflare Pages build/deploy | Active |
| `test-and-build.yml` | Branch and PR build verification | Active |
| `cloudflare-pages-status.yml` | PR Pages build artifact check | Active |
| `ci-healthcheck.yml` | Optional Python/FastAPI health check | Active |
| `deploy-cloudflare.yml.disabled` | Legacy duplicate Cloudflare deploy | Archived |

## Follow-up Review Targets

Further workflow cleanup should inspect:

- `deploy-escrow.yml`
- `deploy-production.yml`
- `deploy-testnet.yml`
- `rollback.yml`
- `apply-branch-protection.yml`
- `dependabot-auto-merge.yml`

These workflows are more sensitive because they reference external services, privileged GitHub API operations, Railway, or deployment rollback semantics.

## Conclusion

The duplicate Cloudflare deployment path has been archived while preserving the canonical Pages deployment workflow. This reduces CI/deploy ambiguity without weakening the public deployment path.
