# QPF Administrative Power Verification Protocol v5.2 — Package Index

## Status

**Specification packaging only — no implementation, no live audit, no adjudication of any real government artifact is performed by this package.**

## Canonical principle

> The ledger records what the evidence establishes, not what the investigator expects to find.

## Scope boundary

- This package is a version-controlled, human-reviewable specification.
- The design phase is closed.
- This package does **not** redesign the methodology.
- This package does **not** create, infer, or complete missing evidence.
- This package does **not** convert Layer-1 verification into an overall final `PASS`.
- This package does **not** treat any simulation or dry run as real evidence.

## Package files

| Document | Role |
| --- | --- |
| [PROTOCOL_V5_2.md](./PROTOCOL_V5_2.md) | Normative protocol requirements |
| [EVIDENCE_LEDGER.md](./EVIDENCE_LEDGER.md) | Append-only raw-artifact ledger specification |
| [ADJUDICATION_LEDGER.md](./ADJUDICATION_LEDGER.md) | Append-only adjudication baseline and classification ledger |
| [CORRECTION_LEDGER.md](./CORRECTION_LEDGER.md) | Append-only correction and supersession ledger |
| [LAYER2_EVIDENCE_PACKAGE_V1.md](./LAYER2_EVIDENCE_PACKAGE_V1.md) | Layer-2 artifact packaging boundary |

## Current packaged baseline

| Metric | Baseline |
| --- | --- |
| Targets selected | 7 |
| `NULL` | 1 |
| Layer-1 verified `PASS` | 6 |
| Overall final `PASS` | 0 |
| Demonstrated `BREAK` | 0 |
| Layer-2 boundary findings | unresolved |

Historical baseline classifications preserved in this package:

- `AUDIT-001` — `NULL`
- `AUDIT-002` — `INDETERMINATE`
- `AUDIT-003` — `INDETERMINATE`
- `AUDIT-004` — `INDETERMINATE`
- `AUDIT-005` — `INDETERMINATE`
- `AUDIT-006` — `INDETERMINATE`
- `AUDIT-007` — `INDETERMINATE`

## Simulation boundary

`AUDIT-008` is explicitly excluded from real evidence handling.

**SIMULATION — NOT EVIDENCE**

If documented at all, it must remain outside the real [Evidence Ledger](./EVIDENCE_LEDGER.md) and outside any presentation that could imply a real government event.
