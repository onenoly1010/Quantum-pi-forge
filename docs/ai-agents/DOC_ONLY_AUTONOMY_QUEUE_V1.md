# Doc-Only Autonomy Queue v1

Status: PENDING_DOC_ONLY
Phase 7 State: AWAITING_GUARDIAN_ADDRESS
Created: 2026-06-24T03:11:11.561Z

## Purpose

This queue allows local AI models to assist with repository documentation, review, mapping, and explanatory improvements while all execution authority remains disabled.

## Runtime Finding

Ollama is available locally at `127.0.0.1:11434`, but the agent/worker execution layer is inactive or stale. This means local models may be used as review assistants, but no worker should be treated as authorized to act.

## Pending Objectives

### Objective A — Repo Inner Map
Create or improve a map of important repository areas, including governance receipts, 0G integration docs, agent docs, deployment scripts, and evidence verification scripts.

### Objective B — Stale Component Notes
Document inactive/stale workers and scripts so future reviewers understand they are not live daemons.

### Objective C — Phase 7 Boundary Explanation
Improve documentation that explains `AWAITING_GUARDIAN_ADDRESS` and why no repo-local address may be substituted.

### Objective D — Safe Agent Handoff Template
Create a reusable handoff template for AI-agent contributions that requires safety assertions before any work is accepted.

### Objective E — Evidence Reviewer Guide
Improve reviewer-facing guidance for verifying documentation-only work without confusing it with deployment or wallet activity.

## Forbidden Actions

- No wallet actions
- No private key access
- No signing
- No transaction broadcast
- No deployment
- No liquidity creation
- No minting
- No staking
- No chain state mutation
- No guardian address invention
- No agent execution authority

## Acceptance Rule

Each objective must end with a receipt or documented artifact and must preserve Phase 7 as blocked until the authoritative 0G Aristotle mainnet guardian address is available.
