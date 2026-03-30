# Cloudflare Cutover Runbook (quantumpiforge.com)

## Status
- Vercel site is paused.
- Repo is now prepared for Cloudflare Pages static deploy:
  - `next.config.js` supports Cloudflare target via `DEPLOY_TARGET=cloudflare-pages`
  - `wrangler.toml` points to `pages_build_output_dir = "out"`
  - `npm run build:cf` produces static `out/`

## 1) Fix Cloudflare auth locally

Your current token appears to be a placeholder (`your***here`).

Set a real token with these minimum scopes:
- Account: `Cloudflare Pages:Edit`
- Zone (`quantumpiforge.com`): `Zone:Read`, `DNS:Edit`

```bash
export CLOUDFLARE_API_TOKEN="<real_cloudflare_api_token>"
wrangler whoami
```

Expected: successful account output (no Authorization header errors).

## 2) Build + deploy to Cloudflare Pages

```bash
cd /home/kris/forge/Quantum-pi-forge
npm run build:cf
wrangler pages project create quantumpiforge --production-branch main || true
npm run deploy:cf
```

Capture the deployment URL returned by Wrangler (e.g. `https://<hash>.quantumpiforge.pages.dev`).

## 3) Attach production custom domain

```bash
wrangler pages domain add quantumpiforge.com --project-name quantumpiforge
wrangler pages domain add www.quantumpiforge.com --project-name quantumpiforge
```

If DNS records are required, create/adjust records in Cloudflare DNS as prompted.

## 4) Validate before traffic cutover

```bash
curl -I https://quantumpiforge.com
curl -I https://www.quantumpiforge.com
```

Check:
- 200/301 responses expected
- content served from Cloudflare Pages

## 5) Decommission Vercel for this domain

After Cloudflare serves correctly:
- Remove `quantumpiforge.com` and `www` from Vercel project domains
- Keep Vercel project archived/disabled for rollback window

## Rollback

If urgent rollback needed:
1. Re-attach domain in Vercel
2. Revert DNS records to Vercel target
3. Confirm `curl -I` returns expected Vercel response
