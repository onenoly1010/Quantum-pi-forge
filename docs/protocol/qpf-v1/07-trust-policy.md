# 07 — Trust Policy

## Status

Normative draft (QPF Verification Protocol v1)

## Purpose

A **Trust Policy** states **contextual acceptance criteria**: what must pass for a given verification level and context (e.g. “local CI”, “external pilot”, “pre-mainnet”).

Policy evaluation is **not** governance execution (merge/deploy/mint).

## Policy document (logical)

| Field | Description |
| --- | --- |
| `schema` | `qpf.trust_policy.v1` |
| `policy_id` | Identifier |
| `policy_version` | Version string |
| `required_level` | Minimum level |
| `require_signed_receipt` | boolean |
| `require_attestation_classes` | list |
| `allowed_roots` | root ids |
| `deny_revoked_keys` | boolean (default true) |
| `max_clock_skew_seconds` | optional |

## MUST / MUST NOT

- MUST be content-addressable (`policy_digest`).  
- MUST be bound into verification requests and verification receipts.  
- MUST NOT unlock mint/LP/Pi by itself.  
- MUST NOT be silently overridden by agent always-approve modes.

## Mapping to existing QPF

| Existing | Notes |
| --- | --- |
| Governance gates / authorityBoundary flags | Informal policy fragments |
| SCCB policy classes | Operational capability policy — different plane |
| AI AUTHORIZATION_WORKFLOW | Human process policy |

## Fail modes

| Condition | Semantic |
| --- | --- |
| Policy digest mismatch | `fail` |
| Level not achieved | `fail` or `partial` |
| Required attestation class missing | `partial` or `fail` per policy |
