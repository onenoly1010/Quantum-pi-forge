# QPF Agent Verification Interoperability v1

Research-lane experiment only. This branch does not modify production verification machinery.

## Invariant

The experiment imports the existing Level 0 verifier unchanged. Agent B does **not** receive the QPF verification result or QPF's internal conclusion. Agent B independently recomputes artifact/receipt integrity from the evidence package.

## Tests

- **T1 Original:** Agent A artifact + receipt → existing QPF verifier = `pass`; Agent B independently = `ACCEPT`.
- **T2 Tampered:** single-byte mutation of the artifact → independent verifier = `REJECT` and existing QPF verifier must report a failed artifact hash check.
- **T3 Determinism:** identical inputs produce identical QPF `result_id` values across repeated runs.

All outcomes, including failures and inconclusive conditions, are recorded. No economic, wallet, credential, deployment, mint, liquidity, yield, payment, or governance action is performed.

## Run

From the repository root:

```bash
node research/agent-verification-v1/run.mjs
```

The runner writes its evidence bundle under `research/agent-verification-v1/out/` in the working tree. The output directory is intentionally not part of this research commit; generated evidence is retained only when explicitly sealed as an experiment artifact.

## V1 gate

`V1_EVIDENCED` is emitted only when T1, T2, and T3 pass. A failed or inconclusive run is evidence and is never overwritten by a later run.
