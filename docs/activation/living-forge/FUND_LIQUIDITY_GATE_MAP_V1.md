# Fund & Liquidity Gate Map v1

**Generated:** 2026-07-16  
**Rule:** Inventory only. **No** gate was force-opened for real fund movement or liquidity execution.

---

## Executive result

| Ask | Result |
| --- | --- |
| Find gates linked to real funds / liquidity | **Done** — table below |
| Open them (execute / authorize live money) | **Refused** — forge + sealed receipts set all live economic flags **false** / **NO-GO** |
| What is already “OPEN” | Planning/readiness gates only — **not** spend/liquidity live |

---

## Gates linked to real funds / liquidity / economic action

| Gate / receipt | Link to funds | Live status (sealed) | Can agent open execution? |
| --- | --- | --- | --- |
| Liquidity approval command hash | Approvals for LP | **`APPROVAL_COMMAND_HASH_BLOCKED_UNTIL_FUNDED`** — W0G/USDC.e owner balances zero | **No** |
| Liquidity funding plan | Seed capital | **`LIQUIDITY_FUNDING_PLAN_REQUIRED_NO_EXECUTION`** | **No** |
| Liquidity policy readiness | LP policy | **`LIQUIDITY_NOT_AUTHORIZED`** | **No** |
| Liquidity readiness preflight | LP checks | **`READ_ONLY_COMPLETE`** | **No** (already read-only done) |
| Funding constraint resilience | All fund ops | **`funds_movement_authorized: false`**, **`liquidity_authorized: false`** | **No** |
| Sustainability readiness | Funding map | **`FUNDS_MOVEMENT_AUTHORIZED=false`**, **`LIQUIDITY_AUTHORIZED=false`** | **No** |
| Economic sovereignty | Treasury/routing | **`FUNDING_ROUTING_AUTHORIZED=false`**, **`WALLET_ACTION_AUTHORIZED=false`** | **No** |
| Live activation gate | Live economy | **Live execution NOT YET AUTHORIZED** | **No** |
| Public mint final decision | Mint economy | **`PUBLIC_MINT NOT_OPEN`**, decision pending | **No** |
| Phase 39 mint NO-GO | Mint | **`NOGO_CLOSURE_SEALED_NO_EXECUTION`** | **No** |
| PUBLIC_VALIDATION_STATUS | LP/stake/treasury | Liquidity/staking/**blocked** until funding+validation | **No** |
| Spiral funding action plan | CAD runway | **OPEN** planning; **`funding_movement: false`**, secured **0** | Planning only |
| Spiral vehicle acquisition | Vehicle CAD | **OPEN** planning; **`vehicle_purchase_authorized: false`**, secured **0** | Planning only |
| Gas funding quantity limits | Gas budgets | Limits declared; not a money source | N/A |
| Grant / funder packets | External capital | Outreach/review — **not** awarded payout | Human portal |

Evidence paths under `receipts/governance/liquidity-*`, `funding-constraint-resilience-mode-v1.json`, `docs/governance/SUSTAINABILITY_READINESS_GATE_V1.md`, `ECONOMIC_SOVEREIGNTY_GATE_V1.md`, spiral-return receipts.

---

## Why they cannot be “opened” by the agent

1. **Liquidity:** blocked until funded balances + exact amounts + human command hash (`liquidity-approval-command-hash-blocked-v1.json`).  
2. **Funds movement / liquidity flags:** explicitly **false** in resilience + sustainability gates.  
3. **Mint:** multi-phase **NO-GO** / not open.  
4. **Spiral vehicle/travel:** planning **OPEN**, purchase **not authorized**, secured **CAD 0**.  
5. **Forge P0:** no sign/transfer without human authorization.  
6. **No verified external payer** to fund LP or vehicle.

Opening execution would require **new human-sealed authorization receipts** + **real capital** — not flipping a status string.

---

## What *is* open (allowed now)

| Open for | Meaning |
| --- | --- |
| Living Forge P3 | verify/build/preflight/docs |
| Spiral **planning** gates | Fill ledgers, budgets, receiving spec (human) |
| Grant **review** lane | Human portal action |
| Liquidity **read-only** preflight | Already complete as read-only |

---

## Human path to *eventually* open fund/liquidity (order)

1. Real secured CAD / awarded grant (ledger &gt; 0 with proof).  
2. Fill `FUNDING_RECEIVING_SPEC` destination.  
3. Fresh funding wallet (not untrusted `0x335651…`).  
4. Human authorize liquidity funding plan amounts.  
5. Preflight with non-zero W0G/USDC.e as required by blocked approval hash receipt.  
6. Separate explicit authorization receipts for each of: approvals → seed LP → mint/stake if ever desired.  
7. Guardian/Safe policy as required by current governance docs.

Until step 1–2 exist, **no downstream fund/liquidity gate can honestly open**.
