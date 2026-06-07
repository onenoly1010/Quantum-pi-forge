# Reviewer Onboarding Packet v2

## Sealed V2 Baseline

This document explains the human review path for the sealed V2 evidence baseline without changing the proof machinery.

Reviewer command:

```bash
npm run verify:evidence
```

## What Is Verified

The proof command runs a 5-step local verification bundle:

1. Evidence index liveness
2. Evidence receipt match
3. Claim map schema validation
4. Claim-map drift guard
5. Evidence snapshot anchor

## Cryptographic Coordinates

| Parameter | Value |
|---|---|
| Trusted Baseline Commit | `7e6281d` |
| Baseline Receipt Hash | `b720d54e7a07b89edd4e7dd20ce6631d5d252bef273e8c59ab62cffa2fd27fb1` |
| Current Sealed Head | `0670e48` |
| Current Receipt Hash | `a63dc16e5f577c808fd495e5a18e87f25006980cf0d84d23b61f5beca57e58fa` |
| Proof Command | `npm run verify:evidence` |
| Expected Step Count | `5` |

## Authority Boundary

This verification path is strictly read-only.

It does not authorize wallet signing, private-key access, token minting, staking execution, chain mutation, governance execution, custody transfer, deployment, cloud provisioning, autonomous posting, or external communication.

## What This Packet Does Not Prove

This packet does not prove external infrastructure status, token liquidity, wallet balances, grant approval, mainnet mutation, governance execution, or third-party endorsement.

It only explains the local evidence verification path for the sealed V2 repository baseline.
