# Pre-Cutover Exit Criterion Checkpoint v1

## Status

This receipt is a compact chain checkpoint for PRs #258 through #261 under the active pre-cutover review lock.

It closes exit criterion #1 (`cross_platform_determinism_receipt`) without adding a per-PR #261 post-merge receipt or unbounded receipt recursion.

Phase: PRE_CUTOVER_REVIEW_LOCK

Anchored at main commit: a04b5ff

## Canonical Chain

```text
a04b5ff Seal PR 260 post-merge governance receipt v1 (#261)
46c4292 Seal cross-platform determinism receipt v1 (#260)
79f3649 Seal PR 258 post-merge governance receipt v1 (#259)
f03eeaf Seal pre-cutover review window v1 (#258)
```

## Anchors

- review window active
- cross-platform determinism exit criterion closed
- PR #260 post-merge receipt sealed
- historical-anchor verifier corrected (ancestor check, not HEAD equality)
- all execution flags false

## Exit Criteria Status

| Criterion | Status |
| --- | --- |
| cross_platform_determinism_receipt | closed |
| external_review_attestation_receipt | open |
| contract_audit_prep_receipt | open |
| final_operator_approval_receipt | open |
| no_unresolved_public_status_or_audit_regressions | open |

## Posture

This checkpoint is non-executing.

approval_granted: false  
cutover_executed: false  
deployment_executed: false  
broadcast_executed: false  
state_changing_transaction_executed: false

## Reviewer Commands

Run from a clean clone on main or a descendant branch.

~~~bash
git checkout main
npm ci
npm run governance:pre-cutover-exit-criterion-checkpoint-v1:check
~~~

Expected verifier result:

~~~text
PASS pre-cutover-exit-criterion-checkpoint-v1
~~~

## Historical Anchor Policy

The PR #260 post-merge verifier proves the merged main commit is reachable from current HEAD via `git merge-base --is-ancestor`. This checkpoint preserves that policy and does not require HEAD to equal the anchored commit.