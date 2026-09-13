# QPF External Verification Suite v1

**Spec:** `qpf-external-verification/v1`  
**Does not authorize mint, liquidity, yield, payment, or governance.**  
**FIRST $1 is not earned by running this suite.**

An outsider can test QPF without becoming a mechanism for changing QPF.

## Propositions (kept separate)

| ID | Question | Needs |
| --- | --- | --- |
| **T0** | Does the public surface accurately describe the published state? | HTTPS |
| **T1** | Does independently observed chain state match the published state? | RPC |
| **T2-A** | Does the repository evidence machinery reproduce its documented tests? | repo tests |
| **T2-B** | Does Level 0 produce deterministic IDs an outsider can re-derive? | golden files only |

A T1 RPC outage is **BLOCKED**, not **FAIL**. A wrong `result_id` on T2-B is **FAIL**.

## Verdicts

| Overall | Meaning |
| --- | --- |
| **CONFIRM** | Every applicable test passed; no unexplained drift; identifiers reproduced |
| **PARTIAL** | One or more assertions confirmed; documented drift or a test unavailable |
| **BLOCKED** | Insufficient inputs/infrastructure to conclude |
| **FAIL** | A tested QPF assertion was demonstrably false |

## T2-B golden pack (no wallet, no RPC, no QPF narrative)

```text
external-verification/v1/fixtures/t2b-golden/
  artifact.bin
  receipt.json
  expected-result.json
  expected-package.json
  manifest.json
```

Independently:

```text
artifact  → sha256
receipt   → sha256
expected-result.json → result_id  (timestamp excluded from the id)
result_id + three file digests → package_id
```

Same inputs → same identifiers.

## Run

From a clone:

```bash
npm run verify:external:v1
```

Report fields: suite spec, suite version, fixture set, `qpf_commit`, run timestamp, per-test verdicts, overall.

Example claim an external person can make:

> I ran QPF External Verification Suite v1 against commit X. T2-B passed. I independently re-derived `qpfv0:…` and `qpfpkg0:…` from the supplied inputs.
