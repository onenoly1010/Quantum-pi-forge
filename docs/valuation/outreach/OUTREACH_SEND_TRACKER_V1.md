# Outreach Send Tracker v1

Status: OPEN

Base commit: bbf4293

## Purpose

Track reviewer-ready outreach targets, contact state, next action, and evidence links without performing wallet, chain, mint, liquidity, staking, bridge, or funds actions.

## Outreach states

- NOT_STARTED
- IDENTIFIED
- READY_TO_SEND
- SENT
- FOLLOW_UP_REQUIRED
- REVIEW_IN_PROGRESS
- CLOSED_NO_FIT
- CLOSED_ACCEPTED

## Target table

| Target | Category | Contact path | Status | Next action | Notes |
|---|---|---|---|---|---|
| **Round 1 Slot A — independent peer** | Verification (8.5) | Any non-maintainer DM/email | **READY_TO_SEND** | Human paste Slot A | Packet: docs/community/ROUND1_REVIEWER_SHARE_PACKET_V1.md · Gmail draft r5089641743510582523 |
| **Round 1 Slot B — security form** | Verification (8.5) | https://www.openzeppelin.com/request | **READY_TO_SEND** | Human paste Slot B | Alt: trailofbits.com/contact · not a paid audit ask |
| **Round 1 Slot C — 0G ecosystem peer** | Verification (8.5) | https://phala.com/contact or peer DM | **READY_TO_SEND** | Human paste Slot C | Points at #verify-now + #636 only |
| Guild on 0G / 0G Foundation | Ecosystem grant / partner | https://guild.0gfoundation.ai/ | **PARKED_APPLICATIONS_CLOSED** | Re-check when program reopens; not Phase 8.5 path | Live page 2026-07-30: Applications Closed |
| 0G Accelerator (Apollo) | Accelerator | https://apollo.0g.ai | SOURCE_VERIFIED | Human review + send decision | Traction-stage path; Web3Labs alt available |
| OpenZeppelin Security Audits | Security / diligence | https://www.openzeppelin.com/request | SOURCE_VERIFIED | Human review + auditor brief send | Trail of Bits alt: trailofbits.com/contact |
| Phala Network | Infrastructure partner | https://phala.com/contact | SOURCE_VERIFIED | Human review + partner one-pager send | Listed on 0g.ai/partners |
| Gitcoin Grants GG24 Dev Tooling | Grant / public good | giveth Notion apply link in LIVE_OUTREACH_TARGETS_V1.md | SOURCE_VERIFIED | Human review + grant cover letter send | Confirm domain eligibility/window first |

## Safety posture

Outreach tracking only. No wallet signing, token transfer, liquidity activation, staking activation, bridge activation, public mint opening, private key access, or funds movement.
