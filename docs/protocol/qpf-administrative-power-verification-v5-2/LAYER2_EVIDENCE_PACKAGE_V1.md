# Layer-2 Evidence Package v1

## Purpose

This document defines the packaging boundary for real Layer-2 evidence used by the QPF Administrative Power Verification Protocol v5.2.

## Layer-2 boundary

Layer 2 accepts only individualized, concrete administrative artifacts such as:

- actual notice
- decision
- refusal
- enforcement record
- transaction
- portal action
- seizure record

Broad theoretical claims are outside this package boundary.

## Required package contents

Each real Layer-2 package should preserve, where available:

- preserved artifact copy or exact repository pointer
- provenance
- acquisition notes
- timestamp
- source identifier
- hash
- exact source text where legally permissible
- notes distinguishing recorded claim from independently verified claim

## Prohibited substitutions

The package must not treat the following as automatically verified legal fact:

- generated summaries
- AI outputs
- secondary descriptions
- prior ledger statements

Missing evidence remains missing.

## Target acquisition constraint

Real Layer-2 targets must arise from an actual encountered or independently obtained artifact.

Do **not** manufacture an artifact merely to produce a desired result.

## Package template

```text
Package ID:
Audit ID:
Artifact ID:
Artifact Type:
Preserved Artifact Location:
Provenance:
Acquisition Notes:
Timestamp:
Source Identifier:
Hash:
Exact Source Text:
Recorded Claim:
Independently Verified Claim:
```

## Simulation exclusion

`AUDIT-008` is not a real Layer-2 package.

**SIMULATION — NOT EVIDENCE**

It must remain outside the real [Evidence Ledger](./EVIDENCE_LEDGER.md) and must not be represented as a real government event.
