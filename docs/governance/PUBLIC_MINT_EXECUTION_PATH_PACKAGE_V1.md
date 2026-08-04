# Public Mint Execution-Path Package v1

**Status:** `NO_GO_WITH_DEFINED_ACTIVATION_CHECKLIST`  
**Mode:** preparation only — no signing, broadcast, wallet prompt, or on-chain action  
**Created:** 2026-08-04  
**Baseline HEAD (when drafted):** `38246c3` (`fix(ledger): update cryptography security patch (#712)`)  
**Namespace:** `qpf.execution.public-mint.path-package.v1`  
**Does not supersede:** `receipts/governance/execution-preflight-reconciliation-v1.json` (still NO-GO until human GO)

---

## 0. Purpose

Convert:

> NO-GO because unresolved

into:

> NO-GO with a defined, reviewable activation checklist

This package is the operator-facing index over sealed path-spec and governance receipts. It does **not** authorize execution.

---

## 1. Current posture (operational)

| Layer | State | Evidence |
| --- | --- | --- |
| Repository | READY | `main` clean with origin after #712 |
| Evidence | SEALED / reproducible | `npm run verify:evidence` → PASS (2026-08-04 local) |
| Build | PASS | `npm run build` → `out/` generated (2026-08-04 local) |
| Path design | IDENTIFIED (review-only) | `public-mint-execution-path-spec-v1.json`, phase-29 completion |
| Live execution script | **MISSING** (`null`) | path review harness |
| Public mint UI | Disabled | `mint.html`, `mint-status.html` |
| Wallet prompt | Not authorized | `human-wallet-prompt-inspection-v1` |
| Signing / broadcast | **false** | execution-preflight reconciliation |
| Liquidity / staking / bridge | **false** | same + public-ready gates |
| Overall | **NO-GO** | until checklist complete + separate human GO receipt |

### Local baseline recorded 2026-08-04

```bash
npm run verify:evidence   # PASS — 5-step evidence bundle
npm run build             # PASS — Cloudflare Pages static out/
npm run governance:public-mint-execution-path-review:v1:check   # PASS — review_only; LIVE_EXECUTION_SCRIPT null
npm run governance:human-wallet-prompt-inspection:v1:check      # PASS — inspection only; HUMAN_APPROVAL_AUTHORIZED false
```

---

## 2. Exact intended path (from sealed path-spec)

**Source of truth:** `receipts/governance/public-mint-execution-path-spec-v1.json`  
**Review harness:** `scripts/review/public-mint-execution-path-review-v1.cjs`  
**Live script:** `null` ← primary technical gap for “complete executable path”

### Network

| Field | Value |
| --- | --- |
| Network | 0G Aristotle Mainnet |
| Chain ID | **16661** |

### Contracts

| Role | Address | Source |
| --- | --- | --- |
| OINIO token | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` | `contracts/src/OINIOToken.sol` |
| Model registry (mint surface) | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` | `contracts/src/OINIOModelRegistry.sol` |

### Sequence (exactly two user txs)

1. **`approve`** on OINIO token  
   - spender: registry `0x67aD…E87a`  
   - amount: `1000000000000000000` (1 OINIO)  
   - native value: `0`

2. **`registerModel`** on registry  
   - `name`: non-empty user string  
   - `metadataURI`: non-empty user string  
   - `stakeAmount`: `1000000000000000000`  
   - native value: `0`

### Allowed wallet prompts (if ever authorized)

1. Approve OINIO spending for registry (1 OINIO)  
2. Register model (`registerModel`)

### Forbidden prompts / actions

- seed phrase / private key  
- manual fund transfer requests  
- liquidity add, staking, bridge, yield routing, treasury movement  
- any third transaction not in the sequence above  
- native value &gt; 0

### Success signals

- `ModelRegistered` event  
- ERC721 minted to caller  
- OINIO stake transferred to registry  
- Execution receipt written (template only today): `receipts/execution/public-mint-execution-v1.json`

### Precedent (historical; not a live GO)

- `receipts/execution/first-controlled-mint-verification-v1.json` — controlled proof only

---

## 3. Activation checklist (GO prerequisites)

All boxes must be true **before** a superseding human execution receipt is considered. None of these boxes authorize signing by themselves.

### A. Repository & evidence

- [x] `npm run verify:evidence` passes on current HEAD  
- [x] `npm run build` passes on current HEAD  
- [x] Public pages still show mint **Disabled** until GO  
- [x] Path review harness passes (`governance:public-mint-execution-path-review:v1:check`)  
- [x] Wallet-prompt inspection passes with `HUMAN_APPROVAL_AUTHORIZED false` (until deliberate unlock)

### B. Complete executable path (still open)

- [ ] **Live execution script exists** (path-spec field currently `null`)  
  - Review-only harness is not sufficient  
  - Script must encode exact chain, contracts, selectors, args, value=0, gas policy, abort matrix  
- [ ] Dry-run / preview mode that **cannot** broadcast  
- [ ] Receipt generator wired to `receipts/execution/public-mint-execution-v1.json` (or successor)  
- [ ] Abort conditions **wired** (hard fail), not only documented  
- [ ] Explicit non-goals asserted in script header: no LP, stake product, bridge, treasury, seed/key prompts

### C. Operator readiness

- [ ] Operator wallet identified (EOA or Safe) with documented role  
- [ ] Wallet holds ≥ 1 OINIO + gas on chain 16661 (amount checked read-only; no transfer here)  
- [ ] RPC endpoint documented for read + future send (no keys in repo)  
- [ ] Chain ID verified at runtime before any tx  
- [ ] Contract bytecode / identity re-checked via existing live-RPC correspondence evidence lane

### D. Policy & public surface

- [ ] Public mint policy intentionally flipped only by governance receipt (`mint_allowed` / open receipt)  
- [ ] `mint.html` / `mint-status.html` updated to match that receipt (no silent enable)  
- [ ] No automatic wallet connect on page load  
- [ ] No third-party script that can inject alternate calldata

### E. Human gates (separate receipts — never auto)

- [ ] Review of this package + live script by human operator  
- [ ] **Explicit signing approval** for the **exact** two-tx sequence (not a blanket “activate”)  
- [ ] **Explicit broadcast approval** (can be same receipt only if both are named)  
- [ ] Superseding governance receipt that replaces `EXECUTION_PREFLIGHT_RECONCILED_NO_GO` without rewriting history

### F. Out-of-scope until separate GOs (must remain false)

- [ ] Liquidity provision — **NO**  
- [ ] Staking product activation — **NO**  
- [ ] Bridge / yield routing — **NO**  
- [ ] Treasury movement — **NO**  
- [ ] Bulk / public open mint campaign beyond single controlled path — **NO** unless policy says otherwise

---

## 4. Abort conditions (hard stop)

From path-spec; any one → abort and do not sign/broadcast:

1. chainId ≠ 16661  
2. registry ≠ `0x67aD7169184581f23D1E10B39d4eb4e98293E87a`  
3. token ≠ `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58`  
4. function sequence ≠ `approve` then `registerModel`  
5. stakeAmount ≠ `1e18` unless policy receipt updates it  
6. empty `name` or `metadataURI`  
7. native value &gt; 0  
8. prompt for seed / private key  
9. prompt includes LP / stake / bridge / yield / treasury  
10. human final signing approval missing  
11. public mint policy still `mint_allowed=false`  
12. (package addition) live script absent or hash does not match reviewed artifact  

---

## 5. Rollback / containment plan

If anything starts and must stop:

| Scenario | Action |
| --- | --- |
| Pre-sign abort | Stop; write failure note under `receipts/execution/`; leave public mint disabled |
| Approve mined, registerModel not sent | Do **not** increase allowance further; document allowance state; optional later `approve(0)` only with separate human GO |
| Both txs mined, wrong metadata | Treat as on-chain fact; no silent remint; open post-incident receipt |
| Unexpected third prompt | Abort session; revoke browser wallet permissions; incident receipt |
| Public surface accidentally shows “open” | Redeploy static site from last known disabled build; verify mint-status |
| Key/custody concern | Rotate / Safe threshold review offline; freeze execution lane |

No automated rollback of chain state is assumed. Containment is **stop signing** + **public surface restore** + **receipt**.

---

## 6. What still makes this NO-GO (honest gap list)

| Gap | Severity | Notes |
| --- | --- | --- |
| `live_execution_script == null` | **Blocker** | Spec + review harness exist; executable path incomplete |
| Abort conditions not wired in a live harness | **Blocker** | Documented only |
| No superseding human GO for exact live path | **Blocker** | Required by execution-preflight reconciliation |
| Independent multi-report verification (trust 8.5) | High for public open | Not required for single supervised dry-run design, required before broad public claims |
| Liquidity / market activation | Out of scope | Separate GO forever |

---

## 7. Recommended next build steps (still no wallet)

1. **Implement** a single reviewable live script skeleton under something like `scripts/execution/public-mint-live-v1.cjs` with:  
   - default mode `dry-run`  
   - hard require `--i-understand-broadcast` **and** env/file GO token for send mode  
   - assert chain, addresses, selectors, value=0  
   - never request seed/key  
2. Wire abort checks and receipt write path.  
3. Add `npm run governance:public-mint-live:v1:dry-run` (send mode omitted or dead-code gated).  
4. Update path-spec field `live_execution_script` via new receipt (do not rewrite history).  
5. Re-run evidence + build.  
6. **Stop** and request human GO language for the exact command.

Do **not** enable mint.html wallet integration until (1)–(6) and human GO exist.

---

## 8. Authority boundary (always)

```
Autonomous OK:  verify, build, draft docs/scripts in dry-run, open review PRs
Requires human: merge if policy demands, any wallet prompt, signing, broadcast,
                mint policy flip, liquidity, staking, bridge, treasury, keys
```

This package is **not** a GO.  
Current sealed reconciliation remains: **`EXECUTION_PREFLIGHT_RECONCILED_NO_GO`**.

---

## 9. Source index

| Artifact | Role |
| --- | --- |
| `receipts/governance/public-mint-execution-path-spec-v1.json` | Exact path |
| `receipts/governance/phase-27-public-mint-execution-script-review-findings-v1.json` | Incomplete-path finding |
| `receipts/governance/phase-28-final-public-mint-execution-decision-gate-v1.json` | NO-GO decision |
| `receipts/governance/phase-29-public-mint-execution-path-completion-v1.json` | Path identified for review |
| `receipts/governance/execution-preflight-reconciliation-v1.json` | Current NO-GO posture |
| `receipts/governance/public-ready-phase-18-evidence-review-v1.json` | Public activation gated |
| `receipts/execution/first-controlled-mint-verification-v1.json` | Historical controlled proof |
| `scripts/review/public-mint-execution-path-review-v1.cjs` | Review harness |
| `mint.html` / `mint-status.html` | Public disabled surface |

---

## 10. One-line summary

**NO-GO:** evidence and build are healthy; the mint path is fully *specified* and *reviewable*, but there is still no live execution script, no wired abort harness for send mode, and no explicit human GO for the exact two-transaction sequence — and liquidity/bridge/staking remain separately locked.
