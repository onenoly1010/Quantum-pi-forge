# Receiving readiness check v1

**Run:** 2026-07-17  
**Goal:** Time from external award/payment → correct destination configured ≈ 0  

## Automated checks

| Check | Result |
| --- | --- |
| Form file exists | YES — `funding-receiving-form-v1.json` |
| Authorize package exists | YES — `AUTHORIZE_TO_RECEIVE_READY_V1.md` |
| Spec exists | YES — `FUNDING_RECEIVING_SPEC_V1.md` |
| Destination filled | **NO** — still `TBD_HUMAN` |
| AUTHORIZE TO RECEIVE recorded | **NO** |
| Untrusted address blocked in docs | YES (listed do-not-use) |
| Guardian Safe not forced as shop wallet | YES |
| Secured CAD | **0** |
| Monitor script | `scripts/living-forge/monitor-funding-signals.cjs` |

## Human only (blocks READY_TO_RECEIVE)

1. Fill destination in form  
2. Paste AUTHORIZE TO RECEIVE  

## After payment (human + agent)

1. Record tx hash or bank confirmation  
2. Update secured ledger only with proof  
