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

## Custom Workflow Skills

### DEX Integration Workflow
- [0G DEX Quickstart](0G_DEX_QUICKSTART.md)
- [0G DEX Deployment](0G_DEX_DEPLOYMENT.md)
- [0G DEX Implementation Summary](0G_DEX_IMPLEMENTATION_SUMMARY.md)

### AI Agent Workflow
- [AI Agent Quick Reference](AI_AGENT_QUICK_REFERENCE.md)
- [AI Agent Handoff Runbook](AI_AGENT_HANDOFF_RUNBOOK.md)

### Social Network Workflow
- [AI Social Network Workflow](AI_SOCIAL_NETWORK_WORKFLOW.md)

### API Integration
- [API Reference](API.md)

