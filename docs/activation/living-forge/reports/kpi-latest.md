# Living Forge KPI Snapshot

**At (UTC):** 2026-07-30T23:19:09Z
**NO_WALLET_TOUCH:** `true`
**Maturity (auto):** **3.5** (3.5) — Safe-scope ops only; commercial earn loop excluded

## Services

| Unit | Status |
| --- | --- |
| living-forge-event | active |
| forgejo-runner | active |
| autonomy-pulse timer | active |
| living-forge timer | unknown |
| ollama | active |

## Alerts

- **info** `OLD_HUMAN_JOB`: oldest P0–P1 age 338.7h > 48h

## Throughput (24h heartbeats)

| Metric | Value |
| --- | --- |
| Success | 10 |
| Failure | 3 |
| Total | 13 |
| Success rate | 76.9% |
| Lifetime autonomous_completed | 290 |

## Queue

| Status | Count |
| --- | ---: |
| open | 14 |
| in_progress | 0 |
| done | 2 |
| failed | 0 |
| other | 0 |

| Open priority | Count |
| --- | ---: |
| P0 | 1 |
| P1 | 4 |
| P2 | 1 |
| P3 | 8 |

## Blocked / approval latency (P0–P1 open)

- Open approval items: **5**
- Avg age (hours): **338.7**
- Max age (hours): **338.7**

| ID | P | Age (h) | Title |
| --- | ---: | ---: | --- |
| P1-receiving-spec | 1 | 338.7 | Fill funding-receiving-form + paste AUTHORIZE TO RECEIVE (see AUTHORIZE_TO_RECEIVE_READY_V1.md) |
| P1-spiral-deadline | 1 | 338.7 | Authorize Spiral Return deadline date |
| P1-physical-M01-M04 | 1 | 338.7 | Confirm or WAIVE physical readiness M-01..M-04 |
| P0-any-sign-or-transfer | 0 | 338.7 | No sign/transfer unless explicitly authorized (standing guard) |
| P1-authorize-to-receive | 1 | 338.5 | Paste AUTHORIZE TO RECEIVE after form filled |

## Stuck in_progress

_None._

## Funding (read-only)

- ready_to_receive: **false**
- verified_available_funds_cad: **0**
- mode: `RECEIVING_READINESS_AUTHORIZED`

## Guardrails

- No signing, no fund movement, no key access from this snapshot.
- See `docs/autonomy-maturity.md` for score definition and 30-day targets.
