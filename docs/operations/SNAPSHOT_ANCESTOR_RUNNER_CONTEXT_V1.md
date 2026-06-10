# Snapshot Ancestor Runner Context v1

## Status

Sealed runner-context repair.

## Problem

The Codeberg / Forgejo hosted runner reached snapshot verification but failed with:

```text
canonicalCommit is not an ancestor of HEAD
```

## Root Cause

The snapshot verifier is intentionally strict:

```text
git merge-base --is-ancestor canonicalCommit HEAD
```

However, the Forgejo workflow checkout did not request full git history.

A shallow PR or detached-head checkout can make an old canonical commit unavailable locally, causing the ancestry check to fail even when the repository lineage is valid.

## Repair

The Forgejo proof workflow now uses:

```yaml
with:
  fetch-depth: 0
```

This gives the runner full history so the strict snapshot verifier can evaluate ancestry honestly.

## Boundary

The verifier is not weakened.

The workflow is corrected so the verifier has enough git history to make a valid decision.

## Expected Outcome

The next Codeberg run should either:

- pass the snapshot ancestry check if the canonical commit is genuinely an ancestor, or
- fail truthfully if the ancestry relation is genuinely invalid.

No external pass is claimed by this receipt.
