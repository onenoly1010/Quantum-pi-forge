# QPF Verification Certificate #000

**Type:** Internal demonstration (same process applied to QPF itself)  
**Not:** External customer certificate · not a success/adoption claim · not an audit  
**Purpose:** Example of honesty — verified vs gated vs not verified  

```text
Here is the same process applied internally.
Not a marketing claim that the market has validated QPF.
```

---

## Header

| Field | Value |
| --- | --- |
| Certificate ID | **#000** |
| Project | Quantum Pi Forge / OINIO (self) |
| Network | 0G Aristotle mainnet |
| Chain ID | **16661** (`0x4115`) |
| Status JSON | https://quantumpiforge.com/verification-status-v1.json |
| Portal | https://quantumpiforge.com/deployed-addresses |
| Methods | `eth_chainId`, `eth_getCode`, public status JSON, portal claims |
| Recorded (UTC) | **2026-08-04T23:52:22Z** (live RPC re-check) |

---

## Verified components

| Component | Result | Notes |
| --- | --- | --- |
| Network identity | **verified** | Public RPC `eth_chainId` → `0x4115` (**16661**) |
| OINIO Token code at claimed address | **verified** | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` — `eth_getCode` non-empty |
| OINIO Model Registry code | **verified** | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` — `eth_getCode` non-empty |
| DEX pair reserves (W0G/USDC.e pair claim) | **verified empty** | `getReserves` eth_call → zero reserves (liquidity not seeded) |
| Public status machine published | **verified** | `verification-status-v1.json` reachable; schema present |
| Claimed economic posture published | **verified** (as publication) | JSON states public_mint / liquidity **NOT_AUTHORIZED** |

---

## Gated / locked (explicit)

| Component | Label | Notes |
| --- | --- | --- |
| Public mint activation | **gated** | `mint_activation: LOCKED` · `public_mint: NOT_AUTHORIZED` |
| Liquidity / commercial DEX open | **gated** | `liquidity: NOT_AUTHORIZED` · pair may exist; reserves expected **0/0** until separate GO |
| Yield / staking / bridge | **gated** | `NOT_AUTHORIZED` in status JSON |
| Site signing / broadcast | **gated** | `site_signing_broadcast: DISABLED` |

---

## Not verified (by this certificate)

| Claim | Label |
| --- | --- |
| Economic activity / revenue | **not verified** |
| Future roadmap delivery | **not verified** |
| Token value or market demand | **not verified** |
| External adoption / user count | **not verified** (Phase 8.5 eligible reports **0/3** as of status JSON) |
| Formal third-party security audit | **not verified** / not claimed |
| Full bytecode-to-source formal verification of every contract | **unknown** / out of Starter scope unless expanded |

---

## Evidence references (public)

| Evidence | Location |
| --- | --- |
| Status JSON | https://quantumpiforge.com/verification-status-v1.json |
| Portal | https://quantumpiforge.com/deployed-addresses#verify-now |
| Independent re-check | Anyone may re-run `eth_chainId` / `eth_getCode` on public RPC |
| Invitation for external reports | GitHub issue #636 (multi-report round; not market adoption) |

---

## Risk labels summary

| verified | gated | not verified | unknown |
| --- | --- | --- | --- |
| chain · code-at-address (core listed) · status publication | mint · LP · yield · site signing | revenue · roadmap · adoption · market value | deep formal audit-grade coverage |

---

## Decision / use of #000

```text
#000 demonstrates the certificate format and honesty discipline.
It is NOT Certificate #001 (external recipient).
#001 requires an independent project + delivery (+ ideally payment).
```

**Operator note:** Re-run RPC checks when issuing a dated public copy; update timestamp and any changed code/reserves facts.
