# Domain & Environment Audit v1

**Target:** live front door after CF deploy (`48c5a01` build)  
**Probed:** 2026-07-21T22:05Z  
**Mode:** Read-only HTTP + content scan + on-chain cross-check  

---

## 1. Availability

| URL | HTTP | Notes |
| --- | --- | --- |
| https://quantumpiforge.com/ | **200** | Custom domain live |
| https://quantumpiforge.pages.dev/ | **200** | Production Pages alias |
| https://96b47402.quantumpiforge.pages.dev/ | **200** | This deploy preview |
| https://quantumpiforge.com/deployed-addresses.html | 308→200 | Works with follow |
| https://quantumpiforge.com/dao.html | 308→200 | Works with follow |

---

## 2. Homepage network binding (PASS)

From `https://quantumpiforge.com/` body:

| Setting | Observed | Expected |
| --- | --- | --- |
| Chain ID decimal | `16661` | Aristotle |
| Chain ID hex | `0x4115` | Aristotle |
| RPC | `https://evmrpc.0g.ai` | Canonical skill RPC |
| Explorer | `https://chainscan.0g.ai` | Canonical |
| Wallet add-chain | ARISTOTLE_NETWORK uses above | OK |

**Verdict:** Primary dApp shell is **correctly bound to 0G Aristotle**, not Ethereum mainnet and not Galileo testnet (`16602` not present on homepage).

---

## 3. Secondary page findings (WARN / FAIL)

| Asset | Issue | Severity |
| --- | --- | --- |
| `dao.html` | Uses `rpc: "https://rpc.0g.ai"` and `wss://rpc.0g.ai/ws` (not `evmrpc.0g.ai`) | **WARN** — may still work; diverges from canonical public EVM RPC |
| `deployed-addresses.html` | Lists `https://evmrpc.0g.ai` + 16661 | **PASS** |
| `deployed-addresses.html` | Labels `0x709f…` as **“DEX Pair (OINIO/0G)”** | **FAIL (content)** — on-chain this is ERC20 OINIO Token, not a V2 pair |
| `index.html` | Same pair seal object `0x709f…` / “No liquidity added” | **FAIL (content)** — wrong contract type for “pair” |
| `frontend/production_dashboard.html` | `RPC_URL = 'https://rpc.mainnet.pi.network'` | **FAIL** — Pi Network mainnet, not 0G |
| Homepage | Link to `https://quantum-pi-forge.pages.dev/run-guardian.sh` (hyphen) vs project `quantumpiforge.pages.dev` | **WARN** — possible 404 / wrong project slug |

---

## 4. DEX address consistency matrix

| Source | Factory | “Pair” | Notes |
| --- | --- | --- | --- |
| Live site seal | `0x215E…D3F8` | `0x709f…57c1` | Factory OK; pair label **wrong type** |
| Governance preflight (Jun) | `0x215E…D3F8` | `0x2067…AaeE` | Real W0G/USDC.e pair, reserves 0 |
| factory.getPair(W0G, USDC.e) | — | `0x2067…AaeE` | **Canonical for seed prep** |
| factory.getPair(OINIO, W0G) | — | `0x0` | Pair not created |

---

## 5. Pre-trip remediation list (code, not liquidity)

1. Fix pair address display to either:
   - W0G/USDC.e `0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE`, or  
   - “pair pending” until OINIO/W0G createPair exists.  
2. Stop labeling `0x709f…` as a DEX pair (it is an ERC20).  
3. Align `dao.html` RPC to `https://evmrpc.0g.ai` (and document WS if available).  
4. Gate or remove `production_dashboard.html` from deploy **or** retarget to Aristotle.  
5. Fix guardian script host link slug if that path is still used.

Redeploy Pages after fixes.

---

## 6. Security / operational note

Front door being live does **not** imply liquidity is live. Site copy correctly states liquidity remains gated in several places; the pair mislabel is the main honesty risk for external reviewers.

---

## 7. Audit result summary

| Area | Result |
| --- | --- |
| Custom domain up | **PASS** |
| Homepage → Aristotle 16661 + evmrpc | **PASS** |
| DEX pair address accuracy | **FAIL** (needs content fix) |
| Secondary RPC hygiene | **WARN/FAIL** (dao + Pi dashboard) |
| Ready for honest LP marketing | **No** until pair label fixed |
| Ready for unsigned LP prep using real pair | **Yes** → see `UNSIGNED_LIQUIDITY_PREP_V1.md` |
