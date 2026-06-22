# Fresh Mainnet Reauthorization Preparation v1

Prepares the governance record for a fresh operator reauthorization after the previous single-use execution window was consumed and sealed with exit_code=1.

Current verified state:
- main_head=2c2595a11d133321c89ce378dc6ffa983d6f5cd3
- prior_execution_attempted=true
- prior_execution_exit_code=1
- prior_execution_success=false
- single_use_window_consumed=true
- dependency_repair_complete=true
- dependency_repair_build_exit_code=0

This preparation receipt does not authorize execution.

Boundary posture:
- operator_reauthorization_granted=false
- new_execution_window_open=false
- rerun_authorized=false
- wallet_actions=false
- private_key_access=false
- signing_attempted=false
- transaction_broadcast=false
- deploy_attempted=false
- live_execution=false

Next valid boundary: fresh-mainnet-operator-reauthorization-v1
