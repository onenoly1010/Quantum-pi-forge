# Quantum Pi Forge Constellation Architecture

## 1. Purpose

Quantum Pi Forge operates as a constellation, not a monolith.

This document gives reviewers, contributors, and operators a top-level map of what exists, how repositories relate, where trust boundaries lie, what is deterministic versus heuristic, what requires human authority, and what can be verified locally.

This document is descriptive. It is not an execution grant, deployment authorization, signing authority, financial claim, or expansion of agent autonomy.

## 2. Constellation Overview

The constellation spans four planes:

- Public & Narrative Plane: onboarding, framing, reviewer entry points, dashboards, and explanatory material.
- Infrastructure & Verification Plane: evidence scripts, runbooks, health checks, CI, receipts, verification paths, and drift detection.
- Protocol-of-Intent Plane: Soul routing, intent schemas, SDK boundaries, worker behavior, and refusal logic.
- Chain & Value-Risk Plane: wallets, contracts, DEX interfaces, token surfaces, NFT surfaces, and other risk-bearing components.

No repository is granted autonomous authority over wallet signing, asset movement, deployments, minting, staking, governance execution, or public financial claims.

## 3. Core Planes

### 3.1 Infrastructure & Verification Plane

Surfaces include the Genesis backend, evidence scripts, verification scripts, health checks, deployment runbooks, local CI surrogate behavior, receipts, and proof indexes.

Responsibilities include proving what exists, detecting drift, maintaining reproducibility, preserving reviewer-verifiable evidence, and separating verified claims from aspirational or conceptual claims.

### 3.2 Protocol-of-Intent Plane

Surfaces include the OINIO Soul System, Soul SDK, Soul Worker, intent schemas, routing logic, refusal behavior, and agent boundary definitions.

Responsibilities include defining intent, routing intent, preserving lineage, enforcing authority boundaries, maintaining human-gated execution, and distinguishing deterministic checks from heuristic behavior.

### 3.3 Public & Narrative Plane

Surfaces include the public website, README files, State-of-the-Forge snapshots, reviewer packets, public dashboards, and onboarding documents.

Responsibilities include making the constellation legible, separating evidence from aspiration, providing reviewer entry points, avoiding unsupported claims, and explaining live, conceptual, partial, and planned surfaces clearly.

### 3.4 Chain & Value-Risk Plane

Surfaces include wallet connections, token contracts, DEX interfaces, NFT contracts, staking-related surfaces, chain-facing deployment scripts, and any asset, liquidity, yield, or governance-adjacent component.

Responsibilities include identifying risk, keeping signing human-controlled, avoiding implied liquidity or yield, requiring explicit evidence for chain claims, and preventing autonomous mutation of chain state.

## 4. Repository Map

Infrastructure and verification repositories include pi-forge-quantum-genesis, quantum-pi-forge-fixed, and evidence or verification scripts.

Protocol-of-intent repositories include oinio-soul-system, oinio-soul-sdk, and oinio-soul-worker.

Public and narrative repositories include quantum-pi-forge-site, reviewer packets, and public dashboards.

Chain and value-risk surfaces include token contracts, NFT contracts, DEX surfaces, wallet connection surfaces, and any deployment, minting, staking, bridge, or governance-adjacent script.

All chain and value-risk surfaces remain human-gated unless separately proven, reviewed, and explicitly authorized.

## 5. Data Flows

Human-gated verification flow:

```text
human intent
  -> documented request
  -> local verification
  -> bounded agent or script
  -> receipt / hash / proof
  -> reviewer index
  -> optional public update
```

Chain-adjacent flow:

```text
human intent
  -> simulation / dry run
  -> evidence record
  -> explicit human review
  -> manual wallet action
  -> post-action receipt
```

No automated component may mutate chain state.

Public claim flow:

```text
claim draft
  -> evidence check
  -> claim classification
  -> reviewer-visible citation or proof
  -> human approval
  -> publication
```

## 6. Trust Surfaces

### 6.1 Wallets & Keys

- No private keys may be committed.
- No automated signing is authorized.
- No agent may initiate asset movement.
- Wallet actions remain manual and human-controlled.

### 6.2 Funding & Grants

- Language must distinguish request, review, approval, receipt, and deployment.
- Funding claims require evidence.
- Grant status must not be overstated.

### 6.3 Token / DEX / Staking

- No implied liquidity.
- No implied yield.
- No unstated financial claims.
- No autonomous deployment, minting, staking, bridging, or governance execution.

### 6.4 Soul Routing

- Deterministic checks must be separated from heuristic behavior.
- Refusal logic must be documented.
- Intent routing must not become execution authority.
- Agent outputs are proposals unless explicitly human-approved.

### 6.5 Public Claims

- Claims should link to evidence where possible.
- Conceptual surfaces must be labeled as conceptual.
- Partial implementations must be labeled as partial.
- Live surfaces must be supported by verifiable proof.

## 7. Deployment Topology

The constellation can be understood as public reviewer or user -> public site or dashboard -> worker or backend boundary -> evidence and verification layer -> local receipts or proof indexes -> optional human-approved chain interaction.

Known deployment categories include public site surfaces, Genesis backend surfaces, Soul Worker boundaries, local or committed evidence receipts, and chain surfaces that remain read-only or simulation-first unless human-signed.

## 8. Human Authority Boundary

Humans retain exclusive authority over:

- Wallet signing
- Deployments
- Minting
- Staking
- Transfers
- Governance execution
- Public claims involving financial, grant, liquidity, yield, or chain-risk assertions

Agents may prepare, analyze, simulate, summarize, and generate receipts. Agents may not execute authority-bearing actions.

## 9. Agent Authority Boundary

Agents may analyze repository state, propose changes, generate documentation, simulate outcomes, prepare receipts, route intents, identify drift, and refuse unsafe or unsupported actions.

Agents may not:

- Sign transactions
- Deploy contracts
- Mutate chain state
- Move assets
- Publish public claims without human approval
- Represent funding, liquidity, yield, or grant status without evidence
- Override human authority boundaries

## 10. Evidence & Verification Path

A reviewer should be able to run the local verification command, inspect receipts, compare claims to evidence, identify drift, and determine which surfaces are live, partial, conceptual, or planned.

This evidence path is the backbone of the constellations credibility.

## 11. Known Gaps

Known formalization gaps include:

- SoulIntent v0.1 specification
- Threat models for critical repositories
- SLOs and reliability targets for health surfaces
- Contribution gradients for future collaborators
- Cross-repository dependency map
- DEX-specific invariant and fuzz testing posture
- Export and rehydration format for sovereign portability

These gaps are not execution grants. They are formal review targets.

## 12. Next Formalization Targets

Recommended order:

1. SoulIntent v0.1 specification
2. Threat models for Soul System, DEX, and Genesis backend
3. SLO definitions for public and health surfaces
4. Contribution gradients by repository
5. DEX line-by-line review
6. Cross-repository dependency map

## 13. Non-Goals

This document does not authorize autonomous execution, authorize wallet signing, claim liquidity, claim yield, claim funding receipt, claim production maturity beyond existing evidence, replace repository-specific documentation, replace formal threat models, or replace protocol specifications.

## 14. Reviewer Use

This document should be used as the first architectural entry point before reviewing SoulIntent behavior, DEX surfaces, token or NFT claims, funding claims, agent routing behavior, deployment posture, or public dashboard claims.

It exists to reduce cognitive load and make review paths explicit.
