# 0G Builder Hub — Operator Reference v1

**Document class:** informational QPF / **0G ecosystem** knowledge artifact  
**Audit lane:** official builder-surface documentation  
**Official hub:** https://build.0g.ai/  
**Not:** QPF contract evidence · QPF economic evidence · QPF canonical deployment evidence · Docs `DEPLOYMENT_SET`  
**Lane status:** **P0-D design candidate / knowledge artifact — NO GO** (separate explicit GO required before any register/mint/deploy)

```text
DOCTRINE: containment without canonicalization
  Sits BESIDE locally established P0-A
  68339cc79f56a3274382c8354591e2a7193fe570
  GitHub API UNRESOLVED — no substitute
  origin/main fb5900bd… EXCLUDED

HARD RULE:
  External documentation establishes external-platform facts.
  It does not establish QPF implementation, registration,
  authorization, control, or economic capability.

HARD INVARIANT:
  ERC-8004 discoverability !=  QPF Docs DEPLOYMENT_SET  !=  OINIO Model Registry
  Agentic ID / ERC-7857    !=  Docs DEPLOYMENT_SET      !=  OINIO Model Registry
  ERC-8004 metadata        =   discoverability / context only
  ERC-8004 registration    !=  automatic QPF canonicality
  External identity record !=  proof of contract control
  Agent discoverability    !=  economic authorization
  Proposed integration     !=  deployed integration

FORBIDDEN INFERENCES:
  address found      ≠  QPF contract
  bytecode present   ≠  QPF control
  ecosystem relation ≠  canonical identity
  official docs      ≠  QPF implemented / registered / authorized
```

**Does not authorize:** mint/transfer Agentic IDs, ERC-8004 registration, live compute deposit, storage upload with keys, faucet farming, or any mint/LP/yield.

---

## What `build.0g.ai` is

Official **builder map** (curated from docs.0g.ai + starter kits). Four product lanes:

| Lane | Hub | Already in QPF skills? |
| --- | --- | --- |
| Compute | https://build.0g.ai/compute | **Yes** (P0-A Router-first). Hub quickstart is **Direct/CLI-first** — do not overwrite P0-A |
| Storage | https://build.0g.ai/storage | Partial (G-05). Current package/indexer/scan recorded here |
| Chain | https://build.0g.ai/chain | Partial (networks). Toolchain pin + deploy-scripts added |
| Agentic ID | https://build.0g.ai/agentic-id | **Yes, contained** (G-06 / P0-D). **NO GO** — not identity SoR |

Also: [Tools](https://build.0g.ai/tools) · [SDKs](https://build.0g.ai/sdks) · [Documentation](https://build.0g.ai/documentation) · [Tutorials](https://build.0g.ai/tutorials) · [Showcase](https://build.0g.ai/showcase)

---

## Agentic ID (ERC-7857) — platform facts only

Official: encrypted “intelligent data” NFT. Ownership **and** encrypted model/prompt/capability hashes transfer together via oracle re-encryption (TEE or ZKP). Traditional ERC-721 is insufficient because metadata is public/static and transfer does not move intelligence.

| Capability | Official method (examples contract) |
| --- | --- |
| Register | `mint(to, encryptedURI, metadataHash)` (example: `onlyOwner`) |
| Authorize use without transfer | `authorizeUsage(tokenId, executor, permissions)` — up to 100; `revokeAuthorization` |
| Transfer intelligence | `iTransferFrom(..., sealedKey, proof)` — authorizations **cleared** on transfer |
| Clone | Official overview: new token, same AI metadata |

**Examples vs production**

- Starter: https://github.com/0gfoundation/agenticID-examples (01 mint/manage, 02 auth/delegation, 03 EIP-712 marketplace)
- Galileo **example** contract (beginner kit): `0x2700F6A3e505402C9daB154C5c6ab9cAEC98EF1F`
- Probe 2026-08-15 testnet `eth_getCode`: **non-empty**, 14442 bytes, SHA-256 `cc2d45821a4437891a4c8f424b9f9bbbdcb61b0e2b9b2e5c5dbbfe311442b323`
- Hub note: examples ship a **simplified** ERC-7857. Production: https://github.com/0gfoundation/0g-agent-nft with real TEE/ZKP verification

```text
Galileo example 0x2700…  ≠  Docs DEPLOYMENT_SET
Bytecode on 16602        ≠  QPF control / ABI recovered / QPF agent identity
```

Optional discoverability (does **not** override QPF designation): ERC-8004.

### Hub page increment (2026-08-16) — still NO GO

Re-read [build.0g.ai/agentic-id](https://build.0g.ai/agentic-id) + linked `inft` docs. No mint, no `deploy:testnet`, no 8004 register.

**Examples (tree paths now explicit):**

| # | Path | What the hub sells | QPF |
| --- | --- | --- | --- |
| 01 | `examples/01-mint-and-manage` | Next.js + RainbowKit; mint / hash / auth / transfer | Read-only |
| 02 | `examples/02-authorization-and-delegation` | CLI: per-token + batch auth, hot-wallet delegation, clone, revoke | Read-only |
| 03 | `examples/03-marketplace-trading` | EIP-712 orders, royalties, escrow, fee withdraw | **Economic** — extra GO even after P0-D |

Galileo example on Chain Scan: https://chainscan-galileo.0g.ai/address/0x2700F6A3e505402C9daB154C5c6ab9cAEC98EF1F  
Hub beginner flow: `npm run dev` then optional `npm run deploy:testnet`. **Do not run deploy.** WalletConnect project id is optional UI, not identity.

**Interface split (do not collapse):**

| Surface | Transfer / copy names |
| --- | --- |
| Hub examples | `mint` · `authorizeUsage` · `iTransferFrom(from,to,tokenId,sealedKey,proof)` |
| IERC7857 spec page | `transfer(...)` · `clone(...)` · `authorizeUsage(...)` |

Examples are **simplified**. Production: `0gfoundation/0g-agent-nft` (`eip-7857-draft` branch). EIP-7857 itself is still [ethereum/EIPs#7857](https://github.com/ethereum/EIPs/pull/7857) — a **PR**, not a sealed QPF standard.

**Repo increment (2026-08-16, `0gfoundation/agenticID-examples` README):**

| Name | What the examples claim |
| --- | --- |
| `iCloneFrom` | New token, same intelligent data; **authorizations not inherited** |
| `authorizedTokensOf` | Reverse lookup: tokens a caller may use |
| `authorizedUsersOf` / `isAuthorizedUser` | Forward auth query |
| `batchAuthorizeUsage` | One service across many tokens |
| `delegateAccess` | Hot-wallet / assistant signer |
| ERC-721 Enumerable | `balanceOf` + `tokenOfOwnerByIndex` to list owned agents |
| Marketplace | Separate `AgenticIDMarket`; EIP-712; escrow; `address(0)` = native 0G |

README is explicit: **transfer proofs in this repo are placeholder values**. Real TEE/ZKP is only in production `0g-agent-nft`. That alone disqualifies these contracts as QPF identity or verification evidence.

Do not `npm run dev` / `npm start` / `deploy:testnet`. Do not treat `delegateAccess` as QPF custody. 03 remains economic.

**Oracle facts (docs only):** TEE re-encrypts inside an enclave and attests; ZKP cannot mint a new key for the receiver — sender supplies keys, receiver should rotate after transfer. Sample `PROOF_VALIDITY_PERIOD = 1 hours`. TEE here is execution-environment evidence — same P0-A bound: not privacy absolute, not identity SoR, not economic GO.

**Tutorial env ≠ QPF runtime:**

```text
integration guide  OG_RPC_URL=https://evmrpc-testnet.0g.ai     (ok as Galileo public RPC)
integration guide  OG_STORAGE_URL=https://storage-testnet.0g.ai  ≠  turbo indexer
integration guide  OG_COMPUTE_URL=https://compute-testnet.0g.ai  ≠  Router https://router-api.0g.ai/v1
```

Do not overwrite P0-A Router-first or G-05 indexer names with these tutorial hosts.

**Deep-link set (docs nav still dual `/inft/` and `/agentic-id/`):**

| URL | Role |
| --- | --- |
| https://docs.0g.ai/concepts/inft | Concepts |
| https://docs.0g.ai/developer-hub/building-on-0g/inft/inft-overview | Overview |
| https://docs.0g.ai/developer-hub/building-on-0g/inft/integration | Integration (tutorial) |
| https://docs.0g.ai/developer-hub/building-on-0g/inft/erc7857 | Spec + sample Solidity 0.8.19 |
| https://youtube.com/watch?v=Vo_z6ruKmyo | 14:38 hub tutorial — optional watch |

**Showcase (“Built with Agentic ID”)** is the Cannes 2026 set (DIVE, Orchestra, CaaS, Genie, GhostFi, AgentExpo). Market-map only. DIVE’s “verification” is **not** QPF Level 0 / Docs `DEPLOYMENT_SET`.

```text
hub “Try it without code”  ≠  QPF authorized
example 0x2700…            ≠  Docs DEPLOYMENT_SET
iTransferFrom vs transfer  ≠  QPF ABI
tutorial compute URL       ≠  P0-A Router
Cannes “verification”      ≠  QPF verifier / identity SoR
EIP-7857 PR                ≠  sealed QPF standard
```

---

## ERC-8004 (discoverability) — official 0G registries

Platform fact: 0G lists ERC-8004 registries so agents can be found on [8004scan.io](https://8004scan.io). `agentId` is a **global shared counter**, not per-app.

**Mainnet 16661** (official docs; 2026-08-15 `eth_getCode` non-empty, 130 bytes each, same SHA-256 `e3b1c1b4c04b34f90557a867aaef6bf2d57c5674e7a9f24994ae498ffd0f6f85` — treat as **proxy-like**, not ABI dump):

| Registry | Address |
| --- | --- |
| Identity | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| Reputation | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |

**Galileo 16602** (docs only; not probed this pass):

| Registry | Address |
| --- | --- |
| Identity | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| Reputation | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |

Validation registry: defined by the standard, **still evolving**.

```text
ERC-8004 Identity Registry  ≠  OINIO Model Registry
8004 agentId                ≠  QPF designation
8004scan listing            ≠  QPF canonical identity
Do not write these addresses into CONTRACT_REGISTRY_V1.
```

QPF may later **optionally** register for discoverability. That requires a separate GO and **must not** replace Docs `DEPLOYMENT_SET`.

---

## Storage (G-05 incremental — names only)

| Item | Official now |
| --- | --- |
| TS package | `@0gfoundation/0g-storage-ts-sdk` |
| Go | `github.com/0gfoundation/0g-storage-client` |
| Rust | `0gfoundation/0g-storage-sdk-rust` |
| Testnet indexer | `https://indexer-storage-testnet-turbo.0g.ai` |
| Upload shape | `Indexer` + `MemData` / `ZgFile` → `indexer.upload(file, rpc, signer)` → `rootHash` |
| Download | `indexer.download(rootHash, path, verifyMerkle=true)` |
| Scan | https://storagescan.0g.ai · tool https://storagescan.0g.ai/tool · Galileo https://storagescan-galileo.0g.ai |
| Memory product | https://github.com/0gfoundation/0g-memory (AI assistant memory on 0G Storage) |

Live upload / fund / encrypt remains **wallet GO**. This table does not modernize QPF’s existing client binary.

---

## Chain toolchain (docs gotcha)

- EVM: **cancun**; official hub pins **Solidity 0.8.19**. Newer EVM “may not verify” on Chain Scan.
- Starter: https://github.com/0gfoundation/0g-deployment-scripts
- Faucet: https://faucet.0g.ai (hub: **0.1 0G / day** testnet)
- Indexing: Goldsky (docs)
- Precompiles / staking interfaces: linked from hub; full appendix still G-04

Production RPC: prefer QuickNode / Ankr over public `evmrpc`.0g.ai. See **Tools catalog** below.

---

## Tools catalog (`https://build.0g.ai/tools`, reviewed 2026-08-16)

Hub lists **8** tools (Essential / Infrastructure / Community). Official listing ≠ QPF implemented, subscribed, or authorized.

```text
hub tool listed       ≠  QPF authorized
community gateway     ≠  Router / Direct / Ollama policy
QuickNode 8004 page   ≠  Docs DEPLOYMENT_SET
faucet / paid RPC     ≠  economic GO
```

### Already in QPF workflow

| Tool | Official URL | QPF use |
| --- | --- | --- |
| Testnet Faucet | https://faucet.0g.ai | Galileo only; hub says **0.1 0G / day**. Docs / occasional test-fund. No farming. |
| Chain Scan (Mainnet) | https://chainscan.0g.ai | Read/verify Docs `DEPLOYMENT_SET` on 16661 |
| Chain Scan (Testnet) | https://chainscan-galileo.0g.ai | Galileo explorer |
| Storage Scan (Galileo card) | https://storagescan-galileo.0g.ai | Hub card is **testnet** |
| Storage Scan (mainnet, docs) | https://storagescan.0g.ai · `/tool` | Not on this tools card; keep using for mainnet roots |
| Private Computer | https://pc.0g.ai | **P0-A Router UI**. Review/docs only unless compute GO |

### Infrastructure — RPC preference (no account from this doc)

| Provider | Hub URL | Useful fact | Do not infer |
| --- | --- | --- | --- |
| QuickNode | https://www.quicknode.com/chains/0g | Aristotle + Galileo; also webhooks / streams / backfills. Endpoints are **account-issued**. Prefer over public `evmrpc.0g.ai` for production *reads* if an account already exists. | Not identity SoR. Their [Agent Identity](https://erc-8004.quicknode.com) page is ERC-8004 product surface — **NO GO** as QPF identity. |
| Ankr | https://www.ankr.com/rpc/0g/ | Listed decentralized RPC for 0G. Same rule: optional third-party read path. | Not required. Not a subscribe action from this page. |

Public RPCs remain valid for `eth_getCode` / dry review. Creating paid RPC accounts, webhooks, or streams needs a separate ops GO.

### Community — contained pointer, not a product

| Tool | URL | What it is | QPF stance |
| --- | --- | --- | --- |
| **OpenAdapter** | https://openadapter.dev | Community editor/API gateway (Cursor / VS Code / Claude Code / etc.). Catalog includes a **0G-hosted “Go”** plan and TEE-private models. | **Not** 0G Labs. **Not** Router. **Not** QPF compute SoR. **Not** identity. Do not subscribe, do not replace P0-A, do not sell as QPF verification. |

OpenAdapter is the only *new* named surface on this tools page. Absorb as knowledge. Skip as integration.

| Allowed now | Requires separate GO |
| --- | --- |
| Bookmark / use explorers + public RPC | Faucet farming |
| `pc.0g.ai` review (no deposit) | Paid QuickNode / Ankr account, live webhooks |
| Read OpenAdapter as community map | OpenAdapter subscribe / API key in QPF |
| | Treating any hub tool as identity or economic authority |

---

## Compute hub vs QPF policy

Builder Hub compute page is a **Direct** walkthrough (`0g-compute-cli` deposit ≥3, `transfer-fund`, `app-sk-`, `/v1/proxy`). Example testnet provider in that tutorial: `0xa48f01287233509FD694a22Bf840225062E67836` (Qwen 2.5 7B) — **not** a QPF contract.

QPF agent policy remains **P0-A Router-first**. Hub tutorial ≠ skill runtime default. Dual-balance rule unchanged.

---

## SDK catalog (`https://build.0g.ai/sdks`, reviewed 2026-08-16)

Hub lists **16** packages (6 SDKs · 7 starter kits · 3 community). Official listing ≠ QPF implemented or authorized.

```text
hub package listed     ≠  QPF dependency in use
starter kit            ≠  QPF product
community wrapper      ≠  official SoR
AgenticID examples     ≠  Docs DEPLOYMENT_SET
fine-tune / upload     ≠  compute or storage GO
```

**Naming gotcha:** the card titled **“0G TypeScript SDK”** installs `@0gfoundation/0g-storage-ts-sdk`. That is the **storage** package, not an umbrella SDK.

### Official SDKs

| Hub card | Install / repo | QPF stance |
| --- | --- | --- |
| 0G TypeScript SDK | `npm i @0gfoundation/0g-storage-ts-sdk` | Storage TS (G-05 name). Not live upload. |
| 0G Compute Network SDK | `npm i @0gfoundation/0g-compute-ts-sdk` | **Already in QPF** `package.json` `^0.9.0`. P0-A Router-first still governs. Live inference remains GO. |
| 0G Storage Go SDK | `go get github.com/0gfoundation/0g-storage-client` | Already named. Matches historical `./0g-storage-client` binary lane. |
| 0G Storage Rust SDK | `0gfoundation/0g-storage-sdk-rust` | Already named. Optional; no Rust rewrite. |
| 0G DA Rust SDK | `cargo add 0g-da-rust-sdk` · `0gfoundation/0g-da-rust-sdk` | DA only. Not identity. Not QPF DA product. |
| 0G Memory | `0gfoundation/0g-memory` | Assistant memory on Storage. Market map: crowded plumbing. Do not productize. |

### Official starter kits

| Kit | Repo | QPF stance |
| --- | --- | --- |
| Compute TS starter | `0gfoundation/0g-compute-ts-starter-kit` | Already cited in `INFERENCE_IMPLEMENTATION_V1.md`. Reference, not a second compute path. |
| Storage TS starter | `0gfoundation/0g-storage-ts-starter-kit` | Already in README. |
| Storage Go starter | `0gfoundation/0g-storage-go-starter-kit` | Already in README. |
| **Storage Web starter** | `0gfoundation/0g-storage-web-starter-kit` | **New name on this page.** Browser upload shape only. Live upload still wallet GO. |
| AgenticID examples | `0gfoundation/agenticID-examples` | P0-D **NO GO**. Not identity SoR. |
| Deployment scripts | `0gfoundation/0g-deployment-scripts` | Already named (Solidity 0.8.19 + cancun). Economic deploy gated. |
| Fine-tuning example | `0gfoundation/fine-tuning-example` | Official walkthrough: [`FINE_TUNING_OPERATOR_V1.md`](../0g-compute/FINE_TUNING_OPERATOR_V1.md). Storage + **fine-tuning** sub-account + job. **All gated.** Not a QPF product. |

### Community (not 0G Labs)

| Card | Repo | QPF stance |
| --- | --- | --- |
| Compute Python | `mandatedisrael/0g-py-sdk` → `0g_py_inference` | Community. Not official SoR. Not a second compute policy. |
| Storage Python | `mandatedisrael/0g-py-sdk` → `0g_py_storage` | Same monorepo, storage subtree. |
| 0G Kit (2-liner) | `mandatedisrael/0g-kit` | Prototyping wrappers. Do not replace official SDKs. |

| Allowed now | Requires separate GO |
| --- | --- |
| Read / pin official package names | Live `0g-compute-ts-sdk` inference |
| Keep existing `^0.9.0` compute dep | Storage upload / 0g-memory persist |
| Compare starter kits to current QPF clients | Fine-tune job, DA publish, AgenticID mint |
| | Treating community SDKs as official |

---

## Authorization matrix

| Allowed now | Requires separate GO |
| --- | --- |
| Read hub + this page | `mint` / `iTransferFrom` / `deploy:testnet` / marketplace trade |
| `eth_getCode` on official example / 8004 addresses | ERC-8004 `register` / agent-card publish |
| Compare Router-first vs hub Direct tutorial | Live `0g-compute-cli deposit` / storage `upload` |
| Draft optional 8004 discoverability design | Treating 8004 or Agentic ID as QPF identity SoR |

---

## Official source set

| URL | Role |
| --- | --- |
| https://build.0g.ai/ | Hub |
| https://build.0g.ai/tools | Official 8-tool catalog (2026-08-16) |
| https://build.0g.ai/sdks | Official 16-package SDK / starter / community catalog (2026-08-16) |
| https://faucet.0g.ai | Galileo faucet |
| https://pc.0g.ai | Router / Private Computer UI |
| https://www.quicknode.com/chains/0g | Third-party RPC (account-gated) |
| https://www.ankr.com/rpc/0g/ | Third-party RPC (listed) |
| https://openadapter.dev | Community editor gateway — not official SoR |
| https://build.0g.ai/agentic-id | ERC-7857 examples + Galileo example address |
| https://docs.0g.ai/concepts/inft | Concepts |
| https://docs.0g.ai/developer-hub/building-on-0g/inft/inft-overview | Overview (docs path may say `/agentic-id/` in newer nav) |
| https://docs.0g.ai/developer-hub/building-on-0g/inft/integration | Integration tutorial — tutorial env ≠ Router / indexer |
| https://docs.0g.ai/developer-hub/building-on-0g/inft/erc7857 | ERC-7857 spec (PR, not sealed) |
| https://docs.0g.ai/developer-hub/building-on-0g/agentic-id/erc8004 | 8004 registries |
| https://github.com/0gfoundation/agenticID-examples | Starters |
| https://github.com/0gfoundation/0g-agent-nft | Production reference |
| https://8004scan.io | Cross-ecosystem explorer |

---

**P0-D (2026-08-15):** Builder Hub + Agentic ID / ERC-8004 absorbed as contained knowledge. No mint, no 8004 register, no identity or economic change.  
**Tools pass (2026-08-16):** `https://build.0g.ai/tools` catalog absorbed. Explorers / faucet / `pc.0g.ai` already in workflow. QuickNode/Ankr = optional read-RPC preference. OpenAdapter = community pointer only. No subscribe, no identity change, no spend.  
**SDKs pass (2026-08-16):** `https://build.0g.ai/sdks` catalog absorbed. Compute TS already in `package.json`. New name: `0g-storage-web-starter-kit`. Community py-sdk split recorded. No new deps, no live upload/inference/fine-tune, no identity change.  
**Agentic ID pass (2026-08-16):** Hub page + `inft` docs re-read. Example paths, IERC7857 `transfer`/`clone` vs example `iTransferFrom`, tutorial env hosts, EIP-7857 still a PR. **P0-D remains NO GO.** Not identity SoR.
