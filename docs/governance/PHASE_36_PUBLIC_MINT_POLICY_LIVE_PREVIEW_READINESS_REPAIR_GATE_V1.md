# Phase 36 — Public Mint Policy + Live Preview Readiness Repair Gate v1

## Status

`PHASE_36_READINESS_REPAIR_GATE_OPEN_NO_EXECUTION`

## Purpose

Repair readiness blockers after Phase 35 human confirmation without authorizing public mint execution, signing, broadcast, wallet prompts, or Phase 33 live execution authorization retry.

## Trigger

- `receipts/governance/phase-35-final-reviewed-values-human-confirmation-v1.json`
- Required status: `KRIS_FINAL_REVIEWED_VALUES_CONFIRMED`

## Blockers repaired

| Blocker | Repair |
|---------|--------|
| `mint_allowed=false` policy ambiguity | Clarified as `POLICY_READINESS_REPAIRED_NOT_AUTHORIZED` |
| `live_execution_script=null` | Replaced with approved manual UI preview path (`mint.html`) |
| `live_gas_estimate=null` | Live RPC preview gate added (`eth_estimateGas`, no broadcast) |
| `path_spec_status=REVIEW_ONLY_NOT_EXECUTABLE` | Repaired classification: `LIVE_PREVIEW_READY_NOT_EXECUTABLE` |

## Preserved Phase 35 values

- model name, metadata URI, chain ID 16661
- OINIO token `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58`
- OINIOModelRegistry `0x67aD7169184581f23D1E10B39d4eb4e98293E87a`
- stake `1 OINIO` / `1000000000000000000` wei
- dry-run fingerprint `e1b801b5388ce2cab47f39ed0aedb47dc01d799432f07a4e7b04e256730361ff`

## Remaining blockers (intentional)

```text
mint_allowed: false
public_mint_active: false
phase_33_execution_authorization: false
public_mint_authorization_receipt_sealed: false
live_execution_script: null
signing: false
broadcast: false
wallet_prompt: false
```

## Execution boundaries

All remain `false`:

- signing, broadcast, public mint execution
- wallet prompt / wallet actions
- Phase 33 live execution authorization retry
- liquidity, staking, bridge, yield routing, treasury movement

## Artifacts

| Artifact | Path |
|----------|------|
| Gate receipt | `receipts/governance/phase-36-public-mint-policy-live-preview-readiness-repair-gate-v1.json` |
| Policy repair | `receipts/governance/public-mint-policy-readiness-repair-v1.json` |
| Approved path | `receipts/governance/public-mint-approved-execution-path-v1.json` |
| Live gas preview | `receipts/governance/public-mint-live-gas-rpc-preview-v1.json` |
| Verify harness | `scripts/review/verify-phase-36-public-mint-policy-live-preview-readiness-repair-gate-v1.cjs` |

## Commands

```bash
npm run governance:public-mint-live-gas-rpc-preview:v1:check
npm run governance:phase-36-public-mint-readiness-repair-gate:v1:check
npm run governance:phase-36-readiness-repair-gate:v1
```

## Next gate

`PHASE_37_PUBLIC_MINT_AUTHORIZATION_READINESS_GATE_SEPARATE_NOT_OPENED`

Phase 36 repairs evidence. It does **not** authorize mint.