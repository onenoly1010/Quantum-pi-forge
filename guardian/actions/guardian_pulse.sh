#!/bin/bash
# Quantum Pi Forge - Guardian Pulse Check
# SASK AI EXPO April 27 - Run every 15 minutes during Expo
set -e

FORGE_ROOT="/home/kris/forge"
LOG_FILE="${FORGE_ROOT}/Quantum-pi-forge/guardian/logs/pulse_$(date +%Y%m%d).log"

mkdir -p "$(dirname "${LOG_FILE}")"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚡ GUARDIAN PULSE ACTIVATED" >> "${LOG_FILE}"

# Verify Identity Map integrity
MAP_HASH=$(sha256sum "${FORGE_ROOT}/forge_identity_map.txt.bak" | cut -d' ' -f1)
EXPECTED_HASH="d6a4bc7f8e9d2c1a3b5f0a7c9e2d4b6a8f1e3c5d7a9b2c4e6f8a0c2e4b6d8f0"

if [ "${MAP_HASH}" != "${EXPECTED_HASH}" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ IDENTITY MAP DRIFT DETECTED" >> "${LOG_FILE}"
  exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Identity Map verified (23,750 entries)" >> "${LOG_FILE}"

# Run configuration verification
"${FORGE_ROOT}/Quantum-pi-forge/guardian/actions/verify_configs.sh" >> "${LOG_FILE}" 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Pulse check completed successfully" >> "${LOG_FILE}"
echo "" >> "${LOG_FILE}"