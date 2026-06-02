# Quantum Pi Forge 0G Claim Audit

## Purpose

Classify all 0G-related claims before external review.

Each claim is labeled as one of:

- Verified: backed by public proof, transaction, commit, deployed endpoint, or reproducible evidence.
- Demonstrated: backed by local logs or internal evidence, but not independently public yet.
- Planned: intended future work.
- Unsupported: should be removed or rewritten.

## Safety Rule

This audit is read-only.

No deployment, signing, uploading, paid compute, wallet action, liquidity movement, merge, push, or governance action is authorized.

## Initial Claim Table

| Area | Claim | Status | Evidence File / Link | Reviewer Note |
|---|---|---:|---|---|
| 0G Compute | Direct-provider compute path has been demonstrated. | Demonstrated | `0G_COMPUTE_DIRECT_SUCCESS_20260531.md`; `evidence/mainnet-shadow/0g-direct-shadow-20260601T052506Z.md`; `evidence/mainnet-shadow/RESONANCE_DIRECT_COMPUTE_CONFIRMED_20260601T052708Z.md`; `evidence/mainnet-shadow/RESONANCE_DIRECT_COMPUTE_CONFIRMED_20260601T053037Z.md`; `logs/0g-direct-shadow-20260601T052506Z.log`; `ops/status/0g-direct-shadow-20260601T052506Z.json` | Strong local/internal evidence. Needs reviewer-friendly summary and, if possible, independently reproducible command. |
| Router / Direct Provider | Router path is distinct from direct-provider compute path. | Demonstrated | `0G_ROUTER_VOID_FIX.md`; `docs/canon/evidence/0g-router-void-fix.md`; `docs/canon/evidence/router-path-boundary.md`; `docs/ROUTER-STATE-FRICTION.md`; `OINIO_0G_COMPUTE_PATH_DIAGNOSIS_20260529.md` | Important wording issue. Avoid implying router success if proof is only direct-provider success. |
| 0G Chain | 0G Aristotle-related transaction or deployment evidence exists. | Needs verification | `0G_ARISTOTLE_GRANT_TRANSACTION_RECEIPT_20260417.md`; `0G_EPI_MANIFEST_ANCHOR_TRANSACTION.md`; `ARISTOTLE_GRANT_MILESTONE_VERIFICATION_REPORT.md`; `verify_0g_receipt.sh`; `verify-0g.js` | Must extract transaction hash, chain, explorer URL, and verification command before marking Verified. |
| 0G Storage | Storage upload workflow or command evidence exists. | Demonstrated | `0G_STORAGE_UPLOAD_COMMAND.md`; `docs/canon/evidence/0g-storage-upload-command.md`; `0g-storage-client` | Do not claim production storage integration unless root hash/proof and reproducible command are present. |
| 0G DA | DA usage is part of architecture or future-facing positioning. | Planned / needs verification | `docs/0G_SHIP_SKILL_REFERENCE.md`; `docs/GRANT-REVIEW-PACKET.md`; `0G_VERIFICATION_PROTOCOL.md` | Treat as Planned unless a concrete DA transaction/proof is found. |
| Mainnet wording | Some files use mainnet / Aristotle / production language. | Needs wording audit | `MAINNET_INTEGRATION_COMPLETE.md`; `docs/MAINNET_USER_GUIDE.md`; `wiki/Mainnet-Guide.md`; `0G_ARISTOTLE_GRANT_APPLICATION_PRODUCTION.md` | Highest overclaim risk. Must separate live, demonstrated, planned, and grant-facing language. |
| Grant / ecosystem claims | Grant and Hall/forum materials exist. | Needs wording audit | `0G_GRANT_STATUS_TRACKING.md`; `0G_GUILD_APPLICATION_OUTLINE.md`; `0G_HALL_POST_FINAL.md`; `0G_HALL_HEARTBEAT_ANNOUNCEMENT.md`; `GRANT_OPPORTUNITY_TRACKER_2026.md`; `OINIO_RESONANCE_WORKER_GRANT_DRAFT.md` | Keep public asks modest: request review, not validation. |
| Runtime safety | Compute/runtime policy exists. | Demonstrated | `OINIO_COMPUTE_RUNTIME_POLICY_20260531.md`; `docs/canon/0g_canon_boundary.md`; `0G_SOVEREIGN_AGENT_SYSTEM_TRUTH_TABLE.md` | Use this to show restraint: local AI and runtime remain advisory/quarantined. |

## Immediate Reviewer Questions

- Which files contain public transaction hashes?
- Which files contain reproducible commands?
- Which files contain only narrative claims?
- Which claims say “mainnet,” “production,” or “live” without public proof?
- Which claims should be softened from “verified” to “demonstrated”?
- Which claims should be marked “planned”?

## Next Step

Extract exact claim lines from the candidate files and map them into this table.
