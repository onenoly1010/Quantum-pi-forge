# QPF Activation Status V1

**Mode:** STATUS SNAPSHOT — not an unlock  
**Package:** Genesis Verification Package V1  
**Network:** 0G Aristotle Mainnet · Chain ID **16661**

---

## Public conclusion (preferred wording)

> **Phase 8 establishes the project's trust foundation. From this point, progress is measured less by new internal documentation and more by independent, reproducible verification. The next milestone is demonstrating that different reviewers, on different systems, can execute the same verification process and reach the same conclusions. Economic functionality—including minting and liquidity—remains intentionally disabled until a separate governance authorization is satisfied.**

**Language note:** Project-internal receipts may say “sealed” for a governance milestone. That is **not** an industry certification. Externally, prefer the conclusion above: distinguish **project governance milestones** from **externally verified facts**.

### Communication principles (public narrative)

| Principle | Meaning |
| --- | --- |
| **Process over conclusion** | Show how results are obtained (claim → evidence → verification) instead of asking readers to accept them |
| **Observables over narrative** | Prefer deployed artifacts, repository history, transactions, and reproducible evidence over descriptive claims |
| **Deployment inventory is not economic readiness** | Publishing what is deployed is distinct from authorizing economic functionality; a deployment inventory is not an economic activation announcement |

| State | Meaning |
| --- | --- |
| **Technical** | What exists and can be independently inspected |
| **Operational** | What is currently enabled for users |
| **Governance** | What is authorized to operate; what decisions remain before economic features |

These guide documentation; they do not guarantee adoption or external validation.

### Verification boundary model (governing rule)

```text
Technical truth layer
        ↓
Deployment evidence layer
        ↓
Independent verification layer
        ↓
Governance decision layer
        ↓
Economic activation layer
```

| Layer | Question answered |
| --- | --- |
| Architecture | What was designed? |
| Deployment inventory | What exists on-chain? |
| Evidence | What proves the claim? |
| Verification | Can someone else reproduce the result? |
| Governance | Who/what authorizes changes? |
| Economic activation | What functionality is actually enabled? |

**Public message at this stage:** *Here is what exists. Here is the evidence. Here is how to verify it. Here is what remains intentionally disabled.*

Do not collapse: deployed contract → launched → valuable. Prefer: deployed contract → observable artifact → independently verifiable state → separate governance decision.

---

## Critical distinction (do not collapse)

> **Technical activation verified. Commercial activation pending governance authorization.**

| Layer | State | Meaning |
| --- | --- | --- |
| **Technical activation** | **Verified** | Core contracts live on chain 16661; bytecode probeable; website/registry surfaces exist |
| **Commercial activation** | **Pending governance authorization** | Public mint, liquidity seeding, yield, staking, bridge, treasury remain gated |
| **Verification evidence** | **Phase 8.5 Round 1 OPEN** (\(n=0\), \(m=3\)) | Independent reviewers can check published state; does **not** equal activation permission |
| **Governance authorization** | Not granted for economics | Separate decision; not automatic from docs or consensus reports |
| **Phase 8.4 portal** | **COMPLETE** (2026-07-30) | Live portal + registry + reproducible steps sealed |

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

### How this relates to governance and outcomes

Reproducible verification is a **strong technical maturity signal**: if independent parties can reproduce the same verification results from the same source, that supports confidence that the engineering process is disciplined and the verification workflow is reliable.

> **“Other people, other machines, same conclusions” provides a strong technical foundation for any future governance discussions about economic activation. While reproducible verification does not determine whether or when economic features should be enabled, it gives stakeholders a shared evidence base from which those decisions can be evaluated.**

Keep these layers separate:

| Layer | Role |
| --- | --- |
| **Reproducible verification** | Strengthens confidence in the technical implementation and verification process |
| **Governance decisions** | Determine whether and when to enable economic functionality |
| **Adoption, funding, community trust** | Separate outcomes; depend on ecosystem interest, communication, partnerships, usability, market conditions, and more—not technical quality alone |

Portal: [community/VERIFICATION_PORTAL_V1.md](./community/VERIFICATION_PORTAL_V1.md)  
Multi-report process: [community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](./community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md)  
Report index (Round 1): [community/verification-reports/INDEX_V1.md](./community/verification-reports/INDEX_V1.md)

## Current phase activation

| Phase | State |
| --- | --- |
| 8.0–8.3 | ✅ Complete on main |
| **8.4** Public verification portal | ✅ **COMPLETE** — live seal 2026-07-30 |
| **8.5** Multi-report verification | ● **Round 1 OPEN** — soft 2026-08-13 / hard 2026-08-29 |
| 8.6–8.7 | Pending (after reports accumulate) |
| 9.0 + economic | ⛔ Not authorized |

## Where to go next

| Need | Document |
| --- | --- |
| Full package entry | [GENESIS_VERIFICATION_V1.md](./GENESIS_VERIFICATION_V1.md) |
| Addresses + digests | [CONTRACT_REGISTRY_V1.md](./CONTRACT_REGISTRY_V1.md) |
| Forbidden / gated matrix | [SECURITY_BOUNDARIES_V1.md](./SECURITY_BOUNDARIES_V1.md) |
| Ordered unlock conditions | [ACTIVATION_ROADMAP.md](./ACTIVATION_ROADMAP.md) |
| 10-minute independent verify | [BUILDER_QUICKSTART.md](./BUILDER_QUICKSTART.md) |
| Phase 8.1 consolidation | [evidence/PUBLIC_READINESS_REPORT_V1.md](./evidence/PUBLIC_READINESS_REPORT_V1.md) |
| Submit / track Round 1 reports | [community/verification-reports/INDEX_V1.md](./community/verification-reports/INDEX_V1.md) · [PHASE_8_5_ROUND1_ACTIVATION_V1.md](./community/PHASE_8_5_ROUND1_ACTIVATION_V1.md) |

---

## Explicit non-authorization

This status file does **not** enable mint, liquidity, signing, broadcast, Safe execution, or contract changes.

---

*Activation Status V1 — credibility through restraint.*
