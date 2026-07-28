# Mint Authority Explanation v1

**Phase:** 8.3  
**Mode:** EXPLAIN AUTHORITY — not exercise authority  
**Status:** DOCUMENTATION_ONLY  
**Does not authorize:** signing, broadcast, public mint open, controlled mint execution, liquidity, or any wallet action  

**Depends on:** Phase 8.2 Safe governance policy sealed on `main` (PR #630)  
**Posture:** *Technical activation verified. Commercial activation pending governance authorization.*

---

## Purpose

Answer, for a stranger:

1. Is mint authority present?  
2. Who controls it?  
3. What governance threshold applies?  
4. What conditions must exist before activation?  
5. What evidence would be required?  

**No activation path is provided.** Capability ≠ permission.

---

## One-screen answer

| Question | Answer |
| --- | --- |
| Is mint **capability** on-chain? | **Yes** — `OINIOModelRegistry.registerModel(...)` exists on Aristotle (16661) |
| Is mint **permission** open for public commercial use? | **No** — multi-layer gates keep public mint inactive / non-executable |
| Who can **authorize** a future open? | Human principal + sealed governance receipts; Guardian Safe is designated governance identity |
| Who can **execute** on-chain if ever authorized? | A wallet that signs `approve` + `registerModel` under an **explicit live-execution** seal (not this doc) |
| Does Phase 8.3 open mint? | **No** |

```text
CAPABILITY (on-chain registerModel)     = PRESENT
PERMISSION (policy + execution gates)   = NOT OPEN FOR LIVE PUBLIC MINT
THIS DOCUMENT                           = EXPLANATION ONLY
```

---

## 1. Is mint authority present?

Separate **three** layers people often collapse:

### A) Contract capability (technical)

| Item | Value |
| --- | --- |
| Mechanism | AI Model NFT mint via `registerModel(string name, string metadataURI, uint256 stakeAmount)` |
| Registry (docs/public path) | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` |
| Token (approve stake) | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` |
| Network | 0G Aristotle · chain ID **16661** |
| Stake model (policy) | OINIO transferred caller → registry; stakeAmount > 0 |

**Capability means the function exists.** It does not mean public mint is open.

### B) Policy authority (governance flags)

| Flag / state | Typical sealed reading | Meaning |
| --- | --- | --- |
| `mint_allowed` | historically `false` in policy-final; later reconsideration receipts may differ | Policy allowance vs ban |
| `public_mint_active` | **false** even when authorization is reconsidered | Commercial “open for public” not flipped |
| `live_execution_authorization` | **false** | No live wallet path |
| Path status | `REVIEW_ONLY_NOT_EXECUTABLE` (path spec era) | Spec ≠ executable script |

### C) Execution authority (may I sign/broadcast *now*?)

| Artifact class | Role |
| --- | --- |
| Phase 33 execution NO-GO | Live execution **not** authorized |
| Dry-run previews | Non-broadcast only; `live_execution_script=null` |
| Phase 19 decision review | `SEALED_REVIEW_NO_GO` / `DO_NOT_EXECUTE_PUBLIC_MINT` (review seal) |
| Phase 40 reconsideration | Authorization **granted** as policy reopen — **still** `public_mint_active=false`, signing/broadcast **false**, next gate = separate live execution authorization |

**Honest synthesis:** Mint **capability** is present. **Live public mint execution is not authorized** by the current commercial posture. Intermediate receipts may grant *authorization reconsideration* without granting *execution*. A stranger must read the **latest sealed execution gate**, not a single historical YES.

---

## 2. Who controls it?

| Actor | Control surface | Does not |
| --- | --- | --- |
| **Human principal** | Named GO / NO-GO receipts; Living Forge STOP exceptions | Automate without seal |
| **Guardian Safe** `0x8d088B88219D072aB035502065ee2410c2cb4389` | Designated governance multisig identity (Phase 8.2) | Automatically own all Ownable contracts (residual owner gap remains) |
| **Safe owners** | Threshold signatures in Safe UI | Appear as published EOAs in this package |
| **Any EOA (if execution ever opened)** | Could call `registerModel` per contract design | Bypass policy/site/gates ethically or operationally under QPF process |
| **Agents / CI** | Document and PR | Sign, broadcast, open mint |
| **Residual Ownable owner** | Historical admin residual (untrusted) | Trusted production control plane |

**Policy control** of “is mint open?” is **governance receipts + site surfaces**, not “the contract disappeared.”

**On-chain admin residual** (Ownable `owner()` historically untrusted) is a **separate** trust issue (B-02). It is not a mint-open button; it is a control-plane risk to remediate before strong admin claims.

---

## 3. What governance threshold applies?

| Threshold type | Applies to | Public status |
| --- | --- | --- |
| **Safe multisig threshold** | Safe-controlled governance actions | **NEEDS_SAFE_UI_VERIFICATION** — not invented in git (Phase 8.2) |
| **Human seal threshold** | Repo “authority” for GO/NO-GO | Explicit sealed receipt by principal (or designated process) |
| **Execution threshold** | Live signing/broadcast | Separate from authorization reconsideration; requires live-execution seal |
| **Site / policy threshold** | Public-facing open | `public_mint_active` must be true **and** execution authorized — currently not both |

**There is no published “2-of-3 → mint opens” number in this package.** Claiming one without Safe UI verification would invent authority.

---

## 4. What conditions must exist before activation?

### Before any **controlled** mint execution (path B)

- [ ] Named action + final parameters sealed (name, metadataURI, stake, addresses, chain 16661)  
- [ ] Human signing authorization for **exact** `approve` + `registerModel` only  
- [ ] Executable path (not review-only); non-null live script if process requires it  
- [ ] Abort conditions enforced (wrong chain, wrong addresses, seed prompt, extra actions)  
- [ ] Still **not** general autonomy  

### Before **public mint open** (path A — commercial)

- [ ] Controlled path understandable to strangers  
- [ ] Explicit human YES for **open** (policy flip of `mint_allowed` / `public_mint_active` only after GO chain)  
- [ ] Live execution authorization **separate** from “authorization reconsideration”  
- [ ] Site surfaces match policy (no disabled UI claiming live mint)  
- [ ] Prefer control-plane clarity (ownership residual plan) for trust, even if not a Solidity prerequisite of `registerModel`  

### Explicitly **not** conditions for opening

- Empty DEX pool “looking unfinished”  
- EDGE_READY alone  
- Genesis verification package alone  
- Phase 8.2 Safe policy alone  
- This Phase 8.3 document  

---

## 5. What evidence would be required?

Minimum evidence pack for a future activation claim (none of this is created by Phase 8.3):

| Evidence | Purpose |
| --- | --- |
| Sealed GO receipt with scope bounds | Who authorized what, on which chain |
| Policy snapshot (`mint_allowed`, `public_mint_active`) | Public posture |
| Live execution authorization receipt | Distinct from policy reopen |
| Command hash / path fingerprint | Exact txs intended |
| Signing + broadcast receipts (or explicit human wallet proof) | Execution happened under authority |
| Tx hash(es) + block + explorer links | On-chain fact |
| Abort log if aborted | Restraint under stress |
| Optional: post-mint state probe | Stake held, ModelRegistered, UI still within bounds |

**Absence of any of the above** means a stranger should treat mint as **not activated**, regardless of chat language.

---

## 6. Why mint remains disabled (restraint summary)

| Reason | Evidence class |
| --- | --- |
| Commercial activation pending governance | `docs/ACTIVATION_STATUS.md` |
| Execution NO-GO / non-executable path history | Phase 33, path specs, dry-runs |
| Review seals against execute | Phase 19 decision review |
| Even when authorization reconsidered, execution off | Phase 40: `public_mint_active=false`, signing/broadcast false |
| Site mint surfaces disabled | Public mint UI / status pages |
| Guardian reconciliation does not authorize mint | `NOT_AUTHORIZED_BY_THIS_RECEIPT` |
| Safe policy forbids using 8.2 as mint enablement | Phase 8.2 sealed package |

**Value of this phase:** prove what QPF **will not do without authorization**, not what the EVM *could* do if someone ignored process.

---

## 7. Receipt chronology (non-exhaustive, for auditors)

| Receipt | Role (simplified) |
| --- | --- |
| `public-mint-policy-final-v1` | Policy defined; `DEFINED_NO_ACTIVATION` |
| `phase-33-public-mint-execution-no-go-v1` | Live execution NO-GO |
| `phase-19-final-public-mint-decision-review-no-go-v1` | Decision review NO-GO for execute |
| `phase-40-public-mint-authorization-reconsideration-v1` | Authorization granted **without** live execution |
| Phase 8.1 public readiness report | Consolidates commercial NOT_ACTIVE posture |
| Phase 8.2 Safe governance policy | Who constrains control; not mint open |

If two receipts appear to conflict, prefer: **(1) explicit live-execution seals, (2) `public_mint_active`, (3) site state, (4) on-chain txs** — never chat.

---

## 8. Explicit non-goals (this package)

- No mint transaction construction for broadcast  
- No `mint_allowed` / `public_mint_active` flips  
- No wallet prompts  
- No liquidity, distribution, or permission changes  
- No “how to mint now” operator runbook  

---

## Related

| Doc | Path |
| --- | --- |
| Activation status | `docs/ACTIVATION_STATUS.md` |
| Security boundaries | `docs/SECURITY_BOUNDARIES_V1.md` |
| Safe policy (8.2) | `docs/governance/SAFE_GOVERNANCE_POLICY_V1.md` |
| Public readiness (8.1) | `docs/evidence/PUBLIC_READINESS_REPORT_V1.md` |
| Contract registry | `docs/CONTRACT_REGISTRY_V1.md` |

---

*Phase 8.3 — verifiable boundary between capability and permission.*
