# Living Forge — RUNNING STATUS

**As of:** 2026-07-16T20:42Z

| Component | Status |
| --- | --- |
| Scheduler | `scripts/living-forge/scheduler.cjs` |
| Drain script | `scripts/living-forge/run-drain.sh` |
| systemd timer | **enabled + active** `living-forge.timer` (every 15 min) |
| Last drain | PASS (verify, build, preflight, inventories) |
| Git freeze | commit `064a899` (local; **not pushed**) |
| Funding | still PENDING secured=0 |
| Human queue | `HUMAN_ACTION_QUEUE_V1.md` |

## Check live

```bash
systemctl --user status living-forge.timer
tail -f ~/.forge-daemon/living-forge.log
npm run living-forge:drain
cat docs/activation/living-forge/HUMAN_ACTION_QUEUE_V1.md
```
