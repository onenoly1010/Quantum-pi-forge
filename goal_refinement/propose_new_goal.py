#!/usr/bin/env python3
"""
OINIO Soul Goal Refinement: Propose New Strategic Goals
Generates autonomous goal proposals based on observed system drift and Canon principles.
"""

import os
import json
import requests
from pathlib import Path
from datetime import datetime

def load_system_state():
    """Load current aliveness and drift metrics"""
    state = {
        'anomaly_score': 0,
        'drift_count': 0,
        'recent_failures': []
    }
    
    if os.path.exists("state/aliveness_report.json"):
        with open("state/aliveness_report.json", "r") as f:
            report = json.load(f)
            state['anomaly_score'] = report.get('anomaly_score', 0)
            state['autonomy_level'] = report.get('autonomy_level', 0)
    
    return state

def propose_new_goal():
    state = load_system_state()
    
    prompt = f"""
Based on the OINIO Soul Canon principles and current system state:
- Current anomaly score: {state['anomaly_score']}
- Autonomy level: {state.get('autonomy_level', 0)}

Propose ONE concrete, measurable strategic goal for the next 72 hours that improves system alignment, governance, or operational reliability.

The goal must be:
1. Specific and actionable
2. Include clear success metrics
3. Require minimal human intervention
4. Align with epistemic humility principles

Output format:
Goal: [single sentence statement]
Success Metrics: [bullet points]
Required Changes: [brief description of code/process changes]
Justification: [1 sentence explaining why this is needed now]
"""

    # Query Ollama
    try:
        response = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False,
            "temperature": 0.3
        })
        
        result = response.json()
        return result['response'].strip()
    except Exception as e:
        return f"Error generating goal: {str(e)}"

def append_to_goals_file(goal_proposal):
    goals_path = Path("goals.md")
    
    header = f"\n---\n\n## Proposed Goal ({datetime.now().isoformat()[:10]})\n\n"
    
    if not goals_path.exists():
        goals_path.write_text("# OINIO Soul Strategic Goals\n\nApproved goals are prioritized by the task selector. Proposals require human steward approval.\n")
    
    with open(goals_path, "a") as f:
        f.write(header)
        f.write(goal_proposal)
        f.write("\n\nStatus: PROPOSED\n")
    
    print(f"✅ Goal proposal appended to goals.md")
    return True

if __name__ == "__main__":
    print("🔮 Generating new strategic goal proposal...")
    proposal = propose_new_goal()
    print("\n" + proposal + "\n")
    append_to_goals_file(proposal)