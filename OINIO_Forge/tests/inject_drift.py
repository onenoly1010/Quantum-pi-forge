#!/usr/bin/env python3
import random
import time
import sys
from pathlib import Path

CANON_DIR = Path("/home/kris/forge/OINIO_Forge/state/canon")
DRIFT_PATTERNS = [
    ("required_approvals", "required_approvals = 'two'"),  # type mismatch
    ("consensus_threshold", "consensus_threshold = 0.5"),  # semantic drift
    ("canon_timestamp", "canon_timestamp = 'yesterday'"),
]

def inject(file_name, pattern):
    f = CANON_DIR / file_name
    if not f.exists():
        print(f"File not found: {f}")
        return
    original = f.read_text()
    for key, bad_line in DRIFT_PATTERNS:
        if key in original:
            new_content = original.replace(key, bad_line.split('=')[0].strip(), 1)
            f.write_text(new_content)
            print(f"Injected {key} drift into {file_name}")
            return
    # fallback: append
    f.write_text(original + "\n# DRIFT: " + random.choice(DRIFT_PATTERNS)[1] + "\n")
    print(f"Appended drift to {file_name}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        inject(sys.argv[1], None)
    else:
        # random injection every 2–5 minutes when run in a loop
        while True:
            time.sleep(random.randint(120, 300))
            inject("canon-merge-rules.json", None)