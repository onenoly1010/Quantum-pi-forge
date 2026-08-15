# 09 — Verification Semantics

## Status

Normative draft (QPF Verification Protocol v1)

## Purpose

Define deterministic meaning of verification outcomes and result codes so independent implementations agree.

## Top-level status

| Status | When |
| --- | --- |
| `pass` | All required checks for the requested level succeed |
| `fail` | At least one **known violation** of required checks |
| `partial` | Incomplete evidence or incomplete check set; no known violation of checked items **or** policy allows partial |
| `unavailable` | Required capability/material not available to the verifier |

## Dimensions (example v1)

| Dimension | Codes (examples) |
| --- | --- |
| `cryptographic` | `pass`, `fail`, `unavailable` |
| `trust` | `pass`, `fail`, `unavailable` |
| `policy` | `pass`, `fail`, `partial` |
| `reproduction` | `pass`, `fail`, `unavailable`, `not_requested` |

## Normative code catalog (initial)

| Code | Meaning | Typical status |
| --- | --- | --- |
| `ARTIFACT_HASH_MISMATCH` | Subject digest ≠ computed | `fail` |
| `RECEIPT_HASH_MISMATCH` | Receipt body digest invalid | `fail` |
| `SIGNATURE_INVALID` | Ed25519 verify failed | `fail` |
| `KEY_REVOKED` | Signing key revoked | `fail` |
| `KEY_UNKNOWN` | Key not in trust store | `fail` / `unavailable` |
| `POLICY_HASH_MISMATCH` | Policy bytes ≠ claimed digest | `fail` |
| `POLICY_DENIED` | Policy rules not satisfied | `fail` |
| `EVIDENCE_MISSING` | Required object absent | `partial` / `unavailable` |
| `EVIDENCE_DIGEST_MISMATCH` | Bundle object mismatch | `fail` |
| `REPRODUCTION_FAILED` | Declared reproduction failed | `fail` |
| `REPRODUCTION_UNAVAILABLE` | Cannot run reproduction | `unavailable` |

## MUST / MUST NOT

- MUST distinguish fail vs unavailable.  
- MUST NOT map “missing evidence” to `SIGNATURE_INVALID`.  
- MUST be stable across independent implementations for the same vectors.

## Levels

Profiles MAY define levels (e.g. 0=digest only, 1=+receipt, 2=+attestation, 3=+reproduction).  
`level_achieved` MUST be reported when levels are used.
