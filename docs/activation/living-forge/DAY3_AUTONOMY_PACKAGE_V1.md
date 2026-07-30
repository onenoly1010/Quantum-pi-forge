# Day 3 Autonomy Package v1

**Repo:** [onenoly1010/Quantum-pi-forge](https://github.com/onenoly1010/Quantum-pi-forge)  
**Branch:** `ops/autonomy-day3-admin-p3-v1`  
**Day 1–2 status:** Implemented locally (uncommitted) on prior branch work; continued here as one autonomy stack.  
**Posture:** `NO_WALLET_TOUCH=true`

## Delivered

| # | Item | Path |
| ---: | --- | --- |
| 1 | Queue retries schema (doc + machine JSON) | `QUEUE_RETRIES_SCHEMA_V1.md`, `queue/queue-retries-schema-v1.json` |
| 2 | P3 stale-doc scan | `action: stale_doc_scan` → `artifacts/kpi/admin/stale-doc-scan-latest.json` |
| 3 | P3 open PR classify | `action: open_pr_classify` → `artifacts/kpi/admin/open-pr-classify-latest.{json,md}` |
| 4 | P3 grant-tracker diff | `action: grant_tracker_diff` → `artifacts/kpi/admin/grant-tracker-diff-latest.json` |

## Retries (enforced in scheduler)

- Fields: `risk`, `max_attempts`, `backoff_sec`, `depends_on`, `outcome`, `next_eligible_at_utc`
- Auto-claim: **low risk only**
- Failure → requeue with exponential backoff (cap 1h)
- Max attempts → `dead_letter`

## Commands

```bash
# Restore clean seed queue (wipes local runtime residue)
npm run living-forge:seed-reset

# Seed/merge task definitions into existing queue
npm run living-forge:seed

# Run admin runners directly
npm run living-forge:admin:stale-docs
npm run living-forge:admin:pr-classify
npm run living-forge:admin:grant-diff
npm run living-forge:admin:all

# Full Day-3 verify
npm run autonomy:day3:verify
```

Canonical seed: `docs/activation/living-forge/queue/queue-state.seed.json`  
Runtime state `queue-state-v1.json` is gitignored (bootstrapped from seed).

## Non-claims

- No auto-merge of PRs  
- No email/send  
- No wallet / sign / transfer / deploy  
