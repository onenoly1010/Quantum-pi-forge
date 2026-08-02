# Capability Registry v1

## Purpose

The capability registry is a derived integration view. It maps capabilities to
their verified source records; it does not replace the Phase 1 inventory,
Phase 2 manifest, evidence index, or any implementation repository.

## Inputs

| Input | Reused fields |
| --- | --- |
| `evidence/phase-1-inventory-v1.json` | canonical sources, authority boundary, `UNKNOWN` records |
| `deploy/capability-manifest.json` | active capabilities, source paths, verification commands, unavailable categories |

## Registry entry schema

Every entry contains:

- `name`
- `description`
- `sourceReference`
- `verification.status` and `verification.method`
- `confidence`
- `owner.repository`
- `unknownFields`

Verified entries are generated only from active Phase 2 capabilities. Unavailable
categories and Phase 1 unknowns become explicit `UNKNOWN` entries rather than
inferred capabilities.

## Confidence rules

| Confidence | Rule |
| --- | --- |
| `HIGH` | An active Phase 2 capability directly references the canonical evidence index and its verification command. |
| `UNKNOWN` | Source ownership, capability identity, or verification state is unresolved in the Phase 1 or Phase 2 input. |

## Verification

```bash
npm run verify:capability-registry
```

The verifier regenerates the registry and checks that every entry has the
required fields, that verified entries are derived from the Phase 2 manifest,
and that unresolved entries retain `UNKNOWN` fields.

## Authority boundary

The registry is read-only. It does not authorize deployment, wallet access,
financial action, blockchain transactions, external communication, or
credential use.
