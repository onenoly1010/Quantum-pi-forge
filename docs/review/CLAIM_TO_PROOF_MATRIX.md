# Quantum Pi Forge Claim-to-Proof Matrix

**Status:** Canonical Reviewer Matrix v1  
**Date:** June 2026  
**Purpose:** Compress public review into verifiable, pending, disabled, archive, and aspirational claims.

## Classification Standard

| Status | Meaning |
| --- | --- |
| Verifiable | A reviewer can execute, inspect, or reproduce the claim from public artifacts. |
| Pending | The claim is intended but not yet fully proven through public artifacts. |
| Disabled | The flow is intentionally inactive until verification is complete. |
| Archive | Historical context only; not current operational canon. |
| Aspirational | Directional vision; not a present operational claim. |

## Matrix

| Claim | Status | Proof Path / Required Evidence |
| --- | --- | --- |
| Quantum Pi Forge has a durable public development history | Verifiable | Public GitHub repositories, commit history, repo tree, branch/PR trail |
| `quantum-pi-forge-fixed` is the active public canon | Verifiable | Repository README classification and current reviewer docs |
| `pi-forge-quantum-genesis` is historical genesis context | Archive | Repository README/archive classification |
| OINIO Soul System emphasizes local-first privacy | Verifiable | Local-only storage, deterministic behavior, encryption docs, build/run instructions |
| OINIO Soul System avoids telemetry by design | Verifiable | Source inspection and README claims; reviewer should confirm runtime behavior locally |
| OINIO contracts exist as ERC-20 / ERC-721 style implementations | Verifiable | Contract source, Foundry/OpenZeppelin setup, tests, deployment scripts |
| OINIO contracts are deployed and verified on every claimed chain | Pending | Requires canonical deployed-address file with chain ID, address, tx hash, block, explorer, ABI hash, compiler settings, bytecode match |
| Staking is live and economically active | Disabled | Public site currently indicates staking execution is disabled pending verification |
| Wallet signing / relayer execution is active | Disabled | Public site currently indicates these flows are disabled pending verification |
| Liquidity pool is deployed and active | Pending / Disabled | Requires LP address, chain ID, tx hash, liquidity proof, and public verification |
| iNFT minting is live | Partial / Pending verification | Requires contract address, tx hash, chain ID, explorer link, and reproducible mint proof |
| 0G Aristotle integration exists | Partial / Pending | Requires RPC proof bundle, block reference, tx receipts, scripts, and reproducible verification output |
| Public site accurately discloses pending/disabled economic state | Verifiable | Site review against current public disclosures |
| Full autonomous network exists today | Aspirational | Requires independent multi-node operation, sustained runtime receipts, failure recovery proof, and governance/authority boundaries |
| QPF leads in safe autonomous-network framing | Interpretive | Supported by evidence-first posture, disabled states, local replay, and claim classification discipline |
| QPF is production-ready in every layer | Not current canon | Older architecture language must be bounded by current matrix and disabled-state disclosures |


## Site Integration Note

The live site should link to `REVIEWER_START_HERE.md` and this matrix from a visible trust, footer, or reviewer section during the next deploy.

## Reviewer Conclusion

Quantum Pi Forge should currently be reviewed as:

> A serious sovereign AI/blockchain infrastructure prototype transitioning from narrative constellation to verifiable protocol surface.

The project is credible because it exposes boundaries, disables unverified economic flows, and increasingly routes claims through evidence.

The project should not be described as a fully autonomous, economically active network until public proof demonstrates that state.

## Next Required Proof Artifacts

1. `contracts/DEPLOYED_ADDRESSES.md`
2. Published `verify-all.sh` output bundle
3. JSON verification receipts
4. Bytecode verification records
5. Site link to this matrix
6. Independent reviewer run log
