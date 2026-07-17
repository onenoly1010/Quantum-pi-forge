# Quantum Pi Forge — Verification Status Table v1

**Status:** Canonical single source of truth (SSOT) for feature and claim posture  
**Date:** 2026-07-16  
**Audience:** Auditors, grant reviewers, security researchers, Pi Core Team, public site authors, outreach authors  
**Authority:** This table overrides marketing copy, grant drafts, and informal summaries when they conflict.

## How to use this table

1. Every **public**, **grant**, or **partner** claim must map to a row below.
2. If a claim is not in this table, treat it as **Planned** until a row is added with proof paths.
3. Prefer the **defensible project description** (below) for one-paragraph summaries.
4. Distinguish **design** statements from **live-network** statements (see Design vs operational).

Companion docs:

| Doc | Role |
| --- | --- |
| [`CLAIM_TO_PROOF_MATRIX.md`](./CLAIM_TO_PROOF_MATRIX.md) | Reviewer claim classification (verifiable / pending / disabled / archive / aspirational) |
| [`contracts/DEPLOYED_ADDRESSES.md`](../../contracts/DEPLOYED_ADDRESSES.md) | Canonical on-chain address matrix (still Pending until fully filled) |
| [`REVIEWER_START_HERE.md`](../../REVIEWER_START_HERE.md) | Human entrypoint for evidence-first review |
| [`PUBLIC_SURFACE_CLAIM_AUDIT_V1.md`](./PUBLIC_SURFACE_CLAIM_AUDIT_V1.md) | Public website claim audit against this table |
| [`docs/valuation/QPF_GRANT_PARTNER_OUTREACH_KIT_V1.md`](../valuation/QPF_GRANT_PARTNER_OUTREACH_KIT_V1.md) | Outreach language lock (must derive from this table) |

Machine-readable twin: [`verification-status-table-v1.json`](./verification-status-table-v1.json)

---

## Classification standard

| Status | Meaning | Allowed public language |
| --- | --- | --- |
| **Verified** | Reviewer can inspect or reproduce from public repo artifacts, receipts, or local commands without trusting narrative alone. | “Verified”, “reproducible”, “receipt-backed”, “inspectable” |
| **Implemented but gated** | Code, design, or sealed receipts exist; operational use is intentionally blocked until gates clear. | “Implemented”, “documented”, “gated”, “disabled pending verification”, “not economically active” |
| **Experimental** | Local, lab, or partial path; not a production network claim. | “Experimental”, “local”, “prototype”, “lab path” |
| **Planned** | Direction of travel only; no present operational claim. | “Planned”, “roadmap”, “future”, “staged activation path” |

### Mapping to Claim-to-Proof Matrix labels

| This table | Claim-to-Proof Matrix |
| --- | --- |
| Verified | Verifiable |
| Implemented but gated | Pending and/or Disabled (code present; flow inactive or incomplete proof) |
| Experimental | Partial / self-reported / local-only |
| Planned | Aspirational / Not current canon |

---

## Defensible project description (preferred public wording)

> Quantum Pi Forge is an independently developed, evidence-first sovereign AI and governance platform centered on deterministic verification, cryptographic receipts, local AI execution, and auditable deployment artifacts. Its repositories document a staged activation path toward features such as Guardian agents, resonance-based governance, and future Pi Network interoperability, while maintaining verification as the primary source of truth.

Use this paragraph for website heroes, grant abstracts, partner one-pagers, and press notes unless a more specific **Verified** row is being quoted with its proof path.

---

## Design vs operational claims

| Defensible (design / process) | Not allowed without operational proof |
| --- | --- |
| Architecture supports autonomous governance after quorum thresholds | Autonomous governance is live |
| Staking logic exists but is disabled | Yield is being earned today |
| Staged path toward Pi Network interoperability | Bridge to 47M Pi Network users |
| Post-quantum posture discussed in design/docs | First fully sealed post-quantum-secure deployment |
| Owner/admin controls constrained by design intent | No owner key, no admin backdoors, immutable forever |

---

## Status table

### Verified

| ID | Feature / claim | Proof path / evidence | Notes |
| --- | --- | --- | --- |
| V-01 | Evidence-first reviewer posture exists | `REVIEWER_START_HERE.md`, `docs/review/CLAIM_TO_PROOF_MATRIX.md`, `AUDIT.md`, `npm run audit:full-local` | Process and docs are public and local-runnable |
| V-02 | Public development history and canon docs exist | GitHub/public repo, `README.md`, `STATUS.md`, governance receipts under `docs/governance/` | History is inspectable; do not invent commit counts without live `git` measurement |
| V-03 | Sealed governance and verification receipts exist as repo artifacts | `receipts/`, `evidence/INDEX.md`, various `docs/governance/*_RECEIPT_*.md` | Receipts prove *what the project recorded*; they are not a substitute for independent chain re-verification of every address |
| V-04 | Local public verification demo is bounded and non-executing | `docs/public/PUBLIC_VERIFICATION_DEMO_GATE_V1.md`, `npm run public:verification-demo:v1` | Demo must not authorize wallet, broadcast, or funding |
| V-05 | Economic activation boundaries are documented as blocked/disabled | `STATUS.md`, `docs/governance/PUBLIC_VALIDATION_STATUS_V1.md`, claim matrix staking/liquidity rows | Disabled is a safety boundary, not a failure |
| V-06 | Contract source and tests exist in-repo | `contracts/`, Foundry/OZ setup, deployment scripts as present | Source existence ≠ every claimed chain deployment |
| V-07 | Local-first Ollama / Guardian-style agent paths fit architecture | Agent/runtime docs, local inference scripts, compute policy docs | Local capability; not “global autonomous network” |

### Implemented but gated

| ID | Feature / claim | Gate / blocker | Proof path | Public language |
| --- | --- | --- | --- | --- |
| G-01 | OINIO / genesis contracts on 0G Aristotle | Canonical `contracts/DEPLOYED_ADDRESSES.md` still **Pending**; independent RPC/explorer re-check required | Project receipts (e.g. `docs/governance/PUBLIC_VALIDATION_STATUS_V1.md`, `receipts/execution/v2-mainnet-cutover-execution-v1.json`); skill inventory may list addresses | “Project records a genesis activation with sealed receipts; canonical address matrix still Pending until fully verified” |
| G-02 | Staking | Intentionally disabled pending verification | Claim matrix; public validation status | “Staking logic may exist; staking is not live/economically active” |
| G-03 | Liquidity / DEX pair funding | Funding incomplete; approvals blocked; Phase 7 guardian address constraints | DEX docs; yield routing design; ship skill Phase 7 block | “DEX/pair work documented; liquidity not seeded” |
| G-04 | Wallet signing / relayer / gasless paths | Disabled pending verification | Claim matrix; public status | “Not active for public users” |
| G-05 | Public mint | Human/governance gates; recent lanes may authorize *prep* or controlled sessions only | Phase 36–41 mint gates under `docs/governance/` | Do not say “public mint is open” unless a Verified mint-open receipt + on-chain proof is listed here |
| G-06 | Yield routing contracts | Design complete; production deploy blocked | `YIELD_ROUTING_*` design docs; Phase 7 block | “Design/spec; not live yield” |
| G-07 | W0G / DEX factory-router stack | Ready in code; deployment blocked on guardian/gates | `contracts/0g-dex/`, ship skill | “Implemented in repo; not claimed as live liquidity venue” |
| G-08 | iNFT minting | Partial / needs address, tx, explorer, reproducible mint proof | Claim matrix iNFT row | “Not established as currently active on-chain” |

### Experimental

| ID | Feature / claim | Scope | Proof path | Caution |
| --- | --- | --- | --- | --- |
| E-01 | Local Guardian / Soul agents (Ollama) | Local/lab runtime | Local agent scripts, observer design under `.qpf-local` / docs | Not multi-node production autonomy |
| E-02 | 0G Compute inference paths | Provider/direct + fallback policy | `0G_COMPUTE_*`, compute runtime policy docs | Subject to billing/endpoint drift; log mode and provider |
| E-03 | Resonance / local observer lanes | Recovery and design receipts | `.qpf-local/oinio-*`, resonance quarantine plans | Experimental; not public network control plane |
| E-04 | Frontend Pi Network connect examples | Demo/example UI | `frontend/example.html`, `frontend/production_dashboard.html` | Examples ≠ live official Pi bridge |
| E-05 | Self-reported telemetry / node counts | Non-auditable without independent observation | Historical truth-table Domain 2 claims | Never promote as Verified |

### Planned

| ID | Feature / claim | Direction only | Forbidden until Verified |
| --- | --- | --- | --- |
| P-01 | Full autonomous multi-node network | Roadmap / architecture | “Autonomous network is live” |
| P-02 | Pi Network bridge (production) | Interoperability staging | “Bridge live”, “access to 47M Pi users” |
| P-03 | Production yield for end users | After liquidity + staking gates | “Earning yield today” |
| P-04 | Post-quantum sealed deployment leadership claims | Research/design interest | “First fully sealed PQ-secure deployment” without independent validation |
| P-05 | Comparative superlatives | Marketing | “Strongest governance guarantee in any sovereign-AI-aligned system” |
| P-06 | Absolute immutability / no-admin guarantees | Requires bytecode + verified source + deployment proofs | “No owner key”, “no admin backdoors”, “immutable forever” |
| P-07 | Production-ready in every layer | Explicitly not current canon | “Production-ready end-to-end” |

---

## Forbidden public claims (until moved to Verified with proof)

Do **not** use these in website copy, grants, partner decks, or Discord/press without adding a **Verified** row and artifacts:

1. “The first fully sealed post-quantum-secure deployment”
2. “Bridge to 47M Pi Network users” (or any user-count access claim)
3. “No owner key / no admin backdoors / immutable forever” without bytecode + verified source + deploy proofs
4. “The strongest governance guarantee in any …” (comparative marketing)
5. “Yield is live / staking is live / public mint is open” without current on-chain + gate-clear evidence
6. Exact block numbers, trust scores, repo/commit counts, or “currently on the public site” without a dated independent check
7. “Fully autonomous governance is live”

---

## On-chain address discipline

- **Canonical public matrix:** `contracts/DEPLOYED_ADDRESSES.md`
- That file currently marks Aristotle and Pi deployments as **Pending** until each row has chain ID, address, tx hash, block, explorer/RPC proof, compiler metadata, and bytecode match.
- Other docs may record project receipts for genesis activation. Treat those as **Implemented but gated** (project-recorded) until the canonical matrix is filled and independently re-verified.
- If two docs list different addresses or birth blocks, **do not pick a winner in marketing**. Mark conflict, keep both as pending independent verification, and fix the matrix first.

---

## Phase 7 operational reminder

Until a real Ennead multisig / Gnosis Safe guardian address is confirmed on Aristotle mainnet:

- Do not treat DEX liquidity seeding, yield-routing activation, or production signing as live.
- Documentation, evidence generation, code review, and tests remain allowed.

---

## Change control

| Change | Required |
| --- | --- |
| Promote a row to **Verified** | Add proof path; preferably a local verifier command or public explorer/RPC check; update JSON twin |
| Claim something “live” publicly | Must be **Verified** (not merely Implemented but gated) |
| Outreach / grant language | Must quote Verified rows or the defensible description; may mention Gated/Experimental/Planned only with those labels |
| Website copy | Must pass [`PUBLIC_SURFACE_CLAIM_AUDIT_V1.md`](./PUBLIC_SURFACE_CLAIM_AUDIT_V1.md) checklist |

**Version:** v1  
**Next review trigger:** Any public mint, bridge, staking, or liquidity activation decision; any DEPLOYED_ADDRESSES row filled; any external audit report.
