import hashlib
import json
import time
from pathlib import Path
from flask import Flask, request, jsonify

app = Flask(__name__)

# Simple immutable log (acts as local "anchor")
VERIFIER_LOG = Path("verifier_ledger.json")
if not VERIFIER_LOG.exists():
    VERIFIER_LOG.write_text(json.dumps([], indent=2))

def hash_task(task_id, output):
    """Create a reproducible hash of the task outcome."""
    content = f"{task_id}:{json.dumps(output, sort_keys=True)}"
    return hashlib.sha256(content.encode()).hexdigest()

@app.route("/verify", methods=["POST"])
def verify():
    data = request.get_json()
    task_id = data.get("task_id")
    output = data.get("output")
    if not task_id or output is None:
        return jsonify({"error": "task_id and output required"}), 400

    # Load existing ledger
    ledger = json.loads(VERIFIER_LOG.read_text())

    # Check if already verified (idempotent)
    existing = next((e for e in ledger if e["task_id"] == task_id), None)
    if existing:
        return jsonify(existing), 200

    def validate_output(output):
        # Enforce measurable structure requirement
        if isinstance(output, dict) and "result" in output:
            return "pass"
        return "fail"

    status = validate_output(output)
    
    # Create proof
    proof = {
        "task_id": task_id,
        "timestamp": int(time.time()),
        "output_hash": hash_task(task_id, output),
        "status": status,
        "validation_rule": "must_contain_result_field",
        "verifier": "local_minimal_v1"
    }

    # Append to ledger (acts as immutable anchor)
    ledger.append(proof)
    VERIFIER_LOG.write_text(json.dumps(ledger, indent=2))

    return jsonify(proof), 201

@app.route("/proof/<task_id>", methods=["GET"])
def get_proof(task_id):
    ledger = json.loads(VERIFIER_LOG.read_text())
    proof = next((e for e in ledger if e["task_id"] == task_id), None)
    if not proof:
        return jsonify({"error": "not found"}), 404
    return jsonify(proof)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5050, debug=False)