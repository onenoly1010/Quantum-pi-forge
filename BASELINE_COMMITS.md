# Baseline Commits Reference

This document clarifies the three commit references that appear across the Quantum Pi Forge review documentation.

## Current Review Target

**`da1c8a3`** (2026-06-02)

This is the canonical sealed baseline for the public review entry point. All external reviewers should inspect this commit unless explicitly directed otherwise by the maintainer.

- **Status:** Sealed for external review
- **What's locked:** Runtime configuration, autonomous execution paths, branch protections, and wallet behavior
- **Review scope:** Architecture, governance discipline, security boundaries, and proof linkage

## Historical References

### `d800a30` (Previous Documentation Baseline)

- **Used in:** GRANT-REVIEW-PACKET.md § "Canonical Repository State"
- **Status:** Deprecated — superseded by `da1c8a3`
- **Purpose:** Earlier documentation freeze point; kept as historical record
- **Action for reviewers:** Disregard this commit; use `da1c8a3` instead

### `62c0a22` (Prior Local Verification Baseline)

- **Used in:** VERIFICATION.md § "Last Verified State Commit"
- **Status:** Historical — represents the last functional local verification run
- **Purpose:** Reference point for understanding prior verification state
- **Action for reviewers:** This is for context only; review against `da1c8a3`

## Why Three Commits?

1. **Local verification** (62c0a22) was run before documentation hardening
2. **Grant packet documentation** (d800a30) captured the review scope at that time
3. **Current sealed baseline** (da1c8a3) incorporates all alignment and is the review target

The three commits represent sequential documentation and verification checkpoints. They are **not conflicting states** — they are historical progression markers.

## Verification

To verify the current review target is correctly referenced:

```bash
# Fetch the commit
git fetch origin da1c8a3

# View the commit
git show da1c8a3 --no-patch

# Verify branch protection and runtime state as of this commit
git log da1c8a3 -n 1 --format="%H %s"
```

## How to Use This Document

- **External reviewers:** Always reference `da1c8a3` in your review
- **Maintainers:** Use this document to resolve any ambiguity in older documentation
- **Future updates:** If the sealed baseline changes, add a new entry with date and reason

---

*Last updated: 2026-06-02 | Review target: da1c8a3*
