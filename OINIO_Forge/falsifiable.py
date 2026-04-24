import json
import hashlib
import time
from datetime import datetime, UTC

def validate_financial_oracle(output, context):
    """
    Hardened validation for the Financial Oracle:
    1. Must return float balances.
    2. Operational buffer must be mathematically sound.
    3. Cannot hallucinate balances (must match context).
    4. All tasks must demonstrate positive Net Value ROI
    """
    try:
        # Falsifiability Rule 1: Structural Integrity
        required_keys = ["polygon_balance", "gas_status", "operational_readiness", "operational_buffer"]
        if not all(k in output for k in required_keys):
            missing = [k for k in required_keys if k not in output]
            return "fail", f"Missing critical financial keys: {missing}"

        # Falsifiability Rule 2: Physical Consistency
        if not isinstance(output["polygon_balance"], (int, float)):
            return "fail", "Balance is not numeric type"
            
        if output["polygon_balance"] < 0:
            return "fail", "Negative balance detected (Physical Impossibility)"

        # Falsifiability Rule 3: Logical Consistency
        if output["gas_status"] == "CRITICAL" and output["operational_readiness"] is True:
            return "fail", "Logical Contradiction: Critical gas but marked ready"
            
        if output["operational_readiness"] is True and output["operational_buffer"] < 0.001:
            return "fail", "Logical Contradiction: Marked ready but buffer below safety threshold"

        # Falsifiability Rule 4: Context Alignment (No Hallucination)
        if context and "reference_balance" in context:
            delta = abs(output["polygon_balance"] - context["reference_balance"])
            if delta > 0.01:
                return "fail", f"Balance hallucination detected. Delta: {delta:.6f}"

        # Falsifiability Rule 5: Net Value ROI Check
        if "task_earnings" in output and "task_costs" in output:
            net_value = output["task_earnings"] - output["task_costs"]
            if net_value <= 0:
                return "fail", f"Negative Net Value ROI detected. Loss: {abs(net_value):.6f}"
            # Require minimum 1.5x return on compute energy
            if output["task_earnings"] < output["task_costs"] * 1.5:
                return "fail", f"Insufficient ROI: {output['task_earnings'] / output['task_costs']:.2f}x (requires 1.5x minimum)"

        return "pass", "Structure, Logic and ROI verified"
    except Exception as e:
        return "fail", f"Validator crashed: {str(e)}"


def validate_schema_rewriter(output, context):
    """
    Hardened validation for Schema Rewriter:
    1. Must produce actual file changes
    2. Cannot break existing invariants
    3. Must produce valid parseable code
    """
    try:
        if not output.get("files_modified", 0) > 0:
            return "fail", "Schema rewrite produced zero file changes"
            
        if output.get("parse_errors", 0) > 0:
            return "fail", "Generated code contains parse errors"
            
        if not output.get("invariants_preserved", False):
            return "fail", "Canon invariants were broken during rewrite"
            
        return "pass", "Schema rewrite verified"
    except Exception as e:
        return "fail", f"Schema validator crashed: {str(e)}"


def generate_proof(task_id, output, status, rule_id):
    """
    Deterministic Content-Addressable Proof.
    Removes nonce, uses sorted JSON dump.
    Same output ALWAYS produces same hash.
    """
    canonical_output = json.dumps(output, sort_keys=True)
    content_payload = f"{task_id}:{canonical_output}:{status}"
    
    proof_hash = hashlib.sha256(content_payload.encode()).hexdigest()
    
    return {
        "proof_hash": proof_hash,
        "rule_applied": rule_id,
        "timestamp": int(time.time()),
        "falsifiable": True,
        "payload_digest": hashlib.sha256(canonical_output.encode()).hexdigest()[:16]
    }


def apply_aliveness_asymmetry(current_score, validation_status):
    """
    Aliveness Asymmetry: The Sting
    Success: +0.02 (Slow Growth)
    Failure: -0.05 (Sharp Correction)
    
    This creates evolutionary pressure towards accuracy over speed.
    """
    if validation_status == "pass":
        new_score = min(1.0, current_score + 0.02)
        return new_score, "success_reward"
    else:
        new_score = max(0.0, current_score - 0.05)
        return new_score, "failure_penalty"


def adjust_strategy_weight(strategy_weights, strategy_id, failed=False, consecutive_failures=0, preemptive=False):
    """
    Strategy Weight Adjustment
    If failed twice: cut weight by 50% immediately
    Preemptive rejection: softer penalty (50% of normal)
    """
    if strategy_id not in strategy_weights:
        return strategy_weights
        
    if failed:
        penalty_multiplier = 0.5 if preemptive else 1.0
        
        if consecutive_failures >= 2:
            strategy_weights[strategy_id] = strategy_weights[strategy_id] * 0.5 * penalty_multiplier
        else:
            # First failure penalty
            strategy_weights[strategy_id] = strategy_weights[strategy_id] * 0.9 * penalty_multiplier
    else:
        strategy_weights[strategy_id] = min(1.0, strategy_weights[strategy_id] + 0.01)
        
    # Normalize weights
    total = sum(strategy_weights.values())
    if total > 0:
        normalized = {k: v / total for k, v in strategy_weights.items()}
        return normalized
        
    return strategy_weights


def record_validation_event(cycle_id, task_id, validation_result, proof):
    """
    Record verification event to verifier ledger AND inject into active memory
    """
    ledger_entry = {
        "cycle": cycle_id,
        "task_id": task_id,
        "status": validation_result[0],
        "message": validation_result[1],
        "proof": proof,
        "timestamp": datetime.now(UTC).isoformat()
    }
    
    ledger_path = "verifier_ledger.json"
    
    try:
        with open(ledger_path, "r") as f:
            ledger = json.load(f)
    except:
        ledger = []
        
    ledger.append(ledger_entry)
    
    with open(ledger_path, "w") as f:
        json.dump(ledger[-1000:], f, indent=2)

    # Inject external proof into memory context
    try:
        from context_assembly import get_chroma_collection
        history_collection = get_chroma_collection("oinio_history")
        
        proof_memory = {
            "type": "external_proof",
            "task_id": str(task_id),
            "cycle": cycle_id,
            "status": validation_result[0],
            "proof_hash": proof['proof_hash'] if proof else None,
            "timestamp": ledger_entry['timestamp']
        }
        
        history_collection.upsert(
            ids=[f"proof_{cycle_id}_{task_id}"],
            documents=[json.dumps(proof_memory, indent=2)],
            metadatas={
                "type": "external_proof",
                "status": validation_result[0],
                "cycle": cycle_id,
                "task_id": str(task_id),
                "trust_level": 10,
                "ingested_at": datetime.now(UTC).isoformat()
            }
        )
    except Exception as e:
        pass
        
    return ledger_entry
