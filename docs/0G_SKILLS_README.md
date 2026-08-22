# 0G Skills — Consolidated Reference for AI Agents

**Status:** INTEGRATED — compute entrypoints refreshed (P0-A); alignment-node docs activated (P0-B)  
**Last updated:** 2026-08-15  
**Mode:** Documentation / agent entrypoint only  
**Live wallet, deposit, key issuance, inference spend, node purchase, or alignment-node register/start:** **NOT authorized by this document**

---

## Purpose

Single entry point for AI agents working in Quantum Pi Forge on 0G chain, storage, compute, grant, and deployment knowledge.

**Governing gap register (session):** `QPF_0G_DOCS_GAP_MAP_REFINED_2026-08-15.md`  
SHA-256: `fc82db5f575f90bf8bf7d58edf42d3e5ab076cd957fe20e3f3e2fdd2aead6f61`

---

## 0. Identity system of record (read first)

```text
CANONICAL IDENTITY SoR (chain 16661):
  Docs DEPLOYMENT_SET — designated 2026-08-14
  ID: qpf.designation.docs.deployment_set.16661.v1
  token     0x75995EC0fdf881189850aeD864cB3f43c0DFCb58
  registry  0x67aD7169184581f23D1E10B39d4eb4e98293E87a
  heartbeat 0x5E50b92E57e854659f7D98c733088aABd551C49F

Broadcast set: UNRESOLVED_PEER — NOT DESIGNATED — not erased
designation authority != control authority != economic authority
```

| Address / label | Classification |
| --- | --- |
| Docs three-address set above | **Designated identity SoR** (session-sealed Aug 14) |
| `0x6011c341a01c80f489a5c3Ab751987A55142F04e` | Historical / grant-era token-like peer — **not** designated SoR |
| Broadcast token/registry/heartbeat | Unresolved peer set — **not** designated |

Designation seals live in session evidence (not automatically in this git tree). Do not invent economic or control authority from identity designation.

---

## 1. Ship Skill — End-to-End 0G Development

**Reference:** [`docs/0G_SHIP_SKILL_REFERENCE.md`](0G_SHIP_SKILL_REFERENCE.md)

### Phases Covered

| Phase | Focus | Status |
|-------|-------|--------|
| Phase 1 | Design — onchain state, storage, compute, threat model | Documented |
| Phase 2 | Build contracts — Foundry/Hardhat/Remix, cancun EVM | Documented |
| Phase 3 | Storage & compute — SDKs + **Router/Direct** paths | Documented — **compute skill propagated 2026-08-15** |
| Phase 4 | Networks — Galileo `16602`, Aristotle `16661` | Documented |
| Phase 5 | Deploy & verify — Foundry, Chainscan | Documented; economic deploy gated |
| Phase 6 | Frontend & agent UX | Documented |
| Phase 7+ | Launch / liquidity / mint | **Economic activation not authorized** |

### Network Reference

| Network | Chain ID | Public RPC | Explorer |
|---------|----------|------------|----------|
| Galileo testnet | `16602` | `https://evmrpc-testnet.0g.ai` | `https://chainscan-galileo.0g.ai` |
| Aristotle mainnet | `16661` | `https://evmrpc.0g.ai` | `https://chainscan.0g.ai` |

Production apps should prefer **third-party RPCs** (QuickNode, Ankr, ThirdWeb, etc.) over the public RPC alone. See also `https://explorer.0g.ai/`.

---

## 2. Token / contract inventory (agent caution)

### Designated Docs set (identity SoR)

| Role | Address |
|------|---------|
| Token | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` |
| Registry | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` |
| Heartbeat | `0x5E50b92E57e854659f7D98c733088aABd551C49F` |

Docs create block (forensic): **36214225** (not the stale repo claim 36214213).

### Historical peer (not designated SoR)

| Property | Value |
|----------|-------|
| Address | `0x6011c341a01c80f489a5c3Ab751987A55142F04e` |
| Notes | Grant/birth-era records; do **not** treat as current identity SoR |

### W0G

| Variant | Status |
|---------|--------|
| QPF custom `contracts/0g-uniswap-v2/src/W0G.sol` | QPF-owned WETH9 pattern — **not** assumed deployed |
| Official network W0G | Exists on mainnet per 0G docs (`0x1Cd0690fF9a693f5EF2dD976660a8dAFc81A109c`) — use for ecosystem DEX pairs; **do not** conflate with QPF custom wrapper |

Full official contract appendix remains a separate gap (G-04); do not invent addresses beyond verified tables.

Official Alignment manager address is **not** a QPF contract-inventory item. It lives only in the ecosystem artifact ([§8](#8-ai-alignment-nodes-p0-b) / `docs/0g-alignment-node/`).

---

## 3. DEX Contracts (Uniswap V2 Fork)

**Status:** Code ready; **liquidity / economic deployment not authorized** without separate GO.

| Contract | Source Path |
|----------|-------------|
| UniswapV2Factory | `contracts/0g-dex/UniswapV2Factory.sol` |
| UniswapV2Pair | `contracts/0g-dex/UniswapV2Pair.sol` |
| UniswapV2Router02 | `contracts/0g-dex/UniswapV2Router02.sol` |
| UniswapV2ERC20 | `contracts/0g-dex/UniswapV2ERC20.sol` |

See [`0G_DEX_QUICKSTART.md`](0G_DEX_QUICKSTART.md), [`0G_DEX_DEPLOYMENT.md`](0G_DEX_DEPLOYMENT.md).

---

## 4. Yield-Routing Contracts

**Status:** Design complete; **not live**. Deployment requires separate economic GO.

See `YIELD_ROUTING_CONTRACT_DESIGN_V1.md` if present in tree.

---

## 5. 0G Storage

### Status
- Client binary: `./0g-storage-client` (Linux amd64) where present  
- Grant root hash (historical): `0x35651c43292e7306c154bc70075dbed1ac02b0e012ef3f1efdd1f4427079baaa`  
- Verification: `0G_VERIFICATION_PROTOCOL.md`  
- Modernization (package rename, turbo indexer, KV/encryption) remains gap **G-05** — not fully absorbed here  

### SDK pointers (current official names)
- **TypeScript (current):** `@0gfoundation/0g-storage-ts-sdk`  
- **Go:** `github.com/0gfoundation/0g-storage-client`  
- **Indexer (mainnet turbo):** `https://indexer-storage-turbo.0g.ai`  
- Starters: [TS](https://github.com/0gfoundation/0g-storage-ts-starter-kit), [Go](https://github.com/0gfoundation/0g-storage-go-starter-kit)

Live uploads require separate authorization and keys — never embed production keys.

---

## 6. 0G Compute — Agent Entrypoint (P0-A)

**Deep-link (authoritative QPF compute implementation doc):**  
[`docs/0g-compute/INFERENCE_IMPLEMENTATION_V1.md`](0g-compute/INFERENCE_IMPLEMENTATION_V1.md)  
(Date: 2026-07-30; Direct CLI + path review)

**Official 0G docs:**
- Router overview: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/overview  
- Router quickstart: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/quickstart  
- Router vs Direct: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/comparison  
- Authentication: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/authentication  
- Routing: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/routing  
- Deposits: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/account/deposits  
- Direct/inference: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference  
- Fine-tuning (Direct CLI, **NO GO**): https://docs.0g.ai/developer-hub/building-on-0g/compute-network/fine-tuning  
- Verifiable execution: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/features/verifiable-execution  

### 6.1 When to use which path

| Path | Auth | Balance | Best for | QPF default for agents |
| --- | --- | --- | --- | --- |
| **Router** | `sk-…` API key | **Unified** Router balance on [pc.0g.ai](https://pc.0g.ai) | Server apps, agents, prototypes | **Preferred** for server/agent integrations |
| **Direct** | Wallet-signed headers or Bearer `app-sk-*` | **Per-provider** sub-accounts | Browser dApps, pin provider, on-chain control | Use when explicit provider/wallet control is required |
| **Local Ollama** | Local | N/A | Offline / guardian fallback | Fallback when 0G compute unavailable |

```text
Router balance  !=  Direct inference sub-account  !=  Direct fine-tuning sub-account
```

Funds deposited on the old **compute-marketplace / Direct** path do **not** appear on the default Router balance. On pc.0g.ai, **Advanced** mode shows Direct-style sub-accounts. Fine-tuning uses a **third** pool: `transfer-fund --service fine-tuning`. `MinimumDepositRequired` on a fine-tune task is that pool, not Router death. Official: [`FINE_TUNING_OPERATOR_V1.md`](0g-compute/FINE_TUNING_OPERATOR_V1.md). **No login / deposit / create-task.**

### 6.2 Runtime priority (documentation policy — 2026-08-15)

1. **Router** — OpenAI-compatible gateway for server/agent work (`https://router-api.0g.ai/v1` mainnet)  
2. **Direct** — when provider pin, wallet-signed billing, or Advanced/sub-account funds apply  
3. **Local Ollama** — guardian / offline fallback  

**Historical note (not permanent product policy):**  
May–June 2025/2026 evidence recorded Router `/v1/proxy` **HTTP 402** and successful **Direct** path with `deepseek-v4-flash` (`0G_COMPUTE_DIRECT_SUCCESS_20260531.md`, `OINIO_0G_COMPUTE_PATH_DIAGNOSIS_20260529.md`). That is **diagnostic history**. It does **not** mean Router is permanently unusable. Diagnose 402 as: wrong pool, empty Router balance, stale endpoint, or obsolete credentials — then re-check against current [pc.0g.ai](https://pc.0g.ai) Router docs.

### 6.3 Credentials

| Type | Prefix / form | Use |
| --- | --- | --- |
| Router inference key | `sk-…` | Chat/completions and other billable Router routes |
| Router management key | `mk-…` (per official auth docs) | Account/key administration — **not** a substitute for inference `sk-` |
| Direct provider secret | `app-sk-…` | Provider proxy / Direct token mode |
| Wallet private key | EOA | Direct SDK fund/sign only — **live ops require separate GO** |

### 6.4 Router — review-only setup (no live spend in this skill)

Documentation steps only. **Do not** deposit, create keys, or call inference unless a separate human GO authorizes it.

1. Open [pc.0g.ai](https://pc.0g.ai) (mainnet) or [pc.testnet.0g.ai](https://pc.testnet.0g.ai) (testnet).  
2. Connect wallet; confirm network matches intended balance pool.  
3. Deposit **0G** into the **Router** unified balance (not only Advanced/Direct).  
4. Create an API key with **inference** permission (`sk-…`).  
5. Call OpenAI-compatible API:

```text
Mainnet API:  https://router-api.0g.ai/v1
Testnet API:  https://router-api-testnet.integratenetwork.work/v1   # confirm in current official docs
```

```bash
# EXAMPLE ONLY — requires authorized key and funded Router balance
curl https://router-api.0g.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model-id>","messages":[{"role":"user","content":"Hello"}]}'
```

OpenAI SDK drop-in: set `base_url` to the Router `/v1` endpoint and `api_key` to `sk-…`.

**Provider routing (headers — per official routing docs):** e.g. sort by latency/price, pin provider address, max price caps. Malformed headers may return 400.

### 6.5 Capabilities (multimodal)

| Capability | Typical route | Notes |
| --- | --- | --- |
| Chat / tools | `POST /v1/chat/completions` | Streaming and tool-calling per OpenAI shape |
| Images | image generations (sync and/or async per docs) | Confirm current response_format requirements |
| Audio | transcription endpoints | e.g. Whisper-class models when listed |
| Model catalog | `GET /v1/models` | Prefer live catalog over hardcoding |

Service types also named in the Direct guide: `chatbot`, `text-to-image`, `speech-to-text`.

### 6.6 TEE / verifiable execution (boundaries)

| Mode / control | Meaning | Does **not** prove |
| --- | --- | --- |
| **TeeML** | Model runs in TEE | Absolute privacy against all adversaries; legal compliance by itself |
| **TeeTLS** | TEE broker proxies with routing proof | That QPF audited a given provider |
| **`verify_tee`** (Router feature docs) | Request attestation / verification controls when enabled | Custody of keys; identity SoR; economic authorization |

Use TEE language carefully: hardware attestation is **evidence about execution environment**, not a substitute for QPF designation, custody, or governance GO.

### 6.7 Direct path (summary)

Full CLI and env tables: [`docs/0g-compute/INFERENCE_IMPLEMENTATION_V1.md`](0g-compute/INFERENCE_IMPLEMENTATION_V1.md)

```bash
# Default: docs + env checklist (no wallet, no inference)
npm run 0g:compute:review

# Read-only provider list (no private key)
npm run 0g:compute:list

# Live Direct SDK chat / fund — ONLY with explicit operator GO
# OG_COMPUTE_LIVE=1 and NO_WALLET_TOUCH must not block; PRIVATE_KEY required
```

Gates:
- `NO_WALLET_TOUCH=true` → fail closed on wallet paths  
- `OG_COMPUTE_LIVE=1` required for `chat-sdk` / `fund`  
- Dry-run: `npm run verify:0g-compute-inference-evidence-dry-run-gate:v1`  

### 6.8 402 / failure diagnosis (agent checklist)

1. Which path? Router `sk-` vs Direct `app-sk-` vs wallet SDK  
2. Which balance pool? Router unified vs provider sub-account  
3. Network match? Mainnet UI/API vs testnet  
4. Stale endpoint? Old marketplace proxy vs `router-api.0g.ai/v1`  
5. Historical 402 evidence ≠ permanent product failure  
6. Fall back to Ollama for local work; do not thrash funded accounts  

### 6.9 What this section authorizes vs forbids

| Allowed without further GO | Requires separate explicit GO |
| --- | --- |
| Read this skill and linked docs | Create/deposit Router funds |
| Run review / list / dry-run gates | Issue or rotate live API keys |
| Draft integration plans | Live chat-completions spend |
| Local Ollama | Direct fund / transfer / sign |
| | Mint, LP, yield, economic activation |

---

## 7. Grant Status

### Guild on 0G — tracking (refresh from `0G_GRANT_STATUS_TRACKING.md`)

| Item | Status |
|------|--------|
| Submission | 2026-04-17 |
| M1 Storage + EPI | Completed (claimed) |
| M2 Genesis ceremony | Completed (claimed) |
| M3 Compute inference demo | Completed (claimed Direct success 2026-05-31) |
| Grant review response | Awaiting / follow up as human decides |
| Hall | https://hall.0g.ai/post/quantum-pi-forge-sovereign-agent-system |
| Live apply page (2026-08-16) | https://guild.0gfoundation.ai/ — **Applications Closed** |

**Official program split** ([blog 2025-02-05](https://0g.ai/blog/0g-ecosystem-program), still the announcement page):

| Layer | Headline size | Role |
| --- | --- | --- |
| Ecosystem Growth Program | **$88.88M** | Long-term grants / liquidity / investment |
| Guild on 0G accelerator | **$8.88M** | Early builders, testnet → mainnet |

The blog’s Deform apply link is **stale**. Current surface is `guild.0gfoundation.ai`, and it is closed. Do not submit. Do not treat the $88.88M headline as an open check.

**Apollo 2026** (separate accelerator): inaugural 10-team cohort graduated 2026-07-29 ([recap](https://0g.ai/blog/apollo-graduation-2026)). Not a QPF enrollment path unless a human reopens it.

Guardian Safe intake may be recorded in grant tracking; **economic activation remains separately gated**. Do not treat grant milestone claims as designation or mint authority.

---

## 8. AI Alignment Nodes (P0-B)

**Class:** 0G ecosystem knowledge / operational documentation  
**Not:** QPF contract evidence · QPF economic evidence · QPF canonical deployment evidence

**Deep-link:** [`0g-alignment-node/ALIGNMENT_NODE_OPERATOR_V1.md`](0g-alignment-node/ALIGNMENT_NODE_OPERATOR_V1.md)  
**Official hub:** https://docs.0g.ai/node-sale/node-sale-index  
**Official operator guide:** https://docs.0g.ai/node-sale/ai-alignment-node-user-guide

Alignment nodes **monitor** other 0G node types (validator, storage, security, DA, serving). They are not consensus validators and not QPF identity.

```text
DOCTRINE: containment without canonicalization
  P0-B sits beside forensic baseline P0-A (68339cc). It is not in the baseline.

HARD INVARIANT (audit):
  Alignment License NFT  !=  QPF Docs DEPLOYMENT_SET  !=  OINIO Model Registry
  Alignment rewards      !=  QPF minting              !=  QPF liquidity / yield
  Bytecode present       !=  QPF control              !=  ABI recovered
  Sale (Nov 2024)        !=  a live purchase runbook

FORBIDDEN INFERENCES:
  address found      ≠  QPF contract
  bytecode present   ≠  QPF control
  ecosystem relation ≠  canonical identity
```

| Path | When | Agent default |
| --- | --- | --- |
| **NAAS delegate** via [claim.0gfoundation.ai](https://claim.0gfoundation.ai) | License holder, non-technical | **Preferred** if QPF ever holds a license |
| **Self-host** `0g-alignment-node` | Technical operator with license NFT + reachable port | Separate GO only |
| Docs / probe only | Everyone else | **Current authorization** |

Hardware floor (official): 64 MB RAM, 1× x86 @ 2.1 GHz, 10 GB disk, 10 Mbps, **externally reachable service port**. Multiple license NFTs may share one server.

Self-host register (docs only — **do not run** without GO):

```text
chain-id  16661
rpc       https://evmrpc.0g.ai
contract  0x7BDc2aECC3CDaF0ce5a975adeA1C8d84Fd9Be3D9
binary    alignment-node-release v1.0.0
```

Env files disagree (`SERVICE_IP` in the user guide vs `SERVICE_PORT=8080` in the v1.0.0 `.env.example`). Prefer the **release tarball** at install time. Operator key = wallet that **holds** the license NFT.

KYC (Blockpass) is required **before reward claim**, not documented as required to hold the NFT. Geo/eligibility lists **conflict** across official KYC vs disclaimer pages — do not adjudicate; link the disclaimer.

| Allowed now | Requires separate GO |
| --- | --- |
| Read §8 + deep-link + official pages | Buy / transfer license |
| `eth_getCode` on the alignment manager | `registerOperator` / `start --mainnet` |
| Compare NAAS vs self-host | NAAS pay / delegate / undelegate / claim |

---

## 9. Security & Wallet Access Control

**Reference:** `receipts/security/0g-wallet-access-control-mapping-v1.json`

### Key rules for AI agents
- Correct chain ID and RPC before any wallet operation  
- Never embed production private keys in frontend, agent logs, or CI  
- Env vars / secret managers for deploy keys  
- Prefer hardware / multisig for production admin  
- Separate deployer, treasury, agent keys; cap agent funds  
- EIP-712 domain separators bind correct 0G chain ID  
- Prevent replay across Galileo and Aristotle  
- Validate tx data before signing; no recursive gas-estimate signing loops  
- Rate-limit wallet handlers; no secret leakage in logs  

---

## 10. Economic / launch gates

```text
PUBLIC_MINT = NOT_AUTHORIZED
LIQUIDITY_SEED = NOT_AUTHORIZED
YIELD_LIVE = NOT_AUTHORIZED
ALIGNMENT_NODE_OPS = NOT_AUTHORIZED
DESIGNATION = Docs DEPLOYMENT_SET identity SoR only (no economic cascade)
```

Documentation, evidence, tests, and design proposals are allowed. Chain-state changing economic actions require an explicit human GO beyond this skill.

---

## 11. Builder Hub / Agentic ID (P0-D)

**Class:** 0G ecosystem knowledge — **not** QPF contract, economic, or identity evidence  
**Lane:** **P0-D design candidate / knowledge artifact — NO GO**  
**Deep-link:** [`0g-builder-hub/BUILDER_HUB_OPERATOR_V1.md`](0g-builder-hub/BUILDER_HUB_OPERATOR_V1.md)  
**Official:** https://build.0g.ai/

```text
ERC-8004 discoverability !=  QPF Docs DEPLOYMENT_SET  !=  OINIO Model Registry
ERC-8004 metadata        =   discoverability / context only
ERC-8004 registration    !=  automatic QPF canonicality
Proposed integration     !=  deployed integration
NO GO until a separate explicit authorization exists
```

Useful forward facts (docs only):

- Agentic ID = ERC-7857 encrypted-intelligence NFT; examples at `0gfoundation/agenticID-examples`; production `0g-agent-nft` (`eip-7857-draft`). EIP-7857 is still [ethereum/EIPs#7857](https://github.com/ethereum/EIPs/pull/7857) — a PR, not QPF SoR
- Galileo example NFT `0x2700F6A3e505402C9daB154C5c6ab9cAEC98EF1F` — probed; [Chain Scan](https://chainscan-galileo.0g.ai/address/0x2700F6A3e505402C9daB154C5c6ab9cAEC98EF1F) — **not** QPF SoR
- Hub examples use `iTransferFrom`; IERC7857 spec uses `transfer` + `clone`. Do not collapse. Do not `npm run deploy:testnet`
- Tutorial hosts `storage-testnet.0g.ai` / `compute-testnet.0g.ai` ≠ turbo indexer / Router. Do not overwrite P0-A
- ERC-8004 mainnet Identity `0x8004A169…a432` / Reputation `0x8004BAa1…9b63` — official discoverability; **do not** write into `CONTRACT_REGISTRY_V1`
- Storage TS: `@0gfoundation/0g-storage-ts-sdk`; testnet turbo indexer `indexer-storage-testnet-turbo.0g.ai`; scan `storagescan.0g.ai`
- Chain pin: Solidity **0.8.19** + `cancun` (hub: newer EVM may fail explorer verify)
- **Tools** (`https://build.0g.ai/tools`, 8 listed): faucet, Chain Scan mainnet/Galileo, Storage Scan Galileo, `pc.0g.ai`, QuickNode, Ankr, community OpenAdapter. Explorers + `pc.0g.ai` already in workflow. QuickNode/Ankr = optional production *read* RPC (account-gated; do not create from this doc). OpenAdapter = community editor gateway — **not** Router, **not** QPF compute SoR, **not** identity. Hub Storage Scan card is Galileo; mainnet remains `storagescan.0g.ai`.
- **SDKs** (`https://build.0g.ai/sdks`, 16 listed): official compute TS **already in** QPF (`@0gfoundation/0g-compute-ts-sdk` `^0.9.0`). Hub card “0G TypeScript SDK” = storage package `@0gfoundation/0g-storage-ts-sdk` (not an umbrella). New starter name: `0g-storage-web-starter-kit`. Community `0g-py-sdk` splits `0g_py_inference` / `0g_py_storage`; `0g-kit` is prototyping only. Not official SoR. Fine-tune / memory / AgenticID kits remain gated.

Mint, `iTransferFrom`, 8004 register, live upload/deposit, paid RPC, OpenAdapter subscribe: **separate GO**.

---

## Quick Command Reference

```bash
# Build contracts (Foundry)
forge build --evm-version cancun

# Deploy ONLY when separately authorized
forge create --rpc-url https://evmrpc.0g.ai \
  --private-key "$PRIVATE_KEY" \
  --evm-version cancun \
  src/MyContract.sol:MyContract

# Compute review (no wallet)
npm run 0g:compute:review

# Compute provider list (read-only)
npm run 0g:compute:list

# Bytecode probe (Docs token — identity SoR)
curl -X POST https://evmrpc.0g.ai \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x75995EC0fdf881189850aeD864cB3f43c0DFCb58","latest"],"id":1}'

# Alignment manager (official network — not QPF-owned)
# 0x7BDc2aECC3CDaF0ce5a975adeA1C8d84Fd9Be3D9
```

---

## Related agent surfaces

| Surface | Path |
|---------|------|
| Compute deep-link | [`0g-compute/INFERENCE_IMPLEMENTATION_V1.md`](0g-compute/INFERENCE_IMPLEMENTATION_V1.md) |
| Alignment-node deep-link | [`0g-alignment-node/ALIGNMENT_NODE_OPERATOR_V1.md`](0g-alignment-node/ALIGNMENT_NODE_OPERATOR_V1.md) |
| Ship playbook | [`0G_SHIP_SKILL_REFERENCE.md`](0G_SHIP_SKILL_REFERENCE.md) |
| DEX | [`0G_DEX_QUICKSTART.md`](0G_DEX_QUICKSTART.md) |
| Contract registry (repo) | [`CONTRACT_REGISTRY_V1.md`](CONTRACT_REGISTRY_V1.md) |
| Official AI coding context | https://docs.0g.ai/ai-context |
| 0G Research (contained) | [`0g-builder-hub/RESEARCH_OPERATOR_V1.md`](0g-builder-hub/RESEARCH_OPERATOR_V1.md) — papers + apply form; **NO GO** |
| Official node-sale hub | https://docs.0g.ai/node-sale/node-sale-index |
| Pi App Platform (separate ecosystem) | Out of this artifact. Not 0G identity and not QPF contract evidence. |
| Builder Hub / Agentic ID | [`0g-builder-hub/BUILDER_HUB_OPERATOR_V1.md`](0g-builder-hub/BUILDER_HUB_OPERATOR_V1.md) — official map; not QPF identity |

---

**P0-A (2026-08-15):** Compute knowledge propagated from July 30 inference guide + official Router docs into this entrypoint.  
**P0-B (2026-08-15):** Alignment-node / node-sale operator facts absorbed and skill-activated.  
**P0-C (2026-08-15):** Official Pi App Platform docs are a **separate** ecosystem lane — **not included in this 0G skill cluster.**  
**P0-D (2026-08-15):** Builder Hub + Agentic ID / ERC-8004 **discoverability facts** absorbed (G-06 start). Storage package/indexer names refreshed (G-05 incremental). Full 7857/8004 *workflows* and live register remain open / gated.  
**Tools (2026-08-16):** `https://build.0g.ai/tools` catalog absorbed as lookup only. No subscribe, no identity change, no spend.  
**SDKs (2026-08-16):** `https://build.0g.ai/sdks` catalog absorbed. No new deps. No live upload / inference / fine-tune.  
**Agentic ID (2026-08-16):** Hub page re-read. P0-D **NO GO**. Not identity SoR.
