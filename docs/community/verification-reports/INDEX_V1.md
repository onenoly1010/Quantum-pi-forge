# Independent Verification Reports — Index v1

**Phase:** 8.5 Round 1  
**Mode:** EVIDENCE INDEX — not an activation path  
**Opened:** 2026-07-30T15:02:00Z  
**Quorum (proposed v1):** \(m = 3\) independent, diversity-eligible agreements  
**Index correction:** 2026-10-05 — status aligned to the published close. This edit does not add a report, open Round 2, or authorize mint, liquidity, or economic launch.

```text
CONSENSUS_CONFIRMED requires ≥ m agreeing independent reports
Maintainer / builder self-reports do NOT count toward m
Conflict or timeout → fail closed (no “externally settled” claim)
Consensus does NOT open mint, liquidity, or economic launch
SLA elapsed without m agreements → WINDOW_EXPIRED for that round
WINDOW_EXPIRED unlocks nothing
```

## Round 1 window

| Parameter | Value |
| --- | --- |
| Status | **WINDOW_EXPIRED** |
| Status as opened | OPEN (2026-07-30T15:02:00Z) |
| Soft SLA close | 2026-08-13T15:02:00Z (14 days) — **ELAPSED** |
| Hard close | 2026-08-29T15:02:00Z (30 days) — **ELAPSED** |
| Close rule | SLA elapsed without \(m\) agreements → fail closed for this round's “externally settled” claim |
| Consequence | Round 1 supports no externally settled claim. Nothing unlocked. |
| Round 2 | **NOT AUTHORIZED** — a successor round requires a separate GO; this index does not open one |
| Rolling reports | Still accepted as a check. A rolling report is not a settled quorum claim and does not reopen Round 1. |
| Portal | https://quantumpiforge.com/deployed-addresses |
| Invitation issue | [#636](https://github.com/onenoly1010/Quantum-pi-forge/issues/636) |
| Public notice | https://github.com/onenoly1010/Quantum-pi-forge/issues/636#issuecomment-5553660172 (2026-09-05, cited by status JSON) |
| Submit | [Open issue](https://github.com/onenoly1010/Quantum-pi-forge/issues/new) titled `External verification: YYYY-MM-DD` |
| Template | [VERIFICATION_REPORT_TEMPLATE_V1.md](../VERIFICATION_REPORT_TEMPLATE_V1.md) |
| Architecture | [MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](../MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md) |
| Public copy | [ROUND1_PUBLIC_INVITATION_COPY_V1.md](../ROUND1_PUBLIC_INVITATION_COPY_V1.md) |
| Receipt | `receipts/governance/phase-85-round1-open-v1.json` (open receipt; not a close receipt) |
| On main | PR #635 merged `0fcab13` · portal live deploy 2026-07-30 |
| Verify now | https://quantumpiforge.com/deployed-addresses#verify-now |
| Status JSON | https://quantumpiforge.com/verification-status-v1.json (`WINDOW_EXPIRED` as of 2026-09-28; this index was stale) |
| One-command | `npm run verify:public-portal` (read-only) |
| Latest consistency probe | `docs/evidence/PORTAL_CONSISTENCY_PROBE_20260730T154047Z.json` (PASS; not eligible for \(m\)) |
| Maintainer baseline issue | [#648](https://github.com/onenoly1010/Quantum-pi-forge/issues/648) · `ROLE=MAINTAINER_BASELINE` · **not** eligible for \(m\) · closed |
| Distance to economics | [DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md](../../DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md) (status only) |

## Expected findings (published posture)

| Claim | Expected |
| --- | --- |
| Chain ID | **16661** (`0x4115`) |
| Core contracts | Code present at registry addresses |
| Mint activation | **NOT AUTHORIZED** |
| Liquidity activation | **NOT AUTHORIZED** |
| Economic launch | **NOT AUTHORIZED** |
| DEX pair | Exists; reserves **empty** until separate GO |

## Report ledger

| # | Date (UTC) | Reviewer | Method | Eligible for \(m\)? | Core finding | Issue / link | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B1 | 2026-07-30 | Kris Olofson / @onenoly11 | portal + status JSON + RPC curls + `verify:public-portal` | **no** | agree published state (16661, code present, empty pair, mint/liquidity NOT AUTHORIZED) | [#648](https://github.com/onenoly1010/Quantum-pi-forge/issues/648) (closed) | `ROLE=MAINTAINER_BASELINE` — excluded from quorum |
| — | — | — | — | — | *no eligible external reports* | — | Slots A/B/C were READY_TO_SEND. None received before hard close. |

**Counts (as of this index correction):**

| Metric | Value |
| --- | --- |
| \(n\) accepted eligible | **0** |
| Agreeing on published state | **0** (eligible only; baseline B1 does not count) |
| Critical conflicts | **0** |
| Round consensus | **NOT_STARTED** |
| Round status | **WINDOW_EXPIRED** |
| Maintainer baselines indexed | **1** (#648) — not toward \(m\) |

## How maintainers index a report

1. Confirm issue uses the template and has reproducible method + timestamps.  
2. Check diversity / independence (not core maintainer; not obvious Sybil of an existing row).  
3. Add a ledger row; set **Eligible for \(m\)** yes/no with reason.  
4. If findings disagree on addresses, chain ID, code presence, or economic gates → mark conflict and halt any “externally settled” claim.  
5. Never treat quorum as auto-mint.  
6. A report filed after 2026-08-29T15:02:00Z is a rolling check. It does not reopen Round 1 and does not authorize Round 2.

## Related

- [INDEPENDENT_VERIFICATION_PROCESS_V1.md](../INDEPENDENT_VERIFICATION_PROCESS_V1.md)  
- [FIRST_VERIFICATION_EVENT_V1.md](../FIRST_VERIFICATION_EVENT_V1.md)  
- [VERIFICATION_PORTAL_V1.md](../VERIFICATION_PORTAL_V1.md)  
- [ACTIVATION_ROADMAP.md](../../ACTIVATION_ROADMAP.md)  

---

*Index only. Economic activation remains separately gated. This correction unlocks nothing.*
