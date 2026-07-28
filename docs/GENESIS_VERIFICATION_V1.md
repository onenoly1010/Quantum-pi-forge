# QPF Genesis Verification Package V1

**Status:** EVIDENCE / VERIFICATION ONLY  
**Created:** 2026-07-28T17:40:29Z  
**Network:** 0G Aristotle Mainnet · Chain ID **16661** (`0x4115`)  
**RPC:** `https://evmrpc.0g.ai`  
**Explorer:** https://chainscan.0g.ai  

## Purpose

Answer for a stranger (not Kris):

> Can I verify this system independently, understand what is live vs disabled, and contribute without trust?

This package protects **credibility**. It does **not** activate mint, liquidity, staking, bridge, yield, or wallet signing.

## Package Contents

| Document | Role |
|----------|------|
| [ACTIVATION_STATUS.md](./ACTIVATION_STATUS.md) | **Technical vs commercial** status (one-screen) |
| [CONTRACT_REGISTRY_V1.md](./CONTRACT_REGISTRY_V1.md) | Addresses, explorers, bytecode digests |
| [SECURITY_BOUNDARIES_V1.md](./SECURITY_BOUNDARIES_V1.md) | What is forbidden / gated |
| [BUILDER_QUICKSTART.md](./BUILDER_QUICKSTART.md) | 10-minute independent verification |
| [ACTIVATION_ROADMAP.md](./ACTIVATION_ROADMAP.md) | Ordered unlock conditions (commercial later) |
| [evidence/PUBLIC_READINESS_REPORT_V1.md](./evidence/PUBLIC_READINESS_REPORT_V1.md) | Phase 8.1 consolidation report |

### Canonical credibility statement

> **Technical activation verified. Commercial activation pending governance authorization.**

Public surface: https://quantumpiforge.com/deployed-addresses  

## Reality Layer

| Category | Statement |
|----------|-----------|
| **What exists** | Core contracts on chain 16661; website; DEX factory/router/pair; Safe guardian address; controlled-mint verification history |
| **What is verified** | Live `eth_getCode` on registry addresses; chain ID; empty pair reserves; mint policy NO-GO receipts; public mint UI disabled |
| **What is experimental** | Social recovery (not production-authorized); threshold gate (pending decision); yield proposals |
| **What is not activated** | Public mint open; liquidity; staking execution; bridge; treasury movement; site wallet signing/broadcast |

## One-line posture

```text
TECHNICAL_PRESENCE=LIVE
COMMERCIAL_ACTIVATION=NOT_ACTIVE
PUBLIC_MINT=GOVERNANCE_GATED_NO_GO
LIQUIDITY=PAIR_EXISTS_RESERVES_ZERO
RESTRAINT=INTENTIONAL
```

## How to verify in 60 seconds

```bash
# Chain ID must be 16661
curl -s -X POST https://evmrpc.0g.ai \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'

# Bytecode must not be empty for OINIO token
curl -s -X POST https://evmrpc.0g.ai \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0x75995EC0fdf881189850aeD864cB3f43c0DFCb58","latest"]}'
```

Full builder path: [BUILDER_QUICKSTART.md](./BUILDER_QUICKSTART.md)

## Explicit non-claims

This package does **not** authorize:

- public mint opening  
- liquidity seeding  
- token distribution  
- signer/Safe owner changes  
- governance execution  
- contract upgrades  
- private-key use, signing, or broadcast  

---

*Genesis Verification V1 — infrastructure proof layer, not market activation.*
