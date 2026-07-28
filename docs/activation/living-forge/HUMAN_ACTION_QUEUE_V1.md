# HUMAN ACTION QUEUE v1

Updated: 2026-07-28T17:00:02Z
Mode: Event-driven standby (idle until state change)

Local autonomous prep is complete when P3=0. Agent wakes on repo/docs changes.

## Controlled by you

| Rank | Task | Artifact |
| ---: | --- | --- |
| 1 | Configure receiving form | `docs/activation/command/funding-receiving-form-v1.json` |
| 2 | AUTHORIZE TO RECEIVE | `docs/activation/command/AUTHORIZE_TO_RECEIVE_READY_V1.md` |
| 3 | Merge PR #614 | https://github.com/onenoly1010/Quantum-pi-forge/pull/614 |
| 4 | Send Guild follow-up | `docs/activation/command/grant-package/` |
| 5 | Send revenue offer | `docs/activation/command/revenue/OFFER_ONE_PAGER_AUDIT_WALKTHROUGH_V1.md` |
| 6 | Spiral deadline + physical M-01…M-04 | spiral-return state |

## Controlled by external parties

| Task | Party | Agent role |
| --- | --- | --- |
| Grant decision / payout | 0G Guild | Monitor + prepared packages |
| Client payment | Customer | Offer ready |

## Standing P0

- Sign / spend / transfer / legal-as-Kris require explicit confirmation.

## Ops residuals (non-blocking for docs/credibility)

| Item | Status | Note |
| --- | --- | --- |
| Fund EOA Signer 2 `0x353663…e4cd` native gas | **Logged / parked** | Reality Engine `LOW_GAS` at last probe; do not block grant docs. Prefer other keys for quorum until funded. |
| Flatten nested Safes (remove F69/F50F) | **Parked** | Requires multi-tx gas; commercial task after funding. Embrace nested posture in docs. |
| Social recovery guide vs chain | **Addressed 2026-07-28** | `0G_SOCIAL_RECOVERY_SETUP_GUIDE.md` updated to measured 3-of-4 nested architecture. Re-check: `npm run reality:claim-map`. |

Open P3 autonomous tasks: **0**
