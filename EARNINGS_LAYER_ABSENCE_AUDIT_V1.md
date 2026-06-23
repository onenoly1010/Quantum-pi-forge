# Evidence Bundle — Earnings-Layer Absence Audit V1

**Lane:** earnings-layer absence audit + public-claims correction  
**Status:** GATE_FALSE (gate failed; follow-up required)  
**Canon:** `main` @ `aa51bcbe2fb4e5ecf2b7c0cccfee3317136baa5c`  
**Generated:** 2026-06-23 01:13:19 UTC-6

---

## CHECK-A: Public yield activation status vs claimed activation block

### Claim surface reviewed
- `GDR-001.2_REVENUE_AND_YIELD_DISTRIBUTION.md` (lines 1–117)
  - States effective block `1,850,000` on 0G Aristotle Mainnet
  - States first yield pulse within 12 blocks
  - Status line: `PROPOSED | PENDING ENNEAD RATIFICATION`

### Evidence checked
- `contracts/DEPLOYED_ADDRESSES.md`: presents addresses with explicit "does not claim deployment where proof is absent" disclaimer; no yield-activation transaction hash present in reviewed content
- `AUDIT.md`: active baseline is local deterministic verification; no on-chain yield receipt referenced within reviewed content

### Finding
[A] Public-activation claim (block `1,850,000`, "first yield pulse will occur within 12 blocks") is currently **unverified by an on-chain transaction artifact** in the inspected evidence surface.  
[B] The GDR itself classifies itself as **PENDING ENNEAD RATIFICATION**, not executed.  
**Conclusion:** Absence of activation proof is currently **correctly represented**; no false execution claim is present. Gate fails because the activation has not been externally verified in this lane.

### Falsification condition (pass criteria)
- On-chain transaction hash at or after block `1,850,000` showing fee-on-transfer or royalty transfer routed to Legacy Vault / Pioneer Rewards / Operational Treasury as specified in `GDR-001.2` §2

---

## CHECK-B: Public-claims vocabulary consistency (revenue vs yield vs earnings)

### Claim surface reviewed
- `GDR-001.2_REVENUE_AND_YIELD_DISTRIBUTION.md`
- `0G_ARISTOTLE_GEANT_APPLICATION_OUTLINE.md`
- `0G_HALL_POST_FINAL.md`
- `docs/CATALYST_POOL_ECONOMICS.md`
- `SOVEREIGN_YIELD_DASHBOARD_REQUIREMENTS.md`
- `README.md`
- `contracts/src/OINIOToken.sol`

### Vocabulary audit
| Term | Where used | Classification |
|:---|:---|:---|
| "yield pulse" | GDR-001.2, SOVEREIGN_YIELD_DASHBOARD_REQUIREMENTS.md | Revenue event |
| "revenue" | GDR-001.2, 0G_HALL_POST_FINAL.md, 0G_ARISTOTLE_GRANT_APPLICATION_OUTLINE.md | Protocol fee pool |
| "earnings" | Not found in reviewed yield-documentation surface | Absent from public docs |
| "Legacy Vault" | GDR-001.2 | 50% of swap fees, 200-year timelock |
| "Pioneer Rewards" | GDR-001.2 | Distribution bucket |
| "Operational Treasury" | GDR-001.2 | Authorized expenditure bucket |
| "royalty" | GDR-001.2 (Soul Minting 2.5%), CATALYST_POOL_ECONOMICS.md (20%) | Minting + inference royalty |
| "mintable" / mint function | `contracts/src/OINIOToken.sol`: no public mint; supply fixed at deployment | Absent |

### Finding
[A] Terminology is internally consistent within the reviewed yield docs where "revenue" and "yield" are used as distinct concepts (protocol fees vs generated output).  
[B] "earnings" does **not** currently appear in the reviewed public yield-documentation surface; the term is absent, not misused.  
[C] The OINIOToken implementation lacks any mint/emission extension; it is fixed-supply and burnable only. Public claim of "yield" is therefore routed through fee distribution, not token emission.

### Falsification condition (pass criteria)
- Verified on-chain evidence that a `mint()` or `mintTo()` exists and is callable on any deployed `OINIOToken`-class contract referenced by this repo, OR a corrected public claim clarifying that yield is fee-based, not emission-based.

---

## CORRECTIVE ACTIONS REMAINING (GATE_FALSE)

1. Obtain and index an on-chain transaction hash for the first yield pulse at/after block `1,850,000` on 0G Aristotle Mainnet showing fee collection and at least one routed transfer per the GDR-001.2 allocation table.
2. Update `GDR-001.2_REVENUE_AND_YIELD_DISTRIBUTION.md` with the verified transaction hash and block confirmation once observed.
3. Confirm in `DEPLOYED_ADDRESSES.md` whether the yield-routing contracts are deployed and add addresses only after verification, following its own stated proof requirements.

---

## SEALED CLAIM OBJECT

This audit produces the following claim only:

> The earnings-layer absence audit V1 found **no false public claim of executed yield activation** within the reviewed surface, but found **absence of on-chain yield-activation proof**; the lane remains in `GATE_FALSE` until falsification criteria are satisfied.

Claim text (canonical, non-authoritative):
"Public yield activation was not observed as executed in inspected evidence as of 2026-06-23 01:13:19 UTC-6."

Verification command:
`node scripts/verify-evidence.cjs && npm run verify:claim-map`