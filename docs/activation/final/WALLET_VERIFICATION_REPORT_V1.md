# Wallet Verification Report v1

**Mode:** Static + existing non-executing gates. **No signing. No broadcast.**  
**Package wallet deps:** `ethers@^6.17.0` only — **no** wagmi, WalletConnect, RainbowKit, Safe SDK, Ledger/Trezor packages.

## Supported wallet surfaces (repository reality)

| Surface | Intended wallet | Integration style | Production readiness claim |
| --- | --- | --- | --- |
| `deploy/index.html` | EIP-1193 (MetaMask and similar) | `window.ethereum` + ethers v5 CDN | Partial implementation |
| `deploy/dao.html` | EIP-1193 + chain switch | `wallet_switchEthereumChain` + ethers v5 | Partial |
| `deploy/resonate.html` | “Connect Wallet” UI | Button present; **no** `window.ethereum` usage found | **Not implemented** |
| `frontend/production_dashboard.html` | Pi Wallet demo + optional Web3 | `connectPiWallet()`; `new Web3(window.ethereum)` for reads | **Experimental / gated** |
| `frontend/example.html` | Pi Network | Demo connect | Experimental |
| `frontend/src/…TreasuryWidget` | None (read-only RPC) | `ethers.JsonRpcProvider` | Read-only |
| Automated suite | Preflight / prompt inspection | npm scripts | **PASS non-executing** |

## Automated evidence already PASS (do not re-run unless code changes)

| Check | Result |
| --- | --- |
| `npm run security:wallet-preflight-gate:v1:check` | PASS — no private key, no sign, no broadcast |
| `npm run governance:human-wallet-prompt-inspection:v1:check` | PASS — inspection only |
| `npm run governance:phase-32-human-signing-approval-gate:v1:check` | PASS — **NO_GO_SIGNING_NOT_AUTHORIZED** |

Evidence logs: `docs/activation/evidence/G-04-*`

## Acceptance scenarios (MetaMask-class EIP-1193)

Legend: **IMPL** = code path present · **NOT_IMPL** · **UNKNOWN** = needs browser run · **PASS/FAIL** only after interactive test

| # | Scenario | deploy/index.html | deploy/dao.html | production_dashboard | Browser E2E |
| ---: | --- | --- | --- | --- | --- |
| 1 | Connect works | IMPL (`eth_requestAccounts`) | IMPL | Pi demo / Web3 init partial | **UNKNOWN** |
| 2 | Disconnect / accounts cleared | IMPL (`accountsChanged` → reset) | partial | NOT_IMPL | **UNKNOWN** |
| 3 | Correct chain detection | IMPL (`0x4115` / 16661 messaging) | IMPL switch attempt | NOT_IMPL | **UNKNOWN** |
| 4 | Chain switching | **NOT_IMPL** (detect only; no `wallet_switchEthereumChain`) | IMPL switch (empty catch) | NOT_IMPL | **UNKNOWN** |
| 5 | Add chain if missing | NOT_IMPL | NOT_IMPL | NOT_IMPL | N/A |
| 6 | Rejected connect/signature graceful | Partial (alert if no provider; limited reject handling on connect) | catch blocks present | partial | **UNKNOWN** |
| 7 | No duplicate event listeners | IMPL (`FORGE_WALLET_EVENTS_BOUND`) | removeAllListeners in places | NOT_IMPL | **UNKNOWN** |
| 8 | Account change recovery | IMPL `accountsChanged` | NOT_IMPL listeners | NOT_IMPL | **UNKNOWN** |
| 9 | Network change recovery | IMPL `chainChanged` | NOT_IMPL | NOT_IMPL | **UNKNOWN** |
| 10 | Fresh browser session | UNKNOWN | UNKNOWN | UNKNOWN | **UNKNOWN** |
| 11 | Existing session reconnect | UNKNOWN (no explicit eth_accounts on load proven) | UNKNOWN | UNKNOWN | **UNKNOWN** |
| 12 | Mobile wallet deep link | NOT_IMPL | NOT_IMPL | NOT_IMPL | N/A |
| 13 | WalletConnect consistent with MetaMask | **NOT_IMPL** (no WC dependency) | NOT_IMPL | NOT_IMPL | N/A |
| 14 | Gnosis Safe | NOT_IMPL | NOT_IMPL | NOT_IMPL | N/A |
| 15 | Hardware wallets | NOT_IMPL as first-class | NOT_IMPL | NOT_IMPL | N/A |

### Primary homepage path (`deploy/index.html`) — code facts

- Connect: `connectForgeWallet()` → `eth_requestAccounts` if `window.ethereum` else alert.  
- Expected chain: `ARISTOTLE_CHAIN_ID = "0x4115"`; wrong network message if mismatch.  
- **Does not** call `wallet_switchEthereumChain` or `wallet_addEthereumChain`.  
- Listeners bound once via `FORGE_WALLET_EVENTS_BOUND`.  
- ethers **v5** UMD from CDN (not package ethers v6).  

### DAO path (`deploy/dao.html`) — code facts

- Attempts `wallet_switchEthereumChain` then `eth_requestAccounts`.  
- Switch failure: `.catch(() => {})` — **swallows errors** (risk: silent wrong-chain continue).  
- No `accountsChanged` / `chainChanged` binding found in static scan.  

### Production dashboard — code facts

- Labeled **EXPERIMENTAL / GATED**.  
- Pi Wallet button (demo).  
- MetaMask path uses global `Web3` if `window.ethereum` for **read** metrics; treasury address may still be placeholder.  
- Not an activation-critical wallet UX.

## WalletConnect / Safe / hardware

| Wallet type | Supported? | Evidence |
| --- | --- | --- |
| MetaMask (EIP-1193) | Partial UI only | Static code in deploy pages |
| WalletConnect | **No** | No package / no WC bridge code |
| Safe | **No** | No Safe SDK |
| Hardware | **No** first-class | No Ledger/Trezor integration |
| Pi Browser wallet | Demo / experimental | `connectPiWallet`, example HTML |

## Gate verdict for wallets

| Claim | Verdict |
| --- | --- |
| Non-executing security preflight | **PASS** (evidence) |
| Signing authorized | **FAIL / NO-GO** (by design) |
| MetaMask acceptance suite complete | **BLOCKED** — scenarios 1–12 not browser-proven |
| Multi-wallet parity (WC/Safe/HW) | **NOT SUPPORTED** — do not claim |

## To close B-04 (wallet operational readiness)

Run this checklist in a clean browser profile with MetaMask on Aristotle (16661). For each row: screenshot or short log → `docs/activation/evidence/wallet-e2e/<scenario>.md`.

1. Connect / disconnect  
2. Wrong chain → message (and switch if you add switch code)  
3. Reject connection prompt  
4. Switch account mid-session  
5. Switch network mid-session  
6. Reload page reconnect  
7. Hard refresh / new session  
8. No double `accountsChanged` handlers (console)  

**Do not** mark wallet gate PASS until every required scenario is PASS with evidence.  
**Do not** implement WC/Safe unless product requires them — document as unsupported.

## Code change rule (if fixing MetaMask bugs)

Linked issue + evidence of failing scenario + repair + re-run that scenario only (regression). No drive-by wallet rewrites.
