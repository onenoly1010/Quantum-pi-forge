# Post-Failure Repair Readiness v1

Records that the prior single-use execution attempt was consumed and sealed with exit_code=1, and that the dependency/layout blocker has now been repaired.

Current state:
- main_head=af85fdb918d44f910bbf9e9e44a06c8763c06a37
- prior_execution_attempted=true
- prior_exit_code=1
- prior_success=false
- dependency_repair_receipt=receipts/governance/foundry-dependency-layout-repair-v1.json
- dependency_repair_build_exit_code=0

Boundary posture:
- no rerun authorized by this receipt
- no wallet action performed
- no private key access performed
- no signing attempted
- no transaction broadcast
- no deploy attempted
- no live execution
- fresh operator reauthorization required before any new execution window

Verified locally:
- cd contracts && forge build
- npm run governance:mainnet-execution-result:v1:check
- npm run governance:v2-mainnet-cutover-execution:v1:check
- npm run verify:evidence
