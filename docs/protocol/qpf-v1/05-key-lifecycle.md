# 05 — Key Lifecycle

## Status

Normative draft (QPF Verification Protocol v1)

## Purpose

Define how signing identities are created, rotated, revoked, and referenced.

## Key record (logical)

| Field | Description |
| --- | --- |
| `schema` | `qpf.key.v1` |
| `key_id` | Stable identifier |
| `algorithm` | `Ed25519` for v1 |
| `public_key` | Encoding declared (e.g. multibase / hex) |
| `status` | `active` \| `rotated` \| `revoked` |
| `valid_from` / `valid_to` | Optional validity window |
| `supersedes` / `superseded_by` | Rotation links |

## MUST / MUST NOT

- MUST support revoke and rotate without reusing revoked keys.  
- MUST bind signatures to `key_id` present in trust store.  
- MUST NOT use model API keys as signing keys.  
- MUST NOT store private keys in Git or evidence bundles.  
- Private keys live in operator vault / HSM / OS keystore (see also SCCB pass patterns for *operational* secrets — separate from protocol trust keys).

## Lifecycle events

1. Issue  
2. Activate  
3. Rotate (new key supersedes)  
4. Revoke  
5. Expire  

## Fail modes

| Condition | Semantic |
| --- | --- |
| Signature from revoked key | `fail` |
| Signature from unknown key | `fail` or `unavailable` |
| Expired key outside grace | `fail` per policy |
