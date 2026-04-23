#!/usr/bin/env python3
import json
import os

def calculate_risk_score(policy_results, drift_report):
    """
    Computes a unified risk score [0.0 - 1.0].
    0.7+ triggers an automatic block.
    """
    base_score = 0.0
    
    # 1. Policy Gates (Hard constraints)
    if not policy_results.get('lint_passed', False): base_score += 0.5
    if not policy_results.get('identity_alignment', False): base_score += 0.4
    
    # 2. Drift Analysis (Heuristic signal)
    severity_map = {"none": 0.0, "low": 0.1, "medium": 0.3, "high": 0.6}
    drift_score = severity_map.get(drift_report.get('severity', 'high'), 0.6)
    
    # Combine (Clamped at 1.0)
    final_score = min(1.0, base_score + drift_score)
    return round(final_score, 2)

def enforce_governance():
    with open("state/policy_results.json", "r") as f:
        p_res = json.load(f)
    with open("state/drift_report.json", "r") as f:
        d_rep = json.load(f)
        
    risk_score = calculate_risk_score(p_res, d_rep)
    
    decision = {
        "risk_score": risk_score,
        "action": "BLOCK" if risk_score >= 0.7 else "PROCEED",
        "timestamp": os.popen('date -u +"%Y-%m-%dT%H:%M:%SZ"').read().strip()
    }
    
    with open("state/governance_decision.json", "w") as f:
        json.dump(decision, f, indent=2)
    
    return decision

if __name__ == "__main__":
    print(enforce_governance())