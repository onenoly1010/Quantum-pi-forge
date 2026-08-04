# QPF Verification Certificate — v1

**Product posture:** Productize **existing** capability — do not build a new company.  
**Hierarchy:** QPF = verification service **first** · OINIO = long-term ecosystem vision  
**Locks:** Mint / LP / chain activation remain **NOT AUTHORIZED** — this is an **off-chain services** product  
**Canonical commercial bridge (GitHub → revenue):** [../products/QPF_VERIFICATION_CERTIFICATE_V1.md](../products/QPF_VERIFICATION_CERTIFICATE_V1.md)  
**Related:** [EXTERNAL_OBSERVATION_READINESS_CHECKLIST_V1.md](./EXTERNAL_OBSERVATION_READINESS_CHECKLIST_V1.md) · Offer A evidence walkthrough  

```text
Do not build a new company.
Productize the capability that already exists.

Fastest path is not "finish OINIO."
It is: QPF becomes a verification service first.

Key sentence:
  "We verify what your system actually does,
   not what your documentation says it does."
```

---

## 1. Offer definition

### For

- AI projects  
- Web3 builders  
- Smart-contract teams  
- Grant recipients  
- Open-source protocols  

Ideal first buyer: **solo builder / OSS founder / Web3 or AI-agent developer** (same language as existing process).

### Input (client provides)

| Input | Required |
| --- | --- |
| Contract address(es) | Yes |
| Network (chain id + RPC if non-standard) | Yes |
| Deployment claims (what they say is live) | Yes |
| Admin / ownership claims | Preferred |
| Agent configuration (if AI agent project) | If applicable |
| Documentation / repo links | Preferred |

### Process (operator — reuses existing tooling)

Human-delivered using current stack (not a claim of fully self-serve SaaS UI yet):

1. Inspect deployed state (RPC / explorer)  
2. Verify addresses vs claims  
3. Check permissions / code presence where applicable  
4. Note immutable vs mutable components (to the extent public state allows)  
5. Verify claimed status vs live truth  
6. Generate evidence bundle  

Tools already in-repo: `verify:public-portal` patterns, live RPC checks, evidence scripts, public portal conventions.

### Output

1. **Public verification summary page** (or redacted client page)  
2. **Evidence receipt** (timestamped, claim → check → result)  
3. **Deployment / state summary**  
4. **Risk disclosure labels:**  
   - `verified`  
   - `unverified`  
   - `gated`  
   - `unknown`  

```text
This artifact can be independently checked without trusting us
(as far as public chain state and published methods allow).
```

### Explicit non-promises

- Not a formal security audit  
- Not legal advice  
- Not token listing, mint open, or LP  
- Not a guarantee of funding approval  
- Labels are honest: unknown remains unknown  

---

## 2. Pricing test (CAD · human finalizes)

Do not overcomplicate. Suggested first tiers:

| Tier | Price (CAD) | For | Deliver |
| --- | --- | --- | --- |
| **Starter Verification** | **$250–500** | Indie, small deploy, grant applicants | Basic report · evidence receipt · public/redacted summary |
| **Professional Verification** | **$1,500–3,000** | Protocols, AI agents, orgs | Deeper review · optional continuous check schedule · monitoring notes |
| **Verification Partner** | Monthly retainer `TBD_HUMAN` | Teams needing recurring proof | Recurring verification window · priority turnaround |

**Payment:** Off-chain invoice (e-transfer / agreed method). **Not** protocol mint.

Fill before outbound:

| Field | Value |
| --- | --- |
| Starter fixed price | `TBD_HUMAN` |
| Professional fixed price | `TBD_HUMAN` |
| Retainer | `TBD_HUMAN` |
| Contact | onenoly@proton.me |

---

## 3. 30-day KPI (only these)

| KPI | Target |
| --- | --- |
| **Primary** | One external person uses QPF verification and says it **saved time / reduced risk / helped prove something** |
| **Secondary** | **One person pays** for Starter or Professional |

Not KPIs for this window: commits, docs volume, architecture, governance receipts.

```text
One paid verification transaction changes the narrative from:
  "interesting personal infrastructure project"
to:
  "early-stage verification company with a working service."
```

---

## 4. 7-day activation offer (execution)

| Day | Action |
| --- | --- |
| 1 | Publish product page (after merge) · set `TBD_HUMAN` prices |
| 2–3 | Invite 5–10 ideal first buyers (builders like you) with one offer sentence |
| 4–5 | Deliver **one** paid or free pilot certificate if anyone bites |
| 6–7 | Seal observation / payment receipt · note friction |

**Offer sentence:**

```text
We verify what your system actually does on-chain — not what the docs say.
Starter verification $___ CAD: addresses, claims, evidence receipt, risk labels.
No wallet required to engage. Interested in a pilot?
```

---

## 5. Landing hierarchy (product first)

Flip conceptual order for **service surface** (product page):

```text
Problem
  → Verification service
  → Example certificate / sample labels
  → Evidence demo
  → Technical docs
  → Philosophy (last)
```

Visitor in 30 seconds:

> “I can send my deployment and receive an independently checkable proof package.”

Homepage full rewrite is a **separate SITE_CONTENT GO**. Until then: dedicated product page + work-with-us lead.

### Language discipline (temporary)

| Prefer | Retire for commercial surface |
| --- | --- |
| cryptographically verifiable (when accurate) | post-quantum secure (as marketing lead) |
| designed for future security models | autonomous sovereign intelligence |
| verification certificate / evidence receipt | resonance metrics · human epoch (as CTA) |

Earn bigger claims later.

---

## 6. Demo that matters (3 minutes)

**Title:** Verify a deployed contract in 3 minutes  

Show (operator path):

1. Client address + network  
2. Run verification checks (RPC / scripts)  
3. Generate receipt  
4. Open public summary  
5. Show: chain · code present / digests · ownership if known · permissions · evidence timestamp  

Close:

> This artifact can be independently checked without trusting us.

Script path: [templates/DEMO_SCRIPT_3MIN_VERIFICATION_CERTIFICATE_V1.md](./templates/DEMO_SCRIPT_3MIN_VERIFICATION_CERTIFICATE_V1.md)

---

## 7. Delivery runbook (first engagement)

1. Client sends inputs (email form).  
2. Scope fit + quote (Starter vs Professional).  
3. Operator runs checks · builds evidence bundle.  
4. Client receives report + receipt + summary.  
5. Optional public page (with permission).  
6. Invoice if paid tier.  
7. Log: time saved quote / pay signal for 30-day KPI.  

---

## 8. Locks / governance

```text
This product does NOT authorize:
  wallet · mint · LP · bridge · 18.8 · protocol financial ops

Payment for verification is off-chain services revenue.
Protocol economic activation remains separate AUTHORIZATION only.
```

---

## 9. Public surfaces

| Surface | Role |
| --- | --- |
| `/verification-certificate` | Product page (branch → live after merge) |
| `/work-with-us` | Services + CTA |
| `/deployed-addresses` | Free public example of QPF’s own verified-locked posture |
| Email | `subject=QPF Verification Certificate` |

```text
QPF = boring operational verification layer (hard to fake)
Mission now: stop hiding it behind mythology
Put a clear price tag and user journey in front of it
```
