# Pre-Deployment Governance Gate — Yield-Routing Contracts V1

**Lane:** yield-routing pre-deployment gate v1  
**Mode:** REVIEW-ONLY / NO LIVE EXECUTION  
**Status:** GATE_DEFINED (deployment prerequisites codified, no execution)  
**Canon:** `main` @ `7f36daa`  
**Generated:** 2026-06-23 04:27 UTC-6

---

## 1. Purpose

Define the complete set of prerequisites that MUST be satisfied before any yield-routing contract (FeeCollector, LegacyVault, PioneerRewards, OperationalTreasury) is deployed to 0G Aristotle Mainnet.

This document does NOT perform deployment. It defines what must be true before deployment is authorized.

---

## 2. Human Approval Gate

**REQUIRED.** No deployment may proceed without explicit, recorded human approval.

### 2.1 Approval Requirements

| Requirement | Detail |
|-------------|--------|
| Approver | Primary Sovereign Steward or designated Ennead Council member |
| Form | Signed message or recorded vote in governance channel |
| Content | Must specify: which contracts, which chain, expected block range |
| Timestamp | Must be after this gate document is merged to `main` |
| Record | Must be linked in closure receipt for the deployment PR |

### 2.2 Approval Template

```
I, [name/role], approve deployment of:
- FeeCollector to 0G Aristotle Mainnet (chain 16661)
- LegacyVault to 0G Aristotle Mainnet
- PioneerRewards to 0G Aristotle Mainnet
- OperationalTreasury to 0G Aristotle Mainnet

Deployment window: block [X] to [Y] (must be >= 1,850,000)
Expected constructor args: [recorded below]
Approval timestamp: [ISO 8601]
Signature: [signature or governance vote reference]
```

---

## 3. Deployment Parameters (Frozen Before Deployment)

### 3.1 Chain Confirmation

| Parameter | Value | Source |
|-----------|-------|--------|
| Chain name | 0G Aristotle Mainnet | `docs/0G_SHIP_SKILL_REFERENCE.md` |
| Chain ID | `16661` | `docs/0G_SHIP_SKILL_REFERENCE.md` |
| RPC URL | `https://evmrpc.0g.ai` | `docs/0G_SHIP_SKILL_REFERENCE.md` |
| Explorer | `https://chainscan.0g.ai` | `docs/0G_SHIP_SKILL_REFERENCE.md` |
| EVM version | `cancun` | 0G Ship Skill requirement |
| Solc version | `0.8.24` | `contracts/foundry.toml` |

### 3.2 Constructor Arguments (Frozen)

Each contract's constructor args must be recorded and verified before deployment:

**FeeCollector:**
```json
{
  "legacyVault": "[address or 'deploy second']",
  "pioneerRewards": "[address or 'deploy third']",
  "operationalTreasury": "[address or 'deploy fourth']",
  "guardian": "[Ennead multisig address]"
}
```

**LegacyVault:**
```json
{
  "feeCollector": "[FeeCollector address after deployment]"
}
```

**PioneerRewards:**
```json
{
  "feeCollector": "[FeeCollector address]"
}
```

**OperationalTreasury:**
```json
{
  "feeCollector": "[FeeCollector address]",
  "guardians": "[array of 5-7 guardian addresses]"
}
```

---

## 4. Pre-Deployment Verification Checklist

### 4.1 Code Verification

- [ ] `forge build` passes with no errors (warnings acceptable)
- [ ] `forge test` passes all 45 tests
- [ ] Source commit hash pinned: `7f36daa` or later `main` commit
- [ ] No uncommitted changes in `contracts/src/` or `contracts/test/`
- [ ] Bytecode hash recorded for each contract (from `forge inspect <name> bytecode | sha256sum`)
- [ ] ABI hash recorded for each contract (from `forge inspect <name> abi | sha256sum`)

### 4.2 Wallet Verification

- [ ] Deployer wallet address confirmed and recorded
- [ ] Wallet balance confirmed >= estimated deployment cost + buffer
- [ ] Balance check command: `cast balance <ADDRESS> --rpc-url https://evmrpc.0g.ai`
- [ ] Minimum balance: 0.5 0G per contract deployment (~2.0 0G total)
- [ ] No private key exposed in repository, logs, or PR comments
- [ ] Private key stored in secure keystore (e.g., `~/.local/share/everscale/keystore` or hardware wallet)

### 4.3 Network Verification

- [ ] RPC endpoint responsive: `curl -X POST https://evmrpc.0g.ai -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'` returns `{"result":"0x4115"}`
- [ ] Block number >= 1,850,000 (or deployment window is future-dated)
- [ ] Explorer reachable and renders transactions
- [ ] Gas price confirmed reasonable

---

## 5. Deployment Receipt Template

Each deployment MUST produce a receipt matching `YIELD_ROUTING_EVIDENCE_SPEC_V1.md` §2.2:

```json
{
  "evidence_version": "1.0",
  "contract_name": "FeeCollector",
  "chain_name": "0G Aristotle Mainnet",
  "chain_id": 16661,
  "tx_hash": "0x...",
  "block_number": 1850000,
  "block_timestamp": 1748000000,
  "deployer_address": "0x...",
  "contract_address": "0x...",
  "deploy_method": "forge create",
  "constructor_args": "0x...",
  "compiler_version": "v0.8.24",
  "evm_version": "cancun",
  "optimization": true,
  "optimizer_runs": 200,
  "verification_status": "verified",
  "explorer_url": "https://chainscan.0g.ai/address/0x...",
  "eth_getCode_match": true,
  "source_commit": "7f36daa",
  "bytecode_hash": "sha256...",
  "abi_hash": "sha256...",
  "local_verification_command": "forge verify-contract 0x... src/FeeCollector.sol:FeeCollector --chain-id 16661"
}
```

---

## 6. DEPLOYED_ADDRESSES.md Update Rules

Per `YIELD_ROUTING_EVIDENCE_SPEC_V1.md` §5:

1. Evidence JSON file must exist at `evidence/yield-routing/{name}-{chain_id}-{block}.json`
2. `eth_getCode` returns non-empty bytecode matching compiled source
3. Deployment transaction has 12+ block confirmations
4. Explorer link renders verified contract
5. Source commit hash pinned in branch history
6. All required fields populated (no Pending placeholders)

Entry template:
```
| 0G Aristotle Mainnet | 16661 | FeeCollector | [0x...](https://chainscan.0g.ai/address/0x...) | 0x... | 1850000 | Verified |
```

---

## 7. Rollback / Non-Upgrade Consequences

| Decision | Consequence |
|----------|-------------|
| No proxy pattern | Contracts cannot be upgraded; bugs require new deployment + migration |
| Immutable routing | Fee splits cannot be changed after deployment |
| Guardian set mutable only | Treasury guardians can be rotated, but not removed entirely |
| 200-year vault | LegacyVault funds are inaccessible until block 73,050,000 |
| Pause mechanism | FeeCollector and Treasury can be paused by Guardian multisig |

**Rollback is not possible without deploying new contracts and migrating state.**

---

## 8. Dry-Run / Simulation Requirements

Before any live deployment:

- [ ] Dry-run on 0G Galileo Testnet (chain 16602) completed
- [ ] Testnet deployment receipt captured
- [ ] Testnet `eth_getCode` verified
- [ ] Full fee routing flow simulated on testnet
- [ ] Gas costs measured and within expected bounds

---

## 9. Public Claims Lock

Until ALL of the following are true:
- [ ] All 4 contracts deployed with verified evidence
- [ ] Deployment block >= 1,850,000
- [ ] Activation transaction hash captured
- [ ] Fee routing confirmed via on-chain logs
- [ ] `npm run verify:evidence` passes with all evidence files

**Public claims must remain:**
- "earnings architecture: documented/proposed"
- "earnings execution: not claimed live"
- "next gate: verified on-chain transaction hash at/after block 1,850,000"

No public documentation, website, or grant application may claim yield is active.

---

## 10. Safety Assertions

- wallet_actions: false
- private_key_access: false
- signing_attempted: false
- transaction_broadcast: false
- deployment_attempted: false
- live_execution: false
- code_review_only: true
- gate_defined: true
- human_approval_required: true
