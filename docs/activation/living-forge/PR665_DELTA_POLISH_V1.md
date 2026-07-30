# PR #665 delta polish v1

Follow-up polish on Day 1–3 autonomy stack. **Does not re-implement Day 3.**

## Changes

| Item | Change |
| --- | --- |
| Queue residue | Canonical seed `queue-state.seed.json`; runtime `queue-state-v1.json` bootstrap + `--seed-reset` |
| Generated reports | `reports/kpi-latest.md`, `eod-*.md` gitignored (not source of truth) |
| Portable ROOT | `pulse-15m.sh` / `run-drain.sh` resolve repo root from script path |
| Systemd examples | `scripts/living-forge/systemd/` + `install-user-units.sh` |
| Metrics | `human_interruptions_this_session` only increments on true `ESCALATE:` policy events |

## Boundary (unchanged)

- `NO_WALLET_TOUCH=true`
- No sign / transfer / deploy / auto-merge

## Commands

```bash
npm run living-forge:seed-reset   # restore clean seed queue
npm run autonomy:day3:verify
```
