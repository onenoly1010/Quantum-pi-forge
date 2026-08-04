# Three-Audience Growth Flywheel v1

**Mode:** Strategy for the proof-of-value phase · **not** new product architecture  
**Engineering:** System ready — frozen except pilot-blocking fixes  
**Parent outcomes:** [OUTCOMES_LANE_V1.md](./OUTCOMES_LANE_V1.md) · [USER_ADOPTION_VERIFICATION_V1.md](./USER_ADOPTION_VERIFICATION_V1.md) · [FOUNDING_BUILDERS_PILOT_PROGRAM_V1.md](./FOUNDING_BUILDERS_PILOT_PROGRAM_V1.md)  

```text
Bigger opportunity than "more human users only":

If the project is easy for AI agents to understand and invoke,
every human using an AI assistant becomes a potential path to QPF/OINIO.

That is a multiplier — not a separate fantasy of agents self-adopting.
```

---

## 1. Three audiences

| # | Audience | Role | What they need |
| --- | --- | --- | --- |
| **1** | **Humans** | Developers, builders, contributors | One win, honest feedback, low onboarding friction |
| **2** | **Organizations** | Projects needing infra / tooling | Clear scope, trust boundaries, inspectable evidence |
| **3** | **AI agents** | Coding assistants, research agents, automation | Docs, APIs, examples, issues they can **consume** |

### Critical constraint on audience 3

```text
AI agents do NOT independently create accounts, choose products,
or form an organic user base.

A person or organization still decides which tools enter the workflow.

AI-friendly packaging lowers friction for those decisions.
It does not replace Founding Builders / human proof.
```

**Realistic path (earlier intuition, refined):**

```text
Build something AI likes to use
  → humans/orgs put it into AI workflows
  → those systems use it repeatedly
```

---

## 2. Positioning (clearer than “another blockchain project”)

| Layer | Focus |
| --- | --- |
| **Pi** | Community, applications, end-user energy — **builders** inside the large network |
| **0G** | AI infrastructure, technical builders, decentralized compute |
| **Quantum Pi Forge / OINIO** | **The bridge** — AI-assisted development + verification discipline + decentralized infrastructure |

```text
Pi  → community & applications
0G  → AI infra & technical builders
QPF → where AI-assisted building meets verifiable, locked, honest systems
```

Avoid leading with: full token/governance/quantum stack.  
Lead with: **useful capability + inspectable proof + human authority.**

---

## 3. The flywheel (humans and AI reinforce each other)

```text
Build useful capability
        ↓
AI can understand and use it
        ↓
Humans discover it through AI (and communities)
        ↓
Humans provide feedback
        ↓
Project improves
        ↓
AI recommendations improve (better docs, examples, discussions)
        ↓
Repeat
```

| Half of the loop | What you do |
| --- | --- |
| Human | Founding Builders pilot, conversations, receipts Proof #1–#5 |
| AI-facing | Keep repo/docs/examples agent-consumable (below) |
| Together | Credible usefulness → stronger human recs **and** AI-assisted discovery |

**Do not assume** models auto-prioritize the project because it exists. They follow **signals**.

---

## 4. Signals that influence AI-assisted discovery

Things you can influence (and that humans also trust):

| Signal | Status direction for QPF |
| --- | --- |
| Clear documentation | Strong — keep pilot path short |
| Active maintenance | Strong — public history |
| Public examples / tutorials | Improve via 60s demo + one-win guides |
| Developer discussions | Founding Builders Discussion + feedback issues |
| References from other projects | Later — after real use |
| **Genuine usage** | **Missing — active proof ladder** |

Usage evidence is the scarce signal. Docs without receipts are incomplete.

---

## 5. AI-agent readiness checklist (packaging, not new product)

Make the repo easy for assistants to **discover, explain, and invoke** (read-only first):

| Check | Intent | Repo anchors |
| --- | --- | --- |
| One-sentence what/why | 15-minute pitch | Pilot page, what-it-does |
| Builder quickstart | Clone → one command | `docs/BUILDER_QUICKSTART.md`, E1 checklist |
| Machine-readable status | Agents parse locks | `verification-status-v1.json` |
| Explicit non-goals | Prevent wrong tool use | mint/LP NOT_AUTHORIZED everywhere |
| Runnable scripts named clearly | `npm run` / `./scripts/` | cockpit, verify:public-portal |
| Public issues/discussions | Feedback corpus | founding-builder-feedback template |
| Examples of one win | Contract understand / verify / summarize | Pilot program, demo script |
| Authority model | Human GO vs prepare-only AI | Local multi-agent cockpit docs |

**When improving for AI:** prefer clearer docs and examples over new agent product layers.

---

## 6. How this sits with the current execution plan

| Layer | Priority now |
| --- | --- |
| Founding Builders (10 humans) | **Primary** — Proof #1–#5 |
| Pi builders / 0G builders / local AI | **Channels** for those humans |
| AI-friendly packaging | **Parallel hygiene** — lowers friction for AI-assisted users |
| Orgs | After repeated human receipts |
| Agent-to-agent fantasy as growth | **After** humans integrate tools |

```text
Next phase is NOT primarily more code.
It is enough real interactions that QPF accumulates
credible evidence of usefulness.

Then human recommendations and AI-assisted discovery
both get stronger — because they have something concrete to point to.
```

---

## 7. Weekly implication

Keep:

- 5 Pi + 5 0G + 5 AI-dev discovery conversations  
- Pilot page + feedback wall + feedback roadmap  
- Seal receipts when real  

Add (lightweight):

- One improvement per week that makes the **repo easier for an AI to explain correctly** (README blurb, example, FAQ “what this is not”)  
- Never invent usage so that “AI recommends” a fake story  

---

## 8. Success definition (aligned)

| Weak | Strong |
| --- | --- |
| “AI might use this someday” | Human put QPF in an AI workflow and came back |
| Generic model praise | Receipt: task done, use again |
| Broad Pi broadcast | Pi **builder** feedback |
| More architecture for agents | Clearer docs so agents don’t mis-describe locks |

```text
HUMANS: first trust and feedback
ORGS: later, with evidence
AI AGENTS: multiplier via consumable project surfaces
FLYWHEEL: capability → AI-understandable → discovery → feedback → improve → repeat
EVIDENCE: still required (wall of receipts)
LOCKS: held
```
