# E1 — Private AI Operator Checklist v1

**Command:** `DRAFT_E1_PRIVATE_AI_OPERATOR_CHECKLIST`
**Mode:** Product-definition artifact · **not** activation
**Status:** READY FOR HUMAN-GUIDED PILOTS
**Parent plan:** [OUTCOME_EXECUTION_PLAN_V1.md](./OUTCOME_EXECUTION_PLAN_V1.md)
**Evidence loop:** [PILOT_EVIDENCE_LOOP_V1.md](./PILOT_EVIDENCE_LOOP_V1.md) — User → Problem → Result → time saved → use again
**Connector lane:** [PILOT_CONNECTOR_LANE_V1.md](./PILOT_CONNECTOR_LANE_V1.md) — find conversations (not “users”)
**Cockpit manual:** [LOCAL_MULTI_AGENT_COCKPIT_V1.md](./LOCAL_MULTI_AGENT_COCKPIT_V1.md)
**Sealed tip (foundation):** `0cd896a`

```text
Question E1 must answer:
  Can one person get real value from OINIO
  without understanding the entire stack?

The real market question (not a build question):
  Who has enough pain that they will adopt it?
  Did OINIO save this person meaningful time?

Discipline:
  Stop increasing complexity. Start proving usefulness.
  Can someone use this tomorrow?
  — not —
  Let's add more agents / security layers / chain integration first.

Mode: VALIDATION (not engineering)
  3 pilot candidates · onboarding · usability · feedback · measurable outcomes
```

```text
HARD BOUNDARIES (E1 never does these):
  mint · liquidity · token activation · wallet · signing
  broadcast · financial protocol ops · 18.8 · chain state change
```

---

## 0. What E1 is (one page)

| Field | Answer |
| --- | --- |
| **Product name (user-facing)** | Private AI Operator (OINIO / Quantum Pi Forge) |
| **User** | Individual developer, creator, researcher, or business operator |
| **Problem** | Needs a private AI assistant that helps with real work, remembers *operational* context via reports (not chat myth), and stays under their control |
| **Solution** | Local multi-agent operator stack: human authority + prepare-only AI + shared verify reports |
| **Proof of value** | User completes a useful task faster/better than without it, and can state what the AI may not do |
| **Not required** | Understanding contracts, mint, LP, DAO, or full Soul System architecture |
| **Revenue later** | Setup fee · boundary review · subscription-style retainers · private deploy (all off-chain) |

### Success definition (pass / fail)

E1 **passes** for a tester if **all** are true:

1. They complete the **minimum path** (§3) on a real machine (theirs or guided shared screen).
2. They produce or receive the **proof pack** (§5).
3. They finish **one useful task** (§4) with AI assistance under human authority.
4. They answer the **four validation questions** (§7) honestly.
5. **No lock breach** occurred.

E1 **fails** if they need the full architecture lecture to get value, or if delivery expands into new infrastructure before the first outside user.

---

## 0.1 Who to pilot (and who not to)

The three pilots should **not** be people who are merely impressed by architecture.

| Prefer (pain-holders) | Avoid as first cohort |
| --- | --- |
| Developer **drowning in documentation** / status chaos | Blockchain experts who want to debate contracts |
| Small business owner with **repetitive admin** | AI enthusiasts who want more agents/features |
| Researcher managing **large information sets** | Friends who will praise the stack politely |
| Creator needing **private knowledge** workflow help | Anyone whose first ask is mint / token / LP |
| Operator who needs AI **under their control** (privacy, authority) | Anyone who requires full-stack understanding to start |

**Selection test (before booking):**

```text
Does this person have a repetitive painful workflow THIS WEEK?
If yes → good pilot.
If they mainly want a tour of the system → wrong pilot for E1.
```

**Pass signal for the cohort (not for architecture):**

```text
"Did OINIO save this person meaningful time?"
```

| Pilot slot | Suggested persona | Pain to attach the session to |
| --- | --- | --- |
| 1 | Overloaded developer / builder | Docs, status, “what is true right now” |
| 2 | Non-crypto operator / small business | Repetitive writing, admin drafts, boundaries |
| 3 | Researcher or creator | Private notes, claim-vs-evidence, synthesis |

Keep names **private** (do not commit PII). Only log persona type + outcomes in §8.

---

## 1. Authority table (show every tester)

| Actor | May do in E1 | May **not** do |
| --- | --- | --- |
| **Human (tester)** | Final decisions; run commands; approve any write | Hand private keys to AI |
| **Grok / local AI** | Read, reason, draft, suggest | Commit, push, mint, sign, spend without GO |
| **Ollama** | Private local inference | Authority over repo or chain |
| **Copilot (optional)** | Coding assist when online | Critical path; not required for E1 pass |
| **Scripts / Guardian** | Measure health and facts | Authorize irreversible actions |
| **Git** | Canonical truth when changes exist | — |

```text
prepared  ≠  verified  ≠  approved  ≠  executed
AI chat is never authority.
Git + reports are the contract; human authorizes mutations.
```

**One sentence the tester should leave with:**

> “The AI helps me prepare work; I decide what actually runs.”

---

## 2. Prerequisites (minimum machine)

### Required

| Item | Notes |
| --- | --- |
| Linux/macOS shell | Windows via WSL ok if bash works |
| `git` | Clone or existing checkout |
| Network (first time) | Clone / `npm install` if full verify path used |
| 30–90 minutes | Guided session or self-serve |

### Strongly recommended (still E1-valid if partial)

| Item | Notes |
| --- | --- |
| Node 18+ | Full evidence/build path |
| Grok CLI **or** Ollama | At least one local AI plane for “assistant” feel |
| `curl` | Optional portal verify |

### Explicitly **not** required for E1

| Item | Why not |
| --- | --- |
| Wallet / seed phrase | Out of bounds |
| Mainnet funds | Out of bounds |
| Understanding 0G contracts | Trust substrate optional |
| Cloudflare / deploy keys | Not an E1 step |
| Multi-agent swarm product | Scope creep |

### Install / open (host or tester)

```bash
# If starting fresh (tester machine)
git clone https://github.com/onenoly1010/Quantum-pi-forge.git
cd Quantum-pi-forge
git checkout main   # or a documented pilot tag/commit if pinned

# Optional: dependency install only if running full (non-quick) cockpit
# npm ci   # only when needed; --quick path avoids heavy verify
```

**Pilot tip:** Facilitator may share-screen a known-good laptop for session #1 so the first tester is not blocked on install friction. Still counts as E1 if the **tester** drives the useful task and answers validation questions.

---

## 3. Minimum path — “use this tomorrow” (≈15–25 min)

Do **not** expand this path before 3–5 outside pilots complete it.

### 3.1 Health (2 min)

```bash
cd /path/to/Quantum-pi-forge
./scripts/agent-health.sh
```

| Result | Meaning | E1 action |
| --- | --- | --- |
| Exit 0 | Local plane usable | Continue |
| Exit 2 | Degraded (often Copilot) | **Continue with Grok/Ollama** — not a fail |
| Exit 1 | No usable local AI / repo broken | Fix install or use facilitator machine |

### 3.2 Cockpit quick contract (5–10 min)

```bash
./scripts/ai-cockpit.sh --quick
# or: npm run ops:ai-cockpit:quick
```

**Must open and skim:**

```text
reports/local-verify-report.md
reports/project-state.md
```

| Check | Pass |
| --- | --- |
| Report files exist after run | Yes |
| Tester can say what branch/commit the report claims | Yes |
| Tester understands report is a **snapshot**, not eternal truth | Yes |

### 3.3 Authority check (2 min)

Facilitator asks; tester answers in their own words:

1. Who may authorize a `git push`? → **Human only**
2. May the AI mint or open liquidity? → **No**
3. What is the report for? → **Shared facts so AIs don’t invent state**

### 3.4 Optional trust substrate (5–10 min) — **not required for E1 pass**

Only if the tester cares about chain/public claims:

```bash
npm run verify:public-portal
# and/or open:
# https://quantumpiforge.com/deployed-addresses#verify-now
```

Expect: chain **16661**, contracts present, mint/LP **NOT AUTHORIZED**, pair empty.
This feeds trust KPI (Phase 8.5) but **must not** dominate the session.

### 3.5 Stop rules

| Stop if… | Do **not**… |
| --- | --- |
| Tester is blocked on install >20 min | Rewrite the stack mid-session |
| They want “just open mint” | Treat as product request → defer to separate GO |
| Session drifts into architecture lecture >15 min | Redirect to §4 useful task |
| Any wallet prompt appears | Abort wallet path; document; continue non-wallet |

---

## 4. Useful task catalog (pick **one** per pilot)

Value proof = **task completed**, not architecture appreciated.

| ID | Task (tester does this) | Time | Pass criterion |
| --- | --- | --- | --- |
| **T1** | Ask AI to explain current project/work state **from** a report or their notes (not from chat memory) | 10 min | Explanation matches source; no invented activation |
| **T2** | Draft a short email/docs paragraph about “what my AI may not do” using the authority table | 10 min | Accurate boundaries; human would send it |
| **T3** | Produce a claim→evidence note for one public claim (e.g. “mint not authorized”) with a link or command | 15 min | Evidence is checkable |
| **T4** | Run cockpit again after a **harmless** local change (or re-run only) and compare snapshot idea | 10 min | Understands re-run vs stale report |
| **T5** | (Builder) Get `verify:public-portal` green or document a real failure | 15 min | Reproducible outcome |
| **T6** | **Bring your own pain:** one real task from their week (email, doc outline, research summary, admin checklist) done with prepare-only AI | 15–25 min | They say it saved meaningful time (Q2) |

**Default pilot task:**

- Stack-curious / repo available → **T1 + T2**
- Pain-holder / non-repo → **T6 + T2** (preferred for “who will adopt” learning)

```text
Proof of value (user language):
  "I finished something useful with a private AI under my control,
   it saved me time, and I can prove what it was allowed to do."
```

---

## 5. Proof pack (deliverables)

After the session, produce these artifacts (redact PII before any public storage).

### 5.1 Required

| Artifact | Owner | Content |
| --- | --- | --- |
| **Session log** | Facilitator | §8 template filled |
| **Boundary brief** | Facilitator + tester | §6 template filled |
| **Report pointers** | System | Paths to `local-verify-report.md` / `project-state.md` (or copies given to tester) |

### 5.2 Attestation (always include)

```text
E1 ATTESTATION
- No wallet was opened or signed for this session.
- No mint, liquidity, token activation, or financial protocol action was performed.
- No chain state was changed as part of E1.
- AI role: prepare / assist only.
- Human role: authority for irreversible actions.
UTC: _______________
Tester initials: _______________
Facilitator: _______________
```

### 5.3 Optional (bonus, not pass criteria)

- Screenshot of cockpit summary (no secrets)
- Independent portal verification note (feeds \(n \rightarrow 1\))
- Paid follow-on interest flag

---

## 6. Boundary brief template (fill per pilot)

```markdown
# E1 Boundary Brief — <tester handle or "anonymous">

Date (UTC):
Environment: (own machine / facilitator share-screen / other)

## What the operator can do for you
- Local AI assistance (Grok and/or Ollama; Copilot optional)
- Shared operational reports (facts over chat memory)
- Prepare drafts, explanations, checklists under human authority

## What stays private / local by default
- Local models (Ollama) do not require cloud if used offline-capable
- Repo + reports live on the machine you control
- You do not provide seed phrases or private keys

## What may leave the machine (if you use cloud AI)
- Prompts/context sent to Grok/Copilot/cloud providers per their tools
- Public portal checks use public RPC / HTTPS only

## What the system will not do in E1
- Mint tokens, open liquidity, move funds, sign transactions
- Treat AI chat as authorization
- Require understanding the full OINIO/QPF stack for basic use

## Useful task completed
- Task ID:
- Result in one sentence:

## Tester statement (optional quote)
>
```

---

## 7. Validation questions (measure every pilot)

Ask immediately after the useful task. Record raw answers.

| # | Question | Signal |
| --- | --- | --- |
| **Q1** | Did you understand what this is for in under 10 minutes? | Clarity |
| **Q2** | Did it save you **meaningful** time (or would it weekly) vs doing the task alone? | Value / adoption |
| **Q3** | Would you pay for setup, a guided session, or ongoing help? (no / maybe / yes + rough range) | Revenue |
| **Q4** | What confused you most? | Friction |
| **Q5** (optional) | Would you use this again next week on a real workflow? | Retention signal |

### Scoring (lightweight)

| Result | Rule of thumb |
| --- | --- |
| **Strong** | Q1 yes · Q2 yes · Q3 maybe/yes · Q4 fixable in docs |
| **Weak** | Q1 no or needs full-stack lecture |
| **Pivot** | Q2 no across 3+ pilots → change task or front-door packaging, **not** add chain features |

**Do not** optimize for more agents until Q1–Q2 are strong for most of 3–5 pilots.

---

## 8. Session log template (one row per pilot)

Copy into a working log (private is fine). Public redacted summary optional later.

| Field | Entry |
| --- | --- |
| Pilot # | 1–5 |
| Date (UTC) | |
| Tester type | dev / creator / researcher / operator / other |
| External? | yes / no (must be yes for official E1 count) |
| Path | min §3 / share-screen / self-serve |
| AI plane used | Grok / Ollama / both / facilitator-only |
| Task ID | T1…T5 |
| Task completed? | yes / partial / no |
| Proof pack complete? | yes / no |
| Q1–Q4 | (short) |
| Pay signal | no / maybe / yes |
| Confusion notes | |
| Follow-up | none / docs fix / paid offer / A0 verify invite |
| Lock breach? | **no** (required) |
| Evidence card | filled in [PILOT_EVIDENCE_LOOP_V1.md](./PILOT_EVIDENCE_LOOP_V1.md)? yes / no |

### Cohort target

| Metric | Target |
| --- | --- |
| Outside pilots | **3–5** |
| Official E1 successes | ≥ **1** then aim for **3** |
| New infrastructure commits required | **0** preferred |
| Activation actions | **0** |

---

## 9. Facilitator runbook (60–90 min guided)

| Min | Step |
| --- | --- |
| 0–5 | Welcome · hard boundaries · “you are the authority” |
| 5–15 | §3.1–3.2 health + cockpit quick |
| 15–20 | §3.3 authority check |
| 20–45 | §4 useful task (default T1+T2) with AI assist |
| 45–55 | Fill boundary brief + attestation |
| 55–65 | Q1–Q4 + pay signal |
| 65–75 | Optional portal module **only if asked** |
| 75–90 | Next steps: free vs paid Offer C/A · **no mint pitch** |

**Facilitator anti-patterns**

- Explaining the entire repo history
- “While we’re here, let’s add another agent”
- Demo of mint/LP “just to show contracts” as the climax
- Taking keyboard for the whole useful task (tester must drive enough to answer Q1–Q2)

---

## 10. Self-serve path (async tester)

For a motivated external developer without a live session:

1. Clone `main` (or pilot-pinned commit).
2. Run §3.1–3.2.
3. Complete T1+T2 using any available AI (local preferred).
4. Email facilitator: boundary brief + Q1–Q4 (no secrets).
5. Do **not** submit keys, seed phrases, or signed txs.

Facilitator still records §8 log for cohort metrics.

---

## 11. Explicit non-goals (scope freeze until 3 pilots)

Do **not** start these as “needed for E1”:

| Temptation | Response |
| --- | --- |
| More agents / orchestration layers | Freeze until Q1–Q2 strong |
| Deeper blockchain integration in the happy path | Optional module only |
| Hosted multi-tenant SaaS | Out of scope |
| Token-gated access | Out of scope |
| Perfect security hardening pass as blocker | Document residual risk; don’t block pilots |
| Homepage redesign as prerequisite | `/work-with-us` + direct invite enough |
| Re-proving foundation (#716 loops) | Closed |

```text
Fewer commits · more evidence:
  users helped · tasks completed · time saved · revenue signals
```

---

## 12. Revenue hooks (after value, not before)

| Signal from Q3 | Offer | Notes |
| --- | --- | --- |
| yes / maybe — setup | Guided install + boundary review | Fixed fee `TBD_HUMAN` |
| yes — ongoing | Lightweight retainer (ops + AI hygiene) | Off-chain invoice |
| yes — diligence | Offer A evidence walkthrough | Existing catalog |
| yes — private AI boundary | Offer C | Existing catalog |
| no | Thank · fix Q4 friction · still count usage if task done | Usage ≠ payment |

Protocol token/LP revenue is **not** an E1 conversion path.

---

## 13. Relationship to other outcomes

| Outcome | Role vs E1 |
| --- | --- |
| **E1** (this checklist) | Product / adoption experiment |
| **A0** \(n \rightarrow 1\) | Trust KPI; optional module in §3.4 |
| **B0** outreach sends | Acquisition channel for pilots |
| Activation / mint / LP | **Never** part of E1 |

---

## 14. Ready-to-send pilot invite (human paste)

**Pain-first version (preferred):**

```text
Subject: 60–90 min — private AI on one real task (no wallet)

You've got repetitive work that eats time. I'm piloting a private AI operator
setup (under your control — prepare only, you decide anything irreversible).

In one short session we:
- pick ONE real task from your week (docs, admin draft, research summary, etc.)
- complete it with the assistant
- leave with a clear boundary of what the AI may not do
- no wallet, mint, liquidity, or crypto risk

If it doesn't save you time, say so — that's the point of the pilot.

Reply with a time window this week.

— Kris
```

**Neutral version (if they already know QPF):**

```text
Subject: 60–90 min private AI operator pilot (no wallet, no crypto risk)

Short pilot of a private AI operator stack: local assistants under your control,
with a simple proof of what they may not do.

- No wallet, mint, liquidity, or funds
- You complete one real useful task
- Four feedback questions
- Optional public verification only if you care about chain claims

Reply with a time window this week.

— Kris
```

**Human send only.** Do not invent recipients or auto-mail. Prefer pain-holders (§0.1), not architecture tourists.

---

## 15. Checklist for facilitator before pilot #1

- [ ] This document read once
- [ ] `./scripts/ai-cockpit.sh --quick` works on the session machine
- [ ] Authority table printable or screen-share ready
- [ ] Boundary brief + session log templates blank-copied
- [ ] Price left as `TBD_HUMAN` unless already decided
- [ ] Confirmed: no mint/LP demo planned
- [ ] 3–5 candidate names listed privately (not committed if sensitive)

---

## 16. Authorization reminder

This checklist is a **product-definition and pilot-ops** artifact.

It does **not** authorize:

```text
mint · liquidity · token activation · wallet · signing
broadcast · financial protocol execution · 18.8 · chain mutation
```

It **does** authorize (after human scheduling):

```text
guided non-economic pilot sessions
docs/checklist use
collection of qualitative feedback and pay signals
```

---

## 17. Immediate next (30–60 day validation window)

```text
Engineering built the machine.
This window asks: does anyone want to drive it?

1. Human: name 3 pain-holder pilots (§0.1) — not architecture fans
2. Send pain-first invite (§14) — human only
3. Run §9 runbook with T6+T2 when possible
4. Log Q1–Q5 · "meaningful time saved?"
5. After 3 logs: iterate product packaging — NOT agent count
6. Agent: install-fix docs only if setup actually breaks
7. Parallel optional: A0 verify invites (trust lane, separate)
```

```text
E1 CHECKLIST: READY
MODE: VALIDATION
GOAL: meaningful time saved for someone with real pain
LOCKS: HELD
NO NEW AGENT LAYERS without pilot evidence
```
