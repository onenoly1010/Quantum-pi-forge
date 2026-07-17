# Spiral Return — July 2026 Execution Objective

**Type:** Time-bound execution objective (not a philosophy lane)  
**Success metric:** Completed, verifiable actions with evidence — not intention  
**Operating system:** [`../ROOT_AWARENESS_VERIFICATION_PROTOCOL_V1.md`](../ROOT_AWARENESS_VERIFICATION_PROTOCOL_V1.md)  
**State file:** [`spiral-return-july-2026-state.json`](./spiral-return-july-2026-state.json)  
**Evidence dir:** `docs/activation/spiral-return/evidence/` (append-only)  
**Created (UTC):** 2026-07-16  

---

## Prime rule

Every day should produce **at least one measurable artifact**:

- a completed technical task with receipt, **or**
- a verified operational improvement with log/path, **or**
- a real-world preparation milestone with dated confirmation

Loop:

```
Action → Evidence → Verification → Record → Next Action
```

Do **not** restart Activation Gate PASS items unless source/deploy/chain/config changed.

---

## 1. Deadline (requires human pin)

| Field | Value |
| --- | --- |
| **Calendar window** | July 2026 |
| **Deadline date** | **`TBD_HUMAN`** — not assumed |
| **Candidate default (if unpinned)** | `2026-07-31T23:59:59Z` — **UNKNOWN until authorized** |
| **Departure / return window** | **`TBD_HUMAN`** |
| **Authorization phrase** | `Authorize Spiral Return deadline: YYYY-MM-DD` |

Until deadline is authorized: status of “on track for departure” remains **UNKNOWN**.

---

## 2. Minimum “must be true” before departure

These are the **only** hard gates for “departure-ready.” Everything else is optional polish.

| ID | Must be true | Evidence form | Status until proven |
| --- | --- | --- | --- |
| M-01 | Transportation plan confirmed (mode + dates) | Ticket/reservation ref or written plan path + date | UNKNOWN |
| M-02 | Fuel/energy/budget line item secured for travel days | Budget note or receipt (no secrets in repo) | UNKNOWN |
| M-03 | Lodging/camp plan confirmed | Reservation or site plan path | UNKNOWN |
| M-04 | Critical power/equipment smoke-tested once | Dated log: device, test, pass/fail | UNKNOWN |
| M-05 | Offline capability: critical repos + docs reachable without cloud AI | `git status` on machine + offline pack checklist | UNKNOWN |
| M-06 | Local AI stack boots and completes one non-mutating verify | Command log exit 0 (e.g. wallet preflight or build) | UNKNOWN |
| M-07 | Backups verified restorable (not only “backup ran”) | Restore test note or checksum list | UNKNOWN |
| M-08 | Wallet access verified **without** private keys in docs/logs | Address book + read-only balance/RPC check or hardware presence note | UNKNOWN |
| M-09 | Important receipts/docs available offline | Indexed path list under evidence or encrypted vault note (no keys) | UNKNOWN |
| M-10 | System snapshot frozen: HEAD commit + dual-address deploy matrix known | `git rev-parse HEAD` + pointer to `contracts/DEPLOYED_ADDRESSES.md` | UNKNOWN |
| M-11 | Funding claims split: confirmed / pending / expected | Table in state JSON or evidence file | UNKNOWN |
| M-12 | No uncommitted **unknown** dirty tree (AI work classified or committed) | Dirty Tree Policy inventory or clean porcelain | UNKNOWN |

**Departure-ready** ⇔ all of M-01…M-12 are **PASS** with evidence paths, **or** human records explicit **WAIVE** with reason per item.

---

## 3. Full July checklist (track status only)

Status vocabulary: `NOT_STARTED` | `IN_PROGRESS` | `PASS` | `FAIL` | `BLOCKED` | `UNKNOWN` | `WAIVED`

### 3.1 Physical readiness

| ID | Item | Status |
| --- | --- | --- |
| P-01 | Transportation confirmed | UNKNOWN |
| P-02 | Fuel/energy budget secured | UNKNOWN |
| P-03 | Lodging/camp plan confirmed | UNKNOWN |
| P-04 | Equipment and power requirements tested | UNKNOWN |
| P-05 | Offline capability maintained | UNKNOWN |

### 3.2 Operational readiness

| ID | Item | Status |
| --- | --- | --- |
| O-01 | Critical repositories accessible | UNKNOWN |
| O-02 | Local AI stack functional | UNKNOWN |
| O-03 | Backups verified | UNKNOWN |
| O-04 | Wallet access verified (no key exposure) | UNKNOWN |
| O-05 | Important receipts/documents available offline | UNKNOWN |

### 3.3 Evidence readiness

| ID | Item | Status |
| --- | --- | --- |
| E-01 | Current system state captured | PARTIAL — see activation final package; re-snapshot at freeze |
| E-02 | Latest commits and deployments recorded | PARTIAL — `DEPLOYED_ADDRESSES.md` RPC-backed; uncommitted evidence exists |
| E-03 | Governance receipts indexed | PARTIAL — repo has receipts; July offline index may be incomplete |
| E-04 | Funding claims separated (confirmed / pending / expected) | UNKNOWN |

### 3.4 Financial reality gate

A **wallet event** is complete **only** when all four hold:

1. Transaction exists on-chain  
2. Receiving address confirmed  
3. Balance change visible  
4. Source of funds identifiable  

Until then: **PENDING** (never “received” / “funded” in public or grant language).

| ID | Item | Status |
| --- | --- | --- |
| F-01 | Confirmed on-chain funds (if any) listed with tx hash | UNKNOWN |
| F-02 | Pending applications listed (no balance claim) | UNKNOWN |
| F-03 | Expected possibilities listed as non-evidence | UNKNOWN |

---

## 4. Daily forcing function

| Rule | Detail |
| --- | --- |
| Minimum | ≥1 artifact per calendar day until deadline or WAIVE day |
| Artifact types | Tech receipt, ops log, physical prep confirmation |
| Record | Append `docs/activation/spiral-return/evidence/DAY-YYYYMMDD.md` |
| Anti-loop | Do not reopen Activation PASS gates without trigger |
| Uncertainty | Each action must reduce at least one UNKNOWN → PASS/FAIL/BLOCKED |

---

## 5. Relation to Activation lane

| Activation residual | Spiral Return handling |
| --- | --- |
| B-01 dual addresses | M-10: know both sets; do not pick canon without human |
| B-02 untrusted owner | Do not claim safe ownership; offline note only |
| B-04 wallet E2E | Optional stretch; M-08 is access/readiness not MetaMask suite |
| B-06 uncommitted evidence | Prefer authorize Commit A/B before departure freeze |

Spiral Return can be **departure-ready** while economic **ACTIVATION READY** remains BLOCKED — they are different objectives.

---

## 6. Human authorization phrases

| Action | Phrase |
| --- | --- |
| Pin deadline | `Authorize Spiral Return deadline: YYYY-MM-DD` |
| Mark item PASS | `Authorize Spiral Return PASS: <ID>` + evidence path |
| Waive item | `Authorize Spiral Return WAIVE: <ID> because …` |
| Daily freeze snapshot | `Authorize Spiral Return freeze snapshot` |
| Commit spiral-return docs | `Authorize commit` (docs only) |

---

## 7. First actions (smallest interventions)

1. **Human:** pin deadline date.  
2. **Agent (autonomous):** create empty daily evidence stub template; keep state JSON in sync when statuses change.  
3. **Human or agent after auth:** commit activation evidence (Commit A/B) so offline pack includes durable git history.  
4. **Human:** fill physical readiness (P-01…P-03) — agent cannot invent travel facts.  
5. **Agent (read-only):** when asked, re-run root state + M-06 style local verify and seal evidence.

---

## Stop condition

| Outcome | When |
| --- | --- |
| **DEPARTURE READY** | All M-01…M-12 PASS or WAIVED with evidence |
| **BLOCKED** | Deadline passed with open M-gates; produce finite report only |
| **Not economic ACTIVATION READY** | Unrelated unless human merges objectives |
