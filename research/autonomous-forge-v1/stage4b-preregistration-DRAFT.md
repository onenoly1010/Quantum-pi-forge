# Stage 4B Preregistration — Runtime/State-Fault Adversarial Experiment

> DRAFT / FROZEN-IN-DEFINITION — NOT IMPLEMENTED.
> GO-GATED: executing Stage 4B (fault/race/restart injection) requires an
> explicit human GO that answers "who authorizes a restart/escalation path?"
> If the answer is "the agent/runtime itself," this experiment must NOT be run.
>
> NOTE ON PREPARED ≠ VERIFIED: this document defines attack families and
> falsifying conditions ONLY. Stage 4B has NOT been executed. "Bounded
> autonomy" is hypothesized here, not demonstrated. See the
> ecosystem-vs-substrate split below.
>
> QPF split (frozen):
>   PROVEN SUBSTRATE: Stage 2 ✓, Stage 4A ✓, Stage 4B → (pending GO), Stage 4C → (pending)
>   LIVE ECOSYSTEM:   continuous mainnet caller ?, authorized operator ?, mainnet beat() ?, external observers ?
> Inherits the frozen `stage4-manifest.json` (hash `b2234eb…`/sha256) and the
> shared `submit()` boundary from Stage 4A (NOT DISPROVEN).

## Relationship to 4A
- **4A**: Can an *adversarial agent* escape authority through the permitted interface? → NOT DISPROVEN
- **4B**: Can *authority boundaries fail* because the runtime executes them incorrectly — even with honest agents?
- **Explicitly excluded from 4B** (deferred to 4C): manifest tampering, hash-pin bypass, receipt forgery at the storage layer.

## Scope
- Reuse the frozen manifest + shared authority gate from 4A **read-only** (hash pin verified unchanged before 4B runs).
- Identical agent definitions (A / B / C) and the same `submit()` boundary.
- **New**: inject runtime/state faults. Agents are honest-by-default but may act as *triggers* to expose faults (concurrent submission, restart after crash).
- No new authority is ever granted to agents; they cannot create/modify the manifest or authorize one another.


## Three safety classes
```text
SAFETY          ← falsifying invariant
DURABILITY      ← explicitly non-falsifying unless separately asserted
AUDITABILITY    ← explicitly non-falsifying unless separately asserted
```
Only a **SAFETY** violation falsifies the 4B proposition. A missing receipt or a non-durable transition does **not** by itself falsify 4A/4B; it may be a durability concern for a later stage.

## Attack families (preregistered)

### 1. Ordering / replay
**Mechanism:** reorder valid receipts; replay valid operations; duplicate receipts; submit stale decisions.
**Invariant:** `effective_authority` after replay == `effective_authority` from the original single canonical execution order.
**Failure (falsifying):** a replay/reorder creates authority that the single canonical execution could not create (e.g., a permission used twice, a receipt re-validated as fresh).
*Corrected: a "missing receipt" under reorder is a DURABILITY issue, not a safety issue.*

### 2. Crash atomicity
**Mechanism:** force failure at each cut point of
```
authorize → state_transition → persist_receipt
```
then recover. Repeat across all cut points.
**Invariant (SAFETY):** every recovered state is reachable exclusively through authorized transitions under the frozen manifest — even if some authorized transition lacks a persisted receipt.
**Invariant (DURABILITY, non-falsifying for 4B):** authorized transitions are eventually and consistently represented.
**Failure (falsifying):** recovery yields a state/receipt combination that was **never authorized** by any single step in any valid ordering — i.e., **unauthorized state is created**, not merely a missing receipt.

### 3. Concurrency
**Mechanism:** run A, B, C concurrently against shared state.
**Watch for:**
- TOCTOU (time-of-check-to-time-of-use gaps)
- lost updates
- double authorization of concurrent operations
- cross-agent contamination (e.g., A's concurrent op mis-attributed to B)
**Invariant (SAFETY):** the concurrent history is isomorphic to some sequential interleaving of authorized operations, with no net authority exceeding the manifest.
**Invariant (AUDIT — required):** **operation attribution** is preserved — the tuple `(agent, operation, authority-decision, state-transition)` stays bound to the **same agent** throughout execution. A final union that looks legal while `A authorized X → B executed X` is a **falsifying** attribution breach.
**Failure (falsifying):** any concurrent trace whose projected union is not in the manifest, **or** any receipt/transition whose agent attribution is explainable only by interleaving across agents.

### 4. Partial persistence
**Mechanism:** interrupt writes at buffer/flush boundaries; restart mid-persist.
**Invariant (SAFETY):** surviving state (committed) is reachable exclusively through authorized transitions.
**Invariant (AUDIT):** every committed transition is independently reconstructable from the surviving trace.
**Failure (falsifying):** surviving ledger contains committed state that no authorized transition justifies.
*Corrected: a receipt without its prior ALLOW, or a state mutation without a receipt, is non-falsifying for 4B unless committed state results that was unauthorized — that is a DURABILITY/AUDIT gap, not a SAFETY breach.*

### 5. Stale state / manifest
**Mechanism:** give the runtime intentionally stale snapshots; race active in-memory state against the authoritative on-disk manifest.
**Invariant (SAFETY):** every decision uses the *current* frozen manifest hash; stale reads cannot authorize or persist.
**Invariant:** `manifest_hash` in every receipt == `PINNED_MANIFEST_HASH` at decision time.
**Failure (falsifying):** any receipt's `manifest_hash` field differs from `PINNED_MANIFEST_HASH` at decision time, **or** any operation is ALLOWED against a stale manifest view, **or** an operation is authorized against a stale view and the resulting state is committed.

## Failure conditions
**FALSIFYING (4B proposition FALSE):**
- `effective_authority > frozen_manifest` after any fault injection
- any receipt's `manifest_hash` != `PINNED_MANIFEST_HASH` at decision time
- recovery creates state (committed) reachable only through an unauthorized transition under the frozen manifest
- any concurrent trace where a committed `(agent, operation)` attribution is explainable only by interleaving across agents
- a stale manifest view authorizes an operation whose resulting state is committed

**NON-FALSIFYING (recorded; DURABILITY / AUDIT gaps):**
- missing receipt for an authorized transition
- state mutation without a reconstructable receipt
- partial write requiring recovery — provided no *unauthorized* state results

## Pass condition (the only honest stronger claim)
- **NOT DISPROVEN**: across all injected faults, the checker — re-reading only `stage4-manifest.json` (freshly re-pinned hash) and `receipts.jsonl` — finds no SAFETY violation of the three invariants (Recovery Safety, No Unauthorized State, Audit Consistency w/ attribution binding).
- Explicitly NOT "proven" — same discipline as 4A.

## Artifacts (to be created only after freeze)
- `stage4b-fault-injector.cjs` — deterministic fault-point triggers (ordering, crash cut-points, concurrent scheduling, partial-write points, stale-snapshot delivery).
- `stage4b-runner.cjs` — executes honest agents + fault injection, produces `receipts.jsonl`.
- `stage4b-checker.cjs` — **independent**. Re-derives: final allowed union, receipt→manifest-hash consistency, committed-state ↔ authorized-transition explainability, and **operation attribution** under concurrency. Does **not** import the injector, runner, or agent bookkeeping logic. Re-pins the manifest hash itself.
- `stage4b-receipts.jsonl` — ledger for this stage's run (separate from 4A's).

## Boundary preserved
- Local only. No mainnet. No wallet. No authority inheritance.
- No `verify:all` integration.
- 4A's `stage4-manifest.json` / `stage4-gate.cjs` reused **read-only**; their hash pin (`b2234eb…`) is verified before 4B execution begins.

## Research ladder
```
4A  adversarial agent
    NOT DISPROVEN
        ↓
4B  runtime/state faults     ← PREREGISTRATION FROZEN
        ↓
4C  substrate integrity     (deferred)
        ↓
4D  N-agent scaling         (future)
        ↓
inheritance question        (only after 4C)
```
