# Treasury Visibility — read-only

```text
AGENT: Treasury Visibility
ROLE: declared operating role (WATCH_ONLY)
TASK: observable economic-state report
AUTHORIZED SCOPE: RPC + status JSON; no transfers, approvals, swaps, LP, signing
RESULT: EXECUTED
```

RPC: `https://evmrpc.0g.ai` · chain `16661` · ~block `42252191` (cycle start).

## OBSERVED (eth_call / eth_getCode)

| Item | Observation |
| --- | --- |
| `eth_chainId` | `0x4115` (16661) |
| OINIO `totalSupply()` | `1000000000` tokens (1e9 × 1e18 raw) |
| OINIO at Model Registry | **101** OINIO |
| OINIO at DEX pair `0x2067319D…AaeE` | **0** |
| OINIO at factory / Safe `0x8d088B88…4389` | **0** |
| OINIO at model-NFT owner `0x335651bd…f4dc` | **999999899** |
| `totalModels()` | **2** |
| Pair `getReserves()` | **0 / 0**, timestamp 0 |
| Factory `allPairsLength()` | **1** |
| Pair bytecode | 14954 bytes |
| Factory bytecode | 18951 bytes |
| Safe bytecode | 171 bytes (proxy-sized) |

Owner-of-models + registry ≈ 1e9 (101 + 999999899). **DERIVED:** circulating float is almost entirely in that one address; **not** a claim about beneficial ownership or keys.

## DERIVED

- One DEX pair exists and has **no liquidity**. Matches status `reserves_expected: 0/0`.
- 101 OINIO at registry is consistent with two model registrations if each required 1 OINIO plus other registry-held balances — **do not** treat 101 as “exactly 2×1” without decoding both `getModel` stake fields this pass (ABI decode of struct failed; stake **UNVERIFIED** per model).
- Empty pair + locked gates ⇒ **no protocol AMM cashflow** from this pair.

## UNVERIFIED

- Key custody of `0x335651bd…f4dc` (do not infer)
- Native 0G / W0G balances (not queried)
- Historical transfer graph
- Whether Safe holds other assets
- `paused()` on token reverted (no such function or different ABI)

## Gates (from status JSON, not a wallet)

```text
PUBLIC MINT / LIQUIDITY / YIELD / STAKING / BRIDGE / FINANCIAL EXECUTION = LOCKED
```

**NOT EXECUTED:** any transfer, approval, swap, or LP op.
