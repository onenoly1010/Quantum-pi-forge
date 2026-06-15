# 0G DEX Ship Skill Reconciliation v1

Status: RECONCILED_NO_BROADCAST
Base commit: dda73a9
Ship skill source: docs/0g-skills/ship-SKILL-v1.md
First pair manifest: docs/deployments/0g-dex-first-pair-selection-manifest-v1.md
Execution scaffold: docs/deployments/0g-dex-pair-init-execution-v1.md

## Boundary

This reconciliation does not create pairs, add liquidity, approve spenders, transfer tokens, set feeTo, or broadcast transactions.

## Reconciliation Findings

1. The Ship skill has been locally ingested and governed before further DEX pair execution work.
2. The first-pair selection lane remains read-only and NOT_SELECTED.
3. The execution scaffold remains SUPERVISED_EXECUTION_PENDING.
4. Token metadata must be read on-chain before Token B can be selected.
5. Factory pair existence must be checked with getPair before any createPair or liquidity action.
6. Chain ID, RPC target, Factory, Router, and W0G addresses must remain explicit in downstream probes.

## Next Permitted Lane

Read-only token metadata probe only.

## Explicitly Forbidden In This Lane

- createPair broadcast
- addLiquidity broadcast
- token approvals
- token transfers
- feeTo mutation
- private key usage
- liquidity amount selection

## Verification Command

npm run governance:0g-ship-skill-reconciliation:v1:check
