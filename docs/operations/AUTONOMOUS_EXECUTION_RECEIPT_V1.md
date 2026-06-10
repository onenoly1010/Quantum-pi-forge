# Autonomous Execution Receipt v1

## Status

Sealed execution-continuity receipt.

## Purpose

This receipt documents that Quantum Pi Forge verification is not dependent on GitHub-hosted CI.

GitHub may host the public repository and review surface, but it must not be treated as the sole execution authority for proof, replay, or verification.

## Trigger

This lane follows the post-merge governance receipt for PR #175.

That receipt established that the PR #174 administrative override was bounded and governance controls were restored.

This receipt advances the next priority:

```text
autonomous_execution_receipt_v1
```

## Execution Boundary

GitHub-hosted CI is useful infrastructure.

GitHub-hosted CI is not the protocol.

GitHub-hosted CI failure, billing lockout, log loss, hosted-runner outage, or permission denial must not prevent local verification.

## Core Invariants

```text
github_ci_blocked != execution_blocked
external_runner_pass == autonomous_execution_evidence
local_replay_pass == deterministic_fallback_evidence
```

## Required Evidence Classes

This receipt recognizes three execution classes.

### 1. Local Execution

Local execution proves that the repository can verify itself from an operator-controlled machine.

Required examples:

```text
npm ci
npm run build
npm run governance:post-merge:check
npm run execution:autonomous:check
```

### 2. External Runner Execution

External runner execution proves that verification can move outside GitHub-hosted CI.

Acceptable targets include:

```text
Forgejo Actions
Codeberg Actions
self-hosted runner
local isolated runner
```

### 3. Deterministic Fallback Execution

Deterministic fallback execution proves that if hosted CI is unavailable, the repo still has a reproducible verification path.

Required property:

```text
local_replay_pass == deterministic_fallback_evidence
```

## Non-Claims

This receipt does not claim that every external runner is already production hardened.

This receipt does not claim that GitHub is removed.

This receipt does not claim that all future automation is fully autonomous.

This receipt claims only that execution authority is not centralized in GitHub-hosted CI.

## Review Standard

A reviewer should not accept autonomous execution because the operator says the system is sovereign.

A reviewer should accept autonomous execution only if the repository records:

1. what execution path was used,
2. whether GitHub-hosted CI was required,
3. whether local verification passed,
4. whether fallback execution exists,
5. whether the proof is reproducible by a reviewer.

## Current Repository Position

After PR #174 and PR #175, Quantum Pi Forge has:

```text
governance_exception_documented == true
restored_governance_boundary == true
autonomous_execution_priority_declared == true
```

This lane adds:

```text
github_ci_blocked != execution_blocked
```

## Next Target

Recommended next lane:

```text
ops/external-runner-proof-v1
```

That lane should attach live Forgejo, Codeberg, or self-hosted runner logs as execution receipts.

## Final Statement

Quantum Pi Forge must be reviewable on GitHub, but not dependent on GitHub for truth.

The proof path must survive platform failure.
