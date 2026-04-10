#!/usr/bin/env python3

import psutil
import datetime
import os

os.makedirs("soul-ledger", exist_ok=True)

def get_system_stability():
    mem = psutil.virtual_memory()
    swap = psutil.swap_memory()
    
    stability_score = (mem.available / mem.total) * 100
    
    report = f"""
OINIO Soul Fragment 001 - {datetime.datetime.now()}
Available RAM: {mem.available / (1024**3):.2f} GiB
Swap used: {swap.used / (1024**3):.2f} GiB
Stability score: {stability_score:.1f}%
Status: {"Stable" if stability_score > 25 else "Warning - conserve memory"}
"""
    print(report)

    with open("soul-ledger/soul-log.txt", "a") as f:
        f.write(report + "\n")

    return stability_score

if __name__ == "__main__":
    get_system_stability()
