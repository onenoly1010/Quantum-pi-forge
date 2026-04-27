#!/bin/bash
# Quantum-pi-forge Safe Autonomy Pulse Controller
# Twenty-Third Sovereign Act - Bounded Supervision

while true; do
  if [ -f .yield_activation_signal ]; then
    # Human touch detected, keep alive
    find .yield_activation_signal -mmin -360 | grep -q . || {
      echo "[$(date -Iseconds)] AUTONOMY_PAUSED: 6 hours without human touch signal" >> ./logs/autonomy_cycles.log
      exit 0
    }
    # Enforce maximum 4 cycles per hour (15 minute minimum cycle interval)
    sleep 900
  else
    echo "[$(date -Iseconds)] AUTONOMY_STOPPED: No human touch file removed" >> ./logs/autonomy_cycles.log
    exit 0
  fi
done
