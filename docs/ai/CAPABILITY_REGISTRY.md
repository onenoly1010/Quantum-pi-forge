# Capability Registry

**Purpose:** Version-controlled source selection, verification, and approval
rules for AI-assisted work.

| Capability | Preferred implementation source | Production verification | Status | Human approval |
| --- | --- | --- | --- | --- |
| Frontend and UX | `0gskills.com/frontend-ux` and repository public pages | Official 0G docs only when 0G facts are used; deployed-page checks after release | Active | Required for production merge/deploy |
| QA and testing | `0gskills.com/qa`, repository tests, and CI workflows | Existing CI and targeted local checks | Active | Required for production merge/deploy |
| Audit and verification | `0gskills.com/audit`, repository verification guides | Official 0G docs plus live public/RPC checks for production claims | Active | Required for production claims or deployment |
| 0G protocol integration | `0gskills.com/ship` before coding and linked skills as needed | `https://docs.0g.ai/` for chain IDs, RPCs, addresses, and parameters | Guarded | Required for any production change |
| Commercial readiness | `docs/activation/command/revenue/` | Internal evidence and human review; no fabricated metrics | Active | Required before external communication |
| Service delivery | Client discovery, offer, and readiness materials | Scope, acceptance checks, and human review | Preparation only | Required for quotes, agreements, or delivery commitments |
| Outreach | Qualified opportunity records and human-reviewed drafts | Named need, current contact route, and explicit approval | Blocked by default | Required before any external message |
| Governance | `docs/governance/` and applicable receipts | Current repository policy and explicit authority | Guarded | Required |

## Registry maintenance

- Add a capability only when its preferred source and verification method are
  known.
- Mark unsupported or unverified capabilities as `Preparation only` or
  `Blocked`, never as active.
- Update the registry through pull request review when authorization or source
  policy changes.
