#!/usr/bin/env python3
"""
Temporal Pattern Detector - Multi-resolution failure pattern analysis
Implements three time scale separation with anti-overfitting safeguards
Detects only stable, repeating disruptions for preemptive action
"""

import json
import time
import math
import statistics
from typing import Dict, List, Optional, Tuple, Any

# Window durations in seconds
WINDOW_SIZES = {
    "micro":  5 * 60,    # 5 minutes
    "meso":   60 * 60,   # 60 minutes
    "macro":  24 * 3600  # 24 hours
}

# Decay time constants (half-life in seconds)
DECAY_TAU = {
    "micro":  5 * 60,
    "meso":   30 * 60,
    "macro":  6 * 3600
}

# Configuration constants
MIN_EVENTS_THRESHOLD = 4
VARIANCE_RATIO_THRESHOLD = 0.2
DEAD_ZONE_DENSITY = 0.6
PATTERN_DECAY_RATE = 0.85
COOLDOWN_PERIOD = 10 * 60
RISK_WINDOW_RATIO = 0.25

STATE_FILE = "/home/kris/forge/OINIO_Forge/state/temporal_patterns.json"


class TemporalPatternDetector:
    def __init__(self):
        self.state = self._load_state()
        self.last_pattern_detection = 0

    def _load_state(self) -> Dict[str, Any]:
        try:
            with open(STATE_FILE, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {
                "version": "1.0.0",
                "last_updated": int(time.time()),
                "patterns": {},
                "buffers": {
                    "micro": {},
                    "meso": {},
                    "macro": {}
                }
            }

    def _save_state(self) -> None:
        self.state["last_updated"] = int(time.time())
        with open(STATE_FILE, 'w') as f:
            json.dump(self.state, f, indent=2)

    def _clean_window(self, window: str, cause: str, now: int) -> None:
        """Remove expired events from time window"""
        cutoff = now - WINDOW_SIZES[window]
        if cause in self.state["buffers"][window]:
            self.state["buffers"][window][cause] = [
                t for t in self.state["buffers"][window][cause]
                if t > cutoff
            ]

    def record_failure(self, event: Dict[str, Any]) -> None:
        """Record a failure event into all three time windows"""
        timestamp = event.get("timestamp", int(time.time()))
        cause = event.get("cause", "unknown")

        for window in WINDOW_SIZES.keys():
            if cause not in self.state["buffers"][window]:
                self.state["buffers"][window][cause] = []
            self.state["buffers"][window][cause].append(timestamp)
            self._clean_window(window, cause, timestamp)

        self._save_state()

    def calculate_weighted_density(self, cause: str, window: str, now: int) -> float:
        """Calculate exponentially weighted failure density"""
        if cause not in self.state["buffers"][window]:
            return 0.0

        events = self.state["buffers"][window][cause]
        tau = DECAY_TAU[window]
        total_weight = 0.0

        for t in events:
            delta = now - t
            weight = math.exp(-delta / tau)
            total_weight += weight

        return total_weight / WINDOW_SIZES[window]

    def analyze_intervals(self, events: List[int]) -> Tuple[bool, float, float, float]:
        """Analyze event intervals for periodicity"""
        if len(events) < MIN_EVENTS_THRESHOLD:
            return False, 0.0, 0.0, 0.0

        events_sorted = sorted(events)
        intervals = [
            events_sorted[i+1] - events_sorted[i]
            for i in range(len(events_sorted)-1)
        ]

        mean_interval = statistics.mean(intervals)
        variance = statistics.variance(intervals) if len(intervals) > 1 else float('inf')

        # Anti-overfitting: maximum interval may not exceed 2x minimum
        if max(intervals) > 2 * min(intervals):
            return False, mean_interval, variance, 0.0

        # Stability condition
        is_periodic = variance < (mean_interval * VARIANCE_RATIO_THRESHOLD)
        confidence = max(0.0, 1.0 - (variance / mean_interval)) if mean_interval > 0 else 0.0

        return is_periodic, mean_interval, variance, confidence

    def detect_patterns(self) -> Dict[str, Any]:
        """Run full pattern detection across all failure causes"""
        now = int(time.time())

        # Cooldown check
        if now - self.last_pattern_detection < COOLDOWN_PERIOD:
            return self.state["patterns"]

        all_causes = set()
        for window in WINDOW_SIZES.keys():
            all_causes.update(self.state["buffers"][window].keys())

        new_patterns = {}

        for cause in all_causes:
            # Calculate densities
            macro_density = self.calculate_weighted_density(cause, "macro", now)

            # Check for dead zone first
            if macro_density > DEAD_ZONE_DENSITY:
                new_patterns[cause] = {
                    "type": "dead_zone",
                    "confidence": min(1.0, macro_density),
                    "density": macro_density,
                    "detected_at": now
                }
                continue

            # Check for periodic patterns in meso window
            meso_events = self.state["buffers"]["meso"].get(cause, [])
            is_periodic, mean_interval, variance, confidence = self.analyze_intervals(meso_events)

            if is_periodic and confidence > 0.5:
                last_event = max(meso_events)
                next_expected = last_event + mean_interval
                risk_window = mean_interval * RISK_WINDOW_RATIO

                new_patterns[cause] = {
                    "type": "periodic",
                    "interval_sec": int(mean_interval),
                    "confidence": round(confidence, 3),
                    "variance": round(variance, 2),
                    "last_event": last_event,
                    "next_expected": int(next_expected),
                    "risk_window": int(risk_window),
                    "detected_at": now
                }

        # Apply pattern confidence decay for existing patterns not re-detected
        for cause, pattern in self.state["patterns"].items():
            if cause not in new_patterns:
                pattern["confidence"] *= PATTERN_DECAY_RATE
                if pattern["confidence"] > 0.2:
                    new_patterns[cause] = pattern

        self.state["patterns"] = new_patterns
        self.last_pattern_detection = now
        self._save_state()

        return new_patterns

    def should_delay_execution(self, task: Dict[str, Any]) -> Tuple[bool, float, Dict[str, Any]]:
        """Pre-execution check: should this task be delayed due to predicted instability?"""
        now = int(time.time())
        adjusted_risk = 0.0
        trigger_pattern = None

        for cause, pattern in self.state["patterns"].items():
            if pattern["type"] == "dead_zone":
                return True, pattern["confidence"], pattern

            if pattern["type"] == "periodic":
                time_to_next = abs(now - pattern["next_expected"])
                if time_to_next < pattern["risk_window"]:
                    adjusted_risk += 0.2 * pattern["confidence"]
                    trigger_pattern = pattern

        if adjusted_risk > 0.15:
            return True, adjusted_risk, trigger_pattern

        return False, 0.0, None

    def get_active_patterns(self) -> Dict[str, Any]:
        """Return all currently active patterns"""
        return self.state["patterns"]


if __name__ == "__main__":
    # Test implementation
    detector = TemporalPatternDetector()

    # Simulate periodic network instability every 8 minutes (480s)
    print("Testing periodic pattern detection...")
    base_time = int(time.time()) - 10 * 480

    for i in range(6):
        detector.record_failure({
            "timestamp": base_time + (i * 480),
            "task_id": f"test_{i}",
            "cause": "network_instability",
            "latency_ms": 12000
        })

    patterns = detector.detect_patterns()
    print("\nDetected Patterns:")
    print(json.dumps(patterns, indent=2))

    # Test pre-execution check
    print("\nPre-execution check:")
    delay, risk, pattern = detector.should_delay_execution({"task_id": "T3_execute_blueprint"})
    print(f"Should delay: {delay}, Risk: {risk:.3f}")
    if pattern:
        print(f"Trigger pattern: {pattern['type']}")