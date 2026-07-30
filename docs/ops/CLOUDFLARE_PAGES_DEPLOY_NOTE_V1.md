# Cloudflare Pages deploy note v1

**Updated:** 2026-07-30T18:30:00Z  

## Diagnosis (error 9106)

```text
API returned: {"success":false,"errors":[{"code":9106,"message":"Authentication failed (status: 400)"}]}
Error: Failed to get Pages project, API returned non-200
```

| Layer | Status |
|-------|--------|
| `npm run build` / artifact checks | **Healthy** (not a code build failure) |
| `cloudflare/pages-action@v1` | **Fails** — invalid / revoked / wrong `CLOUDFLARE_API_TOKEN` |
| Local Wrangler OAuth deploy | **Works** (workaround until Actions secret is fixed) |

This is a **credentials** issue only. It often appears after mass key rotation if `CLOUDFLARE_API_TOKEN` was never re-set in GitHub Actions.

## Fix — new token → GH secret → re-run

### 1. Create Cloudflare API token

1. https://dash.cloudflare.com/profile/api-tokens  
2. **Create Token** → template **Edit Cloudflare Pages**  
   (or Account → Cloudflare Pages → **Edit**, plus Account → **Read** if needed)  
3. Account resources: include account `76b9f438eebe177707af447f29172e98`  
4. Copy the token once (not committed, not pasted into chat)

### 2. Set GitHub Actions secrets (hub repo only)

```bash
# Preferred: local helper (never echoes values)
# Edit ~/.qpf-secrets/rotation.env and set:
#   CLOUDFLARE_API_TOKEN=<new>
#   CLOUDFLARE_ACCOUNT_ID=76b9f438eebe177707af447f29172e98
~/.qpf-secrets/set-gh-secrets.sh

# Or one-shot (your terminal — paste at prompt, not in chat):
read -rsp 'CLOUDFLARE_API_TOKEN: ' VAL
echo
printf '%s' "$VAL" | gh secret set CLOUDFLARE_API_TOKEN -R onenoly1010/Quantum-pi-forge
unset VAL
printf '%s' '76b9f438eebe177707af447f29172e98' | \
  gh secret set CLOUDFLARE_ACCOUNT_ID -R onenoly1010/Quantum-pi-forge
```

UI: https://github.com/onenoly1010/Quantum-pi-forge/settings/secrets/actions  

Confirm names exist:

```bash
gh secret list -R onenoly1010/Quantum-pi-forge
# expect CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID
```

### 3. Re-run Deploy to Cloudflare Pages

```bash
# Latest failed main deploy
gh run list -R onenoly1010/Quantum-pi-forge \
  --workflow "Deploy to Cloudflare Pages" --branch main --limit 3

gh run rerun <RUN_ID> -R onenoly1010/Quantum-pi-forge --failed
# or: Re-run all jobs in the Actions UI
```

Success criteria: workflow green; `pages-action` no longer returns 9106.

## Working path (local workaround)

If Actions is still red, deploy from a machine with Wrangler OAuth:

```bash
DEPLOY_TARGET=cloudflare-pages NODE_ENV=production npm run build
# wrangler.toml [assets] conflicts with pages deploy validation — temporarily move aside:
mv wrangler.toml wrangler.toml.bak-pages && \
  wrangler pages deploy out --project-name=quantumpiforge --branch=main --commit-dirty=true
mv wrangler.toml.bak-pages wrangler.toml
```

**Success (2026-07-30):** production deploys via local Wrangler; custom domain quantumpiforge.com live for portal wording.

## Boundaries

Deploy is static site only — no mint/liquidity/signing.
