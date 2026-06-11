# Apply Lone-Steward Branch Protection v1

## Status

Sealed governance application lane.

## Context

The lone-steward governance baseline is sealed on main.

That baseline records that required approving reviews are not meaningful while the repository has no independent eligible reviewer.

## Applied Protection Change

The required approving review count is reduced to zero in lone-steward mode.

This does not remove governance.

It replaces impossible review friction with controls that can be honestly satisfied.

## Required Controls Retained

pull_request_flow_required == true  
linear_history_required == true  
branch_protection_required == true  
local_verifier_gate_required == true  
receipt_gate_required == true  
fake_review_allowed == false  
full_autonomous_network_live == false  

## Review Gate Restore Condition

The approving-review requirement should be restored when:

eligible_independent_reviewer_count >= 1

## Non-Claim

This lane does not claim full autonomy.

This lane does not weaken truth requirements.

It removes an impossible hard-review condition and preserves auditable verifier-based governance.
