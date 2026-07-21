# Safe Threshold Hardening UI Walkthrough v1

**Mode:** Human operator only (Safe UI + hardware wallet)  
**Network:** 0G Aristotle Mainnet — **chain ID `16661`**  
**RPC (verify in wallet):** `https://evmrpc.0g.ai`  
**Agent boundary:** No private keys, no seed phrases, no agent signing/broadcast.

## Goal

Raise weak Safes so **threshold ≥ 2**. A single compromised key must not be able to execute.

| Safe | Label | Pre-hardening (live probe) | Target |
| --- | --- | --- | --- |
| `0xF69bA0dDAa323B07F57Fb02e0835391ba9DD08DE` | Trezor-path | **1/1** WEAK | **2/2** (or 2/3) |
| `0xf50FeE9d77f5161581A47f48874fB3f99a9EDBd1` | Operator | **1/2** WEAK | **2/2** (+ owner hygiene) |
| `0x8d088B88219D072aB035502065ee2410c2cb4389` | Guardian | **3/4** SECURE | **Leave at 3/4** |

Verify anytime:

```bash
cd ~/Quantum-pi-forge
npm run safe:hygiene
# or
npm run safe:inspect:cast
```

---

## Pre-flight (both Safes)

1. Clean browser profile if possible; official Safe app only.
2. Confirm wallet network is **0G Aristotle (16661)** before connecting.
3. Have a **second hardware-derived address** ready for the 1/1 Safe (different device or unused Trezor account).
4. **Do not sign** pending transfers (`Send USDC.e`, batch sends) on WEAK Safes until thresholds are raised, unless you intentionally created them and trust the destination.
5. Never paste seed phrases into chat, terminal, or AI.
6. Prefer rejecting unknown pending queue items after lock-down.

---

## Part A — Harden Trezor-path Safe `0xF69…08DE` on **0G Aristotle** (1/1 → 2/2)

**Multi-chain warning:** `eth:0xF69…` and the 0G instance are **independent**.  
Ethereum mainnet F69 was already raised to **2/2** (tx `0xea7aaccf…0b0c`, safeTxHash `0x97433dc5…b7e0`).  
**Aristotle may still be 1/1.** Always check the Safe UI prefix:

| UI prefix | Chain | Goal |
| --- | --- | --- |
| `eth:0xF69…` | Ethereum | Already hardened (monitor only) |
| **0G / chain 16661** `0xF69…` | Aristotle | **Must harden if still 1/1** |

**Aristotle owner (last probe):** `0x353663cd664bB3e034Dc0f308D8896C0a242e4cd` only.

You cannot set threshold to 2 with only one owner. Order: **add second owner**, set **threshold = 2** (often one batched Safe tx).

**Recommended second owner on 0G:** your Trezor EOA  
`0x9588fED230B62e36b3880cfDA0CC4Cc242969c2E`  
(do **not** reuse `0x8d088…` unless that address is a **contract on Aristotle** that can sign — nested Safe only works same-chain.)

### A1. Open the correct Safe (**not** `eth:`)

1. Open official Safe UI.
2. Network selector: **0G Aristotle** (chain ID **16661**) — **not** Ethereum.
3. Load address: `0xF69bA0dDAa323B07F57Fb02e0835391ba9DD08DE`.
4. Confirm URL/network is **not** `safe=eth:…`.
5. Confirm Settings shows **1 owner**, **threshold 1** on 0G.

### A2. Add second owner + set threshold 2

1. **Settings → Owners** (or **Manage owners**).
2. **Add owner**.
3. Paste the **new hardware address** (checksummed). Verify every character.
4. Set **required confirmations / new threshold** to **2**.
5. Review the transaction:
   - Safe method typically `addOwnerWithThreshold(address owner, uint256 _threshold)`
   - New owner = your second hardware address
   - `_threshold` = `2`
6. **Sign** with the current sole owner path (hardware confirms address + data).
7. **Execute** (still 1/1 for this one hardening tx — expected).
8. Refresh Settings: **2 owners**, **threshold 2/2**.

### A3. If UI only added owner and left threshold at 1

1. **Settings → Policy / Required confirmations**.
2. Change **1 → 2**.
3. Sign + execute.
4. Re-check Settings.

### A4. Verify locally (no keys)

```bash
cd ~/Quantum-pi-forge
SAFE_ADDRESS=0xF69bA0dDAa323B07F57Fb02e0835391ba9DD08DE npm run safe:hygiene
```

Expect: **SECURE** with `2/2` (or higher).

---

## Part B — Harden operator Safe `0xf50F…dBd1` (1/2 → 2/2)

**Current owners:**

| Owner | Note |
| --- | --- |
| `0x353663cd664bB3e034Dc0f308D8896C0a242e4cd` | Deployer / primary |
| `0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC` | EOA; appears in untrusted/old-wallet hygiene notes |

### B1. Prefer owner hygiene *with* threshold ≥ 2

Ideal path if `0x335651…` is not fully trusted:

1. Open Safe `0xf50FeE9d77f5161581A47f48874fB3f99a9EDBd1` on **16661**.
2. **Do not** lower threshold at any step.
3. Option A (fastest if both current owners are under your control and trusted short-term):
   - **Settings → Policy** → set threshold **1 → 2**.
   - Sign + execute (currently either owner can do this alone — use hardware if possible).
4. Option B (better long-term):
   - Add a **clean hardware** third owner.
   - Set threshold to **2** (now 2/3).
   - Later: remove `0x335651…` while keeping threshold ≥ 2.

### B2. Fast path only (threshold 2/2, keep current owners)

1. Settings → **Policy / Required confirmations**.
2. Change **1 → 2**.
3. Create transaction → review `changeThreshold(2)`.
4. Sign + execute.
5. Confirm UI shows **2/2**.

### B3. Verify

```bash
SAFE_ADDRESS=0xf50FeE9d77f5161581A47f48874fB3f99a9EDBd1 npm run safe:hygiene
```

Expect: **SECURE** `2/2`.

---

## Part C — Guardian Safe `0x8d08…4389` (leave alone)

- Live: **3/4 SECURE**.
- Do **not** lower threshold.
- Pending actions on *this* Safe already need 3 signatures — good anti-sweeper control plane.
- Use for Phase 7 / FeeCollector ownership paths when separately authorized.

---

## Part D — Pending queue hygiene (after thresholds fixed)

1. Re-open each Safe → **Transactions / Queue**.
2. For each pending item (`Batch2`, `Send -0.02 USDC.E`, `Send -0.8 USDC.E`, etc.):
   - If **you did not create it** → **Reject**.
   - If intentional → re-sign only after threshold ≥ 2 so a second key is required.
3. Never “clear the queue” under 1/n pressure.

---

## Second hardware key checklist (for Part A)

| Check | Done |
| --- | --- |
| Second device or unused Trezor account | |
| Address never used as hot deployer | |
| Seed never typed into browser/AI/terminal | |
| Backup offline only | |
| Not the same seed as owner #1 | |

---

## After both WEAK Safes are SECURE

```bash
cd ~/Quantum-pi-forge
npm run safe:hygiene
# exit 0 when all configured Safes have threshold >= 2
```

Optional: seal a human completion note (no keys) under  
`docs/governance/GUARDIAN_POST_SAFE_OPEN_RECEIPT_V1.md` pattern or a new short receipt  
`tools/safe-local-ai/receipts/threshold-hardening-complete-YYYYMMDD.md` stating:

- which Safes changed
- new thresholds only (not owner private keys)
- date / operator initials

---

## What this walkthrough does **not** authorize

- Phase 7 deploy / liquidity / mint  
- Moving funds off Safe  
- Agent execution authority  
- Publishing owner seed material  

Threshold hardening only.
