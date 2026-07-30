# Builder Reproduction Prep v1 (Phase 8.6 foreshadow)

**Phase:** 8.6 (prep only — not activated)  
**Mode:** PREP CHECKLIST — not a completion seal  
**Depends on:** Phase 8.4 complete · Phase 8.5 Round 1 underway  

This document **prepares** the clean-clone reproduction path that Phase 8.6 will exercise. It does **not** mark 8.6 complete and does **not** authorize economics.

---

## Goal (when 8.6 activates)

A developer who has never seen QPF can:

1. Clone the public repo  
2. Install documented dependencies  
3. Follow [BUILDER_QUICKSTART.md](../BUILDER_QUICKSTART.md)  
4. Reach the same verification conclusions as the multi-report consensus baseline (or document honest drift)

---

## Prep checklist (autonomous / maintainer)

| Item | Status | Notes |
| --- | --- | --- |
| Public portal live | ✅ | https://quantumpiforge.com/deployed-addresses (Round 1 wording live 2026-07-30) |
| Registry on main | ✅ | [CONTRACT_REGISTRY_V1.md](../CONTRACT_REGISTRY_V1.md) |
| Builder quickstart on main | ✅ | [BUILDER_QUICKSTART.md](../BUILDER_QUICKSTART.md) |
| First verification path | ✅ | [FIRST_VERIFICATION_EVENT_V1.md](./FIRST_VERIFICATION_EVENT_V1.md) |
| Report template | ✅ | [VERIFICATION_REPORT_TEMPLATE_V1.md](./VERIFICATION_REPORT_TEMPLATE_V1.md) |
| Maintainer clean-clone dry run | ✅ | [BUILDER_REPRODUCTION_DRY_RUN_20260730.md](../evidence/BUILDER_REPRODUCTION_DRY_RUN_20260730.md) — RPC/portal PASS; shallow `verify:evidence` FAIL (history) |
| Multi-report baseline | ⏳ | Needs ≥ 1 eligible **external** report (maintainer dry run does not count toward \(m\)) |
| Clean-machine dry run by non-maintainer | ⏳ | Phase 8.6 success criterion |
| Documented expected outputs freeze | ⏳ | After Round 1 soft target or first 2 reports |

---

## Suggested 8.6 activation trigger

| Preferred | Acceptable |
| --- | --- |
| After Round 1 has ≥ 1 eligible independent report | After 8.4 live + explicit maintainer decision to run clean-clone dry runs in parallel |

---

## Boundaries

No mint, liquidity, signing, or broadcast as part of builder reproduction.

---

*Prep only. Phase 8.6 not sealed.*
