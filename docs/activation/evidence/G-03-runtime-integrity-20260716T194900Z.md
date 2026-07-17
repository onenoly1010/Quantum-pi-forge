# G-03 Runtime Integrity — Evidence

**Timestamp (UTC):** 2026-07-16T19:48:44Z  
**HEAD:** `ce275b81f54d4f166a17f7fac8ffa67f0c937435`  
**Smoke log:** `docs/activation/evidence/G-03-runtime-smoke-20260716T194900Z.txt`

## Scope executed

| Surface | Method | Result |
| --- | --- | --- |
| Static frontend (`out/`) | `python3 -m http.server` local smoke | See routes below |
| Cloudflare `_redirects` | Inspect file content | Present; **not** applied by Python server |
| Remote API health (proxy target) | `curl -m 5` Railway `/health` | **HTTP 200**, body `OK` |
| Workers | Filesystem listing only | Present under `workers/` — **not** live-executed this gate |
| docker-compose | Config inspect only | Services named `redis`, `resonance-worker` — **not** started (side effects) |
| Env vars for static | Inspect | No root `.env` required for static serve; examples only |

## Route smoke (local static server)

| Path | HTTP | Notes |
| --- | ---: | --- |
| `/` | 200 | 52742 bytes |
| `/what-it-does.html` | 200 | 7057 bytes; gated claim language present |
| `/what-it-does` | **404** | Expected on Python server; **no** `_redirects` rule for bare path; site links use `/what-it-does.html` |
| `/deployed-addresses.html` | 200 | |
| `/staking.html` | 200 | |
| `/version.json` | 200 | commit `ce275b8…` matches HEAD |
| `/frontend/production_dashboard.html` | 200 | Shows `EXPERIMENTAL / GATED` |

## Claim language (runtime-served)

- `out/what-it-does.html`: **Genesis Activation Evidence (Gated)** / Implemented but gated — not “now live” superlative.
- `out/frontend/production_dashboard.html`: **EXPERIMENTAL / GATED** badge.

## Confirmed issues

| Issue | Severity | Repair this gate? |
| --- | --- | --- |
| Bare `/what-it-does` 404 on non-CF static hosts | Low if all links use `.html` | **No** — not confirmed broken for CF; links use `.html`. Residual for G-08. |
| Workers not live-tested | Scope gap | **No** — would require secrets/bindings; residual |
| docker-compose not started | Scope gap | **No** — avoid side effects without need |

## Gate decision

**PASS (scoped)** — public static runtime + remote health probe verified with evidence.  

**Residuals (not FAIL):** worker live execution, full docker stack, CF `_redirects` end-to-end on Cloudflare.

Repairs: none (no confirmed broken activation-critical defect requiring code change).
