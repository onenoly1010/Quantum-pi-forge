# 06 — Trust Root

## Status

Normative draft (QPF Verification Protocol v1)

## Purpose

A **Trust Root** is the bootstrap of cryptographic trust for a verifier context. It anchors which keys and policies may be used.

## Trust root record (logical)

| Field | Description |
| --- | --- |
| `schema` | `qpf.trust_root.v1` |
| `root_id` | Identifier |
| `keys` | Set of accepted root or intermediate key ids |
| `created_at` | UTC |
| `notes` | Human description (non-authoritative) |

## MUST / MUST NOT

- MUST be explicit and localizable (file / pinned digest).  
- MUST NOT default to “trust the model” or “trust GitHub UI alone.”  
- SHOULD support multiple roots for multi-party attestation.  
- Governance operators may *choose* which root set applies; the root itself is not the governance decision.

## Bootstrap

Initial v1 development roots MAY be developer-local Ed25519 keys used only for test vectors.

Production roots require separate human governance decision (out of band).

## Fail modes

| Condition | Semantic |
| --- | --- |
| Empty root when policy requires signatures | `fail` or `unavailable` |
| Root digest mismatch vs pinned | `fail` |
