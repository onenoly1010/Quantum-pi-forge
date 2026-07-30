# Hosting: Cloudflare only (no Vercel required)

Status: OPERATIONAL_POLICY  
Created: 2026-07-30

## Production

| Surface | Host | Repo |
|---------|------|------|
| Public site | **Cloudflare Pages** → https://quantumpiforge.com | `onenoly1010/Quantum-pi-forge` |
| Build output | `npm run build` → `out/` | this repo |
| Deploy helper | `npm run deploy:cf` | `scripts/deploy-cloudflare-pages.sh` |

## Vercel

**Not required** for Quantum Pi Forge production.

- Historical `*.vercel.app` links in older docs or satellite repos are **not** the production site.
- Do not re-enable a Vercel account solely for CI green checks.
- Frontend lane cleanup: `onenoly1010/quantum-pi-forge-fixed` (identity + Vercel decommission PRs).

## Satellites (optional cleanup)

| Repo | Old homepage pattern | Preferred |
|------|----------------------|-----------|
| quantum-pi-forge-fixed | GH Pages or Vercel | GH Pages / link to quantumpiforge.com |
| pi-forge-quantum-genesis | `*.vercel.app` | Archive notice → Quantum-pi-forge |
| quantum-pi-forge-site / ignited | `*.vercel.app` | Archive or redirect to quantumpiforge.com |

## Safety

No wallet, mint, liquidity, staking, or bridge activation.
