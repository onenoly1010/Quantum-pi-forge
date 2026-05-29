# 0G Compute Path Diagnosis

0G Compute exposes two documented inference paths:

- **Router:** OpenAI-compatible API endpoint with unified balance, API key access, and provider failover.
- **Direct:** Provider-specific execution using per-provider sub-accounts and wallet-signed request headers.

Our diagnostics show:

- **Discovery:** Router/provider discovery succeeds, proving CLI login, network access, and provider visibility are functional.
- **Router Path (`/v1/proxy`):** The request path returns HTTP 402, indicating a billing/account-state failure at the proxy or router abstraction layer.
- **Direct Path:** Direct provider execution returns HTTP 200 with a valid completion ID, proving the wallet-authenticated provider lane is functional.

## Conclusion

The 402 is not evidence of broken local execution or invalid provider access. It is isolated to the proxy/router billing path.

The direct provider lane is the correct sovereign execution path for OINIO because it uses documented provider metadata, provider-specific funding, and signed request headers instead of relying on the centralized router abstraction.

## Strategic Interpretation

This is not a workaround around 0G Compute. It is an intentional use of the direct provider execution model exposed by the protocol.

OINIO bypasses the Router abstraction while remaining strictly inside the intended 0G Compute payment and provider-auth model.
