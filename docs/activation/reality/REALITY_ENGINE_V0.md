# Reality Engine v0

**Status:** Operational (read-only)  
**Purpose:** Maintain a continuously verified picture of on-chain and local repo reality. Markdown is the **lowest-trust** source.

## Trust order

1. Live RPC (and Safe RPC views / optional Safe API if configured)
2. Fresh evidence under `docs/activation/reality/state/`
3. Sealed historical receipts
4. Markdown narrative (may only claim what evidence supports)

If docs and evidence disagree → report **DOC_DRIFT** (future claim-map hook). Never silently prefer Markdown.

## Pipeline

```
collect (rpc / safe / git)
        ↓
  state/latest.json + history/<ts>.json
        ↓
  diff vs previous → diffs/latest.json + alerts/
        ↓
  briefs/LATEST.md + briefs/<ts>.md
```

## Commands

```bash
npm run reality:run          # collect + diff + brief
npm run reality:full         # collect + diff + brief + claim-map
npm run reality:collect      # collect only
npm run reality:diff         # diff only (needs prior state)
npm run reality:brief        # brief from latest state + diff
npm run reality:claim-map    # docs vs latest state (DOC_DRIFT report)
```

### Claim-map check

Compares public docs to measured Reality Engine state (nested Safe architecture, thresholds, ownership, dual address sets, nested gas path).  
Outputs: `docs/activation/reality/claim-map/LATEST.md` + `latest.json`.  
Does **not** auto-rewrite docs.

### Watch balances (execution chain)

Configured in `expected/expected-config-v1.json` → `watch_balances` (EOA signers, F69, F50F, Guardian).  
`LOW_GAS` alerts when native balance &lt; `gas_warn_wei` (default 0.001). Nested Safe execution can stall if any hop is dry.

## Expected config

`docs/activation/reality/expected/expected-config-v1.json`

- RPC default: project-configured `https://evmrpc.0g.ai` (chain 16661)
- Override: `RPC_URL` env only when needed
- Safe: `address: null` → collectors emit `NOT_CONFIGURED` (valid reality)
- Dual contract sets A (broadcast) and B (docs/mint) are both tracked until human canon decision (B-01)

## Non-goals (v0)

- Signing, proposing Safe txs, broadcasting
- Auto-rewriting public docs
- Inventing RPC / Safe Transaction Service URLs
- Cloudflare collector (deferred)
- Funding / liquidity execution

## Evidence record shape

Each collector contributes structured JSON with:

| Field | Meaning |
| --- | --- |
| `source` | `rpc` \| `safe_rpc` \| `safe_api` \| `git` |
| `status` | `PASS` \| `FAIL` \| `UNAVAILABLE` \| `NOT_CONFIGURED` \| `DRIFT` |
| `timestamp` | UTC ISO |
| `chainId` / `block` | when applicable |
| `payload` | measured facts |
| `payload_sha256` | hash of canonical payload |

## Living Forge

Optional recurring task: `P3-reality-engine` → `npm run reality:run`  
Still read-only; no human escalation unless alerts are critical (owner/threshold change when Safe is configured).
