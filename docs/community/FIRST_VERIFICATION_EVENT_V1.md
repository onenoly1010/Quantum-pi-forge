# First External Verification Event V1

**Status:** `FIRST_EXTERNAL_VERIFICATION_READY` · **Phase 8.5 Round 1 OPEN**  
**Mode:** INVITATION + REPRODUCIBLE PATH — not a transaction  
**Created:** 2026-07-29T05:46:36Z  
**Updated:** 2026-07-30T15:02:00Z (Round 1 open after 8.4 live seal)  
**Main at authoring:** `c4a98d7` (PR #631 mint authority explanation on main)  
**8.4 live seal head:** `a757581` · Round 1 report index: [verification-reports/INDEX_V1.md](./verification-reports/INDEX_V1.md)

```text
SUCCESS_CONDITION:
external observer independently confirms reality

NOT_SUCCESS_CONDITION:
transaction executed
```

---

## Why this exists

QPF has crossed:

```text
Before: Can the creator prove what was built?
After:  Can someone else verify what was built without trusting the creator?
```

Internal activation lanes stop here. The next milestone is **human/network**: an observer who is not the original builder confirms the same facts.

---

## Current governed state (must still be true after you verify)

```text
NO_MINT
NO_LIQUIDITY
NO_ECONOMIC_LAUNCH
```

| Claim | Expected finding |
|-------|------------------|
| Public mint open | **No** — disabled / governance NO-GO |
| Liquidity seeded | **No** — pair may exist with empty reserves |
| Economic launch | **No** — yield/staking/bridge not production-active on public surfaces |
| Technical contracts on 16661 | **Yes** — bytecode present |
| Verification docs on main | **Yes** — Genesis + Safe policy + mint authority |

If your findings disagree, open a GitHub issue with method + timestamps — that is a successful verification event even if it finds drift.

---

## Reproducible path (external observer)

### Step 1 — Visit deployed-address registry

Open:

https://quantumpiforge.com/deployed-addresses  

Confirm:

1. Chain ID **16661** / RPC `https://evmrpc.0g.ai`  
2. Core contract addresses listed  
3. Feature status: minting/signing/broadcast **disabled on page**  
4. DEX pair status: **empty pool** / no liquidity seeded  
5. **Verification Portal** links to Genesis docs  

### Step 2 — Verify contract addresses on chain

Use explorer or RPC. Canonical table:

- [docs/CONTRACT_REGISTRY_V1.md](../CONTRACT_REGISTRY_V1.md)

Minimum checks:

```bash
# Chain ID → expect 0x4115 (16661)
curl -s -X POST https://evmrpc.0g.ai \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'

# Bytecode non-empty for OINIO token
curl -s -X POST https://evmrpc.0g.ai \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0x75995EC0fdf881189850aeD864cB3f43c0DFCb58","latest"]}'
```

Optional: recompute bytecode SHA-256 and compare to registry digests.

### Step 3 — Check evidence receipts

Browse repository `receipts/` (or clone https://github.com/onenoly1010/Quantum-pi-forge):

| Receipt / doc | What it proves |
|---------------|----------------|
| `docs/GENESIS_VERIFICATION_V1.md` | Entry + Reality Layer |
| `docs/evidence/PUBLIC_READINESS_REPORT_V1.md` | Technical vs commercial activation |
| `receipts/governance/public-mint-policy-final-v1.json` | `mint_allowed=false` |
| `receipts/governance/phase-33-public-mint-execution-no-go-v1.json` | Execution NO-GO |
| `receipts/governance/phase-82-safe-governance-policy-v1.json` | Safe restraint sealed |
| `docs/governance/MINT_AUTHORITY_EXPLANATION_V1.md` | Who could mint / why dormant |
| `receipts/execution/first-controlled-mint-verification-v1.json` | Historical controlled mint evidence only |

Optional local:

```bash
git clone https://github.com/onenoly1010/Quantum-pi-forge.git
cd Quantum-pi-forge
npm run verify:evidence
# PASS does not mean mint is open
```

### Step 4 — Review governance boundaries

Read:

- [docs/SECURITY_BOUNDARIES_V1.md](../SECURITY_BOUNDARIES_V1.md)  
- [docs/governance/SAFE_GOVERNANCE_POLICY_V1.md](../governance/SAFE_GOVERNANCE_POLICY_V1.md)  

Confirm: Safe **exists** ≠ Safe may mint/spend; technical live ≠ commercial launch.

### Step 5 — Confirm current state checklist

Tick only if independently true:

- [ ] No public mint activation  
- [ ] No liquidity activation (reserves empty or no LP event)  
- [ ] No economic launch (staking/yield/bridge not claimed live without tx proof)  
- [ ] Contracts exist on chain 16661  
- [ ] Docs/receipts match site claims  

### Step 6 — Record the verification event (optional but valued)

Open a GitHub issue titled:

```text
External verification: YYYY-MM-DD
```

Include:

```text
verifier: (name or handle)
date_utc:
method: (browser + explorer / RPC / clone)
chain_id_observed:
token_code_present: yes/no
registry_code_present: yes/no
pair_reserves_empty: yes/no
mint_site_disabled: yes/no
policy_mint_allowed: false expected
disagreements: (none or list)
```

That issue is the **first independent verification event**.

---

## Builder entry (optional)

If you want to go further without activation:

- [docs/BUILDER_QUICKSTART.md](../BUILDER_QUICKSTART.md) — 10-minute verify path  
- https://www.quantumpiforge.com/resonate — participant/guardian surfaces (non-admin)  

Do **not**:

- run `*:execute` scripts  
- send funds to “mint” addresses manually  
- assume liquidity or yield is live  

---

## Seal

```text
FIRST_EXTERNAL_VERIFICATION_READY
```

| Field | Value |
|-------|--------|
| Document | `docs/community/FIRST_VERIFICATION_EVENT_V1.md` |
| Receipt | `receipts/governance/first-external-verification-ready-v1.json` |
| Main base | `c4a98d7` (#631) |
| Trust chain | #629 → #630 → #631 → this invitation |
| Next event | Human/network external confirmation (not a phase of internal activation) |

```text
NO_MINT
NO_LIQUIDITY
NO_ECONOMIC_LAUNCH
CAPABILITY_EXISTS
PERMISSION_REMAINS_GOVERNED
```

---

*First verification event invitation — attention moves outward.*
