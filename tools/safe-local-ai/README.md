# QPF Safe Local AI (read-only)

Local tools for inspecting Quantum Pi Forge Safe smart accounts on **0G Aristotle** (`chainId 16661`) without putting keys or seed phrases into an AI context.

## Policy (hard)

| Action | Allowed |
| --- | --- |
| Read threshold / owners / nonce / guard / modules | Yes |
| Use public or private RPC | Yes |
| Sign transactions | **No** |
| Load private keys / mnemonics | **No** |
| Broadcast | **No** |

## Install

```bash
cd ~/Quantum-pi-forge/tools/safe-local-ai
npm install
```

## Run diagnostics

```bash
# Human-readable report + hygiene grade
npm run inspect

# Hygiene summary only (exit 2 if any WEAK Safe)
npm run hygiene

# Machine-readable
node inspect-safe.mjs --json

# Foundry cast only (no Node deps beyond foundry)
npm run inspect:cast
# or
bash inspect-safe-cast.sh
```

### Environment overrides

| Variable | Default | Purpose |
| --- | --- | --- |
| `RPC_URL` | `https://evmrpc.0g.ai` | Trusted RPC |
| `CHAIN_ID` | `16661` | Aristotle |
| `SAFE_ADDRESS` | all in `safes.config.json` | Single Safe |
| `MIN_SECURE_THRESHOLD` | `2` | WEAK if below |
| `SAFE_USE_API_KIT` | unset | Set `1` to try pending queue via Safe Transaction Service |
| `SAFE_USE_PROTOCOL_KIT` | unset | Set `1` for Protocol Kit double-check |

**Note:** Safe Transaction Service often has **no** indexer for chain `16661`. Pending queues may only be visible in the Safe UI; on-chain threshold/owners always work via RPC.

## Configured Safes

See `safes.config.json`:

- `0x8d088…4389` — guardian control plane (target: keep ≥2, currently 3/4)
- `0xf50F…dBd1` — operator Safe (harden if 1/n)
- `0xF69b…08DE` — Trezor-path Safe (harden if 1/1)

## Local AI (Ollama / Cline / Continue)

1. Open the `Quantum-pi-forge` workspace (or this folder) in the IDE.
2. Point the assistant at local Ollama, e.g. `http://localhost:11434`.
3. Instruct the assistant:

```text
Run read-only Safe hygiene only:
  cd tools/safe-local-ai && npm run hygiene
Do not request private keys, seeds, or broadcast transactions.
If any Safe is WEAK (threshold < 2), recommend raising threshold in Safe UI
before signing pending transfers.
```

4. Prefer terminal commands (`npm run inspect`, `cast call …`) over pasting dashboard screenshots that may include extra account metadata.

## Repo root aliases

From `~/Quantum-pi-forge`:

```bash
npm run safe:inspect        # full diagnostic
npm run safe:hygiene        # grades; exit 2 if WEAK
npm run safe:inspect:cast   # cast-only (no Node deps in this package)
```

## Threshold hardening (human UI)

Step-by-step Safe UI walkthrough for 1/1 and 1/2 → ≥2:

- [`SAFE_THRESHOLD_HARDENING_UI_WALKTHROUGH_V1.md`](./SAFE_THRESHOLD_HARDENING_UI_WALKTHROUGH_V1.md)

## Relation to `gate:validate`

Repo root dry-run gates:

```bash
cd ~/Quantum-pi-forge
NODE_ENV=development DRY_RUN=true npm run gate:validate
```

This toolkit is **wallet posture / Safe hygiene**. `gate:validate` is **repo hermetic verification**. Run both; they do not replace each other.
