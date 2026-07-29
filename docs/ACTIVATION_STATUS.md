# QPF Activation Status V1

**Mode:** STATUS SNAPSHOT — not an unlock  
**Package:** Genesis Verification Package V1  
**Network:** 0G Aristotle Mainnet · Chain ID **16661**

---

## Public conclusion (preferred wording)

> **Phase 8 establishes the project's trust foundation. From this point, progress is measured less by new internal documentation and more by independent, reproducible verification. The next milestone is demonstrating that different reviewers, on different systems, can execute the same verification process and reach the same conclusions. Economic functionality—including minting and liquidity—remains intentionally disabled until a separate governance authorization is satisfied.**

**Language note:** Project-internal receipts may say “sealed” for a governance milestone. That is **not** an industry certification. Externally, prefer the conclusion above: distinguish **project governance milestones** from **externally verified facts**.

---

## Critical distinction (do not collapse)

> **Technical activation verified. Commercial activation pending governance authorization.**

| Layer | State | Meaning |
| --- | --- | --- |
| **Technical activation** | **Verified** | Core contracts live on chain 16661; bytecode probeable; website/registry surfaces exist |
| **Commercial activation** | **Pending governance authorization** | Public mint, liquidity seeding, yield, staking, bridge, treasury remain gated |
| **Verification evidence** | In progress (multi-report) | Independent reviewers can check published state; does **not** equal activation permission |
| **Governance authorization** | Not granted for economics | Separate decision; not automatic from docs or consensus reports |

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

## Progress metric (current)

| Measure less | Measure more |
| --- | --- |
| New internal design docs | Independent, reproducible verification |
| “Trust the builders” | “Other people, other machines, same conclusions” |
| Documentation alone as readiness | Explicit governance GO for any economic open |

Portal: [community/VERIFICATION_PORTAL_V1.md](./community/VERIFICATION_PORTAL_V1.md)  
Multi-report process: [community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](./community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md)

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
