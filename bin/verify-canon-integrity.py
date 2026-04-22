#!/usr/bin/env python3
"""
Canon Integrity Verifier - Gate 6 Observation Layer

This is the critical hinge between execution and claim.
It may ONLY read. It may NEVER modify.

Exit codes:
  0 = Full integrity verified
  2 = Partial integrity (some invariants passed)
  1 = Verifier failure
"""

import sys
import os
import re
import hashlib
import yaml
from pathlib import Path

FORBIDDEN_PATTERNS = [
    (r"success", "Assertion of success"),
    (r"completed successfully", "Linguistic collapse of execution into truth"),
    (r"the build passed", "Implicit truth claim"),
    (r"verified correct", "Authority assertion"),
    (r"this is correct", "Final truth claim"),
    (r"job succeeded", "Status collapse"),
]

REQUIRED_PATTERNS = [
    (r"this is a claim, not a fact", "Epistemic disclaimer"),
]

def check_forbidden_language(canon_path: Path) -> tuple[bool, list[str]]:
    """Verify no truth assertion language has slipped into generated output"""
    failures = []
    
    for root, _, files in os.walk(canon_path):
        for file in files:
            if file.endswith(('.md', '.txt', '.json', '.yml', '.yaml')):
                path = Path(root) / file
                content = path.read_text(errors='ignore')
                
                for pattern, description in FORBIDDEN_PATTERNS:
                    if re.search(pattern, content, re.IGNORECASE):
                        failures.append(f"{path}: Found forbidden pattern '{pattern}' ({description})")
    
    return len(failures) == 0, failures

def check_all_files_have_claims(canon_path: Path) -> tuple[bool, list[str]]:
    """Verify every transformed file has a corresponding claim entry"""
    failures = []
    
    index_path = canon_path / "INDEX.md"
    if not index_path.exists():
        failures.append("INDEX.md not found - cannot verify file claims")
        return False, failures
    
    index_content = index_path.read_text()
    
    for root, _, files in os.walk(canon_path):
        for file in files:
            if file == "INDEX.md":
                continue
            rel_path = os.path.relpath(Path(root) / file, canon_path)
            if rel_path not in index_content:
                failures.append(f"File {rel_path} has no corresponding claim entry in INDEX.md")
    
    return len(failures) == 0, failures

def calculate_canon_hash(canon_path: Path) -> str:
    """Compute consistent sorted hash of entire canon directory"""
    hasher = hashlib.sha256()
    
    file_hashes = []
    for root, _, files in os.walk(canon_path):
        for file in files:
            path = Path(root) / file
            file_hasher = hashlib.sha256()
            file_hasher.update(path.read_bytes())
            file_hashes.append((str(path), file_hasher.hexdigest()))
    
    for path, h in sorted(file_hashes):
        hasher.update(f"{path}:{h}".encode())
    
    return hasher.hexdigest()

def verify_workflow_invariants() -> tuple[bool, list[str]]:
    """Verify that the calling workflow itself adheres to state machine invariants"""
    failures = []
    
    workflow_path = Path(".github/workflows/_canon-state-contract.yml")
    if not workflow_path.exists():
        return True, []
    
    content = workflow_path.read_text()
    
    if "if: success()" in content:
        failures.append("Workflow contains forbidden 'if: success()' condition")
    
    if not re.search(r"if: \$\{\{ *always\(\) *\}\}", content):
        failures.append("Observation and claim layers missing required 'always()' guard")
    
    return len(failures) == 0, failures

def main():
    if len(sys.argv) != 2:
        print("Usage: verify-canon-integrity.py <canon-path>")
        sys.exit(1)
    
    canon_path = Path(sys.argv[1])
    if not canon_path.exists():
        print(f"Canon path not found: {canon_path}")
        sys.exit(1)
    
    print("=" * 72)
    print("CANON INTEGRITY VERIFIER")
    print("=" * 72)
    print()
    
    all_checks = []
    all_failures = []
    
    checks = [
        ("Forbidden language check", check_forbidden_language),
        ("File claim completeness check", check_all_files_have_claims),
        ("Workflow invariants check", verify_workflow_invariants),
    ]
    
    for name, check_fn in checks:
        print(f"▶  {name}")
        passed, failures = check_fn(canon_path)
        all_checks.append(passed)
        all_failures.extend(failures)
        
        if passed:
            print(f"   ✅ PASS")
        else:
            print(f"   ❌ {len(failures)} failures")
            for failure in failures:
                print(f"      - {failure}")
        print()
    
    canon_hash = calculate_canon_hash(canon_path)
    print(f"Canon directory hash: sha256:{canon_hash}")
    print()
    
    passed_count = sum(all_checks)
    total_count = len(all_checks)
    
    print(f"Result: {passed_count}/{total_count} invariants passed")
    
    if passed_count == total_count:
        print("Status: FULL INTEGRITY")
        print()
        sys.exit(0)
    elif passed_count > 0:
        print("Status: PARTIAL INTEGRITY")
        print()
        sys.exit(2)
    else:
        print("Status: INTEGRITY VERIFICATION FAILED")
        print()
        sys.exit(1)

if __name__ == "__main__":
    main()