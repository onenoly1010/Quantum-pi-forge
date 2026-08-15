# Publish then Measure v1

**Operational recommendation (not another conceptual layer):**  
Merge/deploy so `/problems/`, `/try.html`, and `/verification` are live — **then watch the funnel**.

```text
Creating  →  Observing

Deployment is necessary.
Deployment is not the finish line.
```

---

## Three gates (do not collapse)

| Gate | Success criterion | Evidence |
| --- | --- | --- |
| **Enablement** | People can access pages and complete the intended flow | Deploy, build checks, routing, correct titles (not SPA homepage fallback) |
| **Discovery** | People actually arrive | Traffic, referrals, search, direct visits |
| **Validation** | Some visitors find enough value to continue | Requests, follow-ups, repeat use, later willingness to pay |

```text
Passing Gate 1 ≠ passed Gates 2 or 3.
Cannot evaluate Gates 2–3 until Gate 1 exists.

#718 (or equivalent deploy) = beginning of evidence collection
#718 ≠ evidence that the funnel already works
```

### Phase A — Publish (Enablement)

**Objective:** Make entry points available.

| Surface | Job |
| --- | --- |
| `/` | What the project is (truthful; locks held) |
| `/problems/` | People recognize their own problem |
| `/verification` | What the service is · request path |
| `/try.html` | Bounded self-serve engagement |

At the end of Phase A you have created the **opportunity** for interaction — not proof that the funnel works.

**Authorization required:** human GO to merge/deploy (e.g. PR #717 or equivalent).  
**Does not authorize:** mint, LP, wallet, protocol activation, broad “launch” marketing claims.

### Phase B — Measure

**Objective:** Learn from real behavior after pages are live.

| Question | Evidence |
| --- | --- |
| Which pages are visited? | Analytics / logs / CF if available |
| Which problems attract attention? | Path hits on `/problems/*` |
| How many continue to `/try.html`? | Path transitions |
| Where do they stop? | Drop-off |
| What do they ask repeatedly? | Email / issues / support |

Those observations decide the next product change — not internal redesign in a vacuum.

---

## What publish does **not** guarantee

| Not automatic |
| --- |
| Discovery (traffic) |
| Clarity of messaging |
| Compelling workflow |
| Conversion |

Those are **empirical**. Publishing is necessary; it is not sufficient.

---

## Alignment with operating model

| Step | Meaning |
| --- | --- |
| **Preparation** | Built and verified internally (done enough) |
| **Authorization** | Decide to publish |
| **Execution** | Deploy the pages |
| **Verification** | Measure real-world behavior → next iteration |

```text
Do not blur:
  "we built it"  ≠  "it works in the world"
```

---

## Surfaces checklist (Phase A)

| Path | In outcomes-lane branch |
| --- | --- |
| `/problems/` + 4 problem pages | ☑ |
| `/try.html` | ☑ |
| `/verification` → certificate page | ☑ |
| Certificate #000 example (docs) | ☑ |

**Live on quantumpiforge.com:** only after merge + CF Pages deploy.

---

## Authorization boundary (narrow)

```text
Not: "launch a business"
Yes:
  Authorize merge
    → deploy public surfaces
    → verify they are live (correct titles, not SPA homepage)
    → observe what happens
```

State machine:

```text
Foundation → Verification/evidence → Packaging
  → #718 enablement → [external observation begins]
  → validation → iteration
```

### Before merge authorization

| Check | Required |
| --- | --- |
| Scope bounded | ☑ |
| No unsupported claims (mint/LP/adoption as fact) | ☑ |
| Safety/governance locks remain | ☑ |
| Pages prepared | ☑ on branch |
| Build/evidence checks pass | re-check on PR |

### After merge/deploy

| Check | Pass criterion |
| --- | --- |
| `/` | Loads; truth about locks intact |
| `/problems/` | Reachable; problem-page titles (not homepage title) |
| `/try.html` | Self-serve walkthrough content |
| `/verification` or certificate page | Service capability + request path |
| Descriptions | Match actual capability |
| No hidden unfinished critical paths | Or clearly marked |

### Then freeze packaging and measure

A freeze is **not** “project done.”  
It is a **stable experiment** so results can be attributed.

```text
If you change explanation, pages, workflow, and offer every day,
you cannot tell what caused a result.

Stable version → information
```

---

## Operator sequence

```text
1. AUTHORIZE publish (human GO on merge of #718 or equivalent)
2. Merge + CF deploy
3. Verify live surfaces (checklist above)
4. Freeze packaging
5. Measure (Phase B) — empty metrics are honest data
6. Change only from observed behavior
```

```text
Known:  built · prepared · authorized-or-not · locked
Unknown: how external people react
  → cannot be solved by more internal reasoning

Highest-value work:
  public entry points → learning from actual usage
Not: another internal document

#718 = Phase A enablement, not "funnel works"
Locks: held
Construction certainty → market uncertainty
  (outside evidence becomes most valuable signal)
```
