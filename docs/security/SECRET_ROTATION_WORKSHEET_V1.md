# Secret rotation worksheet v1 — DO THIS BEFORE OUTREACH

**Status:** ROTATION COMPLETE — OUTREACH UNFROZEN (2026-07-30)  
**Opened:** 2026-07-30  
**Closed:** 2026-07-30  
**Source:** GitHub secret scanning on `onenoly1010/quantum-pi-forge-fixed` (7 alerts at open, all `publicly_leaked: true`)  
**Outreach freeze:** **Lifted** — all 7 alerts resolved as **revoked**; Slot A/B/C READY_TO_SEND.

```text
RULE: Mark GitHub alert “Revoked” ONLY after:
  1) new key generated at provider
  2) all dependent secrets updated
  3) a successful workflow (or API smoke) with the NEW key
```

**Never paste raw keys into issues, chat, commits, or this worksheet.**  
Track only: ☐ checkboxes + last-4 chars optional (e.g. `…a3f2`).

---

## Why this is urgent

| # | Alert type | Public leak path (history) | Still on HEAD? |
|---:|---|---|---|
| 1 | **xAI API Key** | `.env.local` L5 @ `19409b6b…` | No (history only) |
| 2 | **OpenAI API Key** | `updatedsecets.env` L131, `.env.launch` L131 @ `70187218…` | No |
| 3 | **OpenAI API Key** (2nd) | `.env.launch` L128 @ `6c707c7b…` | No |
| 4 | **Supabase Secret Key** | `supabase.txt`, `_pi-forge-backend*.env`, `.env.launch` L138 | No |
| 5 | **GitHub PAT** | `.env.launch` L175 @ `6c707c7b…` | No |
| 6 | **DeepSeek API Key** | `deepseek_key_check.py` L12 @ `33766925…` | No |
| 7 | **Vercel API Key** | `updatedsecets.env` L116, `.env.launch` L116 | No |

Dashboard: https://github.com/onenoly1010/quantum-pi-forge-fixed/security/secret-scanning

History alone is enough for abuse. **Rotation is mandatory even though files are gone from current tree.**

---

## Core repos to update secrets in

From `docs/REPO_ROLES.md`:

| # | Repo | Role | Actions secrets UI |
|---:|---|---|---|
| 1 | `onenoly1010/Quantum-pi-forge` | Canon / hub | https://github.com/onenoly1010/Quantum-pi-forge/settings/secrets/actions |
| 2 | `onenoly1010/quantum-pi-forge-fixed` | Production frontend | https://github.com/onenoly1010/quantum-pi-forge-fixed/settings/secrets/actions |
| 3 | `onenoly1010/pi-forge-quantum-genesis` | Archive | https://github.com/onenoly1010/pi-forge-quantum-genesis/settings/secrets/actions |
| 4 | `onenoly1010/oinio-soul-system` | Support / template | https://github.com/onenoly1010/oinio-soul-system/settings/secrets/actions |

Also check (if any secret ever copied):  
`oinio-soul-sdk`, `oinio-soul-worker`, `quantum-pi-forge-site`, `quantum-pi-forge-ignited`, Cloudflare/Wrangler local, Railway, Vercel project env, Supabase dashboard, local `~/.env*` files.

**Org secrets UI** (if org exists / you have admin):  
https://github.com/organizations/onenoly1010/settings/secrets/actions  
*(Current CLI token lacks `admin:org`; use browser if org-level secrets exist.)*

**Current known GH Actions secrets (names only, Quantum-pi-forge):**  
`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `DISCORD_WEBHOOK_URL`  
*(fixed repo currently lists **no** Actions secrets via API — still rotate provider keys that were in git history.)*

---

## One-pass checklist (7 rows)

### Row 1 — GitHub Personal Access Token (alert #5)

| Step | Action | ☐ |
|---|---|---|
| 1a | Open https://github.com/settings/tokens (classic) **and** https://github.com/settings/personal-access-tokens | ☐ |
| 1b | **Revoke** any PAT that may match the leak (created before 2026-03-19 or unknown) | ☐ |
| 1c | Create **new** fine-grained or classic PAT with **minimum** scopes (`repo`, `workflow` only if required) | ☐ |
| 1d | Store only in password manager / GH Actions secret — **never** commit | ☐ |
| 1e | Update local: `gh auth login` **or** `~/.git-credentials` / env `GH_TOKEN` if used | ☐ |
| 1f | Validate: `gh api user` succeeds with new token | ☐ |
| 1g | Alert #5 → resolution **Revoked** + comment “rotated 2026-07-30” | ☐ |

**Suggested secret name (if stored in Actions):** `GH_PAT` or use OAuth app / GitHub App instead of long-lived PAT.

---

### Row 2 — Vercel API Key (alert #7)

| Step | Action | ☐ |
|---|---|---|
| 2a | Open https://vercel.com/account/tokens | ☐ |
| 2b | **Delete/revoke** old tokens | ☐ |
| 2c | Create new token (scope: only needed projects) | ☐ |
| 2d | Update Vercel project env + GH secret `VERCEL_TOKEN` (or `VERCEL_API_TOKEN`) on any repo that uses `vercelcheck.yml` | ☐ |
| 2e | Validate: `vercel whoami` **or** Actions “Vercel Deployment Status Check” green | ☐ |
| 2f | Alert #7 → **Revoked** | ☐ |

**Note:** Production site is **Cloudflare Pages** (`quantumpiforge.com`). Vercel token may be legacy — still revoke.

---

### Row 3 — Supabase Secret Key (alert #4)

| Step | Action | ☐ |
|---|---|---|
| 3a | Open Supabase project → **Settings → API** | ☐ |
| 3b | **Rotate** `service_role` secret (and review `anon` if it was ever treated as secret) | ☐ |
| 3c | Update all envs: `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_SECRET_KEY` in Actions + local | ☐ |
| 3d | Validate: one read-only API call with new key | ☐ |
| 3e | Alert #4 → **Revoked** | ☐ |

---

### Row 4 — OpenAI API Key #1 (alert #2)

| Step | Action | ☐ |
|---|---|---|
| 4a | Open https://platform.openai.com/api-keys | ☐ |
| 4b | **Revoke** compromised key(s) | ☐ |
| 4c | Create new key; name it `qpf-rotated-2026-07-30-a` | ☐ |
| 4d | Update `OPENAI_API_KEY` everywhere it was used | ☐ |
| 4e | Validate: minimal models list API call | ☐ |
| 4f | Alert #2 → **Revoked** | ☐ |

---

### Row 5 — OpenAI API Key #2 (alert #3)

| Step | Action | ☐ |
|---|---|---|
| 5a | Same dashboard — identify **second** distinct leaked key | ☐ |
| 5b | **Revoke** it | ☐ |
| 5c | Create replacement `qpf-rotated-2026-07-30-b` only if still needed | ☐ |
| 5d | Prefer **one** active key per env; delete unused | ☐ |
| 5e | Alert #3 → **Revoked** | ☐ |

---

### Row 6 — xAI API Key (alert #1)

| Step | Action | ☐ |
|---|---|---|
| 6a | Open https://console.x.ai/ (API keys) | ☐ |
| 6b | **Revoke** leaked key | ☐ |
| 6c | Create new `XAI_API_KEY` | ☐ |
| 6d | Update Actions / local / Grok tooling env | ☐ |
| 6e | Validate: one chat/completions smoke (or console “test”) | ☐ |
| 6f | Alert #1 → **Revoked** | ☐ |

---

### Row 7 — DeepSeek API Key (alert #6)

| Step | Action | ☐ |
|---|---|---|
| 7a | Open DeepSeek platform API keys | ☐ |
| 7b | **Revoke** leaked key | ☐ |
| 7c | Create new `DEEPSEEK_API_KEY` | ☐ |
| 7d | Update envs; remove any test scripts that hardcode keys | ☐ |
| 7e | Validate: minimal completion call | ☐ |
| 7f | Alert #6 → **Revoked** | ☐ |

---

## After all 7 rows

| Step | Action | ☐ |
|---|---|---|
| A | Grep local home for old patterns **without** committing results: `.env`, `updatedsecets`, `supabase.txt` under Desktop/Downloads | ☐ |
| B | Delete or empty local files that still hold old values | ☐ |
| C | Confirm `quantum-pi-forge-fixed` HEAD has **no** secret files (already true as of 2026-07-30) | ☐ |
| D | Run CI on `quantum-pi-forge-fixed` main: https://github.com/onenoly1010/quantum-pi-forge-fixed/actions | ☐ |
| E | Run CI on `Quantum-pi-forge` main (Cloudflare token is separate — rotate if ever exposed) | ☐ |
| F | **Optional hard clean:** history rewrite / BFG on `quantum-pi-forge-fixed` to purge `.env.launch` blobs (coordinate; requires force-push + collaborator notice) | ☐ |
| G | Only then: resume Slot A/B/C outreach | ☐ |

---

## Suggested GH secret name map (set after rotation)

| Provider | Env / secret name | Repos that may need it |
|---|---|---|
| GitHub | Prefer OIDC / `GITHUB_TOKEN`; avoid long-lived PAT | — |
| Vercel | `VERCEL_TOKEN` | `quantum-pi-forge-fixed` (vercelcheck) |
| Supabase | `SUPABASE_SERVICE_ROLE_KEY` | any backend using Supabase |
| OpenAI | `OPENAI_API_KEY` | tooling only if required |
| xAI | `XAI_API_KEY` | local Grok / agents |
| DeepSeek | `DEEPSEEK_API_KEY` | optional |
| Cloudflare (existing) | `CLOUDFLARE_API_TOKEN` | **Quantum-pi-forge** (Pages deploy — rotate if unknown age) |

Set via browser UI or:

```bash
# Example only — paste when prompted; do not put value in shell history if avoidable
gh secret set OPENAI_API_KEY -R onenoly1010/Quantum-pi-forge
gh secret set OPENAI_API_KEY -R onenoly1010/quantum-pi-forge-fixed
```

---

## Agent capabilities / limits (this incident)

| Can do without you | Needs you (browser / password manager) |
|---|---|
| Inventory alerts + leak paths | Generate/revoke keys at OpenAI, xAI, DeepSeek, Vercel, Supabase |
| Write this worksheet + track status | Click **Revoked** on each secret-scanning alert |
| List current Actions secret **names** | Paste new secret **values** into GH UI or `gh secret set` |
| Confirm files gone from HEAD | History purge decision |
| Freeze outreach in docs | Send Slot A/B/C after green |

---

## Status tracker (fill during rotation)

**Live alert poll (GitHub API, 2026-07-30 final):**  
Dashboard: https://github.com/onenoly1010/quantum-pi-forge-fixed/security/secret-scanning  
**Open alerts: 0 · Resolved (revoked): 7**

| Alert # | Type | GitHub state (resolution) | resolved_at (UTC) |
|---:|---|---|---|
| 7 | vercel_api_key | **resolved (revoked)** | 2026-07-30T16:17:54Z |
| 6 | deepseek_api_key | **resolved (revoked)** | 2026-07-30T16:54:39Z |
| 5 | github_personal_access_token | **resolved (revoked)** | 2026-07-30T16:54:14Z |
| 4 | supabase_secret_key | **resolved (revoked)** | 2026-07-30T16:55:11Z |
| 3 | openai_api_key | **resolved (revoked)** | 2026-07-30T16:55:39Z |
| 2 | openai_api_key | **resolved (revoked)** | 2026-07-30T16:56:11Z |
| 1 | xai_api_key | **resolved (revoked)** | 2026-07-30T16:56:35Z |

| Row | Provider | Rotated | Secrets updated | Validated | Alert closed as Revoked |
|---:|---|:---:|:---:|:---:|:---:|
| 1 | GitHub PAT | ☑ | ☑ | ☑ | **☑ #5** |
| 2 | Vercel | ☑ | ☑ N/A CF-only | ☑ | **☑ #7** |
| 3 | Supabase | ☑ | ☑ | ☑ | **☑ #4** |
| 4 | OpenAI #1 | ☑ | ☑ | ☑ | **☑ #2** |
| 5 | OpenAI #2 | ☑ | ☑ | ☑ | **☑ #3** |
| 6 | xAI | ☑ | ☑ | ☑ | **☑ #1** |
| 7 | DeepSeek | ☑ | ☑ | ☑ | **☑ #6** |

**Progress:** **7 / 7** alerts resolved as **revoked**.  

**CI gate:** QPF main Evidence and Dependency Audit **success** after rotation window (e.g. https://github.com/onenoly1010/Quantum-pi-forge/actions/runs/30566866400).  

**HEAD check (fixed):** leak source files remain **absent** from current tree.  

**Outreach unlock:** **YES** — Slot A/B/C unfrozen. Formal Guild application remains **PARKED** (applications closed). See `docs/security/ROTATION_COMPLETE_UNFREEZE_CHECKLIST_V1.md`.

---

## Explicit non-goals

- Do **not** re-commit env dumps “for backup”
- Do **not** share new keys in Gmail body / chat
- Do **not** mark alerts Revoked while old keys still work
- Do **not** re-open freeze without a new incident; Slot A/B/C may proceed after this completion record

---

*Worksheet only — no secret values stored here.*
