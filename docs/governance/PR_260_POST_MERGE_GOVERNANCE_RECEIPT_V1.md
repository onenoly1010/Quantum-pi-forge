# PR 260 Post-Merge Governance Receipt v1

## Status

PR #260 has been squash-merged into main.

Main commit: 46c4292cc13faa76c2d35915cca236f5ff371bf3  
Short commit: 46c4292

## Anchored Lane

PR #260 sealed the cross-platform determinism receipt v1.

The lane surfaced and bounded two generated metadata drift classes:

- build_time / buildTime / built_at / generated_at inside out/** and public/** text artifacts
- commit / commit_sha / commitSha / git_sha / gitSha inside out/**/version.json and public/**/version.json only

All other drift remains blocking.

## Posture

This receipt is non-executing.

approval_granted: false  
cutover_executed: false  
deployment_executed: false  
broadcast_executed: false  
state_changing_transaction_executed: false

## Verification

cross-platform-determinism:v1:check: PASS  
audit:full-local: PASS

## Anchors

cross-platform determinism receipt sha256: 1f8c969b5adebd0f2c97bf93c4a3fce30f5f21d62ca69305d8728c3cf9b3602c  
cross-platform determinism manifest file sha256: c583564cb816b571b20341ceeda013a60527a1ef0b53ec395b8603d6a45c8b97
