# Living Forge — RUNNING STATUS

**Mode:** Event-driven standby — idle until new evidence  
**Local gates:** STABLE (do not re-audit on noise)  
See: `OPERATIONAL_STATE_STABLE_V1.md`

| Component | Status |
| --- | --- |
| `living-forge-event.service` | Persistent event loop |
| `living-forge.timer` | Disabled (avoid thrash) |
| Wake on | grant tracker, receiving form/command docs, spiral receipts, git refs, package.json |
| On funding-doc change | funding monitor only |
| On git/package/scripts change | full authorized drain |
| Safety pulse | max 6h if silent |
| Verified funds | CAD $0 |
| READY_TO_RECEIVE | false until destination designated |

```bash
systemctl --user status living-forge-event.service
tail -f ~/.forge-daemon/living-forge-event.log
```

Human queue: `HUMAN_ACTION_QUEUE_V1.md` (by control).
