# 🔥 LIQUIDITY IGNITION CHECKLIST - 0G ARISTOTLE

## ✅ CONFIRMATION: OPTION A SELECTED

> ✅ **STANDARD UNISWAP V2 ROUTER02**
>
> NO CUSTOM CODE. NO ABSTRACTIONS. NO EXPERIMENTS.
>
> EXACT SAME BYTECODE UNISWAP USED.
> 100% PREDICTABLE BEHAVIOR.

---

## 🚀 FULL EXECUTION PLAN

### PHASE 1: DEPLOYMENT

| Step | Action | Status |
|------|--------|--------|
| 1 | Deploy `W0G` (Wrapped 0G) | ⬜ PENDING |
| 2 | Deploy `UniswapV2Factory` | ⬜ PENDING |
| 3 | Calculate `PAIR_INIT_CODE_HASH` | ⬜ PENDING |
| 4 | Update hash in `UniswapV2Library.sol` | ⬜ PENDING |
| 5 | Deploy `UniswapV2Router02` with: | ⬜ PENDING |
| | `constructor(factory, w0g)` | |
| 6 | Verify all 3 contracts on explorer | ⬜ PENDING |

---

### ✅ PRE-LIQUIDITY SAFETY CHECKS (MANDATORY)

**THESE MUST ALL PASS BEFORE ANY LIQUIDITY IS SENT**

- [ ] ✅ Factory `createPair(OINIO, W0G)` succeeds
- [ ] ✅ Router `quote(1 ether, reserveA, reserveB)` returns correct value
- [ ] ✅ W0G `deposit{value: 1 ether}()` works
- [ ] ✅ W0G `withdraw(1 ether)` works
- [ ] ✅ Gas estimates are consistent within ±5%
- [ ] ✅ Pair address matches CREATE2 calculation
- [ ] ✅ Router `getAmountsOut()` matches library math

**IF ANY OF THESE FAIL → STOP. LIQUIDITY WILL LOCK.**

---

### 🧩 GNOSIS SAFE EXECUTION FLOW

#### Step 1: Approvals
```solidity
OINIO.approve(router, 500 ether);
W0G.approve(router, 500 ether);
```

#### Step 2: Add Liquidity
```solidity
router.addLiquidity(
    OINIO,
    W0G,
    500000000000000000000,    // 500 OINIO
    500000000000000000,       // 0.5 W0G = $500
    475000000000000000000,    // minOINIO = 95%
    475000000000000000,       // minW0G   = 95%
    treasuryAddress,
    1744632000                // deadline = now + 1200s
);
```

---

### ⚠️ MANDATORY PARAMETERS

| Parameter | Value | Reason |
|-----------|-------|--------|
| Slippage | 5% | Maximum safe slippage for initial liquidity |
| Deadline | 20 minutes | Long enough for Safe confirmations, short enough to prevent front-running |
| Seed Ratio | 500 OINIO : $500 W0G | Clean initial price. No broken chart. Perfect launch. |

---

### 📡 FRONTEND HOOKS

✅ **EXISTING**: `getReserves()` polling
✅ **ADD AFTER IGNITION**: `totalSupply()` on LP token

Display:
> ✅ Total Liquidity Locked: $1000

This builds trust instantly.

---

### 🔥 IGNITION SEQUENCE

1. Deploy Router02 ✅ → DROP ADDRESS HERE
2. Receive exact calldata for Safe
3. Run $10 test liquidity first
4. Confirm frontend updates
5. Execute full $1000 seed
6. Watch value flow

---

## 🚨 FINAL RULES

❌ DO NOT RUSH.
❌ DO NOT USE UNVERIFIED CODE.
❌ DO NOT SKIP TEST LIQUIDITY.

This is the first economic signal your system will ever emit.
Make it clean. Make it intentional.

---

> Drop router address when deployed.
> Calldata will be ready immediately.