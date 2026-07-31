# Public Surface Deployment Audit v1

**Mode:** Hygiene inventory — not an unlock  
**As of (UTC):** 2026-07-31  
**Method:** live HTTP probes + `wrangler pages project list` / `deployment list` + in-repo URL scan  
**Boundary:** `NO_WALLET_TOUCH=true` (audit only; no production deletes executed)

**Canonical public story (intended):** Quantum Pi Forge / OINIO on 0G Aristotle — technical layer live; commercial services path; **protocol mint / stake / LP not authorized**; local autonomy tag `autonomy-day3-stable` @ `d034537`.

---

## Executive finding

This is **deployment hygiene**, not product strategy.

| Class | Count | Issue |
| --- | --- | --- |
| **Canonical (keep)** | 3 URLs / 1 CF project | Aligned title + current portal |
| **Dead / empty** | 1 project (`oinio-dashboard`) | 404 — confuses if bookmarked |
| **Legacy still 200** | 4 CF projects + 1 GitHub Pages | Older “genesis / live / connect” narratives without current restraint language |
| **Drift note** | `*.com` vs `*.pages.dev` | Same title; body hash not byte-identical (minor) |

**Goal:** every public URL you control either serves **current** content or is **archived/retired**.

---

## Inventory table

| Deployment | Purpose | HTTP | Current? | Messaging notes | Action |
| --- | --- | --- | --- | --- | --- |
| **quantumpiforge.com** | Primary public site | **200** | **Yes** | Title matches QPF/OINIO portal; includes wallet/connect **and** “not authorized” / commercial framing | **Keep** |
| **www.quantumpiforge.com** | Apex alias | **200** | **Yes** | Same size as apex (51629) | **Keep** |
| **quantumpiforge.pages.dev** | CF default + recent prod | **200** | **Yes** | Same title; body hash differs slightly from `.com` | **Keep** — verify parity after next deploy |
| **6f771c7f.quantumpiforge.pages.dev** | Latest production deploy pin | **200** | **Yes** | Matches `quantumpiforge.pages.dev` hash | Reference only |
| **oinio-dashboard.pages.dev** | Legacy Pages project | **404** | **No** | CF: “Deployment Not Found”; last activity **3 months** | **Retire / delete project** |
| **b16643ce.oinio-dashboard.pages.dev** | Stale preview only | **404** | **No** | Preview id `b16643ce-…` on branch `master` / commit `25a293a` | **Ignore + delete with project** |
| **quantum-pi-forge.pages.dev** | Older project | **200** | **No** | “The Forge is Live”, Connect Wallet, GET STARTED — **no** “not authorized” hit | **Archive banner or delete** |
| **quantum-pi-forge-site.pages.dev** | Older genesis site | **200** | **No** | Genesis countdown **00:00**, “Where Consciousness Meets Code” | **Archive or redirect** |
| **quantum-pi-forge-fixed.pages.dev** | Thin recovery stub | **200** | **No** | Minimal “Sovereign AI Governance and DeFi Protocol” | **Delete** (low value) |
| **quantum-resonance-clean.pages.dev** | Recovery experiment | **200** | **No** | “Cloudflare Pages recovery active” | **Delete** |
| **onenoly1010.github.io/quantum-pi-forge-site/** | GitHub Pages | **200** | **No** | Same genesis narrative as `quantum-pi-forge-site` | **Archive / redirect to quantumpiforge.com** |

### Cloudflare Pages projects (account)

| Project | Domains | Last modified | Recommendation |
| --- | --- | --- | --- |
| **quantumpiforge** | quantumpiforge.com, www, pages.dev | ~minutes–hours | **Sole public production** |
| oinio-dashboard | oinio-dashboard.pages.dev | 3 months | **Retire** |
| quantum-pi-forge | quantum-pi-forge.pages.dev | 2 months | **Retire or archive page** |
| quantum-pi-forge-site | quantum-pi-forge-site.pages.dev | 1 month | **Retire or archive page** |
| quantum-pi-forge-fixed | quantum-pi-forge-fixed.pages.dev | 1 month | **Retire** |
| quantum-resonance-clean | quantum-resonance-clean.pages.dev | 1 month | **Retire** |

---

## Answers: `oinio-dashboard` questions

| Question | Finding |
| --- | --- |
| Referenced in repo? | **No hits** for `oinio-dashboard` / `b16643ce` in tracked source (grep). Safe to retire without link rot in main docs. |
| Users / inbound? | Unknown traffic; URL returns **404** so active users already fail. |
| Part of QPF now? | **No** — abandoned experiment / old preview; not in current deploy path (`quantumpiforge` project). |
| Conflicts with messaging? | **Yes, by absence** — looks broken if shared; not serving wrong mint claims, but erodes trust. |

**Recommendation:** **retire** `oinio-dashboard` (delete CF Pages project). Do **not** redeploy current QPF there unless you intentionally want a second brand hostname.

---

## Messaging risks on legacy 200s

| Surface | Risk |
| --- | --- |
| quantum-pi-forge.pages.dev | Sounds fully “live” + wallet CTA without current commercial restraint copy |
| quantum-pi-forge-site + GitHub Pages | Expired genesis countdown; spiritual/marketing narrative ≠ current parked economics |
| quantum-pi-forge-fixed / resonance-clean | Looks abandoned or mid-recovery |

Primary site (`quantumpiforge.com`) uses mint/stake/liquidity/wallet language in context of status/docs **and** “not authorized” — acceptable if UI keeps restraint visible; still worth a human click-through of **Connect wallet** and CTAs.

---

## Content parity (primary)

| Pair | Result |
| --- | --- |
| apex vs www | Same response size (51629) |
| pages.dev vs latest deploy pin | **Identical** SHA-256 prefix `d432e8b01258b2de` |
| apex vs pages.dev | **Not byte-identical** (51629 vs 50332) — same title; re-deploy both from same artifact next time |

---

## Recommended actions (ordered)

### Do now (high ROI, low risk)

1. **Publish this audit** on `main` (this file).  
2. **Stop sharing** any `oinio-dashboard` / `b16643ce` / old `*.pages.dev` URLs in grants/outreach.  
3. **Canonical links only:** `https://quantumpiforge.com` (and GitHub repo).  
4. Human **click audit** on quantumpiforge.com: wallet connect, Work With Us, Status, any mint language.

### Do this session (Cloudflare — requires your confirm to delete)

| Priority | Action |
| ---: | --- |
| 1 | Delete or disable **oinio-dashboard** project |
| 2 | Delete **quantum-pi-forge-fixed**, **quantum-resonance-clean** |
| 3 | Either delete **quantum-pi-forge** + **quantum-pi-forge-site**, or replace production with a single static **ARCHIVED → quantumpiforge.com** page |
| 4 | GitHub Pages: disable site or replace with redirect/meta refresh to quantumpiforge.com |

Commands (when you approve deletes — **not run** by this audit):

```bash
# Example only — confirm each project name in dashboard first
# wrangler pages project delete oinio-dashboard
```

Prefer Cloudflare dashboard delete if CLI is unfamiliar; no keys required beyond existing wrangler auth.

### Do next deploy

- Build once from `main` / `autonomy-day3-stable` artifact.  
- Deploy **only** to project **`quantumpiforge`** so `.com` and `.pages.dev` stay in lockstep.  
- Re-check hashes: apex ≈ pages.dev.

---

## CTA / feature checklist (primary site — manual)

Walk https://quantumpiforge.com and check:

- [ ] No “mint now” / “open LP” that implies live economics  
- [ ] Wallet connect is **read-only status** (or clearly optional)  
- [ ] No private-key input  
- [ ] Grant/reviewer path points to evidence / STATUS / parked language  
- [ ] No link to oinio-dashboard or legacy genesis-only hosts  
- [ ] “Coming soon” items either real or removed  

---

## Explicit non-actions of this audit

- Did **not** delete any Cloudflare project  
- Did **not** redeploy production  
- Did **not** change DNS  
- Did **not** touch wallets or chain  

---

## Success criteria

| Criterion | Met when |
| --- | --- |
| Single story | Only quantumpiforge.com (+ www + pages.dev) serve product UI |
| No 404 brand URLs | oinio-dashboard gone or redirects |
| No competing genesis | legacy projects deleted or archived banner |
| Trust | Grant reviewers hit one consistent surface |

---

## Related

- Local autonomy freeze: tag `autonomy-day3-stable`  
- Ops safe/forbidden: `docs/activation/living-forge/OPS_SAFE_VS_FORBIDDEN_V1.md`  
- Founder human queue: `docs/activation/command/FOUNDER_NEXT_60_MIN_V1.md`
