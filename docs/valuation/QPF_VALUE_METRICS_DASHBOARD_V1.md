# QPF Value Metrics Dashboard v1

Status: LIVE_SNAPSHOT_POPULATED  
Snapshot: 2026-07-04T05:45:02Z  
Head: `afed71a`

## Purpose

Prove the self-sustaining value flywheel with **live repository metrics**, not belief. This dashboard turns sealed evidence into measurable proof that the flywheel inputs are turning.

**Rule:** No valuation uplift should be externally claimed unless supported by measurable evidence.

## Flywheel proof map

```text
sealed PRs / closure receipts     → reviewer confidence
valuation files + receipts          → audit/partner readiness
governance receipts + safety gates  → legitimacy protection
audit-readiness docs + permission map → external validation prep
public pages + verified builds      → usability + trust surfaces
evidence checks passing             → provable infrastructure
```

## Live snapshot (repo-derived)

| Metric | Count / status | Flywheel stage |
|--------|----------------|----------------|
| Valuation docs on `main` | **9** | Understandable / licensable |
| Valuation receipts | **10** | Provable |
| Valuation closure receipts | **4** (#562, #564, #566, #568) | Reviewer confidence |
| Valuation PRs merged to `main` | **10** | Evidence compounding |
| Governance receipts | **280** | Provable / auditable |
| Governance docs | **147** | Understandable |
| Audit-readiness valuation docs | **4** | Auditable |
| Diligence index coverage | **461 files** | Partner/auditor readiness |
| Permission map receipts scanned | **1201** | Auditable |
| Permission map evidence hits | **63** | Threat/risk clarity |
| Deploy + root public HTML pages | **29** | Usable / trust surfaces |
| `npm run verify:evidence` | **PASS** (5 steps) | Provable |
| `npm run build` | **PASS** | Usable |
| `mint_allowed` policy | **false** | Safety gates intact |
| `public_mint_active` | **false** | No reckless activation |

## Sealed valuation lane (merged PRs)

| PR | Artifact |
|----|----------|
| #562 | FMV evidence lane |
| #564 | Permission map + threat model |
| #566 | Partner/auditor diligence index |
| #567 | Diligence index closure |
| #568 | External valuation summary |
| #569 | External summary closure |
| #570 | Self-sustaining value flywheel |

## Valuation docs on `main`

1. `QPF_FMV_BASELINE_MEMO_V1.md`
2. `QPF_IP_ASSET_REGISTER_V1.md`
3. `QPF_VALUE_METRICS_DASHBOARD_V1.md` (this file)
4. `QPF_AUDIT_READINESS_PACKAGE_V1.md`
5. `QPF_AUDIT_READINESS_LIVE_EVIDENCE_ADDENDUM_V1.md`
6. `QPF_AUDIT_READINESS_PERMISSION_MAP_THREAT_MODEL_V1.md`
7. `QPF_PARTNER_AUDITOR_DILIGENCE_INDEX_V1.md`
8. `QPF_EXTERNAL_VALUATION_SUMMARY_V1.md`
9. `QPF_SELF_SUSTAINING_VALUE_FLYWHEEL_V1.md`

## Metrics not yet populated (requires external signal)

These remain **null / not claimed** until supported by receipts or third-party data:

| Metric | Status |
|--------|--------|
| Human onboarding completions | Not tracked in-repo yet |
| Participant count | Not tracked in-repo yet |
| Independent node/operator count | Not tracked in-repo yet |
| GitHub stars / forks | Requires API snapshot receipt |
| Grants submitted / awarded | Requires grant receipt lane |
| Partner conversations / LOIs | Requires partner receipt lane |
| Revenue or licensing activity | Requires revenue receipt lane |
| Independent audit completed | Audit readiness only — not completed |

## Flywheel interpretation

| Signal | Reading |
|--------|---------|
| 280 governance receipts + safety gates false | Legitimacy protected — no reckless activation claim |
| 9 valuation docs + 10 receipts | Internal + external value language is dense |
| 461 indexed diligence files | Reviewability is high — lowers partner/auditor friction |
| 1201 receipts scanned in permission map | Audit scope is grounded in live evidence |
| verify:evidence + build PASS | Infrastructure is reproducibly verifiable |
| Null external metrics | Honest posture — no fake traction |

## Next metrics that would move FMV most

1. Independent audit engagement or completion receipt
2. First grant submitted / awarded with sealed receipt
3. Partner LOI or pilot with sealed receipt
4. Human onboarding completion counter (privacy-safe aggregate)
5. Builder deployment using QPF templates (counted via receipt)

## Safety assertions

- No wallet action performed by updating this dashboard
- No signing, broadcast, mint, liquidity, staking, or bridge authorization
- Metrics are repo-derived snapshots — not external appraisal claims
- Null metrics are intentionally not fabricated

## Regeneration

Re-run the live snapshot script on branch `valuation/value-metrics-dashboard-live-v1` or future automation to refresh counts after merges.