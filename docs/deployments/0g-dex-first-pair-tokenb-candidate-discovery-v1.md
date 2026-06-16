# 0G DEX First Pair Token B Candidate Discovery v1

Status: CANDIDATE_DISCOVERY_REQUIRED
Base head: 6a7f189

## Boundary

No Token B address is selected in this lane. This is a discovery and review boundary only.

## Reason

The read-only metadata probe tooling is now merged, but a valid Token B ERC-20 contract address must be selected before running it. Public ecosystem material confirms 0G Aristotle is live, but does not by itself provide a governed Token B candidate suitable for direct probe execution.

## Selection Requirements

A Token B candidate must have:

- verified contract address on 0G Aristotle Mainnet
- ERC-20 metadata support: name, symbol, decimals
- distinct address from W0G
- clear public source for provenance
- no existing pair conflict unless intentionally documented
- read-only probe receipt before any pair creation, approval, transfer, liquidity, or broadcast

## Next Permitted Action

Identify one candidate Token B address from an authoritative source, then run:

TOKEN_B=0x... npm run probe:v2-first-pair-metadata:v1

Only after the receipt exists may this verifier be run:

npm run governance:v2-first-pair-metadata-probe:v1:check
