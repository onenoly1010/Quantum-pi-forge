# 08 — Verification Receipt

## Status

Normative draft (QPF Verification Protocol v1)

## Purpose

A **Verification Receipt** is a **persistent, preferably signed** record that a verifier evaluated a subject under a policy and produced a result.

Distinct from:

| Object | Role |
| --- | --- |
| Execution Receipt (01) | How artifact was produced |
| Verification Result (09) | Ephemeral/computed outcome |
| Verification Receipt (08) | Historical verifier decision |

## Required properties

| Field | Description |
| --- | --- |
| `schema` | `qpf.verification_receipt.v1` |
| `verification_receipt_id` | Unique id |
| `subject_bundle_digest` | Evidence bundle digest |
| `policy_digest` | Trust policy digest |
| `profile_id` | Verifier profile |
| `result` | Structured verification result snapshot |
| `verified_at` | UTC |
| `verifier_key_id` | Key that signs this receipt |
| `signature` | Ed25519 over canonical body |

## MUST / MUST NOT

- MUST bind policy and subject digests.  
- MUST NOT rewrite history; corrections issue new receipts.  
- MUST NOT claim production deploy authorization.

## Fail modes when verifying a verification receipt

| Condition | Semantic |
| --- | --- |
| Bad signature | `fail` |
| Verifier key revoked | `fail` |
| Subject/policy digest drift | `fail` |
