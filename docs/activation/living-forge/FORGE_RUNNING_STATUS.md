# Living Forge — RUNNING STATUS

**Mode:** Event-driven standby (not fixed 15m thrash)

| Component | Status |
| --- | --- |
| `living-forge-event.service` | Persistent event loop |
| `living-forge.timer` | Disabled when event loop preferred |
| Wake on | git refs, docs/activation, spiral receipts, grant tracker, living-forge scripts |
| On wake | funding monitor + P3 drain |
| Idle | inotify wait (no work if no change) |
| Safety pulse | max 2h if no events |
| Authorization | FOUNDER_OPERATIONAL_AUTHORIZATION_V1 ACTIVE |

```bash
systemctl --user status living-forge-event.service
tail -f ~/.forge-daemon/living-forge-event.log
```

Human queue: `HUMAN_ACTION_QUEUE_V1.md` (by control).
