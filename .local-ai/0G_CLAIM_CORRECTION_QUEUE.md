# 0G Claim Correction Queue

## Purpose

Track 0G-related wording that may need to be softened, verified, or removed before external review.

This is a review-only document. It does not authorize runtime, deployment, wallet, governance, merge, or public posting actions.

## Highest-Risk Claim Categories

### 1. Mainnet / Live / Production Claims

Risk:
Some files describe the system as live, production-deployed, operational, or fully completed on 0G Aristotle Mainnet.

Reviewer-safe rule:
Only use "live", "production", "deployed", or "verified" when backed by current public proof, transaction hash, explorer link, bytecode check, deployed endpoint, or reproducible command.

Preferred safer wording:
- "demonstrated in local/internal evidence"
- "prepared for external review"
- "partially verified"
- "mainnet-facing evidence exists"
- "requires independent re-verification before production claim"

Candidate files:
- `0G_ARISTOTLE_GRANT_APPLICATION_OUTLINE.md`
- `0G_ARISTOTLE_GRANT_APPLICATION_PRODUCTION.md`
- `0G_HALL_POST_FINAL.md`
- `0G_GRANT_FOLLOWUP_EMAIL.md`
- `ARISTOTLE_GRANT_MILESTONE_VERIFICATION_REPORT.md`

### 2. Completed Grant / Milestone Claims

Risk:
Some language says Aristotle grant milestones are complete, delivered, or verified.

Reviewer-safe rule:
Grant/milestone claims should be separated from technical evidence. Do not imply grant acceptance, official approval, or ecosystem validation unless externally confirmed.

Preferred safer wording:
- "milestone package prepared"
- "candidate evidence assembled"
- "submitted for review"
- "requires external reviewer confirmation"

Candidate files:
- `0G_HALL_POST_FINAL.md`
- `0G_ARISTOTLE_GRANT_APPLICATION_PRODUCTION.md`
- `0G_GRANT_STATUS_TRACKING.md`
- `ARISTOTLE_GRANT_MILESTONE_VERIFICATION_REPORT.md`

### 3. Router vs Direct Provider Claims

Risk:
Direct-provider compute success must not be described as router success.

Reviewer-safe rule:
Keep direct-provider and router paths explicitly separate.

Preferred safer wording:
- "direct-provider compute path demonstrated"
- "router path remains blocked by 402 billing/account-state issue"
- "router evidence is not equivalent to direct-provider evidence"

Candidate files:
- `0G_COMPUTE_DIRECT_SUCCESS_20260531.md`
- `OINIO_0G_COMPUTE_PATH_DIAGNOSIS_20260529.md`
- `0G_ROUTER_VOID_FIX.md`
- `docs/ROUTER-STATE-FRICTION.md`
- `docs/canon/evidence/router-path-boundary.md`

### 4. Autonomous Runtime Claims

Risk:
Public language about autonomous agents or persistent monitors may imply active autonomous execution.

Reviewer-safe rule:
Autonomous runtime must be described as quarantined, advisory, gated, or planned unless currently verified and intentionally active.

Preferred safer wording:
- "advisory/local reviewer mode"
- "runtime remains quarantined"
- "manual approval required"
- "no autonomous wallet signing or deployment"

Candidate files:
- `0G_HALL_HEARTBEAT_ANNOUNCEMENT.md`
- `OINIO_RESONANCE_WORKER_GRANT_DRAFT.md`
- `OINIO_COMPUTE_RUNTIME_POLICY_20260531.md`
- `0G_SOVEREIGN_AGENT_SYSTEM_TRUTH_TABLE.md`

### 5. Storage / DA Claims

Risk:
Storage and DA claims may imply active production integration without root hash, DA proof, or reproducible verification.

Reviewer-safe rule:
Only claim storage/DA as verified if there is a root hash, upload receipt, reproducible command, or public proof.

Preferred safer wording:
- "storage workflow documented"
- "storage upload command captured"
- "DA integration planned"
- "requires root hash / proof for verified claim"

Candidate files:
- `0G_STORAGE_UPLOAD_COMMAND.md`
- `docs/canon/evidence/0g-storage-upload-command.md`
- `0G_VERIFICATION_PROTOCOL.md`
- `0G_GRANT_FOLLOWUP_EMAIL.md`
- `0G_SOVEREIGN_AGENT_SYSTEM_TRUTH_TABLE.md`

## Action Queue

- [ ] Extract exact risky lines from candidate files.
- [ ] Classify each as Verified, Demonstrated, Planned, or Unsupported.
- [ ] Draft safer replacement wording.
- [ ] Do not edit public files until replacements are reviewed.
- [ ] Commit only `.local-ai/` review artifacts first, if desired.


## Correction Log

### 2026-06-02 — 0G Compute wording softened

File:
- `0G_COMPUTE_DIRECT_SUCCESS_20260531.md`

Changed:
- From: "verified mainnet decentralized AI inference"
- To: "demonstrated direct-provider 0G Compute inference, supported by local logs and internal evidence"

Reason:
- Preserves the technical result while avoiding independent/public verification overclaim.
