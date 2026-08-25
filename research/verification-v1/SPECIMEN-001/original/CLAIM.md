# Specimen #1 — Claim Under Verification

**Claim set (as asserted by QPF public surface / DEPLOYED_ADDRESSES.md):**

1. The deployment target is chain 0G Aristotle Mainnet, chain id `0x4115` (16661).
2. An OINIO token contract with deployed bytecode exists at
   `0x709f23C7A7172E137427576abB5Eb8959E2A57c1`.
3. A UniswapV2Pair exists at `0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE`
   with reserves **0 / 0** (no liquidity added).
4. Exactly one wrapped-0G token ("Wrapped 0G" / "W0G") exists on chain 16661.

Claims 1–3 derive from `contracts/DEPLOYED_ADDRESSES.md` + public verification-artifact.
Claim 4 is included deliberately as an adversarial probe: public references name
`0x1Cd0690fF9a693f5EF2dD976660a8dAFc81A109c`, while the recorded QPF DEX stack
couples to `0xd1de4f87C8B195F21254B7163DDA9370D8DF593D`. The verifier must report
what the evidence actually establishes without preferring either address.
