# Reviewer Merge Queue

This document gives reviewers a clean order for reviewing and merging documentation/evidence PRs.

The purpose is to prevent review layers from becoming scattered, overlapping, or dependent on narrative context.

## Review Principle

Merge the review surface before expanding the system surface.

A PR should be evaluated by:

1. scope;
2. evidence path;
3. authority boundary;
4. merge order;
5. whether it changes runtime behavior.

---

## Current Recommended Order

| Order | PR | Lane | Purpose | Runtime Change |
|---:|---|---|---|---|
| 1 | #161 | Public review boundary compression | Separates executable evidence from philosophical, disabled, experimental, and future-facing layers | No |
| 2 | TBD | Architecture / constellation map | Explains repository and system relationships for reviewers | No |
| 3 | TBD | Protocol interface freeze | Defines stable protocol/reviewer interface surfaces | No |
| 4 | TBD | Evidence bundle / verifier hardening | Strengthens reproducible evidence checks | No / verifier-only |
| 5 | TBD | Functional recovery lanes | Restores or improves application behavior after review boundaries are merged | Possible |

---

## Merge Discipline

Documentation and review-boundary PRs should merge before functional expansion PRs when they clarify:

- what is locally verifiable;
- what is disabled;
- what is experimental;
- what requires explicit human authorization;
- what should not be interpreted as current operational fact.

Functional changes should not be used to smuggle new authority.

---

## Authority Boundary

This merge queue does not authorize:

- wallet signing;
- minting;
- staking execution;
- fund movement;
- ownership transfer;
- governance execution;
- autonomous posting;
- deployment;
- live chain mutation.

Each of those requires its own explicit, reviewable authorization path.

---

## Reviewer Note

If a PR is documentation-only, reviewers should still check whether it changes public claims, verification commands, or authority boundaries.

A clean documentation PR can still materially improve project safety by reducing ambiguity.
