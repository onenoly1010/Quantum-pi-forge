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


## Surfaced Drift: build_time

During local sealing, the determinism verifier surfaced drift in generated static build metadata.

The affected class is wall-clock build metadata such as build_time, buildTime, built_at, or generated_at inside text artifacts under out/ and public/ (including public/version.json written by the static build).

This field is now declared as a volatile review-boundary field and normalized to the current commit timestamp for manifest hashing.

This does not approve deployment, grant cutover authority, or hide executable drift. It only prevents local clock time from corrupting cross-platform reproducibility review.

If any reviewer finds drift outside the declared volatile normalization rule, that is a blocking review finding.


## Surfaced Drift: version.json commit metadata

The full local audit surfaced a second deterministic drift class in generated version.json metadata.

The affected class is commit metadata fields such as commit, commit_sha, commitSha, git_sha, or gitSha inside version.json files under out/ or public/.

This field is now declared as a volatile review-boundary field and normalized to the currently checked-out commit SHA for manifest hashing.

This does not approve deployment, grant cutover authority, or hide executable drift. It only prevents generated version metadata from corrupting cross-platform reproducibility review when it is scoped to version.json.

If any reviewer finds commit drift outside the declared version.json normalization rule, that is a blocking review finding.
