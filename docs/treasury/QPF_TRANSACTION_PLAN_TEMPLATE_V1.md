# QPF Transaction Plan Template v1

## Purpose
Template for human-reviewed, AI-assisted unsigned transaction planning.

## Required Fields
- purpose: TBD_BY_OPERATOR
- chain_id: TBD_BY_OPERATOR
- network_name: TBD_BY_OPERATOR
- from_wallet_label: TBD_BY_OPERATOR
- destination_address_or_contract: TBD_BY_OPERATOR
- asset: TBD_BY_OPERATOR
- amount_cap: TBD_BY_OPERATOR
- gas_cap: TBD_BY_OPERATOR
- method_or_action: TBD_BY_OPERATOR
- risk_notes: REQUIRED
- expected_trezor_screen_checks: REQUIRED
- operator_approval_required: true

## Trezor Screen Verification Checklist
- Confirm chain/network.
- Confirm receiving address or contract address.
- Confirm asset/token.
- Confirm amount.
- Confirm method/action.
- Confirm gas/fee.
- Reject if anything differs from the reviewed plan.

## Boundary
This template does not authorize signing, broadcasting, funding, wallet creation, approval, swap, bridge, deployment, or fund movement.
