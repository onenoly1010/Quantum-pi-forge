# Local Multi-Agent Cockpit v1

**Mode:** operational guide — no on-chain authority  
**Purpose:** local-first, auditable, redundant AI operations. The repository is source of truth; humans authorize irreversible actions.  
**Companion handoff:** `docs/ops/LOCAL_AGENT_HANDOFF_STATE_V1.md`  
**Health script:** `scripts/agent-health.sh`

---

## Architecture

```
                 Kris (human authority)
                         |
              Local AI cockpit layer
                         |
        --------------------------------
        |                |             |
   Local Grok 4.5   Local Ollama   Guardian /
   reasoning/audit  private work   verification
        |
   GitHub Copilot (optional)
   remote coding accelerator
```

| Agent | Role | Authority |
| --- | --- | --- |
| **Kris** | Final authority | Unlimited (including push, tag, wallet, mainnet) |
| **Grok 4.5** | Reasoning / audit / orchestration | **Prepare only** |
| **Copilot** | Coding assistance when online | **Prepare only** · not critical path |
| **Ollama** | Private local models | **Prepare only** |
| **Guardian** | Verification surfaces / checks | **Validate only** |
| **Git + `receipts/`** | Durable truth | Survives any AI session crash |

If Copilot fails (`ETIMEDOUT` / `ENOTFOUND` / bridge timeouts), that is an **external service path** problem — not a repository failure. **Continue with Grok.**

---

## Standing operating rules (“keep the ball rolling”)

### Autonomous allowed (prepare lane)

| Action | Notes |
| --- | --- |
| Inspect files / logs | Read-only |
| Analyze governance state | Cite sealed receipts |
| Prepare patches / docs | Local worktree |
| Run local verification | `npm run verify:evidence` |
| Build / test locally | `npm run build`, unit tests |
| Create **proposed** commits | Prefer explicit human GO for commit if policy requires; local preserve may be authorized case-by-case |
| Maintain evidence indexes | Without rewriting historical claims |
| Run `scripts/agent-health.sh` | Layer isolation |

### Still requires explicit human confirmation

| Action | Why |
| --- | --- |
| `git push` | Shared remote mutation |
| Release / tag publication | Public durable markers |
| Wallet interaction / prompt | Custody |
| Transaction signing | Irreversible chain effect |
| Broadcast | Irreversible chain effect |
| Mainnet actions | Production |
| Liquidity / mint activation | Financial / public open |
| Bridge / treasury movement | Financial |

### Semantic ladder (do not collapse)

```text
prepared  → artifact/path exists and is reviewable
verified  → local evidence/build (or harness) passes
approved  → human GO for that exact action
executed  → chain or remote mutation actually happened
```

`prepared ≠ verified ≠ approved ≠ executed`

---

## Installed control plane (this laptop)

| Component | Location | Notes |
| --- | --- | --- |
| Grok CLI | `~/.grok/bin/grok` | Auth: `~/.grok/auth.json` |
| Grok config | `~/.grok/config.toml` | Prep autonomy ≠ external GO |
| Copilot CLI | `~/.local/bin/copilot` | Logs: `~/.copilot/logs/` |
| gh | system | PR/issue ops when authorized |
| Ollama | `127.0.0.1:11434` | Not a substitute for sealed evidence |
| GPU | DRI present (`/dev/dri`); `nvidia-smi` may be absent | Record in health notes |

---

## Health check

```bash
cd ~/Quantum-pi-forge
./scripts/agent-health.sh              # agents + repo (fast layer isolation)
./scripts/agent-health.sh --verify     # + evidence + build
./scripts/agent-health.sh --json
```

### Single entry point (highest leverage)

```bash
./scripts/ai-cockpit.sh              # full operational picture
./scripts/ai-cockpit.sh --quick      # skip evidence/build
npm run ops:ai-cockpit               # same via npm
```

This runs verification **then** regenerates project state. A new AI session should:

1. Read `reports/project-state.json`
2. Read `reports/local-verify-report.json` if deeper facts needed
3. Propose only; wait for human GO before any mutation

### Verification contract (shared source of operational state)

Every assistant should reason from the **generated contract**, not conversation history:

```bash
./scripts/local-verify-report.sh           # full: git + agents + evidence + build
./scripts/local-verify-report.sh --quick   # git + agent-health only
node scripts/project-state.cjs --prefer-report   # phase tasks + next action
```

**Canonical paths (always overwrite):**

| Format | Path |
| --- | --- |
| Markdown (human) | `reports/local-verify-report.md` |
| JSON (automation) | `reports/local-verify-report.json` |
| Stamped archive | `reports/archive/local-verify-report-<UTC>.*` |

Report structure:

1. **Facts** — branch, commit, clean/dirty, file lists, build/evidence, agent health  
2. **Recommendations** — interpretation only (safe to consider commit, needs cleanup, push optional)

Then: Copilot proposes against facts · Grok critiques · human authorizes.  
**Do not treat chat claims as truth without this contract (or equivalent local proof).**

### Report vs canonical truth

| Layer | Role |
| --- | --- |
| **Git repository** (`status`, `log`, `diff`, refs, tracked files) | **Canonical** current and historical truth |
| **`reports/local-verify-report.*`** | **Point-in-time snapshot** — operational contract for assistants; becomes historical once the repo changes |
| **AI chat** | Reasoning only — never authority |

Workflow state machine (each transition needs evidence):

```text
Reason → Verify → Report → Human Authorization → Execute → Verify Again → Publish
```

| Transition | Evidence |
| --- | --- |
| Reason | AI discussion / critique |
| Verify | local scripts, CI, `git` |
| Report | `reports/local-verify-report.md` + `.json` |
| Authorize | explicit human GO |
| Execute | commit / push / tag (only when authorized) |
| Verify again | re-run report or `git show` / `git status` |
| Publish | push (separate GO from commit) |

AI proposes · verification measures · you authorize · Git records · re-verify confirms.

| Exit | Meaning |
| --- | --- |
| **0** | Healthy multi-agent plane |
| **2** | Degraded (often Copilot) — **keep working with Grok** |
| **1** | Critical (no usable local AI or repo broken) |

`scripts/agent_preflight.sh` = toolchain (node/python/oinio).  
`scripts/agent-health.sh` = agent connectivity board.

### What to record after a health run

- Grok availability / process  
- Ollama availability / model count  
- GPU notes  
- Repo branch + latest commit  
- Worktree dirty summary  
- Pending untracked cockpit files  
- Evidence / build if `--verify`

---

## Recovery: Copilot / remote AI outage

1. **Classify the layer** — run `./scripts/agent-health.sh`.  
2. **Do not stop project work** — Grok continues prepare/verify/document.  
3. **Optional network probe** (isolates service vs code):
   ```bash
   nslookup api.individual.githubcopilot.com
   curl -I --max-time 8 https://api.individual.githubcopilot.com
   ```
4. **If DNS/timeout** — external path; retry Copilot later; no repo “fix.”  
5. **If Grok also dies** — human + `gh` + `npm run verify:evidence` + git still work.  
6. **Handoff** — leave state in `docs/` and `receipts/`, not chat-only memory.

---

## Baseline snapshot (local audit)

Captured on laptop while cockpit was being stabilized:

| Field | Value |
| --- | --- |
| Branch | `main` |
| HEAD | `ff3c1c8` — governance path package preserved |
| Evidence | PASS (`currentReceiptHash=4c1bf712…`) |
| Build | PASS (`out/` for `ff3c1c8`) |
| Agent health | Exit **2 DEGRADED** (Copilot session logs; Grok/Ollama/gh OK) |
| External execution | **NO-GO** |
| Push / tag | Not performed without explicit instruction |

Governance package (already committed separately):

```text
docs/governance/PUBLIC_MINT_EXECUTION_PATH_PACKAGE_V1.md
@ ff3c1c8 governance: preserve public mint execution path package baseline
```

Cockpit files still **local/untracked** until a separate ops preserve is authorized:

```text
docs/ops/LOCAL_MULTI_AGENT_COCKPIT_V1.md   (this file)
docs/ops/LOCAL_AGENT_HANDOFF_STATE_V1.md
receipts/ops/local-cockpit-readiness-audit-v1.json
scripts/agent-health.sh
```

---

## Division of labor

| Prefer Grok for | Prefer Copilot for | Prefer Guardian / scripts for |
| --- | --- | --- |
| State boards, plans, inconsistency finding | Inline completion, PR context | `verify:evidence`, path reviews, health |
| Governance docs, PR descriptions | Targeted refactors when online | Build packaging |
| Continuity during remote outages | Optional accelerator only | Evidence integrity |

---

## Cooperation rules

1. Source of truth = **git + receipts**, not any AI session.  
2. Hand off via **artifacts**, not “the other agent said.”  
3. Failover: Copilot down → Grok; Grok down → human + scripts.  
4. One implementer, one reviewer — no dual ownership of a change set.  
5. No agent assumes push/tag/wallet/mainnet/mint/LP authority.

---

## Tree placement

```text
Quantum-pi-forge
 ├── docs/governance/     evidence, execution boundaries, packages, phase records
 ├── docs/ops/            local agent cockpit + handoff
 ├── scripts/             agent-health, verification, review harnesses
 └── receipts/           sealed machine-readable state
```

---

## Non-authorization

This document does **not** authorize wallet actions, signing, broadcast, public mint open, liquidity, staking, bridge, yield routing, treasury movement, `git push`, or tag publication.
