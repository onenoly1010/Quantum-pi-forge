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
