# Unsigned Liquidity Preparation v1

**Status:** PREP ONLY — no private keys, no signing, no broadcast  
**Network:** 0G Aristotle Mainnet (`chainId` **16661**, hex `0x4115`)  
**RPC:** `https://evmrpc.0g.ai`  
**Generated:** 2026-07-21T22:05:00Z (read-only probes)  
**Human control:** Exact seed amounts remain unset until you fill them.

---

## 1. Boundary (non-negotiable)

| Action | This document |
| --- | --- |
| Draft calldata / sequence | Yes |
| Fill exact human amounts | Placeholders only |
| Sign | **No** |
| Broadcast | **No** |
| Approvals / transfers | **No** |

Execution requires a **separate** human authorization receipt with exact amounts + Safe multi-sig (2/2 or 3/4).

---

## 2. Canonical DEX topology (on-chain verified)

| Role | Address | Live check |
| --- | --- | --- |
| Factory | `0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8` | Has code; router.factory() matches |
| Router | `0x2c70129E50BF88eCD59b89d63af2e8920aCF3951` | Has code; `WETH()` = W0G |
| W0G | `0xD1De4F87C8b195f21254b7163dDA9370D8Df593d` | symbol W0G, 18 decimals |
| USDC.e | `0x1f3AA82227281cA364bFb3d253B0f1af1Da6473E` | Bridged USDC, 6 decimals |
| **Pair (W0G / USDC.e)** | `0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE` | factory.getPair matches; reserves **0/0** |
| OINIO (skill / birth) | `0x6011c341a01c80f489a5c3Ab751987A55142F04e` | OINIO, 18 |
| OINIO Token (site label) | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` | ERC20 "OINIO Token" |

### Critical correction vs marketing site

Homepage / `deployed-addresses.html` label:

- **“DEX Pair (OINIO/0G)” → `0x709f23C7A7172E137427576abB5Eb8959E2A57c1`**

On-chain that address is **ERC20 OINIO Token** (`name()` / `symbol()`), **not** a UniswapV2 pair (`token0` / `getReserves` revert).  
`factory.getPair(OINIO, W0G)` and `getPair(siteOINIO, W0G)` both return **zero address**.

**Do not seed liquidity against `0x709f…` as a pair.**  
Canonical empty pool for V2 seed is **W0G/USDC.e** at `0x206731…` (already created, zero reserves).  
If the intended product pool is **OINIO/W0G**, a **new** `createPair` is required first (separate unsigned step).

---

## 3. Wallet posture (balances at probe time)

| Address | Role | Native 0G | W0G | USDC.e | OINIO (0x6011) |
| --- | --- | --- | --- | --- | --- |
| `0x353663…e4cd` | Control / deployer path | **0** | 0 | 0 | 0 |
| `0x335651…F4DC` | Legacy CREATEPAIR_FROM (untrusted hygiene) | ~3.09 | **0.05** | 0 | 0 |
| `0xf50F…dBd1` Safe | Operator **2/2** | ~2.99 | 0 | 0 | 0 |
| `0xF69b…08DE` Safe | Trezor path **2/2** | ~2.82 | 0 | 0 | 0 |
| `0x8d08…4389` Safe | Guardian **3/4** | ~1.00 | 0 | 0 | 0 |

**Implications:**

1. **No funded LP inventory** (W0G+USDC.e) on recommended Safes.  
2. Control EOA `0x353663…` has **zero gas** — cannot submit txs until funded.  
3. Prefer LP actor = **`0xf50F…` or `0x8d08…` Safe**, not `0x335651…`.  
4. Approval hash generation remains blocked until **exact non-zero amounts** are chosen and funded (existing receipt posture).

---

## 4. Recommended seed path (unsigned sequence)

Assume product decision: **seed W0G/USDC.e** on existing pair `0x206731…` via Router.

### Human fills (before any hash / sign)

```text
AMOUNTW0G     = <HUMAN>   # e.g. 1.0 W0G  → 1e18 wei
amountUSDCe   = <HUMAN>   # e.g. 2.0 USDC → 2000000 (6 decimals)
amountAMin    = <HUMAN>   # slippage floor
amountBMin    = <HUMAN>
deadline      = <HUMAN>   # unix seconds
lpRecipient   = <HUMAN>   # prefer 0xf50F… or 0x8d08… Safe
lpActor       = <HUMAN>   # Safe that holds balances + signs
```

### Step 0 — Fund (off-prep / human)

| Need | Notes |
| --- | --- |
| Native 0G for gas | On **lpActor** (Safe needs gas for execTransaction or use Relay later) |
| W0G | Wrap native via `W0G.deposit()` or transfer W0G to lpActor |
| USDC.e | Bridge / acquire; transfer to lpActor |

### Step 1 — Approvals (unsigned templates)

```text
// ERC20.approve(router, amount)
to:   W0G
data: approve(0x2c70129E50BF88eCD59b89d63af2e8920aCF3951, amountW0G)

to:   USDC.e
data: approve(0x2c70129E50BF88eCD59b89d63af2e8920aCF3951, amountUSDCe)
```

Generate **command hash only after** amounts are fixed (do not hash zeros).

### Step 2 — addLiquidity (unsigned template)

UniswapV2Router02:

```text
addLiquidity(
  tokenA:  W0G  0xD1De4F87C8b195f21254b7163dDA9370D8Df593d,
  tokenB:  USDC.e 0x1f3AA82227281cA364bFb3d253B0f1af1Da6473E,
  amountADesired: amountW0G,
  amountBDesired: amountUSDCe,
  amountAMin: amountAMin,
  amountBMin: amountBMin,
  to: lpRecipient,
  deadline: deadline
)
```

Router: `0x2c70129E50BF88eCD59b89d63af2e8920aCF3951`

### Step 3 — Safe packaging (when actor is Safe)

Build Safe transaction(s) with Protocol Kit / Safe UI:

1. Optional batch: approve W0G + approve USDC.e + addLiquidity  
2. Threshold: **2/2** (`0xf50F…`) or **3/4** (`0x8d08…`)  
3. Confirm on hardware for each required owner  
4. Execute only after dual (or 3) signatures  

### Optional alternate: OINIO/W0G pool

If product requires OINIO/W0G:

1. Decide **which OINIO** (`0x6011…` vs `0x75995…`) — site inconsistency.  
2. `factory.createPair(oinio, W0G)` (unsigned; separate auth).  
3. Then same approve + addLiquidity flow.  
4. Update website pair address **after** pair exists and is verified.

---

## 5. Cast verification commands (read-only)

```bash
RPC=https://evmrpc.0g.ai
PAIR=0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE
ROUTER=0x2c70129E50BF88eCD59b89d63af2e8920aCF3951

cast call $PAIR "getReserves()(uint112,uint112,uint32)" --rpc-url $RPC
cast call $PAIR "totalSupply()(uint256)" --rpc-url $RPC
cast call $ROUTER "factory()(address)" --rpc-url $RPC
```

After a real seed (human-executed), reserves and totalSupply must leave zero.

---

## 6. Pre-execution checklist

- [ ] Product pair chosen: W0G/USDC.e **or** OINIO/W0G  
- [ ] Site `0x709f…` mislabel acknowledged  
- [ ] Exact amounts filled by human  
- [ ] lpActor is multi-sig Safe (≥2 threshold)  
- [ ] lpActor funded with W0G + USDC.e + gas  
- [ ] Do **not** use `0x335651…` as primary LP actor  
- [ ] Approval command hash regenerated from non-zero amounts  
- [ ] Separate human “EXECUTE LIQUIDITY” authorization  
- [ ] Dual-device signing plan ready  

---

## 7. Explicit non-goals of this prep

- No private key use  
- No broadcast  
- No approvals  
- No transfers  
- No liquidity added  
- No router/factory mutation by agent  
