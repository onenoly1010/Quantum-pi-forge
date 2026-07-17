# Monitoring instructions v1 (after external events)

## Automatic (already running)

```bash
systemctl --user status living-forge.timer
tail -f ~/.forge-daemon/living-forge.log
# every 15m: verify, build, preflight, funding monitor
```

Funding monitor watches:

- secured ledger / funding plan
- receiving form
- grant status tracker

```bash
npm run living-forge:monitor-funding
# snapshots: docs/activation/living-forge/monitors/
```

## When Guild decides or money arrives (human)

1. Note status in one line under `docs/activation/command/grant-package/GRANT_STATUS_HUMAN.md` (create if needed).
2. Confirm payment hit **your** destination from `funding-receiving-form-v1.json`.
3. Record proof: tx hash or bank confirmation (public-safe).
4. Only then update secured ledger amounts.
5. Vehicle spend is a **separate** human decision after funds are secured.

## Alerts to watch in monitor JSON

- `SECURED_TOTAL_POSITIVE`
- `DESTINATION_CONFIGURED`
- `RECEIVE_AUTH_PRESENT`
- `DESTINATION_STILL_UNSET`
