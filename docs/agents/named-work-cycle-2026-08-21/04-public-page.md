# Public Page — claim / evidence matrix

```text
AGENT: Public Page
ROLE: declared operating role
TASK: audit live public claims vs origin/main e43cd55 and chain 16661
AUTHORIZED SCOPE: matrix only; do not silently edit public pages
RESULT: EXECUTED
NEXT GATE: landing rewrite GO (#775 is a candidate; do not merge as written)
```

Fetched 2026-08-21 (follow redirects): `/`, `/verification-certificate`, `/work-with-us`, `/deployed-addresses`.

| CLAIM | SOURCE | STATUS | REQUIRED CORRECTION |
| --- | --- | --- | --- |
| Protocol mint/staking not authorized | `quantumpiforge.com/` meta/body | **VERIFIED** vs `verification-status-v1.json` economic block | None |
| Public mint / LP / yield not authorized | home + deployed-addresses | **VERIFIED** vs RPC pair `getReserves` = 0/0 | None |
| Founder certificate **$500 CAD** + invoice | `/verification-certificate`, `/work-with-us` | **CONTRADICTED** vs `ECONOMIC_SOVEREIGNTY_GATE` `LIVE_REVENUE_CLAIM=false` and locked strategy (verification not a paid protocol service) | Landing GO: remove paid-certificate pitch; keep verification free |
| “Services revenue comes before protocol mint” | `/work-with-us` | **UNVERIFIED** as current policy; **CONTRADICTED** vs locked INFT-share strategy (not on `main` yet) | Same landing/strategy GO (#775/#776) |
| Independent verification Round 1 open | home | **VERIFIED** as declared; **n=0** eligible reports | Status JSON still accurate for 8.5 OPEN |
| Status JSON `main_commit_short: 22f3028` | live + `deploy/verification-status-v1.json` on `e43cd55` | **CONTRADICTED** vs git tip `e43cd55` | Docs/status pin update GO (touches `deploy/`; may Pages-publish) |
| Minted AI agents as live workers | not a home headline; Model Registry exists | **UNVERIFIED** as “active agents earning”; **VERIFIED** 2 registry NFTs (proof mint) | Do not add “agents are live/earning” copy |
| ERC-8004 / 7857 as QPF identity | not prominent on sampled pages | **SPECIFIED NO GO** in #782 docs | Keep absent from marketing |
| INFT mentions on home | count=2 in HTML | **UNVERIFIED** without full sentence audit of each hit | Review in landing GO |
| Pair empty by design | deployed-addresses + status `reserves_expected: 0/0` | **VERIFIED** live `getReserves` 0/0 | None |

**NOT EXECUTED:** any HTML edit.
