# OINIO 0G Direct Provider Success Attestation

Date: 2026-05-29

## Summary

OINIO successfully established a working 0G Compute direct-provider inference path using the 0G Compute SDK and a provider-specific API secret stored outside the repository.

This confirms that the OINIO system can reach 0G Compute through the funded direct-provider lane even while the separate Router API key path continues to return HTTP 402.

## Network

- Network: 0G Aristotle Mainnet
- Chain ID: 16661
- RPC: https://evmrpc.0g.ai

## Wallet

- Wallet: 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

## Provider

- Provider: 0x4870CbC4D07d6Ac2EE5aA865588e5985FE77a4E9
- Model requested: 0GM-1.0-35B-A3B
- Model returned: 0GM-1.0-35B-A3B-0427
- Direct endpoint: https://compute-network-20.integratenetwork.work/v1/proxy/chat/completions

## Funding

A provider inference sub-account was initialized and funded.

- Initial required minimum: 1.00 0G
- Initial provider sub-account transfer tx: 0x6232f4067f1688d9770b35b1b6fa5a0ba81c0d4f8e7359f4a99c4c506026ae9e
- Additional buffer transfer: 0.25 0G
- Buffer transfer tx: 0xde1bc12bd3c015e9ae6e287401fb00976cef5d6c9e99bc9de5940a800e2f7c6f
- Verified provider sub-account balance after buffer: 1.250000000000000000 0G

## Security

An initial provider token was generated during terminal diagnostics and treated as exposed.

- Exposed token ID: 0
- Revocation tx: 0xfae97c19251c1fd8e65a892069082984b69476d5b8a254945dda50c2f8c34f69
- Replacement token ID: 1
- Replacement token storage: local-only outside repo
- Token file path: ~/.0g-compute-cli/oinio-0gm-token1.txt

No provider API token, wallet private key, or `.env` secret is committed.

## Successful Inference Proof

The repository script `scripts/query-0g-direct-provider.js` successfully loaded the provider token from the local-only token file and queried the direct provider endpoint.

Observed result:

- HTTP status: 200
- Completion ID: 85cb44ca0f5a4bfe86e6e51235f6e0d3
- Content: OINIO direct provider path online
- Finish reason: stop
- Prompt tokens: 50
- Completion tokens: 207
- Total tokens: 257

## Interpretation

The working path is:

1. Main 0G Compute account funded.
2. Provider-specific inference sub-account funded.
3. Provider signer acknowledged.
4. Provider-specific API secret generated.
5. OINIO local script loads token from local-only file.
6. Direct provider inference succeeds.

The remaining Router API issue is separate:

- Router endpoint: https://router-api.0g.ai/v1
- Router API key path still returns HTTP 402 insufficient_balance.
- Direct provider path succeeds with provider-specific billing and auth.
