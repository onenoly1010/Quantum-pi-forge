# Deployment Notes

> **📌 Note**: This document is part of the deployment documentation suite.  
> For the complete deployment guide, see the **[Deployment Dashboard](docs/DEPLOYMENT_DASHBOARD.md)**.

## ⚠️ Important: Repository Purpose

**This repository is a COORDINATION HUB, not a deployable application.**

This repo serves as:
- Governance and documentation center for the Quantum Pi Forge ecosystem
- Coordination space for multi-repo workflows
- GitHub Agent operational base
- Canon of Autonomy preservation

**For production deployments, refer to the appropriate service repositories:**
- **Primary landing bundle**: `deploy/` → copied into `out/` by `npm run build`
- **Cloudflare Pages output**: `out/` → configured in `wrangler.toml`
- **Backend API**: Canonical upstream service used by redirects during migration

---

## Cloudflare Pages Deployment

Cloudflare Pages is the supported static hosting target for this repository.

### Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `out`
- **Deployment Config**: `wrangler.toml`

The build process:
1. Creates `out/`
2. Copies the public landing bundle from `deploy/`
3. Copies `dao.html`, `resonate.html`, `manifest.json`, and optional legacy static assets
4. Copies `_headers` for Cloudflare edge response headers
5. Generates `_redirects` to route `/api/*` and `/health` to the canonical backend

### Environment Variables

Set these in Cloudflare Pages project settings or GitHub Actions secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT`

Optional local verification values:
- `CANONICAL_BACKEND_URL`
- `HEALTHCHECK_URL`

### Local Testing

To test the build locally:
```bash
npm install
npm run build
npm run serve:deploy
```

The `out/` directory will contain all deployable assets for Cloudflare Pages.

Before deployment, verify:

```bash
curl -I http://127.0.0.1:8100/
curl -I http://127.0.0.1:8100/dao.html
curl -I http://127.0.0.1:8100/resonate.html
```

Production deploy:

```bash
npm run deploy:cf
```

---

## Backend Integration

The root repo no longer documents Vercel or Render as active deployment targets.

Until the backend migration is complete, static Cloudflare Pages routes may still proxy to the canonical upstream API for:

- `/api/*`
- `/health`

If that upstream host changes, update:

- `.env.agent.example`
- `.env.example`
- `scripts/build.js`
- any Cloudflare Pages environment configuration
