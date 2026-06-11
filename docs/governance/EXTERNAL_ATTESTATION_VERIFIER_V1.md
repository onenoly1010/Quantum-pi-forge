# External Attestation Verifier v1

## Status

Active blocking control for exit criterion #2 (`external_review_attestation_receipt`).

This verifier does not close criterion #2. It only proves whether a genuine independent reviewer attestation exists on GitHub Issue #264 and matches the sealed determinism baseline.

Phase: PRE_CUTOVER_REVIEW_LOCK

## Purpose

Criterion #1 proved local determinism. Criterion #2 intake defined the submission format. This verifier hardens the boundary by rejecting:

- self-authored issue bodies
- owner/member comments (non-independent)
- simulated, conceptual, or placeholder attestations
- missing required fields or authority denials
- mismatched manifest SHA256 or file count
- missing literal PASS verifier output

## GitHub Anchor

- Repository: `onenoly1010/Quantum-pi-forge`
- Issue: #264 (independent reviewer comments only)

## Expected Behavior

Before a valid independent comment exists:

~~~text
FAIL external-attestation-v1: no valid independent reviewer attestation on Issue #264
~~~

After a valid independent comment exists:

~~~text
PASS external-attestation-v1
ANCHORED_COMMENT_ID <id>
~~~

Even on PASS, exit criterion #2 remains open until a separate closure receipt is sealed.

## Reviewer Command

~~~bash
npm run governance:external-attestation:v1:check
~~~

## Posture

non_executing: true

approval_granted: false  
cutover_executed: false  
deployment_executed: false  
broadcast_executed: false  
state_changing_transaction_executed: false