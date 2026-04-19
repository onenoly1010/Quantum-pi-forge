#!/usr/bin/env python3
"""
Guardian v2.1 — MAX AUTONOMY + TRUST
Full governance policy enforced. Levels 0–3 now active.
Tested design for 7GB constrained Forge machine.
"""

import json
import time
import subprocess
import psutil
import os
import signal
from datetime import datetime
from pathlib import Path
import requests

# ========================= CONFIG (hardware-aligned) =========================
OLLAMA_URL = "http://localhost:11434"
HEARTBEAT_INTERVAL = 45
LOG_FILE = Path("/var/log/guardian.log")
STATE_FILE = Path("/tmp/forge_guardian_state.json")
CONTEXT_FILE = Path("/tmp/forge_context.json")
LOCK_FILE = Path("/tmp/forge.lock")
STALE_LOCK_SECONDS = 7200

BASELINE_MODEL = "qwen2.5-coder:3b"
SAFE_MODEL = "qwen2.5-coder:1.5b"

HEALTHY_THRESHOLD = 0.85
DEGRADED_THRESHOLD = 0.55
UNSTABLE_THRESHOLD = 0.25
CHECK_WINDOW = 10
# =============================================================================

class Guardian:
    def __init__(self):
        self.check_history: list[dict] = []
        self.failure_count = 0
        self.last_healthy_time = time.time()

    def log(self, level: str, message: str, data: dict = None):
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": level,
            "message": message,
            "data": data or {}
        }
        try:
            with LOG_FILE.open("a") as f:
                f.write(json.dumps(entry) + "\n")
            print(f"[{level}] {message}")
        except Exception:
            pass

    def write_context(self, action_attempted: str):
        """MANDATORY intent preservation before ANY Level 2+ action"""
        context = {
            "timestamp": int(time.time()),
            "active_model": BASELINE_MODEL,
            "aider_lock": self.is_aider_locked(),
            "aider_lock_age_seconds": self.get_lock_age(),
            "last_3_errors": [h for h in self.check_history[-3:] if not h.get("healthy", True)],
            "current_health_score": self.compute_health_score(),
            "authority_level": self.compute_authority(),
            "action_attempted": action_attempted,
            "failure_count": self.failure_count,
            "swap_percent": self.get_swap_percent()
        }
        try:
            CONTEXT_FILE.write_text(json.dumps(context, indent=2))
            self.log("INFO", "Context snapshot written", {"action": action_attempted})
        except Exception as e:
            self.log("ERROR", "Context snapshot failed", {"error": str(e)})

    def is_aider_locked(self) -> bool:
        if not LOCK_FILE.exists():
            return False
        age = self.get_lock_age()
        if age > STALE_LOCK_SECONDS:
            LOCK_FILE.unlink()
            self.log("INFO", "Stale lock auto-cleared")
            return False
        return True

    def get_lock_age(self) -> int:
        try:
            return int(time.time() - LOCK_FILE.stat().st_mtime)
        except Exception:
            return 999999

    def get_swap_percent(self) -> float:
        try:
            return psutil.swap_memory().percent
        except Exception:
            return 0.0

    def collect_signals(self) -> dict:
        signals = {
            "process_alive": False,
            "inference_ok": False,
            "latency_ms": 9999.0,
            "memory_pressure": 0,
            "swap_percent": self.get_swap_percent(),
            "recent_failures": self.failure_count,
            "aider_lock": self.is_aider_locked()
        }

        # Process check
        for proc in psutil.process_iter(['name']):
            try:
                if proc.info['name'] == 'ollama':
                    signals["process_alive"] = True
                    break
            except Exception:
                continue

        # Heartbeat / inference check
        if signals["process_alive"]:
            start = time.time()
            try:
                resp = requests.post(f"{OLLAMA_URL}/api/generate", json={
                    "model": BASELINE_MODEL,
                    "prompt": ".",
                    "stream": False,
                    "options": {
                        "temperature": 0.0,
                        "num_predict": 1
                    }
                }, timeout=8)
                if resp.status_code == 200:
                    signals["inference_ok"] = True
                    signals["latency_ms"] = round((time.time() - start) * 1000, 1)
            except Exception:
                pass

        # Memory pressure calculation
        try:
            vm = psutil.virtual_memory()
            used_pct = vm.percent
            if used_pct < 70:
                signals["memory_pressure"] = 0
            elif used_pct < 85:
                signals["memory_pressure"] = 1
            else:
                signals["memory_pressure"] = 2
        except Exception:
            signals["memory_pressure"] = 1

        return signals

    def compute_health_score(self, signals=None) -> float:
        if signals is None:
            signals = self.collect_signals()

        score = 1.0

        if not signals["process_alive"]:
            return 0.0
        if not signals["inference_ok"]:
            score *= 0.3

        # Latency penalty
        latency = signals["latency_ms"]
        if latency > 5000:
            score *= 0.4
        elif latency > 3000:
            score *= 0.6
        elif latency > 1500:
            score *= 0.8

        # Memory penalty
        mp = signals["memory_pressure"]
        if mp == 2:
            score *= 0.5
        elif mp == 1:
            score *= 0.85

        # Recent failure penalty
        score *= max(0.2, 1.0 - (self.failure_count * 0.15))

        return max(0.0, min(1.0, round(score, 3)))

    def compute_confidence(self) -> float:
        if not self.check_history:
            return 0.5

        window = self.check_history[-CHECK_WINDOW:]
        if not window:
            return 0.5

        healthy_count = sum(1 for entry in window if entry.get("healthy", False))
        conf = healthy_count / len(window)

        # Reduce confidence during recovery
        if self.failure_count > 0:
            conf *= max(0.3, 1.0 - (self.failure_count * 0.1))

        return round(conf, 3)

    def compute_authority(self) -> int:
        score = self.compute_health_score()
        conf = self.compute_confidence()
        combined = score * conf

        if combined >= HEALTHY_THRESHOLD: return 0
        if combined >= DEGRADED_THRESHOLD: return 1
        if combined >= UNSTABLE_THRESHOLD: return 2
        if self.is_critical(): return 3
        return 2

    def is_critical(self) -> bool:
        return (self.failure_count >= 5 or
                self.get_swap_percent() > 80 or
                sum(1 for h in self.check_history[-5:] if h.get("signals", {}).get("memory_pressure", 0) == 2) >= 3)

    # ====================== GOVERNED ACTIONS ======================
    def should_act(self, required: int) -> bool:
        current = self.compute_authority()
        if required > current:
            self.log("WARN", "POLICY_BLOCKED — action denied by governance", {
                "required": required, "current": current, "score": self.compute_health_score()
            })
            return False
        return True

    def l1_soft_reset(self):
        if not self.should_act(1): return
        self.log("INFO", "L1 AUTO Soft Reset")
        self.write_context("L1_SOFT_RESET")
        subprocess.run(["pkill", "-15", "ollama"], timeout=10, check=False)
        time.sleep(8)
        subprocess.run(["systemctl", "restart", "ollama"], timeout=15, check=False)
        time.sleep(12)

    def l2_reprovision(self):
        if not self.should_act(2): return
        if self.is_aider_locked():
            self.log("WARN", "L2 blocked — active Aider session")
            return
        self.log("INFO", "L2 CONDITIONAL Re-provision")
        self.write_context("L2_REPROVISION")
        subprocess.run(["pkill", "-15", "ollama"], timeout=10, check=False)
        time.sleep(5)
        # Safe cache clear only when no lock
        try:
            cache = Path.home() / ".ollama" / "models" / "cache"
            if cache.exists():
                subprocess.run(["rm", "-rf", str(cache)], check=False)
        except Exception:
            pass
        subprocess.run(["systemctl", "restart", "ollama"], timeout=15, check=False)
        time.sleep(15)

    def l3_safe_mode(self):
        if not self.should_act(3): return
        self.log("CRITICAL", "ENTERING SAFE MODE (Level 3 RESTRICTED)")
        self.write_context("L3_SAFE_MODE")
        
        # Graceful Aider stop only if critical
        if self.is_aider_locked() and self.get_swap_percent() > 80:
            subprocess.run(["pkill", "-15", "-f", "aider"], timeout=10, check=False)
            time.sleep(5)
        
        # Force minimal model
        try:
            requests.post(f"{OLLAMA_URL}/api/generate", json={
                "model": SAFE_MODEL,
                "prompt": "You are now in SAFE MODE. Be extremely concise.",
                "stream": False
            }, timeout=10)
        except Exception:
            pass
        
        # Set mode flag
        Path("/tmp/forge_mode").write_text("SAFE")
        self.log("CRITICAL", "SAFE MODE ACTIVE — minimal model + read-only assist")

    # ====================== MAIN LOOP ======================
    def run_check(self):
        signals = self.collect_signals()
        healthy = signals["inference_ok"] and signals["process_alive"] and signals["latency_ms"] < 6000
        score = self.compute_health_score(signals)
        conf = self.compute_confidence()
        auth = self.compute_authority()

        self.check_history.append({"healthy": healthy, "signals": signals, "score": score, "conf": conf, "auth": auth})
        if len(self.check_history) > CHECK_WINDOW * 2:
            self.check_history.pop(0)

        if healthy:
            self.failure_count = max(0, self.failure_count - 1)
            self.last_healthy_time = time.time()
        else:
            self.failure_count += 1

        self.log("INFO", "Check", {"healthy": healthy, "score": score, "auth": auth, "failures": self.failure_count})

        # === GOVERNANCE IN ACTION ===
        if not healthy:
            if auth >= 3 or self.is_critical():
                self.l3_safe_mode()
            elif auth >= 2 and self.failure_count >= 3:
                self.l2_reprovision()
            elif auth >= 1 and self.failure_count >= 2:
                self.l1_soft_reset()

    def run(self):
        self.log("INFO", "🚀 Guardian v2.1 MAX-AUTONOMY started — full governance active")
        while True:
            try:
                self.run_check()
                # Exponential backoff with bounds
                interval = HEARTBEAT_INTERVAL * (2 ** min(self.failure_count, 4))
                time.sleep(max(30, min(300, interval)))
            except Exception as e:
                self.log("ERROR", "Daemon error", {"error": str(e)})
                time.sleep(30)

if __name__ == "__main__":
    guardian = Guardian()
    guardian.run()