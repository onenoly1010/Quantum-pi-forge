# Reviewer Attestation Intake v1

## Status

Sealed intake boundary for exit criterion #2 (`external_review_attestation_receipt`).

This lane defines how outside reviewers submit independent verification results during the active pre-cutover review window. It does not collect attestations, close exit criterion #2, grant cutover approval, authorize deployment, broadcast transactions, or mutate chain state.

Phase: PRE_CUTOVER_REVIEW_LOCK

## Purpose

Exit criterion #1 proved cross-platform determinism locally. Exit criterion #2 requires structured, comparable, non-authoritative external review submissions before any later explicit approval receipt may exist.

This intake boundary makes reviewer submissions:

- structured — every submission uses the same required fields
- comparable — manifest hash, file count, and verifier output can be diffed across environments
- non-authoritative — pass/fail/concern findings do not flip approval or execution flags

## Required Submission Fields

Every external reviewer attestation must include:

| Field | Description |
| --- | --- |
| OS | Operating system tested (e.g. `linux`, `darwin`, `win32`) |
| Architecture | CPU architecture (e.g. `x64`, `arm64`) |
| Node version | `node --version` output |
| npm version | `npm --version` output |
| Commit tested | Full or short git commit SHA checked out |
| Commands run | Exact command sequence executed |
| Verifier output | Full stdout/stderr from verifier commands |
| Manifest SHA256 | `MANIFEST_SHA256` line from determinism verifier |
| File count | `FILE_COUNT` line from determinism verifier |
| Finding status | One of: `pass`, `fail`, `concern` |
| Notes | Optional reviewer context; required when status is `fail` or `concern` |

## Finding Status Semantics

- `pass` — verifier commands reproduced without blocking drift
- `fail` — blocking drift, missing artifact, verifier error, or unreconciled environment difference
- `concern` — non-blocking observation that should be tracked before cutover

A `pass` finding does not grant approval authority. A `fail` or `concern` finding does not automatically block future lanes, but must be recorded and reconciled through governance receipts.

## Recommended Reviewer Command Sequence

Run from a clean clone on the commit under test.

~~~bash
git checkout <commit>
npm ci
npm run build
node scripts/generate-determinism-manifest.cjs
npm run governance:cross-platform-determinism:v1:check
npm run governance:pre-cutover-exit-criterion-checkpoint-v1:check
~~~

Copy the verifier output and manifest hash into the submission template.

## Submission Template

Use:

`docs/governance/templates/REVIEWER_ATTESTATION_V1.template.txt`

Submissions must keep all authority-denial fields false. Any submission implying approval or cutover authority is out of boundary and must be rejected at intake.

## Authority Denial

Every submission and this intake boundary explicitly deny:

- approval authority
- cutover authority
- deployment authority
- broadcast authority
- state-changing transaction authority

approval_granted: false  
cutover_executed: false  
deployment_executed: false  
broadcast_executed: false  
state_changing_transaction_executed: false

## Relationship to Exit Criteria

| Criterion | Status after this lane |
| --- | --- |
| cross_platform_determinism_receipt | closed (criterion #1) |
| external_review_attestation_receipt | open — intake boundary sealed, attestations not yet collected |
| contract_audit_prep_receipt | open |
| final_operator_approval_receipt | open |
| no_unresolved_public_status_or_audit_regressions | open |

Closing exit criterion #2 requires a future receipt that seals collected external attestations. This lane does not create that receipt.

## Related Gate Policy

For the current PR #737 verification freeze window and binary pass/fail trigger policy, see:

- [PR_737_CONFORMANCE_AND_REPRODUCIBILITY_GATES_V1.md](./PR_737_CONFORMANCE_AND_REPRODUCIBILITY_GATES_V1.md)

## Conclusion

The reviewer attestation intake boundary is sealed. Outside reviewers may now submit comparable, non-authoritative results without triggering cutover or approval state changes.
