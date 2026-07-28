# Safe Governance Policy v1

**Phase:** 8.2 — Safe / Social Recovery Policy Evidence  
**Mode:** DOCUMENTATION_ONLY — no Safe execution, no ownership transfer, no recovery enablement, no mint/liquidity  
**Audience:** Third-party reviewers, operators, auditors  
**Baseline on `main`:** Genesis Verification Package (PR #629) + Phase 8.1 readiness (PR #628)  
**Canonical commercial posture:** *Technical activation verified. Commercial activation pending governance authorization.*

---

## Purpose

Package **governance credibility** before mint authority is explained:

```text
Who controls the system?
        ↓
How is control constrained?     ← THIS DOCUMENT
        ↓
What can mint happen under?     ← Phase 8.3 (explanation only)
        ↓
When can economic activity begin?
```

This PR must stay **boring**: rules and evidence only.

---

## 1. Safe address

| Field | Value |
| --- | --- |
| Label | QPF Guardian Safe |
| Address | `0x8d088B88219D072aB035502065ee2410c2cb4389` |
| Network | 0G Aristotle Mainnet |
| Chain ID | **16661** |
| Type | Safe-style multisig smart contract |
| Intake | `ACCEPTED` — `receipts/governance/phase-7-guardian-address-intake-v1.json` |
| Live bytecode (8.1) | `HAS_CODE` — `docs/evidence/PUBLIC_READINESS_REPORT_V1.md` |
| Explorer | https://chainscan.0g.ai/address/0x8d088B88219D072aB035502065ee2410c2cb4389 |

**Publication rule:** Safe **contract** address is public. **Owner EOAs stay private** unless a future disclosure receipt authorizes listing them.

---

## 2. Threshold / ownership state

| Aspect | Policy | Status |
| --- | --- | --- |
| Multisig threshold | Required for Safe-signed governance actions | Operational requirement |
| Public numeric threshold | Confirm in official Safe UI on 16661 before sealing claims | **NEEDS_SAFE_UI_VERIFICATION** |
| Intake note | “3 owners listed; verify from Safe UI before sealing” | Not treated as public sealed threshold |
| Owners published | **No** | Intentional |
| Deployer unilateral future authority | **Disallowed** | `guardian-authority-reconciliation-v1` |

**Do not invent N-of-M in git.** Operators verify threshold privately in Safe UI.

---

## 3. Owner roles (conceptual)

| Role | Responsibility | Constraint |
| --- | --- | --- |
| Guardian Safe | Designated governance multisig identity | Accepted address only |
| Safe owners (human) | Threshold signatures | No keys in repo/CI/agents |
| Human principal | Named irreversible / fund-moving authorizations | Sealed receipts |
| Agents / bots | Docs, build, PR | No sign / broadcast / ownership change |
| Residual Ownable `owner()` | Historical deploy residual | Documented untrusted; not future unilateral authority |

### Ownership residual (control plane gap)

Last activation matrix: Ownable `owner()` → `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc`  
Context: `docs/security/ETH_MAINNET_OLD_WALLET_UNTRUSTED_V1.md` · blocker **B-02**

**Policy language:** Safe is the **designated** governance identity. Do **not** claim Safe owns all Ownable contracts until fresh RPC + transfer evidence exist.

---

## 4. Recovery assumptions

| Assumption | State |
| --- | --- |
| Social recovery module in lineage | Acknowledged |
| Production-authorized | **No** — `CREATED_NOT_AUTHORIZED` |
| Signature recovery completion | Required before “may sign” narratives |
| Recovery smuggling mint/liquidity | **Forbidden** |
| Merge of recovery code = enablement | **No** |

Operator sequence (inspection only): specimen accepted → no secrets → official Safe UI / correct chain → open ≠ sign → post-open receipt → separate recovery completion before signing claims.

Refs: `docs/governance/GUARDIAN_HUMAN_SAFE_OPEN_READINESS_GATE_V1.md`, `docs/governance/POST_GUARDIAN_NO_ADVANCE_LOCK_V1.md`, recovery runbook receipts under `receipts/governance/`.

---

## 5. Signer rotation policy

| Rule | Policy |
| --- | --- |
| Rotation mechanism | Safe-native owner management with threshold |
| Agent/repo rotation | **Forbidden** |
| Compromised owner | Remaining owners remove via Safe UI; sealed incident receipt after on-chain action |
| Public owner list | Only with disclosure authorization |
| Hardware wallets | Preferred; readiness ≠ economic authorization |

---

## 6. Emergency procedure (outline)

1. Stop agents from chain-adjacent work.  
2. Confirm chain **16661** and Safe address match this document.  
3. Open official Safe UI only under Safe-open readiness rules.  
4. If Ownable residual remains untrusted wallet: **do not assume** Safe can pause those contracts.  
5. Seal incident facts (no secrets).  
6. Keep commercial gates closed unless a separate GO receipt exists.

This policy cannot invent pause powers the Safe does not hold on-chain.

---

## 7. What requires governance approval

| Action | Requirement |
| --- | --- |
| Public mint open | GO receipt superseding Phase 19 NO-GO |
| Controlled mint execution | Named-action authorization + non-review-only path |
| Liquidity seed / commercial DEX open | Separate liquidity authorization |
| Yield / staking / bridge / treasury | Per-gate authorization |
| Ownable ownership transfer | Human-led + post-transfer RPC evidence |
| Social recovery enablement | Completion + authorization seals |
| Safe owner add/remove | On-chain Safe threshold |
| Publish owner EOAs | Explicit disclosure decision |
| Agent production signing | **Never** under Living Forge bounds |

### Reconciliation does **not** authorize (still)

mint · staking · liquidity · bridge · treasury · yield · agent_authority → `NOT_AUTHORIZED_BY_THIS_RECEIPT`  
(`receipts/governance/guardian-authority-reconciliation-v1.json`)

---

## 8. Mint authority boundaries (preview — Phase 8.3 explains fully)

| Bound | State |
| --- | --- |
| `mint_allowed` | false |
| `public_mint_active` | false |
| Phase 19 | `SEALED_REVIEW_NO_GO` / `DO_NOT_EXECUTE_PUBLIC_MINT` |
| Phase 33 | `NO_GO_PUBLIC_MINT_EXECUTION_NOT_AUTHORIZED` |
| Live execution script | null |

**Phase 8.2 does not enable mint.** Phase 8.3 may only **explain** who could authorize it and which gates are unmet.

---

## 9. Liquidity authorization boundaries

| Bound | State |
| --- | --- |
| Pair exists | Yes (technical) |
| Reserves | Zero (probe) |
| Liquidity authorized | **No** |
| “Empty pool looks unfinished” | Incorrect — intentional restraint |

No liquidity scripts, funding, or router calls in this package.

---

## 10. Phase map

```text
8.0 EDGE_READY                              ✅ main
8.1 Public readiness evidence               ✅ main (#628)
Genesis verification package                ✅ main (#629)
8.2 Safe / social recovery policy           ← THIS PACKAGE
8.3 Mint authority explanation              next (docs only)
Controlled activation review                later
DEX / liquidity commercial open             ⛔ until governance gate opens
```

---

## 11. Safe language

**Use:** Guardian Safe `0x8d088B…4389` is the accepted governance multisig on Aristotle (16661). Threshold and owner EOAs are verified in Safe UI and not fully published here. Social recovery is not production-authorized. Ownable residual remains documented. Mint and liquidity are not authorized by this policy.

**Avoid:** “Safe controls all admin,” “recovery is live,” invented N-of-M, “recovery complete → mint.”

---

## Evidence index

| Artifact | Path |
| --- | --- |
| Genesis status | `docs/ACTIVATION_STATUS.md` |
| Phase 8.1 report | `docs/evidence/PUBLIC_READINESS_REPORT_V1.md` |
| Phase 7 intake | `receipts/governance/phase-7-guardian-address-intake-v1.json` |
| Reconciliation | `receipts/governance/guardian-authority-reconciliation-v1.json` |
| Deploy residual | `contracts/DEPLOYED_ADDRESSES.md` |
| Security boundaries | `docs/SECURITY_BOUNDARIES_V1.md` |

---

*Phase 8.2 — institutional trust through documented restraint.*
