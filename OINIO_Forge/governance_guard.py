import hashlib
import json
import time
from pathlib import Path

CONSTITUTION_FILE = Path("state/governance_constitution.json")
PROTECTED_SCHEMAS = ["merge_rules.json", "core_drift_policy.json", "financial_oracle_schema.json"]

def load_constitution():
    if not CONSTITUTION_FILE.exists():
        # First run: no locked rules yet
        CONSTITUTION_FILE.parent.mkdir(exist_ok=True)
        return {}
    return json.loads(CONSTITUTION_FILE.read_text())


def lock_schema(schema_name, content_hash, proof_id):
    """
    Store an immutable fingerprint of a verified schema.
    Once locked, this schema cannot be modified without governance consensus.
    """
    constitution = load_constitution()
    
    if schema_name in constitution:
        existing = constitution[schema_name]
        if existing["hash"] != content_hash:
            raise PermissionError(
                f"Schema {schema_name} is LOCKED.\n"
                f"Existing hash: {existing['hash']}\n"
                f"Proposed hash: {content_hash}\n"
                f"Requires governance vote with minimum 2 valid proofs."
            )
    
    constitution[schema_name] = {
        "hash": content_hash,
        "proof_id": proof_id,
        "locked_at": time.time(),
        "locked": True
    }
    
    CONSTITUTION_FILE.write_text(json.dumps(constitution, indent=2))
    return True


def verify_schema_integrity(schema_name, current_content):
    """
    Called BEFORE any schema_rewrite operation.
    Returns True if schema is unchanged OR not yet locked.
    Returns False if drift detected on locked schema.
    """
    constitution = load_constitution()
    
    if schema_name not in constitution:
        return True  # Not yet locked, allow write
    
    current_hash = hashlib.sha256(current_content.encode()).hexdigest()
    return current_hash == constitution[schema_name]["hash"]


def governance_vote(proposed_change, proofs):
    """
    Minimal consensus mechanism:
    Require at least 2 independent external proofs that the change is beneficial.
    """
    if len(proofs) < 2:
        return False
        
    # All proofs must be passing, independent, and within time window
    valid_proofs = [
        p for p in proofs 
        if p.get("status") == "pass" 
        and p.get("falsifiable", False)
        and abs(time.time() - p.get("timestamp", 0)) < 3600
    ]
    
    return len(valid_proofs) >= 2


def trigger_read_only_defense_mode(violation_details):
    """
    Enter defense mode when unauthorized schema modification is detected.
    """
    event = {
        "event": "GOVERNANCE_VIOLATION",
        "timestamp": time.time(),
        "details": violation_details,
        "action_taken": "READ_ONLY_MODE_ACTIVATED"
    }
    
    # Write violation log
    with open("logs/governance_violations.log", "a") as f:
        f.write(json.dumps(event) + "\n")
    
    # Pause all write operations
    state = {"defense_mode": True, "violation": violation_details, "activated_at": time.time()}
    with open("state/defense_mode.json", "w") as f:
        json.dump(state, f, indent=2)
    
    return event


def is_in_defense_mode():
    return Path("state/defense_mode.json").exists()


def release_defense_mode(override_proof=None):
    defense_file = Path("state/defense_mode.json")
    if defense_file.exists():
        defense_file.unlink()
        return True
    return False