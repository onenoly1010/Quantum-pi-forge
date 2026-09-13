# 0G Ship Skill Reference
Official deployment playbook imported from https://0gskills.com/ship/SKILL.md

---

## ✅ LOADED: End-to-end production path for 0G Chain

This is the canonical playbook for all development, deployment and verification on 0G.

---

## Stack Summary
0G provides:
✅ **EVM-compatible chain** (Cancun target)
✅ **Decentralized storage** layer
✅ **AI compute network**
✅ Ethereum restaking via Symbiotic

> Treat as execution + data + ML services, not just another EVM.

---

## Development Phases

| Phase | Action |
|---|---|
| 1. DESIGN | Separate onchain state / storage blobs / compute jobs + full threat model |
| 2. CONTRACTS | Use Foundry, target Cancun EVM version, understand precompiles |
| 3. INTEGRATION | Use official storage SDKs, follow compute integration patterns |
| 4. NETWORKS | Correct chain IDs, RPC endpoints, use third party RPCs for production |
| 5. DEPLOY | Verified deployment with proper EVM version targeting |
| 6. FRONTEND | Follow UX guidelines for chain interaction |
| 7. LAUNCH | QA pass, audit, indexing verification |

---

## Network Constants
| Network | Chain ID | RPC | Explorer |
|---|---|---|---|
| Galileo Testnet | `16602` | https://evmrpc-testnet.0g.ai | https://chainscan-galileo.0g.ai |
| Aristotle Mainnet | `16661` | https://evmrpc.0g.ai | https://chainscan.0g.ai |

---

## Standard Deploy Command
```bash
forge create --rpc-url https://evmrpc.0g.ai \
  --private-key "$PRIVATE_KEY" \
  --evm-version cancun \
  src/Contract.sol:Contract
```

---

✅ This reference will be used for all future 0G coding work.

## Compute (agent entry)

**Canonical agent entrypoint:** [0G Skills README §6](0G_SKILLS_README.md) (P0-A, 2026-08-15)  
**Implementation deep-link:** [0G Compute Inference Implementation v1](0g-compute/INFERENCE_IMPLEMENTATION_V1.md)

| Path | When |
| --- | --- |
| **Router** (`pc.0g.ai`, `router-api.0g.ai/v1`, `sk-` key) | Server apps, agents, prototypes — **preferred** |
| **Direct** (SDK / `app-sk` / wallet) | Pin provider, per-provider funds, wallet-signed control |
| **Ollama** | Local / offline fallback |

```text
Router balance != Direct sub-account balance
Live deposit / key / spend / fund: separate human GO only
```

Official: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/overview

---

## Alignment nodes (agent entry)

**Class:** 0G ecosystem knowledge / operator runbook — **not** QPF contract, economic, or canonical-deployment evidence.

**Canonical agent entrypoint:** [0G Skills README §8](0G_SKILLS_README.md) (P0-B, 2026-08-15)  
**Operator deep-link:** [Alignment Node Operator v1](0g-alignment-node/ALIGNMENT_NODE_OPERATOR_V1.md)

| Path | When |
| --- | --- |
| **NAAS** (`claim.0gfoundation.ai`) | License holder, non-technical — preferred if a license exists |
| **Self-host** (`0g-alignment-node`, chain `16661`) | Technical operator with license NFT + reachable port |
| Docs / bytecode probe only | Default without a separate GO |

```text
Alignment License NFT != QPF identity SoR
Nov 2024 node sale != live purchase runbook
registerOperator / start / NAAS pay / claim: separate human GO only
```

Official: https://docs.0g.ai/node-sale/ai-alignment-node-user-guide

---

## Builder Hub / Agentic ID (agent entry)

**Class:** 0G ecosystem knowledge — **not** QPF identity or economic evidence.

**Canonical:** [0G Skills README §11](0G_SKILLS_README.md) (P0-D)  
**Deep-link:** [Builder Hub Operator v1](0g-builder-hub/BUILDER_HUB_OPERATOR_V1.md)

```text
ERC-7857 / ERC-8004  !=  Docs DEPLOYMENT_SET
Hub Direct CLI       !=  Router-first compute policy
mint / 8004 register : separate human GO only
```

Official: https://build.0g.ai/

---

## Custom Workflow Skills

### DEX Integration Workflow
- [0G DEX Quickstart](0G_DEX_QUICKSTART.md)
- [0G DEX Deployment](0G_DEX_DEPLOYMENT.md)
- [0G DEX Implementation Summary](0G_DEX_IMPLEMENTATION_SUMMARY.md)

### AI Agent Workflow
- [AI Agent Quick Reference](AI_AGENT_QUICK_REFERENCE.md)
- [AI Agent Handoff Runbook](AI_AGENT_HANDOFF_RUNBOOK.md)
- [0G Skills README](0G_SKILLS_README.md) — **start here for compute + identity SoR**

### Social Network Workflow
- [AI Social Network Workflow](AI_SOCIAL_NETWORK_WORKFLOW.md)

### API Integration
- [API Reference](API.md)

