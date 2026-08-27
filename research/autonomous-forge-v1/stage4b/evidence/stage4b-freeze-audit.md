# Stage 4B Freeze Audit — commit 7924bff

- schema: qpf.stage4b.freeze-audit.v1
- audit_date: 2026-08-27
- branch: autonomous/stage4b-runtime-fault-v1
- commit: 7924bff (17 files, +2223)
- audited_by: AI agent (read-only probes + repairs noted)

## Audit items and findings

1. **Commit identity** — PASS. `git show --stat 7924bff` matches the
   reported artifact set exactly; branch HEAD is 7924bff on
   `autonomous/stage4b-runtime-fault-v1`, parent 96d8a18.
2. **Cross-contamination** — PASS. No production/mainnet/deploy paths in
   the commit; all 17 files under `GO/`, `research/autonomous-forge-v1/`.
3. **Negative tests exercise the checker** — PASS. Each tamper case writes
   a modified receipts file and runs the real checker process; verdicts
   recorded with specific violating check IDs (T1→C2,C3; T2→C5a; T3→C7;
   T4→C2,C3,C6). Clean trace restored byte-identical
   (sha256 474f3d9d…).
4. **First-failure (C6) preservation** — PARTIAL, disclosed. Original
   convicted trace was overwritten during repair and is not recoverable.
   Incident record created:
   `stage4b/evidence/stage4b-first-run-C6-conviction-INCIDENT.md`.
   Defect class conviction remains reproducible via negative test T4.
   Run-scoped trace paths mandated for Stage 4C.
5. **GO cryptographic reproducibility** — FAIL initially, repaired.
   Finding: `stage4b-sign-go.cjs` re-signed unconditionally (fresh
   `timestamp_utc` inside the signed payload), so the artifact is not
   byte-reproducible and an audit verification run **mutated the committed
   GO record**. Repair: (a) GO restored byte-identical from 7924bff
   (sha256 569695dc…, payload_sha256 08c652…); (b) genuine `--verify-only`
   mode added — reconstructs the payload from the on-disk file, verifies
   check-novalidate + find-principals + payload_sha256 match, writes
   nothing. Verified: exit 0, recovers 08c652…, file hash unchanged.
   Note: reproducibility of the *artifact* (given a fixed timestamp) holds;
   the timestamp is inside the signature, so byte-level re-signing is not
   idempotent by design.
6. **Final trace = evaluated trace** — PASS. Worktree receipts sha256
   equals committed blob (474f3d9d…); `git diff 7924bff` over stage4b/ +
   GO/ empty at freeze time.
7. **Production/mainnet isolation** — PASS. Commit touches no deploy/,
   contracts/, or mainnet machinery. Checker re-run from frozen state:
   NOT DISPROVEN.
8. **`deploy/source-identity-correspondence-v1.json` worktree change** —
   EXPLAINED, not stage-crossing. Diff is entirely
   `artifactDirectoryPresent: false → true` plus gap-text rewording across
   entries. Cause: `verify:all` during the pre-commit workflow ran the
   Foundry build, creating the gitignored `contracts/out/` directory; the
   correspondence probe then regenerated the file with the probe result
   flipped. It is workflow-generated probe state, not AI-authored change
   and not part of the 4B commit. Disposition: leave unstaged; do not
   publish alongside 4B; it will regenerate deterministically on any
   machine where the build has or has not run. Flagged for the operator
   because the committed baseline claims artifacts absent while this
   machine has them — a probe-vs-reality skew worth normalizing
   (e.g., probe should not rewrite the file during verify).

## Repairs made during this audit (on the branch, uncommitted)

- `stage4b/stage4b-sign-go.cjs`: added `--verify-only` (never writes GO_PATH).
- `stage4b/evidence/stage4b-first-run-C6-conviction-INCIDENT.md`: created.
- `GO/stage4b-execution-decision.json`: restored byte-identical to 7924bff
  (no net change).

## Verdict

7924bff is frozen and internally consistent; two tooling/process defects
were found and fixed during the audit itself. Ready to commit audit
repairs, then proceed to Stage 4C design.
