# 02 — Attestation

## Status

Normative draft (QPF Verification Protocol v1)

## Purpose

An **Attestation** is a signed claim expanding **provenance**: who asserts what about which digests, under which key.

Distinct from Receipt:

| Receipt | Attestation |
| --- | --- |
| Execution conditions | Provenance claims |
| May be unsigned under weak policies | Typically signed |
| “This is how it was produced” | “This key asserts these digests / statements” |

## Required properties

| Field | Description |
| --- | --- |
| `schema` | `qpf.attestation.v1` |
| `attestation_id` | Unique id |
| `subject_digests` | Digests of artifacts/receipts claimed over |
| `statements` | Structured claims (e.g. build completed, reviewed, level) |
| `issuer_key_id` | Key identifier in trust store |
| `issued_at` | UTC |
| `signature` | Ed25519 over canonical body |

## MUST / MUST NOT

- MUST identify issuer key.  
- MUST sign only canonical bytes.  
- MUST NOT treat model name as issuer key.  
- MUST NOT self-attest as independent external review without matching external attestation rules (see existing EXTERNAL_ATTESTATION_VERIFIER).

## Mapping to existing QPF

| Existing | Notes |
| --- | --- |
| Reviewer attestation templates / Issue #264 verifier | Human independent review — keep as special attestation class |
| Guardian completion receipts | Governance-adjacent claims |

## Fail modes

| Condition | Semantic |
| --- | --- |
| Bad signature | `fail` |
| Unknown / revoked issuer key | `fail` or `partial` if key material unavailable vs revoked |
| Subject digest not in bundle | `fail` |
