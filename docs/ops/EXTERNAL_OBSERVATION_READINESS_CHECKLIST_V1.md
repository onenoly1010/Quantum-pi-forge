# EXTERNAL_OBSERVATION_READINESS_CHECKLIST_V1

**Purpose:** One-page operational checklist before first authorized external interaction  
**Not:** Another roadmap · feature list · activation plan  
**After complete:** **Freeze** internal development lane until external evidence  

```text
STATE: VERIFIED PREPARATION
LOCKS: HELD
NEXT: authorized external observation only
```

```text
PREPARATION ≠ AUTHORIZATION ≠ EXECUTION ≠ VERIFICATION
No evidence → no claim · No authorization → no execution
```

---

## Final surface audit (read-only · 2026-08-04)

### Landing page truth (live quantumpiforge.com)

| Check | Result | Notes |
| --- | --- | --- |
| Homepage HTTP | ✅ 200 | Live |
| What it is | ✅ | Meta: verified decentralized AI on 0G; services path |
| Protocol mint/stake | ✅ demoted | Meta + hero: mint/stake/LP **not authorized** |
| Economic activation claim | ✅ avoided | “Not economic activation”; wallet not required to verify/contact |
| Commercial CTA | ✅ | Work with us / conversation — not mint |
| Liquidity exists claim | ✅ avoided | Status: pair may exist; reserves empty when stated |
| Adoption claim | ✅ avoided | 8.5 portal shows **0/3** eligible reports |
| Current state clarity | ⚠ partial | Homepage is dense; truth present but easy to miss amid many sections |

**Recommended truth line (already aligned in spirit):**

> The system is operationally prepared. Public economic activation follows verified participation and separate governance gates.

### Public paths (live)

| Path | HTTP | Notes |
| --- | --- | --- |
| `/` | 200 | OK |
| `/what-it-does` | 200 | OK |
| `/for-builders` | 200 | OK |
| `/work-with-us` | 200 | Contact path |
| `/deployed-addresses` | 200 | Verify portal |
| `/verification-status-v1.json` | 200 | mint/LP NOT_AUTHORIZED · financial LOCKED |
| `/founding-builders-pilot` | ⚠ 200 but **SPA/index fallback** | **Not the pilot page until #717 deploys** — live body is homepage, not Founding Builders |

### Branch vs live (observation entry)

| Surface | On `docs/outcomes-lane-v1` | On live main deploy |
| --- | --- | --- |
| Founding Builders pilot page | ✅ in branch | ❌ not distinct page yet |
| Pilot feedback roadmap / wall of receipts | ✅ in branch | ❌ not live yet |
| Feedback issue template | ✅ in branch | ❌ on main only after merge |
| `FIRST_EXTERNAL_ATTEMPT_V1` template | ✅ in branch | N/A until used post-attempt |

**Implication:** First external invite can still use **live** paths (`/work-with-us`, `/for-builders`, `/deployed-addresses#verify-now`, GitHub). Full pilot landing requires **merge #717 + CF deploy** before using that URL as the entry point.

---

## Roadmap phase alignment

| Phase | Status |
| --- | --- |
| Foundation | Complete |
| Architecture | Complete |
| Verification framework | Complete |
| Governance / security gates | Complete |
| Deployment infrastructure | Complete |
| Public readiness surface | Complete (core); pilot pack pending merge |
| Liquidity / mint activation | **Locked** |
| External adoption | **Waiting** |

```text
Phase Next — External Reality Loop
1. Authorized outreach
2. Independent user interaction
3. Evidence capture
4. Review results
5. Decide next activation step (separate GO if ever)
```

Not “build more.”

---

## Before first external interaction

Fill at authorize time. Do not invent checks.

| # | Check | Status | Operator notes |
| --- | --- | --- | --- |
| 1 | Landing page current (truth: what / live / locked / how to participate) | ☑ enough for core; ⚠ dense | Live truth OK; no mint/liquidity/adoption overclaim |
| 2 | Contact path works | ☑ | `/work-with-us` mailto · GitHub issues |
| 3 | Demo / task path works | ☑ read-only | `#verify-now` · `verify:public-portal` · cockpit if local |
| 4 | Documentation links work | ☑ | Builder quickstart + community templates on repo |
| 5 | Evidence capture ready | ☑ | `FIRST_EXTERNAL_ATTEMPT_V1` template · feedback issue form (after merge) |
| 6 | No financial claims | ☑ | Status JSON + homepage demote mint/LP |
| 7 | No unlocked actions | ☑ | site signing DISABLED · mint/LP LOCKED |
| 8 | Governance locks confirmed | ☑ | verification-status-v1.json economic panel |
| 9 | Receipt template ready | ☑ | `docs/ops/templates/FIRST_EXTERNAL_ATTEMPT_RECEIPT_V1.md` |
| 10 | Entry point URL chosen and **actually serves intended page** | ☐ | If using Founding Builders URL → merge #717 first; else use live verify/work-with-us |

---

## Freeze declaration

When checks 1–9 are acceptable and entry point (10) is chosen:

```text
INTERNAL DEVELOPMENT LANE: FROZEN
  — no more readiness packaging
  — no architecture expansion for growth
  — no mint/LP unlock

OPEN LANE:
  — authorize one external interaction
  — observe
  — seal FIRST_EXTERNAL_ATTEMPT_V1 after the attempt only
```

---

## Smallest valid first journeys (pick one)

| Journey | Entry | Task | Works without #717 merge? |
| --- | --- | --- | --- |
| **A Verify** | `/deployed-addresses#verify-now` | Run published RPC/status checks | **Yes** |
| **B Services** | `/work-with-us` | Send brief / conversation | **Yes** |
| **C Founding pilot** | `/founding-builders-pilot` | One workflow + feedback | **No** until merge+deploy |
| **D Local operator** | Clone + E1 min path | cockpit `--quick` + report | Yes (GitHub) |

---

## Operator sign-off (human)

```text
Checklist reviewed (UTC): ________
Entry journey chosen: A / B / C / D
#717 merge required for entry? yes / no
Locks still held? YES
FIRST_EXTERNAL_ATTEMPT pre-created? NO (must remain absent)
Authorized by: ________
```

```text
You are not stalled.
You are at the boundary between creation and validation.

Hold locks. Surface is true enough.
Authorize one observation. Record reality.
```
