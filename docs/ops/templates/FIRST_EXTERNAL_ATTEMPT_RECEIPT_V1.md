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

## Seal only after a real attempt

| Invalid | Valid |
| --- | --- |
| Filled in before anyone tries | Filled from what actually happened |
| “They said they will try” | They attempted a concrete entry point |
| Invented success | Positive **or** negative outcome recorded honestly |

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
