# 01 — Receipt

## Status

Normative draft (QPF Verification Protocol v1)

## Purpose

A **Receipt** records the conditions under which an artifact was produced or observed. It is **execution evidence**, not a final trust decision.

## Required properties

| Field | Description |
| --- | --- |
| `schema` | `qpf.receipt.v1` |
| `receipt_id` | Unique id |
| `artifact_digest` | Content digest of the artifact (algorithm + hex/multibase) |
| `inputs` | Digests of input materials (prompt, config, sources) |
| `produced_at` | UTC timestamp |
| `actor` | Human / agent / system identity **class** (not a secret) |
| `envelope` | Deterministic authority constraints (read-only, no signing, etc.) |
| `environment` | Declared environment claims (tool versions **as claimed**, not trusted alone) |
| `policy_binding` | Optional hash of policy document applied during production |
| `signature` | Optional; if present, MUST be Ed25519 over **canonical** receipt body |

## MUST / MUST NOT

- MUST bind `artifact_digest` with explicit algorithm id.  
- MUST include an authority/envelope section when used for agent executions.  
- MUST NOT include secret values, private keys, or tokens.  
- MUST NOT be treated as governance approval.  
- MUST use canonical serialization before hashing or signing.

## Mapping to existing QPF

| Existing | Gap vs protocol |
| --- | --- |
| `evidence/receipt.json` (`qpf-evidence-receipt-v1`) | SHA-256 index binding; no Ed25519; no JCS |
| Hermes `hermes-receipt-v1` | Good envelope pattern; weak crypto formality |
| SCCB `sccb.audit_receipt.v1` | Ops audit, not artifact provenance receipt |

## Fail modes

| Condition | Semantic |
| --- | --- |
| Artifact digest mismatch | `fail` |
| Missing required fields | `fail` or `partial` per profile |
| Unsigned when policy requires signature | `fail` or `partial` per policy |
