#!/bin/bash
# Sovereign Workspace Triage Script
# Cycle 5851 | 9.2/10 Sovereignty Rating
# For 28-Repository Ecosystem Audit

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

WORKSPACE_ROOT="/home/kris/forge"
LOG_FILE="${WORKSPACE_ROOT}/logs/triage_$(date +%Y%m%d_%H%M%S).log"
DRIFT_THRESHOLD=500
MINIMUM_ROI=1.5

mkdir -p "${WORKSPACE_ROOT}/logs"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║               SOVEREIGN WORKSPACE TRIAGE v1.0                ║${NC}"
echo -e "${BLUE}║                  Cycle 5851 | Maintenance Plateau            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Run started: $(date)" | tee "${LOG_FILE}"
echo -e "Drift threshold: ${DRIFT_THRESHOLD} cycles"
echo -e "Minimum Operational ROI: ${MINIMUM_ROI}x"
echo ""

echo "=== REPOSITORY INVENTORY ==="
REPO_COUNT=$(find "${WORKSPACE_ROOT}" -name ".git" -type d | wc -l)
echo -e "Total git repositories detected: ${YELLOW}${REPO_COUNT}${NC}" | tee -a "${LOG_FILE}"
echo ""

echo "=== UNFINISHED TASK AUDIT ==="
if [ -f "${WORKSPACE_ROOT}/OINIO_Forge/state/tasks.json" ]; then
    echo -e "${YELLOW}Analyzing tasks.json for stale entries...${NC}"
    
    jq '[.tasks[] | select(.last_updated < (now - '${DRIFT_THRESHOLD}'*60))] | length' \
        "${WORKSPACE_ROOT}/OINIO_Forge/state/tasks.json" \
        | xargs echo "Stale tasks (>500 cycles inactive): " | tee -a "${LOG_FILE}"
    
    jq '[.tasks[] | select(.last_updated < (now - '${DRIFT_THRESHOLD}'*60)) | {id, title, cycles_since_update: ((now - .last_updated)/60 | floor)}]' \
        "${WORKSPACE_ROOT}/OINIO_Forge/state/tasks.json"
else
    echo -e "${RED}tasks.json not found - skipping audit${NC}" | tee -a "${LOG_FILE}"
fi
echo ""

echo "=== ZOMBIE TASK DETECTION ==="
if [ -f "${WORKSPACE_ROOT}/OINIO_Forge/state/tasks.json" ]; then
    jq '[.tasks[] | select(.estimated_roi < '${MINIMUM_ROI}')] | length' \
        "${WORKSPACE_ROOT}/OINIO_Forge/state/tasks.json" \
        | xargs echo "Low ROI tasks (<1.5x): " | tee -a "${LOG_FILE}"
fi
echo ""

echo "=== REPOSITORY DRIFT SCAN ==="
find "${WORKSPACE_ROOT}" -name ".git" -type d | while read -r gitdir; do
    repo_path=$(dirname "${gitdir}")
    repo_name=$(basename "${repo_path}")
    
    last_commit=$(cd "${repo_path}" && git log --pretty=format:%ct -1 2>/dev/null || echo 0)
    days_since_commit=$(( ( $(date +%s) - last_commit ) / 86400 ))
    
    unstaged=$(cd "${repo_path}" && git status --porcelain 2>/dev/null | wc -l)
    
    if [ ${days_since_commit} -gt 30 ] && [ ${unstaged} -gt 0 ]; then
        echo -e "${RED}⚠️  DRIFT DETECTED: ${repo_name}${NC}"
        echo "   Last commit: ${days_since_commit} days ago"
        echo "   Uncommitted changes: ${unstaged} files"
        echo "   Path: ${repo_path}"
        echo "" | tee -a "${LOG_FILE}"
    fi
done

echo "=== AGENT HEALTH CHECK ==="
if [ -f "${WORKSPACE_ROOT}/OINIO_Forge/node.pid" ]; then
    PID=$(cat "${WORKSPACE_ROOT}/OINIO_Forge/node.pid")
    if kill -0 "${PID}" 2>/dev/null; then
        echo -e "${GREEN}✅ OINIO Agent running normally (PID ${PID})${NC}"
    else
        echo -e "${RED}❌ OINIO Agent PID exists but process not running${NC}" | tee -a "${LOG_FILE}"
    fi
else
    echo -e "${YELLOW}⚠️  OINIO Agent not currently running${NC}" | tee -a "${LOG_FILE}"
fi
echo ""

echo "=== TRIAGE SUMMARY ==="
echo -e "Full log written to: ${LOG_FILE}"
echo ""
echo -e "${BLUE}Recommendations:${NC}"
echo "  1. Archive repositories with >60 days inactivity"
echo "  2. Delete low ROI tasks (<1.5x) immediately"
echo "  3. Run checkpoint commits on all repos with unstaged changes"
echo "  4. Enable background Qwen3 research sessions for top 3 priority tasks"
echo ""
echo -e "${GREEN}Triage complete. Maintain your sovereignty.${NC}"