# Outcome Execution Plan v1

**Command:** `CREATE_OUTCOME_EXECUTION_PLAN`  
**Mode:** Put the machine to work · **not** activation  
**Generated (UTC):** 2026-08-04  
**Sealed tip:** `0cd896a` (main, post #713–#716)  
**Depends on:** [OUTCOME_READINESS_MAP_V1.md](./OUTCOME_READINESS_MAP_V1.md) · [OUTCOMES_LANE_V1.md](./OUTCOMES_LANE_V1.md)  
**Rule:** Capability ≠ Permission ≠ Activation ≠ Revenue  

```text
CONSTRAINTS (hard):
  No activation · No mint · No LP · No wallet actions · No 18.8

GOAL:
  Identify the smallest public user outcome that demonstrates value
  from existing infrastructure — then execute toward it.
```

```text
building the machine  →  putting the machine to work
foundation verified   →  first undeniable user outcome
```

---

## 0. Phase posture

| Phase | Status | This plan’s job |
| --- | --- | --- |
| Foundation / verification seal | **Done** (`0cd896a`, portal live) | Do not re-open |
| Outcome readiness map | **Done** (inventory + A0/B0 ledger) | Inputs |
| **Outcome execution** | **Now** | Choose front door · define first user outcome · execute steps |
| Scoped activation authorization | Later only | Explicit AUTHORIZATION RECORD |

---

## Phase A — Inventory what already works (hard evidence)

Convert engineering into product language. Every row is **already real** (live site, repo scripts, or sealed docs).

| Capability | Evidence | User value |
| --- | --- | --- |
| **Deployment** | https://quantumpiforge.com/ · CF Pages `deploy/**` · HTTP 200 on portal, builders, work-with-us | Users can access a public product surface without installing anything |
| **Verification** | `#verify-now` · `verification-status-v1.json` · `npm run verify:public-portal` · report templates · issue #636 | Users/reviewers can trust results without wallets or funds |
| **AI agent layer** | Local multi-agent cockpit (`./scripts/ai-cockpit.sh`) · Grok + Ollama + optional Copilot · `docs/ops/LOCAL_MULTI_AGENT_COCKPIT_V1.md` · `soul-core` sovereign loop | Users get private, controllable AI assistance with prepare-only authority |
| **Chain integration** | Contracts on 0G Aristotle 16661 · registry addresses · empty DEX pair · read-only RPC checks | Future utility + present proof that code exists without economic open |
| **Governance / safety** | Locks in status JSON · Capability≠Permission≠Activation · human GO culture · cockpit NO-GO on execution | Prevents unsafe actions while work continues |

### What this inventory implies

```text
Infrastructure is not the bottleneck.
Adoption path is the bottleneck.

We already have:
  access surface + trust surface + AI operator stack + chain truth + locks

We do not yet have (public, undeniable):
  one stranger who completed a defined experience
  and left durable evidence of that completion
```

**Relationship to prior map:** Phase 8.5 (\(n \rightarrow 1\)) remains a **trust KPI**. It is not the marketing front door. It is the proof layer *behind* the experience users understand first.

---

## Phase B — Choose one front door

### Candidate doors (all valid; only one leads)

| Door | User understands immediately? | What it really is | Risk if chosen first |
| --- | --- | --- | --- |
| **OINIO / private AI agent** | **Yes** — “my AI assistant that I control” | Local cockpit + sovereign loops + boundary discipline | Under-sells verification if proof is hidden |
| Verification layer | Partially — diligence / builder niche | Portal + receipts + independent reports | Feels like infrastructure, not a product |
| Developer infrastructure | Niche — “tools for builders” | Scripts, templates, registry, quickstarts | Slow path to emotional adoption |

### Decision (v1)

```text
FRONT DOOR (public experience):
  Private AI operator stack
  Tagline intent:
    “Your private AI assistants — under your control, with proof of what they did.”

TRUST SUBSTRATE (always visible, never the first sentence):
  Deterministic verification, receipts, locked economics, public portal.

FUTURE (not first UX):
  Token, LP, DAO economics.
```

**Why AI leads**

1. Users already have a mental model for “private AI assistant.”  
2. The stack **exists** (cockpit, Ollama path, Grok prepare-only, soul-core pattern).  
3. `/work-with-us` already sells “sovereign AI deployment / Ollama-style stacks.”  
4. Service catalog already has **Offer C — Sovereign-AI boundary review.**  
5. Verification becomes the *differentiator* (“prove what the AI did / did not touch”) rather than the *first sentence*.

**Why verification does not lead the landing sentence**

“Deterministic execution receipts with governance-anchored verification” is true and valuable — and is **infrastructure language**. It stays in the second screen, portal, and diligence packs.

### Front-door promise (must stay honest)

| We can claim | We must not claim |
| --- | --- |
| Local / private AI assistance under human control | Autonomous financial agent |
| Prepare-only authority; human GO for irreversible work | “The AI can trade / mint / manage funds” |
| Proof trails and verification of setup and claims | Protocol yields or token utility live |
| Setup and boundary review as a service | That token activation is included |

---

## Phase C — First revenue path (utility, not token)

```text
Do not wait for token economics.
Revenue from utility first.
Protocol mint/LP remain locked and separate.
```

### Ranked early offerings (reuse existing catalog)

| Rank | Offer | Source of truth | Time-to-value | Token needed? |
| --- | --- | --- | --- | --- |
| **1** | **Private AI operator setup** (local multi-agent cockpit + Ollama/Grok hygiene) | Cockpit docs + work-with-us | 1–3 days | No |
| **2** | **Sovereign-AI boundary review** (Offer C) | `qpf_service_catalog.md` | 48–72h | No |
| **3** | **Evidence-readiness walkthrough** (Offer A) | Offer one-pager + catalog | 48–72h | No |
| **4** | Developer agent tooling walkthrough | Builder quickstart + verify scripts | 1–2 days | No |
| **5** | Enterprise / private deployment of soul-core style loop | `soul-core/README.md` | Project-scoped | No |
| later | Token / LP / DAO mechanisms | Separate GOs only | Multi-gate | Yes |

**First money milestone (already on live page):**  
`/work-with-us` — *“first independent third party pays QPF for a product or service, and payment is received.”*

That milestone is **orthogonal** to mint. Preserve it.

---

## The first undeniable user outcome (canonical)

### OUTCOME-E1 — First guided private AI operator experience

| Field | Definition |
| --- | --- |
| **Name** | **E1: Guided Private AI Operator** |
| **User** | One external person (client, peer founder, or technical partner) — **not** the maintainer self-demo alone |
| **Problem solved** | “I want private AI help that I control, without giving it my keys or hoping a black-box agent is safe.” |
| **One-sentence value** | You leave with a working local AI operator setup and a written proof of what it can and cannot do. |
| **Working components reused** | See § Reuse map below |
| **Not used** | Mint, LP, wallet spend, chain broadcast, 18.8, site signing |
| **First measurable success** | External user completes the path · produces artifacts · timestamps recorded |
| **Evidence that proves usage** | (1) Cockpit or setup report path · (2) boundary brief PDF/md · (3) optional public portal verify receipt if chain claims discussed · (4) engagement log row |
| **Revenue path** | Fixed-fee setup **or** free pilot → paid Offer C/A follow-on · invoiced off-chain |
| **Verification requirements** | Setup is reproducible; authority matrix is explicit; no wallet touch; economic gates remain NOT_AUTHORIZED if chain discussed |

### Success criteria (undeniable)

All of the following must be true:

1. **External identity** — not only maintainer baseline.  
2. **Defined experience completed** — checklist in § Execution steps.  
3. **Durable artifact** — report/brief stored (client copy + optional redacted receipt in-repo if public-safe).  
4. **Authority understood** — user can state: AI prepare-only; human decides irreversible actions.  
5. **No lock breach** — no mint/LP/wallet/chain execution performed as part of E1.

Optional upgrade (does not block E1):

- User also files or co-signs an independent verification-style note of the **public portal** (feeds A0 / \(n \rightarrow 1\)) when their interest includes chain claims.

### What “smallest” means

```text
SMALLEST = one external human + one defined experience + one proof pack

Not:
  multi-tenant SaaS
  public hosted agent with billing
  token-gated access
  full OINIO Soul System productization
  chain-activated features
```

---

## Reuse map (no new infrastructure required for E1)

| Layer | Reuse as-is | Role in E1 |
| --- | --- | --- |
| Local cockpit | `./scripts/ai-cockpit.sh` · `npm run ops:ai-cockpit` | Core demo: agents health + verify report |
| Cockpit docs | `docs/ops/LOCAL_MULTI_AGENT_COCKPIT_V1.md` | Operator manual |
| AI policy | `docs/ai/*` · COMMERCIAL_READINESS | Boundaries for sales language |
| Public proof | quantumpiforge.com · `#verify-now` | Show trust substrate after AI story |
| Services CTA | `/work-with-us.html` · mailto brief | Demand capture |
| Service packaging | Offer A/C · first engagement offers · one-pager | Scope + deliverables language |
| Soul loop (optional depth) | `soul-core/` | Advanced: minimal input→AI→memory deploy later |
| Outreach | Share packets / shortlist | Find first external user |
| Status locks | `verification-status-v1.json` | Demonstrate intentional restraint |

**Explicit non-build list for E1**

- No new chain contracts  
- No mint UI  
- No hosted multi-tenant agent platform  
- No payment-rail productization inside the protocol  
- No Guild-form thrash while closed  

If something is missing for E1, prefer **docs checklist + human-guided session** over new code.

---

## Deployment / delivery steps (E1)

### Step 0 — Preconditions (already true)

- [x] Foundation sealed (`0cd896a`)  
- [x] Public site live  
- [x] Cockpit scripts on main  
- [x] Service language on `/work-with-us`  
- [x] Locks public  

### Step 1 — Package the experience — **DONE**

```text
docs/ops/E1_PRIVATE_AI_OPERATOR_CHECKLIST_V1.md
```

Includes: prerequisites, minimum path, authority table, useful task catalog,
boundary brief, attestation, validation Q1–Q4, 3–5 pilot cohort log,
facilitator runbook, non-goals (anti-scope-creep).

**Next:** human books outside pilots — prefer **zero** new engineering.

### Step 2 — Position the front door (copy only)

Homepage / entry narrative priority (when a content GO allows):

```text
1st: Private AI you control
2nd: Proof and verification of claims and boundaries
3rd: On-chain inventory (locked economics)
```

Do **not** wait for a homepage rewrite to run Step 3. `/work-with-us` + direct outreach is enough to acquire user #1.

### Step 3 — Acquire one external user (human)

| Channel | Action | Auth |
| --- | --- | --- |
| Warm contact | Offer free 60–90 min guided setup or paid boundary review | Human send |
| `/work-with-us` | Respond to any inbound brief | Human |
| Share packet | Invite peer for “private AI operator demo + proof pack” | Human send GO |
| Do not | Auto-DM, invent recipients, claim token utility | — |

**Target:** 1 scheduled session within 7 days of plan acceptance.

### Step 4 — Deliver E1 session

| Minute | Activity |
| --- | --- |
| 0–10 | Problem + authority model (prepare ≠ activate) |
| 10–40 | Run cockpit / health / verify report on their machine or shared screen of a clean env |
| 40–60 | Optional portal verify-now if relevant |
| 60–75 | Boundary brief walkthrough |
| 75–90 | Next steps: free vs paid Offer A/C; **no** mint discussion as product |

Capture: start/end UTC, environment notes, artifact paths, client satisfaction one-liner.

### Step 5 — Seal proof of usage

| Artifact | Owner |
| --- | --- |
| Session receipt (redacted) | Human (+ agent draft under GO) |
| Boundary brief delivered | Human |
| Engagement log row | Human |
| If they verify portal independently | Counts toward A0 |

### Step 6 — Convert or learn

| Result | Next |
| --- | --- |
| Paid follow-on | Quote Offer C or A · human price · off-chain invoice |
| Free only but completed | Still counts as E1 usage success |
| No-show / incomplete | Iterate checklist; do not expand scope to chain unlock |

---

## Parallel track (do not confuse with E1)

| Track | KPI | Relationship to E1 |
| --- | --- | --- |
| **A0** Phase 8.5 \(n \rightarrow 1\) | Eligible verification reports | Trust substrate; can be a *module* inside E1, not the front door |
| **B0** Outreach send | Logged human sends | Acquisition for E1 and A0 |
| **C\*** Protocol revenue | — | **Blocked** · out of this plan’s execution queue |

```text
E1 success does not require n≥1.
n≥1 success does not require E1.
Both compound; neither authorizes mint.
```

---

## Revenue path detail (first test)

### Offer packaging for the first sale

| Item | Spec |
| --- | --- |
| **SKU** | `QPF-E1-AI-OPERATOR` (setup) or `QPF-OFFER-C` (boundary review) |
| **Delivery** | Remote session + written brief |
| **Price** | `TBD_HUMAN` (suggestion band only: fixed fee, not token) |
| **Payment** | Off-chain (invoice/e-transfer/etc.) — **not** protocol mint |
| **Acceptance** | Checklist complete + brief delivered |
| **Exclusions** | Keys, custody, mint, LP, legal opinion, guaranteed funding |

### Metrics (commercial, non-protocol)

| Metric | Target (14 days) |
| --- | --- |
| External E1 sessions completed | **≥ 1** |
| Paid conversions from E1 | ≥ 0 (1 is stretch success) |
| Inbound briefs via work-with-us | Track count |
| Protocol revenue | **$0 expected** (correct) |

---

## Verification requirements (for E1 itself)

E1 must remain **auditable without becoming activation**.

| Check | Pass condition |
| --- | --- |
| Wallet touch | None during delivery |
| Mint/LP | Remain NOT_AUTHORIZED; not part of deliverable |
| Claims language | Matches locks and cockpit authority table |
| Reproducibility | Commands in checklist run on a clean path |
| Client data | No private keys accepted; redact personal data in any public receipt |
| Optional chain module | Read-only RPC / portal only |

If any check fails → stop, remediate docs, do not “finish” by unlocking economics.

---

## 14-day execution calendar

| Day | Focus | Owner |
| --- | --- | --- |
| 0 | Accept this plan · no activation | Human |
| 1 | Draft E1 checklist (docs) · PR if needed | Agent under docs GO / Human |
| 2 | Human: name 3 warm candidates for E1 | Human |
| 3–4 | Send invites (private AI setup / boundary review) | Human |
| 5–10 | Deliver first E1 session | Human (+ agent prep) |
| ≤14 | Seal receipt · decide paid follow-on · log learning | Human |
| Anytime parallel | A0 independent verify invites (share packet) | Human |

---

## Agent vs human (execution discipline)

| Action | Agent | Human |
| --- | --- | --- |
| Write E1 checklist / plan docs | Yes | Review |
| Select first user | No invent | **Yes** |
| Send invite | No | **Yes** |
| Run live client session | Assist prep only | **Yes** lead |
| Set price / invoice | No | **Yes** |
| Mint / LP / wallet | **Never** | Only via new RECORD (not this plan) |

---

## Explicit non-goals

- More foundation infrastructure “just in case”  
- Homepage redesign as a blocker for first user  
- Merging everything open on GitHub as a substitute for usage  
- Token narrative as the adoption path  
- Expanding soul-core to multi-tenant production before E1  
- Treating soft 8.5 SLA as permission to open economics  

---

## Decision record

| Decision | Choice | Rationale |
| --- | --- | --- |
| Front door | **Private AI operator experience** | User-comprehensible; stack exists; services page already sells it |
| First undeniable outcome | **E1 external guided setup + proof pack** | Smallest complete use of AI + governance + optional verify |
| First revenue | **Utility services (setup / Offer C / Offer A)** | No token wait |
| Trust layer | Portal + 8.5 continues in parallel | Does not lead marketing sentence |
| Activation | **Out of scope** | Separate future AUTHORIZATION RECORD |

---

## Authorization reminder

This plan does **not** authorize:

```text
wallet · mint · liquidity · chain activation · financial protocol ops · 18.8
```

It authorizes only **planning and (after human GO) docs packaging + human-led delivery** of a non-economic user experience built from existing components.

---

## Immediate next command after accept

```text
1. Human: ACCEPT_OUTCOME_EXECUTION_PLAN (or amend front door)
2. Docs GO: DRAFT_E1_PRIVATE_AI_OPERATOR_CHECKLIST
3. Human: book first external E1 session
```

```text
FOUNDATION VERIFIED
OUTCOME READINESS MAPPED
EXECUTION PLAN DEFINED  →  E1: first external private AI operator experience
LOCKS: HELD
```
