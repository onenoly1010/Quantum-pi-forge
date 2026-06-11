# Cross-Platform Determinism Receipt v1

## Status

This receipt closes one pre-cutover exit criterion under the active review lock.

Phase: PRE_CUTOVER_REVIEW_LOCK

This lane is non-executing. It does not grant cutover approval, perform deployment, broadcast a transaction, or mutate chain state.

## Purpose

The purpose of this receipt is to distinguish a local environment anomaly from a protocol-level reproducibility failure.

The manifest generator computes deterministic SHA-256 digests over critical repository artifacts and generated static output where present. The verifier re-checks each file, recomputes the canonical manifest hash, validates posture flags, and enforces the active review-window deadline.

## Reviewer Commands

Run from a clean clone.

~~~bash
git checkout main
npm ci
npm run build
node scripts/generate-determinism-manifest.cjs
npm run governance:cross-platform-determinism:v1:check
~~~

Expected verifier result:

~~~text
PASS cross-platform-determinism-v1
MANIFEST_SHA256 <hash>
FILE_COUNT <count>
~~~

## External Attestation Format

Reviewers may submit:

~~~text
OS:
Architecture:
Node version:
npm version:
Commit:
Command sequence:
Verifier output:
Manifest SHA256:
File count:
Notes:
~~~

## Edge-Case Policy

Differences caused by Node version, OS path handling, build output ordering, generated timestamps, or platform-specific binary artifacts must be treated as review findings.

No difference may be hand-waved as harmless unless the receipt, manifest, and verifier are updated to make the boundary explicit.

## Execution Flags

approval_granted: false  
cutover_executed: false  
deployment_executed: false  
broadcast_executed: false  
state_changing_transaction_executed: false
