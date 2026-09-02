# Treasury Visibility — cycle 2026-08-21-c2 (read-only)

```text
AGENT: Treasury Visibility
ROLE: declared operating role (WATCH_ONLY)
TASK: native 0G + wrapper/USDC.e balances cycle 1 left UNVERIFIED; pair token identities
AUTHORIZED SCOPE: RPC only; no transfers, approvals, swaps, LP, signing
RESULT: EXECUTED
```

RPC: `https://evmrpc.0g.ai` · chain **16661** · block **42252664** (owner/native) and **42252708** (wrappers) · 2026-08-21T15:16:53Z.

Cycle 1 OINIO supply / 101 at registry / 999999899 at model owner / pair 0/0 / factory length 1 are **reused**, not rediscovered.

## OBSERVED (eth_call / eth_getBalance / eth_getCode)

| Item | Observation |
| --- | --- |
| `ownerOf(1)` and `ownerOf(2)` | `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc` |
| Pair `token0` | `0x1f3aa82227281ca364bfb3d253b0f1af1da6473e` (USDC.e, symbol ABI-decoded `USDC.e`, code 1798 B) |
| Pair `token1` | `0xD1De4F87C8b195f21254b7163dDA9370D8Df593d` (QPF-custom W0G, symbol `W0G`, code 2684 B) |
| Official network W0G `0x1Cd0690fF9a693f5EF2dD976660a8dAFc81A109c` | code **3327** B; **not** this pair’s token |
| Pair `getReserves` | 0 / 0 / ts 0 |
| Factory `allPairsLength` | 1 |

Native 0G (wei/1e18):

| Address | Native 0G | Code bytes |
| --- | --- | --- |
| OINIO `0x7599…Cb58` | **0** | 2281 |
| Registry `0x67aD…E87a` | **0** | 9850 |
| Heartbeat `0x5E50…C49F` | **0** | 2571 |
| ForgeRegistry peer `0x6011…F04e` | **0** | 4132 |
| Factory `0x215E…D3F8` | **0** | 18951 |
| Router `0x2c70…3951` | **0** | 18953 |
| Pair `0x2067…AaeE` | **0** | 14954 |
| Safe `0x8d08…4389` | **0.996** | 171 |
| Model owner `0x3356…f4dc` | **0.13534347** | (EOA / not measured as contract this pass) |

OINIO (cycle 2 re-read, same as cycle 1): registry **101**; heartbeat/peer/factory/router/pair/Safe **0**.

Wrappers:

| Holder | QPF W0G | Official W0G | USDC.e |
| --- | --- | --- | --- |
| Pair | 0 | 0 | 0 |
| Safe | 0 | 0 | 0 |
| Model owner | **0.05** | 0 | 0 |

## DERIVED

- Cycle 1 “native 0G UNVERIFIED” is now **partially closed**: protocol contracts hold **0** native; Safe holds **~0.996** native; model owner holds **~0.135** native.
- The canonical empty pair is **QPF-custom W0G / USDC.e**, not official-network W0G / USDC.e. Skills doc already warns not to conflate; public status JSON does not.
- 0.05 QPF W0G at the model owner is **not** pool liquidity.
- Empty pair + 0 wrapper balances at pair + locked gates ⇒ still **no protocol AMM cashflow**.

## UNVERIFIED

- Key custody of Safe and model owner (do not infer).
- Whether 0.996 native at Safe is operator gas vs “treasury.”
- Historical transfers.
- Other tokens at these addresses.
- `getModel` per-model stake (still UNVERIFIED; ABI struct decode failed cycle 1).

## Gates (unchanged)

```text
PUBLIC MINT / LIQUIDITY / YIELD / STAKING / BRIDGE / FINANCIAL EXECUTION = LOCKED
```

**NOT EXECUTED:** any transfer, approval, swap, or LP op.
