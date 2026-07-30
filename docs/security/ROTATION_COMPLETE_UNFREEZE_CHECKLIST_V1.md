# Rotation complete — unfreeze checklist v1

**Purpose:** Official go/no-go before Slot A/B/C private outreach.  
**Status:** **SATISFIED 2026-07-30** (7/7 alerts revoked; QPF Evidence Audit green).  
**Paste location:** PR comment, share log, or ops note after all boxes are true.

## Strict go/no-go gate

Before any **private** outreach, confirm **all** are true:

| # | Gate | ☐ |
|---:|---|---|
| 1 | Old keys **revoked** at each provider (GitHub PAT, OpenAI×2, Supabase, xAI, DeepSeek; Vercel already revoked if unused) | ☑ |
| 2 | New keys set only where still needed (password manager + GH Actions secrets — **never** chat/commits) | ☑ (human-confirmed) |
| 3 | All 7 secret-scanning alerts on `quantum-pi-forge-fixed` resolved as **Revoked** | ☑ (API: open=0) |
| 4 | At least one fresh Actions run on `Quantum-pi-forge` and/or `quantum-pi-forge-fixed` **passes** after secret updates (Cloudflare deploy path if token rotated) | ☑ (Evidence Audit success on main) |
| 5 | Local copies of leaked files deleted/emptied (Downloads, Desktop, old USB backups) | ☑ (human-confirmed) |
| 6 | Guild formal application remains **parked** (applications closed) — not required for Phase 8.5 | ☑ |

If **any** box is false → **no Slot A/B/C send**.

## Paste-ready comment (after all true)

```text
## Rotation complete — outreach unfreeze (YYYY-MM-DD)

Strict go/no-go (all true):
- [x] Old keys revoked at providers (7 leak classes)
- [x] New secrets set only in secure store / Actions (names only in docs)
- [x] quantum-pi-forge-fixed secret-scanning alerts 1–7: Resolved (revoked)
- [x] Fresh Actions run green after updates: <link to run>
- [x] Local leaked file copies cleaned

Unfreeze:
- Slot A/B/C private outreach may proceed using `docs/community/ROUND1_REVIEWER_SHARE_PACKET_V1.md`
- Formal Guild application remains PARKED until guild.0gfoundation.ai reopens
- Mint / liquidity / staking / bridge remain NOT AUTHORIZED

Worksheet: docs/security/SECRET_ROTATION_WORKSHEET_V1.md
```

## After unfreeze

1. Update `docs/community/ROUND1_SHARE_LOG_V1.md` — clear `BLOCKED_SECRET_ROTATION` on slots A/B/C  
2. Update `docs/valuation/outreach/OUTREACH_SEND_TRACKER_V1.md` → READY_TO_SEND  
3. Human paste Slot A first (independent peer)

## Safety

No secret values in this file. No wallet, mint, liquidity, staking, or bridge.