import json
import os
import time
from datetime import datetime

MEMORY_LEDGER_PATH = os.path.join(os.path.dirname(__file__), "..", "canon", "memory_ledger.json")

def ensure_ledger_exists():
    """Ensures the memory ledger exists and is valid JSON."""
    os.makedirs(os.path.dirname(MEMORY_LEDGER_PATH), exist_ok=True)
    if not os.path.exists(MEMORY_LEDGER_PATH):
        with open(MEMORY_LEDGER_PATH, 'w') as f:
            json.dump({"events": []}, f, indent=2)

def ingest_outcome(target_file: str, strategy: str, success: bool, details: str = ""):
    """
    Ingests the outcome of an agent action into the permanent memory ledger.
    """
    ensure_ledger_exists()
    
    event = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "unix_time": int(time.time()),
        "target_file": target_file,
        "strategy": strategy,
        "success": success,
        "details": details
    }
    
    with open(MEMORY_LEDGER_PATH, 'r+') as f:
        try:
            ledger = json.load(f)
        except json.JSONDecodeError:
            ledger = {"events": []}
            
        ledger["events"].append(event)
        
        # Keep the ledger from growing infinitely (optional: cull oldest if > 1000)
        if len(ledger["events"]) > 1000:
            ledger["events"] = ledger["events"][-1000:]
            
        f.seek(0)
        json.dump(ledger, f, indent=2)
        f.truncate()
        
    print(f"🧠 Memory Ingested: [{target_file}] via '{strategy}' -> {'SUCCESS' if success else 'FAILURE'}")
    return event

if __name__ == "__main__":
    # Test execution for the pipeline
    ingest_outcome("canon/merge_rules.json", "quick_patch", False, "Validation failed post-merge.")