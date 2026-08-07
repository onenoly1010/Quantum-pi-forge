# Workstation Autonomy Profile v1

**Machine class:** ~7 GiB RAM · 2 CPU  
**Project phase:** OBSERVING (public entry live → learn from usage)  
**Policy:** `NO_WALLET_TOUCH=true` · mint/LP/financial locks held · no auto-outreach  

```text
Goal: keep QPF progressing autonomously WITHOUT thrashing the desktop.

Autonomous ≠ 24/7 LLM generation.
Autonomous = reliable health + production probes + evidence logs
             + human GO for anything external/commercial/chain.
```

---

## Roles (optimized)

| Agent / process | Role | 24/7? | Notes on this box |
| --- | --- | --- | --- |
| **Ollama serve** | Local model server | Yes (idle) | Keep; do **not** auto-load big models |
| **Living-forge event-loop** | Wake on funding/git evidence | Yes (1 instance) | Deduplicate; event-driven |
| **autonomous-progress-pulse** | Probe live pages + write status | Every **2h** | Resource-gated; skips if load/mem high |
| **qpf-autonomy-pulse** | KPI / unstick / one P3 | Every **6h** (was 15m) | Nice=15 |
| **offline-dev-guardian** | Ollama/disk health | Every **6h** (was 30m) | Light |
| **forge-daemon guardian.sh** | Heavy legacy income/provision | **Off by default** | Was flooding 40 MiB+ cron.log |
| **Grok / Copilot** | Interactive prepare only | **On demand** | Do not leave Copilot open for days |
| **Forgejo runner** | CI | Yes | Keep if you use self-hosted CI |

---

## Install / apply

```bash
cd ~/Quantum-pi-forge

# Dry-run (show plan)
bash scripts/ops/workstation-ai-optimize.sh

# Apply: lean cron, log trim, dedupe event-loop, slow pulse, one probe
bash scripts/ops/workstation-ai-optimize.sh --apply

# Also stop long-running copilot (if disposable)
bash scripts/ops/workstation-ai-optimize.sh --apply --kill-idle-copilot
```

**HALT all autonomous jobs:**

```bash
touch ~/.forge-daemon/HALT
```

Remove HALT to resume: `rm ~/.forge-daemon/HALT`

---

## What autonomy does each day

1. **Every 2h:** probe `/try.html`, `/problems/`, verification pages → `~/.forge-daemon/autonomous-progress-status.json`  
2. **Every 6h:** light living-forge pulse (if timer installed) + offline guardian  
3. **On git/funding file changes:** living-forge event-loop funding monitor (not full re-audit every noise)  
4. **Never without human GO:** outreach, mint, LP, payment claims, git push of product changes  

---

## What advances the project now

| Do autonomously | Needs human |
| --- | --- |
| Detect broken public entry pages | Fix + deploy |
| Log that locks still held | Change locks |
| Surface “next_action” in status JSON | Invite / content SEO |
| Keep ollama healthy | Load heavy models for work |

Phase focus remains:

```text
find → understand → try → request → "what does it cost?"
```

---

## Resource rules (hard)

| Condition | Behavior |
| --- | --- |
| Load ≥ 6 | Progress pulse **skips** |
| MemAvailable &lt; 800 MiB | Progress pulse **skips** |
| Cron log &gt; 2 MiB | Trimmed |
| Multiple event-loops | Kill extras (keep oldest) |

---

## Status files

| Path | Content |
| --- | --- |
| `~/.forge-daemon/autonomous-progress-status.json` | Last probe + next_action |
| `~/.forge-daemon/autonomous-progress.log` | Pulse log |
| `~/.forge-daemon/crontab.backup.*` | Pre-optimize crontab |

```text
Optimize for: OBSERVING + stability on 7GiB
Not for: 24/7 multi-agent codegen
```
