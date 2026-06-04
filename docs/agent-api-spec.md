# Agent API Contract Specification

Status: Draft contract layer  
Scope: Documentation, schemas, static fixtures, and local verification only

## Operating Sentence

Quantum Pi Forge does not expand autonomous execution in this phase. It first defines and verifies deterministic agent-facing skill retrieval, search resolution, and refusal behavior.

## Governance Boundary

This specification does not authorize:

- live posting
- wallet signing
- token minting
- staking
- governance execution
- deployment expansion
- chain mutation
- autonomous runtime activation
- external state mutation

The purpose of this phase is to make the agent API boundary reviewable before any runtime implementation is trusted.

## Endpoint: `/api/skill`

### Purpose

Retrieves structured skill documentation for a requested topic.

### Parameters

| Parameter | Required | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `topic` | Yes | string | none | Requested skill topic |
| `depth` | No | integer | `1` | Requested expansion depth |

### Deterministic Requirements

A valid response must include:

- `topic`
- `requested_depth`
- `resolved_depth`
- `content`
- `linked_topics`

Unknown topics must produce a deterministic refusal response.

No endpoint behavior may depend on hidden state, wall-clock randomness, wallet state, external mutation, or live governance authorization.

## Endpoint: `/api/search`

### Purpose

Resolves a query against the operational skill index.

### Parameters

| Parameter | Required | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `q` | Yes | string | none | Search query |
| `format` | No | string | `json` | Allowed values: `json`, `markdown` |

### Deterministic Requirements

A valid response must include:

- `query`
- `format`
- `results`

Each result must include:

- `topic`
- `score`

A result may include:

- `snippet`

Malformed queries must produce a deterministic refusal response.

## Refusal Rule

Any unknown topic, malformed query, unsupported format, or invalid request must reject cleanly.

A refusal must:

- return a stable error code
- declare `deterministic_refusal: true`
- perform zero state mutation
- perform zero wallet action
- perform zero chain action
- perform zero live posting
- avoid external calls

## Review Goal

This document creates a human-reviewable contract layer before runtime expansion. Future implementation must prove that live endpoint output matches the static fixtures or explain any intentional deviation in a separate human-reviewed PR.
