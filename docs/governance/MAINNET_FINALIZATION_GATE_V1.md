# Mainnet Finalization Gate v1

## Purpose

Mainnet Finalization Gate v1 reconciles activation-language claims against current proof state before any deploy, stake, mint, participant-growth, quorum, drip, oracle, liquidity, approval, or wallet action is authorized.

This gate exists because the repository contains older activation-facing language that describes staking, iNFT minting, guardian quorum, resonance oracle autonomy, and full activation as live, while current proof surfaces show that several of those claims remain pending, blocked, or missing on-chain proof.

## Boundary

This document is classification-only.

It does not authorize:

- Wallet actions
- Private key use
- Contract deployment
- Staking
- Minting
- Participant activation
- Liquidity seeding
- Approvals
- Drip execution
- Guardian quorum activation
- Resonance oracle autonomy
- Transaction broadcast

## Classification Terms

Each activation claim must be classified as one of:

- `VERIFIED_ONCHAIN`
- `STALE_DOC_CLAIM`
- `MISSING_DEPLOYMENT`
- `BLOCKED_BY_GOVERNANCE`
- `READY_FOR_OPERATOR_APPROVAL`

## Current Classifications

| Claim / Component | Classification | Evidence Need |
|---|---:|---|
| Existing OINIO token deployment | `VERIFIED_ONCHAIN` | Existing execution receipt, deployed address, chain ID, explorer/code proof |
| Existing model registry deployment | `VERIFIED_ONCHAIN` | Existing execution receipt, deployed address, chain ID, explorer/code proof |
| Existing heartbeat monitor deployment | `VERIFIED_ONCHAIN` | Existing execution receipt, deployed address, chain ID, explorer/code proof |
| “All contracts verified” activation-guide language | `STALE_DOC_CLAIM` | Needs current contract-by-contract explorer/source verification |
| Genesis Resonance iNFT minting live | `STALE_DOC_CLAIM` | Claim matrix says partial/pending until tx hash, chain ID, address, explorer link, and reproducible mint proof exist |
| Participant staking path live | `BLOCKED_BY_GOVERNANCE` | Governance status blocks staking and participant growth loops until explicit activation gate approval |
| 10 participant guardian quorum | `BLOCKED_BY_GOVERNANCE` | Requires 10 real consenting participant proofs after staking/minting are approved and live |
| 100 participant resonance oracle autonomy | `BLOCKED_BY_GOVERNANCE` | Requires verified 100 participant state after 10-participant quorum is real |
| 1.5% drip system | `MISSING_DEPLOYMENT` | No deployed drip receipt, contract address, tx hash, source verification, or live read proof found in preflight |
| Mainnet finalization sequence | `READY_FOR_OPERATOR_APPROVAL` | May proceed only as a bounded, explicitly approved execution lane after this gate passes |

## Required Next Proofs

Before any irreversible step:

1. Produce contract-by-contract explorer verification for already deployed contracts.
2. Produce a bounded deployment plan for the 1.5% drip system.
3. Produce a participant activation proof format requiring real, consenting participants.
4. Keep simulated, duplicate, scripted, or non-consenting participant activation invalid.
5. Require explicit operator approval before any live deploy, stake, mint, approval, liquidity, or transaction broadcast.

## Safety Assertions

- `WALLET_ACTIONS=false`
- `PRIVATE_KEY_REQUESTED=false`
- `DEPLOY_ATTEMPTED=false`
- `STAKE_ATTEMPTED=false`
- `MINT_ATTEMPTED=false`
- `TRANSACTION_BROADCAST=false`
- `PARTICIPANT_GROWTH_LOOP_STARTED=false`
- `REPO_MUTATION=true`
