# Safe Infrastructure — Operator Reference v1

**Class:** official Safe developer-surface knowledge  
**Dashboard (login):** https://developer.safe.global/home  
**Public docs:** https://docs.safe.global/home/what-is-safe · https://docs.safe.global/home/safe-core  
**Reviewed:** 2026-08-16  
**QPF Safe (measured):** Guardian `0x8d088B88219D072aB035502065ee2410c2cb4389` on 0G Aristotle **16661** — see `0G_SOCIAL_RECOVERY_SETUP_GUIDE.md`

```text
developer.safe.global/home     =  login dashboard, not QPF SoR
Safe “digital identity” copy   ≠  Docs DEPLOYMENT_SET
Guardian address present       ≠  contract Ownable control
Protocol Kit via RPC           ≠  authorized propose/execute
hosted Transaction Service     ≠  exists for chain 16661
```

**Does not authorize:** propose/sign/execute Safe txs, ownership transfer to Guardian, flatten nested owners, fund EOAs, mint / LP / yield / Pi.

---

## What that URL is

`developer.safe.global/home` is the **Safe Developer Dashboard** (account-gated). It is not the documentation SoR and not a QPF control plane.

The public stack is **Safe Infrastructure** (`docs.safe.global`):

| Layer | Official job | QPF use |
| --- | --- | --- |
| **Smart Account** | Modular Safe contracts | Guardian already exists on 16661 (proxy + `getOwners` / `getThreshold` / `nonce`) |
| **SDK** | Starter · Protocol · API · Relay kits | Do not add as a product dep |
| **API** | Hosted Transaction Service / Events Service | **Not listed for 0G 16661** |

Official [supported-networks](https://docs.safe.global/advanced/smart-account-supported-networks) list does **not** include 16661 / Aristotle / Galileo (checked 2026-08-16).

Reality Engine already forbids inventing Safe Transaction Service URLs (`docs/activation/reality/REALITY_ENGINE_V0.md`). Keep that.

---

## Kit map (docs only)

| Kit | Talks to | On 0G today |
| --- | --- | --- |
| Protocol Kit | On-chain Safe via **RPC** | Possible in principle against `https://evmrpc.0g.ai`. **No propose/execute.** |
| API Kit | Hosted Transaction Service | **No official 0G URL.** Do not invent one. |
| Starter Kit | Abstracts Protocol + API + 4337 | Skip. Extra stack. |
| Relay Kit | Gelato / ERC-4337 gas sponsorship | Skip. Extra spend + infra. |

Multi-sig on Guardian is **on-chain threshold + nested Safes**, not an official Safe{Wallet} cloud queue. Nested 3-of-4 / 2-of-2 is embraced (`0G_SOCIAL_RECOVERY_SETUP_GUIDE.md`). Flatten remains parked.

---

## Control vs designation (unchanged)

- Identity SoR = Docs `DEPLOYMENT_SET`
- Live `owner()` on those contracts is still the untrusted residual `0x335651…`
- Guardian is **not** Ownable owner
- Transfer of ownership to Guardian is a **separate human GO** with receipts

Safe’s marketing that smart accounts “own digital identities” does not make Guardian QPF identity.

---

## QPF stance

| Allowed now | Requires separate GO |
| --- | --- |
| Read docs / this page | `developer.safe.global` account, API keys |
| RPC-read Guardian (`getOwners`, threshold, nonce) via Reality Engine | Protocol Kit propose / sign / execute |
| | Deploy social-recovery module |
| | Ownable transfer to Guardian |
| | Host or invent a 0G Transaction Service |

Sell-one-verification does not go through Safe. Payments stay **NOT GO**.
