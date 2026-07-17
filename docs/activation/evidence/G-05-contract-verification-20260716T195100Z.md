# G-05 Contract Verification — Evidence

**Timestamp (UTC):** 2026-07-16T19:49:43Z–19:53:00Z  
**HEAD:** `ce275b81f54d4f166a17f7fac8ffa67f0c937435`  
**RPC:** `https://evmrpc.0g.ai`

## Checks performed

| Check | Result |
| --- | --- |
| `eth_chainId` | `0x4115` = **16661** (expected match) |
| `eth_getCode` on candidate addresses | All listed candidates returned **non-empty** code |
| CREATE tx receipts (broadcast set) | Status `0x1`; blocks **36824379–36824380** |
| Local artifact bytecode compare | **OINIOToken broadcast MATCH**; others **NO MATCH** |
| `owner()` | All probed Ownable → `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc` (untrusted residual) |
| `DEPLOYED_ADDRESSES.md` update | Populated **only** from these results |

## Dual-set finding (material)

| Set | Example OINIOToken | Notes |
| --- | --- | --- |
| Broadcast / CREATE | `0x709f23C7…` | Matches current artifact; CREATE tx verified |
| Docs / mint prompts | `0x75995EC0…` | Code present; does **not** match current artifact; used in wallet prompt sheets |

## Gate decision

**PASS (verification executed with honest outcomes).**

This is **not** “all contracts fully verified green.” It is “RPC + artifact comparison completed; matrix updated without invention.”

### Residuals (carry to G-07 / G-08)

- Dual address sets must be reconciled by human canon decision.  
- Owner is untrusted wallet residual.  
- Registry/Heartbeat bytecode mismatch vs current tree.  
- Pi deployments Pending.  

## Machine evidence files

- `G-05-contract-rpc-20260716T195100Z.json`  
- `G-05-bytecode-compare-20260716T195200Z.json`  
- `G-05-bytecode-compare-broadcast-set-20260716T195300Z.json`  
