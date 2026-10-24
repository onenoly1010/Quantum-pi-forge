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

## Price (outcome-independent flat fee, 2026-09-25)

| Item | Price |
| --- | --- |
| **One claim · evidence package** | **CAD $250 flat** |
| Priority scheduling (next available start slot only) | **+ CAD $100** |

One currency, one fee, one offer. The fee is **identical** whether the verdict is
`ESTABLISHED`, `FAILED`, or `UNKNOWN`: it pays for the work of testing,
reproducing, and documenting one public claim. Payment never buys a verdict, a
label, a delay, or a removal.

- **Withdrawn 2026-09-25:** the $2 / $5 USD offer ("pay after ESTABLISHED,
  FAILED = $0"), which made revenue depend on the verdict — a fee for good
  verdicts.
- **Withdrawn 2026-09-25:** the $500 CAD founder certificate (`#001–#003`) and
  the $1,500 CAD standard certificate. `/verification-certificate` now records
  the withdrawal rather than deleting it.
- **Not verified, not priced:** continuous monitoring and deeper protocol
  review. No published price, and no demand evidence at any price.

**Flow:** submit → intake (testable? if not, declined at no cost) → invoice →
claim and scope committed to the public registry → review → public receipt.

**Refunds:** none based on the outcome. If QPF does not deliver the receipt
within 10 business days of public registration, the fee is refunded in full and
the claim stays on the public record, marked `ABANDONED_OR_OVERDUE_BY_QPF`.

Payment: manual off-chain invoice. Not mint/LP/token purchase. No card or crypto
checkout exists yet.

First goal is still **exchange of value** (use · recommend · pay), not max
revenue. No sale has been established at any price.

---

## Request

1. Email: `onenoly11@proton.me` · subject `QPF verification review request`  
2. Or use the prefilled form on `/verification-request`  
3. Intake confirms the claim is testable against public artifacts; if it is not,
   it is declined at no cost  
4. Flat fee invoiced, then the claim and its scope are committed to the public
   registry before any work begins  
5. Evidence receipt published, stating what is verified and what is not  

**AI prepares. Human authorizes** customer commitments and payments.

---

## Invite (5–10 targeted · not broadcast)

```text
We built an open verification workflow that produces public evidence reports for
deployed systems, and we are looking for the first external project to review.

One claim, one flat fee of CAD $250, and the same fee whatever the finding is:
ESTABLISHED, FAILED, or UNKNOWN. The claim and its scope go on the public record
before any work starts, so nothing can be quietly dropped, and you can re-run the
receipt yourself.

We state what is verified AND what is not (roadmap, token value, adoption).
No wallet required to engage.
```

Do not offer a free certificate, a discount for a favourable result, or a price
that depends on the outcome. If a claim is untestable, decline it at intake at no
cost rather than discounting it.

---

## After #001 — capture learning (product roadmap source)

| Field | Record |
| --- | --- |
| Time spent | |
| Manual steps | |
| Confusing sections | |
| Requested features | |
| Willingness to pay / recommend | |
| Five success criteria answers | see commercial gate |

That becomes the **actual** product roadmap — not speculative architecture.

---

## Locks

```text
Protocol mint: LOCKED
Liquidity: LOCKED
Chain financial execution: LOCKED

Service validation proceeds without token/liquidity milestones.
Commercial outreach: OPEN WHEN HUMAN AUTHORIZES
```
