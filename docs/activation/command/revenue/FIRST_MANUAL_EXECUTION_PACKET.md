# FIRST_MANUAL_EXECUTION_PACKET

**Status:** `PREPARED_AWAITING_OPERATOR_SUBMISSION`  
**Scope:** One ICME Labs contact-form submission only. No other target, message, or channel is
authorized by this packet.

## Target and channel

| Field | Value |
| --- | --- |
| Target | ICME Labs |
| Official URL | `https://www.icme.io/#cta-contact` |
| Sender | Kris, Quantum Pi Forge |
| Message reference | `docs/activation/command/revenue/FIRST_DELIVERY_ACTIVATION_PACKAGE.md` |
| Message SHA-256 | `dc8affc24e550a476aa66c157105ae8127c9e422f031550450ff3db4335c0cb9` |
| Bridge receipt | `receipts/outreach/delivery/first-manual-execution-bridge-v1-20260801T025027Z.json` |

## Approved message

```text
Hi ICME team,

PreFlight's public approach to compiling agent policies into cryptographic proofs creates a strong audit trail. Quantum Pi Forge offers a 48-72 hour evidence walkthrough that maps public claims, proof artifacts, and reviewer-visible trust boundaries into a concise diligence brief.

If an independent, evidence-first pass would help with partner or investor conversations, would a 20-minute discovery call be useful? There is no wallet, key, or transaction access involved.
```

Do not change the wording, recipient, offer, claims, or call to action. If the form requires an
additional mandatory subject line or materially different content, stop without submitting and
record the form requirement.

## Operator submission steps

1. Open the official URL in an operator-controlled browser and confirm the domain is `icme.io`.
2. Confirm the page is ICME's contact path and does not request a credential, wallet action,
   payment, signing action, or unrelated sensitive information.
3. Enter **Kris** and **Quantum Pi Forge** only in the ordinary name/company fields, if present.
4. Use Kris's real operator-controlled reply address. Do not record that address in the
   repository, receipt, screenshot, or chat.
5. Paste the approved message exactly once. Do not add a subject or other text unless it is
   already part of the approved message.
6. Review the complete form once, then submit exactly once.
7. Stop immediately if the form changes, rejects the submission, shows a CAPTCHA or rate-limit
   failure, requires unapproved consent, or gives no clear confirmation.

## Evidence capture instructions

Capture only what is necessary to prove the outcome:

| Outcome | Record |
| --- | --- |
| Confirmed submission | UTC timestamp, confirmation text, confirmation/reference ID or resulting URL, and a minimally necessary screenshot or artifact path if available |
| Submission rejected or blocked | UTC timestamp, visible error category, and minimal screenshot/artifact path if available |
| No confirmation | UTC timestamp and `UNCONFIRMED`; do not claim `SENT` |

Before sharing any screenshot or confirmation text, redact the operator reply address and any
unrelated personal data. The evidence record must contain the message hash and artifact
reference, not the full message or sender address.

## State transition rule

```text
AUTHORIZED -> SENT -> CONFIRMED
```

Advance to `SENT` only from a concrete official form-submission confirmation. Advance to
`CONFIRMED` only after that confirmation is recorded and linked to this packet's message hash.
Record `FAILED` or `UNCONFIRMED` honestly when the outcome lacks confirmation.
