#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="${HOME}/.oinio/logs"
mkdir -p "$LOG_DIR"

TARGET_LOG="${1:-core.log}"
FULL_PATH="$LOG_DIR/$TARGET_LOG"

if [[ ! -f "$FULL_PATH" ]]; then
  echo "No log found at: $FULL_PATH"
  exit 1
fi

tail -n 200 "$FULL_PATH"
