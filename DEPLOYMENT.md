# Deployment Notes

> **📌 Note**: This document is part of the deployment documentation suite.  
> For the complete deployment guide, see the **[Deployment Dashboard](docs/DEPLOYMENT_DASHBOARD.md)**.

## Cloudflare Pages Deployment
## ⚠️ Important: Repository Purpose

**This repository is a COORDINATION HUB, not a deployable application.**

This repo serves as:
- Governance and documentation center for the Quantum Pi Forge ecosystem
- Coordination space for multi-repo workflows
- GitHub Agent operational base
- Canon of Autonomy preservation

**For production deployments, refer to the appropriate service repositories:**
- **Public Site**: `quantum-pi-forge-site` → GitHub Pages
- **Coordination Interfaces**: This repo → Cloudflare Pages
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
2. Copies static HTML and JavaScript assets into `out/`
3. Copies `_headers` for Cloudflare edge response headers
4. Generates `_redirects` to route `/api/*` and `/health` to the canonical backend

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
```

The `out/` directory will contain all deployable assets for Cloudflare Pages.

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
