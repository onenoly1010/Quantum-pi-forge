# QPF AI Birth, Identity & Verification

**Status:** Client #1 of the birth protocol (2026-09-15)  
**UI:** `/birth.html` on **Cloudflare Pages** (`quantumpiforge.com`)  
**Core:** `qpf-core/birth.mjs`  
**Functions:** Cloudflare Pages Functions (`/birth/*`, `/ai/session`) — **not** `/api/*`

```text
PUBLIC RUNTIME = Cloudflare Pages
NOT Vercel          (billing blocked; do not target)
NOT Railway /api/*  (misconfigured proxy; birth must not live there)
NOT Render / Supabase as the public door
```

Local: `npx wrangler pages dev` against this repo. **Not** `vercel dev`.

```text
CREATE → VERIFY → MEET
WATCH YOUR AI COME TO LIFE.
```

The website is Client #1. The protocol does not live in the animation.

## QPF pays attestation (person never sees a wallet)

```text
PERSON → Passkey → CREATE AI → QPF attests → 0G 16661 → VERIFIED or honest MAINNET_FAILED
```

The person does **not** create, fund, or hold an attestor wallet. They never see private keys, gas, RPC, or Cloudflare secrets.

Someone still signs the 16661 data-tx: **QPF infrastructure** (`BIRTH_ATTESTOR_KEY` on Cloudflare Pages Functions). That is a narrowly scoped service signer (zero-value hash commit to `0x…dEaD`). Not user custody. Not economic authority.

0G Aristotle has **no** official native paymaster/gasless path we can use without new contracts. Existing `Heartbeat.registerBirth` requires an OINIO NFT — not used.

Operator (once, not the visitor): fund the QPF attestor on 16661 and set the Pages secret. Until then the product stays honest: identity created, mainnet not complete, no fabricated hash.

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

See `qpf-core/birth.mjs` `STATES`. Recovery is `POST /birth/status` with the record. HTTP 200 is not success.
