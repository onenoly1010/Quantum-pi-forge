#!/bin/bash
LOG="$HOME/offline-dev-guardian/logs/guardian.log"
[ -f "$LOG" ] && truncate -s 0 "$LOG"
echo "Logs cleared"