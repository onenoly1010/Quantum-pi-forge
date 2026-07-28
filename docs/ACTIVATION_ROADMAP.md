# QPF Activation Roadmap V1

**Purpose:** Ordered unlock conditions.  
**Not** a schedule of automatic activation.

## Posture today

```text
TECHNICAL_ACTIVATION = COMPLETE (contracts live)
COMMERCIAL_ACTIVATION = NOT_ACTIVE
PUBLIC_MINT_OPEN = NO
LIQUIDITY = NO (pair empty)
YIELD = NO
```

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
| 8.1 Public readiness evidence | Single inspectable truth layer | In progress / this package |
| Genesis verification package | Stranger-verifiable docs | This commit |
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
