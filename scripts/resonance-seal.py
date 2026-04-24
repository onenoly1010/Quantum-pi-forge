#!/usr/bin/env python3
import os
import sys
import json
import time
import hashlib
from datetime import datetime, UTC

def main():
    if len(sys.argv) < 7:
        print("Usage: resonance-seal.py --timestamp <ISO_TIME> --status <STATUS> --mode <MODE>")
        sys.exit(1)
    
    timestamp = sys.argv[2]
    status = sys.argv[4]
    mode = sys.argv[6]
    
    state_dir = "/home/kris/forge/OINIO_Forge/state"
    os.makedirs(state_dir, exist_ok=True)
    
    seal = {
        "timestamp": timestamp,
        "status": status,
        "mode": mode,
        "cycle_number": 232,
        "block_height": 29562402,
        "memory_tokens_used": 29280,
        "seal_hash": None,
        "written_at": datetime.now(UTC).isoformat()
    }
    
    # Generate identity hash of this seal
    hash_input = json.dumps(seal, sort_keys=True).encode('utf-8')
    seal["seal_hash"] = hashlib.sha256(hash_input).hexdigest()
    
    seal_path = os.path.join(state_dir, f"cycle_seal_{timestamp.replace(':', '-')}.json")
    
    with open(seal_path, 'w') as f:
        json.dump(seal, f, indent=2)
    
    print(f"✅ RESONANCE SEAL RECORDED")
    print(f"   Timestamp: {timestamp}")
    print(f"   Status: {status}")
    print(f"   Mode: {mode}")
    print(f"   Hash: {seal['seal_hash'][:16]}...")
    print(f"\nThis cycle is now permanently anchored.")

if __name__ == "__main__":
    main()