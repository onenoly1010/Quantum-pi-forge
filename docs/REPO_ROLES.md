# Quantum Pi Forge — Repository Roles

Status: CANONICAL_ROLE_MAP  
Audience: Contributors, auditors, grant reviewers, partners  
Related: [docs/ops/HOSTING_CLOUDFLARE_ONLY_V1.md](ops/HOSTING_CLOUDFLARE_ONLY_V1.md) (after merge of hosting ops note)

## Purpose

Define what each public sibling repository **owns**, so reviewers do not reverse-engineer the constellation.  
**One production surface. One governance/evidence hub. Archives and satellites stay labeled.**

## Production surface

| Role | URL / host | Owning repo |
|------|------------|-------------|
| Public product site | https://quantumpiforge.com (Cloudflare Pages) | **This repo:** `onenoly1010/Quantum-pi-forge` |
| Deploy path | `npm run build` → `out/` · `npm run deploy:cf` | **Quantum-pi-forge** |

Vercel is **not required** for production. Historical `*.vercel.app` links are archives only.

---

## Core repositories

### 1. `onenoly1010/Quantum-pi-forge` — **CANON / HUB**

| Dimension | Ownership |
|-----------|-----------|
| **Status** | ACTIVE — production canon |
| **Owns** | Governance gates & receipts, Foundry contracts, evidence/valuation lanes, primary static site (`deploy/`, `out/`), Cloudflare Pages deploy, public mint policy posture |
| **Does not own** | Long-term home for Next-only UI experiments (prefer `quantum-pi-forge-fixed` for pure frontend) |
| **Homepage** | https://quantumpiforge.com |
| **Merge bar** | PR to `main`; required checks; no financial activation without explicit human gates (Phase 39 public mint remains **NO-GO** unless superseded by a later sealed receipt) |

**Default for:** contracts, security review, audit engagement package, valuation/outreach docs, production deploy.

---

### 2. `onenoly1010/quantum-pi-forge-fixed` — **PRODUCTION FRONTEND (UI)**

| Dimension | Ownership |
|-----------|-----------|
| **Status** | ACTIVE — frontend / UI lane |
| **Owns** | Next.js (and related) UI, frontend-oriented scripts, GH Pages optional static `out/` |
| **Does not own** | Governance receipt truth, Foundry canon, Cloudflare production site |
| **Package name** | `quantum-pi-forge-fixed` (not `quantum-pi-forge-ignited`) |
| **API defaults** | Local/dev or env override — **not** archived genesis Render/Railway |
| **Homepage** | https://quantumpiforge.com (product link; not a second production host of record) |
| **Vercel** | Not required; static build writes `out/` |

**Default for:** UI work that does not change chain governance or evidence canon.

---

### 3. `onenoly1010/pi-forge-quantum-genesis` — **ARCHIVE**

| Dimension | Ownership |
|-----------|-----------|
| **Status** | ARCHIVED — historical genesis compendium (GitHub **archived** flag set 2026-07-30) |
| **Owns** | Historical narrative, old multi-app layout, past demos |
| **Does not own** | New features, production deploy, live API, financial activation |
| **Homepage** | Points at quantumpiforge.com for discoverability; code is archive |
| **Operator rule** | Dependabot / hygiene only; **do not** treat Render/Vercel genesis URLs as live defaults |

**Default for:** archaeology and citation of past work only.

---

### 4. `onenoly1010/oinio-soul-system` — **SUPPORT / TEMPLATE**

| Dimension | Ownership |
|-----------|-----------|
| **Status** | SUPPORTING — local soul oracle / philosophical template |
| **Owns** | Offline CLI soul oracle (local encryption, deterministic readings) |
| **Does not own** | Chain governance, mint gates, production site, multi-agent runtime |
| **Related** | `oinio-soul-sdk`, `oinio-soul-worker` — separate packages; do not confuse with this repo |

**Default for:** local/private soul tooling demos — not production infrastructure.

---

## Satellite repositories (support)

| Repo | Role | Notes |
|------|------|--------|
| `quantum-pi-forge-site` | Static / historical site | Homepage → quantumpiforge.com; not production of record |
| `quantum-pi-forge-ignited` | Historical / demo instance | Not package name for fixed frontend; homepage → quantumpiforge.com |
| `Ai-forge-` | Pi Network ethical AI app builder | Ecosystem adjacent; not QPF chain canon |
| `AI_GIT_REPO` | Private / token access | Out of public activation path |
| `oinio-soul-sdk` / `oinio-soul-worker` | Soul protocol / Cloudflare worker | Support; not governance hub |

Satellites may be archived, redirected, or left as demos. They must not silently claim “production canon.”

---

## Decision tree (where to open a PR)

```text
Changing governance, contracts, evidence, valuation, public site, Cloudflare deploy?
  → Quantum-pi-forge (canon)

Changing Next/UI-only frontend behavior?
  → quantum-pi-forge-fixed

Historical citation only?
  → pi-forge-quantum-genesis (read-only preference)

Local soul oracle CLI?
  → oinio-soul-system

Unsure?
  → Open discussion on Quantum-pi-forge; do not invent a fifth “main”
```

---

## Explicit non-roles (all repos)

Unless a **later sealed human gate** says otherwise:

- No public mint opening  
- No liquidity / staking / bridge activation from “activation” cleanup  
- No wallet signing or private-key handling in CI  
- No automated grant/partner send without human authorization  

---

## Related sealed lanes (on Quantum-pi-forge)

- Valuation / FMV evidence and outreach packages under `docs/valuation/`  
- Phase 39 public mint **NO-GO** closure (see governance receipts)  
- Independent audit engagement package under `docs/valuation/`  
- Hosting policy: Cloudflare only (ops note)

---

## Change control

Updates to this map should be PRs on **Quantum-pi-forge** only.  
When a repo is archived or promoted, update this file in the same PR series that changes GitHub settings or README banners.
