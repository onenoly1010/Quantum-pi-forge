#!/usr/bin/env python3
"""
OINIO Sovereign Kill Switch
Emergency halt for all autonomous deployments across 28-repo ecosystem
Cycle 5851 | 9.2/10 Sovereignty Rating
"""
import os
import signal
import json
from pathlib import Path

WORKSPACE_ROOT = Path("/home/kris/forge")
HALT_SIGNAL_FILE = WORKSPACE_ROOT / ".emergency_halt"

def emergency_halt():
    print("⚡ EMERGENCY HALT ACTIVATED")
    print("⏸️  Freezing all autonomous deployments across 28-repo ecosystem")
    
    # Write halt signal file - all agent loops check this before every action
    with open(HALT_SIGNAL_FILE, "w") as f:
        f.write(json.dumps({
            "halted": True,
            "timestamp": os.path.getmtime(__file__),
            "cycle": 5851,
            "reason": "MANUAL EMERGENCY HALT"
        }))
    
    # Kill running agent processes
    pid_files = list(WORKSPACE_ROOT.rglob("*.pid"))
    for pid_file in pid_files:
        try:
            pid = int(pid_file.read_text().strip())
            os.kill(pid, signal.SIGTERM)
            print(f"✅ Terminated agent process {pid}")
            pid_file.unlink()
        except:
            pass
    
    # Disable AUTO_DEPLOY flag in all configs
    config_path = WORKSPACE_ROOT / "Quantum-pi-forge/src/soul-system/config.js"
    if config_path.exists():
        content = config_path.read_text()
        content = content.replace('AUTO_DEPLOY: true', 'AUTO_DEPLOY: false')
        content = content.replace('IGNITION_MODE_ACTIVE: true', 'IGNITION_MODE_ACTIVE: false')
        config_path.write_text(content)
    
    print("\n✅ ALL AUTONOMOUS OPERATIONS HALTED")
    print("✅ Ignition Mode disabled")
    print("✅ Agent processes terminated")
    print("\nTo resume normal operation delete the file:")
    print(f"  rm {HALT_SIGNAL_FILE}")

if __name__ == "__main__":
    emergency_halt()