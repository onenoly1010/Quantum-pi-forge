# OINIOModelRegistry — Genesis Resonance iNFT Classification

**Date:** 2026-06-26
**Audit Receipt:** `project-erc721-surface-audit-v1.json`
**Contract:** `contracts/src/OINIOModelRegistry.sol`
**VERIFICATION.md Status:** ✅ Production Ready (dated 2024-12-13)

---

## Classification: `MINT_READY_NOT_PUBLIC_READY`

The contract is fully mint-capable but the deployment is unanchored and the governance/soulbound gating for "Genesis Resonance" has not been applied.

---

## 7-Point Checklist

### 1. ✅ Does it mint?
Yes. `registerModel()` → `_safeMint(msg.sender, modelId)`. Production-tested (22 tests, 100% coverage).

### 2. ⚠️ Who is allowed to mint?
**Anyone** with OINIO tokens and an approved allowance. No whitelist, no role gate, no payment gate beyond OINIO staking. OK for open AI model registry; NOT ok for gated Genesis Resonance iNFT launch without additional access control.

### 3. ✅ Does `tokenURI()` resolve correctly?
Yes. Overrides `(ERC721, ERC721URIStorage)`, delegates to `super.tokenURI()`. Metadata set via `_setTokenURI` on registration and `updateModelMetadata`.

### 4. 🔶 Is burn behavior intentional?
**Inherited but unused in normal flow.** Contract inherits `ERC721Burnable` but never calls `_burn()` in the normal lifecycle. `withdrawStake()` emits `ModelDeactivated` but does NOT burn the token. The NFT persists after stake withdrawal. Burn is available to `owner()` via `Ownable` inheritance but is not part of the documented flow.

### 5. ❗ Are transfers allowed, or should soulbound/limited-transfer logic exist?
**Transfers fully unrestricted.** `transferModel()` → `safeTransferFrom(from, to, modelId)` with no cooldown, no lockup, no soulbound constraint, no governance veto. The contract treats NFTs as freely tradeable assets. For Genesis Resonance iNFTs, this may be intentionally open (tradeable AI models) or may need a soulbound toggle.

### 6. ❌ Is this already deployed at a known address?
**No deployed address recorded.** The VERIFICATION.md specifies deployment gas (2,029,175 gas ~2.03M) and declares status "✅ Production Ready", but no on-chain address, chain ID, or deployment receipt exists in the repo. The contract has been **compiled, tested, and gas-estimated** but there is no evidence of mainnet/testnet deployment.

### 7. 🔶 Does the public site/docs accurately say what exists?
The VERIFICATION.md accurately describes contract features, but does NOT disclose:
- That minting is unrestricted (any caller with OINIO)
- That burn is inherited but never invoked in normal lifecycle
- That transfers are completely unrestricted
- That no deployment address exists

---

## Next Gate Actions

| Priority | Action | Rationale |
|----------|--------|-----------|
| **P0** | Decide: soulbound NFT or tradeable? | If Genesis Resonance iNFTs should be locked to creator/owner, add `_beforeTokenTransfer` hook or soulbound extension |
| **P0** | Anchor deployment or decide not-deployed-yet | Record deployed address + chain in contract natspec (`@custom:deployed-at`) or explicitly classify as deploy-pending |
| **P1** | Add access gating for Genesis Resonance mint | `onlyRole(MINTER_ROLE)` or signature-based mint for controlled Genesis launch |
| **P2** | Document burn behavior explicitly | State whether `withdrawStake` should also `_burn` the token, or if deactivated-but-visible NFTs are intentional |
| **P2** | Add `ModelBurned` event if burn-on-withdraw is desired | Currently `withdrawStake()` emits `ModelDeactivated`, not a burn event |
| **P3** | Update public docs with classification status | Replace "Production Ready" with actual deployment state in VERIFICATION.md |

---

**Summary:** The OINIOModelRegistry is a complete, tested, audited ERC721 contract with real mint capability. It is classified `MINT_READY_NOT_PUBLIC_READY`. The next Genesis Resonance iNFT milestone is not "build from zero" but **"gate, anchor, and document what already exists."**