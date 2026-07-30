# Day 1 Autonomy Package v1

**Delivered:** 2026-07-30  
**Posture:** `NO_WALLET_TOUCH=true` — no signing, no fund movement, no keys.

## Package

| Item | Path |
| --- | --- |
| Maturity doc | [`docs/autonomy-maturity.md`](../../autonomy-maturity.md) |
| KPI snapshot | `scripts/kpi_snapshot.cjs` |
| Queue unstick + safe wallet preflight lane | `scripts/living-forge/scheduler.cjs` |
| KPI report (generated) | `docs/activation/living-forge/reports/kpi-latest.md` |
| KPI JSON home | `~/.forge-daemon/kpi/` |

## Commands

```bash
# Full Day-1 verification (unstick + KPI)
npm run autonomy:day1

# Individual
npm run living-forge:unstick-claims
npm run living-forge:wallet-preflight:safe
npm run kpi:snapshot
npm run kpi:snapshot:stdout
```

## Optional daily cron (local — preferred over GitHub Actions)

Hosted Actions may be billing/platform-limited. Local cron is authoritative for KPI.

```cron
0 8 * * * cd /home/kris/Quantum-pi-forge && /usr/bin/npm run kpi:snapshot >> /home/kris/.forge-daemon/kpi/cron.log 2>&1
```

## Wallet-preflight safe lane

- Task id: `P3-health-wallet-preflight`
- Runs **only** `bash scripts/security/wallet-preflight-gate-v1.sh` with **no** follow-on command
- Refuses if `NO_WALLET_TOUCH` is not `true`
- Refuses if `PRIVATE_KEY` / `DEPLOYER_PRIVATE_KEY` / `COSIGN_PRIVATE_KEY` is set
- Stale `in_progress` claims (>30 min) auto-reopen on every scheduler run

## Explicit non-claims

Does not authorize mint, liquidity, yield, deployment, or any economic activation.
