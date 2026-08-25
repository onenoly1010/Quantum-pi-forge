# QPF Verification V1 — Report

**Status:** VERIFICATION V1 STATUS: PASS (scoped)
**Anchor:** QPF main `8781642` · Specimen #001 frozen 2026-08-25T01:31Z
**Verifier:** `research/verification-v1/verifier.mjs` (independent — imports no QPF modules)

---

## Executive Result

The V1 verifier was subjected to an 11-case adversarial battery covering correct,
false, partially-true, stale-documented, conflicting, malformed, missing,
builder-conclusion-dependent, chain-state-drifted, ambiguous, and self-referential
conditions.

After three evidence-justified repair rounds (R1–R6), **all 10 cases produced
appropriately classified, scoped verdicts**:

```text
A1   VERIFIED               (correct claim, scoped to observation time)
A2   FALSE                  (reserves claim contradicted by getReserves bytes)
A3    VERIFIED + NOT_ESTABLISHED  (compound claim correctly separated)
A4   FALSE + STALE FLAG     (2026-07-16 probe block vs live block 42,558,660+)
A5   CONFLICT               (two distinct W0G addresses, identical name/symbol)
A6    INSUFFICIENT_EVIDENCE ×2 (truncated RPC payloads, safe failure)
A7   NOT_ESTABLISHED        (missing observation identified by type)
A8/A11 NOT_ESTABLISHED + SELF_REFERENCE_DETECTED (circular attempt rejected)
A9   FALSE + STALE FLAG     (chain advanced 42,557,881 → 42,558,660)
A10  NOT_ESTABLISHED        (bytecode presence ≠ full-interface conformance)
```

## Specimen

SPECIMEN-001 — frozen at 2026-08-25T01:31:01Z, anchor `8781642`.
12 files hashed in `SPECIMEN-001/original/MANIFEST.sha256`; `sha256sum -c` passes.
Notable freeze detail: the two W0G `name()` responses are **byte-identical**
(same SHA `6e46f925…`) from two different addresses — identity ambiguity proven
at raw-byte level.

## Method

Raw RPC captures → independent decoder (`decode-observations.mjs`, no QPF imports)
→ normalized observations → claim evaluation (`verifier.mjs`, no QPF imports) →
scoped verdicts. QPF conclusions supplied as support are rejected as circular.

## Adversarial Battery

See `adversarial/battery-results-final.json` (machine-readable) and the table above.
Expected-vs-actual matched 10/10 after repairs.

## Failures Discovered (real, preserved)

Initial battery run: **0/10 cases matched** — total harness+semantics failure.
Failures preserved in conversation log; root causes:

| Repair | Class | Root cause | Fix |
|---|---|---|---|
| R1 | F9 malformed-input / F6 | ABI string decode used `offset*2` as hex-char start, landing inside length word → NUL-garbage names | `start = (offset+32)*2` |
| R2 | F11 reproducibility | Battery invoked nonexistent `research/verifier.mjs` | corrected to `verification-v1/verifier.mjs` |
| R3 | F9 | Truncated capture had null size/hash → wrongly CONTRADICTED | null size/hash → INSUFFICIENT_EVIDENCE |
| R4/R4b | F6/F4 | Malformed input yielded NOT_ESTABLISHED instead of INSUFFICIENT; partial support could yield VERIFIED | precedence reorder + SUPPORTED_PARTIAL requires full coverage |
| R5 | F11 | Same path bug for observations file | corrected |
| R6 | F4 overclaim | `partial` flag not propagated into per_support → fullSupport miscalculation | propagate flag |

Disclosure: intermediate failing battery-result JSONs were overwritten by later
runs (harness v0 limitation). Failure states are preserved verbatim in the
session log and summarized here; future runs will be timestamped per run.

## Repairs

All six repairs were minimal, targeted, and justified by observed failure only.
The existing Level-0 verification machinery was **never modified** — repairs touch
only the new independent verifier, its decoder, and the battery harness.

## Independent Rerun

- LOCAL V1 re-executed fresh during reconciliation: CONFIRM, `result_id ==`
  golden `qpfv0:1a2288…` (see Addendum A5).
- PR #805 implementation executed independently in isolated worktree: **V1_EVIDENCED**
  on synthetic artifact (`qpfv0:00f2ef92…`), T1/T2/T3 pass (Addendum A5).
- Fresh RPC captures for A9 differ from frozen captures → staleness detection proven.

## Self-Reference Test

Case A8-A11 submitted "QPF says VERIFIED" as sole support. Verifier returned
`NOT_ESTABLISHED` + `SELF_REFERENCE_DETECTED`. **Firewall survived.** Zero
circularity violations across the battery.

## Limitations

V1 does not establish: universal correctness of the verifier; full-interface
conformance of deployed contracts; mint authorization; token canonicality
(F7 governance pending); behavior under conditions outside the tested battery;
independence from shared-algorithm bugs (Agent B reuses public algorithm modules
by design — process-level isolation is demonstrated separately by PR #805's
architecture).

## Recheck Conditions

- Any change to `src/verification/` modules or golden fixtures
- Chain reorganization or new deployment at recorded addresses
- New block observations (block numbers advance continuously — timestamps bound claims)
- Metadata CIDs `Qmegxhk…` / `QmX1GUK…` becoming pinned (would unlock source recovery)

## Final V1 Verdict

```text
VERIFICATION V1 STATUS: PASS

Meaning: the tested verification process correctly distinguished supported,
unsupported, conflicting, malformed, stale, duplicate-identity, and uncertain
conditions within the tested scope, and rejected circular self-verification.

This does not establish universal correctness of the verifier.
Untested conditions remain outside the V1 claim.
```
