# 0G Compute Inference Implementation v1

**Status:** Implemented (Direct path CLI)  
**Date:** 2026-07-30  
**Upstream docs:** [0G Compute Inference](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference)  
**SDK:** `@0gfoundation/0g-compute-ts-sdk`  
**Boundary:** Live wallet ops require `OG_COMPUTE_LIVE=1` and are blocked when `NO_WALLET_TOUCH=true`

---

## Review of official Direct path

0G Compute offers two inference paths:

| Path | Auth | Balance model | When to use |
| --- | --- | --- | --- |
| **Router** | API key | Unified Router balance on pc.0g.ai | Most server apps / prototypes |
| **Direct** (this page) | Wallet-signed headers or Bearer `app-sk-*` | Per-provider sub-accounts | dApps, on-chain control, QPF Direct policy |

### Official Direct SDK flow (chatbot)

1. `createZGComputeNetworkBroker(wallet)` on Aristotle (`https://evmrpc.0g.ai`, chain **16661**) or Galileo testnet  
2. Optional: `broker.inference.listService()` / `listServiceWithDetail()`  
3. Optional: `broker.inference.verifyService(provider, reportDir, onStep)`  
4. Fund: `ledger.depositFund(≥3)` then `ledger.transferFund(provider, 'inference', amountWei ≥ 1e18)`  
5. `getServiceMetadata(provider)` → `{ endpoint, model }`  
6. `getRequestHeaders(provider)` → billing/auth headers  
7. `POST ${endpoint}/chat/completions` with messages + model  
8. Optional: `processResponse(provider, chatID)` using `ZG-Res-Key` header / body `id`

### Service types

- `chatbot` — chat completions  
- `text-to-image` — image generations  
- `speech-to-text` — audio transcriptions  

### TEE modes

- **TeeML** — model runs in TEE  
- **TeeTLS** — TEE broker proxies to centralized provider with routing proof  

### Operational notes from docs

- Delayed (batch) fee settlement on Direct sub-accounts  
- Default rate limits: ~30 req/min, burst 5, 5 concurrent  
- Browser: no auto-fund (manual transfer); Node: background auto-funding available  
- Minimums: ledger deposit **3 0G**, provider sub-account **1 0G**

---

## QPF policy alignment

| Source | Stance |
| --- | --- |
| `OINIO_COMPUTE_RUNTIME_POLICY_20260531.md` | Prefer **Direct**; Router non-authoritative while 402/billing broken |
| `docs/governance/0G_COMPUTE_INFERENCE_EVIDENCE_DRY_RUN_GATE_V1.md` | Non-executing evidence gate; no login/deposit/transfer without separate receipt |
| This implementation | Default = review / read-only list / token chat; wallet SDK live is **opt-in** |

---

## CLI

```bash
# Docs + env checklist (default; no wallet, no inference)
npm run 0g:compute:review

# List providers (read-only broker — no private key)
npm run 0g:compute:list
npm run 0g:compute:list:detail

# Chat with pre-issued Bearer app-sk token (no new signing)
npm run 0g:compute:chat-token -- "hello"

# Live Direct SDK chat (operator-approved only)
OG_COMPUTE_LIVE=1 PRIVATE_KEY=0x… PROVIDER_ADDRESS=0x… \
  npm run 0g:compute:chat-sdk -- "hello"

# Fund provider sub-account (operator-approved only)
OG_COMPUTE_LIVE=1 PRIVATE_KEY=0x… PROVIDER_ADDRESS=0x… \
  npm run 0g:compute:fund
```

### Entry point

`scripts/0g-compute/inference-cli.mjs`

### Environment

| Variable | Purpose |
| --- | --- |
| `OG_NETWORK` | `mainnet` (default) or `testnet` |
| `OG_RPC_URL` | Override RPC (default `https://evmrpc.0g.ai`) |
| `NO_WALLET_TOUCH=true` | Blocks `chat-sdk` and `fund` |
| `OG_COMPUTE_LIVE=1` | Required for `chat-sdk` and `fund` |
| `PRIVATE_KEY` | Wallet for signed Direct SDK ops |
| `PROVIDER_ADDRESS` | Target provider |
| `OG_DIRECT_TOKEN_FILE` | File containing `app-sk-…` / `Bearer app-sk-…` |
| `OG_DIRECT_PROVIDER_URL` | Full chat/completions URL for token mode |
| `OG_DIRECT_MODEL` | Model id for token mode |
| `OG_MAX_TOKENS` | Cap (default 256) |
| `OG_DEPOSIT_AMOUNT` | Fund deposit in 0G (default 3) |
| `OG_TRANSFER_AMOUNT` | Sub-account transfer in 0G (default 1) |

---

## Fixes vs older QPF helpers

| Older artifact | Issue | Corrected here |
| --- | --- | --- |
| `tmp/.../fund-0g-provider.ts` | `transferFund(provider, 2)` wrong arity | `transferFund(provider, 'inference', amountWei)` |
| `query-0g-direct-provider.js` | Hardcoded URL/model only | Wrapped as `chat-token` + documented env |
| Router scripts | 402 billing | Not treated as authoritative |

---

## Safety

- No private keys in repo  
- `NO_WALLET_TOUCH=true` fails closed on wallet paths  
- Dry-run gate remains: `npm run verify:0g-compute-inference-evidence-dry-run-gate:v1`  
- Live fund/sign requires a separate operator decision beyond this document  

---

## References

- https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference  
- https://docs.0g.ai/developer-hub/building-on-0g/compute-network/account-management  
- https://docs.0g.ai/developer-hub/building-on-0g/compute-network/router/overview  
- https://github.com/0gfoundation/0g-compute-ts-starter-kit  
- `OINIO_COMPUTE_RUNTIME_POLICY_20260531.md`  
- `0G_COMPUTE_DIRECT_SUCCESS_20260531.md`  
