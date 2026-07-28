# QPF Contract Registry V1

**Network:** 0G Aristotle Mainnet  
**Chain ID:** 16661 (`0x4115`)  
**RPC:** https://evmrpc.0g.ai  
**Explorer:** https://chainscan.0g.ai  
**Probe time (UTC):** 2026-07-28T17:40Z  

Bytecode digest = SHA-256 of raw deployed bytecode hex (no `0x` prefix). Recompute with:

```bash
# result from eth_getCode → strip 0x → sha256sum of hex-decoded bytes
```

## Core registry

| Name | Address | Explorer | Code | code_sha256 (probe) |
|------|---------|----------|------|---------------------|
| OINIO Token | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` | [view](https://chainscan.0g.ai/address/0x75995EC0fdf881189850aeD864cB3f43c0DFCb58) | 2281 bytes | `3eeffb8f440a4db41722f4570a521e70fcfcf6b0464c858fb46bf9e8a57e95cf` |
| OINIO Model Registry | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` | [view](https://chainscan.0g.ai/address/0x67aD7169184581f23D1E10B39d4eb4e98293E87a) | 9850 bytes | `b6312fc5f01c754957b4e58c0b17baf2a803232d57586145ef0916ef7c5c52a0` |
| Heartbeat Monitor | `0x5E50b92E57e854659f7D98c733088aABd551C49F` | [view](https://chainscan.0g.ai/address/0x5E50b92E57e854659f7D98c733088aABd551C49F) | 2571 bytes | `9c0a62c95d3eff926d6ba986d4e7ef51250803d85246d4666c76e508c31503c1` |
| ForgeRegistry | `0x6011c341a01c80f489a5c3Ab751987A55142F04e` | [view](https://chainscan.0g.ai/address/0x6011c341a01c80f489a5c3Ab751987A55142F04e) | 4132 bytes | `2cf7b167e681488d1747750d586a01a2f5153f7d5febecd6e1d7fe27fe9b36c9` |
| DEX Factory | `0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8` | [view](https://chainscan.0g.ai/address/0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8) | 18951 bytes | `5a8fd96ee61963750abac2225e4595828c246c37da3644816f7dfaea63e898b9` |
| DEX Router | `0x2c70129E50BF88eCD59b89d63af2e8920aCF3951` | [view](https://chainscan.0g.ai/address/0x2c70129E50BF88eCD59b89d63af2e8920aCF3951) | 18953 bytes | `0647749da39ff9885e86d5fca99bc0bfeafb957a123927286bab1b6d1380a1d8` |
| DEX Pair W0G/USDC.e | `0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE` | [view](https://chainscan.0g.ai/address/0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE) | 14954 bytes | `4a087e47a373d81b9b5fbc803522edd16f0421d0c5ea7772da90f0aef0dddb6c` |
| Safe Guardian | `0x8d088B88219D072aB035502065ee2410c2cb4389` | [view](https://chainscan.0g.ai/address/0x8d088B88219D072aB035502065ee2410c2cb4389) | 171 bytes | `a8a0fbd3cdf49e751346664e01b529a58322a814cf8df8d85deb20e63bd6415e` |

## Pair tokens (DEX)

| Name | Address | Code | code_sha256 (probe) |
|------|---------|------|---------------------|
| W0G | `0xD1De4F87C8b195f21254b7163dDA9370D8Df593d` | 2684 bytes | `01bffe829746c71328ff7a5a6b6a2f42d74c1ef2107080ba40417738970d4ab9` |
| USDC.e | `0x1f3aa82227281ca364bfb3d253b0f1af1da6473e` | 1798 bytes | `bba62345c507b53a90beb5dadd2d9bb875a38642725d0dae83973ad8927d6271` |

## Known deployment references

| Event | Reference |
|-------|-----------|
| CreatePair tx | `0x4f887876313a5085337ce22eac9418725558a91225096191057dd6d7d2e2f6a2` |
| CreatePair block | `36238884` |
| Pair seal | `docs/deployments/0g-dex-first-pair-final-state-seal-v1.md` |
| Reserves at verification | **0 / 0** (empty pool — intentional until liquidity authorization) |

## Public mint path (preview only — not enabled)

| Role | Address |
|------|---------|
| Token (approve) | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` |
| Registry (registerModel) | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` |
| Stake | 1 OINIO (`1e18` wei) when/if authorized |
| Metadata | https://quantumpiforge.com/metadata/qpf-public-mint-model-v1.json |

Path remains **REVIEW_ONLY_NOT_EXECUTABLE** / public mint **NO-GO** until separate human GO receipts. See [SECURITY_BOUNDARIES_V1.md](./SECURITY_BOUNDARIES_V1.md).

## Secondary published address

| Name | Address | Note |
|------|---------|------|
| OINIO Token (ERC20, not a pair) | `0x709f23C7A7172E137427576abB5Eb8959E2A57c1` | Listed on public status page; confirm role before any integration |

## Source of truth hierarchy

1. On-chain bytecode + explorer  
2. This registry + sealed receipts under `receipts/`  
3. Public page https://quantumpiforge.com/deployed-addresses  

If page and registry disagree, **prefer chain + this registry probe timestamps**, then open an issue.

---

*Contract Registry V1 — verification data, not an activation order.*
