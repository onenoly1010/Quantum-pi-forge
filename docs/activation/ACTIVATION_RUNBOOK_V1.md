# Activation Runbook v1 — Edge infrastructure

**Scope:** Cloudflare Pages edge deploy only (headers, static build, 0G RPC config gates).  
**Not in scope:** Wallet signing, Safe execution, mint, liquidity, Spiral travel, fund movement.

| Artifact | Path |
| --- | --- |
| This runbook | `docs/activation/ACTIVATION_RUNBOOK_V1.md` |
| Preflight | `scripts/activation-preflight.mjs` |
| npm entry | `npm run activation:preflight` |
| Headers source | `deploy/_headers` |
| Build | `scripts/build.js` → `out/` |
| Pages output | `out/` (`wrangler.toml` → `pages_build_output_dir`) |

**Network (project-configured, do not invent):**

| Item | Value |
| --- | --- |
| Chain | 0G Aristotle |
| Chain ID | **16661** |
| RPC | `https://evmrpc.0g.ai` |
| Explorer | `https://chainscan.0g.ai` |

**Script never signs.** Preflight is a local readiness gate only.

---

## When to use this runbook

Use before:

1. Deploying static site changes to Cloudflare Pages  
2. Opening a PR that changes `deploy/_headers`, `scripts/build.js`, or public static assets  
3. Rebasing/merging `fix/site-and-rpc-cleanup` (or similar) onto `main`

Do **not** use this runbook for Guardian Safe transactions or economic activation.

---

## Linear sequence

### 1. Confirm branch intent

Work edge/site/RPC cleanup on an isolated branch (Path 2 example: `fix/site-and-rpc-cleanup`).  
Keep commits atomic (headers/build ≠ runbook/preflight ≠ brand ≠ Living Forge noise).

### 2. Author or verify edge headers

Source of truth:

```text
deploy/_headers
```

Must include at minimum:

- Global security: CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`  
- `/metadata/*` JSON + CORS rules  
- CSP `connect-src` allowing project RPC host `evmrpc.0g.ai` (no invented RPC hosts)

### 3. Build locally

```bash
npm run build
```

Expect:

- `out/_headers` present and non-empty  
- `out/metadata/` present  
- Build fails if headers are empty or missing required directives (`assertHeadersPresent` in `scripts/build.js`)

### 4. Run edge preflight

```bash
npm run activation:preflight
```

| Result | Exit | Meaning |
| --- | ---: | --- |
| `EDGE_READY` | 0 | Headers + RPC format (+ live chain ID) OK |
| `NOT_READY` | 2 | Fix listed ✗ items; do not deploy |
| Error | 1 | Script fault |

Options:

```bash
npm run activation:preflight -- --skip-live-rpc   # format-only; no network
npm run activation:preflight -- --require-build   # fail if out/ missing (no auto-build)
```

#### What preflight checks

| Check | Intent |
| --- | --- |
| `deploy/_headers` exists and is non-empty | Source of truth present |
| `out/_headers` exists after build | Edge artifact present |
| Required header tokens | CSP, nosniff, frame, HSTS, `/metadata/*` |
| CSP includes `evmrpc.0g.ai` | 0G RPC allowed in browser connect-src |
| `metadata/` → `out/metadata/` | Public JSON metadata shipped |
| RPC URL from local project config | No invented endpoints |
| RPC URL format | `https://` + known 0G host |
| Chain ID pins (wrangler / env example) | Aristotle **16661** when present |
| Live `eth_chainId` (default on) | Configured RPC reports **16661** |

RPC discovery order (read-only): `RPC_URL` / `ZERO_G_RPC_URL` env → `contracts/DEPLOYED_ADDRESSES.md` → `.env.launch.example` → headers CSP → project default `https://evmrpc.0g.ai`.

### 5. Deploy edge (only if EDGE_READY)

Local Pages deploy (if authorized and credentials present):

```bash
npm run deploy:cf
```

Or merge to `main` and rely on the repository’s Cloudflare Pages workflow.

**Human must confirm** production deploy credentials and environment. Preflight does not deploy.

### 6. Rebase / merge hygiene (chronological history)

Before pushing a cleanup branch that is behind `main`:

```bash
# Working tree clean or intentionally committed
git fetch origin
git rebase origin/main
# resolve conflicts if any
npm run build
npm run activation:preflight
git push --force-with-lease   # only if rebase rewrote unpublished commits
```

Prefer **rebase** over merge commits for this line of work.

Open PR → wait for CI (note: high-severity npm audit may already fail on `main`) → merge when policy allows.

### 7. Post-merge smoke (optional)

```bash
# After Pages deploy propagates
curl -sI https://<your-pages-host>/ | tr -d '\r' | grep -iE 'content-security-policy|x-frame-options|strict-transport'
curl -sI https://<your-pages-host>/metadata/qpf-public-mint-model-v1.json | tr -d '\r' | head -20
```

Replace host with the live Pages URL. Do not invent hosts.

---

## Abort conditions

Stop and do **not** deploy or merge if:

- Preflight returns `NOT_READY`  
- `out/_headers` missing or empty after build  
- Live chain ID ≠ 16661 on the project RPC  
- Unrelated secrets or wallet prompts appear in the deploy path  

On abort: fix facts, re-run preflight, record nothing as “activated.”

---

## Explicit non-goals

- Wallet `registerModel` / mint / stake / liquidity  
- Guardian Safe nested execution  
- Spiral Return physical logistics  
- Treating chat assumptions as truth without a fresh preflight run  
- Inventing RPC URLs or chain IDs  

For on-chain contract preflight with a caller wallet, use a separate, explicitly named tool when authorized — not this edge gate.

---

## Related commits / artifacts

| Topic | Location |
| --- | --- |
| Edge headers + build gate | `deploy/_headers`, `scripts/build.js` (atomic commit on cleanup branch) |
| Reality Engine (chain truth) | `docs/activation/reality/`, `npm run reality:run` (on `main`) |
| Brand assets | `brand/` (Phase 1; site wiring Phase 2) |

---

## Checklist (copy for PR description)

- [ ] `npm run build` succeeds  
- [ ] `npm run activation:preflight` → `EDGE_READY`  
- [ ] No heartbeats/cache in commit  
- [ ] Rebased onto `origin/main` (linear history)  
- [ ] PR description notes edge-only scope  
