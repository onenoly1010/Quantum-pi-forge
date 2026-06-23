# Evidence Bundle — Yield-Routing Evidence Specification V1

**Lane:** yield-routing evidence specification v1  
**Mode:** REVIEW-ONLY / NO LIVE EXECUTION  
**Status:** SPEC_DEFINED (evidence requirements codified, no deployment)  
**Canon:** `main` @ `1561d45`  
**Generated:** 2026-06-23 03:22 UTC-6

---

## 1. Purpose

Define exact evidence format, block confirmation requirements, contract address proof rules, and `DEPLOYED_ADDRESSES.md` update criteria that must be satisfied before yield-routing contracts are considered verifiably deployed on-chain.

This specification is the bridge between the readiness lane (GATE_FALSE) and a future deployment that produces verifiable evidence. No wallet actions, signing, broadcasts, or live execution are performed in this lane.

---

## 2. Transaction Evidence Format

### 2.1 Required Fields

Every yield-routing deployment transaction MUST produce a receipt that includes:

| Field | Type | Example | Rule |
|-------|------|---------|------|
| chain_name | string | `"0G Aristotle Mainnet"` | Must match canonical name from `docs/0G_SHIP_SKILL_REFERENCE.md` |
| chain_id | uint | `16661` | Must match `0G_SHIP_SKILL_REFERENCE.md` |
| tx_hash | string (0x-prefixed hex) | `"0xabc...123"` | 64 hex characters after `0x` |
| block_number | uint | `1850000` | Must be >= 1,850,000 |
| block_timestamp | uint (Unix) | `1748000000` | Must match explorer |
| from | address | `"0x..."` | Deployer EOA |
| contract_address | address | `"0x..."` | Deployed CREATE/CRE2 address |
| deploy_method | enum | `"forge create"` | One of: forge create, forge script, hardhat, ethers |
| constructor_args | hex \| null | `"0x..."` or null | Raw hex of constructor arguments |
| compiler_version | semver | `"v0.8.28"` | Must match forge --version |
| evm_version | string | `"cancun"` | Per 0G Ship Skill requirement |
| optimization | bool | `true` | Optimizer enabled/disabled |
| optimizer_runs | uint \| null | `200` or null | If optimization=true |
| verification_status | enum | `"verified"` | One of: verified, pending, not_submitted |
| explorer_url | string \| null | `"https://chainscan.0g.ai/tx/0x..."` | Link to explorer page |

### 2.2 Evidence File Format

Each deployment evidence file lives at:

```
evidence/yield-routing/{contract_name}-{chain_id}-{block_number}.json
```

With the following schema:

```json
{
  "evidence_version": "1.0",
  "contract_name": "LegacyVault",
  "chain_name": "0G Aristotle Mainnet",
  "chain_id": 16661,
  "tx_hash": "0x...",
  "block_number": 1850000,
  "block_timestamp": 1748000000,
  "deployer_address": "0x...",
  "contract_address": "0x...",
  "deploy_method": "forge create",
  "constructor_args": "0x...",
  "compiler_version": "v0.8.28",
  "evm_version": "cancun",
  "optimization": true,
  "optimizer_runs": 200,
  "verification_status": "verified",
  "explorer_url": "https://chainscan.0g.ai/address/0x...",
  "eth_getCode_match": true,
  "source_commit": "abc123def",
  "bytecode_hash": "sha256_of_deployed_bytecode",
  "abi_hash": "sha256_of_compiled_abi",
  "local_verification_command": "forge verify-contract 0x... src/LegacyVault.sol:LegacyVault --chain-id 16661"
}
```

---

## 3. Block Confirmation Requirements

| Requirement | Minimum | Rationale |
|-------------|---------|-----------|
| Confirmations before filing evidence | 12 blocks | Matches "first yield pulse within 12 blocks" from GDR-001.2 |
| Finality check | 1 epoch (~15 min) | 0G Aristotle uses instant finality; 12 blocks provides buffer |
| Re-org safety | N/A | 0G Aristotle mainnet has probabilistic finality akin to ETH PoS |
| Explorer visibility | Confirmed block on chainscan.0g.ai | Must render in explorer before evidence is filed |

Evidence MUST NOT be committed until the deployment block has at least 12 subsequent blocks visible on the explorer.

---

## 4. Contract Address Evidence Rules

### 4.1 eth_getCode Verification

Before any address is added to `contracts/DEPLOYED_ADDRESSES.md`:

```bash
cast code <CONTRACT_ADDRESS> --rpc-url https://evmrpc.0g.ai
```

Output MUST be non-empty (`0x` prefix with more than just `0x`).

The returned bytecode MUST be compared with:

```bash
forge inspect <CONTRACT_NAME> bytecode
```

### 4.2 Source Verification

| Check | Command | Expected |
|-------|---------|----------|
| Source compilation matches deployed | `forge verify-contract <ADDRESS> <CONTRACT>:<NAME> --chain-id 16661` | Pass |
| Bytecode comparison | Compare `cast code` output with `forge inspect` output | Exact match |
| ABI hash | `forge inspect <NAME> abi \| sha256sum` | Stored in evidence JSON |

### 4.3 Address Format Rules

- All addresses MUST be lowercase checksummed per EIP-55
- All addresses stored in `contracts/DEPLOYED_ADDRESSES.md` MUST be clickable explorer links
- No address may be listed without a corresponding evidence JSON file in `evidence/yield-routing/`

---

## 5. DEPLOYED_ADDRESSES.md Update Criteria

### 5.1 Pre-conditions for Adding an Entry

1. Evidence JSON file exists at `evidence/yield-routing/{name}-{chain_id}-{block}.json`
2. `eth_getCode` returns non-empty bytecode matching compiled source
3. Deployment transaction has 12+ block confirmations
4. Explorer link renders the verified contract
5. Source commit hash is pinned in the current branch history
6. All fields from the transaction evidence format (§2.1) are populated

### 5.2 Entry Template

```
| {chain} | {chain_id} | {contract} | [{address}]({explorer_url}) | {tx_hash} | {block} | Verified |
```

Required fields (no Pending placeholders allowed):
- Chain name
- Chain ID (numeric)
- Contract name (matching GDR-001.2 §2 role)
- Address (as clickable explorer link)
- Deployment transaction hash
- Block number
- Verification status (must be "Verified")

### 5.3 Removal Criteria

An entry MUST be removed or marked `DEPRECATED` if:
- The evidence JSON file is deleted or hash-mismatched
- `eth_getCode` returns empty at the listed address
- The source commit is no longer reachable from `main`

---

## 6. Yield-Routing Contracts Specification

Per GDR-001.2 §2, the following contracts require evidence before yield routing is considered live:

| Contract | Role | Fee Source | Allocation |
|----------|------|-----------|------------|
| LegacyVault | Long-term reserve | 50% swap fees, 100% bridge fees | Accumulates 0G |
| PioneerRewards | Sovereign reward pool | 30% swap fees, 100% soul mint royalties | Distributed to staked pioneers |
| OperationalTreasury | Node/gas operations | 20% swap fees, 100% staking cut | Node infra + gas |
| FeeCollector | Fee aggregation | All protocol fees | Routes to above three |

### 6.1 Deployment Order

1. LegacyVault (base vault contract, no external dependencies)
2. PioneerRewards (may reference LegacyVault for overflow)
3. OperationalTreasury (standalone)
4. FeeCollector (depends on all three above for routing addresses)

### 6.2 Inter-contract References

After deployment, each contract MUST have:
- `eth_getCode` evidence file
- `cast code` output matching `forge inspect` bytecode
- Source code in `contracts/src/` with matching `contract` keyword name
- Constructor arguments recorded in evidence JSON

---

## 7. Activation Block Evidence

GDR-001.2 specifies activation at block `1,850,000`. The following evidence format MUST be produced:

### 7.1 Activation Transaction Evidence

```json
{
  "evidence_type": "yield_activation",
  "activation_block": 1850000,
  "effective_block": 1850000,
  "evidence_file": "evidence/yield-routing/activation-block-1850000.json",
  "transaction_hash": "0x...",
  "transaction_type": "fee_router_configuration",
  "fee_collector_address": "0x...",
  "contracts_configured": ["LegacyVault", "PioneerRewards", "OperationalTreasury"],
  "fees_activated": ["swap_fee:0.5%", "mint_royalty:2.5%", "staking_cut:1.0%", "bridge_fee:0.25%"],
  "explorer_url": "https://chainscan.0g.ai/tx/0x...",
  "verification_command": "cast call <FEE_COLLECTOR> 'isActive()' --rpc-url https://evmrpc.0g.ai"
}
```

### 7.2 Post-Activation Verification

Within 12 blocks of the activation transaction:
1. Query FeeCollector `isActive()` → MUST return `true`
2. Query each vault/treasury `balance()` → MUST reflect accumulated fees
3. Public dashboard MUST render fee distribution with <= 1 block latency
4. `npm run verify:evidence` MUST pass after adding evidence files

---

## 8. Assertions

- wallet_actions: false
- private_key_access: false
- signing_attempted: false
- transaction_broadcast: false
- deployment_attempted: false
- live_execution: false
- code_review_only: true
- evidence_spec_defined: true