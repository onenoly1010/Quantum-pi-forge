# GitHub Actions Billing Limitation

Date: 2026-05-31
Status: Historical platform constraint, documented for reviewer context.

## Summary

GitHub-hosted Actions runners were unavailable due to an account-level billing/payment limitation. This was not, by itself, evidence of a repository code failure.

Because hosted CI availability can be blocked by platform billing state, GitHub-hosted checks must not be treated as the sole source of repository truth.

## Current Verification Authority

Quantum Pi Forge treats GitHub Actions as a convenience layer.

The current canonical local verification command is:

```bash
npm run verify:evidence
```

That command verifies the current evidence bundle:

- evidence index
- evidence receipt
- claim map
- claim-map drift guard
- evidence snapshot

## Impact

Hosted GitHub PR checks may remain pending, skipped, unavailable, or blocked for reasons unrelated to repository correctness.

That condition does not automatically imply:

- broken application code
- failed local verification
- invalid evidence receipts
- invalid claim-map state
- invalid snapshot state

## Reviewer Guidance

When hosted checks are unavailable, reviewers should inspect the local verification evidence and the latest reported result from:

```bash
npm run verify:evidence
```

The repository should continue to prefer small PRs, current-main extraction branches, and explicit evidence receipts over broad or stale branches.

## Authority Boundary

This document is informational only.

It does not authorize:

- bypassing protected branch rules
- branch protection mutation
- wallet signing
- deployment
- governance execution
- token minting
- staking
- fund movement
- autonomous posting
- runtime activation
- chain mutation

## Conclusion

The GitHub Actions limitation is a platform constraint, not a software defect. Quantum Pi Forge remains reviewable through local deterministic verification and committed evidence artifacts.
