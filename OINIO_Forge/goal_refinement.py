#!/usr/bin/env python3
"""
Day 2 Implementation: Goal Refinement Loop
Enables autonomous goal generation, tracking and alignment with Canon principles
Part of 7 Day Activation Map
"""

import json
import os
from pathlib import Path
from datetime import datetime
from typing import List, Dict
from context_assembly import retrieve_context, _client

def get_chroma_collection(name):
    return _client.get_or_create_collection(name)
from task_selector import assess_system_health

GOALS_FILE = Path("/home/kris/forge/Quantum-pi-forge/goals.md")
COLLECTION_NAME = "oinio_goals"

def propose_new_goal() -> Dict:
    """
    Propose a new strategic goal based on observed system state, drift and Canon principles
    Returns structured goal proposal with success metrics
    """
    
    system_health = assess_system_health()
    
    # Retrieve recent context about system gaps
    context_chunks, _ = retrieve_context(
        "system drift unmet need improvement opportunity canon principle alignment gap",
        limit=5
    )
    
    # Build context summary
    context_summary = "\n".join([f"- {chunk['text'][:200]}" for chunk in context_chunks])
    
    # This would normally call Ollama, simplified implementation for Day 2
    goal_templates = [
        {
            "goal": "Improve semantic lint coverage for governance files",
            "success_metrics": [
                "All governance files have at least 80% lint coverage",
                "No uncaught drift violations for 3 consecutive cycles",
                "Governance change approval rate increases by 20%"
            ],
            "priority": 0.75,
            "estimated_duration_hours": 72
        },
        {
            "goal": "Implement automatic memory pruning and summarization",
            "success_metrics": [
                "ChromaDB collection size remains under 10,000 entries",
                "Query performance improves by 30%",
                "No loss of critical canonical information"
            ],
            "priority": 0.68,
            "estimated_duration_hours": 48
        },
        {
            "goal": "Expand drift detection to include commit history analysis",
            "success_metrics": [
                "System can identify drift introduced over multiple commits",
                "False positive rate below 10%",
                "Drift detection latency under 2 minutes"
            ],
            "priority": 0.82,
            "estimated_duration_hours": 96
        }
    ]
    
    # Select goal based on system health
    if system_health["overall_health"] < 0.7:
        selected_goal = goal_templates[0]
    elif system_health["memory_chunks"] > 500:
        selected_goal = goal_templates[1]
    else:
        selected_goal = goal_templates[2]
    
    selected_goal.update({
        "proposed_at": datetime.now().isoformat(),
        "proposer": "oinio_soul",
        "status": "PROPOSED",
        "context_basis": context_summary
    })
    
    return selected_goal

def record_goal(goal: Dict) -> bool:
    """Record proposed goal to goals.md file and meta-memory"""
    
    # Append to goals file
    goal_entry = f"""
---
## 🎯 Proposed Goal: {goal['goal']}

**Proposed:** {goal['proposed_at']}  
**Priority:** {goal['priority']*100:.0f}%  
**Duration:** {goal['estimated_duration_hours']}h

### Success Metrics:
"""
    for metric in goal['success_metrics']:
        goal_entry += f"- [ ] {metric}\n"
    
    goal_entry += "\n**Status:** PENDING_HUMAN_APPROVAL\n---\n"
    
    # Create file if doesn't exist
    if not GOALS_FILE.exists():
        GOALS_FILE.write_text("# OINIO Soul Strategic Goals\n\nThis file contains goals proposed by the autonomous agent. Human steward approval required before activation.\n\n")
    
    with open(GOALS_FILE, "a") as f:
        f.write(goal_entry)
    
    # Store in meta-memory
    collection = get_chroma_collection(COLLECTION_NAME)
    collection.add(
        documents=[json.dumps(goal, indent=2)],
        metadatas=[{
            "type": "goal_proposal",
            "priority": goal["priority"],
            "status": "PROPOSED",
            "timestamp": goal["proposed_at"]
        }],
        ids=[f"goal_{int(datetime.now().timestamp())}"]
    )
    
    return True

def get_active_goals() -> List[Dict]:
    """Get list of approved active goals"""
    collection = get_chroma_collection(COLLECTION_NAME)
    
    results = collection.query(
        query_texts=["active approved goal"],
        n_results=5,
        where={"status": "APPROVED"}
    )
    
    return [json.loads(doc) for doc in results["documents"][0]] if results["documents"] else []

def inject_goal_scoring(task_selector):
    """Patch task selector to prioritize tasks that advance active goals"""
    
    # This function extends the task scoring logic
    original_score_task = task_selector.score_task
    
    def enhanced_score_task(task, system_health):
        base_score = original_score_task(task, system_health)
        
        active_goals = get_active_goals()
        goal_alignment_bonus = 0.0
        
        for goal in active_goals:
            # Check if task aligns with this goal
            if any(keyword in task["description"].lower() for keyword in goal["goal"].lower().split()):
                goal_alignment_bonus += 0.15
        
        return min(base_score + goal_alignment_bonus, 1.0)
    
    task_selector.score_task = enhanced_score_task
    return True

if __name__ == "__main__":
    print("OINIO Goal Refinement System")
    print("============================")
    
    print("\n🔍 Proposing new strategic goal...")
    goal = propose_new_goal()
    
    print(f"\n✅ Proposed Goal: {goal['goal']}")
    print(f"Priority: {goal['priority']*100:.0f}%")
    print(f"Duration: {goal['estimated_duration_hours']}h")
    
    print("\n📋 Success Metrics:")
    for metric in goal['success_metrics']:
        print(f"  - {metric}")
    
    print("\n💾 Recording goal...")
    record_goal(goal)
    
    print("\n✅ Goal refinement complete")