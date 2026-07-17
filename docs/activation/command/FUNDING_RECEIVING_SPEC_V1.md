# FUNDING RECEIVING SPEC v1

**Status:** `AWAITING_KRIS_FILL` → then `AUTHORIZE TO RECEIVE`  
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
| Accept CAD fiat? | `YES` / `NO` |
| Accept crypto? | `YES` / `NO` |
| If crypto, asset | e.g. `native 0G` / `USDC` / `none` |

### Destination (PUBLIC ONLY)

| Channel | Your value | Status |
| --- | --- | --- |
| Fiat e-Transfer / display name | `_paste here_` | **UNSET** |
| Fiat rails | e.g. Interac CAD | **UNSET** |
| EVM public address (if crypto) | `0x…` | **UNSET** |
| Chain ID (if crypto) | `16661` (default) | Documented |

Also update the same fields in `funding-receiving-form-v1.json`.

### Ownership

| Field | Value |
| --- | --- |
| Statement | `I control this destination` (or stronger) |
| Date (UTC) | `YYYY-MM-DD` |

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

- [ ] Assets chosen (CAD / crypto)  
- [ ] Destination filled (public-safe)  
- [ ] Network/rails set  
- [ ] Owner statement + date  
- [ ] Paste **AUTHORIZE TO RECEIVE**  

**After that phrase:** agent marks gate `READY_TO_RECEIVE` only — still no spend, no vehicle purchase automation.
