#!/usr/bin/env python3
"""
Environmental Watchdog - Sovereign Node Sensory System
Monitors real-world conditions and triggers defensive modes
Designed for cross-continental deployment on the Spiral Return trek
"""
import os
import time
import socket
import shutil
import subprocess
from pathlib import Path
from datetime import datetime

WATCHDOG_INTERVAL = 60
OFFLINE_THRESHOLD_MS = 800
STORAGE_CRITICAL_THRESHOLD = 0.90

class EnvironmentalWatchdog:
    def __init__(self):
        self.state = {
            "network_latency_ms": 0,
            "storage_used_percent": 0,
            "connectivity": "ONLINE",
            "power_state": "AC",
            "defense_mode": "NORMAL",
            "last_updated": None
        }

    def ping_host(self, host: str = "rpc.0g.ai", port: int = 443, timeout: int = 2) -> float:
        """Measure TCP latency to sovereign network node"""
        try:
            start = time.perf_counter()
            with socket.create_connection((host, port), timeout=timeout):
                latency = (time.perf_counter() - start) * 1000
            return round(latency, 2)
        except:
            return -1

    def get_storage_utilization(self) -> float:
        """Check local storage usage"""
        usage = shutil.disk_usage('.')
        return round(usage.used / usage.total, 4)

    def check_power_state(self) -> str:
        """Check if running on battery power"""
        try:
            if Path("/sys/class/power_supply/AC/online").exists():
                ac_online = Path("/sys/class/power_supply/AC/online").read_text().strip()
                return "AC" if ac_online == "1" else "BATTERY"
        except:
            pass
        return "AC"

    def scan(self) -> dict:
        """Full environmental scan"""
        latency = self.ping_host()
        storage = self.get_storage_utilization()
        power = self.check_power_state()

        # Determine defense mode
        defense_mode = "NORMAL"
        
        if latency < 0:
            defense_mode = "OFFLINE_FORTIFICATION"
        elif latency > OFFLINE_THRESHOLD_MS:
            defense_mode = "DEGRADED_CONNECTIVITY"

        if storage > STORAGE_CRITICAL_THRESHOLD:
            defense_mode = "STORAGE_PURGE"

        if power == "BATTERY" and latency > 300:
            defense_mode = "LOW_POWER"

        self.state = {
            "network_latency_ms": latency,
            "storage_used_percent": storage,
            "connectivity": "ONLINE" if latency >= 0 else "OFFLINE",
            "power_state": power,
            "defense_mode": defense_mode,
            "last_updated": datetime.now().isoformat()
        }

        return self.state

    def write_state(self):
        """Write current state to shared memory"""
        state_path = Path("state/environment.json")
        state_path.parent.mkdir(exist_ok=True)
        with open(state_path, 'w') as f:
            import json
            json.dump(self.state, f, indent=2)

if __name__ == "__main__":
    print(f"🐺 OINIO Environmental Watchdog v1.0")
    watchdog = EnvironmentalWatchdog()
    
    while True:
        state = watchdog.scan()
        watchdog.write_state()
        
        print(f"[{state['last_updated']}] Latency: {state['network_latency_ms']}ms | Storage: {state['storage_used_percent']*100:.1f}% | Mode: {state['defense_mode']}")
        
        time.sleep(WATCHDOG_INTERVAL)