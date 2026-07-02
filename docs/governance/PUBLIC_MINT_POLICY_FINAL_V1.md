# Public Mint Policy — Final v1

> Phase 9 — Mint Policy Readiness  
> Status: **DEFINED — NO ACTIVATION**  
> Sealed at: `c39b577` (2026-07-02)

---

## Mint Status

**Public minting is NOT active.** This document defines the policy only.

## Policy Decisions

| Question | Answer |
|---|---|
| What can be minted? | AI Model NFTs via `OINIOModelRegistry.registerModel()` |
| Who can mint? | Any address on 0G Aristotle Mainnet — but **currently DISABLED** |
| Public, allowlist, guardian-only, or disabled? | **Disabled** until Phase 14 opens |
| Mint cost? | No fixed fee; `stakeAmount > 0` OINIO per mint, transferred to registry |
| Where do funds go? | Held in `OINIOModelRegistry` at `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` |
| What metadata is attached? | Non-empty `metadataURI` pointing to IPFS or on-chain metadata |
| What receipt proves authorization? | `ModelRegistered` event (modelId, creator, name, metadataURI, stakeAmount) |
| What wallet warning must users see? | NEVER enter seed phrase. NEVER send funds manually. Only use official site. Verify contract address. |
| Canonical contract address? | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` |

## Authorization Chain Required Before Opening

1. ✅ Phase 9 — Mint policy sealed (this document)
2. ⬜ Phase 12 — Guardian authorization sealed
3. ⬜ Phase 13 — Controlled mint executed and verified
4. ⬜ Phase 14 — Public mint opening receipt sealed

## Safety Assertions

- `no_public_mint`: **true**
- `no_wallet_execution`: **true**
- `policy_sealed_only_no_activation`: **true**

---

## References

- Receipt: `receipts/governance/public-mint-policy-final-v1.json`
- Contract: `contracts/src/OINIOModelRegistry.sol`
- Network: 0G Aristotle Mainnet (chain 16661)