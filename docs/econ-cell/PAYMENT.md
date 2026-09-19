# How to Pay — DECISION LOCKED 2026-09-11: Crypto-first (EVM / 0G Aristotle)

> **Payment records a real transaction — it does not create one.**

QPF's econ cell **cannot mint revenue**. A payment is only recorded when an
external reference proves a real transaction occurred outside the system.

## Chosen rail (best for this project)

**Cryptocurrency on EVM (0G Aristotle Mainnet), USDC/USDT or native 0G equivalent — $2.00 / $5.00 exact.**

Why this one (not PayPal/Stripe/bank):
- Global, no KYC gate, matches your existing 0G Aristotle + explorer evidence (`https://explorer.0g.ai`).
- Tx hash IS the external reference your `pay` command already requires (>=8 chars, auditable on explorer).
- No chargebacks, no processor freeze, no private data in ledger — only the tx hash is recorded.
- PayPal/Stripe remain accepted as fallback (transaction ID), but crypto is primary.

## Receiving address (ESTABLISHED 2026-09-19)

```
RECEIVING_ADDRESS=0x1fF3dbddc1c18C9eC53806BA16Fb6A3E1bE327d3
CHAIN=0G Aristotle Mainnet (EVM, chain id 16661) — or Ethereum L1 if customer prefers
ASSET=USDC / USDT preferred (stable $2.00 / $5.00 exact); native 0G accepted at quoted USD equivalent
```

RULES:
- Use a FRESH receiving address you control. Do NOT publish the Guardian Safe (`0x8d08...4389` governance only) or the old untrusted deployer (`0x3356...F4DC`) as a payment address.
- Never publish a seed phrase or private key. Receiving address only.
- This address is the public source of truth for payment.

### Provenance of this address (why it is legitimate)

`0x1fF3dbddc1c18C9eC53806BA16Fb6A3E1bE327d3` is the operator's **current active 0G wallet** — the destination the
2026-08-15 wallet rotation moved TO (source: `~/.0g-compute-cli/config.json`, the operator's own credential store).
It satisfies every rule above: it is fresh (not the Guardian Safe, not the old untrusted deployer), and it is
controlled by the operator (independently verified: deriving the address from the configured key reproduces exactly
this EIP-55 checksummed address, and the same address is what the 0G CLI itself prints).

**Known trade-off, recorded honestly:** this is currently also the wallet used for 0G Compute automation. For v0 —
with $2/$5 payments — that exposure is acceptable. If the service grows, the recommended refinement is a dedicated
receiving wallet. That is an optional future change, not a blocker.

## What This Means

- You pay **after** receiving an ESTABLISHED verdict
- You pay **the exact invoiced amount** ($2.00 or $5.00)
- You provide the **tx hash** that proves your payment happened
- QPF records the payment — it cannot invent or inflate it

## Accepted Payment Methods (priority order)

| Priority | Method | Reference Type | Example |
|----------|--------|---------------|---------|
| **1 PRIMARY** | **Crypto (EVM/0G)** | Transaction hash | `0xabc123...` (verify on explorer.0g.ai) |
| 2 fallback | **PayPal** | Transaction ID | `8MC585209K2320412` |
| 3 fallback | **Stripe** | Payment intent ID | `pi_3Nq...` |
| 4 fallback | **Bank Transfer** | Transfer reference | `TRF-20260901-ABC` |

## The Process

1. You receive an invoice (job_ref + amount + receiving address)
2. You send $2.00 / $5.00 exact to RECEIVING_ADDRESS
3. You send the transaction hash to QPF
4. QPF records the payment:

```bash
python3 economic_cell.py pay <job_ref> <amount> <tx_hash>
```

## Payment Verification

The payment recording requires:
- A valid invoice exists for the job_ref
- Amount matches the invoice exactly
- External reference is ≥8 characters
- Payment hasn't already been recorded (idempotency)

Any failure = payment refused, no ledger entry. The system cannot be tricked
into recording revenue that didn't happen.

## After Payment

Once recorded:
- **50%** → reserve (untouchable — survival constraint)
- **30%** → compute budget
- **20%** → ops budget

You receive a receipt confirming the transaction is in the hash-chained ledger.

