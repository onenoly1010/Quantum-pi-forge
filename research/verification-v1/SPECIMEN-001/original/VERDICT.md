# Original verdict (pre-adversarial baseline)

| # | Proposition | Verdict | Basis |
|---|---|---|---|
| P1 | Deployment target chain id is 0x4115 (16661) | VERIFIED (scoped to observation time) | obs-chainId.raw.json == 0x4115 |
| P2 | OINIO bytecode exists at 0x709f23C7…57c1 | VERIFIED (scoped) | obs-oinio-getCode: 2280 bytes non-empty; matches DEPLOYED_ADDRESSES claim of 2280 bytes |
| P3 | UniswapV2Pair exists at 0x2067319D…AaeE with 0/0 reserves | VERIFIED (scoped) | pair code 14,954 B; getReserves decodes to 0 / 0 / 0 |
| P4 | Exactly one W0G token exists on 16661 | **CONFLICT** — two distinct addresses (0xd1de4f87…9593d and 0x1Cd0690f…109c) both return name() == "Wrapped 0G" | obs-w0gA-name.raw.json, obs-w0gB-name.raw.json |

Scope limitations:
- Verdicts are scoped to the observation timestamps in MANIFEST.sha256.
- Bytecode existence does not establish correctness, authorization, mint rights,
  or ownership provenance.
- P4 conflict resolution requires governance/deployer information not present
  in public evidence.
