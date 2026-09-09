# Evidence Ledger

## Related

- [Verification & Auditability Evidence Scorecard V1](../../governance/VERIFICATION_AUDITABILITY_SCORECARD_V1.md) — minimum defensible bar for any maturity or auditability assessment of QPF.

## Status

Append-only raw-artifact ledger for the QPF Administrative Power Verification Protocol v5.2.

## Boundary

This ledger records raw artifacts and provenance only. It does **not** record adjudicative conclusions.

Required contents per entry:

- ledger entry identifier
- preserved artifact identifier
- provenance
- timestamp
- source identifier
- hash where available
- exact source text where legally permissible
- custody or acquisition notes

## Entry template

```text
Evidence Entry ID:
Artifact ID:
Artifact Type:
Provenance:
Timestamp:
Source Identifier:
Hash:
Exact Source Text:
Custody / Acquisition Notes:
```

## Initialization note

This specification package was created from the current repository handoff only.

Historical raw artifacts for `AUDIT-001` through `AUDIT-007` were **not supplied** in the current handoff, so this package does not invent substitute artifacts, timestamps, hashes, or source text for them.

## Bootstrap record

```text
Evidence Entry ID: BOOTSTRAP-001
Artifact ID: HANDOFF-BASELINE-ONLY
Artifact Type: specification handoff baseline
Provenance: current issue statement / repository handoff
Timestamp: [not supplied in current handoff]
Source Identifier: [not supplied in current handoff]
Hash: [not supplied in current handoff]
Exact Source Text: [see current issue statement and this package baseline summary]
Custody / Acquisition Notes: This bootstrap record initializes the package without claiming any real Layer-2 government artifact.
```

## Non-entry exclusion

`AUDIT-008` remains excluded from this ledger.

**SIMULATION — NOT EVIDENCE**
