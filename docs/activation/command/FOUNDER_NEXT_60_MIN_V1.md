# Founder next 60 minutes — post `autonomy-day3-stable`

**As of:** 2026-07-30  
**Tag:** `autonomy-day3-stable` → `d034537`  
**Autonomy status:** Day 1–3 **stable**; open P3 = 0; local pulse + event loop **active**  
**Boundary:** `NO_WALLET_TOUCH=true` — agent does **not** fill destination, send mail, or move funds

Machine work is done. Progress is now **founder-controlled** or **external**.

---

## Ranked actions (you only)

| # | Minutes | Action | Artifact | Why now |
| ---: | ---: | --- | --- | --- |
| 1 | 10–15 | **Designate receive destination** | `docs/activation/command/funding-receiving-form-v1.json` → `fill_by_kris` | Blocks `READY_TO_RECEIVE`; form still `TBD_HUMAN` |
| 2 | 2 | **AUTHORIZE TO RECEIVE** | Paste phrase + ownership per `AUTHORIZE_TO_RECEIVE_READY_V1.md` | Founder authority is ACTIVE; destination still missing |
| 3 | — | ~~Merge PR #614~~ (**Done**) | https://github.com/onenoly1010/Quantum-pi-forge/pull/614 | Merged 2026-07-17; remove from mental queue |
| 4 | 15 | **Send Guild follow-up #789** | Draft ready: `grant-package/GRANT_FOLLOWUP_DRAFT_RESTRAINED_V1.md` | M1–M3 evidence packaged; waiting on review |
| 5 | 10 | **Send revenue / audit walkthrough offer** | `revenue/OFFER_ONE_PAGER_AUDIT_WALKTHROUGH_V1.md` | Only path to client payment without grant |
| 6 | later | Spiral deadline + M-01…M-04 | spiral-return state | Physical / calendar; not automation |

---

## Do **not** do in this hour

- Export keys / fund Guardian Safe as shopping wallet  
- Use `0x335651…` or Safe `0x8d088B…` as **personal** receive unless intentional  
- Claim grant **award** or on-chain yield  
- Disable `NO_WALLET_TOUCH` for Living Forge jobs  
- Expect local AI to invent bank/wallet details  

---

## Agent continues (no prompt needed)

| Running | Role |
| --- | --- |
| `living-forge-event.service` | Wake on repo/grant/receive doc changes |
| `qpf-autonomy-pulse.timer` | 15m KPI + claim hygiene |
| Safe commands | See `OPS_SAFE_VS_FORBIDDEN_V1.md` |

After you fill the form + authorize, agent may reclassify funding readiness **from files** only (still no spend).

---

## One-command local re-check (optional)

```bash
export NO_WALLET_TOUCH=true
git checkout autonomy-day3-stable   # or main
npm run living-forge:seed-reset
npm run autonomy:day3:verify
```

---

## Success criteria for this hour

| Outcome | How you know |
| --- | --- |
| Destination designated | `fill_by_kris` no longer all `TBD_HUMAN` |
| Ready to receive authorized | Form/auth status leaves `AWAITING_DESTINATION_*` |
| Guild nudged | You sent mail; draft was restrained (no false award claim) |
| Optional: offer out | Walkthrough one-pager sent to a real prospect |

Verified funds remain **CAD $0** until independent settlement proof exists.
