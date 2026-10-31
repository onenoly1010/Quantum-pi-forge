# Sample Claim Report — OINIO on 0G Aristotle

Product: QPF Claim Check  
Price of a real signed report: CAD $3,500  
This sample is a public demonstration, not a paid engagement.  
Date: 2026-09-30  
Network: 0G Aristotle Mainnet, chain ID 16661 (0x4115)  
RPC: https://evmrpc.0g.ai  
Explorer: https://chainscan.0g.ai

## Claim under test

On chain 16661, code exists at the address QPF publishes as the OINIO token, and the published W0G/USDC.e pair is a live market.

## Scope

Content and state identity only.

This report does not assess exploitability, token value, legal status, or future price.

## Method

- Read chain id from the published RPC
- Read `eth_getCode` at the published token address
- Read pair reserves at the published pair address
- Compare to the project’s public registry

Reproduction sits on https://quantumpiforge.com and in the public repo.

## What the evidence establishes

- The RPC answers with chain id 16661.
- Bytecode is present at `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58`. That address is not empty.
- A pair contract exists at `0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE`.
- Published pair reserves are 0/0. No liquidity is seeded.

## What the evidence does not establish

- That OINIO has market value
- That mint, staking, or yield are authorized
- That the bytecode matches a specific audited source line-for-line without a separate source-verify pass
- That any user, customer, or revenue exists
- That a Pi Network bridge exists

## What remains unknown

- Runtime behavior under hostile input
- Admin-key / upgrade reality beyond what a dedicated ownership pass would show
- Whether future governance receipts will authorize mint or LP

## Language lock for the project

Allowed: “OINIO token bytecode is deployed on 0G Aristotle; the published pair has zero reserves; mint and yield are not authorized.”

Forbidden: “live DEX,” “yield live,” “community market,” “Pi bridge live,” “sovereign economy.”

## Verdict line

The deployment claim is partially established. The market claim is not established. Economic activation remains gated.

This sample is the product. Sell the next one about someone else’s system.
