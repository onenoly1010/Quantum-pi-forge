# FUNDING RECEIVING SPEC v1

**Status:** TEMPLATE — incomplete until Kris fills PUBLIC fields  
**Rule:** Never commit private keys, seeds, full bank account numbers, or recovery phrases.  
**Related audit:** Funding path = PENDING; secured CAD = 0.

---

## Define (fill only public / safe fields)

### Accepted asset / currency

| Field | Value | Owner |
| --- | --- | --- |
| Fiat currency | `CAD` (Spiral plan default) | Kris confirm |
| Crypto asset (if any) | `TBD_HUMAN` e.g. none / USDC / native 0G | Kris |
| Rejected for Spiral runway unless safety review cleared | Unreviewed wallet funding lane | Protocol |

### Receiving account / address (PUBLIC ONLY)

| Channel | Public identifier | Status |
| --- | --- | --- |
| Fiat (bank/e-transfer/display name) | `TBD_HUMAN — do not paste full account # in public git if sensitive; use private vault + hash ref` | **UNSET** |
| EVM address for grant/crypto (if required) | `TBD_HUMAN — 0x… public only` | **UNSET** |
| Governance Safe (not auto-payout dest) | `0x8d088B88219D072aB035502065ee2410c2cb4389` (tracker claim) | Governance only |

### Network

| Use | Network | Status |
| --- | --- | --- |
| 0G grant crypto (if ever) | Aristotle mainnet chainId **16661** | Documented |
| Application storage proof | 0G Storage | Historical |
| Fiat | Off-chain CAD rails | **UNSET process** |

### Ownership verification method

| Method | When |
| --- | --- |
| Fiat | Account ownership via institution (Kris); agent never holds login |
| Crypto | Message sign **only** if Kris authorizes; or Safe policy; or hardware confirm |
| Record | Store **public** address + “verified by Kris on DATE” in private note; optional hash in repo |

### Safety checks (must pass before treating inbound as secured)

1. Source known (grant award letter / payer identity / invoice paid).  
2. Destination matches this spec (no surprise address).  
3. **Tx hash or payment confirmation** recorded.  
4. Balance/available funds visible to Kris.  
5. Then — and only then — update `spiral-return-secured-source-ledger-v1.json` `confirmed_secured_total`.  
6. Crypto inbound: separate safety review if lane was blocked.  

---

## Completion checklist

- [ ] Kris sets accepted currency/assets  
- [ ] Kris sets receiving destination (public-safe)  
- [ ] Kris sets network/rails  
- [ ] Kris records ownership verification method used  
- [ ] Safety checks listed above understood  
- [ ] Spec status → `ACTIVE` (human stamp)

**Until complete: inbound path = NOT FINALIZED (blocker #3).**
