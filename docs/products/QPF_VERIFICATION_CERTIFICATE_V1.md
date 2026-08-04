# QPF Independent Verification Certificate — v1

**Phase:** Commercial validation (begins now)  
**Prior phase:** Genesis infrastructure — **credible** (locks held)  
**Bridge:** GitHub / public surfaces → **offer → customer → artifact → payment → testimonial**  
**Ops detail:** [../ops/QPF_VERIFICATION_CERTIFICATE_V1.md](../ops/QPF_VERIFICATION_CERTIFICATE_V1.md)  
**Public page (after deploy):** `/verification-certificate`  

```text
Boring operational layer = the hard-to-fake asset
Next mission: price tag + user journey in front of it
EXTERNAL TRANSACTION = the state change that matters

Do not build a new company.
Productize the capability that already exists.
```

```text
PREPARE → PUBLISH OFFER → INVITE → DELIVER ARTIFACT → RECORD OUTCOME
Not: generate another architecture layer.

Human authorization → external action
(payments · customer commitments · public certificates)
```

---

## 1. What it is

**One sentence:**

> We create an independently checkable evidence package showing what your AI agent or blockchain deployment actually does, what is locked, and what remains unverified.

**Product sentence:**

> We verify what your system actually does, not what your documentation says it does.

This is a **human-delivered verification service** using QPF’s existing inspection, evidence, and receipt discipline — not protocol mint, not liquidity, not a full formal security audit.

---

## 2. Who it is for

| Ideal first customers | Why |
| --- | --- |
| GitHub / open-source projects | Already care about inspectability |
| Grant recipients | Need claim→proof for reviewers |
| Indie Web3 builders | Speak deployment + evidence language |
| AI agent builders | Need honesty about what agents/contracts actually do |

**Not first:** enterprises requiring SOC2-style programs (later).

---

## 3. Verification scope

### In scope (typical Starter)

| Check | Output label |
| --- | --- |
| Network / chain id | verified / mismatch / unknown |
| Contract code present at address | verified / empty / unknown |
| Deployment claims vs live state | matched / unmatched / partial |
| Ownership / admin (if publicly readable) | reviewed / not readable / unknown |
| Permissions (publicly inspectable) | reviewed / gated / unknown |
| Documentation vs chain | matched / drift / unknown |
| What is intentionally locked / not live | gated (explicit) |

### Out of scope (honest “not verified”)

| Claim type | Label |
| --- | --- |
| Economic activity / revenue | not verified |
| Future roadmap promises | not verified |
| External liquidity / market | not verified |
| “Audit grade” security guarantee | not claimed |
| Legal compliance | not claimed |

Labels used in the certificate: **`verified` · `unverified` · `gated` · `unknown`**

---

## 4. Customer input (simple)

```text
Project name:
Website:
Chain:
Contract address(es):
Claim being verified:
Documentation:
Contact:
```

No complicated onboarding. Email or form body is enough.

**Mailto subject:** `QPF Verification Certificate`

---

## 5. Example output

```text
QPF Verification Certificate #001

Project:
Network:
Verified components:
- Contract deployed ✓
- Ownership status ✓   (or: not publicly readable → unknown)
- Permissions reviewed ✓
- Documentation matched ✓   (or: drift → unmatched)

Not verified:
- Economic activity
- Future roadmap claims
- External liquidity

Evidence:
  hash:
  timestamp:
  public receipt:   (URL or repo path, if client permits)
  methods:          (e.g. eth_chainId, eth_getCode, …)

Risk labels summary:
  verified | unverified | gated | unknown
```

Delivery package:

1. Certificate (above structure)  
2. Evidence receipt (timestamped checks)  
3. Deployment/state summary  
4. Optional public summary page (with permission)  

---

## 6. Pricing (CAD · test)

| Tier | Price | For |
| --- | --- | --- |
| **Starter** | **$250–500** | Indie, small deploy, grant applicants |
| **Professional** | **$1,500–3,000** | Protocols, AI agent projects, orgs |
| **Partner** | Monthly retainer `TBD_HUMAN` | Recurring proof window |

Payment: **off-chain invoice**. Not a token purchase.  
Operator fills exact prices before outbound: `TBD_HUMAN` if not set.

---

## 7. Request process

```text
1. Client sends input fields (§4)
2. Human confirms fit + tier + price
3. Operator runs inspection (existing tools / RPC / explorer)
4. Operator produces certificate + evidence receipt
5. Client receives artifacts; optional public page
6. Invoice if paid tier
7. Record: time/risk/proof quote · payment yes/no
```

**AI may:** prepare drafts, checklists, report shells.  
**Human must:** authorize customer commitment, send offer, accept payment terms, publish public certificates.

---

## 8. 30-day commercial KPIs

| KPI | Target |
| --- | --- |
| 1 | External person: “saved time / reduced risk / helped prove something” |
| 2 | **One paid** Starter or Professional |

Not scored: commits, docs volume, architecture, internal receipts.

```text
First external certificate > next thousand internal commits
```

---

## 9. Assets already available (wrappers only missing)

| Asset | Role |
| --- | --- |
| Public deployment surfaces | Example of locked, checkable posture |
| Verification philosophy + evidence model | Product DNA |
| Contract/state inspection experience | Delivery engine |
| 0G deployment knowledge | Network competence |
| Documentation discipline | Trust substrate |
| Product page | `/verification-certificate` (after deploy) |
| Work with us | Lead CTA |

---

## 10. Locks (unchanged)

```text
Mint activation: LOCKED
Liquidity: LOCKED
Chain financial execution: LOCKED
Site signing: DISABLED (product does not require it)

Commercial validation phase: BEGINS
Genesis infrastructure phase: CREDIBLE
```

---

## 11. State transition for a sale

```text
PREPARE OFFER ✓
  → PUBLISH OFFER (merge/deploy product page)
  → INVITE first verifier/customer
  → DELIVER artifact
  → RECORD outcome (certificate #001 + optional payment)

Do not advance state by claim.
Advance by delivered certificate and observed customer result.
```
