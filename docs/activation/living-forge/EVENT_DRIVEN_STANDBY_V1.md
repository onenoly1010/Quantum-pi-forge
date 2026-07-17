# Living Forge — Event-Driven Standby v1

## Behavior

```
while true
  monitor repo / docs / grant tracker / spiral receipts / living-forge scripts
  if state_changes:
    execute_next_authorized_task (drain + funding monitor)
  else:
    sleep (inotify wait)
  never terminate (systemd Restart=always)
  never ask unless P0: signature / payment / legal
```

**Idle** = nothing observable changed.  
**Wake** = filesystem or git-ref change (or 2h safety timeout).

## Services

| Unit | Role |
| --- | --- |
| `living-forge-event.service` | Persistent event loop (preferred) |
| `living-forge.timer` | Optional safety net; can be disabled if event loop is healthy |

## Commands

```bash
systemctl --user enable --now living-forge-event.service
systemctl --user status living-forge-event.service
journalctl --user -u living-forge-event.service -f
tail -f ~/.forge-daemon/living-forge-event.log
```

Disable fixed 15m thrash (optional):

```bash
systemctl --user disable --now living-forge.timer
```

## Env knobs

| Env | Default | Meaning |
| --- | --- | --- |
| `LIVING_FORGE_DEBOUNCE_SEC` | 8 | Coalesce event bursts |
| `LIVING_FORGE_SAFETY_IDLE_SEC` | 7200 | Max idle before one safety pulse |

## Stop list (unchanged)

Sign · spend · transfer · broadcast · secrets · legal as Kris · delete important data.
