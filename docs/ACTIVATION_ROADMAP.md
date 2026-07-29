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
Phase 8.0–8.3   Prove the system (edge, readiness, genesis, Safe, mint authority explanation)
        ↓
Phase 8.4–8.7   Prove others can verify the system (external validation lane)
        ↓
Phase 9.0       Governance review (before any economic activation discussion)
        ↓
Controlled mint (B) / public mint (A) / liquidity (F) / yield — only with separate GO
```

Internal activation-policy docs after 8.3 are **paused**. Effort shifts to independent evidence.

## Current phase map

| Phase | Objective | Success criterion | Status |
|-------|-----------|-------------------|--------|
| 8.0 Edge readiness | Headers + preflight | EDGE_READY | ✅ main (#627) |
| 8.1 Public readiness | Inspectable truth layer | Report + probes | ✅ main (#628) |
| Genesis package | Stranger-verifiable docs | Package on main | ✅ main (#629) |
| 8.2 Safe governance policy | Control constraints documented | Policy sealed | ✅ main (#630) |
| 8.3 Mint authority explanation | Capability ≠ permission ≠ activation | Explanation sealed | ✅ main (#631) |
| **8.4 Verification portal & first verification** | Public workflow; independent verify | Outsider confirms published state without builder help | **Active** |
| **8.5 Builder experience** | Fresh clone + tooling | Developer reproduces documented results | After 8.4 |
| **8.6 Community validation** | External reports | Issues / verification reports from outside | After 8.5 |
| **8.7 Operational readiness** | Safe/recovery/monitoring exercises | Procedures exercised **without** token economics | After 8.6 |
| **9.0 Governance review** | Pre-economic gate | Technical + operational + community evidence reviewed | After 8.7 |
| Controlled mint / public mint / liquidity / yield | Economic activation | Separate explicit GO only | ⛔ Blocked |

Portal index: [docs/community/VERIFICATION_PORTAL_V1.md](./community/VERIFICATION_PORTAL_V1.md)

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
