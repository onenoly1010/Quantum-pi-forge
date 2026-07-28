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
Evidence / verifiability
   ↓
Governance clarity (who can act, under what constraints)
   ↓
Safe / recovery policy packaging
   ↓
Controlled mint path (B) — if/when human GO
   ↓
Public mint open (A) — only after constraints are public
   ↓
DEX prep complete → liquidity authorization + funding (F)
   ↓
Yield / earnings (last)
```

## Current phase map

| Phase | Goal | Status |
|-------|------|--------|
| 8.0 Edge readiness | Headers + preflight | On main (PR #627) |
| 8.1 Public readiness evidence | Single inspectable truth layer | On main (PR #628) |
| Genesis verification package | Stranger-verifiable docs | This package (PR #629) |
| 8.2 Safe / social recovery policy | Governance credibility | Next (docs only) |
| 8.3 Mint authority explanation | Explain gates — not enable mint | After 8.2 |
| Builder onboarding | 10-minute verify path | BUILDER_QUICKSTART |
| First external participant | Non-Kris verification/contribution | Not yet proven |
| Funding lane | Grants / ecosystem | After A–C credibility |
| Controlled mint | Explicit GO only | Historical controlled mint verified; public open NO-GO |
| Public mint open | Policy flip only after GO chain | Blocked |
| Liquidity event | Commercial, separate receipt | Blocked (empty pool intentional) |
| Yield | Downstream of liquidity + controls | Blocked |

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
