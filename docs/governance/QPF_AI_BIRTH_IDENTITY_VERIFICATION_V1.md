# QPF AI Birth, Identity & Verification

**Status:** Client #1 of the birth protocol (2026-09-15)  
**UI:** `/birth.html`  
**Core:** `qpf-core/birth.js`

```text
CREATE → VERIFY → MEET
WATCH YOUR AI COME TO LIFE.
```

The website is Client #1. The protocol does not live in the animation.

## Honest mainnet boundary

Docs DEPLOYMENT_SET on 16661 has **no birth-attestation method**.  
`HeartbeatMonitor.registerBirth(modelId)` requires an OINIO NFT owner — **not used** (would import rejected stake-to-register economics).  
**No new contract was deployed** to make the demo work.

Attestation, if `BIRTH_ATTESTOR_KEY` is set, is a **zero-value data transaction** of `birth_manifest_hash` on chain 16661. That hash is a real tx, not a fabricated one.

If the key is absent:

```text
MAINNET_FAILED
Identity created. Mainnet verification did not complete. No fabricated hash.
```

UI must show that. Never ✓ VERIFIED without a confirmed tx receipt.

## Boundaries (frozen)

```text
economic_authority    = false
autonomous_execution  = false
network_authority     = false
```

LINK ≠ CONTROL. Pi remains optional after birth.

## State machine

See `qpf-core/birth.js` `STATES`. Recovery is `POST /birth/status` with the record. HTTP 200 is not success.
