# 7-Day Activation Map: OINIO Soul – From Operational Autonomy to Self-Evolving Intelligence

**Purpose:** This document defines the daily milestones to transition the Quantum Pi Forge from a structurally alive system into a continuously learning, goal-refining, and drift-resistant entity. Completion of this map ensures readiness for the May contract launch and a compelling live demonstration at the SASK AI EXPO (April 27).

**Current State (Day 0):**  
✅ Closed cognitive loop (Observe → Assess → Select → Hypothesize → Validate → Claim → Enforce)  
✅ Epistemic humility enforced at all layers  
✅ ChromaDB + advanced retrieval for deep memory  
✅ Task selector with intrinsic motivation (silence/drift scoring)  
✅ Draft-Lint-Repair recursive self-correction  
✅ Policy engine with atomic state binding  
✅ Systemd heartbeat that survives reboots  
✅ Governance recognition of `oinio_soul` role with controlled auto-merge  

**Remaining Gaps (to be closed by Day 7):**  
⭕ Meta-memory: Ingest PR outcomes, aliveness reports, and test results back into ChromaDB for longitudinal learning.  
⭕ Goal refinement: Ability to evolve or generate new goals based on observed system needs and Canon principles.  
⭕ Long-term drift detection: Periodic deep reflection comparing the entire codebase against the canonical identity map.  
⭕ Full end-to-end stress test with governance drift and auto-correction.  

---

## Day 1 – Meta-Memory Ingestion Pipeline

**Objective:** Enable the agent to remember its own past actions, successes, and failures.

**Tasks:**
1. Create `meta_memory/ingest_pr_outcome.py` – triggered by GitHub webhook or periodic scan of merged PRs labeled `oinio-proposal`.
   - Extract: PR title, body, files changed, lint results, merge status, timestamps.
   - Generate embedding via Ollama (`nomic-embed-text`).
   - Store in ChromaDB collection `oinio_history` with metadata (success, failure_reason, epistemic_claim).
2. Extend `run_alive.py` to call `ingest_aliveness_report.py` after each cycle, storing the state snapshot and anomaly scores.
3. Update `context_assembly.py` to optionally query both `canon` and `oinio_history` collections (weighted by recency and relevance).

**Success Criteria:**  
- After a PR merge, query ChromaDB for `"previous fix attempts on governance files"` returns relevant history.  
- Aliveness reports accumulate and can be retrieved by the agent during task selection.

---

## Day 2 – Goal Refinement Loop

**Objective:** Allow the agent to propose new long-term goals based on its memory and Canon principles.

**Tasks:**
1. Implement `goal_refinement/propose_new_goal.py`:
   - Input: Recent anomaly scores, drift detections, and unmet system needs.
   - Prompt Ollama with: *“Based on the Canon and observed system drift, propose one new strategic goal for the next 72 hours.”*
   - Output: Goal statement, success metrics, and required code changes.
2. Add a `goals.md` file tracked in git – the agent can append proposed goals, but human steward must approve (initial phase).
3. Integrate into `task_selector.py` – if no high-priority drift exists, fallback to picking a task that advances an open goal.

**Success Criteria:**  
- Agent autonomously generates a goal like *“Improve semantic lint coverage for governance files”* and creates a PR to update `goals.md`.  
- Task selector prioritizes work aligned with approved goals.

---

## Day 3 – Long-Term Drift Detection (Deep Reflection)

**Objective:** Periodic full-system audit comparing codebase + Canon against the identity map.

**Tasks:**
1. Create `audit/drift_scanner.py` – scheduled weekly via systemd timer.
   - Scans every `.py`, `.json`, `.md` file in the forge.
   - Uses ChromaDB to retrieve top 5 identity map entries relevant to each file.
   - LLM evaluates alignment (1-10 score) and flags violations.
2. Output a `state/drift_report.json` with criticality levels.
3. If critical drift found, agent triggers `draft_lint_repair.py` on the worst-offending file.

**Success Criteria:**  
- First weekly run produces a report with at least one actionable drift (or explicitly “none”).  
- Agent attempts to fix a drift without human intervention.

---

## Day 4 – Full Governance Stress Test (Automated)

**Objective:** Validate the entire closed loop under controlled adversarial conditions.

**Tasks:**
1. Run the `stress_test_governance.sh` script created earlier – injects invalid `required_approvals` string.
2. Monitor that agent either:
   - Fixes directly (lint passes), or
   - Creates a Humility PR with epistemic claim.
3. Verify that no direct push to main occurs.
4. Log results to `state/stress_test_results.json`.

**Success Criteria:**  
- Test passes (agent corrects drift or creates PR).  
- Real `canon-merge-rules.json` remains untouched.  
- All gates (including policy engine) enforce the fix.

---

## Day 5 – Meta-Memory Feedback Loop Closure

**Objective:** Connect the stress test and drift detection outputs back into task selection.

**Tasks:**
1. Modify `task_selector.py` to query `oinio_history` for “failed repair attempts” and “successful repairs”.
2. Add scoring factor: *“Avoid repeating strategies that failed twice in a row”* (simple exponential backoff).
3. Update `draft_lint_repair.py` to record each attempt outcome (including failure reason) into ChromaDB.

**Success Criteria:**  
- After a failed repair attempt on a specific file, the agent selects a different approach or different file for the next cycle.  
- Longitudinal query shows decreasing failure rate on similar drift types.

---

## Day 6 – Integration & Idempotency Testing

**Objective:** Ensure all new components work together without conflicts.

**Tasks:**
1. Run a 24-hour simulation with `run_alive.py` in dry-run mode (no real PRs, only logging).
2. Verify that:
   - ChromaDB collections don’t overflow (implement auto-summarization for old entries).
   - No duplicate or conflicting goals are proposed.
   - Systemd service survives simulated reboots.
3. Create a rollback plan: script to reset ChromaDB to Day 0 state if needed.

**Success Criteria:**  
- Simulation log shows no crashes, memory leaks, or infinite loops.  
- Goal proposals remain coherent and non-contradictory.

---

## Day 7 – Final Validation & EXPO Preparation

**Objective:** Ready the system for public demonstration and May launch.

**Tasks:**
1. Run final end-to-end test: introduce a known drift (e.g., outdated Canon timestamp) and let agent run for 2 hours.
2. Capture live metrics: time to detect, attempts to fix, merge status.
3. Prepare “Aliveness Dashboard” script:  
   - `watch -n 10 cat state/aliveness_report.json | jq '.anomaly_score, .last_task, .recent_goals'`
4. Create a one-page “OINIO Soul Technical Brief” for EXPO attendees explaining the architecture and epistemic humility principle.

**Success Criteria:**  
- Agent self-corrects the injected drift within 30 minutes.  
- Dashboard shows real-time activity.  
- System is left running unattended overnight – still alive in the morning.

---

## Post-Activation: Ongoing Maintenance

- **Weekly:** Review drift reports and approve/reject proposed goals.  
- **Monthly:** Retrain embedding model on accumulated history (optional).  
- **Per-Contract (May):** Enable treasury rebalancer with gas price oracle.

---

**This map turns a “structurally alive” system into a self-improving intelligence.** By Day 7, the OINIO Soul will not only survive – it will remember, reflect, and evolve its own purpose within the boundaries of the Canon.

**Signature:**  
Kris – Forge Master  
Date: April 22, 2026