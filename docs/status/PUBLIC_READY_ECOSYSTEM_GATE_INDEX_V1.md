# Public-Ready Ecosystem Gate Index V1

## Current State

This document summarizes Phase 8 through Phase 17 as the single authoritative reference for all public-facing gates, public pages, and governance receipts.

---

## Phase 8 — Human Explanation Closure

* Status: CLOSED ON MAIN
* Commit: 5f490d6
* Receipt: `receipts/governance/phase-8-human-onboarding-main-closure-v1.json`

Artifacts:
- deploy/human-onboarding.html
- deploy/why-this-matters.html
- docs/human-onboarding-explanation-v1.md

---

## Phase 9 — Mint Policy Readiness

* Status: MINT_POLICY_REQUIRED
* Receipt: `receipts/governance/public-mint-policy-readiness-v1.json`

Policy questions remain open:
- What can be minted?
- Who can mint?
- Is it public, allowlist, guardian-only, or disabled?
- Does it cost anything?
- Where do funds go?
- What metadata is attached?
- What receipt proves a mint is authorized?
- What wallet warning must users see?
- What contract address is canonical?

Required decisions:
- Public mint authorization: NOT AUTHORIZED
- Public mint button: NOT LIVE
- Mint surface: exists, unauthenticated
- Wallet execution: NOT ENABLED
- Funds flow: NOT DEFINED
- Receipt: NOT SEALED

---

## Phase 10 — Public Mint Status Page

* Status: PAGE LIVE
* File: `mint-status.html`

Messaging:
- Minting is not currently public
- The project has a registry / mint surface
- Public minting requires governance authorization
- No funds are required right now
- No seed phrase or private key will ever be requested
- Do not trust fake mint links

---

## Phase 11 — Disabled Mint Interface

* Status: UI LOCKED
* File: `mint.html`

Displayed info:
- Network: 0G Aristotle Mainnet
- Contract: OINIOModelRegistry
- Status: Public mint disabled
- Mint button: disabled
- Reason: awaiting governance authorization

Safety rules enforced:
- No automatic wallet popup
- No automatic transaction
- No funds requested
- No seed phrase
- No private key

---

## Phase 12 — Guardian / Governance Authorization

* Status: AUTHORIZATION_PENDING
* Receipt: `receipts/governance/public-mint-authorization-v1.json`

Guardian Safe:
- Address: 0x8d088B88219D072aB035502065ee2410c2cb4389
- Role: governance_authorization_gate

Required before public mint opens:
- Public mint authorized: YES (not yet sealed)
- Who authorized it: Guardian / governance path
- What contract: exact address
- What chain: 0G Aristotle Mainnet, chain 16661
- What supply/rules: defined
- What fee: defined, even if zero
- What metadata: defined
- What risk warning: defined

---

## Phase 13 — First Controlled Mint

* Status: CONTROLLED_MINT_APPROVAL_REQUIRED
* Receipt: `receipts/execution/first-controlled-mint-v1.json`
* Pre-execution authorization: `receipts/governance/controlled-mint-approval-and-stake-risk-v1.json`

Context: The first controlled mint requires OINIO token approval and transfer because registerModel() requires stakeAmount > 0 and calls transferFrom.

Required wallet actions:
- approve OINIO spend for registry contract
- call registerModel with positive stakeAmount
- OINIO transferred from caller to registry
- ERC721 NFT minted to caller

Guardian Safe: 0x8d088B88219D072aB035502065ee2410c2cb4389

Required approvals:
- Guardian authorization for first controlled mint
- Explicit approval for OINIO token movement
- Stake amount definition
- Recipient confirmation
- Metadata URI confirmation

Rules:
- One mint only
- Known recipient
- Known metadata
- Known contract
- Known transaction hash
- Receipt required after execution
- No public announcement until verified

Required receipt fields:
- tx hash
- block number
- chain id
- contract address
- recipient
- token id / model id
- metadata reference
- operator confirmation

---

## Phase 14 — Public Mint Opening

* Status: PENDING_CONTROLLED_MINT_VERIFICATION
* Receipt: `receipts/governance/public-mint-open-v1.json`

Public status when authorized: PUBLIC_MINT_READY

Website will then show:
- Connect wallet
- Review contract
- Review network
- Confirm mint

Hard warnings:
- Never enter seed phrase
- Never send funds manually
- Only use the official site
- Verify contract address

---

## Phase 15 — Liquidity Readiness

* Status: LIQUIDITY_NOT_AUTHORIZED
* Receipt: `receipts/governance/liquidity-policy-readiness-v1.json`

Clarification: Current OINIO token amount in wallet does not mean liquidity exists.

Liquidity requirements (all must be satisfied before authorization):
- DEX pair
- Paired asset
- Price/range decision
- Treasury policy
- Guardian approval
- Slippage/risk explanation
- Public warning
- Transaction hash

---

## Phase 16 — Staking Readiness

* Status: STAKING_NOT_AUTHORIZED
* Receipt: `receipts/governance/staking-policy-readiness-v1.json`

Questions to answer before authorization:
- What is staked?
- What rewards exist?
- Where rewards come from?
- Can users withdraw?
- What are the risks?
- Is there a lock period?
- Is it audited?

---

## Phase 17 — Bridge Readiness

* Status: BRIDGE_NOT_AUTHORIZED
* Receipt: `receipts/governance/bridge-policy-readiness-v1.json`

Questions to answer before authorization:
- What chain to what chain?
- What contract locks/burns/mints?
- What fee?
- Who controls bridge?
- What happens if bridge fails?

---

## Gate Summary

| Phase | Title | Status |
|-------|-------|--------|
| 8 | Human Explanation Closure | CLOSED ON MAIN |
| 9 | Mint Policy Readiness | MINT_POLICY_REQUIRED |
| 10 | Public Mint Status Page | PAGE LIVE |
| 11 | Disabled Mint Interface | UI LOCKED |
| 12 | Guardian / Governance Authorization | AUTHORIZATION_PENDING |
| 13 | First Controlled Mint | CONTROLLED_MINT_APPROVAL_REQUIRED |
| 14 | Public Mint Opening | PENDING_CONTROLLED_MINT_VERIFICATION |
| 15 | Liquidity Readiness | LIQUIDITY_NOT_AUTHORIZED |
| 16 | Staking Readiness | STAKING_NOT_AUTHORIZED |
| 17 | Bridge Readiness | BRIDGE_NOT_AUTHORIZED |

---

## Confirmation

1. All Phase 8-17 gates are explicitly closed or pending.
2. No public mint, token sale, liquidity launch, staking rewards, or bridge deployment is enabled.
3. The next executable gate is **first controlled mint verification only after authorization** (Phase 13).
4. All public-facing pages and receipts are accounted for in their respective phases.