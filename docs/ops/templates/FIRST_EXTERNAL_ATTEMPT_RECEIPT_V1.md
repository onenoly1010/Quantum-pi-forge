# FIRST_EXTERNAL_ATTEMPT_V1

**Boundary object:** next evidence after internal build + governance locks + public surface  
**Rule:** The receipt is written **after** the attempt — never before. Captures **reality**, not intention.  
**Locks:** held — this proof is **usability + truthful feedback**, not mint, liquidity, or chain activation  

```text
INTERNAL BUILD EVIDENCE
        ↓
VERIFICATION / GOVERNANCE LOCKS
        ↓
PUBLIC AVAILABILITY
        ↓
FIRST_EXTERNAL_ATTEMPT_V1   ← current target
        ↓
OBSERVED RESULT
        ↓
EVIDENCE-BACKED CHANGE
```

```text
Not:  Can we build it?
But:  Can someone who did not build it successfully use it?
```

Do **not** remove locks because of this gate. Locks are part of the value proposition.

---

## Internal vs external evidence

| Internal (have) | External (waiting) |
| --- | --- |
| Code compiles · builds pass | Independent person discovers it |
| Governance / safety locks exist | Independent person interacts with it |
| Deployment surfaces · coherent architecture | Independent person produces observable outcome |
| Builder can use it | Outcome recorded **without interpretation** |

```text
Builder is biased toward understanding the system.
First external attempt tests what cannot be simulated:
  Can someone who did not create it understand, access,
  and derive value from it?
```

### Discipline

- Do not create a “success receipt” before success.  
- Do not create an “adoption receipt” before adoption.  
- Do not treat visitors, impressions, or internal tests as users.  
- Do not change architecture to avoid the market signal.  
- **Restraint is the next engineering action** until reality is captured.  

### Seal only after a real attempt

| Invalid | Valid |
| --- | --- |
| Filled in before anyone tries | Filled from what actually happened |
| “They said they will try” | They attempted a concrete entry point |
| Invented success | Positive **or** negative outcome recorded honestly |
| Conclusions dressed as observation | Facts only; `no_interpretation: true` |

---

## Receipt body

```text
FIRST_EXTERNAL_ATTEMPT_V1

Identity:
- External participant (not builder / not creator core loop): YES / NO
- Category: Pi builder | 0G developer | Local AI/OSS | Other: ____
- Code / handle (optional; privacy OK):

Timestamp:
- UTC:

Entry point:
- URL / feature / workflow attempted:

Task:
- What they tried to accomplish:

Expected:
- What the system was supposed to enable:

Observed:
- What actually happened:

Friction:
- Confusion, failure, delay, missing information:

Evidence:
- Screenshot / log / transaction-free proof / feedback link:
- (none is OK if stated)

Decision:
- [ ] Change (what):
- [ ] Defer (why):
- [ ] Preserve current state
- Justification from this attempt only:

Completion:
- [ ] yes  [ ] partially  [ ] blocked

Facilitator present?  yes / no / remote
Permission to summarize publicly?  yes / no
```

### Machine-readable form (facts only)

Capture **after** the attempt. No conclusions in the JSON.

```json
{
  "schema": "FIRST_EXTERNAL_ATTEMPT_V1",
  "participant": "external human",
  "relationship": "not builder",
  "entry_point": "",
  "timestamp": "",
  "action_taken": "",
  "result_observed": "",
  "feedback": "",
  "no_interpretation": true
}
```

Optional private path after seal (do not invent files early):  
`receipts/ops/first-external-attempt-v1-<UTC>.json`

---

## Phase state

```text
PHASE A — BUILD / CONTROL     COMPLETE
PHASE B — OBSERVE             ACTIVE (waiting for attempt)
PHASE C — ADAPT               ONLY AFTER EVIDENCE
```

---

## Gate update after seal

| Area | State |
| --- | --- |
| Recruitment exit | MET (external attempt occurred) |
| Observation | ACTIVE |
| Planning packaging | Paused unless findings require a specific doc/UX fix |
| Locks | **HELD** |

---

## Current gate status (pre-attempt)

```text
ENGINEERING        ✅ SEALED (enough for pilot)
GOVERNANCE         ✅ CONTROLLED
SAFETY BOUNDARY    ✅ HELD
PUBLIC SURFACE     ✅ AVAILABLE (after #717 merge / deploy)
EXTERNAL EVIDENCE  ⏳ WAITING
```

```text
Next meaningful state change: real human interaction, not another document.
```
