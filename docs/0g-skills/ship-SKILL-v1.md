---
name: ship
description: "End-to-end path from idea to production on 0G Chain."
---

# Ship

**Ship** — End-to-end path from idea to production on **0G Chain**.


Official reference: [0G Documentation](https://docs.0g.ai/)

---

## When to fetch this skill first

Use this skill when you need a **ordered playbook**: contracts, storage, compute, deployment, verification, and UX — without skipping security or testing.

---

## 0G stack in one paragraph

0G provides an **EVM-compatible chain** (deploy with familiar tooling), plus **decentralized storage** (SDKs / indexer) and **AI compute** (inference, fine-tuning). Validators tie into **Ethereum via Symbiotic restaking** (see [Protocol](../protocol/SKILL.md)). Treat 0G as: **execution + data + ML services**, not “just another EVM.”

---

## Phase 1 — Design

1. **Choose what lives onchain:** state, access control, value flows, events for indexers.
2. **Choose what lives in 0G Storage:** large blobs, datasets, model artifacts, user content.
3. **Choose what uses 0G Compute:** inference jobs, fine-tuning pipelines (offchain workers + onchain settlement as applicable).
4. **Threat model:** keys, oracles, upgradeability, cross-chain assumptions — [Security](../security/SKILL.md).

---

## Phase 2 — Build (contracts)

- Compiler: target **`cancun`** EVM version for compatibility (see [official deploy guide](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts)).
- Tooling: **Foundry**, **Hardhat**, or **Remix** — same as Ethereum.
- **Precompiles:** understand DA signer and wrapped base precompiles before relying on them ([precompiles overview](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/precompiles/precompiles-overview)).

Deep dives: [Standards](../standards/SKILL.md), [Testing](../testing/SKILL.md), [Security](../security/SKILL.md).

---

## Phase 3 — Build (storage & compute)

- **Storage TypeScript SDK:** `@0gfoundation/0g-ts-sdk` + `ethers` ([Storage SDK docs](https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk)).
- **Storage Go SDK:** `github.com/0gfoundation/0g-storage-client`.
- **Starter kits:** [TS starter](https://github.com/0gfoundation/0g-storage-ts-starter-kit), [Go starter](https://github.com/0gfoundation/0g-storage-go-starter-kit).
- **Compute:** follow [Inference](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference) and related compute docs for integration patterns.

---

## Phase 4 — Configure networks

| Network | Chain ID | Public RPC (dev) | Explorer |
| --- | --- | --- | --- |
| Galileo testnet | `16602` | `https://evmrpc-testnet.0g.ai` | `https://chainscan-galileo.0g.ai` |
| Aristotle mainnet | `16661` | `https://evmrpc.0g.ai` | `https://chainscan.0g.ai` |

Use **third-party RPCs** for production (QuickNode, Ankr, dRPC, etc.) — see [Testnet overview](https://docs.0g.ai/developer-hub/testnet/testnet-overview) and [Tools](../tools/SKILL.md).

Fund testnet wallets via [faucet.0g.ai](https://faucet.0g.ai) (limits apply).

---

## Phase 5 — Deploy & verify

- Example **Foundry** deploy:

```bash
forge create --rpc-url https://evmrpc-testnet.0g.ai \
  --private-key "$PRIVATE_KEY" \
  --evm-version cancun \
  src/MyContract.sol:MyContract
```

- Verify on **Chainscan** using explorer API URLs from [deploy contracts](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts).

Addresses for system contracts **change on testnet** — see [Contract Addresses](../contract-addresses/SKILL.md) and always confirm in docs.

---

## Phase 6 — Frontend & agent UX

Follow [Frontend UX](../frontend-ux/SKILL.md) and [Frontend Playbook](../frontend-playbook/SKILL.md): chain switching, pending states, error surfacing, and secure key handling.

---

## Phase 7 — QA, audit, launch

1. [QA](../qa/SKILL.md) — separate reviewer pass.
2. [Audit](../audit/SKILL.md) — structured review for non-trivial value at risk.
3. [Indexing](../indexing/SKILL.md) — ensure subgraphs/indexers match deployed events.

---

## How to fetch this skill

```bash
curl -sSL https://0gskills.com/ship/SKILL.md
```

```javascript
await fetch("https://0gskills.com/ship/SKILL.md").then((r) => r.text());
```

---

## Next skills

- [Why ZeroG](../why-zerog/SKILL.md) — product rationale.
- [Tools](../tools/SKILL.md) — concrete toolchain map.
- [Orchestration](../orchestration/SKILL.md) — multi-step agent patterns.

MIT License — contributions welcome.
