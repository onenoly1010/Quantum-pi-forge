# Authorize to Receive — Ready Package v1

**Goal:** Get Kris to a single authorization moment:  
**“I authorize this destination to receive Spiral / grant / revenue funds.”**

**Agent cannot invent your bank or wallet.** You paste **public-safe** values only.

---

## You are here

| Step | Status |
| --- | --- |
| Funding truth (secured CAD = 0) | Recorded |
| Grant path (PENDING #789) | Recorded |
| Receiving destination | **BLOCKER — only you can fill** |
| Authorize to receive | **After** destination fields filled |

---

## Do this now (5–15 minutes)

### 1. Choose what you will accept (pick one or both)

| Option | Use for | Fill in form |
| --- | --- | --- |
| **A. CAD fiat** | Vehicle, gas, lodging, real spend | e-Transfer email or display name (not full account # in git if sensitive) |
| **B. Crypto on 0G** | Only if grant/payer pays in crypto | Your **public** `0x…` on chain **16661** (not the untrusted `0x335651…`) |

**Do not use as personal receive:**

- `0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC` (untrusted)  
- `0x8d088B88219D072aB035502065ee2410c2cb4389` (Guardian Safe — governance, not shopping wallet)  

### 2. Fill the form (same folder)

Edit **one** of:

- Human markdown: `FUNDING_RECEIVING_SPEC_V1.md` (fill `TBD_HUMAN` lines)  
- Machine form: `funding-receiving-form-v1.json` (replace `null` / `TBD_HUMAN`)

Minimum to unlock authorize:

```text
currency_or_asset: CAD and/or crypto symbol
destination_public: <your e-transfer OR 0x address>
network_or_rails: e.g. Interac CAD / 0G Aristotle 16661
owner_statement: "I control this destination"
date_utc: YYYY-MM-DD
```

### 3. Paste this exact authorization (chat or file)

When the form is filled:

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

### 4. After you authorize (what agent will do)

On that phrase + filled form:

1. Mark receiving gate **READY_TO_RECEIVE** (docs only).  
2. Keep **secured = 0** until you provide **payment proof** (tx hash or bank confirmation).  
3. **Not** spend, swap, or buy a vehicle.

---

## Safety (read once)

- Authorize **receive** ≠ authorize **spend**.  
- Vehicle purchase needs separate human action after funds are **secured** in the ledger.  
- Crypto lane still needs safety review if using unreviewed wallet path.  
- Never paste seed phrases or private keys.

---

## Checklist → “authorize to receive”

- [ ] I chose CAD and/or crypto  
- [ ] I pasted public destination (not untrusted / not only Safe unless intentional)  
- [ ] I set network/rails  
- [ ] I set owner_statement  
- [ ] I paste **AUTHORIZE TO RECEIVE** block above  

**When all five are done, you are at the authorization point.**
