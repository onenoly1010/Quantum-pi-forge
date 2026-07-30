# Distance to Economic Activation V1

**Mode:** STATUS SNAPSHOT — not an unlock, not a valuation, not a schedule  
**Network:** 0G Aristotle Mainnet · Chain ID **16661**  
**As of (UTC):** 2026-07-30T19:17:56Z  
**Audience:** maintainers, independent reviewers, partners asking “when do wallets earn?”

```text
Capability  ≠  Permission  ≠  Activation  ≠  Revenue
```

---

## 1. Bottom line

| Question | Answer |
| --- | --- |
| Wallet-connected **protocol** earnings today (mint fees, LP fees, staking, yield routing)? | **None by design** — commercial path **NOT AUTHORIZED** |
| Is there a live earnings meter that is “just gated”? | **No.** Fee model is **designed** (and partly tested); full fee-routing product is **not** paying wallets |
| Known dollar earnings from QPF economics? | **$0 protocol cashflow** claimed; future amounts **undefined** (depend on GO + capital + volume) |
| How far to real mint / liquidity / staking / yield value? | **Multiple phases + multiple separate GOs + funding + users** — not a single switch |

**Public posture (authoritative):** [ACTIVATION_STATUS.md](./ACTIVATION_STATUS.md)

```text
TECHNICAL_ACTIVATION   = VERIFIED
COMMERCIAL_ACTIVATION  = NOT_ACTIVE
PUBLIC_MINT_OPEN       = NO
LIQUIDITY              = NO (pair exists; reserves 0/0)
YIELD / STAKING / BRIDGE = NO
RESTRAINT              = INTENTIONAL
```

---

## 2. Verification boundary (do not collapse layers)

```text
Technical truth
      ↓
Deployment evidence
      ↓
Independent verification   ← YOU ARE HERE (Phase 8.5)
      ↓
Governance decision (9.0)
      ↓
Economic activation (separate GOs)
      ↓
Markets / volume / capital
      ↓
Possible protocol revenue
```

| Layer | Question | Pays a wallet? |
| --- | --- | --- |
| Architecture | What was designed? | No |
| Deployment inventory | What exists on-chain? | No |
| Evidence + verification | Can strangers reproduce claims? | No |
| Governance | Who may authorize open? | No |
| Economic activation | What features are enabled? | Only after explicit GO |
| Markets | Is there volume / TVL? | Only if users + capital exist |

---

## 3. Phase distance (trust foundation → decision)

Ordered path from [ACTIVATION_ROADMAP.md](./ACTIVATION_ROADMAP.md). **Not a calendar of automatic activation.**

| Phase | Objective | Status (2026-07-30) | Unlocks money? |
| --- | --- | --- | --- |
| 8.0–8.3 | Edge / public readiness / Safe policy / mint authority **explained** | ✅ Complete | **No** |
| **8.4** | Public verification portal | ✅ **COMPLETE** | **No** |
| **8.5** | Multi-report independent verification (proposed **m = 3**) | ● Round 1 **OPEN** · eligible **n = 0** | **No** — evidence only |
| **8.6** | Builder reproduction (clean clone) | Pending / prep | **No** |
| **8.7** | Ops readiness (monitoring, recovery — **no** token economics) | Pending | **No** |
| **9.0** | Governance decision on aggregate 8.4–8.7 evidence | ⛔ Not authorized | **No** — decision only |
| Future | Mint / liquidity / yield / staking / bridge | ⛔ Separate explicit GO each | Only **if** GO + execution succeed |

**Rough count:** **~4 phase gates** remain before governance may *consider* economics (finish 8.5 → 8.6 → 8.7 → 9.0).  
**9.0 is not auto-mint / auto-liquidity / auto-yield.**

### Phase 8.5 Round 1 snapshot

| Field | Value |
| --- | --- |
| Status | OPEN |
| Soft SLA | 2026-08-13 |
| Hard SLA | 2026-08-29 |
| Quorum \(m\) | 3 independent eligible agreements |
| Eligible \(n\) | **0** |
| Maintainer baseline | [#648](https://github.com/onenoly1010/Quantum-pi-forge/issues/648) — **not** counted toward \(m\) |
| Consensus | **NOT_STARTED** |
| Index | [community/verification-reports/INDEX_V1.md](./community/verification-reports/INDEX_V1.md) |

---

## 4. Economic gates after 9.0 (each fail-closed)

Each row needs its **own** authorization. Bundling “activate everything” is forbidden by doctrine.

| Gate | Commercial feature | Status | Notes |
| --- | --- | --- | --- |
| B | Controlled mint (named action) | Gated | Human signing for exact path only |
| A | Public mint open | **NO-GO** | Policy / Phase 38-class YES required |
| F | Liquidity seed | Prep only | Pair **empty**; unsigned prep exists; needs funding + auth receipt |
| Y | Yield routing **product** live | Not authorized | Design + tests; full FeeCollector stack still gated |
| S | Staking | Not authorized | No live staking product |
| Br | Bridge economic open | Not authorized | No live bridge earnings claim |
| T | Treasury ops / spend | Not authorized | Safe exists ≠ spend authorized |

**Rough count:** **~6–7 separate commercial gates** after verification phases, plus capital and markets.

### Before liquidity (high level)

- [x] Pair + router technically present (W0G/USDC.e empty pool)  
- [ ] Liquidity **authorization receipt**  
- [ ] Funding present (real assets, not aspirational)  
- [ ] Exact amounts sealed; Safe multi-sig path  
- [ ] Product pair clarity (see §6 — OINIO/W0G may need `createPair`)

### Before yield (high level)

- [ ] Security + governance maturity  
- [ ] Mint controls clear (if yield depends on mint economics)  
- [ ] Liquidity event complete (if yield depends on markets)  
- [ ] Pre-deployment gate for FeeCollector / vaults satisfied  
- [ ] Explicit human deploy + wire authorization  
- [ ] Never auto-on with mint

---

## 5. Immediate blockers (today — not phase calendar)

| Blocker | Effect on “earnings path” |
| --- | --- |
| Eligible external reports \(n = 0\) | 8.5 quorum not started — primary evidence bottleneck |
| Private Slot A/B/C not yet fully executed | Independent reports still needed (rotation **7/7 revoked**; freeze lifted per #657) |
| Liquidity capital unset | Empty pool cannot generate LP fees |
| Site signing / broadcast disabled | Correct restraint; no accidental economic txs |
| Grant / partner cash | Pipeline / expedition docs; **no** secured protocol revenue claimed |
| Adoption / volume | Zero by design until markets open |

**Resolved ops hygiene (2026-07-30):** secret-scanning alerts on `quantum-pi-forge-fixed` **7/7 revoked** — see [security/SECRET_ROTATION_WORKSHEET_V1.md](./security/SECRET_ROTATION_WORKSHEET_V1.md) and #657. Private outreach may proceed; it still does **not** enable economics.

---

## 6. On-chain vs “earning”

### Live / inspectable (technical)

| Artifact | Role | Earnings? |
| --- | --- | --- |
| OINIO / registries / heartbeat / ForgeRegistry | Core contracts | No |
| DEX Factory / Router | Swap infrastructure | No without liquidity + volume |
| DEX Pair **W0G/USDC.e** `0x2067319D…AaeE` | Exists; **reserves 0/0** | **$0 fees** |
| Safe Guardian `0x8d088B…4389` | Governance surface | No spend authorization |
| YieldRouterFactory `0x566b30c9…ea6c3` | Bytecode present (factory) | **Infrastructure only** — not a live wallet yield product |

### Designed / gated (not a paused meter)

| Mechanism (design) | Intended split (docs / tests) | Live paying? |
| --- | --- | --- |
| DEX swap fee (~0.5%) | 50% LegacyVault / 30% PioneerRewards / 20% OperationalTreasury | **No** |
| Soul mint royalty (~2.5%) | 100% PioneerRewards | **No** (mint closed) |
| Staking cut (~1%) | 100% OperationalTreasury | **No** |
| Bridge fee (~0.25%) | 100% LegacyVault | **No** |

References: `YIELD_ROUTING_CONTRACT_DESIGN_V1.md`, `YIELD_ROUTING_PRE_DEPLOYMENT_GATE_V1.md`, `YIELD_ROUTING_TEST_SPEC_V1.md`  
Gate receipts assert **`earnings_live: false`** / no yield execution claimed live.

### Product pair caution

Canonical **empty** V2 pool for seed prep is **W0G/USDC.e**.  
An **OINIO/W0G** market may require a **new** `createPair` (separate unsigned + GO path). Do not treat marketing labels as pair addresses without `eth_getCode` / factory checks. See [activation/liquidity/UNSIGNED_LIQUIDITY_PREP_V1.md](./activation/liquidity/UNSIGNED_LIQUIDITY_PREP_V1.md).

---

## 7. What would have to be true for protocol value in a wallet

Fail-closed chain (any break → no legitimate protocol earnings claim):

1. Secret rotation complete → private outreach unfrozen (ops hygiene) — **done** (#657)  
2. Phase **8.5** quorum (\(m\) independent agreements) — **current bottleneck**  

3. Phase **8.6** builder reproduction  
4. Phase **8.7** ops readiness  
5. Phase **9.0** governance decision (evidence-based)  
6. **Separate** GO for each feature (mint and/or liquidity and/or yield and/or staking and/or bridge)  
7. Real **capital** into intended pools  
8. Yield stack **deployed and wired** if fee routing is required  
9. **Users and volume** (fees = volume × rate × split)  
10. Claim / distribution rules under current governance policy  

Until then, connecting a wallet to public surfaces **must not** be described as earning protocol yield.

---

## 8. Earnings and value — what is known vs not

| Claim type | Reality |
| --- | --- |
| Protocol earnings **today** | **$0** (empty pool, mint/yield/staking closed) |
| Projected protocol USD/month | **Undefined** — rates designed; volume unknown |
| Internal FMV baseline | Replacement-cost / option framing only — [valuation/QPF_FMV_BASELINE_MEMO_V1.md](./valuation/QPF_FMV_BASELINE_MEMO_V1.md) — **not cash**, not external appraisal |
| Grants as “earnings” | Pipeline / process; do not treat unawarded grants as revenue |
| Near-term **non-protocol** cash ideas | Services path only — [activation/command/REVENUE_EXPEDITION_30D_V1.md](./activation/command/REVENUE_EXPEDITION_30D_V1.md) (paid diligence, evidence packs, bounties, local AI setup). **Excludes** mint/liquidity/yield as 30-day cash |

### Near-term vs long-term money paths

| Path | Nature | Depends on economic GO? |
| --- | --- | --- |
| Paid audit / evidence / grant-readiness consulting | Off-chain services | **No** |
| Bounties / sponsorships | Off-chain / ecosystem | **No** |
| Public mint | On-chain commercial | **Yes** — currently NO-GO |
| LP fees | On-chain commercial | **Yes** + capital + volume |
| Yield / staking rewards | On-chain commercial | **Yes** + deploy + volume |
| Bridge fees | On-chain commercial | **Yes** |

---

## 9. Workstream distance (order of magnitude)

Not a task tracker — a **stack** of workstreams between “now” and “protocol fees possible”:

| # | Workstream | Status |
| ---: | --- | --- |
| 1 | Finish secret rotation (7/7 Revoked + green Actions) | ✅ Done (#657) |
| 2 | Send Slot A/B/C; gather external reports | Unfrozen — execution still required |
| 3 | Reach \(n \ge m\) independent agreements | \(n = 0\) |
| 4 | Phase 8.6 clean-clone reproduction | Pending |
| 5 | Phase 8.7 ops drills | Pending |
| 6 | Phase 9.0 governance decision | Blocked on 8.5–8.7 |
| 7 | Per-feature economic GO receipts | Not started |
| 8 | Fund + seed liquidity (real assets) | Prep only |
| 9 | Deploy/wire full yield path if still desired | Pre-deploy gated |
| 10 | Markets / users / volume | Not started |

**This is process + capital + market — not “a few toggles.”**

---

## 10. Explicit non-goals of this document

- Does **not** authorize mint, liquidity, yield, staking, bridge, or treasury spend  
- Does **not** set a launch date or promised APR/TVL  
- Does **not** count maintainer baseline reports toward \(m\)  
- Does **not** treat FMV memos or grant outreach as cash on hand  
- Does **not** instruct anyone to connect a wallet for “earnings”

---

## 11. Related

| Doc | Role |
| --- | --- |
| [ACTIVATION_STATUS.md](./ACTIVATION_STATUS.md) | One-screen commercial posture |
| [ACTIVATION_ROADMAP.md](./ACTIVATION_ROADMAP.md) | Ordered unlock conditions |
| [SECURITY_BOUNDARIES_V1.md](./SECURITY_BOUNDARIES_V1.md) | Forbidden / gated matrix |
| [CONTRACT_REGISTRY_V1.md](./CONTRACT_REGISTRY_V1.md) | Addresses + digests |
| [community/VERIFICATION_PORTAL_V1.md](./community/VERIFICATION_PORTAL_V1.md) | Public verify surface |
| [community/verification-reports/INDEX_V1.md](./community/verification-reports/INDEX_V1.md) | Report ledger (\(n\), \(m\)) |
| [activation/liquidity/UNSIGNED_LIQUIDITY_PREP_V1.md](./activation/liquidity/UNSIGNED_LIQUIDITY_PREP_V1.md) | Liquidity prep (no sign) |
| [activation/command/REVENUE_EXPEDITION_30D_V1.md](./activation/command/REVENUE_EXPEDITION_30D_V1.md) | Near-term **services** cash options |
| [valuation/QPF_FMV_BASELINE_MEMO_V1.md](./valuation/QPF_FMV_BASELINE_MEMO_V1.md) | Internal baseline — not earnings |
| [security/SECRET_ROTATION_WORKSHEET_V1.md](./security/SECRET_ROTATION_WORKSHEET_V1.md) | Outreach freeze cause |

---

## 12. Refresh rule

Update this file when any of the following change:

- Phase 8.5 \(n\) / consensus status  
- Phase 8.6 / 8.7 / 9.0 completion  
- Any economic GO receipt sealed  
- Pair reserves leave zero (still does **not** alone mean “earnings product live”)  
- Yield fee-routing stack claimed live with verification evidence  
- Secret-rotation unfreeze checklist all true  

---

*Distance map only. Economic activation remains separately gated. Restraint remains intentional.*
