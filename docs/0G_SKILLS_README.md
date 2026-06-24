# 0G Skills — Consolidated Reference for AI Agents

**Status:** INTEGRATED
**Branch:** `ai/inner-docs-improvement-lane-v1`
**Governance Lane:** `ai-inner-docs-improvement-lane-v1`
**Phase 7 Blocked At:** `AWAITING_GUARDIAN_ADDRESS`

---

## Purpose

This document consolidates all 0G skills references for AI agents working in the Quantum Pi Forge repository. It provides a single entry point for 0G chain development, storage, compute, grant, and deployment knowledge.

---

## 1. Ship Skill — End-to-End 0G Development

**Reference:** [`docs/0G_SHIP_SKILL_REFERENCE.md`](0G_SHIP_SKILL_REFERENCE.md)
**Status:** INTEGRATED (PR #494)

### Phases Covered

| Phase | Focus | Status |
|-------|-------|--------|
| Phase 1 | Design — onchain state, storage, compute, threat model | ✅ Documented |
| Phase 2 | Build contracts — Foundry/Hardhat/Remix, cancun EVM | ✅ Documented |
| Phase 3 | Storage & compute — TS/Go SDKs | ✅ Documented |
| Phase 4 | Configure networks — Galileo testnet (16602), Aristotle mainnet (16661) | ✅ Documented |
| Phase 5 | Deploy & verify — Foundry forge, Chainscan | ✅ Documented |
| Phase 6 | Frontend & agent UX | ✅ Documented |
| Phase 7 | QA, audit, launch | ⏳ Blocked at guardian address |

### Network Reference

| Network | Chain ID | Public RPC | Explorer |
|---------|----------|------------|----------|
| Galileo testnet | `16602` | `https://evmrpc-testnet.0g.ai` | `https://chainscan-galileo.0g.ai` |
| Aristotle mainnet | `16661` | `https://evmrpc.0g.ai` | `https://chainscan.0g.ai` |

---

## 2. Token Contracts

### OINIO Token

| Property | Value |
|----------|-------|
| **Address** | `0x6011c341a01c80f489a5c3Ab751987A55142F04e` |
| **Name** | OINIO Token |
| **Symbol** | OINIO |
| **Decimals** | 18 |
| **Total Supply** | 1,000,000,000 (1 billion) |
| **Minting** | ❌ No mint function — fixed supply |
| **Burnable** | ✅ Yes — deflationary mechanics |
| **Ownable** | ✅ Yes — for future governance migration |
| **Source** | `contracts/src/OINIOToken.sol` |
| **Test** | `test/OINIOToken.t.sol` |
| **Bytecode** | Verified — `BYTECODE PRESENT` via `eth_getCode` |
| **Birth Tx** | `0xac4e8f234256ca02c165321768dec2e6787f590e674ccc64bde5de5648074bd0` |
| **Birth Block** | `32561033` |

### W0G (Wrapped 0G)

| Property | Value |
|----------|-------|
| **Source** | `contracts/0g-uniswap-v2/src/W0G.sol` |
| **Name** | Wrapped 0G |
| **Symbol** | W0G |
| **Decimals** | 18 |
| **Deployment** | ❌ NOT YET DEPLOYED |
| **Behavior** | Standard WETH9 pattern — deposit native 0G, withdraw W0G |

---

## 3. DEX Contracts (Uniswap V2 Fork)

**Status:** Ready for deployment, but blocked at Phase 7 (no guardian address)

| Contract | Source Path | Status |
|----------|-------------|--------|
| UniswapV2Factory | `contracts/0g-dex/UniswapV2Factory.sol` | ✅ Ready |
| UniswapV2Pair | `contracts/0g-dex/UniswapV2Pair.sol` | ✅ Ready |
| UniswapV2Router02 | `contracts/0g-dex/UniswapV2Router02.sol` | ✅ Ready |
| UniswapV2ERC20 | `contracts/0g-dex/UniswapV2ERC20.sol` | ✅ Ready |

**Deployment methods:** Foundry (recommended), Python scripts, GitHub Actions
**Router (external):** Zia Finance V2 `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`

---

## 4. Yield-Routing Contracts (Phase 7)

**Status:** Design complete, deployment blocked at Phase 7

| Contract | Role | Source |
|----------|------|--------|
| FeeCollector | Single entry point for all protocol fees | `YIELD_ROUTING_CONTRACT_DESIGN_V1.md` |
| LegacyVault | 200-year timelock reserve | Design proposed |
| PioneerRewards | Reward pool for staked pioneers | Design proposed |
| OperationalTreasury | Ops fund with 5/7 guardian multisig | Design proposed |

**Fee Routing (hardcoded, immutable):**
| Source | Fee % | Split |
|--------|-------|-------|
| DEX swap | 0.5% | 50% LegacyVault, 30% PioneerRewards, 20% OperationalTreasury |
| Soul mint | 2.5% | 100% PioneerRewards |
| Staking cut | 1.0% | 100% OperationalTreasury |
| Bridge transfer | 0.25% | 100% LegacyVault |

---

## 5. 0G Storage

### Status
- **0G Storage Client:** Binary present at `./0g-storage-client` (Linux amd64)
- **Grant submission:** Stored on 0G Storage via client upload (2026-04-17)
- **Root hash:** `0x35651c43292e7306c154bc70075dbed1ac02b0e012ef3f1efdd1f4427079baaa`
- **Verification protocol:** `0G_VERIFICATION_PROTOCOL.md`

### Upload Command
```bash
./0g-storage-client upload \
  --file <file_path> \
  --rpc https://rpc-storage.0g.ai \
  --chain https://rpc.0g.ai \
  --private-key <KEY>
```

### SDK References
- **TypeScript:** `@0gfoundation/0g-ts-sdk` + `ethers`
- **Go:** `github.com/0gfoundation/0g-storage-client`
- **Starters:** [TS](https://github.com/0gfoundation/0g-storage-ts-starter-kit), [Go](https://github.com/0gfoundation/0g-storage-go-starter-kit)

---

## 6. 0G Compute — Runtime Policy

### Current Canonical Path

**Runtime priority (active):**
1. ✅ **0G Compute Direct Provider** — HTTP 200 confirmed on mainnet (2026-05-31)
2. 🔄 Local Ollama guardian fallback
3. ⏳ Router / OpenAI-compatible path — blocked by `402 billing_state` (not authoritative)

### Direct Provider Status

| Test | Result | Date |
|------|--------|------|
| Provider discovery | ✅ Pass | 2026-05-29 |
| Router path (`/v1/proxy`) | ❌ HTTP 402 | 2026-05-29 |
| Direct provider path | ✅ HTTP 200 | 2026-05-31 |
| Model: `deepseek-v4-flash` | ✅ Valid response | 2026-05-31 |

### Policy
- Prefer direct-provider inference when 0G Compute is required
- Cap token usage per run
- Log model, provider, endpoint mode, request ID, cost estimate
- Fall back to local Ollama when direct-provider fails
- Never treat Router failure as project failure while Direct Provider is operational

**Evidence:** `OINIO_COMPUTE_RUNTIME_POLICY_20260531.md`, `0G_COMPUTE_DIRECT_SUCCESS_20260531.md`, `OINIO_0G_COMPUTE_PATH_DIAGNOSIS_20260529.md`

---

## 7. Grant Status

### Guild on 0G 2.0 — $200k Bracket

| Item | Status |
|------|--------|
| **Submission Date** | 2026-04-17 |
| **Document Root Hash** | `0x35651c43292e7306c154bc70075dbed1ac02b0e012ef3f1efdd1f4427079baaa` |
| **M1 — EPI v1.5 container + 0G Storage** | ✅ COMPLETED |
| **M2 — Genesis Birth Ceremony on Aristotle mainnet** | ✅ COMPLETED |
| **M3 — Live demo: OINIO orchestrating AI via 0G inference** | ⏳ PENDING (awaiting grant review response) |
| **Last Follow-up** | 2026-05-07 |
| **Pending Since** | Last update stale — grant status tracking needs refresh |
| **Guild Post** | https://hall.0g.ai/post/quantum-pi-forge-sovereign-agent-system |

### Verified On-Chain Assets

| Asset | Address / Hash |
|-------|----------------|
| Birth Transaction | `0xac4e8f234256ca02c165321768dec2e6787f590e674ccc64bde5de5648074bd0` |
| Birth Block | `32561033` |
| OINIO Core (verified) | `0x6011c341a01c80f489a5c3Ab751987A55142F04e` |
| Genesis State Digest | `0xaaa0cc0f1678eb6e0385d1cd83ec2e676f629faf5fd8ce726038b5b9c880ccd3` |
| Deployment Tx | `0x3d768430ab02659be395afcc116b4c70739f0590dac3b0818da3088d8a104ba9` |

---

## 8. Security & Wallet Access Control

**Reference:** `receipts/security/0g-wallet-access-control-mapping-v1.json`
**Status:** Requirements mapped, PASS

### Key Rules for AI Agents
- Use correct 0G chain ID and RPC before any wallet operation
- Never embed production private keys in frontend bundles or agent logs
- Use environment variables and secret managers for CI deploy keys
- Prefer hardware wallets or multisig for production admin roles
- Separate deployer, treasury, agent, and validator keys
- Use unique capped-fund keys per agent
- Verify EIP-712 domain separators bind the correct 0G chain ID
- Prevent replay across Galileo and Aristotle
- Validate transaction data before signing
- Handle gas estimation failures without recursive signing loops
- Rate-limit wallet handlers
- Avoid leaking sensitive state through debug logs or CI traces

---

## 9. Phase 7 — Current Blocked State

Phase 7 is blocked at `AWAITING_GUARDIAN_ADDRESS`. No contracts will be deployed, no liquidity seeded, no yield-routing activated, and no signing performed until the real Ennead multisig / Gnosis Safe address is obtained from the 0G Aristotle mainnet source of truth.

**What is NOT blocked:**
- Documentation improvements ✅
- Evidence generation ✅
- Code review ✅
- Test writing ✅
- Design proposals ✅

---

## Quick Command Reference

```bash
# Build contracts (Foundry)
forge build --evm-version cancun

# Deploy (when guardian address arrives)
forge create --rpc-url https://evmrpc.0g.ai \
  --private-key "$PRIVATE_KEY" \
  --evm-version cancun \
  src/MyContract.sol:MyContract

# Verify on Chainscan
# https://chainscan.0g.ai/address/<contract_address>

# 0G Storage upload
./0g-storage-client upload \
  --file <file> \
  --rpc https://rpc-storage.0g.ai \
  --chain https://rpc.0g.ai \
  --private-key <KEY>

# Check contract bytecode
curl -X POST https://evmrpc.0g.ai \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getCode","params":["<address>", "latest"],"id":1}'
```

---

**Last updated:** 2026-06-24
**Canonical branch:** `ai/inner-docs-improvement-lane-v1`