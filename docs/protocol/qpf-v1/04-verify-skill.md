# 04 — Verify Skill

## Status

Normative draft (QPF Verification Protocol v1)

## Purpose

The **Verify Skill** is the machine-facing interface for verification:

```text
verify(request) → verification_result
```

It is intentionally boring and deterministic.

## Request (logical)

| Field | Description |
| --- | --- |
| `schema` | `qpf.verify_request.v1` |
| `evidence_bundle` | Bundle or path/digest |
| `trust_roots` | Root set or profile reference |
| `trust_policy` | Policy document or digest |
| `profile` | Verifier profile id |
| `level_requested` | Optional minimum level |

## Response

See [09-verification-semantics.md](./09-verification-semantics.md) and result schema (future `verify-result.schema.json`).

## MUST / MUST NOT

- MUST be pure with respect to inputs when offline material is complete.  
- MUST return structured codes, not free-form model prose as authority.  
- MUST NOT mutate chain state, deploy, or unlock economics.  
- MUST NOT call models as part of the trust decision path.

## Mapping to existing QPF

| Existing | Notes |
| --- | --- |
| `npm run verify:*` scripts | Many gate-specific verifiers; not unified skill API |
| `verify:independent` | Closest read-only verification entry |
| `check-evidence-receipt` | Single digest check |

## Implementation target

Unify behind `src/verification` module + CLI; migrate gates gradually without breaking existing scripts.
