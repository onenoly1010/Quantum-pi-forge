# Human Onboarding Explanation v1

**Purpose:** Explain the human onboarding process to regular people, builders, reviewers, and funders.

**Status:** ACTIVE — Phase 8

---

## What Is Human Onboarding?

Human onboarding is the process of recording a human-provided wallet address into the Quantum Pi Forge governance system. The wallet is stored with a role label describing its purpose. No funds move. No custody transfers. No private keys are requested. The entire process produces sealed, verifiable receipts.

---

## The Process (Simple)

1. **Wallet provided** — A person shares their public wallet address.
2. **Role selected** — The wallet is assigned a role (supporter, builder, observer, donor, foundation candidate, trust candidate, or personal support).
3. **Permission recorded** — The provider confirms control and sets permission boundaries.
4. **Receipt sealed** — A JSON receipt is created, committed to the repository, and published to the public site.
5. **Policy applied** — The Wallet Onboarding Policy v1 explicitly states what this receipt does **not** authorize.
6. **Milestone sealed** — A governance receipt confirms the onboarding is complete.

---

## Security Guarantees

| Guarantee | Detail |
|-----------|--------|
| **No Custody** | QPF never takes custody of any wallet. The provider retains full control. |
| **No Private Keys** | QPF never requests, stores, or accesses private keys, seed phrases, recovery words, or passwords. |
| **No Automatic Funds Movement** | A receipt does not trigger fund movement, signing, staking, minting, bridging, or any on-chain action. |
| **Roles Are Metadata First** | A role label describes intent, not authority. Changing a role requires a new explicit permission receipt. |
| **Every Unlock Requires a New Receipt** | Anything beyond read-only onboarding requires a separate receipt with explicit scope, human approval, and required verification steps. |
| **Financial Exposure: Zero** | Onboarding a wallet creates no financial exposure. No money moves. |

---

## What Onboarding Does NOT Authorize

A wallet onboarding receipt explicitly does not authorize:

- BTC sends
- OINIO transfers
- OINIO pairing
- Liquidity creation or funding
- Treasury routing or distribution
- Staking or delegation
- Minting
- Bridge activity
- Public foundation authority claims
- Public identity claims (e.g., "this wallet belongs to Kris")
- Guardian or Safe authority claims

---

## Wallet Roles

| Role | Description | Implies Authority? |
|------|-------------|-------------------|
| supporter_wallet | Someone supporting the project | No |
| builder_wallet | Someone contributing work | No |
| observer_wallet | Watching governance or activity | No |
| donor_wallet | Provided past support | No |
| foundation_candidate_wallet | Under consideration for a foundation role | No (pending verification) |
| trust_candidate_wallet | Under consideration for a trust-related role | No (pending verification) |
| personal_support_wallet | Personal support from an individual | No |

---

## Optional Future Unlocks

These actions are not currently available. Each would require:

1. A separate receipt
2. Explicit approval
3. Required verification steps

### Signed Bitcoin Message Verification
The wallet provider could optionally sign a message proving they control the wallet. This produces a verification receipt without authorizing fund movement.

### Public/Private Permission Update
A wallet's role or visibility could be updated with signed permission from the provider and a new receipt.

### EVM Wallet Pairing Record
An EVM-compatible wallet (OINIO, Ethereum) could be paired with a Bitcoin wallet as a metadata relationship record — not a bridge or transfer.

### Safe-Controlled Support Vault Design
A multi-signature vault could be designed to accept support contributions. The design would be verified and receipted before any deployment or funding.

---

## Current Applied Case

| Field | Value |
|-------|-------|
| **Wallet** | `bc1qmcmz4xp5ean3mne3xwylke4xsc7h5n2x83u28f` |
| **Chain** | Bitcoin |
| **Role** | `personal_support_wallet` |
| **Controller** | Yoko |
| **Status** | Onboarded read-only |
| **Financial Exposure** | Zero |
| **Evidence Verification** | PASS 5/5 |
| **Policy** | Wallet Onboarding Policy v1 |
| **Receipt** | `receipts/governance/oinio-personal-support-wallet-onboarding-v1.json` |

This wallet is:
- **NOT** recorded as a foundation wallet
- **NOT** an Imagine Foundation wallet
- **NOT** a wallet-for-Kris
- **NOT** an OINIO pairing
- **NOT** liquidity
- **NOT** treasury routing

---

## Reusable Template

A reusable onboarding receipt template is available at:

`scripts/human-onboarding-receipt-template.json`

To onboard a new wallet:

1. Copy the template to `receipts/governance/{wallet-identifier}-onboarding-v1.json`
2. Fill in the wallet address, chain, role, controller name, and permission statements
3. Verify all safety assertions remain true
4. Commit with a descriptive message
5. Seal the milestone with a governance receipt

---

## Standing Principle

> Trust can be honored without movement.
> Support can be recorded without custody.
> Verification comes before value flow.

---

## References

- Wallet Onboarding Policy: `docs/governance/WALLET_ONBOARDING_POLICY_V1.md`
- Receipt Template: `scripts/human-onboarding-receipt-template.json`
- Public page: `/human-onboarding.html`
- Example receipt: `receipts/governance/oinio-personal-support-wallet-onboarding-v1.json`
- Milestone seal: `receipts/governance/first-external-human-wallet-onboarding-v1.json`