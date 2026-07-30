# QPF Activation Roadmap V1

**Purpose:** Ordered unlock conditions.  
**Not** a schedule of automatic activation.

**Public wording:** Prefer “Phase 8 establishes the project's trust foundation; progress is now independent reproducible verification.” Avoid presenting internal “sealed” milestones as industry certifications. Multi-report consensus and “other people, other machines, same conclusions” provide a **strong technical foundation** and shared evidence base for later governance discussion—they do **not** determine whether or when economic features are enabled. Adoption and funding remain separate outcomes.

## Posture today

> **Technical activation verified. Commercial activation pending governance authorization.**

```text
TECHNICAL_ACTIVATION = VERIFIED (contracts live; stranger-verifiable)
COMMERCIAL_ACTIVATION = NOT_ACTIVE (pending governance authorization)
PUBLIC_MINT_OPEN = NO
LIQUIDITY = NO (pair empty)
YIELD = NO
```

One-screen status: [ACTIVATION_STATUS.md](./ACTIVATION_STATUS.md)

## Phase order (do not invert)

```text
Phase 8.0–8.3   Prove the system (internal seals)
        ↓
Phase 8.4       Public Verification Portal
        ↓
Phase 8.5       Multi-Report Independent Verification  (consensus, not single-gatekeeper)
        ↓
Phase 8.6       Builder Reproduction
        ↓
Phase 8.7       Ops Readiness
        ↓
Phase 9.0       Governance Decision (Network Genesis review)
        ↓
Future activation decisions (if approved) — separate GO only
```

Internal activation-policy docs after 8.3 are **paused**. Momentum shifts from **creating documentation** to **gathering external evidence**.

### Phase 8: Edge-to-Mint Trust Validation

* **8.0–8.3 (complete on main):** Edge readiness, public readiness, genesis package, Safe governance policy, mint authority explanation — capability ≠ permission ≠ activation.
* **8.4 Public Verification Portal (COMPLETE):** Static verification surface is live (Cloudflare Pages + repo docs). Deployed contracts, registry, builder path, governance boundaries, and operational status are publicly inspectable. DEX pair ready with empty pool intentional. Does **not** open mint or liquidity. Seal: `receipts/governance/phase-84-verification-portal-live-v1.json` (2026-07-30).
* **8.5 Multi-Report Independent Verification (ACTIVE — Round 1 OPEN):** Transition from a single-gatekeeper model to a **consensus-driven** pipeline. Round 1 opened 2026-07-30; report ledger: [verification-reports/INDEX_V1.md](./community/verification-reports/INDEX_V1.md).
  * **Why multi-report:** One independent verifier is still a single point of failure (collusion, local env error, or “trust verifier A instead of the builder”).
  * **Threshold requirement:** A Phase 9.0 claim that “external verification is settled” requires a **minimum quorum of independent verification reports** that **agree** on the published state (proposed default **\(m = 3\)** eligible agreements; governance may reseal **2-of-3** or **3-of-5** style thresholds). Optional cryptographic attestation (e.g. signed verification digest) strengthens identity — **does not** auto-execute mint.
  * **Conflict resolution:** If reports **conflict**, fail Sybil/diversity checks, or **fail to meet the threshold within the SLA window**, the verification pipeline **halts** for that round, **fails closed** on any “externally settled” claim, and **flags for manual governance review**. No automatic mint, liquidity, or economic launch.
  * **SLA (proposed v1):** soft 14 days / hard 30 days per announced round; or rolling 90-day lookback — see architecture doc.
  * **Architecture:** [MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](./community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md)
* **8.6 Builder Reproduction:** Third-party replication of the deterministic verify path (clean clone, deps, documented outputs) against a multi-report consensus baseline where available.
* **8.7 Ops Readiness:** Final systems check of monitoring, recovery, incident, and release/fallback procedures **without** enabling token economics.

### Phase 9: Network Genesis (governance review — not auto-mint)

* **9.0 Governance Decision:** Final human/governance transition decision based on **aggregate evidence** from Phases **8.4–8.7** (portal consistency + multi-report consensus + builder repro + ops readiness). Multi-report quorum is **necessary evidence**, not a substitute for a sealed GO receipt. Economic activation (mint/liquidity/yield) remains **separate explicit authorization** after 9.0 if approved.

## Current phase map

| Phase | Objective | Success criterion | Status |
|-------|-----------|-------------------|--------|
| 8.0 Edge readiness | Headers + preflight | EDGE_READY | ✅ main (#627) |
| 8.1 Public readiness | Inspectable truth layer | Report + probes | ✅ main (#628) |
| Genesis package | Stranger-verifiable docs | Package on main | ✅ main (#629) |
| 8.2 Safe governance policy | Control constraints documented | Policy sealed | ✅ main (#630) |
| 8.3 Mint authority explanation | Capability ≠ permission ≠ activation | Explanation sealed | ✅ main (#631) |
| **8.4 Public verification portal** | Portal + registry + guides consistent | Third party can locate contracts, reproduce steps, docs consistent | ✅ **COMPLETE** (live seal 2026-07-30; PRs #627–#634) |
| **8.5 Multi-report independent verification** | Consensus pipeline (quorum + diversity + SLA) | ≥ \(m\) independent agreements (proposed \(m=3\)); conflict → halt + manual review | **Active — Round 1 OPEN** (\(n=0\); hard close 2026-08-29) |
| **8.6 Builder reproduction** | Clean clone experience | Never-seen-QPF developer reproduces verify path | Prep started — [BUILDER_REPRODUCTION_PREP_V1.md](./community/BUILDER_REPRODUCTION_PREP_V1.md) |
| **8.7 Ops readiness** | Monitoring, recovery, incident, release | Procedures exercised **without** token economics | After 8.6 |
| **9.0 Governance decision** | Pre-economic evaluation | Decision on **8.4–8.7 aggregate evidence**, not calendar | After 8.7 |
| Future mint / liquidity / yield | Economic activation | Separate explicit GO only | ⛔ Blocked |

### Phase 8.5 Round 1 (current)

| Field | Value |
|-------|--------|
| Status | **OPEN** |
| Opened | 2026-07-30T15:02:00Z |
| Soft SLA | 2026-08-13 (14d) |
| Hard SLA | 2026-08-29 (30d) |
| Quorum \(m\) | 3 |
| Eligible reports \(n\) | 0 |
| Consensus | NOT_STARTED |
| Report index | [community/verification-reports/INDEX_V1.md](./community/verification-reports/INDEX_V1.md) |
| Activation note | [community/PHASE_8_5_ROUND1_ACTIVATION_V1.md](./community/PHASE_8_5_ROUND1_ACTIVATION_V1.md) |

Portal index: [docs/community/VERIFICATION_PORTAL_V1.md](./community/VERIFICATION_PORTAL_V1.md)  
Multi-report architecture: [docs/community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](./community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md)  
Report process: [docs/community/INDEPENDENT_VERIFICATION_PROCESS_V1.md](./community/INDEPENDENT_VERIFICATION_PROCESS_V1.md)

## Unlock checklist (high level)

### Before controlled mint (B)

- [ ] Named action + final parameters sealed  
- [ ] Human signing authorization for **exact** approve + registerModel only  
- [ ] Command hash / path executable (not review-only)  
- [ ] Abort conditions enforced  
- [ ] Still **not** general autonomy  

### Before public mint open (A)

- [ ] Controlled path understandable by strangers  
- [ ] Explicit human YES for open (Phase 38-class)  
- [ ] Policy `mint_allowed` / `public_mint_active` only after GO  
- [ ] Site surfaces updated to match policy  

### Before liquidity (F)

- [ ] Pair + router verified (done technically)  
- [ ] Liquidity **authorization receipt**  
- [ ] Funding present  
- [ ] Separate from mint economics unless deliberately coupled  

### Before yield

- [ ] Security + governance maturity  
- [ ] Mint controls clear  
- [ ] Liquidity event complete (if yield depends on markets)  
- [ ] Separate gates — never auto-on with mint  

## What not to do

- Open liquidity “because the pool looks empty”  
- Enable mint economics without GO chain  
- Turn on yield early  
- Bundle “activate everything”  

## Why empty pair is a strength

It shows **restraint**: DEX technical readiness without premature market activation.

## Related

- [GENESIS_VERIFICATION_V1.md](./GENESIS_VERIFICATION_V1.md)  
- [SECURITY_BOUNDARIES_V1.md](./SECURITY_BOUNDARIES_V1.md)  
- [evidence/PUBLIC_READINESS_REPORT_V1.md](./evidence/PUBLIC_READINESS_REPORT_V1.md)  
- [DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md](./DISTANCE_TO_ECONOMIC_ACTIVATION_V1.md) — phases × gates × capital × “when wallets earn?”  
- [community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](./community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md)  
- [community/VERIFICATION_PORTAL_V1.md](./community/VERIFICATION_PORTAL_V1.md)  
- [community/verification-reports/INDEX_V1.md](./community/verification-reports/INDEX_V1.md)  
- [community/PHASE_8_5_ROUND1_ACTIVATION_V1.md](./community/PHASE_8_5_ROUND1_ACTIVATION_V1.md)  
- [ACTIVATION_STATUS.md](./ACTIVATION_STATUS.md)  

---

*Activation Roadmap V1 — ordered unlock conditions; not a schedule of automatic activation.*
