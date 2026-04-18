#!/usr/bin/env bash
# OINIO Sidewinder - Local Telemetry Collector
set -euo pipefail

LOG_FILE="./local/var/log/guardian/gate.log"
STATUS_FILE="./local/var/run/guardian/status.json"

# Create directories if they don't exist
mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$(dirname "$STATUS_FILE")"

# Extract metrics from the last 30 minutes
TOTAL_ATTEMPTS=$(grep -c "GATE EXECUTION START" "$LOG_FILE" 2>/dev/null || echo 0)
TOTAL_REJECTS=$(grep -c "Quorum rejected" "$LOG_FILE" 2>/dev/null || echo 0)
SIG_FAILURES=$(grep -c "Cosign signature verification failed" "$LOG_FILE" 2>/dev/null || echo 0)
SUCCESS_RUNS=$(grep -c "Execution completed successfully" "$LOG_FILE" 2>/dev/null || echo 0)

# Build JSON status for the local dashboard
cat <<EOF > "$STATUS_FILE"
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "guardian_heartbeat": "ACTIVE",
  "metrics": {
    "attempts": $TOTAL_ATTEMPTS,
    "quorum_rejects": $TOTAL_REJECTS,
    "signature_failures": $SIG_FAILURES,
    "successful_executions": $SUCCESS_RUNS
  },
  "alerts": $([[ $SIG_FAILURES -gt 0 ]] && echo "true" || echo "false")
}
EOF

# Local alert if signature fails
if [[ $SIG_FAILURES -gt 0 ]]; then
  echo "CRITICAL: SIGNATURE FAILURE DETECTED IN LOCAL FORGE" | wall 2>/dev/null || true
  echo "⚠️  CRITICAL: SIGNATURE FAILURE DETECTED" >&2
fi