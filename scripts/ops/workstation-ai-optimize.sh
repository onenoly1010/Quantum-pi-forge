#!/usr/bin/env bash
# workstation-ai-optimize.sh — optimize AI/agent load for 7GiB/2CPU
#
# Goals:
#   - keep project progressing autonomously in OBSERVING phase
#   - cut wasteful 24/7 load (duplicate loops, chatty guardians, huge logs)
#   - preserve NO_WALLET_TOUCH / locks
#
# Usage:
#   bash scripts/ops/workstation-ai-optimize.sh           # dry-run
#   bash scripts/ops/workstation-ai-optimize.sh --apply   # apply
#   bash scripts/ops/workstation-ai-optimize.sh --apply --kill-idle-copilot
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG_DIR="${QPF_FORGE_DAEMON_DIR:-$HOME/.forge-daemon}"
APPLY=0
KILL_COPILOT=0

for a in "$@"; do
  case "$a" in
    --apply) APPLY=1 ;;
    --kill-idle-copilot) KILL_COPILOT=1 ;;
    --help|-h)
      sed -n '2,20p' "$0" | sed 's/^# \?//'
      exit 0
      ;;
  esac
done

ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
say() { echo "[$(ts)] $*"; }

mkdir -p "$LOG_DIR"
say "MODE=$([ "$APPLY" -eq 1 ] && echo APPLY || echo DRY_RUN) root=$ROOT"

# --- 1) Report current agents ---
say "=== current agents ==="
pgrep -a ollama 2>/dev/null || say "ollama: none"
pgrep -a copilot 2>/dev/null || say "copilot: none"
pgrep -a -x grok 2>/dev/null || say "grok: none"
pgrep -af 'living-forge/event-loop' 2>/dev/null || say "event-loop: none"
uptime
free -h | head -2

# --- 2) Deduplicate living-forge event-loops (keep oldest) ---
mapfile -t LOOPS < <(pgrep -f 'Quantum-pi-forge/scripts/living-forge/event-loop.sh' || true)
if (( ${#LOOPS[@]} > 1 )); then
  keep="${LOOPS[0]}"
  say "DUPLICATE event-loops: ${LOOPS[*]} → keep $keep"
  if (( APPLY == 1 )); then
    for p in "${LOOPS[@]:1}"; do
      say "kill duplicate event-loop pid=$p"
      kill "$p" 2>/dev/null || true
    done
  fi
else
  say "event-loop count=${#LOOPS[@]} (ok if 0 or 1)"
fi

# --- 3) Optional: stop long-running idle-ish copilot ---
if (( KILL_COPILOT == 1 )); then
  if pgrep -x copilot >/dev/null 2>&1; then
    say "copilot processes will be stopped (--kill-idle-copilot)"
    if (( APPLY == 1 )); then
      pkill -x copilot 2>/dev/null || true
      say "copilot stopped"
    fi
  fi
fi

# --- 4) Log hygiene ---
for f in "$LOG_DIR/cron.log" "$LOG_DIR/living-forge-event.log" "$LOG_DIR/autonomy-pulse.log"; do
  if [[ -f "$f" ]]; then
    sz=$(wc -c <"$f")
    say "log $f bytes=$sz"
    if (( APPLY == 1 && sz > 2000000 )); then
      tail -c 1000000 "$f" >"${f}.trimmed" && mv "${f}.trimmed" "$f"
      say "trimmed $f to last 1MiB"
    fi
  fi
done

# --- 5) Optimize cron: one lean pulse + light health, drop thrashy 15m expo pulse ---
CRON_BAK="$LOG_DIR/crontab.backup.$(date +%Y%m%dT%H%M%SZ)"
NEW_CRON=$(cat <<EOF
# QPF workstation-optimized autonomy (generated $(ts))
# NO_WALLET_TOUCH. Locks held. Observing phase.
# Resource-gated progress pulse every 2 hours
0 */2 * * * /bin/bash $ROOT/scripts/ops/autonomous-progress-pulse.sh >>$LOG_DIR/autonomous-progress.cron.log 2>&1
# Light offline health (ollama up) every 6 hours — not every 30m
15 */6 * * * /bin/bash $HOME/.offline-dev-guardian/guardian-check.sh >>$HOME/.offline-dev-guardian/logs/guardian.log 2>&1
# OPTIONAL heavy forge-daemon guardian — disabled by default (was 40MB+ cron.log)
# 0 */6 * * * /bin/bash $HOME/.forge-daemon/guardian.sh >>$LOG_DIR/cron.log 2>&1
EOF
)

say "=== proposed crontab ==="
echo "$NEW_CRON"

if (( APPLY == 1 )); then
  crontab -l >"$CRON_BAK" 2>/dev/null || true
  say "backed up crontab to $CRON_BAK"
  printf '%s\n' "$NEW_CRON" | crontab -
  say "installed lean crontab"
else
  say "dry-run: crontab not changed (pass --apply)"
fi

# --- 6) Slow systemd autonomy pulse from 15m → 6h (if installed) ---
TIMER_USER="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user/qpf-autonomy-pulse.timer"
if [[ -f "$TIMER_USER" ]] || systemctl --user cat qpf-autonomy-pulse.timer >/dev/null 2>&1; then
  say "found qpf-autonomy-pulse.timer"
  if (( APPLY == 1 )); then
    mkdir -p "${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
    cat >"${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user/qpf-autonomy-pulse.timer" <<'EOF'
[Unit]
Description=QPF autonomy pulse every 6 hours (workstation-optimized)

[Timer]
OnBootSec=5min
OnUnitActiveSec=6h
AccuracySec=5min
Persistent=true
Unit=qpf-autonomy-pulse.service

[Install]
WantedBy=timers.target
EOF
    # ensure service has Nice
    if [[ -f "${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user/qpf-autonomy-pulse.service" ]]; then
      if ! grep -q '^Nice=' "${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user/qpf-autonomy-pulse.service"; then
        sed -i '/\[Service\]/a Nice=15\nIOSchedulingClass=idle' "${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user/qpf-autonomy-pulse.service" || true
      fi
    fi
    systemctl --user daemon-reload
    systemctl --user enable --now qpf-autonomy-pulse.timer 2>/dev/null || true
    systemctl --user restart qpf-autonomy-pulse.timer 2>/dev/null || true
    say "autonomy pulse interval set to 6h + Nice=15"
  fi
else
  say "qpf-autonomy-pulse.timer not installed (skip)"
fi

# --- 7) Ensure ollama stays idle-serve (do not pull models here) ---
if pgrep -x ollama >/dev/null 2>&1; then
  say "ollama serve is up (good — keep idle; do not auto-load large models on this box)"
else
  say "ollama not running — optional: systemctl enable --now ollama (or start manually)"
fi

# --- 8) Run one progress pulse now ---
if (( APPLY == 1 )); then
  chmod +x "$ROOT/scripts/ops/autonomous-progress-pulse.sh" "$ROOT/scripts/ops/workstation-ai-optimize.sh" 2>/dev/null || true
  say "running one autonomous-progress-pulse now"
  /bin/bash "$ROOT/scripts/ops/autonomous-progress-pulse.sh" || true
  if [[ -f "$LOG_DIR/autonomous-progress-status.json" ]]; then
    say "status:"
    cat "$LOG_DIR/autonomous-progress-status.json"
  fi
fi

say "DONE"
say "Policy: NO_WALLET_TOUCH=true · no mint/LP · no auto-outreach"
say "Progress = observe production funnel + light health · not 24/7 LLM generation"
