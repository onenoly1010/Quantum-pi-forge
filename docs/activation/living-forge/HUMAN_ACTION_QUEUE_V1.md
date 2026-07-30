# HUMAN ACTION QUEUE v1

Updated: 2026-07-30T15:15:00Z
Mode: Event-driven standby (idle until state change)

Local autonomous prep is complete when P3=0. Agent wakes on repo/docs changes.

## Controlled by you

| Rank | Task | Artifact | Agent status |
| ---: | --- | --- | --- |
| 1 | Configure receiving form | `docs/activation/command/funding-receiving-form-v1.json` | **Blocked** — only you can fill destination |
| 2 | AUTHORIZE TO RECEIVE | `docs/activation/command/AUTHORIZE_TO_RECEIVE_READY_V1.md` | **Blocked** — needs form + exact phrase |
| 3 | Post Round 1 invitation (X / Hall) | `docs/community/ROUND1_PUBLIC_INVITATION_COPY_V1.md` | Copy ready · GitHub #636 open |
| 4 | Send Guild follow-up | `docs/activation/command/grant-package/GRANT_FOLLOWUP_DRAFT_RESTRAINED_V1.md` | Draft ready · send from application email |
| 5 | Send revenue offer | `docs/activation/command/revenue/OFFER_ONE_PAGER_AUDIT_WALKTHROUGH_V1.md` | Draft ready · fill price/contact first |
| 6 | Fund EOA Signer 2 gas | `docs/ops/GAS_CRITICAL_SIGNER2_ALERT_V1.md` | Alert documented · 0 native |
| 7 | Rotate GitHub `CLOUDFLARE_API_TOKEN` | GH Actions Pages deploy | **Broken** — local wrangler deploy works |
| 8 | Spiral deadline + physical M-01…M-04 | spiral-return state | Unchanged |

## Completed by agent (2026-07-30)

| Task | Result |
| --- | --- |
| Merge Phase 8.4/8.5 PR | #635 merged `0fcab13` |
| Open Round 1 invitation issue | [#636](https://github.com/onenoly1010/Quantum-pi-forge/issues/636) |
| Clean-clone builder dry run | evidence doc sealed (prep only) |
| Live portal deploy (Round 1 wording) | wrangler pages deploy → quantumpiforge.com |
| Gas Signer 2 recheck | still 0 native |

## Controlled by external parties

| Task | Party | Agent role |
| --- | --- | --- |
| Independent verification reports (m=3) | External reviewers | Index eligible issues |
| Grant decision / payout | 0G Guild | Monitor + prepared packages |
| Client payment | Customer | Offer ready |

## Standing P0

- Sign / spend / transfer / legal-as-Kris require explicit confirmation.

## Ops residuals (non-blocking for docs/credibility)

| Item | Status | Note |
| --- | --- | --- |
| Fund EOA Signer 2 `0x353663…e4cd` native gas | **OPEN** | See `docs/ops/GAS_CRITICAL_SIGNER2_ALERT_V1.md` |
| Flatten nested Safes (remove F69/F50F) | **Parked** | Requires multi-tx gas; commercial task after funding |
| GH Actions Cloudflare token | **OPEN** | Code 9106 auth failed on push; local OAuth deploy OK |

Open P3 autonomous tasks: **0**
