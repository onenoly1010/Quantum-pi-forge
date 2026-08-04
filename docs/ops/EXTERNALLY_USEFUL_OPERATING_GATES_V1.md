# Externally Useful — Operating Gates v1

**Role:** Governance rule for when to plan vs execute vs package  
**Companion:** [EXTERNALLY_USEFUL_CYCLE_V1.md](./EXTERNALLY_USEFUL_CYCLE_V1.md)  
**PR context:** Outcomes / pilot lane (#717 and successors)  

```text
Distinguish PREPARATION from EXECUTION.
Do not confuse producing more artifacts with making progress.

Success metric is not:
  another document · refined roadmap · improved messaging

Success metric is:
  Did another person try it?
  What blocked them?
  What did they accomplish?
  What changed because of what they reported?
```

---

## Explicit phase gates (repeatable)

| State | Primary work | Exit condition | Then go to |
| --- | --- | --- | --- |
| **Planning** | Define workflow, documentation, pilot criteria | Pilot is ready | Recruitment |
| **Recruitment** | Find and onboard pilot users | First external attempt | Observation |
| **Observation** | Watch, collect feedback, measure friction | Actionable findings exist | Iteration |
| **Iteration** | Improve product/docs based on findings | Updated pilot released (or fix shipped) | Repeat |
| **Repeat** | Recruit next users | Continuous learning | Observation (or Recruitment if pipeline empty) |

```text
Each phase has a clear exit condition.
That prevents slipping back into endless planning.
```

### Current default state (post-packaging)

```text
Planning exit: largely MET for Founding Builders pilot
  (criteria, page, feedback path, receipts, month-1 targets documented)

PRIMARY STATE NOW → Recruitment
EXIT → first external attempt (then Observation)
```

Do not re-enter **Planning** as the primary state without a reason from **Observation** findings (e.g. pilot criteria wrong, onboarding definition broken).

---

## Preparation vs execution

| Preparation (was useful) | Execution (now) |
| --- | --- |
| Strategy docs, pilot program design | Recruit builders |
| Messaging frameworks | Observe real tasks |
| Architecture narratives | Record blocks / wins |
| Roadmap packaging | Change only from findings |

```text
Execution is recruiting and observing,
not another packaging pass.
```

---

## Packaging principle (governance)

```text
Package only when new external evidence justifies updating the package.

NOT: never package again
YES: packaging is a response to evidence, not a substitute for progress
```

| Package when | Do not package when |
| --- | --- |
| Multiple users stuck at same step | Zero external attempts yet |
| Actionable finding needs a clearer onboarding path | “Improve our story” in isolation |
| Iteration exit: updated pilot materials for next cohort | Speculative messaging polish |

---

## Evidence questions (every Observation session)

1. Did another person try it?  
2. What blocked them?  
3. What did they accomplish?  
4. What changed because of what they reported?  

If (4) is always “nothing / more docs with no users,” the project has slipped back into Planning without exit.

---

## Locks (unchanged)

```text
LOCKS: held
  no mint / LP / wallet activation as growth
  no major architecture without recurring external friction
```

---

## State checklist (mark honestly)

| Gate | Met? | Evidence |
| --- | --- | --- |
| Planning → pilot ready | ☐ / ☑ | |
| Recruitment → first external attempt | ☐ | |
| Observation → actionable findings | ☐ | |
| Iteration → updated pilot / fix released | ☐ | |
| Repeat → next users in pipeline | ☐ | |

```text
GOVERNANCE RULE:
  Stop primary Planning when pilot is ready.
  Resume packaging only when external evidence justifies it.
  Primary progress = external attempts + findings + evidence-driven change.
```
