# Mint Authority Explanation v1

**Phase:** 8.3  
**Mode:** EXPLAIN AUTHORITY — not exercise authority  
**Seal:** `PHASE_8_3_MINT_AUTHORITY_EXPLANATION_SEALED`  
**Does not authorize:** signing, broadcast, mint open, controlled mint execution, liquidity, or any wallet action  

**Depends on:** Phase 8.2 Safe governance policy sealed on `main` (PR #630)  
**Posture:** *Technical activation verified. Commercial activation pending governance authorization.*

---

## Purpose

Explain the existence, boundaries, and authorization requirements around token mint **capability**.

This document is intentionally narrow. It does **not** open mint, seed liquidity, or provide an activation runbook.

```text
Capability  ≠  Permission  ≠  Activation
```

---

## Current Status

| Gate | Status |
| --- | --- |
| **Mint activation** | **NOT AUTHORIZED** |
| **Liquidity activation** | **NOT AUTHORIZED** |
| **Economic launch** | **NOT AUTHORIZED** |

Controlled activation review and DEX/liquidity remain **separate GO only**.

---

## Capability vs Permission

A deployed capability does not represent an authorized action.

| Layer | State |
| --- | --- |
| **Capability** | On-chain `registerModel(string,string,uint256)` exists on OINIOModelRegistry (Aristotle chain ID **16661**) |
| **Permission** | Public/commercial mint is **not** open; policy and execution gates keep activation off |
| **Activation** | Requires explicit governance GO + evidence — **not this document** |

Registry (docs/public path): `0x67aD7169184581f23D1E10B39d4eb4e98293E87a`  
Token (stake approve): `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58`

Any future activation requires:

- governance review  
- explicit approval  
- evidence capture  
- verification receipt  

---

## Authority Boundary

| Surface | Documented fact |
| --- | --- |
| **Contract role** | Model registry mints AI Model NFTs via `registerModel` with OINIO stake transfer when a caller is able to execute the path |
| **Access controls (process)** | Human principal + sealed receipts; agents/CI do not sign or broadcast |
| **Safe / governance** | Guardian Safe `0x8d088B88219D072aB035502065ee2410c2cb4389` is the designated governance identity (Phase 8.2). Safe threshold is **not invented in git** — verify in Safe UI |
| **Ownable residual** | Historical Ownable `owner()` residual remains a documented control-plane gap (B-02); do not equate Safe acceptance with automatic contract ownership |
| **Immutable constraints** | Existing on-chain bytecode is fixed until a new deployment; this package does not claim full source↔chain identity for every address |

---

## Activation Conditions

**No activation occurs until required governance gates are satisfied.**

Minimum conditions (summary; not a how-to):

1. Explicit sealed approval for the **named** action (controlled mint and/or public open — distinct gates).  
2. Policy posture consistent with open intent (`mint_allowed` / `public_mint_active` only after GO — currently commercial path remains closed).  
3. Separate **live execution** authorization if signing/broadcast is required (authorization reconsideration ≠ execution).  
4. Abort conditions enforced (wrong chain, wrong addresses, seed prompts, out-of-scope actions).  
5. Still **not** general autonomy, liquidity, or yield.

EDGE_READY, Genesis verification, Safe policy, and this explanation **do not** satisfy those gates by themselves.

---

## Evidence Requirements

Required records **before** any activation claim is credible:

| Record | Role |
| --- | --- |
| Proposal / reference | What was proposed, on which chain and contracts |
| Approval evidence | Sealed human/governance GO with scope bounds |
| Transaction hash (if executed) | On-chain fact |
| Verification output | `verify:evidence` / independent re-check of state |

Optional but recommended after execution: block number, explorer links, post-state probe, abort log if aborted.

**Absence of the above** means a stranger should treat mint as **not activated**.

---

## Explicit non-goals

- No mint transaction construction for broadcast  
- No policy flag flips in this package  
- No wallet prompts  
- No liquidity, distribution, or permission-code changes  
- No “how to mint now” operator path  

---

## Related (read-only)

| Topic | Path |
| --- | --- |
| Activation status | `docs/ACTIVATION_STATUS.md` |
| Security boundaries | `docs/SECURITY_BOUNDARIES_V1.md` |
| Safe policy (8.2) | `docs/governance/SAFE_GOVERNANCE_POLICY_V1.md` |
| Public readiness (8.1) | `docs/evidence/PUBLIC_READINESS_REPORT_V1.md` |
| Contract registry | `docs/CONTRACT_REGISTRY_V1.md` |

---

*Phase 8.3 — restraint is the evidence. Next milestone: external verification, not more activation policy.*
