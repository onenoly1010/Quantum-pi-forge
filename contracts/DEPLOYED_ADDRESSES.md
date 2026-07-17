# Deployed Addresses

**Status:** RPC-verified inventory (Activation Gate G-05)  
**Last verification (UTC):** 2026-07-16T19:49:43Z  
**RPC:** `https://evmrpc.0g.ai`  
**Chain ID (live `eth_chainId`):** `16661` (`0x4115`) — **match**  
**Latest block at probe:** `38990004`  
**Git HEAD at probe:** `ce275b81f54d4f166a17f7fac8ffa67f0c937435`  
**Evidence:**  
- `docs/activation/evidence/G-05-contract-rpc-20260716T195100Z.json`  
- `docs/activation/evidence/G-05-bytecode-compare-20260716T195200Z.json`  
- `docs/activation/evidence/G-05-bytecode-compare-broadcast-set-20260716T195300Z.json`  
- `docs/activation/evidence/G-05-contract-verification-20260716T195100Z.md`

## Review Boundary

This file records **only** results obtained from live RPC and local artifact comparison.  
It does **not** authorize mint, stake, bridge, liquidity, or ownership transfer.

## Critical findings (do not paper over)

1. **Two distinct address sets** have on-chain code on Aristotle for OINIO-related contracts:
   - **Broadcast set** (Foundry `contracts/broadcast/BirthGenesisHeartbeat.s.sol/16661/`)
   - **Docs/public-mint set** (addresses used widely in governance receipts and human-doorway copy)
2. **Current local Foundry `deployedBytecode` matches** broadcast `OINIOToken` **exactly**. It does **not** match the docs/public-mint `OINIOToken`.
3. **Owner** on checked Ownable contracts resolves to `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc` — the address already documented as **untrusted / frozen** in `docs/security/ETH_MAINNET_OLD_WALLET_UNTRUSTED_V1.md` (and related receipts). This is a **security residual**, not a pass.
4. **Pi Network** rows remain **Pending** (no Pi RPC verification in this gate).

---

## Deployment Matrix — 0G Aristotle Mainnet (chain ID 16661)

### A) Broadcast set (CREATE receipts + RPC)

Source broadcast: `contracts/broadcast/BirthGenesisHeartbeat.s.sol/16661/run-latest.json`  
Deployer (`from` on CREATE txs): `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc`

| Contract | Address | CREATE tx | Block | `eth_getCode` | Local artifact bytecode match | Owner (`owner()`) | Verification Status |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| OINIOToken | `0x709f23C7A7172E137427576abB5Eb8959E2A57c1` | `0x78e0247ec5381290fe6059c29df25794dc9aadaa4ae2863979406f63a43c5d55` | 36824379 | **2280 bytes** | **MATCH** (`contracts/out/OINIOToken.sol/OINIOToken.json`) | `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc` | **CODE+TX+BYTECODE_MATCH** (owner untrusted residual) |
| OINIOModelRegistry | `0x25A9C5A244EAf688E078C387616e2380A0589562` | `0x24a33a32d4a1131e079ea39380506fc9a4e3d52523dd67a3d9fa89830814c751` | 36824380 | **9710 bytes** | **NO MATCH** (size equal 9710; hash differs) | `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc` | **CODE+TX; BYTECODE_MISMATCH** |
| HeartbeatMonitor | `0xd1d5147f38E74855a133Cd75cE7b040eBE6324a0` | `0xd1cc6e7e97e4c4f20dc10141d80036218a5ea50083bbca8dd13a2d63f9d911c4` | 36824380 | **2571 bytes** | **NO MATCH** (size equal 2571; hash differs) | `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc` | **CODE+TX; BYTECODE_MISMATCH** |

Explorer (address pages):

- https://chainscan.0g.ai/address/0x709f23C7A7172E137427576abB5Eb8959E2A57c1  
- https://chainscan.0g.ai/address/0x25A9C5A244EAf688E078C387616e2380A0589562  
- https://chainscan.0g.ai/address/0xd1d5147f38E74855a133Cd75cE7b040eBE6324a0  

### B) Docs / public-mint set (code present; not the broadcast CREATE set)

These addresses appear in governance receipts and prior public copy. Live `eth_getCode` confirms **code present**. They are **not** the CREATE outputs in `run-latest.json`.

| Contract (claimed role) | Address | `eth_getCode` | Local artifact match | Owner | Verification Status |
| --- | --- | --- | --- | --- | --- |
| OINIOToken (docs) | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` | **2281 bytes** | **NO MATCH** | `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc` | **CODE_PRESENT; BYTECODE_MISMATCH; NOT_IN_BROADCAST_CREATE** |
| OINIOModelRegistry (docs) | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` | **9850 bytes** | **NO MATCH** | `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc` | **CODE_PRESENT; BYTECODE_MISMATCH; NOT_IN_BROADCAST_CREATE** |
| HeartbeatMonitor (docs) | `0x5E50b92E57e854659f7D98c733088aABd551C49F` | **2571 bytes** | **NO MATCH** | `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc` | **CODE_PRESENT; BYTECODE_MISMATCH; NOT_IN_BROADCAST_CREATE** |

ABI smoke (`eth_call`) on docs OINIOToken `0x75995…`:

| View | Result |
| --- | --- |
| `name()` | `OINIO Token` |
| `symbol()` | `OINIO` |
| `decimals()` | `18` |
| `totalSupply()` | `1000000000` whole tokens (1e9 * 1e18 raw) |

### C) Alternate skill-inventory address

| Label | Address | `eth_getCode` | Notes |
| --- | --- | --- | --- |
| OINIOToken (skill alt) | `0x6011c341a01c80f489a5c3Ab751987A55142F04e` | **4132 bytes** | Code present; **not** matched to current `OINIOToken.json` in this gate; do not treat as canon without further proof |

### D) Pi Network

| Chain | Chain ID | Contract | Address | Verification Status |
| --- | ---: | --- | --- | --- |
| Pi Testnet | Pending | OINIOToken | Pending | **Pending** — not RPC-verified this gate |
| Pi Testnet | Pending | OINIOModelRegistry | Pending | **Pending** |
| Pi Mainnet | Pending | OINIOToken | Pending | **Pending** |
| Pi Mainnet | Pending | OINIOModelRegistry | Pending | **Pending** |

---

## Compiler / artifact notes

- Local build: Foundry `forge build --evm-version cancun`, Solc **0.8.24**, optimizer on (`contracts/foundry.toml`: optimizer_runs 200).  
- Bytecode match is against **current** `contracts/out/**` after that build.  
- Mismatch does **not** prove contracts are malicious; it proves **current tree artifacts ≠ on-chain runtime** (except broadcast OINIOToken). Further work: recover deploy compiler settings / commit used at deploy time.

## Required verification bundle (status)

| Item | Broadcast OINIOToken | Other rows |
| --- | --- | --- |
| Raw deployment receipt / CREATE tx | Yes (RPC receipt status `0x1`) | Partial / docs set missing CREATE link |
| Explorer page | Linkable | Linkable |
| RPC `eth_getCode` | Yes | Yes |
| ABI smoke | Partial (token views on docs token) | Partial |
| Compiler metadata full match | Incomplete | Incomplete |
| Bytecode match current artifacts | **Yes** | **No** |
| Safe ownership | **No** — owner is untrusted residual | **No** |

## Canonical position for public language

Until a human selects a **single** canon set and ownership is moved to a verified guardian Safe:

- Do **not** claim “fully verified immutable deployment.”  
- Prefer: **“RPC-verified code at recorded addresses; dual sets documented; bytecode match incomplete except broadcast OINIOToken; owner is historically untrusted wallet residual.”**  
- Economic flows remain gated (staking, liquidity, public mint opening, bridge).
