# QPF Unsigned Transaction Preparation v1

## Status
This system defines the safe lane for AI-assisted unsigned transaction planning.

## Scope
- AI may prepare transaction intent summaries.
- AI may prepare risk notes.
- AI may prepare gas and amount caps.
- AI may prepare unsigned transaction structures.
- AI may generate evidence receipts.

## Hard Boundaries
- AI must not hold seed phrases.
- AI must not hold private keys.
- AI must not sign transactions.
- AI must not broadcast transactions.
- AI must not move funds.
- AI must not create wallets.
- AI must not request blind signing.
- AI must not bypass the Trezor screen.

## Trezor Rule
The Trezor screen is the final source of truth before any signature. Kris signs only if the device-displayed chain, address, amount, token, contract, gas, and method match the reviewed plan.

## Required Transaction Plan Fields
- purpose
- chain_id
- network_name
- from_wallet_label
- destination_address_or_contract
- asset
- amount_cap
- gas_cap
- method_or_action
- risk_notes
- expected_trezor_screen_checks
- operator_approval_required

## Authorization Boundary
This document authorizes planning only. It does not authorize signing, broadcasting, funding, approval, swap, bridge, deployment, wallet creation, or fund movement.
