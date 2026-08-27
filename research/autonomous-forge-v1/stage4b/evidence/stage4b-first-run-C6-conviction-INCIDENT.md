# Stage 4B First-Run C6 Conviction — Incident Record

- schema: qpf.stage4b.incident.v1
- incident_id: STAGE4B-C6-CONVICTION-001
- date: 2026-08-27
- commit_context: 7924bff (post-repair)
- classification: DEFECT-IN-EXPERIMENT-MACHINERY (caught by independent checker)

## What happened

The first Stage 4B runner build was **convicted by its own blind checker**
(check C6, `attribution_binding`). Parent and child worker processes each
derived `op_seq` from per-process counters that collided across forks, so
distinct ALLOWs (different operations) were emitted under the same
`(agent, op_seq)` key. The checker classified those keys as ambiguous
attribution and returned FALSE. The defect was repaired by deriving
`op_seq` from the receipt log itself; the clean trace was then re-verified
NOT DISPROVEN.

## Evidence preservation status (honest disclosure)

- **The original convicted first-run receipt trace was NOT preserved.**
  The repair cycle overwrote `stage4b-receipts.jsonl` in place, and the
  committed evidence (`stage4b-checker-report.json`) reflects only the
  post-repair clean run. This is a preservation gap in the freeze
  procedure, recorded here rather than papered over.
- What IS preserved and reproducible:
  - Negative test **T4** (`stage4b-negative-tests.json`) constructs the
    identical defect class — the same `(agent, op_seq)` key ALLOWed for two
    different operations — and demonstrates the checker convicting it
    (FALSE, violations C2/C3/C6). T4 exercises the real checker against a
    real tampered trace file; it does not assert expected strings.
  - The clean trace is committed byte-identical
    (`receipts sha256 474f3d9d…` matches `receipts_restored_sha256`).

## Lesson folded into freeze procedure

Fault-injection runs must write traces to unique, never-overwritten
run-scoped paths; the repaired run gets a new path and the convicted run's
trace is retained as evidence. Implemented as a requirement for Stage 4C.
