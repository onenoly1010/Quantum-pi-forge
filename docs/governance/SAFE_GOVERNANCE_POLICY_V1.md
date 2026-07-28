# SAFE Governance Policy v1

```text
STATUS: GOVERNANCE POLICY ONLY

No mint activation.
No liquidity activation.
No economic launch.
No treasury movement.
No owner-key execution.

This document establishes policy boundaries and verification requirements.
```

**Phase:** 8.2  
**Created:** 2026-07-28T17:45:58Z  
**Base main:** `4a8e66b` (Genesis Verification Package #629)  
**Mode:** DOCUMENTATION / POLICY ONLY  

---

## 1. Purpose

The Safe Guardian exists to protect QPF / OINIO from:

- unilateral commercial activation  
- narrative or deployer-convenience authority  
- accidental mint, liquidity, bridge, or treasury actions  
- AI or automation paths that skip human governance  

It is the **expected authority reference** for future governed actions. It is **not** a blanket execution key for agents, scripts, or public UIs.

This policy demonstrates that **restraint is encoded**, not merely claimed.

---

## 2. Current State

### Network

| Field | Value |
|-------|--------|
| Network | 0G Aristotle Mainnet |
| Chain ID | `16661` |
| RPC | `https://evmrpc.0g.ai` |
| Explorer | https://chainscan.0g.ai |

### Safe address

| Field | Value |
|-------|--------|
| Safe Guardian | `0x8d088B88219D072aB035502065ee2410c2cb4389` |
| Public surface | https://quantumpiforge.com/deployed-addresses |
| Live bytecode | Confirmed present (Genesis / Phase 8.1 probes) |
| Reconciliation | `GUARDIAN_AUTHORITY_RECONCILED` |

### Threshold / owners

| Field | Public policy |
|-------|----------------|
| Owner addresses | **Not published** (status page: private) |
| Threshold | **Not sealed as public constant** in this policy |
| Threshold status | `NEEDS_SAFE_UI_VERIFICATION` before any production claim |
| Social recovery | **Created, not production-authorized** |

**Rule:** This document does **not** invent owner lists or thresholds. Future publication of threshold (without doxxing owners if undesired) requires a separate human-authorized disclosure receipt.

### Current permissions (from sealed reconciliation)

Guardian Authority Reconciliation asserts that **this receipt alone** does **not** authorize:

| Domain | Status |
|--------|--------|
| Mint | NOT_AUTHORIZED_BY_THIS_RECEIPT |
| Staking | NOT_AUTHORIZED_BY_THIS_RECEIPT |
| Liquidity | NOT_AUTHORIZED_BY_THIS_RECEIPT |
| Bridge | NOT_AUTHORIZED_BY_THIS_RECEIPT |
| Treasury movement | NOT_AUTHORIZED_BY_THIS_RECEIPT |
| Yield routing | NOT_AUTHORIZED_BY_THIS_RECEIPT |
| Agent authority | NOT_AUTHORIZED_BY_THIS_RECEIPT |

### Recovery / advance locks

- Post-Guardian **NO_DOWNSTREAM_ADVANCE** remains a live governance concept: downstream financial gates stay blocked until human-sealed recovery completion (when applicable).  
- Signature recovery may still report required/incomplete states in historical receipts — treat recovery as **not complete** until a dedicated completion receipt says otherwise.

### Deployed contracts (context only)

Core technical presence is documented in:

- `docs/CONTRACT_REGISTRY_V1.md`  
- `docs/GENESIS_VERIFICATION_V1.md`  
- `docs/evidence/PUBLIC_READINESS_REPORT_V1.md`  

Safe policy does **not** re-authorize any of those contracts for commercial use.

---

## 3. Authorized Actions

Actions that **require** governance approval via Safe (or equivalent multi-party process) **before** execution:

| Class | Examples | Notes |
|-------|----------|--------|
| Parameter governance | Policy changes to mint, pause, fee, allowlists | Separate GO receipt required |
| Controlled economic actions | Named mint, named transfer, named liquidity | Exact scope only |
| Recovery operations | Owner rotation, social recovery enablement | Production auth required |
| Emergency controls | Pause / freeze if implemented | Documented procedure + evidence |
| Authority handoffs | Agent scopes, operator grants | Never open-ended |

**None of the above are authorized by publishing this policy.**

### Approval conditions (minimum)

Any future Safe-controlled action must have:

1. **Named action** (one clear purpose)  
2. **Human approval record** (who, when, scope)  
3. **Evidence pack** (see §5)  
4. **Phase gate** that explicitly allows that class  
5. **No silent expansion** into mint/liquidity/treasury without a new GO  

---

## 4. Forbidden Actions Without Phase Authorization

The following are **forbidden** until a later phase issues an explicit GO receipt (and still only for the named scope):

| Forbidden without GO | Rationale |
|----------------------|-----------|
| Public mint enablement / opening | Commercial activation |
| Controlled mint live execution | Requires B-path GO + signing auth |
| Liquidity provisioning | Commercial market event |
| Token distribution campaigns | Economic launch |
| Treasury transfers | Fund movement |
| Staking activation | Economic launch |
| Bridge activation | Cross-domain risk |
| Yield / earnings execution | Downstream of liquidity + controls |
| Owner-key solo execution as “policy” | Bypasses multisig intent |
| AI/agent unsupervised chain execution | Agent authority denied by default |
| Unlimited approvals / open-ended spending | Scope explosion |
| Publishing owner private keys or seeds | Security failure |

Site and agent paths must not treat Safe presence as permission to act.

---

## 5. Evidence Requirements

Every future Safe-related or Safe-authorized chain action must include:

| Required evidence | Description |
|-------------------|-------------|
| Transaction hash | On-chain id of execution |
| Block reference | Block number (and chain id 16661) |
| Approval record | Human/governance decision artifact |
| Verification receipt | Machine- or human-verified post-state |
| Scope statement | Exact functions, addresses, amounts |
| Negative scope | Explicit “not included” list |

Recommended receipt fields:

```text
chain_id
safe_address
named_action
approvers_or_approval_receipt_ref
tx_hash
block_number
pre_state_summary
post_state_summary
boundaries.mint / liquidity / treasury / ... = false unless in scope
```

Without these, the action is **not** considered governance-complete for public claims.

---

## 6. Phase Transition Rules

```text
Technical activation ≠ commercial activation.
Safe exists ≠ Safe may spend or mint.
Policy published ≠ execution authorized.
```

| Transition | Rule |
|------------|------|
| Genesis verification live | Proves inspectability; no economic unlock |
| This policy (8.2) | Encodes Safe restraint; no execution |
| Mint authority explanation (8.3) | Documents who can mint and constraints; no mint open |
| Controlled mint GO | Named execution only |
| Public mint open | Separate policy flip + site update |
| Liquidity event | Separate authorization + funding |
| Yield | After mint controls + liquidity maturity |

**Downstream financial gates do not advance** solely because contracts are live or because this policy was merged.

---

## 7. Relationship to public surfaces

| Surface | Message |
|---------|---------|
| deployed-addresses | Safe live; owners private; minting/signing/broadcast disabled on page |
| mint / mint-status | Public mint disabled |
| Genesis Verification Package | Stranger can verify existence + disabled state |
| This policy | Stranger can verify **governance restraint** around Safe |

---

## 8. Seal Record

```text
SAFE_GOVERNANCE_POLICY_V1_SEALED
```

| Field | Value |
|-------|--------|
| Document | `docs/governance/SAFE_GOVERNANCE_POLICY_V1.md` |
| Receipt | `receipts/governance/phase-82-safe-governance-policy-v1.json` |
| Report | `reports/governance/phase-82-safe-governance-policy-v1.txt` |
| Base commit at authoring | `4a8e66b` (PR #629 Genesis Verification Package) |
| Branch | `phase82/safe-governance-policy-v1` |
| Timestamp (UTC) | 2026-07-28T17:45:58Z |
| Local verify:evidence | Required PASS before merge |
| Local build | Required PASS before merge |
| PR number | *(filled at merge)* |

### Seal assertions

```text
NO_MINT_ACTIVATION
NO_LIQUIDITY_ACTIVATION
NO_ECONOMIC_LAUNCH
NO_TREASURY_MOVEMENT
NO_OWNER_KEY_EXECUTION
NO_SIGNING
NO_BROADCAST
```

---

## 9. Next

**Phase 8.3 — Mint Authority Explanation** (documentation only): who can mint, under what conditions, and how power is constrained — without enabling mint.

---

*End of SAFE Governance Policy v1 — restraint encoded as policy.*
