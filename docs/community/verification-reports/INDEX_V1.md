# Independent Verification Reports — Index v1

**Phase:** 8.5 Round 1  
**Mode:** EVIDENCE INDEX — not an activation path  
**Opened:** 2026-07-30T15:02:00Z  
**Quorum (proposed v1):** \(m = 3\) independent, diversity-eligible agreements  

```text
CONSENSUS_CONFIRMED requires ≥ m agreeing independent reports
Maintainer / builder self-reports do NOT count toward m
Conflict or timeout → fail closed (no “externally settled” claim)
Consensus does NOT open mint, liquidity, or economic launch
```

## Round 1 window

| Parameter | Value |
| --- | --- |
| Status | **OPEN** |
| Soft SLA close | 2026-08-13T15:02:00Z (14 days) |
| Hard close | 2026-08-29T15:02:00Z (30 days) |
| Portal | https://quantumpiforge.com/deployed-addresses |
| Invitation issue | [#636](https://github.com/onenoly1010/Quantum-pi-forge/issues/636) |
| Submit | [Open issue](https://github.com/onenoly1010/Quantum-pi-forge/issues/new) titled `External verification: YYYY-MM-DD` |
| Template | [VERIFICATION_REPORT_TEMPLATE_V1.md](../VERIFICATION_REPORT_TEMPLATE_V1.md) |
| Architecture | [MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](../MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md) |
| Public copy | [ROUND1_PUBLIC_INVITATION_COPY_V1.md](../ROUND1_PUBLIC_INVITATION_COPY_V1.md) |
| Receipt | `receipts/governance/phase-85-round1-open-v1.json` |
| On main | PR #635 merged `0fcab13` · portal live deploy 2026-07-30 |
| Verify now | https://quantumpiforge.com/deployed-addresses#verify-now |
| Status JSON | https://quantumpiforge.com/verification-status-v1.json |
| One-command | `npm run verify:public-portal` (read-only) |
| Latest consistency probe | `docs/evidence/PORTAL_CONSISTENCY_PROBE_20260730T154047Z.json` (PASS; not eligible for \(m\)) |

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
| — | — | — | — | — | *no eligible reports yet* | — | Round 1 open |

**Counts (update when indexing):**

| Metric | Value |
| --- | --- |
| \(n\) accepted eligible | **0** |
| Agreeing on published state | **0** |
| Critical conflicts | **0** |
| Round consensus | **NOT_STARTED** |

## How maintainers index a report

1. Confirm issue uses the template and has reproducible method + timestamps.  
2. Check diversity / independence (not core maintainer; not obvious Sybil of an existing row).  
3. Add a ledger row; set **Eligible for \(m\)** yes/no with reason.  
4. If findings disagree on addresses, chain ID, code presence, or economic gates → mark conflict and halt any “externally settled” claim.  
5. Never treat quorum as auto-mint.

## Related

- [INDEPENDENT_VERIFICATION_PROCESS_V1.md](../INDEPENDENT_VERIFICATION_PROCESS_V1.md)  
- [FIRST_VERIFICATION_EVENT_V1.md](../FIRST_VERIFICATION_EVENT_V1.md)  
- [VERIFICATION_PORTAL_V1.md](../VERIFICATION_PORTAL_V1.md)  
- [ACTIVATION_ROADMAP.md](../../ACTIVATION_ROADMAP.md)  

---

*Index only. Economic activation remains separately gated.*
