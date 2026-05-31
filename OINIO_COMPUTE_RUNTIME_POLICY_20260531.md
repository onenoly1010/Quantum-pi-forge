# OINIO Compute Runtime Policy

**Date:** 2026-05-31
**Status:** Active direct-provider policy

## Runtime Priority

Quantum Pi Forge currently treats 0G Compute Direct Provider execution as the canonical decentralized inference path.

Runtime priority:

1. 0G Compute Direct Provider
2. Local Ollama guardian fallback
3. Router / OpenAI-compatible path only after billing-state issue is resolved

## Router Status

The Router path is not authoritative until it demonstrates successful inference and activity accounting.

Observed Router state:

- Funded dashboard balance exists.
- API keys exist.
- Router requests/tokens are not registering.
- Prior Router inference attempts returned billing-state errors.

## Direct Provider Status

The Direct Provider path has returned HTTP 200 and valid model output on 0G Aristotle Mainnet.

## Worker Policy

Any autonomous or semi-autonomous worker must:

- Prefer direct-provider inference when 0G Compute is required.
- Cap token usage per run.
- Log model, provider, endpoint mode, request ID, and cost estimate.
- Fall back to local Ollama when direct-provider execution fails.
- Never treat Router failure as project failure while Direct Provider remains operational.
