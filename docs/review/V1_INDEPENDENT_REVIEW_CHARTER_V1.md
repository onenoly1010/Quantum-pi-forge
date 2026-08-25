# QPF Verification V1 — Independent Review Charter

**Status:** CHARTER — DRAFT FOR GOVERNANCE APPROVAL
**Review object:** commit `517ef1ed55716a95bca93ca8e2b95febf5b7e88c`
(`test/verification-v1-canonical`; tree identical to `dd772d8`)
**Reviewed artifact:** `research/verification-v1/` at that commit
**Anchor claim:** "Verification V1 STATUS: PASS (scoped), independently reproduced
at anchor `8781642`, 10/10 adversarial cases, self-reference firewall held."

---

## 1. Purpose

Establish whether the canonical V1 result can be **reproduced by an operator who
does not trust the V1 report**. This charter deliberately requires a *different
operator or process* than the one that produced V1 and the maintainer
reproduction of 2026-08-24. Acceptance of either prior reproduction does not
satisfy this charter.

## 2. Operator independence requirements

The reviewer MUST:

- R1. Derive every verdict from raw evidence only: `SPECIMEN-001/original/*.raw.json`,
  the case files in `adversarial/cases/`, and the code (`verifier.mjs`,
  `decode-observations.mjs`). REPORT.md may be read *after* conclusions are
  recorded, for comparison only.
- R2. Use a fresh clone / clean checkout of the review-object commit; no reuse of
  maintainer working trees, node state, or cached results.
- R3. Record their verdicts **before** viewing `REPORT.md` or
  `adversarial/battery-results*.json` expected-values (timestamp the record).

## 3. Required challenges

The reviewer must complete all seven:

| # | Challenge | Pass condition |
|---|---|---|
| C1 | Reproduce 10/10 | Fresh `run-battery.mjs` run: 10 cases, 10 pass, 0 fail |
| C2 | Derive verdicts without trusting the report | Reviewer's pre-recorded verdicts match A1–A11 outcomes per §4 table |
| C3 | Identify every repair from evidence | All six repairs (R1–R6) re-derived from REPORT.md repair table + session log references; none invented, none missed |
| C4 | Verify specimen hashes | `sha256sum -c SPECIMEN-001/original/MANIFEST.sha256`: 12/12 OK |
| C5 | Reproduce self-reference rejection | Case A8-A11 yields NOT_ESTABLISHED with SELF_REFERENCE flagged, from code inspection AND execution |
| C6 | Reproduce the R1 decoder defect | Demonstrate that `(offset)*2` (the pre-repair decode start) lands inside the length word; confirm repaired `(offset+32)*2` decodes the frozen W0G name bytes correctly |
| C7 | Enumerate non-establishments | Independently list what V1 does NOT establish; must include at minimum: universal verifier correctness, full-interface conformance, mint authorization, token canonicality, untested conditions, shared-algorithm independence |

## 4. Expected verdict table (for post-hoc comparison only)

```text
A1      VERIFIED (scoped to observation time)
A2      FALSE
A3      VERIFIED (supported part) + NOT_ESTABLISHED (unsupported part)
A4      FALSE + STALE FLAG
A5      CONFLICT (two distinct addresses, byte-identical name/symbol)
A6      INSUFFICIENT_EVIDENCE ×2 (truncated payloads)
A7      NOT_ESTABLISHED (missing observation)
A8/A11  NOT_ESTABLISHED + SELF_REFERENCE_DETECTED
A9      FALSE + STALE FLAG
A10     NOT_ESTABLISHED (bytecode presence ≠ interface conformance)
```

## 5. Out of scope / prohibitions

- Do NOT modify any file under `research/verification-v1/` in the review object.
- Do NOT regenerate RPC captures and substitute them for frozen evidence
  (fresh captures may be taken *in addition*, clearly labeled, e.g. to probe
  staleness behavior).
- Do NOT run economic lanes; everything here is read-only.
- Do NOT treat the Cloudflare/orchestrator layer (V2) as part of this review.

## 6. Reporting

The reviewer produces a signed report containing:

1. Environment description (commit, tool versions, date).
2. Pre-recorded verdicts (per R3) with timestamps.
3. Results for each challenge C1–C7, each marked PASS/FAIL/PARTIAL.
4. Any discrepancy between reviewer verdicts and the expected table, with
   minimal reproduction.
5. An explicit statement of what the reviewer could NOT verify.

## 7. Outcome semantics

- **All seven PASS →** V1 result upgraded from "maintainer-reproduced" to
  "independently reviewed"; V2 gate opens for DESIGN (still read-only).
- **Any FAIL →** discrepancy report becomes a new defect record; V1 status
  returns to REVIEW_REQUIRED; no silent patching of the frozen specimen —
  repairs, if needed, occur in a successor version with preserved failure
  evidence.

---

*READY ≠ AUTHORIZED. This charter requires governance approval before being
assigned to an independent operator.*
