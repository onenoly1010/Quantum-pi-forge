# Publish then Measure v1

**Operational recommendation (not another conceptual layer):**  
Merge/deploy so `/problems/`, `/try`, and `/verification` are live — **then watch the funnel**.

```text
Creating  →  Observing

Deployment is necessary.
Deployment is not the finish line.
```

---

## Two distinct phases

### Phase A — Publish

**Objective:** Make entry points available.

| Surface | Job |
| --- | --- |
| `/` | What the project is (truthful; locks held) |
| `/problems/` | People recognize their own problem |
| `/verification` | What the service is · request path |
| `/try` | Bounded self-serve engagement |

At the end of Phase A you have created the **opportunity** for interaction — not proof that the funnel works.

**Authorization required:** human GO to merge/deploy (e.g. PR #717 or equivalent).  
**Does not authorize:** mint, LP, wallet, protocol activation, broad “launch” marketing claims.

### Phase B — Measure

**Objective:** Learn from real behavior after pages are live.

| Question | Evidence |
| --- | --- |
| Which pages are visited? | Analytics / logs / CF if available |
| Which problems attract attention? | Path hits on `/problems/*` |
| How many continue to `/try`? | Path transitions |
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

## Operator sequence

```text
1. AUTHORIZE publish (human GO on merge)
2. Merge outcomes-lane / #717 (or equivalent)
3. Confirm CF deploy: /problems/ /try /verification return intended content
4. Freeze packaging
5. Measure (Phase B) — empty metrics are honest data
6. Change only from observed behavior
```

```text
Highest-value work now:
  not another internal document
  → available public entry points
  → learning from actual usage
```
