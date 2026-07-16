# G-01 Repository Integrity — Evidence

**Gate:** G-01  
**Timestamp (UTC):** 2026-07-16T19:43:31Z  
**HEAD:** `fbefbc68e426a4660c9d1225e6bc555cda178e20`  
**Subject:** `governance: authorize controlled public mint execution session`  
**Operator policy:** No automatic commit. No automatic push.

## Checks performed

| Check | Result | Evidence |
| --- | --- | --- |
| Git repository readable | PASS | `git rev-parse HEAD` → `fbefbc6…` |
| Remote configured | PASS | `origin` → `https://github.com/onenoly1010/Quantum-pi-forge` (fetch/push) |
| Branch identity | PASS | `* main` |
| Branch cleanliness | **FAIL** | `git status --porcelain` count = **12** paths dirty/untracked |
| Sync with origin/main | PARTIAL | `origin/main...HEAD` left-right = **0 3** (local **ahead by 3**, not behind) |
| Node/npm present | PASS | Node `v22.22.3`, npm `10.9.8` |
| Lockfile present | PASS | `package-lock.json` (138322 bytes, mtime 2026-07-07) |
| Lockfile package graph | PASS | `npm ls --package-lock-only --depth=0` lists packages without error in captured tail |
| Foundry present | PASS | `forge` 1.5.1-stable |
| Hardhat config present | PASS | `hardhat.config.js` |
| Contracts tree present | PASS | `contracts/` with `src`, `script`, `test`, `DEPLOYED_ADDRESSES.md`, `foundry.toml` |
| Canonical deploy matrix status | INFO | All rows **Pending** (by design until G-05) |
| Root secrets | PASS (absence) | No root `.env`; examples only (`.env.example`, etc.) |

## Dirty working tree inventory (complete at capture)

```
 M README.md
 M REVIEWER_START_HERE.md
 M STATUS.md
 M deploy/what-it-does.html
 M docs/review/CLAIM_TO_PROOF_MATRIX.md
 M docs/valuation/GRANT_PARTNER_OUTREACH_KIT_V1.md
 M docs/valuation/QPF_GRANT_PARTNER_OUTREACH_KIT_V1.md
 M frontend/production_dashboard.html
?? docs/activation/ACTIVATION_GATE_PROTOCOL_V1.md
?? docs/review/PUBLIC_SURFACE_CLAIM_AUDIT_V1.md
?? docs/review/VERIFICATION_STATUS_TABLE_V1.md
?? docs/review/verification-status-table-v1.json
```

Note: Activation protocol state/evidence files created after this listing will further increase dirtiness until a human commits or reverts.

## Unpushed commits (local only)

```
fbefbc6 governance: authorize controlled public mint execution session
8f949ed governance: seal public mint live gas preview evidence
6eba716 governance: seal Phase 40 public mint authorization reconsideration
```

## Exit condition evaluation

Protocol exit: **PASS only if deterministic** and branch cleanliness satisfied.

| Exit element | Met? |
| --- | --- |
| Repository health | Yes |
| Remotes | Yes |
| Lockfiles | Yes |
| Dependencies tooling present | Yes |
| Branch cleanliness | **No** |
| Fully deterministic/clean activation baseline | **No** |

## Gate decision

**BLOCKED**

### Blocker

Working tree is not clean; local `main` is also **3 commits ahead** of `origin/main` (unpushed by policy — correct under Core Rules 6–7, but not a clean baseline for “activation ready” integrity).

### Evidence

This file; `git status --porcelain`; `git rev-list --left-right --count origin/main...HEAD` → `0 3`.

### Root cause

1. Prior session intentionally left claim-hygiene edits uncommitted (no auto-commit).  
2. This session added Activation Gate Protocol files (required for state management).  
3. Protocol forbids auto-commit/auto-push; therefore cleanliness cannot self-heal inside the agent loop.

### Proposed fix (human)

1. Review dirty paths and either **commit** as one docs/claim-hygiene + activation-protocol commit, **stash**, or **revert** unwanted edits.  
2. Decide whether the 3 unpushed commits should remain local-only or be pushed (agent will not push).  
3. Re-run G-01 only after `git status --porcelain` is empty (or after an explicit human-approved exception is written into the state file).  
4. Do **not** start G-02 until G-01 is `PASS`.

## Forbidden actions not taken

- No inventing of clean status  
- No automatic commit  
- No automatic push  
- No skip to G-02/G-05  
- No fabrication of chain state  
