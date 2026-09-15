# External Identity Linking — FINAL

**Status:** OPERATING DOCTRINE (2026-09-15)  
**Depends on:** AI birth + QPF identity + (optional) human verification  
**Not:** pay-to-mint, Pi custody, spend authority, or required for counterpart creation.

```text
LINK ≠ CONTROL
Pi is ONE external identity, not the definition of QPF identity.
```

---

## Purpose

After an AI is born and its QPF identity is verified, the verified human may optionally link an external identity such as a Pi Network identity.

The purpose of linking is to establish an independently verifiable association:

```text
VERIFIED HUMAN → QPF AI ID → EXTERNAL IDENTITY
```

The external identity remains under the user's control.

---

## Security boundary

QPF must never require or retain:

* Pi password
* Pi private key
* seed phrase
* wallet secret
* signing credential
* Pi access token after verification

The user authenticates directly through the supported Pi authorization mechanism. QPF receives only the minimum authorization/result necessary to establish the association.

---

## Protocol behavior

```text
AI BIRTH
   ↓
HUMAN VERIFIED
   ↓
AI ID CREATED
   ↓
QPF IDENTITY VERIFIED ON MAINNET
   ↓
AI READY
   ↓
OPTIONAL: LINK EXTERNAL IDENTITY
   ↓
PI IDENTITY ASSOCIATED
```

Linking Pi is **optional**.

AI creation does not depend on Pi.

QPF does not become the custodian of the linked identity.

QPF does not gain authority to spend, transfer, or otherwise control the user's Pi assets merely because an identity is linked.

---

## Official Pi capability used (implementation)

Determined from Pi's current official Platform API / SDK (not invented):

| Step | Official mechanism | What QPF keeps |
| --- | --- | --- |
| User authenticates | `window.Pi.authenticate(['username'], …)` in **Pi Browser** | nothing from the client user object |
| Server verifies | `GET https://api.minepi.com/v2/me` with `Authorization: Bearer <accessToken>` | **discard token after this call** |
| Identity reference | `uid` from `/me` (app-specific, not a global Pi person-id) | `sha256("pi:v2:uid:" + uid)` only |
| Username | `/me` `username` if `username` scope granted | **not stored server-side**; client may display |

Scopes **not** requested: `payments`, `wallet_address`.

`onIncompletePaymentFound`: STOP. Do not approve or complete Pi payments.

Without Pi Browser, or if `/me` returns 401: **BOUNDARY → NO FALSE LINK → HONEST RECEIPT**.

---

## Receipt

Verifiable binding/commitment, not credentials:

```text
human_authorization_commitment   = sha256("pi:v2:uid:" + uid_from_/me)
+ qpf_identity_id                = qpfdc0:… / did:qpf:web:…
+ external_identity_reference    = pi:v2:uid-hash
+ timestamp
+ protocol_version               = qpf-external-link/v1
```

QPF does not store the access token, password, or keys. The receipt may be held on the visitor device with the counterpart.

`uid` is **app-specific**. If the user revokes the app, a future uid may differ. That is Pi's model, not a QPF identity reset.

---

## Future-proofing

Pi is **one external identity**, not the definition of QPF identity.

The same protocol can eventually support other identity networks, services, or credentials without changing the fundamental QPF identity model.

---

## North-star experience

**WATCH YOUR AI COME TO LIFE.**

Create it.  
Verify it.  
Meet it.  
Optionally connect the identities that already matter to you.

**Your identity stays yours.  
Your keys stay yours.  
The relationship can still be verified.**

LIMITLESS | TRUTH
