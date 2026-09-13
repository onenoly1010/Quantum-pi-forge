# 0G AI Alignment Node — Operator Reference v1

**Document class:** informational QPF/0G **ecosystem integration artifact**  
**Audit lane:** 0G ecosystem knowledge / operational documentation  
**Not:** QPF contract evidence · QPF economic evidence · QPF canonical deployment evidence  
**Status:** DOCUMENTED (workspace skill-activated 2026-08-15)  
**Mode:** Agent-knowledge / runbook only  
**Does not authorize:** purchase, KYC submission, `registerOperator`, node start, NAAS payment, reward claim, or any wallet/key use  
**Official index:** https://docs.0g.ai/node-sale/node-sale-index  
**Official operator guide:** https://docs.0g.ai/node-sale/ai-alignment-node-user-guide  
**Official binary:** https://github.com/0gfoundation/alignment-node-release

```text
DOCTRINE: containment without canonicalization
  This file sits BESIDE forensic baseline P0-A (68339cc). It is not in the baseline.

HARD INVARIANT (audit — do not collapse):
  Alignment License NFT  !=  QPF Docs DEPLOYMENT_SET  !=  OINIO Model Registry
  Alignment rewards      !=  QPF minting              !=  QPF liquidity / yield
  Bytecode present       !=  QPF control              !=  ABI recovered

FORBIDDEN INFERENCES:
  address found      ≠  QPF contract
  bytecode present   ≠  QPF control
  ecosystem relation ≠  canonical identity
```

This artifact may enrich a later Apollo / ecosystem comparison. It must **not** enter the contract-identity reconciliation, Docs `DEPLOYMENT_SET` designation, `CONTRACT_REGISTRY_V1`, or any economic-activation file.

---

## Why this exists in QPF

Alignment nodes are a **distinct 0G node class**. They are not validator, storage, DA, archival, or QPF/OINIO identity artifacts.

They monitor whether other 0G node types (validator, storage, security, DA, serving) follow protocol. Official docs also describe a later utility: watch on-chain AI model drift.

QPF already uses 0G storage and compute. This page is the agent SoR so we do not:

- treat the Nov 2024 node sale as a live “buy now” runbook;
- confuse Alignment License NFTs with OINIO / Docs `DEPLOYMENT_SET` / Model Registry NFTs;
- collapse Alignment rewards into QPF mint / LP / yield GO;
- paste license-wallet private keys into agent env;
- treat a read-only `eth_getCode` probe as QPF deployment or control.

---

## Node-type map (do not collapse)

| Class | Role | Typical hardware (official) | QPF relation |
| --- | --- | --- | --- |
| **AI Alignment Node** | Protocol / behavior monitor; license is an ERC-721 | 64 MB RAM, 1× x86 @ 2.1 GHz, 10 GB disk, 10 Mbps + **externally reachable port** | Documented here. Operate only with separate human GO **and** a license NFT |
| Validator | Consensus / tx validation | 64 GB, 8 cores, 1 TB NVMe (4 TB testnet), 100 MBps | Separate runbook: https://docs.0g.ai/run-a-node/validator-node |
| Storage | Persistent data | 16 GB, 4 cores, 500 GB–1 TB NVMe, 500 MBps | Existing QPF storage client / grant evidence |
| DA | Short-term blob availability | 16 GB, 8 cores, 1 TB NVMe | Separate runbook |
| Archival | Full historical state | See official archival guide | Not a QPF default |

Alignment hardware is intentionally light compared with validators. That does **not** make self-hosting a default agent action.

---

## License (what a holder actually has)

| Fact | Official position | Agent rule |
| --- | --- | --- |
| Instrument | Soulbound ERC-721 **Node License NFT** | Not QPF identity SoR |
| Claim / manage | https://claim.0gfoundation.ai | Read-only unless separately authorized |
| Historical purchase UI | https://node.0gfoundation.ai | Sale was Nov 2024 — do not treat as currently open |
| Transfer | Non-transferable for the **first year** after the sale | Do not plan secondary-market ops |
| Multiplicity | Multiple NFTs may run on one server | Still one operator key domain |
| Operator key | Private key of the **wallet that holds the license NFT** | Wallet-touch / secret — **blocked** without explicit GO |
| Rewards KYC | Required **before claiming rewards** (Blockpass at `/kyc`) | Do not run KYC for the user; point to official portal + disclaimer |
| Unsold sale inventory | Unsold license NFTs **burned**; those rewards reallocated to sold verified buyers | Historical tokenomics, not a QPF treasury fact |

**Eligibility / geo lists disagree across official pages** (KYC guide vs legal disclaimer). Restricted-territory advice is **out of scope** for agents. Point humans to:

- https://docs.0g.ai/node-sale/disclaimer  
- https://www.0gfoundation.ai/ai-alignment#disclaimer  
- the live claim portal

Age 18+ is stated on both KYC and disclaimer pages.

---

## Historical sale (context only)

| Item | Official record |
| --- | --- |
| Product | 0G Foundation AI Alignment Node Sale |
| Whitelist | 2024-11-11 12:00 UTC — independent allocation; unused WL did **not** roll into public |
| Public | 2024-11-13 12:00 UTC |
| Denomination | USDC on **Arbitrum** (community correction away from wETH) |
| Price peg | Snapshot wETH **$3,130** |
| Checkout | Live bridge aggregator (ETH / ARB / BNB and others via LI.FI-class routing) |
| Tiers | Officially 32 purchase tiers; per-tier caps in the official spreadsheet |
| Referral (sale-era) | Wallet address as promo: 10% rebate + 10% commission on successful referred purchase |

Do **not** execute or re-open a purchase flow from this document.

Official reward *claims* (not QPF forecasts, not economic GO):

- Alignment operators “may receive a portion of network fees”; node-holder page states **up to 15% of ecosystem supply over 3 years**.
- TGE unlock described as **33%** initially claimable with a **duration penalty** (subject to community vote); remaining **67%** linear daily over **36 months**.
- Alignment expected to pay higher than storage/validator rates because of limited supply and role — treat as official marketing/docs language, not a measured QPF yield.

---

## Two operator paths

| Path | Who | Time | Rewards | Maintenance |
| --- | --- | --- | --- | --- |
| **NAAS delegate** | Non-technical / default for “just hold the license” | 2–3 minutes | 100% if prepaid; else minus commission | Provider |
| **Self-host** | Technical operator with license NFT | 1–2 hours | 100% | You |

### NAAS (preferred default if QPF ever holds a license)

Portal: https://claim.0gfoundation.ai → NAAS Providers → provider onboarding → receive **Target NAAS Node Address** → My Licenses → Delegate.

| Model | Payment | Initial status |
| --- | --- | --- |
| Commission | % of rewards; no upfront | Active immediately |
| Prepaid | Fixed fee | Starts **Expired** until payment confirms |

| Status | Meaning |
| --- | --- |
| Inactive | Not delegated |
| Pending | Submitted; awaiting NAAS approval |
| Delegated | Active / earning (per portal) |
| Expired | Prepaid ended or payment issue |

Undelegate is immediate and does **not** need NAAS approval. Switch providers by undelegate → confirm → re-delegate.

### Self-host (documentation only)

Official release: **v1.0.0** (2025-09-23)  
Asset: https://github.com/0gfoundation/alignment-node-release/releases/download/v1.0.0/alignment-node.tar.gz

```bash
# EXAMPLE from official user guide — do not run with a live key
wget https://github.com/0gfoundation/alignment-node-release/releases/download/v1.0.0/alignment-node.tar.gz
tar -xzf alignment-node.tar.gz
cd alignment-node
chmod +x 0g-alignment-node
cp .env.example .env
```

**Env discrepancy (do not invent a merge):**

| Source | Variables |
| --- | --- |
| Official user guide | `ZG_ALIGNMENT_NODE_LOG_LEVEL`, `ZG_ALIGNMENT_NODE_SERVICE_IP` (full URL, e.g. `http://127.0.0.1:34567`), `ZG_ALIGNMENT_NODE_SERVICE_PRIVATEKEY` |
| Repo `.env.example` + `config.toml` (v1.0.0) | `ZG_ALIGNMENT_NODE_LOG_LEVEL`, `ZG_ALIGNMENT_NODE_SERVICE_PORT=8080`, `ZG_ALIGNMENT_NODE_SERVICE_PRIVATEKEY` |

At install time, prefer the **release tarball’s own** `.env.example` / README. The user-guide `SERVICE_IP` text also says the value must be the node’s **externally reachable** address.

Register / start (official guide — **wallet GO required**):

```bash
source .env
./0g-alignment-node registerOperator \
  --key <license_wallet_private_key> \
  --token-id <nft_token_id> \
  --chain-id 16661 \
  --rpc https://evmrpc.0g.ai \
  --contract 0x7BDc2aECC3CDaF0ce5a975adeA1C8d84Fd9Be3D9

./0g-alignment-node start --mainnet
# production-shaped example from docs:
# nohup ./0g-alignment-node start --mainnet > node.log 2>&1 &
```

A wallet with **no** license NFT cannot register as operator.

---

## Alignment manager (official, not QPF-owned)

| Field | Value |
| --- | --- |
| Role | Alignment manager / operator-registration contract (per official user guide) |
| Address | `0x7BDc2aECC3CDaF0ce5a975adeA1C8d84Fd9Be3D9` |
| Chain | Aristotle mainnet `16661` |
| RPC used for probe | `https://evmrpc.0g.ai` |
| Probe (UTC) | 2026-08-15 |
| `eth_getCode` | **non-empty** — 295 bytes |
| code SHA-256 | `fbbd991e4c035bf938a2a57a8afc2d0977140a3417859b3fdff0d8fe82557ed1` |
| Explorer | https://chainscan.0g.ai/address/0x7BDc2aECC3CDaF0ce5a975adeA1C8d84Fd9Be3D9 |

```text
Official alignment manager
  != Docs DEPLOYMENT_SET (QPF identity SoR)
  != OINIO Model Registry
  != QPF DEX / Safe / heartbeat
Bytecode present != QPF control != economic GO != ABI recovered
295 bytes is small — treat as “deployed code exists”, not a verified implementation dump.
Do not add this address to QPF CONTRACT_REGISTRY_V1 or the designation set.
```

---

## Troubleshooting (official)

- Node not connecting: port not externally reachable; firewall / security group; key has no licenses  
- Crashes: logs, hardware floor, unstable network  
- Healthy: status without errors; logs show steady activity, no restart loop  

Self-host hygiene from official “best practices”: keep binary updated, downtime alerts, **secure key backup**, dedicated operator wallet, stable network.

NAAS hygiene: check provider reputation/uptime, read commission vs prepaid terms, watch status, renew prepaid before expiry, optionally split licenses across providers.

---

## Authorization matrix

| Allowed without further GO | Requires explicit human GO |
| --- | --- |
| Read this page and official docs | Purchase or transfer a license |
| Probe `eth_getCode` / explorer | Create / rotate operator keys |
| Draft NAAS vs self-host comparison | `registerOperator` / `start --mainnet` |
| Record that QPF does **not** currently treat a license as identity SoR | NAAS payment, delegate, undelegate |
| | Reward claim / KYC |
| | Treating Alignment rewards as QPF yield |

---

## Official source set

| Page | Use |
| --- | --- |
| https://docs.0g.ai/node-sale/node-sale-index | Hub |
| https://docs.0g.ai/node-sale/intro | What an Alignment Node is |
| https://docs.0g.ai/node-sale/intro/node-holder-benefits | Reward *claims* (15% / 3y) |
| https://docs.0g.ai/node-sale/intro/eligibility | WL / partner access (not a guarantee) |
| https://docs.0g.ai/node-sale/details/purchasing-nodes | Historical checkout steps |
| https://docs.0g.ai/node-sale/faq | Sale dates, NFT rules, hardware, TGE split |
| https://docs.0g.ai/node-sale/ai-alignment-node-user-guide | **Current** NAAS + self-host |
| https://docs.0g.ai/node-sale/details/kyc-verification | Reward-claim KYC (Blockpass) |
| https://docs.0g.ai/node-sale/disclaimer | Legal / restricted-territory SoR |
| https://docs.0g.ai/run-a-node/overview | Other node classes + hardware table |
| https://github.com/0gfoundation/alignment-node-release | Binary / `.env.example` / `config.toml` |

---

**P0-B (2026-08-15):** Alignment-node / node-sale knowledge absorbed into QPF docs and the `0g-skills` agent entrypoint. Live operation remains separately gated.
