# External Evidence Ledger v1

**Mode:** Observation only  
**Product freeze:** No new architecture, mint, LP, or packaging unless external evidence forces a concrete fix.  
**Economics:** OFF · Mint locked · LP locked · Expansion paused  

## North-star question

> Does someone with **no prior involvement** with QPF understand the problem and **voluntarily** ask for the verification service?

Internal AI reviews and self-tests are **not** demand.

---

## Funnel (what we observe)

```text
Visits
  → Problem-page engagement
  → Try attempts
  → Verification requests
  → Qualified conversations
  → Pricing / economic questions
```

Live surfaces (canonical host **https://quantumpiforge.com**):

| Step | Path |
| --- | --- |
| Discover | `/` |
| Understand | `/problems/`, `/problems/*.html` |
| Try | `/try.html` |
| Offer / request | `/verification.html` → `/verification-certificate.html` or `/verification-request.html` |
| Request channel | `mailto:` on request page (Cloudflare may obfuscate; still works in browser) |

---

## Decision rule

```text
No meaningful external signal     → keep observing
People visit but don't try        → positioning / discoverability (later)
People try but don't request      → workflow friction (later)
Requests arrive                   → fulfill and learn
Repeated pricing / economic demand → THEN evaluate economics (new explicit GO)
```

**Never** open mint/LP because the ledger is empty or quiet.

---

## How to log

1. Prefer **organic external** events only (humans, partners, unsolicited email, real issues).  
2. Append one JSON object per event to  
   `docs/ops/evidence-ledger/events.jsonl`  
3. Use schema in `docs/ops/evidence-ledger/SCHEMA_V1.md`.  
4. Weekly (or when something happens): update `docs/ops/evidence-ledger/LATEST.md` summary.  
5. Optional enablement re-check (not demand):  
   `bash scripts/verify-production-funnel.sh`

### Do not log as demand

- Agent self-tests, curl loops, AI browsing the site  
- Founder refreshing pages  
- Synthetic “seed” traffic  

Those may go under `signal_class: internal` if useful for ops, never under external demand counts.

---

## Safety boundary (unchanged)

```text
Economics OFF
Mint OFF
LP OFF
Expansion PAUSED
Paper Phase 40/41 ≠ permission to execute
Silence ≠ GO
```

Only an explicit human letter/GO may change economic state.
