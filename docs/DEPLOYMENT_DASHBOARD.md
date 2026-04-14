# Deployment Dashboard

This is the active deployment reference for the root `Quantum-pi-forge` workspace.

## Platform Model

- **Cloudflare Pages** hosts the static coordination site for this repo.
- **Cloudflare edge routing** uses `_redirects` generated during the build.
- **Canonical upstream API** remains `https://pi-forge-quantum-genesis.railway.app` until backend migration is completed.
- **Supabase** remains the data layer where applicable.

## Build And Deploy

```bash
npm install
npm run build
wrangler pages deploy out --project-name quantumpiforge
```

The root build now:

- writes assets to `out/`
- copies `_headers`
- generates `out/_redirects`
- removes the old Vercel-specific output path

## Required Secrets

For local agents:

- `OPENAI_API_KEY`
- `GITHUB_TOKEN`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT`

Recommended local routing values:

- `CANONICAL_BACKEND_URL`
- `HEALTHCHECK_URL`

## Validation

Run these before deploys:

```bash
npm run doctor:env
npm run build
pytest tests/test_cloudflare_build.py
```

## Current Hosting Direction

The root repo no longer supports Vercel as an active deployment target.

Remaining upstream services should be treated as transitional dependencies, not frontend hosting decisions. If a file still points to Vercel in this root repo, it should be considered drift unless it is a historical record.

