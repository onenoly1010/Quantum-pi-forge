# PR 287 Post-Merge Governance Receipt v1

## Purpose

This receipt seals the normal post-merge state for PR 287, which added the v2 public funder packet index v1.

The receipt exists to prove that the public funder packet index landed on canonical main through the normal merge path and that the local governance verifier stack plus build remained green after merge.

## Canonical merge anchor

- PR: #287
- Merged artifact: v2-public-funder-packet-index-v1
- Canonical branch: main
- Post-merge commit: c88b903f72512621e1774f26cdfbf4c655cf53b2
- Post-merge short commit: c88b903
- Post-merge subject: Seal PR 285 post-merge governance receipt v1 (#286)
- Post-merge commit date: 2026-06-11T22:41:25-06:00
- Receipt generated at: 2026-06-12T04:51:20.216Z

## Verified post-merge posture

The system remains parked in a bounded, non-executing governance state after PR 287.

Required false flags:

- mainnet_cutover_approval_granted == false
- mainnet_cutover_executed == false
- deployment_executed == false
- broadcast_executed == false
- state_changing_transaction_executed == false
- investment_offer_created == false
- token_sale_created == false
- guaranteed_return_promised == false
- funder_execution_authority_granted == false

Required true flags:

- public_funder_packet_index_created == true
- public_funder_packet_index_merged == true
- post_merge_receipt_created == true
- local_governance_verifiers_green == true
- local_build_green == true

## Boundary statement

PR 287 does not create an investment offer, token sale, guaranteed return, mainnet cutover approval, deployment execution, broadcast transaction, or funder-controlled execution path.

The public funder packet index is a navigation and review artifact only. It keeps funder review, technical review, and infrastructure-support discussion separate from execution authority.

## Status

PR 287 post-merge receipt v1 is ready for review once this receipt lane is merged through the normal PR path.
