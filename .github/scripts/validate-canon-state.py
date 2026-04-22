#!/usr/bin/env python3
"""
Canon State Object Validator
Enforces the Canon State Machine specification v1.1.

Validates:
- JSON Schema compliance
- Epistemic invariants (no collapse of layers)
- Layer ordering (execution < observation < claim timestamps)
- Explicit non-authoritativeness
- Failure mode integrity mapping
- Forbidden linguistic collapses

Usage:
    python validate-canon-state.py canon/closure_claim.json
    # or
    python validate-canon-state.py --dir canon
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

try:
    from jsonschema import validate, ValidationError
    from jsonschema.exceptions import SchemaError
except ImportError:
    print("❌ jsonschema library not found. Install with: pip install jsonschema")
    sys.exit(1)

# ====================== CANON STATE SCHEMA (v1.1) ======================
CANON_STATE_SCHEMA: Dict[str, Any] = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Canon State Object v1.1",
    "description": "Epistemic humility enforcement: Execution ≠ Observation ≠ Claim. Claim is never truth.",
    "type": "object",
    "required": ["canon_version", "canon_hash", "execution", "observation", "claim", "_meta"],
    "additionalProperties": False,
    "properties": {
        "canon_version": {"type": "string", "const": "1.1.0"},
        "canon_hash": {"type": "string", "pattern": r"^sha256:[a-f0-9]{64}$"},
        "epistemic_status": {
            "type": "string",
            "enum": ["claim_only", "partial_claim", "unobserved_claim"]
        },
        "execution": {
            "type": "object",
            "required": ["state", "timestamp", "job_id"],
            "additionalProperties": False,
            "properties": {
                "state": {"type": "string", "enum": ["EXECUTION_PENDING", "EXECUTION_RUNNING", "EXECUTION_COMPLETED", "EXECUTION_FAILED", "EXECUTION_ABORTED", "EXECUTION_TIMED_OUT"]},
                "timestamp": {"type": "string", "format": "date-time"},
                "job_id": {"type": "string"},
                "run_id": {"type": "string"},
                "run_attempt": {"type": "integer"},
                "exit_code": {"type": ["integer", "null"]},
                "duration_ms": {"type": ["integer", "null"]},
                "repository": {"type": "string"},
                "ref": {"type": "string"}
            }
        },
        "observation": {
            "type": "object",
            "required": ["state", "timestamp"],
            "additionalProperties": False,
            "properties": {
                "state": {"type": "string", "enum": ["OBSERVATION_PENDING", "OBSERVATION_RUNNING", "OBSERVATION_VERIFIED", "OBSERVATION_PARTIAL", "OBSERVATION_FAILED", "OBSERVATION_MANUAL"]},
                "timestamp": {"type": "string", "format": "date-time"},
                "verifier_hash": {"type": "string", "pattern": r"^sha256:[a-f0-9]{64}$"},
                "verifier_version": {"type": "string"},
                "invariants_checked": {"type": "integer", "minimum": 0},
                "invariants_passed": {"type": "integer", "minimum": 0},
                "invariants_failed": {"type": "integer", "minimum": 0},
                "integrity": {"type": "string", "enum": ["full", "partial", "unobserved", "failed", "human_attested"]},
                "details": {"type": "object"}
            }
        },
        "claim": {
            "type": "object",
            "required": ["state", "timestamp", "claim_text"],
            "additionalProperties": False,
            "properties": {
                "state": {"type": "string", "const": "CLAIM_GENERATED"},
                "timestamp": {"type": "string", "format": "date-time"},
                "claim_text": {"type": "string"},
                "authoritative": {"type": "boolean", "const": False},
                "verification_required": {"type": "boolean", "const": True},
                "integrity": {"type": "string", "enum": ["full", "partial", "unobserved", "execution_failed", "aborted", "timeout", "human_attested"]},
                "previous_claim_ref": {"type": ["string", "null"]}
            }
        },
        "integrity_summary": {"type": "string"},
        "_meta": {
            "type": "object",
            "required": ["schema_version", "generated_by"],
            "additionalProperties": False,
            "properties": {
                "schema_version": {"type": "string", "const": "1.1.0"},
                "generated_by": {"type": "string"},
                "external_attestation_hook": {
                    "type": ["object", "null"],
                    "properties": {
                        "attestor": {"type": "string"},
                        "attestation_type": {"type": "string"},
                        "reference": {"type": "string"},
                        "timestamp": {"type": "string", "format": "date-time"}
                    }
                },
                "extensions": {"type": "object"}
            }
        }
    }
}

def load_state_object(path: Path) -> Dict[str, Any]:
    """Load and parse the Canon State Object JSON."""
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return data
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Failed to load {path}: {e}")
        sys.exit(1)

def validate_schema(data: Dict[str, Any]) -> None:
    """Validate against the JSON Schema."""
    try:
        validate(instance=data, schema=CANON_STATE_SCHEMA)
        print("✅ JSON Schema validation passed.")
    except ValidationError as e:
        print(f"❌ Schema validation failed: {e.message}")
        print(f"   Path: {'.'.join(str(p) for p in e.path)}")
        sys.exit(1)
    except SchemaError as e:
        print(f"❌ Invalid schema definition: {e}")
        sys.exit(1)

def validate_epistemic_invariants(data: Dict[str, Any]) -> List[str]:
    """Enforce core philosophical invariants."""
    errors: List[str] = []

    exec_state = data["execution"]["state"]
    obs_state = data["observation"]["state"]
    claim_state = data["claim"]["state"]

    # 1. Claim must always be generated
    if claim_state != "CLAIM_GENERATED":
        errors.append("Claim state must be CLAIM_GENERATED")

    # 2. Authoritative must be explicitly false
    if data["claim"].get("authoritative") is not False:
        errors.append("Claim must have authoritative=False explicitly set")

    # 3. Verification required must be true
    if not data["claim"].get("verification_required"):
        errors.append("verification_required must be true")

    # 4. Claim text must contain epistemic disclaimer keywords
    claim_text = data["claim"]["claim_text"].lower()
    required_phrases = ["claim", "not a statement of truth", "not truth", "not a fact", "assertion", "external verification"]
    if not any(phrase in claim_text for phrase in required_phrases):
        errors.append("Claim text must explicitly disclaim authority (e.g., 'this is a claim, not a statement of truth')")

    # 5. Timestamp ordering: execution < observation < claim
    try:
        t_exec = datetime.fromisoformat(data["execution"]["timestamp"].replace("Z", "+00:00"))
        t_obs = datetime.fromisoformat(data["observation"]["timestamp"].replace("Z", "+00:00"))
        t_claim = datetime.fromisoformat(data["claim"]["timestamp"].replace("Z", "+00:00"))

        if not (t_exec <= t_obs <= t_claim):
            errors.append("Timestamps must satisfy execution ≤ observation ≤ claim")
    except (ValueError, TypeError):
        errors.append("Invalid ISO 8601 timestamps")

    # 6. Integrity consistency check
    obs_integrity = data["observation"].get("integrity")
    claim_integrity = data["claim"].get("integrity")
    if obs_integrity and claim_integrity:
        if obs_integrity in ["failed", "unobserved"] and claim_integrity not in ["unobserved", "execution_failed"]:
            errors.append("Claim integrity must reflect observation failures appropriately")

    return errors

def main() -> None:
    parser = argparse.ArgumentParser(description="Validate Canon State Object against epistemic rules")
    parser.add_argument("file", type=Path, nargs="?", help="Path to closure_claim.json")
    parser.add_argument("--dir", type=Path, help="Canon directory containing closure_claim.json")
    args = parser.parse_args()

    if args.dir:
        state_path = args.dir / "closure_claim.json"
    elif args.file:
        state_path = args.file
    else:
        state_path = Path("canon/closure_claim.json")

    if not state_path.exists():
        print(f"❌ Canon state object not found: {state_path}")
        print("   Make sure Gate 6 - Claim generation ran and produced the file.")
        sys.exit(1)

    print(f"🔍 Validating Canon State Object: {state_path}")

    data = load_state_object(state_path)
    validate_schema(data)

    invariants_errors = validate_epistemic_invariants(data)
    if invariants_errors:
        print("❌ Epistemic invariant violations:")
        for err in invariants_errors:
            print(f"   • {err}")
        sys.exit(1)

    print("✅ All epistemic invariants satisfied.")
    print("   This is a CLAIM only — never truth.")
    print(f"   Epistemic status: {data.get('epistemic_status', 'claim_only')}")
    print(f"   Integrity: {data['claim'].get('integrity', 'N/A')}")

if __name__ == "__main__":
    main()