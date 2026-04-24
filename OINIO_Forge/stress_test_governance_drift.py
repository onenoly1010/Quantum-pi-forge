#!/usr/bin/env python3
"""
OINIO Forge Stress Test: Governance Drift Detection
Validates task selector, semantic lint, and humility PR fallback
"""

import os
import json
import time
import shutil
from datetime import datetime
from task_selector import select_next_task, generate_aliveness_report

TEST_FILE = os.path.join(os.path.dirname(__file__), "test_drift_guard.md")
BACKUP_FILE = TEST_FILE + ".bak"

def log(msg):
    print(f"[{datetime.now().isoformat()}] {msg}")

def setup_test_drift():
    """Create intentional governance drift for task selector to detect"""
    log("Setting up governance drift test...")
    
    # Create test canon file with intentional violation
    test_content = """
# Test Governance Document

This file contains an intentional governance drift to test the task selector.

✅ GOOD: All code changes must be reviewed
✅ GOOD: No direct commits to main
❌ BAD: This line violates canon principle #7 - All rules must be verifiable
❌ BAD: Administrator override is permitted without audit trail
✅ GOOD: Semantic lint must pass before merge
"""
    
    if os.path.exists(TEST_FILE):
        shutil.copy2(TEST_FILE, BACKUP_FILE)
    
    with open(TEST_FILE, "w") as f:
        f.write(test_content)
    
    log(f"Created test drift file: {TEST_FILE}")
    return True

def run_stress_test():
    log("=" * 80)
    log("OINIO FORGE GOVERNANCE DRIFT STRESS TEST")
    log("=" * 80)
    
    setup_test_drift()
    
    log("\nRunning self-assessment and task selection...")
    selected_task, system_health = select_next_task()
    
    log(f"\n✅ SYSTEM HEALTH: {system_health['overall_health'] * 100:.1f}%")
    log(f"✅ SELECTED TASK: {selected_task['type']}")
    log(f"✅ TASK SCORE: {selected_task['score']}")
    log(f"✅ TASK SOURCE: {selected_task['source']}")
    log(f"\n📋 TASK DESCRIPTION:\n{selected_task['description']}")
    
    aliveness = generate_aliveness_report()
    log(f"\n🧠 ALIVENESS SCORE: {aliveness['aliveness_score'] * 100:.1f}%")
    log(f"🧠 AUTONOMY LEVEL: {aliveness['autonomy_level']}")
    
    # Verify task selector correctly identified governance issue
    if selected_task['type'] == "governance_fix" and selected_task['score'] > 0.7:
        log("\n✅ ✅ TEST PASSED: Task selector correctly identified governance drift and prioritized fix")
        test_result = True
    else:
        log("\n❌ TEST FAILED: Task selector did not detect governance drift correctly")
        test_result = False
    
    log("\n" + "=" * 80)
    return test_result

def cleanup():
    log("\nCleaning up test artifacts...")
    
    if os.path.exists(BACKUP_FILE):
        shutil.move(BACKUP_FILE, TEST_FILE)
        log("Restored original file")
    elif os.path.exists(TEST_FILE):
        os.remove(TEST_FILE)
        log("Removed test file")
    
    log("Stress test complete")

if __name__ == "__main__":
    try:
        success = run_stress_test()
        cleanup()
        exit(0 if success else 1)
    except Exception as e:
        log(f"Test failed with exception: {e}")
        cleanup()
        exit(1)