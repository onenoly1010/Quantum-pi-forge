# QPF Activation Roadmap V1

**Purpose:** Ordered unlock conditions.  
**Not** a schedule of automatic activation.

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
Phase 8.4       Public verification portal (make it independently verifiable)
        ↓
Phase 8.5       Independent verification reports (accumulate multiple — not a single-gate)
        ↓
Phase 8.6       Builder reproducibility (fresh clone / tooling)
        ↓
Phase 8.7       Operational readiness (no token economics)
        ↓
Phase 9.0       Governance review (evidence-based — not schedule-based)
        ↓
Future activation decisions (if approved) — separate GO only
```

Internal activation-policy docs after 8.3 are **paused**. Momentum shifts from **creating documentation** to **gathering external evidence**.

**Refinement:** one independent verification is valuable but **vulnerable** to single-point failure, collusion, or local env error. Phase **8.5** uses a **multi-report** model (proposed quorum \(m=3\), diversity, conflict protocol, SLA) — see [MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](./community/MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md). A single report is **not** sufficient to treat verification as externally settled for Phase 9.0.

## Current phase map

| Phase | Objective | Success criterion | Status |
|-------|-----------|-------------------|--------|
| 8.0 Edge readiness | Headers + preflight | EDGE_READY | ✅ main (#627) |
| 8.1 Public readiness | Inspectable truth layer | Report + probes | ✅ main (#628) |
| Genesis package | Stranger-verifiable docs | Package on main | ✅ main (#629) |
| 8.2 Safe governance policy | Control constraints documented | Policy sealed | ✅ main (#630) |
| 8.3 Mint authority explanation | Capability ≠ permission ≠ activation | Explanation sealed | ✅ main (#631) |
| **8.4 Public verification** | Portal + registry + guides consistent | Third party can locate contracts, reproduce steps, docs consistent | **Active (PR #633)** |
| **8.5 Independent verification reports** | Multi-report consensus architecture | ≥ \(m\) independent agreements (proposed \(m=3\)); diversity + conflict SLA; not single-gate | After 8.4 portal live |
| **8.6 Builder reproducibility** | Clean clone experience | Never-seen-QPF developer gets verify path running | After 8.5 underway |
| **8.7 Operational readiness** | Monitoring, recovery, incident, release | Procedures documented/exercised **without** enabling token economics | After 8.6 |
| **9.0 Governance decision** | Pre-economic evaluation | Decision based on **8.4–8.7 evidence**, not calendar | After 8.7 |
| Future mint / liquidity / yield | Economic activation | Separate explicit GO only | ⛔ Blocked |

Portal index: [docs/community/VERIFICATION_PORTAL_V1.md](./community/VERIFICATION_PORTAL_V1.md)  
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

---

*Activation Roadmap V1 — conditions, not a launch button.*
