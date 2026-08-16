# Adjudication Ledger

## Status

Append-only adjudication ledger for the QPF Administrative Power Verification Protocol v5.2.

## Boundary

This ledger references the [Evidence Ledger](./EVIDENCE_LEDGER.md), records primary-source verification status, and preserves classifications without overwriting prior findings.

Allowed outputs only:

- `PASS`
- `NULL`
- `INDETERMINATE`
- `BREAK`

## Required per-entry record

Each adjudication entry must reference relevant Evidence Ledger material and preserve the required 9-point Layer-2 analysis:

1. Date
2. Actor
3. Action
4. Delegated Authority
5. Required Procedure
6. Preserved Record
7. Contradiction
8. Consequence
9. Scope

Use explicit placeholders where the evidence is unavailable.

## Historical baseline preserved from current handoff

| Audit ID | Evidence Ledger Reference | Classification | Notes |
| --- | --- | --- | --- |
| `AUDIT-001` | `BOOTSTRAP-001` | `NULL` | Historical result preserved from current handoff. Individual primary-source artifact details were not supplied in this package. |
| `AUDIT-002` | `BOOTSTRAP-001` | `INDETERMINATE` | Historical result preserved from current handoff. Individual primary-source artifact details were not supplied in this package. |
| `AUDIT-003` | `BOOTSTRAP-001` | `INDETERMINATE` | Historical result preserved from current handoff. Individual primary-source artifact details were not supplied in this package. |
| `AUDIT-004` | `BOOTSTRAP-001` | `INDETERMINATE` | Historical result preserved from current handoff. Individual primary-source artifact details were not supplied in this package. |
| `AUDIT-005` | `BOOTSTRAP-001` | `INDETERMINATE` | Historical result preserved from current handoff. Individual primary-source artifact details were not supplied in this package. |
| `AUDIT-006` | `BOOTSTRAP-001` | `INDETERMINATE` | Historical result preserved from current handoff. Individual primary-source artifact details were not supplied in this package. |
| `AUDIT-007` | `BOOTSTRAP-001` | `INDETERMINATE` | Historical result preserved from current handoff. Individual primary-source artifact details were not supplied in this package. |

## Current methodological state

| Metric | Value |
| --- | --- |
| Targets selected | 7 |
| `NULL` | 1 |
| Layer-1 verified `PASS` | 6 |
| Overall final `PASS` | 0 |
| Demonstrated `BREAK` | 0 |
| Layer-2 boundary findings | unresolved |

Do **not** convert Layer-1 verified `PASS` into an overall final `PASS`.

The aggregate `Layer-1 verified PASS` count is a Layer-1-only measurement. It may coexist with overall final `INDETERMINATE` classifications where Layer-2 evidence remains unresolved or incomplete.

## Adjudication template

```text
Adjudication Entry ID:
Audit ID:
Evidence Ledger Reference:
Recorded Claim:
Independently Verified Claim:
Classification:

Date:
Actor:
Action:
Delegated Authority:
Required Procedure:
Preserved Record:
Contradiction:
Consequence:
Scope:
```
