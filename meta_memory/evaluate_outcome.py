#!/usr/bin/env python3
"""
OINIO Soul Meta-Memory: Outcome Evaluation
Measures actual impact of actions and builds behavioral bias patterns.
This is the first real learning layer: memory → evaluation → behavioral adaptation.
"""

import os
import json
from pathlib import Path
from datetime import datetime

CHROMA_PATH = Path("chroma_db")

def load_drift_report(path="state/drift_report.json"):
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return None

def calculate_improvement(before_report, after_report):
    """Calculate net system improvement between two drift scans"""
    if not before_report or not after_report:
        return 0
    
    before_avg = sum(r['alignment_score'] for r in before_report['results']) / len(before_report['results'])
    after_avg = sum(r['alignment_score'] for r in after_report['results']) / len(after_report['results'])
    
    improvement = after_avg - before_avg
    return round(improvement, 4)

def record_action_outcome(action_type, action_target, improvement, metadata=None):
    """Record evaluated outcome for future behavioral bias"""
    collection = get_history_collection()
    
    doc_text = f"""
Action Type: {action_type}
Target: {action_target}
Measured Improvement: {improvement}
Time: {datetime.now().isoformat()}
"""
    
    doc_id = f"outcome_{int(datetime.now().timestamp())}"
    
    collection.upsert(
        documents=[doc_text],
        metadatas=[{
            "type": "action_outcome",
            "action_type": action_type,
            "target": action_target,
            "improvement": improvement,
            "timestamp": datetime.now().isoformat(),
            **(metadata or {})
        }],
        ids=[doc_id]
    )
    
    print(f"✅ Recorded action outcome: {action_type} → {improvement:+.4f}")
    return True

def get_successful_patterns(limit=3):
    """Retrieve patterns that produced positive improvement"""
    collection = get_history_collection()
    
    results = collection.query(
        query_texts=["successful improvements good patterns positive outcomes"],
        where={"type": "action_outcome", "improvement": {"$gt": 0}},
        n_results=limit
    )
    
    return results['documents'][0]

def get_failed_patterns(limit=3):
    """Retrieve patterns that produced negative improvement"""
    collection = get_history_collection()
    
    results = collection.query(
        query_texts=["failed attempts bad patterns negative outcomes mistakes"],
        where={"type": "action_outcome", "improvement": {"$lt": 0}},
        n_results=limit
    )
    
    return results['documents'][0]

def inject_patterns_into_context():
    """Inject learned patterns into the context assembly"""
    patterns = []
    
    successful = get_successful_patterns(2)
    failed = get_failed_patterns(2)
    
    if successful:
        patterns.append("\n=== SUCCESSFUL PATTERNS ===\n")
        for p in successful:
            patterns.append(f"• {p[:180]}")
    
    if failed:
        patterns.append("\n=== FAILED PATTERNS (AVOID) ===\n")
        for p in failed:
            patterns.append(f"• {p[:180]}")
    
    return "\n".join(patterns)

# Import here to avoid circular reference
try:
    from meta_memory.ingest_aliveness_report import get_history_collection
except ImportError:
    pass

if __name__ == "__main__":
    # Test run
    print("🔍 Evaluating action outcomes...")
    print(inject_patterns_into_context())