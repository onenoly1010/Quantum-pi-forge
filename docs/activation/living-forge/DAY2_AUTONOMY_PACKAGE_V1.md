# Day 2 Autonomy Package v1

**Posture:** `NO_WALLET_TOUCH=true` — continuous 15m pulse, no signing/spend.

## What shipped

| Area | Artifact |
| --- | --- |
| Thresholds | `scripts/living-forge/kpi-thresholds.json` |
| Policy gate | `scripts/living-forge/policy-gate.cjs` |
| Events | `scripts/living-forge/events.cjs` → `artifacts/kpi/events/` |
| Operator view | `scripts/living-forge/operator-view.cjs` |
| 15m pulse | `scripts/living-forge/pulse-15m.sh` + `qpf-autonomy-pulse.timer` |
| Claim lease | 15m TTL, auto-requeue, idempotency key, dead-letter after 5 fails |
| KPI outputs | `artifacts/kpi/latest.json`, `artifacts/kpi/history/<ts>.json` |
| EOD summary | `npm run autonomy:eod` |

## Commands

```bash
# Manual pulse
npm run autonomy:pulse

# 3 pulses for DoD verification
npm run autonomy:day2:verify

# Simulate stuck claim recovery
npm run living-forge:simulate-stuck-recovery

# Enable continuous 15m (user systemd examples in-repo)
bash scripts/living-forge/systemd/install-user-units.sh
systemctl --user status qpf-autonomy-pulse.timer
```

## Safety

- Global `NO_WALLET_TOUCH=true`
- Policy gate allowed-list + sensitive keyword escalation
- Key env vars unset in pulse/drain shells
- Zero economic / sign / transfer execution

## Definition of done

1. 15m timer active  
2. ≥3 successful pulses  
3. Simulated stuck claim auto-recovers  
4. Zero sensitive actions  
5. EOD summary written  
