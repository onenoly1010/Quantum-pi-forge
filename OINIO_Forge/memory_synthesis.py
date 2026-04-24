#!/usr/bin/env python3
"""
Memory Synthesis Module - Dream Cycle
Consolidates raw memory records into universal principles
This is where experience becomes intelligence
"""
import json
import time
from datetime import datetime
from pathlib import Path
from context_assembly import get_chroma_collection

SYNTHESIS_THRESHOLD = 100
MEMORY_DIR = Path("state/memory")

def synthesize_memory():
    """Execute dream cycle: synthesize raw memories into universal principles"""
    col = get_chroma_collection("oinio_history")
    count = col.count()
    
    if count < SYNTHESIS_THRESHOLD:
        return False, f"Memory count {count} below threshold {SYNTHESIS_THRESHOLD}"
    
    # Fetch all recent memories
    results = col.query(query_texts=["*"], n_results=SYNTHESIS_THRESHOLD)
    
    # Extract failure patterns
    failures = []
    successes = []
    strategies = {}
    
    for i, doc in enumerate(results.get("documents", [[]])[0]):
        meta = results.get("metadatas", [[]])[0][i]
        
        if not meta:
            continue
            
        strategy = meta.get("strategy", "unknown")
        
        if meta.get("success") is True:
            successes.append(doc)
            if strategy not in strategies:
                strategies[strategy] = {"success": 0, "failure": 0}
            strategies[strategy]["success"] += 1
        elif meta.get("success") is False:
            failures.append(doc)
            if strategy not in strategies:
                strategies[strategy] = {"success": 0, "failure": 0}
            strategies[strategy]["failure"] += 1
    
    # Generate universal principles
    principles = []
    
    for strategy, counts in strategies.items():
        total = counts["success"] + counts["failure"]
        if total < 3:
            continue
            
        success_rate = counts["success"] / total
        
        principle = {
            "strategy": strategy,
            "success_rate": success_rate,
            "attempts": total,
            "principle": f"Strategy '{strategy}' has {round(success_rate * 100)}% success rate over {total} attempts",
            "recommendation": "PRIORITIZE" if success_rate > 0.7 else "DEPRIORITIZE" if success_rate < 0.3 else "NEUTRAL",
            "weight_modifier": (success_rate - 0.5) * 0.5
        }
        
        principles.append(principle)
    
    # Sort principles by confidence
    principles.sort(key=lambda x: abs(x["success_rate"] - 0.5), reverse=True)
    
    # Store synthesized principles
    synthesis_path = MEMORY_DIR / f"synthesis_{int(time.time())}.json"
    MEMORY_DIR.mkdir(exist_ok=True)
    
    with open(synthesis_path, 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "memory_count": count,
            "principles_extracted": len(principles),
            "principles": principles
        }, f, indent=2)
    
    # Create latest symlink
    latest_path = MEMORY_DIR / "synthesis_latest.json"
    if latest_path.exists():
        latest_path.unlink()
    latest_path.symlink_to(synthesis_path)
    
    # Prune old raw memory records
    col.delete(results.get("ids", [[]])[0])
    
    return True, {
        "memory_count": count,
        "principles_extracted": len(principles),
        "pruned_count": len(results.get("ids", [[]])[0]),
        "summary": f"Synthesized {count} memories into {len(principles)} universal principles, pruned {len(results.get('ids', [[]])[0])} raw records"
    }

if __name__ == "__main__":
    success, result = synthesize_memory()
    if success:
        print(f"✅ Dream cycle complete: {result['summary']}")
    else:
        print(f"⏳ Synthesis deferred: {result}")