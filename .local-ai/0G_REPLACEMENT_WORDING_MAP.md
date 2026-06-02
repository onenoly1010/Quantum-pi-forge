# 0G Replacement Wording Map

## Purpose

Map risky 0G-related claims to reviewer-safe replacement wording.

This file is advisory only. It does not modify public project files.

## Replacement Table

| File | Risky Claim | Risk | Safer Replacement |
|---|---|---|---|
| `0G_ARISTOTLE_GRANT_APPLICATION_OUTLINE.md` | "Quantum Pi Forge is a live sovereign yield protocol deployed on 0G Aristotle Mainnet. It is the first production implementation..." | Overstates production/live status unless backed by current public bytecode, tx, and explorer proof. | "Quantum Pi Forge is preparing a 0G Aristotle-facing review package with documented compute, storage, and contract evidence. Production/live deployment claims require independent verification before public use." |
| `0G_ARISTOTLE_GRANT_APPLICATION_PRODUCTION.md` | "M1 and M2 milestones are now fully completed on mainnet." | Implies completed grant/milestone status and verified mainnet state. | "M1 and M2 candidate evidence has been assembled for external review. Mainnet-related claims should be treated as pending independent verification." |
| `0G_COMPUTE_DIRECT_SUCCESS_20260531.md` | "verified mainnet decentralized AI inference" | "Verified" may imply independent/public verification. | "demonstrated direct-provider 0G Compute inference, supported by local logs and internal evidence." |
| `0G_GUILD_APPLICATION_OUTLINE.md` | "All milestones are complete. This protocol will run indefinitely without maintenance." | Overconfident and likely unverifiable. | "Milestone evidence has been assembled for review. Long-term operation claims require ongoing monitoring, security review, and independent validation." |
| `0G_HALL_POST_FINAL.md` | "production-deployed decentralized revenue protocol live on 0G Aristotle Mainnet" | Strongest public overclaim risk. | "review-ready protocol package with 0G Aristotle-related evidence, direct compute proof, and deployment/verification materials requiring independent review." |
| `0G_HALL_POST_FINAL.md` | "successfully completed the $235,000 CAD 0G Aristotle Grant" | Could imply official grant approval/payment/completion. | "prepared a grant evidence package and is seeking ecosystem review/support." |
| `0G_HALL_POST_FINAL.md` | "This protocol will run indefinitely without maintenance." | Unverifiable permanence claim. | "The architecture is designed for long-lived operation, but requires external review, monitoring, and maintenance assumptions to be documented." |
| `OINIO_RESONANCE_WORKER_GRANT_DRAFT.md` | "first deployed autonomous agent on 0G" | "First", "deployed", and "autonomous" all require strong external proof. | "candidate autonomous verification-agent design for 0G, currently constrained by manual approval and review-only safety boundaries." |

## Global Replacement Rules

Use:
- "demonstrated" for local logs or internal evidence
- "verified" only for public proof with reproducible checks
- "prepared for review" for grant/forum language
- "planned" for DA, autonomous runtime, storage permanence, or future scaling unless proof exists

Avoid unless independently proven:
- "first"
- "production"
- "live"
- "fully completed"
- "all milestones delivered"
- "verified mainnet"
- "will run indefinitely"
- "autonomous" without quarantine language

## Next Step

Use this map to create one limited documentation patch.
Recommended first public patch target:

1. `0G_COMPUTE_DIRECT_SUCCESS_20260531.md`
2. `0G_HALL_POST_FINAL.md`
3. `0G_ARISTOTLE_GRANT_APPLICATION_PRODUCTION.md`

Start with the compute file because it is closest to real evidence and easiest to fix safely.
