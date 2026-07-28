# QPF Activation Status V1

**Mode:** STATUS SNAPSHOT — not an unlock  
**Package:** Genesis Verification Package V1  
**Network:** 0G Aristotle Mainnet · Chain ID **16661**

---

## Critical distinction (do not collapse)

> **Technical activation verified. Commercial activation pending governance authorization.**

| Layer | State | Meaning |
| --- | --- | --- |
| **Technical activation** | **Verified** | Core contracts live on chain 16661; bytecode probeable; website/registry surfaces exist |
| **Commercial activation** | **Pending governance authorization** | Public mint, liquidity seeding, yield, staking, bridge, treasury remain gated |

Empty pool and disabled mint are **intentional restraint**, not unfinished accidents.

---

## Compact posture

```text
TECHNICAL_ACTIVATION = VERIFIED (contracts live; stranger-verifiable)
COMMERCIAL_ACTIVATION = NOT_ACTIVE (pending governance authorization)
PUBLIC_MINT_OPEN = NO (GOVERNANCE_GATED_NO_GO)
LIQUIDITY = NO (pair exists; reserves zero)
YIELD / STAKING / BRIDGE = NO
RESTRAINT = INTENTIONAL
```

---

## What is verified vs what is not open

| Verified (technical) | Not open (commercial) |
| --- | --- |
| Chain ID 16661 RPC | Public mint open |
| Live `eth_getCode` on registry addresses | Liquidity seeding |
| DEX factory / router / pair presence | Yield activation |
| Empty pair reserves (probe) | Staking / bridge execution |
| Public mint UI disabled + NO-GO receipts | Site wallet signing / broadcast |
| Safe guardian address with bytecode | Ownership residual remediation complete |

---

## Where to go next

| Need | Document |
| --- | --- |
| Full package entry | [GENESIS_VERIFICATION_V1.md](./GENESIS_VERIFICATION_V1.md) |
| Addresses + digests | [CONTRACT_REGISTRY_V1.md](./CONTRACT_REGISTRY_V1.md) |
| Forbidden / gated matrix | [SECURITY_BOUNDARIES_V1.md](./SECURITY_BOUNDARIES_V1.md) |
| Ordered unlock conditions | [ACTIVATION_ROADMAP.md](./ACTIVATION_ROADMAP.md) |
| 10-minute independent verify | [BUILDER_QUICKSTART.md](./BUILDER_QUICKSTART.md) |
| Phase 8.1 consolidation | [evidence/PUBLIC_READINESS_REPORT_V1.md](./evidence/PUBLIC_READINESS_REPORT_V1.md) |

---

## Explicit non-authorization

This status file does **not** enable mint, liquidity, signing, broadcast, Safe execution, or contract changes.

---

*Activation Status V1 — credibility through restraint.*
