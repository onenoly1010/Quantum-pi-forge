# Dirty Tree Inventory — 2026-07-16T19:46:12Z

**Policy:** `docs/activation/DIRTY_TREE_RESOLUTION_POLICY_V1.md`  
**HEAD:** `fbefbc68e426a4660c9d1225e6bc555cda178e20`  
**Branch:** `main` (local ahead of `origin/main` by **3** commits; not part of porcelain dirtiness but noted)  
**Staged files:** none  
**Deleted files:** none  
**Agent action on inventory:** classify + recommend only — **no commit, stash, discard, or revert performed**

---

## Complete inventory

### Modified (unstaged)

| Path | Diff | Class | Attribution evidence | Recommended action |
| --- | ---: | --- | --- | --- |
| `README.md` | +4 / −1 | **AI-generated work** | Prior agent session: linked Verification Status Table + public audit + outreach kit | **Commit** (with AI batch) |
| `REVIEWER_START_HERE.md` | +11 / −5 | **AI-generated work** | Prior agent session: status table path + defensible description | **Commit** |
| `STATUS.md` | +2 / −0 | **AI-generated work** | Prior agent session: reviewer entrypoint links | **Commit** |
| `deploy/what-it-does.html` | +9 / −10 | **AI-generated work** | Prior agent session: removed “now live on mainnet” overclaim; gated genesis language | **Commit** |
| `docs/review/CLAIM_TO_PROOF_MATRIX.md` | +7 / −2 | **AI-generated work** | Prior agent session: link to status table SSOT | **Commit** |
| `docs/valuation/GRANT_PARTNER_OUTREACH_KIT_V1.md` | +5 / −2 | **AI-generated work** | Prior agent session: pointer to language-locked kit | **Commit** |
| `docs/valuation/QPF_GRANT_PARTNER_OUTREACH_KIT_V1.md` | +67 / −19 | **AI-generated work** | Prior agent session: outreach language lock to status table | **Commit** |
| `frontend/production_dashboard.html` | +3 / −3 | **AI-generated work** | Prior agent session: MAINNET → EXPERIMENTAL/GATED; demo subtitle | **Commit** |

### Untracked

| Path | Size (bytes) | Class | Attribution evidence | Recommended action |
| --- | ---: | --- | --- | --- |
| `docs/review/VERIFICATION_STATUS_TABLE_V1.md` | 12207 | **AI-generated work** | Prior agent session: claim SSOT | **Commit** |
| `docs/review/verification-status-table-v1.json` | 4584 | **AI-generated work** | Prior agent session: machine twin | **Commit** |
| `docs/review/PUBLIC_SURFACE_CLAIM_AUDIT_V1.md` | 7004 | **AI-generated work** | Prior agent session: public claim audit | **Commit** |
| `docs/activation/ACTIVATION_GATE_PROTOCOL_V1.md` | 2800 | **AI-generated work** | This session: protocol formalization | **Commit** |
| `docs/activation/activation-gate-state-v1.json` | 3233 | **AI-generated work** | This session: gate state | **Commit** |
| `docs/activation/evidence/G-01-repository-integrity-20260716T194331Z.md` | 4032 | **AI-generated work** | This session: G-01 evidence | **Commit** |
| `docs/activation/DIRTY_TREE_RESOLUTION_POLICY_V1.md` | (this policy) | **AI-generated work** | This session | **Commit** |
| `docs/activation/evidence/DIRTY-TREE-INVENTORY-20260716T194612Z.md` | (this file) | **AI-generated work** | This session | **Commit** |

### Staged

| Path | Class | Notes |
| --- | --- | --- |
| *(none)* | — | Nothing staged |

### Deleted

| Path | Class | Notes |
| --- | --- | --- |
| *(none)* | — | No deletions |

### Generated/build artifacts in dirty tree

| Path | Class | Notes |
| --- | --- | --- |
| *(none in porcelain)* | — | Note: `out/what-it-does.html` was edited earlier for the same claim fix but is **gitignored** (`out/`); not in porcelain. Treat as local deploy artifact only. |

### Unknown

| Path | Notes |
| --- | --- |
| *(none)* | All porcelain paths attributed to AI sessions with transcript evidence |

### Existing user work

| Path | Notes |
| --- | --- |
| *(none in porcelain)* | No uncommitted files classified as pre-existing human WIP distinct from these agent edits |

**Caveat:** The three **unpushed** commits on `main` (`6eba716`, `8f949ed`, `fbefbc6`) are **already committed local history**, not dirty-tree files. They are **not** classified above. Handling them is a **separate push policy** decision (default: leave unpushed until authorized).

---

## Summary counts

| Class | Count |
| --- | ---: |
| AI-generated work | 16 paths (8 modified + 6 prior untracked + 2 new policy/inventory paths if both written) |
| Existing user work | 0 |
| Generated/build artifact (in porcelain) | 0 |
| Unknown | 0 |
| Staged | 0 |
| Deleted | 0 |

Exact porcelain path count at capture may lag by 1–2 while this inventory and policy are written; re-run `git status --porcelain` after decision for commit list.

---

## Recommended decision (single package)

**Primary recommendation: Commit all AI-generated work listed above as one documentation/governance commit.**

Suggested message (for human or authorized agent commit only):

```
docs: claim hygiene SSOT, public surface audit, activation gate protocol

- Add Verification Status Table v1 + JSON twin
- Add public surface claim audit; qualify deploy human-doorway claims
- Lock grant/partner outreach language to status table
- Add Activation Gate Protocol, state file, G-01 evidence
- Add Dirty Tree Resolution Policy + inventory
```

**Do not push** unless separately authorized.

### Alternatives (ranked)

| Option | When to choose |
| --- | --- |
| **Commit** (recommended) | You want a clean tree and to keep claim hygiene + activation protocol as canon |
| **Leave unchanged + G-01 exception** | You want to continue gates without committing yet; state file records exception |
| **Stash** | You need a temporarily clean tree to test something else without losing work |
| **Discard** | Not recommended — would destroy evidence/protocol work; only if you reject the entire lane |
| **Revert AI work** | Only if you reject claim hygiene / activation protocol entirely |

---

## Pause

**Status: AWAITING_HUMAN_DECISION**

No further activation gates will run until one of:

1. **Authorize commit** of the listed AI paths (push separate),  
2. **Authorize leave-unchanged exception** for G-01 cleanliness,  
3. **Authorize stash**, or  
4. **Authorize discard/revert** of specific listed paths.

After decision: **G-01 re-check only** (G-01 was BLOCKED, not PASS). Do not restart any future PASS gates. Then continue G-02… in order.
