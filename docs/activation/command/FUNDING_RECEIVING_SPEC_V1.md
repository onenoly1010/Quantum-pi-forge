# FUNDING RECEIVING SPEC v1

**Status:** `READY_TO_RECEIVE` — authorization recorded 2026-07-31T21:11:17Z

**Companion form:** [`funding-receiving-form-v1.json`](./funding-receiving-form-v1.json)  
**One-pager:** [`AUTHORIZE_TO_RECEIVE_READY_V1.md`](./AUTHORIZE_TO_RECEIVE_READY_V1.md)  
**Rule:** Never commit private keys, seeds, or full bank account numbers. Public identifiers only.

**Repo truth:** secured CAD = **0** until payment proof. Authorize **receive** ≠ authorize **spend**.

---

## Pre-filled (from forge — do not treat as money)

| Field | Value |
| --- | --- |
| Spiral currency default | **CAD** |
| Travel gap (plan) | CAD **4550** |
| Vehicle estimate (model) | CAD **~10000** |
| Crypto network if used | **0G Aristotle**, chainId **16661** |
| Grant track | Guild **#789**, **PENDING** review |

### Do **not** use as personal receive

| Address | Why |
| --- | --- |
| `0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC` | Untrusted |
| `0x8d088B88219D072aB035502065ee2410c2cb4389` | Guardian Safe (governance only unless you deliberately choose Safe custody) |

---

## Kris fills (required for authorize)

### Accepted assets

| Field | Value (edit) |
| --- | --- |
| Accept CAD fiat? | `YES` |
| Accept crypto? | `YES` |
| If crypto, asset | `0G` |

### Destination (PUBLIC ONLY)

| Channel | Your value | Status |
| --- | --- | --- |
| Fiat e-Transfer / display name | Withheld from public repository | **CONFIGURED** |
| Fiat rails | `Interac e-Transfer Autodeposit` (operator-controlled destination) | **CONFIGURED** |
| EVM public address (if crypto) | `0x0fbBd408A419E96F592A61824168903E179B3397` | **CONFIGURED** |
| Chain ID (if crypto) | `16661` (0G Aristotle Mainnet) | **CONFIGURED** |

Also update the same fields in `funding-receiving-form-v1.json`.

### Ownership

| Field | Value |
| --- | --- |
| Statement | The authorized project operator controls the separately maintained fiat receiving destination and the 0G Aristotle Mainnet destination. |
| Date (UTC) | `2026-07-31` |

### Receiving lanes

```yaml
fiat_receiving:
  currency: CAD
  method: Interac e-Transfer Autodeposit
  status: configured

crypto_receiving:
  network: 0G Aristotle Mainnet
  asset: 0G
  address: 0x0fbBd408A419E96F592A61824168903E179B3397
  purpose: Public receiving address for approved 0G project payments, grants, or transfers.
  status: configured

authorization:
  transfers_enabled: false
  signing_required: true
  approval_required: true
```

---

## Safety checks (before counting funds as secured)

1. Source known (grant award / payer / invoice).  
2. Payment lands on destination above.  
3. Tx hash or bank confirmation recorded.  
4. You can see available balance.  
5. **Then** update secured ledger — not before.  
6. Crypto: safety review if using previously blocked wallet lane.  

---

## Authorization phrase (paste when form is complete)

```text
AUTHORIZE TO RECEIVE

I am Kris Olofson.
I control the destination recorded in:
  docs/activation/command/funding-receiving-form-v1.json
I authorize that destination to receive inbound funds for
  Spiral Return / grant payout / revenue only.
I understand secured ledger stays 0 until payment proof exists.
I do not authorize the agent to sign, spend, or transfer.
Date (UTC): ________
```

---

## Checklist

- [x] Assets chosen (CAD / crypto)
- [x] Destination filled (public-safe)
- [x] Network/rails set
- [x] Owner statement + date
- [x] **AUTHORIZE TO RECEIVE** recorded by Kris Olofson (authorized project operator) at `2026-07-31T21:11:17Z`

**Current gate:** `READY_TO_RECEIVE` only — still no spend, no vehicle purchase automation.
