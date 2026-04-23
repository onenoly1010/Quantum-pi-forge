#!/usr/bin/env python3
import os
import json
import subprocess
import requests
from pathlib import Path

def safe_parse(raw_output):
    """Schema validation and conservative fallback."""
    fallback = {
        "drift_detected": True, 
        "severity": "high", 
        "analysis": "CRITICAL: LLM output malformed or failed to parse. Defaulting to high risk."
    }
    try:
        data = json.loads(raw_output)
        if all(k in data for k in ["drift_detected", "severity", "analysis"]):
            return data
        return fallback
    except (json.JSONDecodeError, TypeError):
        return fallback

def load_identity_map(path="forge_identity_map.txt"):
    if os.path.exists(path):
        with open(path, "r") as f:
            return f.read()[:2000]
    return "Core identity: OINIO Soul protecting the Quantum Pi Forge Canon."

def get_recent_git_diff(limit=3):
    try:
        result = subprocess.run(["git", "log", f"-{limit}", "-p"], capture_output=True, text=True)
        return result.stdout[:3000] 
    except Exception as e:
        return f"Git error: {str(e)}"

def scan_for_drift():
    identity = load_identity_map()
    recent_changes = get_recent_git_diff()

    prompt = f"""
You are the OINIO Soul Drift Scanner.
Your task is to analyze recent code changes against the Forge Identity Map.
Look for violations of Epistemic Humility, unverified assumptions, or centralized dependencies.

=== IDENTITY MAP EXCERPT ===
{identity}

=== RECENT CHANGES ===
{recent_changes}

Analyze the changes. If there is philosophical or technical drift, explain why.
If aligned, output 'ALIGNMENT VERIFIED'.
Output must be strictly JSON formatted:
{{
    "drift_detected": boolean,
    "severity": "low|medium|high|none",
    "analysis": "string detailing the findings"
}}
"""

    try:
        response = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }, timeout=30)
        return safe_parse(response.json().get('response', '{}'))
    except Exception as e:
        return {"drift_detected": True, "severity": "high", "analysis": f"Scanner connection error: {e}"}

if __name__ == "__main__":
    print("🔍 Initiating Deep Reflection Drift Scan...")
    report = scan_for_drift()
    os.makedirs("state", exist_ok=True)
    with open("state/drift_report.json", "w") as f:
        json.dump(report, f, indent=2)
    print(f"\nResults:\n{json.dumps(report, indent=2)}")