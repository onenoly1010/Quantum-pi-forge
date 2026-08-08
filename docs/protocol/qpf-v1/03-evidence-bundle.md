# 03 — Evidence Bundle

## Status

Normative draft (QPF Verification Protocol v1)

## Purpose

An **Evidence Bundle** is a portable, content-addressed package of materials needed for offline verification:

- artifact digests (and optional embedded artifacts)
- receipts
- attestations
- policy document digests / refs
- trust material refs (not necessarily private keys)

## Required properties

| Field | Description |
| --- | --- |
| `schema` | `qpf.evidence_bundle.v1` |
| `bundle_id` | Unique id |
| `manifest` | Ordered list of content-addressed objects `{ role, alg, digest, media_type? }` |
| `bundle_digest` | Digest of canonical manifest |
| `created_at` | UTC |

## MUST / MUST NOT

- MUST be content-addressed; reordering with same objects MUST yield stable digests under canonical rules.  
- MUST allow verification when all referenced digests resolve locally.  
- MUST NOT require network access for pure crypto checks when material is local.  
- MUST NOT embed secrets.

## Mapping to existing QPF

| Existing | Notes |
| --- | --- |
| `evidence/INDEX.md` + `evidence/receipt.json` | Proto-bundle via index hash |
| `evidence-manifest.json` | Component inventory style |
| Capability registry JSON | Evidence of project proofs — different purpose |

## Fail modes

| Condition | Semantic |
| --- | --- |
| Manifest digest mismatch | `fail` |
| Missing referenced object | `partial` or `unavailable` |
| Role missing required receipt | per trust policy |
