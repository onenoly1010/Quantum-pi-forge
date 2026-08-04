# Built → Externally Useful (continuous cycle) v1

**Preferred milestone language:** **built → externally useful**
**Avoid overclaiming:** “proof-of-value” can sound like the market already validated the product
**Phase gates (governance):** [EXTERNALLY_USEFUL_OPERATING_GATES_V1.md](./EXTERNALLY_USEFUL_OPERATING_GATES_V1.md) — Planning → Recruitment → Observation → Iteration → Repeat

```text
Externally useful is observable:

  • Someone outside the project can use it
  • They complete a meaningful task
  • They provide feedback
  • Ideally they come back because it solved a problem

That produces evidence you can build on.
```

**Not:** internal assessment alone · AI-generated evaluation alone

---

## Continuous cycle (engineering does not stop)

Not a one-time phase change. A **repeatable loop**:

```text
Build
  ↓
External use
  ↓
Evidence (feedback, issues, receipts)
  ↓
Prioritize improvements
  ↓
Build
```

```text
Engineering doesn't stop.
It becomes evidence-driven.

Locks held = avoid major architecture while learning
whether the current system solves real problems.

If feedback consistently points to the same gap,
then engineering changes are driven by observed usage
— not speculation.
```

---

## What “externally useful” looks like (observable)

| Signal | Observable? |
| --- | --- |
| Outside person can use it | Yes |
| Completes a meaningful task | Yes |
| Provides feedback (including stuck points) | Yes |
| Returns because it solved a problem | Yes — strongest |
| Recommends unprompted | Yes — stronger still |

---

## Practical objective (unchanged, clearer)

1. Find a handful of people in the intended audience (Pi builders, 0G builders, local AI/OSS).
2. Ask them to perform a **concrete task**.
3. Observe success and struggle.
4. Record results (receipts, issues).
5. Improve from **recurring** patterns.
6. Repeat.

**Month-1 numbers:** [FIRST_MONTH_VALIDATION_MILESTONE_V1.md](./FIRST_MONTH_VALIDATION_MILESTONE_V1.md) — 10 contacted · 3 try · 1 unprompted return

**Proof ladder:** [USER_ADOPTION_VERIFICATION_V1.md](./USER_ADOPTION_VERIFICATION_V1.md)

---

## Converged insight (Grok series)

```text
The next limiting factor is learning from real users
rather than adding more features.

Once the feedback loop operates, it informs:
  • engineering priorities
  • community outreach
```

---

## Operating principle (constraint + priority)

```text
LOCKS: held

NEXT WORK:
• Put the existing product in front of real users.
• Observe them completing real tasks.
• Record what succeeds and what fails.
• Change the product or documentation only when the evidence justifies it.
```

### Decision rule (endpoint of this planning cycle)

```text
Pause strategic packaging until there is external evidence to respond to.

FULL RULE:
  No further strategic packaging until an external attempt produces
  actionable feedback.

  Continue only the work that increases the likelihood or quality
  of external validation.

NOT "do nothing."
```

### While waiting for feedback — allowed (serves validation)

| Continue | Why |
| --- | --- |
| Recruit a small number of pilot users | Generates attempts |
| Make onboarding easier **if it blocks participation** | Raises likelihood of attempts |
| Fix defects discovered during pilot attempts | Raises quality of evidence |
| Instrument / observe where users struggle | Higher-quality evidence |
| Docs/UX fixes when **same stuck point** repeats | Evidence-driven, not speculative |

### Still paused (inside-out refinement)

| Pause | Why |
| --- | --- |
| More strategy docs, messaging frameworks, architecture narratives | No external need demonstrated |
| Speculative features “for growth” | Not evidence-driven |
| Major redesign without user friction | Inside-out optimization |

Objective is not collecting opinions. It is collecting **actionable evidence that informs decisions**.

```text
Inside-out (past tendency):  improve our story / plans in isolation
Outside-in (now):            learn from real use

Healthier criterion for genuine adoption.
```

### Locks held (discipline)

| Hold | Why |
| --- | --- |
| No mint / LP / wallet activation as “growth” | Wrong layer; confuses learning |
| No major architecture rewrites pre-feedback | Speculative complexity |
| No invented pilots or wall-of-receipts rows | Evidence integrity |
| No speculative strategy docs while zero external attempts exist | Packaging without evidence |

When the same gap appears across independent users → **then** change product or docs.

---

## Focus shift (practical framework)

| Phase | Focus |
| --- | --- |
| **Past** | Build, design, architect, document |
| **Transition** | Freeze unnecessary changes; invite outside use |
| **Next** | Learn from real usage |
| **After that** | Observed evidence determines what gets built next |

```text
Not:  "What should we build next?"
Yes:  "What did users actually show us they need next?"

Engineering, documentation, and outreach become
responses to observed behavior — not assumptions.
```

```text
MILESTONE LANGUAGE: built → externally useful
CYCLE: build → use → evidence → prioritize → build
LIMITING FACTOR: real-user learning
LOCKS: held

DECISION RULE:
  Pause strategic packaging until external evidence exists.
  Continue only work that raises likelihood or quality of external validation.

ALLOWED WHILE WAITING: recruit · unblock onboarding · pilot defect fixes · observe struggle
PAUSED: more strategy packaging · speculative features · redesign without friction
WORKFLOW: outside-in (learn from real use)
```
