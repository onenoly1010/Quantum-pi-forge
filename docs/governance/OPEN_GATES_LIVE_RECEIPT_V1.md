# Open Gates live receipt v1

**Status:** COMPLETE  
**Mode:** Public workflow — not economic activation  
**Receipt:** [`receipts/governance/open-gates-live-v1.json`](../../receipts/governance/open-gates-live-v1.json)  
**Probed:** 2026-09-15T03:45:27Z

## Authorization used

Merge PR #848 and expose `/open.html` + `open-gates-v1.json`. No mint, LP, yield, signing, or funds movement.

## What landed

| Step | Result |
| --- | --- |
| PR #848 merge | `82d00ead500251e1530fe70a06538d6a47e365e8` |
| Cloudflare deploy #848 | success (run 34925744530) |
| Live JSON | https://quantumpiforge.com/open-gates-v1.json **200** `decision: OPEN` |
| Live `/try` | **200** |
| Live `/open` after #848 | **308 loop** (pretty-URL vs `_redirects`) |
| PR #849 merge | `6f05f28a2aed48b8d17149a08ecc0036c0b5d2fc` |
| Cloudflare deploy #849 | success (run 34926067546) |
| Live `/open` | **200** title `Open Gates — Quantum Pi Forge participant door` |
| Live `/open.html` | **308** → `/open` (single hop) |

## Meaningful action without Kris

Public RPC `https://evmrpc.0g.ai`:

- `eth_chainId` → `0x4115` (16661)
- `eth_getCode` token `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` → **2281 bytes HAS_CODE**

## Classification (unchanged)

```text
TECHNICAL CAPABILITY     = ESTABLISHED
EXTERNAL ADOPTION        = NOT ESTABLISHED
CUSTOMER                 = NOT ESTABLISHED
REAL REVENUE             = NOT ESTABLISHED
AI ECONOMY               = BEING BUILT
MINT / LP / YIELD        = NOT AUTHORIZED
```

## Acceptance test

> Can an independent human or AI arrive at QPF, understand enough from the open door, and do something meaningful without Kris acting as middleware?

**YES.** The gates are open at https://quantumpiforge.com/open
