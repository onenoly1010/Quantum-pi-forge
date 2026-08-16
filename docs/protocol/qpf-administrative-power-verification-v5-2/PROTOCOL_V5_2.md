# QPF Administrative Power Verification Protocol v5.2

## Status

**Normative specification.** This package records methodology only. It does not manufacture a real audit and does not adjudicate any real government artifact in this session.

## Canonical principle

> The ledger records what the evidence establishes, not what the investigator expects to find.

## Immutable methodological requirements

### 1. Evidence Ledger

The Evidence Ledger is append-only and records:

- raw artifacts
- provenance
- timestamps
- source identifiers
- hashes where available
- exact source text where legally permissible

The Evidence Ledger records **no adjudicative conclusions**.

### 2. Adjudication Ledger

The Adjudication Ledger:

- references Evidence Ledger entries
- records primary-source verification
- reconstructs `authority → delegation → procedure → execution → consequence`
- records the 9-point Layer-2 analysis
- produces only:
  - `PASS`
  - `NULL`
  - `INDETERMINATE`
  - `BREAK`

### 3. Correction Ledger

The Correction Ledger is append-only and:

- never overwrites historical findings
- records corrections
- records supersession
- records provenance amendments
- records methodological corrections
- preserves the original state

### 4. Layer 1

Layer 1 addresses:

- statutory/constitutional architecture
- legislative source
- delegated authority
- regulations
- administrative framework

Primary-text verification is required.

### 5. Layer 2

Layer 2 is limited to individualized, concrete administrative artifacts, including:

- actual notice
- decision
- refusal
- enforcement record
- transaction
- portal action
- seizure record

Layer 2 does **not** support broad theoretical conclusions.

### 6. Verification Gap

The protocol explicitly distinguishes:

- **Recorded Claim**
- **Independently Verified Claim**

Generated summaries, AI outputs, secondary descriptions, or prior ledger statements must never automatically become verified legal facts.

### 7. Target Acquisition Constraint

Real Layer-2 targets must arise from an actual encountered or independently obtained artifact.

Do **not** manufacture an artifact merely to produce a desired result.

### 8. `INDETERMINATE` default

Missing evidence must remain missing.

The system must never infer the government's missing evidence merely to complete the chain.

### 9. Constitutional deferral

Do not begin broad constitutional conclusions before reconstructing the actual administrative act and its governing authority.

### 10. Constrained `BREAK`

A `BREAK` is limited to the preserved artifact and the demonstrated contradiction.

A `BREAK` does **not** automatically become a claim of:

- systemic illegality
- institutional illegitimacy
- unconstitutional government

## Classification semantics

| Classification | Meaning |
| --- | --- |
| `PASS` | The preserved artifact and governing authority chain are independently verified through `authority → delegation → procedure → execution → consequence` without a demonstrated contradiction in scope. |
| `NULL` | No qualifying individualized administrative artifact is established for Layer-2 adjudication, or the preserved record establishes no adjudicable administrative act. |
| `INDETERMINATE` | The record is incomplete, unresolved, or missing required evidence. Missing evidence remains missing and is not inferred. |
| `BREAK` | A preserved artifact-level contradiction is independently demonstrated between the governing authority/procedure and the preserved record. |

`Layer-1 verified PASS` is **not** an overall final `PASS`.

## Required 9-point Layer-2 analysis

Each Layer-2 adjudication record must preserve these nine fields, using explicit placeholders where the evidence is unavailable:

1. Date
2. Actor
3. Action
4. Delegated Authority
5. Required Procedure
6. Preserved Record
7. Contradiction
8. Consequence
9. Scope

## Required `BREAK` format

```text
BREAK — Artifact-Level Finding
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

The `Scope` field must expressly prevent an artifact-level finding from being inflated into a systemic conclusion unless separate evidence independently establishes that proposition.

## Simulation boundary

`AUDIT-008` is a simulation/dry run only.

**SIMULATION — NOT EVIDENCE**

It must never enter the real Evidence Ledger as an actual artifact.
