# Cloudflare Pages deploy note v1

**Updated:** 2026-07-30T15:15:00Z  

## Working path (used for Round 1 portal)

Local deploy with Wrangler OAuth (pages:write):

```bash
DEPLOY_TARGET=cloudflare-pages NODE_ENV=production npm run build
# wrangler.toml [assets] conflicts with pages deploy validation — temporarily move aside:
mv wrangler.toml wrangler.toml.bak-pages && \
  wrangler pages deploy out --project-name=quantumpiforge --branch=main --commit-dirty=true
mv wrangler.toml.bak-pages wrangler.toml
```

**Success (2026-07-30):** production deployment `6f44baa7` · custom domain quantumpiforge.com serves Phase 8.4 COMPLETE / 8.5 Round 1 OPEN.

## Broken path (GitHub Actions)

Workflow `.github/workflows/cloudflare-pages.yml` fails:

```text
Cloudflare API returned non-200: 400
Authentication failed (status: 400) code 9106
```

**Human fix:** regenerate API token with **Cloudflare Pages:Edit** + Account read; update repo secret `CLOUDFLARE_API_TOKEN` (and confirm `CLOUDFLARE_ACCOUNT_ID` = `76b9f438eebe177707af447f29172e98`).

Optional: switch action to `cloudflare/wrangler-action` with `pages deploy` and no `[assets]` conflict.

## Boundaries

Deploy is static site only — no mint/liquidity/signing.
