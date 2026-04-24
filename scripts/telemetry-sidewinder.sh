#!/bin/bash
# Autonomy Loop - Self Monitoring System
LOG_PATH=~/forge/logs/autonomy.log

echo "⚡ Autonomy Loop started at $(date --iso-8601=seconds)" >> "${LOG_PATH}"
echo "✅ System now independently observing itself" >> "${LOG_PATH}"

while true; do
  TIMESTAMP=$(date --iso-8601=seconds)
  CPU_LOAD=$(awk '{print $1}' /proc/loadavg)
  MEM_FREE=$(awk '/MemFree/ {print $2}' /proc/meminfo)
  PROC_COUNT=$(pgrep -c .)
  echo "[${TIMESTAMP}] 🫀 HEARTBEAT | Load: ${CPU_LOAD} | MemFree: ${MEM_FREE} kB | Processes: ${PROC_COUNT}" >> "${LOG_PATH}"
  sleep 1
done
