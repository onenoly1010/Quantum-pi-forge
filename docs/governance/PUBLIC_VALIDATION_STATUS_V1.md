# Quantum Pi Forge Public Validation Status v1

Timestamp: 2026-06-17T16:30:00Z  
Status: PUBLIC_VALIDATION_OPEN  
Reviewer entry point: GitHub Issue #328

## Operating Baseline

Quantum Pi Forge has completed its verified genesis activation on 0G Aristotle Mainnet.

Core deployment receipts, DEX infrastructure, pair sealing, public proof, funding plan, liquidity readiness gates, dependency remediation, and wallet-risk boundaries are documented.

Liquidity, approvals, staking, relayer flows, participant growth loops, and any treasury-seeding actions remain intentionally blocked until validation and funding conditions are satisfied.

This document is the public review surface for the current boundary.

## What Is Live

The verified genesis activation has been completed on 0G Aristotle Mainnet.

Recorded genesis activation contracts:

- OINIO Token: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58
- Model Registry: 0x67aD7169184581f23D1E10B39d4eb4e98293E87a
- Heartbeat Monitor: 0x5E50b92E57e854659f7D98c733088aABd551C49F

Recorded birth block:

- 36,214,213

The repo contains sealed verification receipts and public proof artifacts for the genesis activation and follow-on governance lanes.

## What Is Documented But Still Gated

The following areas are documented but must remain gated until validation clears:

- Liquidity funding
- W0G / USDC.e funding actions
- Token approvals
- Staking
- Relayer or gasless execution paths
- Participant growth loops
- Any automated oracle or autonomous growth activation
- Any future operator wallet actions

No one should interpret the current state as an instruction to fund, approve, stake, bridge, swap, or seed liquidity.

## DEX / Pair Status

DEX infrastructure and pair-sealing work are documented as part of the current governance surface.

The current validation posture is:

- Pair and DEX evidence may be reviewed.
- Funding is not complete.
- Liquidity is not seeded.
- Approval execution remains blocked.
- Any future liquidity action requires a fresh safe wallet, explicit preflight, and operator confirmation.

## Old Wallet Security Boundary

The old ETH wallet is frozen as compromised or untrusted.

Old wallet:

- 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

Observed outgoing address:

- 0x541B9034C82D7Fb564F12cA07037947ff5b4eF2f

Observed outgoing transaction:

- 0x1fec3b41314e5066a2771ea608f6ed09580e10f45605838016f970394f40e7fd

Boundary:

- Do not fund the old wallet.
- Do not approve from the old wallet.
- Do not use the old wallet for liquidity.
- Do not use the old wallet for swaps.
- Do not use the old wallet for future QPF operator actions.
- Treat it as historical and read-only only.

Canonical security files:

- docs/security/ETH_MAINNET_OLD_WALLET_UNTRUSTED_V1.md
- receipts/security/eth-mainnet-old-wallet-untrusted-v1.json
- docs/security/SUSPICIOUS_ADDRESS_REPO_CAUSALITY_CHECK_V1.md
- receipts/security/suspicious-address-repo-causality-check-v1.json

## Reviewer Instructions

Reviewers should focus on these questions:

1. Do the receipts match the claims?
2. Are any activation, liquidity, approval, or broadcast paths unintentionally open?
3. Are old-wallet references safely quarantined to security docs and receipts?
4. Are public claims clear, restrained, and verifiable?
5. Are any docs overstating what is currently live?
6. Is the funding/liquidity path clearly separated from the compromised or untrusted old wallet?

Primary public review thread:

- GitHub Issue #328

## Plain-English Summary

Quantum Pi Forge proves that a digital launch happened, was checked, was recorded, and was not quietly changed afterward.

The system is live enough to be reviewed, but not open for liquidity, staking, approvals, or growth-loop activation yet.

The current phase is public validation.

## What Happens After Validation

Only after validation clears should the project move to:

1. Fresh funding wallet confirmation.
2. W0G / USDC.e funding preflight.
3. Allowance and approval preflight.
4. Liquidity seed.
5. Participant onboarding.
6. Staking, relayer, and growth-loop activation.

Until then, the correct posture is:

Review the proof. Verify the gates. Confirm the boundary.
