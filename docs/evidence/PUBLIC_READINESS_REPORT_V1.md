# QPF Public Readiness Report V1

**Phase:** 8.1 — Public Readiness Evidence Consolidation  
**Scope:** Documentation + verification only  
**Created:** 2026-07-28T17:35:00.026Z  
**Repo HEAD at authoring:** `1d6c7ae`  
**Mode:** EVIDENCE_ONLY — no mint enablement, liquidity, distribution, signer changes, governance execution, or contract upgrades  

---

## Purpose

Convert unfinished-looking public items into **intentional state markers**.

| Unfinished-looking | Intentional public truth |
|--------------------|---------------------------|
| “Mint isn’t live” | Mint remains **disabled** pending governance criteria (NO-GO). |
| “No liquidity” | Technical DEX readiness exists; **liquidity has not been authorized**. |
| “Signing off” | Site and policy keep signing/broadcast **disabled** except gated human paths. |

This report strengthens QPF’s verifiability advantage: anyone can inspect what exists, what is disabled, why, and what unlocks activation.

---

## 1. Deployment Reality

### Network

| Field | Value |
|-------|--------|
| Network | 0G Aristotle Mainnet |
| Chain ID | `16661` (`0x4115`) — RPC `eth_chainId` confirmed |
| RPC | `https://evmrpc.0g.ai` |
| Explorer | `https://chainscan.0g.ai` |
| Native currency | 0G |

### Deployed contracts (public registry + live `eth_getCode` probe)

Probe: `POST https://evmrpc.0g.ai` · `eth_getCode(address, "latest")` · 2026-07-28T17:34Z UTC  

| Contract | Address | Public status page | Live bytecode |
|----------|---------|--------------------|---------------|
| OINIO Token | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` | Live | HAS_CODE |
| OINIO Model Registry | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` | Live | HAS_CODE |
| Heartbeat Monitor | `0x5E50b92E57e854659f7D98c733088aABd551C49F` | Live | HAS_CODE |
| ForgeRegistry | `0x6011c341a01c80f489a5c3Ab751987A55142F04e` | Live | HAS_CODE |
| DEX Factory | `0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8` | Live | HAS_CODE |
| DEX Router | `0x2c70129E50BF88eCD59b89d63af2e8920aCF3951` | Live | HAS_CODE |
| DEX Pair (W0G/USDC.e) | `0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE` | Empty pool | HAS_CODE |
| Safe Guardian | `0x8d088B88219D072aB035502065ee2410c2cb4389` | Live | HAS_CODE |

Secondary listed ERC20 (status page): `0x709f23C7A7172E137427576abB5Eb8959E2A57c1` — published as live; not re-probed in this consolidation pass beyond registry focus set.

### Deployment / ceremony references (from public status + sealed docs)

| Reference | Value |
|-----------|--------|
| Public status surface | https://quantumpiforge.com/deployed-addresses |
| Birth / ForgeRegistry ceremony (status page) | Birth Ceremony Transaction (ForgeRegistry genesis) |
| DEX CreatePair tx | `0x4f887876313a5085337ce22eac9418725558a91225096191057dd6d7d2e2f6a2` |
| DEX CreatePair block | `36238884` |
| Pair seal doc | `docs/deployments/0g-dex-first-pair-final-state-seal-v1.md` |

### Pair reserve probe (empty pool)

`eth_call` `getReserves()` on pair `0x2067319D…AaeE` returned all-zero reserves encoding (reserve0 = 0, reserve1 = 0).  

**Interpretation:** pair **exists**; **liquidity has not been seeded**. This is readiness without commercial liquidity activation.

---

## 2. Current Activation State

| Layer | State | Meaning |
|-------|--------|---------|
| **Technical activation** | **COMPLETE** (core contracts live on chain 16661) | Code is deployed; explorers resolve addresses |
| **Commercial activation** | **NOT ACTIVE** | Public mint closed; liquidity not authorized; yield gated |
| **Website / public surfaces** | **LIVE** | https://quantumpiforge.com (contracts page, mint surfaces) |
| **Edge / static site** | Present in repo deploy pipeline | Cloudflare Pages build path; not a chain activation |

### Mint / signing posture (sealed receipts)

| Artifact | State |
|----------|--------|
| Public mint policy | `DEFINED_NO_ACTIVATION` · `mint_allowed=false` · `public_mint_active=false` |
| Path spec | `REVIEW_ONLY_NOT_EXECUTABLE` |
| Phase 33 | `NO_GO_PUBLIC_MINT_EXECUTION_NOT_AUTHORIZED` |
| Phase 19 final review seal | `SEALED_REVIEW_NO_GO` · `DO_NOT_EXECUTE_PUBLIC_MINT` |
| Dry-run preview | `dry_run_non_broadcast_preview_only` · `live_execution_script=null` |
| Wallet signing preflight unlock (#606 class) | `wallet_signing_allowed=true` for **inspection only**; `broadcast_allowed=false`; `public_mint_open_allowed=false` |
| Site mint UI | Public Mint **Disabled** (`mint.html` / `mint-status.html`) |
| Status page | Wallet signing / staking / minting / broadcast **disabled on this page** |

### Controlled mint evidence (precedent, not public open)

| Artifact | State |
|----------|--------|
| `receipts/execution/first-controlled-mint-verification-v1.json` | `CONTROLLED_MINT_VERIFIED` |

Controlled mint verification is **historical/governance evidence**. It does **not** open public minting.

---

## 3. Safety Gates

| Gate | Status | Evidence |
|------|--------|----------|
| Public mint | **DISABLED / GOVERNANCE GATED** | Policy final; Phase 33 NO-GO; Phase 19 NO-GO review; mint UI disabled |
| Liquidity | **NOT DEPLOYED / NOT AUTHORIZED** | Empty pool reserves; status “no liquidity seeded”; no liquidity activation receipt |
| Staking | **GATED** | Status page + guardian gates NOT_AUTHORIZED |
| Bridge | **GATED** | Guardian gates NOT_AUTHORIZED |
| Treasury / yield | **GATED** | Status: proposed or gated; guardian NOT_AUTHORIZED |
| Site wallet actions | **DISABLED** | deployed-addresses wallet safety notice |
| Admin / owner publication | **Owners private** | Status page: owner addresses never published |
| Emergency / pause | **Documented as future/gated** | Threshold gate pending final governance decision; path abort conditions include wrong chain/contracts |

### Immutability / admin assumptions (evidence-only)

- This report **does not** claim every contract is non-upgradeable without per-contract bytecode analysis beyond `eth_getCode` presence.
- Public claim: **no production mint/liquidity/yield/broadcast is authorized by this report.**
- Hidden admin controls: **must not be assumed absent** without deeper audit; public policy currently **disables** commercial actions pending explicit receipts.

---

## 4. Safe Governance Evidence

| Field | Value |
|-------|--------|
| Safe Guardian address | `0x8d088B88219D072aB035502065ee2410c2cb4389` |
| Live bytecode | HAS_CODE (probe 2026-07-28) |
| Reconciliation receipt | `receipts/governance/guardian-authority-reconciliation-v1.json` |
| Reconciliation status | `GUARDIAN_AUTHORITY_RECONCILED` |
| Gates from reconciliation | mint, staking, liquidity, bridge, treasury, yield, agent_authority = **NOT_AUTHORIZED_BY_THIS_RECEIPT** |
| Assertions | read_only, no_wallet_action, no_signing, no_broadcast, no_private_key/seed |

### Owners / threshold

Public status page: **owner addresses remain private.**  

This Phase 8.1 consolidation **does not** invent or publish Safe owners or threshold values.  

**Future deliverable (Phase 8.x / QPF-SAFE-GOVERNANCE-V1):** publish operational policy for recovery without over-exposing operators, once human operators authorize disclosure scope.

### Recovery model (as currently documented)

- Social recovery: **created, not production-authorized** (status page).  
- Threshold gate: **pending final governance decision** (status page).  
- Guardian reconciliation does **not** authorize financial gates.

---

## 5. Feature Matrix

| Feature | Status | Evidence |
|---------|--------|----------|
| Core contracts | **Live** | RPC `eth_getCode` HAS_CODE; https://quantumpiforge.com/deployed-addresses |
| Website / contracts page | **Live** | HTTP 200 public surfaces |
| Public mint UI | **Disabled** | mint.html / mint-status.html; policy mint_allowed=false |
| Controlled mint (historical) | **Verified (gated)** | `first-controlled-mint-verification-v1` CONTROLLED_MINT_VERIFIED |
| Public mint open | **NO-GO** | Phase 33 NO-GO; Phase 19 SEALED_REVIEW_NO_GO |
| DEX factory/router | **Live** | Deployed + bytecode present |
| DEX pair W0G/USDC.e | **Prepared (empty)** | CreatePair sealed; reserves zero |
| Liquidity | **Pending authorization** | Empty pool; commercial event not authorized |
| Staking | **Gated** | Status + guardian gates |
| Bridge | **Gated** | Guardian gates |
| Yield / earnings | **Pending / gated** | Status page; future activation |
| Safe guardian | **Live address** | Bytecode + reconciliation receipt |
| Social recovery | **Not production-authorized** | Status page |
| Threshold gate | **Pending decision** | Status page |
| Wallet preflight (non-executing) | **PASS available** | wallet-preflight-verifier posture non_executing |
| Broadcast / live execute scripts | **Blocked by policy & NO-GO** | broadcast_allowed=false; live_execution_script=null |

---

## 6. Activation Conditions

What must be true **before** each step (summary; separate gates required — this report does not unlock them):

### Controlled mint (path B)

- Explicit named-action human authorization  
- Final reviewed parameters (name, metadataURI, stake, addresses, chain 16661)  
- Wallet/Safe readiness without seed/private-key prompts  
- Command/path not REVIEW_ONLY_NOT_EXECUTABLE for that named action  
- Still **not** public mint open  

### Public mint opening (path A)

- Controlled mint path understood and constraints published  
- Policy decision receipt flipping `mint_allowed` / `public_mint_active` only after explicit human YES  
- Phase 33-class GO for **exact** public mint only (not general autonomy)  
- Live gas/RPC preview if required by gate chain  
- Final signing authorization + command hash  
- Broadcast still separate from signing  

### Liquidity (path F — commercial)

- DEX contracts verified (done technically)  
- Pair exists (done)  
- Router tested / readiness sealed  
- **Liquidity authorization receipt**  
- Funding arrives  
- Liquidity event as **commercial** activation (not a technical checkbox)  

### Yield

Only after security, governance, mint controls, and liquidity maturity — separate lane.

---

## 7. Out of scope (explicit non-actions of Phase 8.1)

This consolidation **did not**:

- enable mint  
- deploy or seed liquidity  
- distribute tokens  
- change signers or Safe owners  
- execute governance Safe transactions  
- upgrade contracts  
- sign or broadcast any transaction  
- access private keys or seed phrases  

---

## 8. Source index

| Source | Role |
|--------|------|
| https://quantumpiforge.com/deployed-addresses | Public feature matrix / addresses |
| `deploy/deployed-addresses.html` | Repo static source for status page |
| `receipts/governance/public-mint-policy-final-v1.json` | Mint policy DEFINED_NO_ACTIVATION |
| `receipts/governance/phase-33-public-mint-execution-no-go-v1.json` | Execution NO-GO |
| `receipts/governance/phase-19-final-public-mint-decision-review-no-go-v1.json` | Phase 19 review seal |
| `receipts/governance/public-mint-execution-path-spec-v1.json` | REVIEW_ONLY_NOT_EXECUTABLE |
| `receipts/governance/public-mint-dry-run-execution-preview-v1.json` | Non-broadcast preview |
| `receipts/governance/public-mint-final-reviewed-values-v1.json` | Final reviewed mint values |
| `receipts/governance/guardian-authority-reconciliation-v1.json` | Safe address + gate denials |
| `receipts/execution/first-controlled-mint-verification-v1.json` | Controlled mint verified |
| `docs/deployments/0g-dex-first-pair-final-state-seal-v1.md` | Pair create seal |
| `receipts/security/wallet-preflight-verifier-v1.json` | Non-executing wallet preflight posture |
| Live RPC `https://evmrpc.0g.ai` | chainId + eth_getCode + getReserves |

---

## 9. Final statement

```text
TECHNICAL_ACTIVATION=COMPLETE
COMMERCIAL_ACTIVATION=NOT_ACTIVE
PUBLIC_MINT=DISABLED_GOVERNANCE_GATED
LIQUIDITY=NOT_AUTHORIZED_POOL_EMPTY
SAFE_GUARDIAN=LIVE_ADDRESS_GATES_CLOSED
PHASE_8_1=EVIDENCE_CONSOLIDATION_ONLY
NO_SIGNING
NO_BROADCAST
NO_ACTIVATION_CHANGE
```

**Milestone:** Anyone can inspect this report + linked receipts and understand exactly what exists, what is disabled, why it is disabled, and what conditions unlock later activation.

---

*End of PUBLIC_READINESS_REPORT_V1 — Phase 8.1*
