# 10 — Verifier Profile

## Status

Normative draft (QPF Verification Protocol v1)

## Purpose

A **Verifier Profile** declares the concrete algorithms, encodings, levels, and optional features a verifier implementation supports.

Profiles enable independent implementations to interoperate without guessing.

## Profile document (logical)

| Field | Description |
| --- | --- |
| `schema` | `qpf.verifier_profile.v1` |
| `profile_id` | e.g. `qpf-verifier-core-v1` |
| `hash_algorithms` | e.g. `["blake3"]` or transitional `["blake3","sha256"]` |
| `signature_algorithms` | e.g. `["ed25519"]` |
| `canonical_encoding` | e.g. `jcs-rfc8785` |
| `max_level` | integer |
| `features` | e.g. `["offline","reproduction"]` |
| `implementation` | name/version (informational) |

## MUST / MUST NOT

- MUST declare algorithms actually used.  
- MUST reject inputs requiring unsupported algorithms with `unavailable` (not silent wrong algorithm).  
- MUST NOT claim algorithms not implemented.

## Default profile target (implementation)

```text
profile_id: qpf-verifier-core-v1
hash: blake3 (sha256 transitional optional)
sign: ed25519
canonical: jcs-rfc8785
```

## Mapping to existing QPF

No unified profile today; each `verify-*` script is an ad hoc profile.
