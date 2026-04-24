"""
OINIO Soul Task Selector
Self-Assessment & Intelligent Task Prioritization Module
Final autonomous cycle completion layer

This module closes the loop:
1. Queries semantic memory for governance gaps and improvement opportunities
2. Scores potential tasks by alignment, impact, and urgency
3. Selects the highest value task to execute next
4. Feeds directly into draft_lint_repair workflow
"""

import os
import json
import hashlib
from datetime import datetime, timedelta, UTC
from typing import List, Dict, Tuple
from context_assembly import retrieve_context, get_current_state_hash, get_collection_stats, get_chroma_collection

# -----------------------------------------------------------------------------
# CONFIGURATION
# -----------------------------------------------------------------------------
TASK_SCORE_WEIGHTS = {
    "alignment": 0.40,    # How well it matches Canon / Identity
    "impact": 0.30,       # How much value this change delivers
    "urgency": 0.15,      # Time sensitivity
    "feasibility": 0.15   # Likelihood of successful completion
}

MINIMUM_TASK_SCORE = 0.55
MAX_CANDIDATE_TASKS = 8

# -----------------------------------------------------------------------------
# TASK DISCOVERY
# -----------------------------------------------------------------------------

def find_candidate_tasks() -> List[Dict]:
    """Query semantic memory to discover potential tasks and improvements."""
    
    task_queries = [
        {"query": "governance gap inconsistency violation canon principle", "type": "governance_fix", "base_score": 0.9},
        {"query": "code improvement refactor optimization technical debt", "type": "code_improvement", "base_score": 0.7},
        {"query": "bug error failure issue broken problem", "type": "bug_fix", "base_score": 0.85},
        {"query": "documentation missing unclear outdated", "type": "documentation", "base_score": 0.6},
        {"query": "feature enhancement capability improvement", "type": "feature", "base_score": 0.65},
        {"query": "security vulnerability risk hardening", "type": "security", "base_score": 0.95},
        {"query": "performance slow bottleneck optimization", "type": "performance", "base_score": 0.75},
        {"query": "identity alignment purpose mission", "type": "alignment", "base_score": 0.8}
    ]
    
    candidates = []
    
    for query_def in task_queries:
        chunks, state_hash = retrieve_context(query_def["query"], limit=3)
        
        for chunk in chunks:
            if chunk["confidence"] > 0.6:
                task = {
                    "type": query_def["type"],
                    "description": chunk["text"][:250] + ("..." if len(chunk["text"]) > 250 else ""),
                    "source": chunk["metadata"].get("source", "memory"),
                    "confidence": chunk["confidence"],
                    "base_score": query_def["base_score"],
                    "chunk_reference": chunk["metadata"],
                    "discovered_at": datetime.now().isoformat()
                }
                candidates.append(task)
    
    # Deduplicate similar tasks
    seen = set()
    unique_candidates = []
    
    for task in candidates:
        sig = hashlib.sha256(f"{task['type']}:{task['description'][:100]}".encode()).hexdigest()[:12]
        if sig not in seen:
            seen.add(sig)
            unique_candidates.append(task)
    
    return unique_candidates

# -----------------------------------------------------------------------------
# TASK SCORING
# -----------------------------------------------------------------------------

def get_relevant_history(query: str, n: int = 5):
    col = get_chroma_collection("oinio_history")
    results = col.query(query_texts=[query], n_results=n)
    
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    
    return list(zip(documents, metadatas))

def get_synthesized_principles():
    """Load synthesized universal principles from dream cycle"""
    from pathlib import Path
    import json
    
    synth_dir = Path("state/memory")
    if not synth_dir.exists():
        return {}
    
    # Find latest synthesis file
    synth_files = sorted(synth_dir.glob("synthesis_*.json"), reverse=True)
    if not synth_files:
        return {}
    
    try:
        with open(synth_files[0], 'r') as f:
            data = json.load(f)
            principles = data.get("principles", [])
            return {p["strategy"]: p["weight_modifier"] for p in principles}
    except:
        return {}

def compute_history_modifier(history, target_file=None):
    success_count = 0
    failure_count = 0

    for doc, meta in history:
        if not meta:
            continue

        # Only consider same file or related domain
        if target_file and meta.get("file") and meta.get("file") != target_file:
            continue

        if meta.get("success") is True:
            success_count += 1
        elif meta.get("success") is False:
            failure_count += 1

    # Controlled weighting (prevents runaway bias)
    modifier = 0.0
    modifier += min(success_count * 0.15, 0.45)   # cap boost
    modifier -= min(failure_count * 0.25, 0.75)   # stronger penalty
    
    # Apply synthesized universal principles
    principles = get_synthesized_principles()
    strategy = None
    if history and history[0] and history[0][1]:
        strategy = history[0][1].get("strategy")
    
    if strategy and strategy in principles:
        modifier += principles[strategy]

    return modifier

def recent_failures(history, minutes=30, threshold=2):
    cutoff = datetime.now(UTC) - timedelta(minutes=minutes)
    count = 0

    for _, meta in history:
        if not meta:
            continue

        ts = meta.get("timestamp")
        if not ts:
            continue

        try:
            ts_dt = datetime.fromisoformat(ts)
        except:
            continue

        if ts_dt > cutoff and meta.get("success") is False:
            count += 1

    return count

def strategy_failed_multiple_times(history, strategy, threshold=2):
    count = 0
    for _, meta in history:
        if meta and meta.get("strategy") == strategy and meta.get("success") is False:
            count += 1
    return count >= threshold

def score_task(task: Dict, system_health: Dict) -> float:
    """Score a single task using weighted criteria."""
    
    alignment_score = task["confidence"] * task["base_score"]
    impact_score = {
        "security": 1.0,
        "governance_fix": 0.95,
        "bug_fix": 0.9,
        "performance": 0.8,
        "code_improvement": 0.7,
        "feature": 0.6,
        "documentation": 0.5,
        "alignment": 0.9
    }.get(task["type"], 0.5)
    
    # Urgency increases if system health is degraded
    urgency_score = 0.5 + (1.0 - system_health["overall_health"]) * 0.5
    
    feasibility_score = 0.7  # Default - can be refined later
    
    # Apply historical memory modifier
    query = f"{task.get('type')} {task.get('target_file', '')} {task.get('category', '')}"
    history = get_relevant_history(query)
    
    history_modifier = compute_history_modifier(history, target_file=task.get('target_file'))
    
    final_score = (
        alignment_score * TASK_SCORE_WEIGHTS["alignment"] +
        impact_score * TASK_SCORE_WEIGHTS["impact"] +
        urgency_score * TASK_SCORE_WEIGHTS["urgency"] +
        feasibility_score * TASK_SCORE_WEIGHTS["feasibility"]
    )
    
    final_score += history_modifier
    
    # Apply failure guard - prevent infinite retry loops (time-aware)
    if recent_failures(history) >= 2:
        final_score -= 0.5

    # Enforce strategy diversity - avoid repeating failed approaches
    current_strategy = task.get('strategy', 'default')
    if strategy_failed_multiple_times(history, current_strategy):
        final_score -= 0.4
    
    return round(max(min(final_score, 1.0), 0.0), 4)

# -----------------------------------------------------------------------------
# SYSTEM SELF-ASSESSMENT
# -----------------------------------------------------------------------------

def assess_system_health() -> Dict:
    """Perform full self-assessment of current system state."""
    
    stats = get_collection_stats()
    memory_count = stats["count"]
    
    checks = {
        "memory_initialized": memory_count > 0,
        "state_hash_valid": len(stats["state_hash"]) == 16,
        "log_directory_exists": os.path.exists("logs"),
        "state_directory_exists": os.path.exists("state"),
        "canon_accessible": os.path.exists("/home/kris/forge/Quantum-pi-forge/Canon"),
        "identity_map_exists": os.path.exists("/home/kris/forge/forge_identity_map.txt")
    }
    
    passed = sum(1 for v in checks.values() if v)
    total = len(checks)
    
    overall_health = round(passed / total, 4)
    
    return {
        "overall_health": overall_health,
        "checks": checks,
        "memory_chunks": memory_count,
        "state_hash": stats["state_hash"],
        "assessed_at": datetime.now().isoformat()
    }

# -----------------------------------------------------------------------------
# MAIN SELECTION LOGIC
# -----------------------------------------------------------------------------

def select_next_task() -> Tuple[Dict, Dict]:
    """
    Run full assessment and select the highest priority task to execute.
    Returns (selected_task, system_health)
    """
    
    system_health = assess_system_health()
    candidates = find_candidate_tasks()
    
    # Score all candidates
    scored_tasks = []
    for task in candidates:
        task["score"] = score_task(task, system_health)
        scored_tasks.append(task)
    
    # Sort by score descending
    scored_tasks.sort(key=lambda x: x["score"], reverse=True)
    
    # Filter to tasks above minimum threshold
    valid_tasks = [t for t in scored_tasks if t["score"] >= MINIMUM_TASK_SCORE]

    # Apply drift repair historical weighting
    current_state = assess_system_health()
    last_action = valid_tasks[0].get("type", "") if valid_tasks else ""
    current_file = valid_tasks[0].get("target_file") if valid_tasks else None
    
    if current_state.get("drift_detected") or "repair" in str(last_action):
        hist_mod = compute_history_modifier(get_relevant_history(f"drift repair {current_file or 'governance'}"), current_file)
        for task in valid_tasks:
            if "repair" in task["type"] or "governance" in task["type"] or "drift" in task["type"]:
                task["score"] += hist_mod
        # Re-sort after applying modifier
        valid_tasks.sort(key=lambda x: x["score"], reverse=True)

    if not valid_tasks:
        # Fallback default task
        return {
            "type": "monitoring",
            "description": "Perform system health monitoring and memory maintenance",
            "score": 0.5,
            "source": "fallback",
            "discovered_at": datetime.now().isoformat()
        }, system_health
    
    return valid_tasks[0], system_health

def get_task_execution_prompt(task: Dict) -> str:
    """Generate execution prompt for draft_lint_repair workflow."""
    
    context_prompt = f"""
TASK SELECTED: {task['type']}
SCORE: {task['score']}
SOURCE: {task['source']}

DESCRIPTION:
{task['description']}

You are now authorized to execute this task through the Draft-Lint-Repair loop.
Follow all governance rules and Canon principles.
"""
    
    return context_prompt

# -----------------------------------------------------------------------------
# SELF-ASSESSMENT REPORT
# -----------------------------------------------------------------------------

def generate_aliveness_report() -> Dict:
    """Generate formal 'How alive am I today?' report."""
    
    health = assess_system_health()
    top_task, _ = select_next_task()
    stats = get_collection_stats()
    
    report = {
        "generated_at": datetime.now().isoformat(),
        "aliveness_score": round(health["overall_health"] * 0.85 + (1 if top_task["score"] > 0.6 else 0) * 0.15, 4),
        "system_health": health,
        "next_task": top_task,
        "memory_stats": stats,
        "cycle_status": "ACTIVE" if health["overall_health"] > 0.7 else "DEGRADED",
        "autonomy_level": "FULL_AUTONOMOUS" if health["overall_health"] > 0.85 and top_task["score"] > 0.65 else
                          "SEMI_AUTONOMOUS" if health["overall_health"] > 0.6 else
                          "MONITOR_ONLY"
    }
    
    return report