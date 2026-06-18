# 0G Compute Inference Evidence Dry-Run Gate v1

## Purpose

Establish a verifiable **non-executing evidence boundary** for the 0G Compute Network inference path. This gate documents that the QPF team has reviewed the [0G Compute Inference documentation](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference), understands the two access paths (Router vs Direct), and asserts that no live execution, private-key signing, wallet funding, or provider transfer has occurred.

This gate is the bridge between the current **public reviewer / pre-cutover demo phase** and a future **verified 0G Compute inference lane** — without violating the safety boundary.

## Status

`non-executing` — this gate stores findings from a documentation review. No 0G Compute CLI commands were run. No wallet keys were requested. No inference requests were made.

## Summary

| Assertion | Value |
|---|---|
| 0G Compute documentation reviewed | `true` |
| Router path identified as recommended for QPF | `true` |
| Direct path requires wallet signing | `true` |
| Private key requested during this gate | `false` |
| Wallet signature requested during this gate | `false` |
| Funding attempted | `false` |
| Provider transfer attempted | `false` |
| Inference request attempted | `false` |
| Live execution performed | `false` |
| TEE verification path identified | `true` |

### Router — recommended for QPF agent/prototype use

The Router provides a single OpenAI-compatible endpoint, unified balance, automatic provider failover, and API-key access. This fits Quantum Pi Forge better than wallet-signing every request.

### Direct — not safe without dedicated wallet/funding gate

The Direct path connects to individual providers, requires per-provider sub-accounts, and signs every request with a wallet. The CLI path also asks for a private key during login and uses deposits/transfers for funding.

### TEE Verification

0G Compute supports TEE verification modes including TeeML and TeeTLS. Responses can be checked with `processResponse` using `ZG-Res-Key` / chat ID to verify provider TEE signature integrity. This path is preserved for future verified inference.

## Blocked Commands

The following commands are **blocked by this gate** and must **not** be executed without a separate, operator-approved execution receipt:

```bash
0g-compute-cli login
0g-compute-cli deposit --amount 10
0g-compute-cli transfer-fund --provider <PROVIDER_ADDRESS> --amount 1
```

Those cross into private-key/funding territory per the 0G Compute Inference documentation.

## Files

- **Gate document:** `docs/governance/0G_COMPUTE_INFERENCE_EVIDENCE_DRY_RUN_GATE_V1.md`
- **Receipt:** `receipts/runtime/0g-compute-inference-evidence-dry-run-gate-v1.json`
- **Verifier:** `scripts/verify-0g-compute-inference-evidence-dry-run-gate-v1.cjs`
- **NPM script:** `integration:0g-compute-inference-evidence-dry-run-gate:v1`

## Review Window

This gate locks in the current understanding of the 0G Compute Network inference surface. Any future move to live inference execution requires a separate execution receipt with operator approval.