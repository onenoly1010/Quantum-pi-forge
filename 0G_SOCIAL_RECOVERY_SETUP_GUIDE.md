# 0G Social Recovery Setup Guide

This guide documents the 0G social recovery and **Guardian Safe** security setup for Quantum Pi Forge on **0G Aristotle Mainnet**.

**Trust rule:** Live chain measurements and Reality Engine evidence outrank this Markdown.  
If they disagree, treat this file as stale until updated.

| Re-verify | Command / path |
| --- | --- |
| Full snapshot + brief | `npm run reality:run` |
| Docs vs chain (claim-map) | `npm run reality:claim-map` |
| Latest measured state | `docs/activation/reality/state/latest.json` |
| Latest brief | `docs/activation/reality/briefs/LATEST.md` |

**Baseline measurement cited below:** Reality Engine snapshot `2026-07-28T16:59:53Z`, chain ID `16661`, block `40077790` (re-run commands above for current values).

---

## Guardian Safe (measured)

| Field | Value |
| --- | --- |
| Address | `0x8d088B88219D072aB035502065ee2410c2cb4389` |
| Network | 0G Aristotle Mainnet |
| Chain ID | `16661` |
| RPC (project-configured) | `https://evmrpc.0g.ai` |
| Safe surface | Proxy bytecode present (Safe-family views: `getOwners` / `getThreshold` / `nonce`) |
| Threshold | **3-of-4** (measured; supersedes older “1-of-4” copy) |
| Nonce (at baseline) | `10` |
| Modules / Guard | Not asserted in this guide (probe modules separately if needed) |

### Structural owners (public addresses)

These are **on-chain owner slots**, not private keys. Publishing structure improves reviewer credibility; keys remain offline / operator-held.

| Slot | Address | Type (measured) |
| --- | ---: | --- |
| 1 | `0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC` | EOA Signer 1 (no Safe views) |
| 2 | `0xF69bA0dDAa323B07F57Fb02e0835391ba9DD08DE` | **F69 nested Safe** |
| 3 | `0xf50FeE9d77f5161581A47f48874fB3f99a9EDBd1` | **F50F nested Safe** |
| 4 | `0x353663cd664bB3e034Dc0f308D8896C0a242e4cd` | EOA Signer 2 |

Checksum / casing may differ in explorers; compare case-insensitively.

---

## Nested architecture (embraced, not temporary embarrassment)

Guardian is **not** a flat four-EOA multisig. Two of its four owners are themselves Safes. That is an **institutional-grade nested multisig** posture: sub-Safes can enforce their own thresholds before a Guardian signature is effective.

```
                    ┌─────────────────────────────┐
                    │   Guardian Safe (3-of-4)    │
                    │ 0x8d088B88…4389             │
                    └─────────────┬───────────────┘
          ┌───────────────┬───────┴────────┬────────────────┐
          ▼               ▼                ▼                ▼
   EOA Signer 1      F69 Safe          F50F Safe      EOA Signer 2
   0x335651…F4DC     0xF69bA0…08DE     0xf50FeE…dBd1  0x353663…e4cd
                     (2-of-2)          (2-of-2)
                          │                  │
              ┌───────────┴──┐        ┌──────┴──────────┐
              ▼              ▼        ▼                 ▼
         0x9588…c2e   EOA Signer 2   EOA Signer 2   EOA Signer 1
```

### Nested Safe detail (baseline measurement)

| Safe | Threshold | Owners (measured) |
| --- | --- | --- |
| **F69** `0xF69bA0…08DE` | **2-of-2** | `0x9588fed230b62e36b3880cfda0cc4cc242969c2e`, `0x353663cd664bB3e034Dc0f308D8896C0a242e4cd` |
| **F50F** `0xf50FeE…dBd1` | **2-of-2** | `0x353663cd664bB3e034Dc0f308D8896C0a242e4cd`, `0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC` |

### How a Guardian transaction actually executes

1. Reach **3 of 4** Guardian owner confirmations (EOA and/or nested Safes).
2. For each **nested Safe** that must confirm: satisfy that Safe’s own threshold first (F69 and F50F are both **2-of-2** at baseline).
3. Submit / pay gas on the hop that broadcasts (often an EOA). Nested hops need native gas on the **sub-Safe and/or its signing EOAs**, not only on Guardian.

This multi-hop path is intentional security depth. It is also an **ops surface**: any dry address on the path can stall execution.

---

## Execution-chain gas (ops residual)

Reality Engine watches these five addresses (`watch_balances` in `docs/activation/reality/expected/expected-config-v1.json`):

| Label | Address | Role | Baseline native (approx.) |
| --- | --- | --- | --- |
| EOA Signer 1 | `0x335651…F4DC` | Guardian owner + F50F owner | ~3.09 (OK at baseline) |
| **EOA Signer 2** | `0x353663…e4cd` | Guardian owner + F69 + F50F owner | **0 — `LOW_GAS` at baseline** |
| F69 Safe | `0xF69bA0…08DE` | Nested Guardian owner | ~2.82 (OK) |
| F50F Safe | `0xf50FeE…dBd1` | Nested Guardian owner | ~2.99 (OK) |
| Guardian Safe | `0x8d088B…4389` | Root Safe | ~0.996 (OK) |

### Operator policy (zero-funding friendly)

- **Logged, not blocking technical credibility work:** EOA Signer 2 needs native gas before paths that require *that* key to submit transactions.
- **Do not stall docs / grant readiness** on funding EOA Signer 2.
- Immediate governance can still proceed if **other keys** can form a valid 3-of-4 Guardian quorum and nested sub-Safe thresholds without relying on a dry submitter (depends on wallet UX and which owner initiates).
- Re-check live: `npm run reality:run` — `LOW_GAS` alerts appear in the Reality Brief.

**Funding EOA Signer 2 is a commercial/ops task** (requires native tokens). It is **parked** as an acknowledged bottleneck, not a protocol defect.

---

## Flatten migration (parked)

| Decision | Status |
| --- | --- |
| Unwind F69 / F50F from Guardian (flatten to EOAs only) | **Parked** |
| Why parked | Multi-tx Safe owner changes + gas across nested hops; needs funded runway |
| When to reopen | After external funding / liquidity; explicit human authorization + fresh Reality Engine baseline |
| Current posture | **Embrace nested architecture** and keep documentation truthful |

Do **not** treat nesting as a bug to fix under zero-funding constraints.

---

## What Guardian does *not* currently own (honesty)

Live Ownable probes on tracked OINIO token/registry/heartbeat sets still resolve `owner()` to  
`0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC` (historical deployer / **untrusted residual** — see `docs/security/ETH_MAINNET_OLD_WALLET_UNTRUSTED_V1.md` and `contracts/DEPLOYED_ADDRESSES.md`).

**Guardian Safe is not yet the on-chain Ownable owner of those contracts.**  
Any future ownership transfer is human-authorized only, with receipts.

---

## Files

| File | Purpose |
|------|---------|
| `docs/activation/reality/expected/expected-config-v1.json` | Reality Engine pins (Guardian, nested labels, watch balances) |
| `docs/activation/reality/state/latest.json` | Latest measured snapshot |
| `docs/activation/reality/claim-map/LATEST.md` | Docs vs chain drift report |
| `contracts/ZeroGSocialRecovery.sol` | Social recovery module (gated, not deployed) |
| `contracts/script/DeploySocialRecovery.s.sol` | Recovery module deployment script (gated) |
| `contracts/script/DeployYieldRouter.s.sol` | Phase 7 yield-routing deployment script |
| `scripts/broadcast-phase7.sh` | Broadcast helper for Phase 7 deployment |
| `scripts/0g_social_recovery.py` | Guardian CLI tool |
| `receipts/governance/phase-7-guardian-address-intake-v1.json` | Guardian intake receipt |
| `receipts/governance/guardian-completion-acceptance-v1.json` | Safe acceptance seal |
| `receipts/governance/phase-7-authorization-proposal-v1.json` | Authorization proposal |
| `receipts/governance/phase-7-pre-execution-validation-v1.json` | Pre-execution validation |
| `receipts/governance/0g-skills-prereq-readiness-v1.json` | 0G skills readiness |

---

## Phase 7 Deployment (historical / gated broadcast)

```bash
export DEPLOYER_KEY='0xYOUR_PRIVATE_KEY_HERE'
cd ~/Quantum-pi-forge
bash scripts/broadcast-phase7.sh
```

**Expected outcome (aspirational for that script path — not a claim that all rows are live today):**

- `YieldRouterFactory` deployed
- `FeeCollector` address computed as nonce 3 of factory
- `LegacyVault` at nonce 0, `PioneerRewards` at nonce 1, `OperationalTreasury` at nonce 2
- Intended design: set `FeeCollector` Ownable to Guardian Safe after deploy (verify with RPC; not claimed live here)
- Safe must later call `FeeCollector.activate()` via `execTransaction` (nested confirmations + gas path apply)

---

## Social Recovery (Gated)

The `ZeroGSocialRecovery` module is created but **not** authorized for production deployment. To enable (future, human-gated):

1. Deploy `ZeroGSocialRecovery` with ForgeRegistry address and threshold  
2. Enable module on Guardian via authorized Safe transaction (3-of-4 + nested hops)  
3. Test mock recovery with guardian signatures  

---

## Safety

- **Structural owner addresses are public** (this document + Reality Engine). **Private keys are never published.**
- All wallet actions (sign / spend / transfer / owner change / module enable) require **explicit human authorization**.
- Nested architecture is **documented reality**, not a secret.
- Evidence verification: `npm run verify:evidence`  
- Reality verification: `npm run reality:full`
