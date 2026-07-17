# HUMAN ACTION QUEUE v1

Updated: 2026-07-17T03:08:15Z

Rule: Agent does not ask what next while P3 remains. This file is the only interrupt surface for Kris.

## Ranked by impact (only items Kris can clear)

| Rank | P | ID | Action |
| ---: | ---: | --- | --- |
| 1 | P1 | `P1-receiving-spec` | Fill funding-receiving-form + paste AUTHORIZE TO RECEIVE (see AUTHORIZE_TO_RECEIVE_READY_V1.md) |
| 2 | P2 | `P2-grant-external` | Grant portal status (external human identity) |
| 3 | P1 | `P1-spiral-deadline` | Authorize Spiral Return deadline date |
| 4 | P1 | `P1-physical-M01-M04` | Confirm or WAIVE physical readiness M-01..M-04 |

## Impact order (execute top-down)

1. **Fill receiving destination** — `docs/activation/command/FUNDING_RECEIVING_SPEC_V1.md`.
2. **Guild/hall grant status** — identity login; one STATUS line.
3. **Authorize commit** of living-forge + activation evidence.
4. **Pin Spiral deadline** + physical M-01…M-04 or WAIVE.
5. **Outbound revenue path #1** — one paid-offer message (grant-independent).

## P2 external (poll only; no spam)

- `P2-grant-external`: Grant portal status (external human identity)

## Standing P0

- No sign / transfer / mint / deploy without explicit authorization.

## Metrics note

- Success = human interruptions ↓, autonomous tasks ↑, backlog ↓ — not report count.
