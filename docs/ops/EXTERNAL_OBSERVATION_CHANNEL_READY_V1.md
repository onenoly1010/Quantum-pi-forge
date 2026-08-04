# External Observation Channel — Ready Checklist v1

**Waiting is not a failure state — it is a controlled state.**

```text
PHASE A — PROOF BUILD            ✅
PHASE B — OBSERVATION GATE       ⏳ WAITING FOR first external attempt
PHASE C — EVIDENCE PROCESSING    after observed facts only

EXTERNAL EVIDENCE  ⏳ WAITING
NEXT DOCUMENT: none until after an attempt
LOCKS: held
```

```text
The absence of external evidence is itself the current state.
Do not fill that gap with assumptions.
Do not create polished internal artifacts that increase packaging
without increasing external truth.
```

**Next useful action:** a **recruitment channel** that makes the first interaction possible and observable — not a PR, architecture expansion, or readiness essay.

---

## Phase map

| Phase | Content | Status |
| --- | --- | --- |
| **A** Internal validation | Build, governance, safety, docs, repo parity | ✅ |
| **B** External observation | First independent interaction | ⏳ |
| **C** Evidence-based decision | Receipt only from observed facts | after B |

---

## What counts as a first external evidence event

Any of:

- outside person attempts onboarding  
- outside developer reviews or runs a workflow  
- outside user interacts with a public surface  
- outside party reports success, failure, confusion, or a request  

Then record **`FIRST_EXTERNAL_ATTEMPT_V1`** (after the attempt only):

- timestamp · interaction type · observed result · evidence reference · follow-up decision  

Template: [templates/FIRST_EXTERNAL_ATTEMPT_RECEIPT_V1.md](./templates/FIRST_EXTERNAL_ATTEMPT_RECEIPT_V1.md)

---

## Until then — do not claim

```text
no activation claim
no adoption claim
no liquidity claim
no success receipt
no new packaging cycle
```

AI agents may prepare, verify, and surface state. **Reality** must provide the external signal.

---

## Observation channel ready (checklist)

Use this so the first attempt is not lost to chaos.

| # | Channel | Ready? | Notes |
| --- | --- | --- | --- |
| 1 | Pilot entry | ☐ | `/founding-builders-pilot` live after #717 merge/deploy |
| 2 | Feedback issue form | ☐ | `.github/ISSUE_TEMPLATE/founding-builder-feedback.yml` on main |
| 3 | Receipt template at hand | ☐ | `FIRST_EXTERNAL_ATTEMPT_V1` (fill **after** attempt) |
| 4 | Public surfaces to point at | ☐ | site, verify portal, repo — no wallet required |
| 5 | Human available to observe | ☐ | facilitator optional but path logged |
| 6 | Private place for PII | ☐ | names not committed to public git |
| 7 | Decision rule known | ☐ | change / defer / preserve from evidence only |

When all critical boxes are ☑, **Recruitment** can proceed without inventing evidence.

---

## Controlled path for first interaction (execution, not packaging)

```text
1. Merge #717 when ready (public pilot surfaces + ops model on main)
2. Invite one external person (category: Pi builder / 0G / local AI)
3. Point them at one concrete entry + one concrete task
4. Observe (or collect their report)
5. Seal FIRST_EXTERNAL_ATTEMPT_V1 from what happened
6. Only then: decision (change / defer / preserve)
```

```text
ENGINEERING        ✅ SEALED
GOVERNANCE         ✅ CONTROLLED
SAFETY BOUNDARY    ✅ HELD
PUBLIC SURFACE     ✅ / after merge
EXTERNAL EVIDENCE  ⏳ WAITING
```
