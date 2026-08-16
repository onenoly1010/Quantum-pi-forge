# Canonical Identity v1

**Document:** `docs/governance/CANONICAL_IDENTITY_V1.md`  
**Produced:** 2026-08-16T00:39:00Z  
**Repository HEAD at time of writing:** `ed9a4a3e8df496dad3ed6dcb044a7f6b4e6c1b03`  
**Workstream:** W1 — Canonical Identity  
**Gate:** W1 must pass before the manifest phase opens.  

---

## Status: UNVERIFIED

The evidence collected does not establish a single, independently reproducible canonical QPF/OINIO deployment identity.

The contradictions documented below are the work.

---

## 1. Identity — What Is Being Claimed

The claim is that a specific, identifiable QPF/OINIO deployment on 0G Aristotle Mainnet (chain ID 16661) is the authoritative canonical deployment against which all future governance, economic, and verification flows should be measured.

### Repository identity

| Field | Value |
| --- | --- |
| GitHub repository | `onenoly1010/Quantum-pi-forge` |
| Default branch | `main` |
| Commit at G-05 verification | `ce275b81f54d4f166a17f7fac8ffa67f0c937435` |
| Commit at document production | `ed9a4a3e8df496dad3ed6dcb044a7f6b4e6c1b03` |
| Branch this document is on | `copilot/high-stakes-autonomous-agent-operations` |

### Claimed deployment — 0G Aristotle Mainnet

**Chain:** 0G Aristotle Mainnet  
**Chain ID (live `eth_chainId` at G-05, 2026-07-16):** `16661` (`0x4115`)  
**RPC used for verification:** `https://evmrpc.0g.ai`  
**Block at probe:** 38,990,004

There are currently **two distinct address sets** with live on-chain code on Aristotle for OINIO-related contracts. They are not the same deployment. No human canon decision selecting one set as authoritative has been recorded in this repository.

#### Address Set A — Broadcast / CREATE set

Source: `contracts/broadcast/BirthGenesisHeartbeat.s.sol/16661/run-latest.json`  
Deployer: `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc`

| Contract | Address | CREATE tx (0g-chainscan) | Block | `eth_getCode` | Bytecode match (current artifact) | Owner | Status |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| OINIOToken | `0x709f23C7A7172E137427576abB5Eb8959E2A57c1` | `0x78e0247ec538…c5d55` | 36,824,379 | 2,280 bytes | **MATCH** | `0x335651…` (untrusted) | CODE+TX+BYTECODE_MATCH; owner untrusted |
| OINIOModelRegistry | `0x25A9C5A244EAf688E078C387616e2380A0589562` | `0x24a33a32d4a1…c751` | 36,824,380 | 9,710 bytes | **NO MATCH** (size equal; hash differs) | `0x335651…` (untrusted) | CODE+TX; BYTECODE_MISMATCH |
| HeartbeatMonitor | `0xd1d5147f38E74855a133Cd75cE7b040eBE6324a0` | `0xd1cc6e7e97e4…11c4` | 36,824,380 | 2,571 bytes | **NO MATCH** (size equal; hash differs) | `0x335651…` (untrusted) | CODE+TX; BYTECODE_MISMATCH |

#### Address Set B — Docs / public-mint set

These addresses appear in governance receipts, wallet prompt sheets, and prior public copy. They have live on-chain code. They are **not** the outputs of the broadcast CREATE receipts in `run-latest.json`.

| Contract (claimed role) | Address | `eth_getCode` | Bytecode match (current artifact) | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| OINIOToken (docs) | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` | 2,281 bytes | **NO MATCH** | `0x335651…` (untrusted) | CODE_PRESENT; BYTECODE_MISMATCH; NOT_IN_BROADCAST_CREATE |
| OINIOModelRegistry (docs) | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` | 9,850 bytes | **NO MATCH** | `0x335651…` (untrusted) | CODE_PRESENT; BYTECODE_MISMATCH; NOT_IN_BROADCAST_CREATE |
| HeartbeatMonitor (docs) | `0x5E50b92E57e854659f7D98c733088aABd551C49F` | 2,571 bytes | **NO MATCH** | `0x335651…` (untrusted) | CODE_PRESENT; BYTECODE_MISMATCH; NOT_IN_BROADCAST_CREATE |

ABI smoke on docs OINIOToken `0x75995…`: `name()` → `OINIO Token`; `symbol()` → `OINIO`; `decimals()` → 18; `totalSupply()` → 1,000,000,000 whole tokens.

#### Address Set C — Alternate skill-inventory address

| Label | Address | `eth_getCode` | Notes |
| --- | --- | --- | --- |
| OINIOToken (skill alt) | `0x6011c341a01c80f489a5c3Ab751987A55142F04e` | 4,132 bytes | Code present; not matched to current OINIOToken.json; origin unverified |

---

## 2. Evidence — Trail Supporting (or Undermining) the Claim

### 2a. Repository-anchored evidence

| Evidence item | Path | Produced | State |
| --- | --- | --- | --- |
| Activation Gate G-05 contract verification | `docs/activation/evidence/G-05-contract-verification-20260716T195100Z.md` | 2026-07-16 | **Present; PASS (honest partial)** |
| Activation Gate G-05 RPC probe JSON | `docs/activation/evidence/G-05-contract-rpc-20260716T195100Z.json` | 2026-07-16 | Present |
| Activation Gate G-05 bytecode compare (docs set) | `docs/activation/evidence/G-05-bytecode-compare-20260716T195200Z.json` | 2026-07-16 | Present |
| Activation Gate G-05 bytecode compare (broadcast set) | `docs/activation/evidence/G-05-bytecode-compare-broadcast-set-20260716T195300Z.json` | 2026-07-16 | Present |
| G-08 Activation report | `docs/activation/evidence/G-08-activation-report-20260716T195500Z.md` | 2026-07-16 | **NOT ACTIVATION READY** |
| Deployed Addresses matrix | `contracts/DEPLOYED_ADDRESSES.md` | 2026-07-16 | RPC-verified; dual sets recorded; dual-set canon decision pending |
| Trust JSON live deploy proof | `evidence/deployments/TRUST_JSON_LIVE_DEPLOY_PROOF_20260601T061904Z.md` | 2026-06-01 | Site hash match at time of deploy; Cloudflare Pages via Wrangler after GitHub Actions billing freeze |
| EPI manifest anchor transaction | `0G_EPI_MANIFEST_ANCHOR_TRANSACTION.md` | — | sha256 of `evidence-manifest.json` recorded; on-chain upload command listed but **upload not confirmed as executed** in this document |
| Constitutional closure | `docs/governance/QPF_CONSTITUTIONAL_CLOSURE_V1.md` | — | Ceremonial Genesis ≠ execution authority; Operational Genesis governs |
| Guardian authority reconciliation | `docs/governance/GUARDIAN_AUTHORITY_RECONCILIATION_V1.md` | — | Guardian Safe: `0x8d088B88219D072aB035502065ee2410c2cb4389` — authority reference for future governed actions; read-only |
| Mainnet execution result | `docs/governance/MAINNET_EXECUTION_RESULT_V1.md` | 2026-06-22 | `npm run autonomous:v2-mainnet-cutover:execute` **exit code 1** |
| ETH mainnet old wallet untrusted | `docs/security/ETH_MAINNET_OLD_WALLET_UNTRUSTED_V1.md` | 2026-06-17 | `0x335651…` = COMPROMISED_OR_UNTRUSTED; drain tx observed |
| OINIO identity lock registry | `docs/IDENTITY_LOCK.md` | Dec 2025 | Self-declared cluster; **GPG key fingerprint is a placeholder** ("PLACEHOLDER - TO BE COMPLETED BEFORE SUCCESSION CEREMONY") |

### 2b. On-chain evidence summary

| Chain | Chain ID | Verification method | Result |
| --- | --- | --- | --- |
| 0G Aristotle Mainnet | 16661 | Live RPC `eth_chainId`, `eth_getCode`, `eth_getTransactionReceipt` (G-05 gate) | Chain ID confirmed; two distinct address sets with code; **no single set fully verified** |
| Pi Testnet | Pending | Not RPC-verified | **Pending** |
| Pi Mainnet | Pending | Not RPC-verified | **Pending** |

### 2c. Cryptographic evidence

| Item | Status |
| --- | --- |
| GPG key for repository commits (onenoly1010) | **Placeholder in `docs/IDENTITY_LOCK.md`** — fingerprint not yet recorded |
| Signed commits on `main` | Not independently verified in this gate |
| EPI manifest anchor (`sha256(evidence-manifest.json)`) | Hash recorded; on-chain submission not confirmed executed |
| Trust JSON hash match (quantumpiforge.com endpoint) | **Match recorded 2026-06-01** at `6698e59b…`; endpoint status as of this document not re-verified |

### 2d. Deployment provenance — what is known and what is not

- The broadcast CREATE set (`0x709f23…`, `0x25A9C5…`, `0xd1d514…`) was deployed by `0x335651…`, which is now classified as **COMPROMISED_OR_UNTRUSTED** (`docs/security/ETH_MAINNET_OLD_WALLET_UNTRUSTED_V1.md`). A drain transaction from that wallet was observed (tx `0x1fec3b…`).
- The docs/public-mint set (`0x75995…`, `0x67aD71…`, `0x5E50b9…`) has code and responds to ABI calls but has no CREATE receipt in the broadcast log and does not match current local artifacts.
- Both sets have `owner()` → `0x335651…` (untrusted residual). Neither set has been moved to the Guardian Safe (`0x8d088…`).
- No human canon decision has been recorded selecting one of these two sets as the authoritative canonical deployment.

---

## 3. Continuity — Connection to PR #748

PR #748 implements a deterministic artifact-verification pipeline:

```
artifact → receipt → deterministic integrity verification → PASS / FAIL / UNRESOLVED
```

This document is **upstream** of PR #748, not a substitute for it. The pipeline in PR #748 can only be a meaningful verifier once the canonical identity is established here.

The intended system is:

```
CANONICAL IDENTITY  (this document — W1)
       │
       ▼
   MANIFEST        (W2 — not yet open)
       │
       ▼
   ARTIFACT
       │
       ▼
   RECEIPT
       │
       ▼
  QPF VERIFIER (#748)
       │
       ▼
 PASS / FAIL / UNRESOLVED
```

PR #748 must remain open and must not be used to declare W1 complete. The verifier must not become a machine that says "verified" simply because something matches its own receipt.

W1 passes and the manifest phase opens only when this document can record a single, human-selected, evidence-supported canonical deployment set — with ownership moved to the Guardian Safe — and that selection is independently reproducible from the evidence in this repository without private context.

---

## 4. Contradictions That Are Now the Work

The following contradictions must be resolved before W1 can pass:

| # | Contradiction | Required resolution |
| --- | --- | --- |
| C-1 | Two distinct address sets have on-chain code; neither has a human canon selection recorded | Human selects one set as canonical; selection recorded in a signed receipt |
| C-2 | The deployer of the broadcast set (`0x335651…`) is classified as COMPROMISED_OR_UNTRUSTED; it is also the current `owner()` on all probed contracts | Ownership transferred to Guardian Safe `0x8d088…` before any canonical claim |
| C-3 | OINIOModelRegistry and HeartbeatMonitor in the broadcast set have bytecode mismatches against the current local artifact tree | Either the deployment compiler settings are recovered and match is established, or a fresh verified deploy is performed and the broadcast log is updated |
| C-4 | The docs/public-mint set has no CREATE receipt in the broadcast log | Provenance of that deployment must be traced and documented, or the set is formally retired in favor of whichever set is canonically selected |
| C-5 | GPG key fingerprint in `docs/IDENTITY_LOCK.md` is a placeholder | Actual GPG fingerprint recorded and commits verifiably signed |
| C-6 | Pi Network deployments are Pending — chain IDs, RPCs, and contract addresses not yet RPC-verified | Pi deployment verification gate completed or Pi scope formally deferred with a recorded boundary |
| C-7 | EPI manifest anchor on-chain upload listed as a command but not confirmed executed | Upload receipt with transaction hash recorded, or step explicitly deferred |
| C-8 | The v2 mainnet cutover script exited with code 1 | Exit cause diagnosed; either remediated or formally scoped out |
| C-9 | The mainnet execution result failure is from a different execution path than the Cloudflare Pages deploy that served the trust JSON | The relationship between these two paths is not documented; they should be explicitly separated or reconciled |

---

## 5. What This Document Does Not Do

- It does not declare any address set canonical.
- It does not authorize minting, staking, liquidity, bridge activity, treasury movement, yield routing, or agent authority escalation.
- It does not assert that the verifier in PR #748 has validated canonical identity.
- It does not claim the Guardian Safe is currently in control of any contract.
- It does not treat any previous human approval as retroactively establishing canonicality.

---

## 6. Gate Decision

**W1: BLOCKED**

Evidence is insufficient to establish a single, independently reproducible canonical QPF/OINIO deployment identity. The dual address sets, the untrusted deployer residual on current `owner()`, the missing GPG fingerprint, and the pending Pi verification collectively prevent a PASS finding.

The contradictions listed in Section 4 are the work required to advance W1 to PASS.

---

*Evidence sources: `contracts/DEPLOYED_ADDRESSES.md`, `docs/activation/evidence/G-05-*`, `docs/activation/evidence/G-08-activation-report-20260716T195500Z.md`, `docs/security/ETH_MAINNET_OLD_WALLET_UNTRUSTED_V1.md`, `docs/governance/GUARDIAN_AUTHORITY_RECONCILIATION_V1.md`, `docs/governance/QPF_CONSTITUTIONAL_CLOSURE_V1.md`, `docs/governance/MAINNET_EXECUTION_RESULT_V1.md`, `docs/IDENTITY_LOCK.md`, `evidence/deployments/TRUST_JSON_LIVE_DEPLOY_PROOF_20260601T061904Z.md`, `0G_EPI_MANIFEST_ANCHOR_TRANSACTION.md`.*
