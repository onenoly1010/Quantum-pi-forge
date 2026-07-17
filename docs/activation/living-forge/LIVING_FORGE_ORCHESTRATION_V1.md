# Living Forge Orchestration v1

## Shift

Chat-centric assistant → **event-driven queue** with escalation.

## Components

| Component | Path |
| --- | --- |
| Persistent queue | `queue/queue-state-v1.json` |
| Scheduler | `scripts/living-forge/scheduler.cjs` |
| Escalation policy | `ESCALATION_POLICY_V1.md` |
| Human interrupt surface | `HUMAN_ACTION_QUEUE_V1.md` |
| Heartbeats | `heartbeats/` |

## Commands

```bash
npm run living-forge:seed    # ensure default tasks exist
npm run living-forge:once    # claim + run one P3 task
npm run living-forge:drain   # run all open P3 until empty
npm run living-forge:human-queue
```

Cron (example, Kris host only):

```cron
*/15 * * * * cd /home/kris/Quantum-pi-forge && npm run living-forge:drain >> /tmp/living-forge.log 2>&1
```

## Rule

**Never ask Kris what to do next if another autonomous (P3) task exists.**

When P3 empty → only `HUMAN_ACTION_QUEUE_V1.md`.

## Metrics

- autonomous_completed (in queue-state metrics)
- open P3 count → 0 after drain
- human interruptions → only P0/P1
