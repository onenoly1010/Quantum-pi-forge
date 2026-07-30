# Local AI Autonomy Maturity v1

**Mode:** STATUS + ROADMAP — not an unlock, not commercial activation  
**Project:** Quantum Pi Forge / Living Forge  
**Recorded:** 2026-07-30  
**Wallet posture:** `NO_WALLET_TOUCH=true` (standing)

---

## 0–5 maturity scale

| Score | Name | Meaning |
| ---: | --- | --- |
| 0 | Chat only | Human asks; model answers; no background work |
| 1 | Manual workflows + checklists | Runbooks exist; human drives every step |
| 2 | Scheduled automations | Cron/timers/health pulses without decision loop |
| 3 | Event-driven agent + approvals | Observe → act low-risk; escalate high-risk |
| 4 | Mostly autonomous safe scope + KPI optimization | Outcomes measured; playbooks improve |
| 5 | Continuous self-improve + hard audits | Nightly review, strict policy engine, full report loop |

---

## Current score (evidence-based)

### Headline: **~3.0 → 3.5 (Day 2 pulse online)**

Not “chat only.” Not “fully autonomous business agent.”  
**Day 2:** 15m `qpf-autonomy-pulse.timer`, claim leases, KPI history, policy gate, EOD summary.  
**Day 3:** retries schema + admin P3 (stale-doc scan, PR classify, grant-tracker diff) on `ops/autonomy-day3-admin-p3-v1`.

| Loop step | Score slice | Evidence |
| --- | --- | --- |
| Observe | 3 | `living-forge-event.service` inotify + funding monitor + reality engine |
| Decide | 2 | Fixed P0–P4 priorities; little impact scoring |
| Act (safe) | 3 | Scheduler drain; **267+** autonomous completions (health/docs/funding snap) |
| Escalate | 3–4 | `ESCALATION_POLICY_V1.md` + P0 money/keys/legal walls |
| Learn | 1 | Heartbeats exist; no outcome→playbook loop yet |
| Report | 1–2 | Human queue refresh; no daily “while you were away” digest |

**Commercial / earn loop:** **0 by design** — protocol cashflow not authorized; verified funds CAD $0.

### Why not “1 → 2” only

- Event-driven standby is live (`living-forge-event.service`).
- Queue + P3 drain already run without you prompting “what next?”
- Guardians / Ollama / Forgejo runner provide continuous local substrate.

### Why not 4 yet

- KPI snapshot / nightly self-review / policy engine still thin (Day 1 starts this).
- Admin automation surface is mostly verify/monitor, not draft-and-ship.
- No continuous improvement against measured outcomes.

---

## Target state (next 30 days)

| Horizon | Target score | What must be true |
| --- | --- | --- |
| **Day 7** | ~3.5 | Daily KPI report, claim timeouts, policy refusals for high-risk, 3+ new admin P3 tasks |
| **Day 14** | ~3.7 | Observe→draft grant/PR docs; medium risk = human approval only |
| **Day 30** | **4.0 in safe scope** | Nightly self-review; KPI trend; interruptions ↓; P3 backlog healthy; still **zero** wallet authority |

### 30-day success metrics (ops)

| Metric | Direction |
| --- | --- |
| Human interruptions / day | ↓ |
| Autonomous tasks completed (success rate) | ↑ |
| Hours without unnecessary prompts | ↑ |
| Open P3 backlog (stale / stuck) | ↓ |
| Approval latency for P1 blockers | Tracked (human-owned) |
| Verified funds / protocol revenue | Record only; never invent |

**Not** primary metrics: receipt volume for its own sake, narrative “progress posts.”

---

## Guardrails + approval boundaries

### Auto-allowed (P3 / low risk) when task is open

- Local verify, build, evidence index, dirty-tree classify
- Funding **read-only** monitor + snapshots
- Heartbeats, queue refresh, offline inventory
- Wallet **preflight gate only** under `NO_WALLET_TOUCH=true` (non-executing; no keys; no sign; no broadcast)
- Draft packages written to disk under activation/command paths

### Require human approval (P0 / P1)

- Cryptographic signing / private key use
- Spend, transfer, liquidity, mint, stake, bridge, mainnet mutation
- Wallet ownership changes; key export; secret reveal
- Delete repos / irreversible destructive ops
- Publish confidential data; accept legal as Kris
- Portal login / KYC **as Kris**
- Choosing receiving destination / AUTHORIZE TO RECEIVE
- External email/Discord/X **send** as Kris (drafts OK)

### Standing environment

```bash
NO_WALLET_TOUCH=true
# Never set private keys for Living Forge autonomous jobs
```

Any action that would disable `NO_WALLET_TOUCH`, inject keys, or run gated “execute after preflight” chains must **stop and escalate**.

---

## Day 1 deliverables (this package)

| # | Artifact | Purpose |
| ---: | --- | --- |
| 1 | This doc | Score + 30-day target + guardrails |
| 2 | `scripts/kpi_snapshot.cjs` | Daily metrics JSON + Markdown |
| 3 | Wallet-preflight unstick | Safe preflight lane + stale claim recovery |

Commands:

```bash
npm run kpi:snapshot
npm run living-forge:wallet-preflight:safe
npm run living-forge:unstick-claims
```

Optional daily local cron (no GitHub billing dependency):

```bash
# crontab example — 08:00 local
0 8 * * * cd /home/kris/Quantum-pi-forge && /usr/bin/npm run kpi:snapshot >> /home/kris/.forge-daemon/kpi/cron.log 2>&1
```

---

## Related canon

- `docs/activation/living-forge/ESCALATION_POLICY_V1.md`
- `docs/activation/living-forge/EXECUTION_AUTHORIZATION_V1.md`
- `docs/activation/living-forge/HUMAN_ACTION_QUEUE_V1.md`
- `docs/DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md`
- `STATUS.md` (public non-executing posture)

---

## Explicit non-claims

- This document does **not** authorize commercial activation, yield, mint, or liquidity.
- KPI “success rate” is about **safe local ops**, not revenue.
- Maturity score **4 in safe scope ≠** economic autonomy.
