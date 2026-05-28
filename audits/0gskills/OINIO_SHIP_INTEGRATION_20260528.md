# OINIO Ship Skill Integration — 0G Aristotle

Date: 2026-05-28  
Repo commit baseline: `54bc471`  
Network: 0G Aristotle  
Chain ID: `16661`  
RPC: `https://evmrpc.0g.ai`

## Purpose

This document maps the 0G Ship skill workflow into the OINIO deployment pipeline.

The upstream Ship skill is an end-to-end 0G build and deployment playbook covering:

- contract design
- 0G Storage
- 0G Compute
- network configuration
- deployment and verification
- frontend / agent UX
- QA and audit

OINIO follows that structure, but with one important correction:

> The 0G Compute Router is an API / inference routing layer, not an EVM liquidity router contract.

Therefore, OINIO deployments must not require an EVM router unless a real liquidity router contract is explicitly configured, bytecode-verified, and manifest-attested.

## Current OINIO Deployment

OINIO base contract deployed on 0G Aristotle:

- Contract: `0xadcc8626ee5eC94974273aC50C39855a351c36fB`
- Deploy tx: `0x6e285a16b880761588f6923d33ce3620149992e4cbe387edde1cff0415415569`
- Deployer: `0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC`
- Router configured: `false`
- Router address: `not configured`

Public attestation:

- `OINIO_BASE_DEPLOYMENT_ATTESTATION_20260528.md`

## Ship Phase Mapping

### Phase 1 — Design

OINIO keeps these concerns separate:

- On-chain:
  - token state
  - ownership / deployer proof
  - future settlement hooks
  - events for indexing
- 0G Storage:
  - artifacts
  - proofs
  - large model or dataset references
- 0G Compute:
  - inference jobs
  - model routing
  - off-chain agent workflows
  - compute API integration

### Phase 2 — Contracts

OINIO contracts compile with:

- Solidity artifact: `./artifacts/src/OINIO.sol/OINIO.json`
- EVM target: `cancun`
- Artifact bytecode hash:
  - `0xf2aea4b1254c164125db0ce4dbcb0720ec3616e74305eed299de0bd8d6bd570e`

### Phase 3 — Storage and Compute

Storage and compute integration must be added as separate service layers.

Rules:

- Do not overload `OINIO_ROUTER_ADDRESS` for 0G Compute.
- Use explicit names for compute integration, such as:
  - `OG_COMPUTE_ROUTER_URL`
  - `OG_COMPUTE_API_KEY`
  - `OG_COMPUTE_MODEL`
- Keep compute API credentials out of git.
- Keep EVM deployment keys out of git.

### Phase 4 — Network Configuration

Canonical 0G Aristotle deployment settings used by OINIO:

- Chain ID: `16661`
- RPC: `https://evmrpc.0g.ai`
- Explorer: `https://chainscan.0g.ai`

### Phase 5 — Deploy and Verify

OINIO deployment must use the manifest-gated pipeline:

1. `node scripts/preflight-0g-deploy.js`
2. Inspect `cache/deployment-manifest.json`
3. `node scripts/safe-deploy.js`
4. Only after dry-run success:
   - `LIVE_DEPLOY=YES node scripts/safe-deploy.js`

Current safety behavior:

- Missing private key blocks preflight.
- Missing manifest blocks safe deploy.
- Missing `LIVE_DEPLOY=YES` keeps deploy in dry-run mode.
- Missing EVM router now causes router setup to be skipped.
- Provided EVM router must have bytecode and hash verification.

### Phase 6 — Frontend and Agent UX

Frontend and agent integrations should reference:

- deployed OINIO contract address
- chain ID `16661`
- router status `not configured`
- deployment tx hash
- block number from attestation

The UI must not imply liquidity-router support unless an EVM router is later configured and attested.

### Phase 7 — QA, Audit, Launch

Required OINIO launch checks:

- source verification on Chainscan, if supported
- read-only bytecode check
- ERC-20 metadata read check
- Transfer genesis/mint event indexing
- deployment attestation committed
- no cache manifests or receipts committed
- no private keys committed
- production dependency audit reviewed

## OINIO Rule

For OINIO, Ship means:

> Deploy the sovereign base contract first, then integrate storage and compute as separate layers.

It does not mean:

> Force a Uniswap-style router into the base token deployment path.
