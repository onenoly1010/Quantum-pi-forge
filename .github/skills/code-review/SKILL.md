# SKILL.md — Blind Review Protocol (QPF Constellation)

## Purpose

Establish a deterministic, bias-free, sealed code-review protocol for Quantum Pi Forge. This skill defines how Copilot Agents perform blind, verification-first review across all PRs entering independent-verification phases.

## Constellation Principles

- **Harmonic Readiness** — Every review begins with deliberate orchestration and sealed artifacts.
- **Shared Collaboration** — Reviewers act as distributed contributors to one canon.
- **Mutual Trust** — Trust given and trust received are encoded through transparent receipts.
- **Living Sovereignty** — Each reviewer receives their own truth from the code surface.

## Scope

This skill governs:

- PRs entering Phase 8.x+ independent verification
- All Copilot Agent review lanes
- Any review requiring sealed receipts, deterministic reasoning, or identity-blind commentary

## Blind Review Requirements

- Reviewer identity must remain fully hidden from PR authors.
- All outputs must be deterministic, receipt-backed, and free of stylistic bias.
- Copilot Agent must operate strictly in verification mode, not authoring mode.
- No truncation of tool outputs or reasoning lanes.
- Guard-stack enforcement to prevent context drift.
- All findings must be encoded into sealed artifacts.

## Review Workflow

### 1. Load PR Context

- Diff
- Metadata
- Commit lineage
- Relevant invariants

### 2. First-Pass Receipt (Structural)

Produce a sealed artifact summarizing:

- Structural correctness
- File-level integrity
- Dependency impacts
- Immediate red flags

### 3. Deterministic Static Analysis

Run verification-mode linting and invariant checks:

- Logic consistency
- Safety surfaces
- Error-path determinism
- Side-effect mapping

### 4. Second-Pass Receipt (Logical)

Produce a sealed artifact detailing:

- Logic correctness
- Invariant preservation
- Risk surfaces
- Required changes

### 5. Blind Review Canon Entry

Emit the final sealed review artifact containing:

- Findings
- Required changes
- Verification notes
- Deterministic reasoning lane
- Canon alignment

## Artifacts Produced

| Artifact | Description |
|---|---|
| `receipt-first-pass.md` | Structural correctness and integrity summary |
| `receipt-second-pass.md` | Logic correctness and risk surface detail |
| `blind-review-canon-entry.md` | Final sealed review with full reasoning lane |

## Success Criteria

- Zero identity leakage
- Deterministic outputs
- Canon-aligned reasoning
- No truncation
- No context drift

## Failure Modes

- Reviewer bias
- Non-deterministic commentary
- Unsealed artifacts
- Context spirals
- Tool-output truncation

## Versioning

This skill follows QPF Constellation Canon v1.x and updates alongside RootAnchor manifests.
