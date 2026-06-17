# Orchestrator Negative-Test v1

This negative test proves the gated command orchestrator fails closed before command parsing or live execution exists.

## Tested subject

- Script: `scripts/security/gated-command-orchestrator-dry-run-v1.sh`
- Receipt: `receipts/security/evidence/gated-command-orchestrator-dry-run-v1.json`

## Negative cases

| Case | Expected | Result |
| --- | --- | --- |
| `OPERATIONAL` mode attempted | Reject | Rejected |
| Missing policy/evidence context | Reject | Rejected |

## Current posture

- Dry-run mode still required: `true`
- Operational mode accepted: `false`
- Missing policy accepted: `false`
- Command parser implemented: `false`
- Real execution enabled: `false`
- Private key used: `false`
- Transaction signed: `false`
- Transaction broadcast: `false`
- Storage write attempted: `false`
- Chain-state mutated: `false`

## Final negative-test status

`FAIL_CLOSED_CONFIRMED`
