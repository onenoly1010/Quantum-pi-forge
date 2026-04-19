#!/usr/bin/env python3

import subprocess
import time
import json
import os
from datetime import datetime

LOCK_PATH = "/tmp/forge.lock"
MODE_PATH = "/tmp/forge_mode"
LOG_PATH = "/tmp/guardian.log"

MODEL_PRIMARY = "qwen2.5-coder:3b"

CHECK_INTERVAL = 45
WINDOW_SIZE = 8

history = []  # rolling success/failure


# ----------------------------
# Utility
# ----------------------------

def log(event, data=None):
    entry = {
        "ts": int(time.time()),
        "event": event,
        "data": data or {}
    }
    with open(LOG_PATH, "a") as f:
        f.write(json.dumps(entry) + "\n")
    print(entry)


def run_cmd(cmd, timeout=15):
    try:
        result = subprocess.run(
            cmd, shell=True,
            capture_output=True, text=True,
            timeout=timeout
        )
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    except subprocess.TimeoutExpired:
        return "", "timeout", -1


# ----------------------------
# Signals
# ----------------------------

def check_process():
    _, _, code = run_cmd("pgrep -f ollama")
    return code == 0


def get_memory_pressure():
    try:
        with open("/proc/meminfo") as f:
            meminfo = f.read()

        total = int([x for x in meminfo.splitlines() if "MemTotal" in x][0].split()[1])
        avail = int([x for x in meminfo.splitlines() if "MemAvailable" in x][0].split()[1])

        used_ratio = 1 - (avail / total)

        if used_ratio > 0.85:
            return 2  # high
        elif used_ratio > 0.65:
            return 1  # med
        else:
            return 0  # low
    except:
        return 1


def get_swap_usage():
    try:
        with open("/proc/meminfo") as f:
            meminfo = f.read()

        swap_total = int([x for x in meminfo.splitlines() if "SwapTotal" in x][0].split()[1])
        swap_free = int([x for x in meminfo.splitlines() if "SwapFree" in x][0].split()[1])

        if swap_total == 0:
            return 0.0

        return 100 * (1 - (swap_free / swap_total))
    except:
        return 0.0


def check_lock():
    if not os.path.exists(LOCK_PATH):
        return False

    age = time.time() - os.stat(LOCK_PATH).st_mtime

    if age > 7200:
        os.remove(LOCK_PATH)
        log("STALE_LOCK_CLEARED")
        return False

    return True


# ----------------------------
# Heartbeat
# ----------------------------

def heartbeat():
    prompt = """You are a minimal reliability probe. Respond with exactly this JSON and nothing else:

{"status":"ok","sum":2+2,"timestamp":<current unix timestamp>}
"""

    start = time.time()
    out, err, code = run_cmd(
        f'ollama run {MODEL_PRIMARY} --stream false "{prompt}"',
        timeout=20
    )
    latency = (time.time() - start) * 1000

    if code != 0 or not out:
        return False, latency

    try:
        data = json.loads(out)

        if data.get("status") != "ok":
            return False, latency

        if data.get("sum") != 4:
            return False, latency

        ts = data.get("timestamp", 0)
        if abs(int(time.time()) - int(ts)) > 30:
            return False, latency

        return True, latency

    except:
        return False, latency


# ----------------------------
# Scoring
# ----------------------------

def compute_health(signals):
    return (
        0.35 * (1 if signals["heartbeat"] else 0) +
        0.25 * (1 if signals["process"] else 0) +
        0.20 * max(0, 1 - (signals["latency"] / 8000)) +
        0.15 * (1 - signals["memory"] / 2.0) +
        0.05 * max(0, 1 - (signals["failures"] / 5.0))
    )


def compute_confidence():
    if not history:
        return 1.0
    return sum(history) / len(history)


def get_authority(score):
    if score >= 0.85:
        return 0
    elif score >= 0.55:
        return 1
    elif score >= 0.25:
        return 2
    else:
        return 3


# ----------------------------
# Actions (Level 0–1 only)
# ----------------------------

def restart_ollama():
    log("ACTION_L1_RESTART")
    run_cmd("pkill -15 ollama")
    time.sleep(8)
    run_cmd("ollama serve &")


# ----------------------------
# Main Loop
# ----------------------------

def main():
    global history

    log("GUARDIAN_START")

    while True:
        process_alive = check_process()
        heartbeat_ok, latency = heartbeat()
        memory = get_memory_pressure()
        swap = get_swap_usage()
        lock = check_lock()

        signals = {
            "process": process_alive,
            "heartbeat": heartbeat_ok,
            "latency": latency,
            "memory": memory,
            "swap": swap,
            "failures": history.count(0),
            "lock": lock
        }

        health = compute_health(signals)
        confidence = compute_confidence()
        authority = get_authority(health)

        success = 1 if heartbeat_ok else 0
        history.append(success)
        history = history[-WINDOW_SIZE:]

        log("STATE", {
            "health": round(health, 3),
            "confidence": round(confidence, 3),
            "authority": authority,
            "signals": signals
        })

        # ----------------------------
        # Decision Layer (SAFE ONLY)
        # ----------------------------

        if authority == 0:
            pass  # healthy

        elif authority == 1:
            log("DEGRADED")

        elif authority >= 2:
            if lock:
                log("OBSERVE_ONLY_LOCK_ACTIVE")
            else:
                restart_ollama()

        time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()