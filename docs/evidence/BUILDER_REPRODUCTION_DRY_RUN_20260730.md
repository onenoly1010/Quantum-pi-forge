# Builder Reproduction Dry Run — 2026-07-30

**Phase:** 8.6 prep (does **not** seal 8.6 complete)  
**Mode:** Clean-clone independent path  
**Operator:** autonomous agent (maintainer environment) — **does not count toward** Phase 8.5 quorum \(m\)  
**Main HEAD:** `0fcab13` (PR #635 merged)

---

## Method

```text
1. mktemp clean directory
2. git clone --depth 1 https://github.com/onenoly1010/Quantum-pi-forge.git
3. Run BUILDER_QUICKSTART / FIRST_VERIFICATION_EVENT RPC + HTTP checks
4. Confirm Phase 8.4/8.5 docs + receipts present on main
5. Attempt npm ci + npm run verify:evidence (optional full path)
```

Workdir (ephemeral): `/tmp/qpf-builder-repro-wZ6M` (may be gone)

---

## Results

| Step | Result | Detail |
| --- | --- | --- |
| Clone main | **PASS** | HEAD `0fcab13` |
| `eth_chainId` | **PASS** | `0x4115` (16661) |
| Token code | **PASS** | `0x75995EC0…Cb58` → **2281** bytes |
| Registry code | **PASS** | `0x67aD7169…E87a` → **9850** bytes |
| Pair `getReserves` | **PASS** | all-zero reserves (empty pool) |
| Portal HTTP | **PASS** | https://quantumpiforge.com/deployed-addresses → 200 |
| Mint path HTTP | **PASS** | `/mint` → 200 (gated surface; not open economics) |
| Metadata HTTP | **PASS** | mint model JSON → 200 `application/json` |
| Docs on clone | **PASS** | Genesis, roadmap, INDEX_V1, 8.4 live seal, 8.5 R1 receipt |
| Roadmap status strings | **PASS** | 8.4 COMPLETE · 8.5 Round 1 OPEN |
| `npm run verify:evidence` (shallow clone) | **FAIL** | `canonicalCommit is not an ancestor of HEAD` (shallow history) |
| `npm run verify:evidence` (full local checkout) | **PASS** | on maintainer full repo at `0fcab13` |

---

## Interpretation

| Claim | Status |
| --- | --- |
| Stranger can verify chain + portal without project secrets | **Supported** |
| Empty pool + mint NOT AUTHORIZED still hold | **Supported** |
| Phase 8.4/8.5 docs reachable on main | **Supported** |
| Phase 8.6 “never-seen-QPF full npm verify on shallow clone” | **Not yet** — document full clone OR fix snapshot ancestor for shallow clones |
| Phase 8.6 sealed complete | **No** — needs non-maintainer external dry run preferred |

---

## Follow-ups for true 8.6 seal

1. Prefer **full clone** (or deepen history past `canonicalCommit` `7e6281d`) in BUILDER_QUICKSTART for `verify:evidence`.  
2. Or make `verify:snapshot` tolerate shallow clones with explicit note.  
3. Invite a non-maintainer to run the same checklist and file `External verification: YYYY-MM-DD`.  
4. Cloudflare Pages: confirm live HTML includes Round 1 wording from `deploy/deployed-addresses.html` after Pages rebuild.

---

## Boundaries

No signing, broadcast, mint, or liquidity. Maintainer dry run **does not** increment Round 1 \(n\) or \(m\).

---

*Builder reproduction dry run — prep evidence only.*
