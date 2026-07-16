# Public Surface Claim Audit v1

**Date:** 2026-07-16  
**Standard:** [`VERIFICATION_STATUS_TABLE_V1.md`](./VERIFICATION_STATUS_TABLE_V1.md)  
**Goal:** Ensure every public-facing statement is backed by code, deployment receipts, or on-chain evidence — or is explicitly labeled Gated / Experimental / Planned.

## Audit method

For each surface:

1. Extract claims that sound operational (“live”, “mainnet”, “mint”, “bridge”, “users”, “immutable”).
2. Map each claim to a status-table ID.
3. Mark **Pass**, **Qualify**, or **Fail**.
4. Recommend a fix without inventing new operational facts.

## Surfaces reviewed

| Surface | Path(s) | Overall |
| --- | --- | --- |
| Human Doorway (source) | `app/what-it-does/page.tsx` | **Pass** (restrained; design/process language) |
| Human Doorway (static out) | `out/what-it-does.html` | **Qualify / Fail risk** — stronger mainnet language than source |
| Recovery what-it-does | `what-it-does.html` | **Pass** (disabled boundary clear) |
| Frontend dashboard meta | `frontend/index.html` | **Pass** (title only) |
| Pi example UI | `frontend/example.html` | **Qualify** — Experimental Pi connect UX |
| Production dashboard HTML | `frontend/production_dashboard.html` | **Fail risk** — “MAINNET”, Pi mainnet product language |
| README public validation | `README.md` | **Qualify** — genesis activation language vs parked STATUS |
| Public validation status | `docs/governance/PUBLIC_VALIDATION_STATUS_V1.md` | **Qualify** — project receipts; addresses not in DEPLOYED_ADDRESSES |
| STATUS | `STATUS.md` | **Pass** for parked/non-executing posture |
| Deployed addresses | `contracts/DEPLOYED_ADDRESSES.md` | **Pass** (honest Pending) |
| Claim matrix | `docs/review/CLAIM_TO_PROOF_MATRIX.md` | **Pass** |
| Outreach kit | `docs/valuation/QPF_GRANT_PARTNER_OUTREACH_KIT_V1.md` | **Pass** after language lock (see kit) |

## Detailed findings

### 1. `app/what-it-does/page.tsx` — Pass

| Claim | Status mapping | Result |
| --- | --- | --- |
| “public proof engine for digital launches” | Design / V-01–V-03 | Pass |
| “what is locked… before anything goes live” | V-05 | Pass |
| No yield/mint/bridge superlatives | — | Pass |

**Action:** Prefer this source as the public plain-language canon. Link status table from footer/reviewer strip when next deploying.

### 2. `out/what-it-does.html` — Qualify / Fail risk

| Claim | Status mapping | Result |
| --- | --- | --- |
| “Quantum Pi Forge is now live on 0G Aristotle Mainnet.” | G-01 (not Verified on-chain via DEPLOYED_ADDRESSES) | **Fail risk** — overstates SSOT |
| Lists token/registry/heartbeat addresses + birth block | G-01; independent verification required | **Qualify** — project-recorded; matrix Pending |
| Execution receipt path present | V-03 | Pass as artifact reference |

**Recommended rewrite (defensible):**

> Project records document a genesis activation attempt on 0G Aristotle (chain ID 16661) with sealed local execution receipts. Canonical public addresses remain **Pending** in `contracts/DEPLOYED_ADDRESSES.md` until independently re-verified. Liquidity, staking, mint opening, and bridge activation remain gated.

**Action:** Reconcile `out/` static build with `app/what-it-does` source, or regenerate `out/` from the restrained source after address matrix is filled.

### 3. `frontend/production_dashboard.html` — Fail risk

| Claim / UI | Status mapping | Result |
| --- | --- | --- |
| Live “MAINNET” indicator | Implies operational network | Fail risk unless tied to verified chain and disabled economic banner |
| “ethical Web3 applications on Pi Network Mainnet” | P-02 / E-04 | Fail risk — sounds like live Pi product |
| Pi Network RPC wiring | E-04 | Experimental only |

**Recommended posture:**

- Label page **Experimental / demo**
- Replace “MAINNET” pulse with “READ-ONLY / GATED” unless Verified
- State explicitly: no official Pi Core Team bridge claim

### 4. `frontend/example.html` — Qualify

Pi Network connect button is acceptable as **Experimental** demo if labeled “demo / not production bridge”.

### 5. README vs STATUS tension — Qualify

| Surface | Says | Mapping |
| --- | --- | --- |
| `STATUS.md` | Parked. Locally auditable. Non-executing. | V-05 / process |
| `README.md` Public Validation | Verified genesis activation on Aristotle; economic flows blocked | G-01 + V-05 |

**Action:** Keep both, but cross-link the status table so readers see: **parked economic execution** + **project genesis receipts** without reading them as “full network live”.

### 6. Address conflict discipline — Fail if marketed

| Source | OINIO / birth references may differ |
| --- | --- |
| Public validation / `out/what-it-does.html` | e.g. `0x75995…` / block `36214213` |
| Skill / other inventories | alternate addresses/blocks may appear historically |
| `contracts/DEPLOYED_ADDRESSES.md` | **Pending** |

**Rule:** Public marketing must not assert a single “the” live address until DEPLOYED_ADDRESSES is complete and consistent.

## Forbidden phrases scan (this audit pass)

Search across `docs/public`, `docs/valuation`, `frontend`, root README/STATUS for:

- strongest governance…
- post-quantum first / fully sealed PQ
- 47M Pi
- immutable forever / no owner key / no admin backdoors

**Result (targeted scan, 2026-07-16):** No hits in those primary surfaces for the worst comparative/PQ/47M phrases. Residual risk is **“live mainnet”** wording in static HTML and dashboard demos, not the superlative set.

## Public site checklist (before every deploy)

- [ ] Hero text is the defensible description or Verified-only claims
- [ ] Any “live” / “mainnet” line maps to **Verified** row with proof link
- [ ] Economic features labeled **Implemented but gated** if code exists but inactive
- [ ] Pi interoperability labeled **Planned** or **Experimental** only
- [ ] Footer/reviewer link to `REVIEWER_START_HERE.md` + status table
- [ ] `contracts/DEPLOYED_ADDRESSES.md` matches any addresses shown on the site
- [ ] No comparative superlatives
- [ ] No user-population access claims
- [ ] No absolute immutability claims without bytecode proofs

## Priority remediation order

1. **High:** Soften or qualify `out/what-it-does.html` “now live on 0G Aristotle Mainnet” language; align with DEPLOYED_ADDRESSES Pending.
2. **High:** Label `frontend/production_dashboard.html` experimental; remove misleading MAINNET live pulse for production viewers.
3. **Medium:** Fill `contracts/DEPLOYED_ADDRESSES.md` from receipts + independent RPC/`eth_getCode` checks (or keep Pending and stop quoting addresses publicly).
4. **Medium:** Add visible site link to status table + claim matrix.
5. **Low:** Sync static `out/` with `app/what-it-does` so source and deploy artifact cannot diverge.

## Non-authorization

This audit does not authorize deploy, broadcast, mint, stake, bridge, liquidity, or wallet actions. It only classifies language risk.
