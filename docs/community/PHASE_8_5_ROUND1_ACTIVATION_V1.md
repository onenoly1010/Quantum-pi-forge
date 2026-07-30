# Phase 8.5 Round 1 Activation v1

**Status:** `PHASE_8_5_ROUND_1_OPEN`  
**Mode:** PROCESS ACTIVATION — not economic activation  
**Opened:** 2026-07-30T15:02:00Z  
**Depends on:** Phase 8.4 portal live (`phase-84-verification-portal-live-v1`)

---

## What activated

Phase **8.5 Round 1** is open for collecting **independent verification reports**.

| Activated | Not activated |
| --- | --- |
| Multi-report collection window | Public mint |
| Report index + ledger | Liquidity seeding |
| Quorum tracking toward \(m=3\) | Yield / staking / bridge |
| Conflict / SLA fail-closed rules | Phase 9.0 governance GO |
| Invitation for external reviewers | Any on-chain unlock from reports |

---

## Why now

Phase **8.4** success criteria are met:

1. Third parties can **locate** deployed contracts (live portal + registry).  
2. Third parties can **reproduce** verification steps (published guide + public RPC).  
3. Documentation is **internally consistent** (portal ↔ registry ↔ status: mint/liquidity NOT AUTHORIZED).  

Architecture for multi-report verification was already **DEFINED**. Round 1 turns that architecture into an **active collection window**.

---

## Round 1 parameters

| Parameter | Value |
| --- | --- |
| Quorum \(m\) | **3** independent agreements (proposed v1) |
| Soft SLA | **14 days** → 2026-08-13T15:02:00Z |
| Hard SLA | **30 days** → 2026-08-29T15:02:00Z |
| On timeout | Fail closed for “externally settled” claim |
| On conflict | Halt consensus; manual governance review |
| Maintainer reports toward \(m\) | **No** |

---

## How to participate

1. Open https://quantumpiforge.com/deployed-addresses  
2. Follow [FIRST_VERIFICATION_EVENT_V1.md](./FIRST_VERIFICATION_EVENT_V1.md) or [BUILDER_QUICKSTART.md](../BUILDER_QUICKSTART.md)  
3. File a GitHub issue using [VERIFICATION_REPORT_TEMPLATE_V1.md](./VERIFICATION_REPORT_TEMPLATE_V1.md)  
4. Maintainers index eligible reports in [verification-reports/INDEX_V1.md](./verification-reports/INDEX_V1.md)  

**Success for a report:** independent confirmation **or** honest drift with method + timestamps.  
**Not success:** a transaction executed.

---

## Exit conditions for Round 1

| Outcome | Condition | Next |
| --- | --- | --- |
| **CONSENSUS_CONFIRMED** | ≥ 3 eligible reports agree on published state | Evidence pack for Phase 9.0; still no auto-mint |
| **CONSENSUS_DRIFT** | ≥ 3 agree docs/site ≠ chain | Fix surfaces; may re-open round |
| **NO_CONSENSUS** | \(n < m\) or unresolved conflict at hard close | Fail closed; optional Round 2 |
| **HALTED** | Critical conflict mid-window | Manual review; no economic action |

---

## Boundaries

This document **does not** authorize mint, liquidity, signing, broadcast, Safe execution, or contract changes. Multi-report consensus is **verification evidence** only.

Receipts:

- `receipts/governance/phase-84-verification-portal-live-v1.json`  
- `receipts/governance/phase-85-round1-open-v1.json`  

---

*Phase 8.5 Round 1 — gather external evidence. Restraint remains intentional.*
