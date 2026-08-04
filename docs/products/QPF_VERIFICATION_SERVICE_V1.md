# QPF Verification Service

**Bridge:** GitHub / public surfaces → **users**  
**Commercial gate:** [QPF_COMMERCIAL_ACTIVATION_GATE_V1.md](./QPF_COMMERCIAL_ACTIVATION_GATE_V1.md)  
**Certificate product detail:** [QPF_VERIFICATION_CERTIFICATE_V1.md](./QPF_VERIFICATION_CERTIFICATE_V1.md)  
**Example:** [examples/QPF_VERIFICATION_CERTIFICATE_000.md](./examples/QPF_VERIFICATION_CERTIFICATE_000.md)  
**Public page (after deploy):** `/verification`  

```text
Before: "Look how much infrastructure exists."
After:  "Give us something you want verified."

Certificate #001 is the next meaningful block.
A merge is only valuable if it enables a user outcome.
```

---

## Problem

Projects make claims. Users, partners, and grant reviewers cannot easily verify reality on-chain (or against live configuration).

Documentation and dashboards are not enough.

---

## Solution

An **independent evidence package**: what the system actually does, what is locked, and what remains unverified.

One sentence:

> We verify what your system actually does, not what your documentation says it does.

---

## Input

```text
Project name:
Website:
Chain:
Contract address(es):
Claim being verified:
Documentation:
Contact:
```

---

## Output

**Public (or client-scoped) verification certificate** plus:

- Evidence receipt (timestamped methods + results)  
- Deployment / state summary  
- Risk labels: `verified` · `unverified` · `gated` · `unknown`  

Example format: Certificate **#000** (QPF self — internal demo only).  
External delivery format: Certificate **#001** template — [examples/QPF_VERIFICATION_CERTIFICATE_001_TEMPLATE.md](./examples/QPF_VERIFICATION_CERTIFICATE_001_TEMPLATE.md).

---

## Scope

### What we verify

| Area |
| --- |
| Network / chain identity |
| Code present at claimed addresses |
| Claimed deployment vs live state |
| Ownership / permissions where publicly readable |
| Explicitly gated features (mint, LP, etc.) |

### What we do not verify

| Area |
| --- |
| Future roadmap |
| Token value |
| Adoption claims |
| Economic outcomes / revenue |
| Formal security-audit guarantees |

```text
No pretending.
Verified AND not verified — always both.
```

---

## Price (founder launch)

| Certificates | Price |
| --- | --- |
| **#001–#003** (founder validation) | **$250–500 CAD** |
| Early adopter (after first three) | **$500 CAD** |
| Standard | **$1,500 CAD** |
| Continuous monitoring | **$500–1,000 CAD/month** |

First goal: **prove exchange of value** (use + willingness to pay), not max revenue.

Payment: off-chain invoice. Not mint/LP/token purchase.

---

## Request

1. Email: `onenoly@proton.me` · subject `QPF Verification Certificate`  
2. Or form body on `/verification` (after deploy)  
3. Human confirms fit + price  
4. Delivery of certificate + evidence  
5. Feedback: “This helped me because ______.”  

**AI prepares. Human authorizes** customer commitments and payments.

---

## Invite (5–10 targeted · not broadcast)

```text
We built a public verification system and are testing the first external
certificates. Would you like your deployment independently verified and
receive a public evidence report?

Founder launch: $250–500 CAD for the first certificates.
We state what is verified AND what is not.
No wallet required to engage.
```

---

## Locks

```text
Protocol mint: LOCKED
Liquidity: LOCKED
Chain financial execution: LOCKED

Commercial service: OPEN TO AUTHORIZED OUTREACH
```
