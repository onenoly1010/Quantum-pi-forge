# Codeberg Forgejo Runner Registration Status

## Status

Codeberg Forgejo Actions repository unit was enabled and the proof workflow branch was pushed to Codeberg.

Hosted Actions visibility remained unavailable or non-executing from the public repository surface, so a self-hosted Forgejo runner was attempted.

## Tested Runner Scopes

Two registration-token scopes were tested:

1. Repository-scope runner token
2. User-scope runner token

Both tokens were valid-looking 40-character values with no whitespace.

## Observed Result

The Forgejo runner successfully contacted the Codeberg instance:

```text
Successfully pinged the Forgejo instance server
```

Registration then failed with:

```text
invalid_argument: runner registration token not found
Error: Failed to register runner: invalid_argument: runner registration token not found
```

## Interpretation

This failure occurs after network connectivity to Codeberg succeeds.

The blocker is Codeberg-side runner registration token acceptance, not Docker, shell quoting, repo checkout state, workflow file placement, Codeberg remote configuration, or local build failure.

## Operational Decision

No further blind runner retries should be performed.

The current valid proof path remains local deterministic workflow execution, Codeberg repository mirror, Codeberg PR branch evidence, GitHub PR #174 public mirror, and preserved runner-registration rejection receipt.

## Boundary

This document does not claim Codeberg Actions execution success.

It records the exact attempted migration boundary and the observed external registration rejection.

---

## Hosted Actions Visibility Addendum

After the self-hosted runner registration rejection was recorded, the Codeberg Actions tab became visible for the repository:

```text
https://codeberg.org/onenoly1010/Quantum-pi-forge/actions
```

The Forgejo workflow was discovered from:

```text
.forgejo/workflows/local-proof.yml
```

Observed hosted runs included timed executions around 55-58 seconds, indicating that Codeberg discovered the workflow and began attempting hosted execution.

Later short runs around 0 seconds were observed after the runner-registration-boundary receipt commit.

## Updated Interpretation

The previous self-hosted runner receipt remains valid: self-hosted runner registration failed after a successful Codeberg instance ping with:

```text
invalid_argument: runner registration token not found
```

However, the hosted Codeberg Actions surface is no longer absent.

The updated boundary is:

- Codeberg Actions is visible.
- The Forgejo workflow is discovered.
- Hosted execution has partially triggered.
- Local proof and build remain the reliable verification baseline.
- Self-hosted runner registration remains externally blocked.
- No claim is made that Codeberg hosted Actions is fully stable or authoritative.

## Operational Position

The proof lane is review-ready as a transparent migration receipt.
