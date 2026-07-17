# Dirty Tree Resolution Policy v1

**Purpose:** Keep activation work continuous and evidence-first without silently committing, deleting, or overwriting user work.

## Before halting for a dirty working tree

1. Produce a complete inventory of every modified, deleted, untracked, and staged file.
2. Classify each file as one of:
   - **Existing user work**
   - **AI-generated work**
   - **Generated/build artifact**
   - **Unknown**
3. Recommend one of:
   - **Commit**
   - **Stash**
   - **Discard generated artifacts**
   - **Leave unchanged**
4. Do **not** modify or delete user work without explicit authorization.
5. After the inventory is complete, **pause exactly once** for a decision.
6. Once a decision is received, continue from the last successful gate without restarting completed `PASS` gates (re-check only gates that failed/blocked or whose inputs changed).

## Classification definitions

| Class | Meaning |
| --- | --- |
| Existing user work | Present before the agent session or authored by the human outside this agent loop |
| AI-generated work | Created or modified by the agent in this or the immediately prior agent session with known intent |
| Generated/build artifact | Tool output (`out/`, `cache/`, compiled binaries, logs) not meant as source of truth |
| Unknown | Cannot be attributed with evidence |

## Decision outcomes (human)

| Decision | Agent action after authorization |
| --- | --- |
| Commit all classified AI work | Stage only listed paths; commit with stated message; **never push unless separately authorized** |
| Commit AI work + leave user work | Stage only AI paths; leave user paths untouched |
| Stash AI work | `git stash` only for authorized paths |
| Discard generated artifacts | Delete only paths classified Generated/build artifact |
| Leave unchanged + exception | Record human exception in state file; re-evaluate G-01 cleanliness criterion under exception |
| Revert AI work | Restore listed AI-modified files to HEAD / remove untracked AI files **only if authorized** |

## Evidence

Inventories are sealed under `docs/activation/evidence/DIRTY-TREE-*` and must not be overwritten. New inventories get new timestamps.
