#!/usr/bin/env bash
# autonomous-progress-pulse.sh — lean OBSERVING-phase pulse for low-RAM workstations
#
# NEVER: wallet, mint, LP, signing, push, or customer outreach without human GO.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG_DIR="${QPF_FORGE_DAEMON_DIR:-$HOME/.forge-daemon}"
LOG="$LOG_DIR/autonomous-progress.log"
STATUS_JSON="$LOG_DIR/autonomous-progress-status.json"
HALT="$LOG_DIR/HALT"
MAX_LOG_BYTES="${QPF_PULSE_MAX_LOG_BYTES:-2000000}"
LOAD_SKIP="${QPF_PULSE_LOAD_SKIP:-6.0}"
MEM_AVAIL_MIN_MIB="${QPF_PULSE_MEM_AVAIL_MIN_MIB:-800}"

export NO_WALLET_TOUCH=true
unset PRIVATE_KEY DEPLOYER_PRIVATE_KEY FEE_TO_SETTER_PRIVATE_KEY COSIGN_PRIVATE_KEY MNEMONIC SEED 2>/dev/null || true

mkdir -p "$LOG_DIR"
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
log() { echo "$(ts) $*" | tee -a "$LOG"; }

if [[ -f "$HALT" ]]; then
  log "HALT present — exit 0"
  exit 0
fi

load1="$(awk '{print $1}' /proc/loadavg)"
avail_kib="$(awk '/MemAvailable:/ {print $2}' /proc/meminfo)"
avail_mib=$((avail_kib / 1024))
skip=0
if awk -v l="$load1" -v t="$LOAD_SKIP" 'BEGIN { exit !(l+0 >= t+0) }'; then
  log "SKIP high_load load1=$load1 threshold=$LOAD_SKIP"
  skip=1
fi
if (( avail_mib < MEM_AVAIL_MIN_MIB )); then
  log "SKIP low_mem available_mib=$avail_mib min=$MEM_AVAIL_MIN_MIB"
  skip=1
fi

if [[ -f "$LOG" ]]; then
  sz=$(wc -c <"$LOG" || echo 0)
  if (( sz > MAX_LOG_BYTES )); then
    tail -c "$MAX_LOG_BYTES" "$LOG" >"${LOG}.tmp" && mv "${LOG}.tmp" "$LOG"
    log "ROTATED log to last ${MAX_LOG_BYTES} bytes"
  fi
fi

if (( skip == 1 )); then
  printf '{"at":"%s","skipped":true,"load1":%s,"avail_mib":%s,"phase":"OBSERVING","no_wallet_touch":true}\n' \
    "$(ts)" "$load1" "$avail_mib" >"$STATUS_JSON"
  exit 0
fi

log "PULSE_START load1=$load1 avail_mib=$avail_mib phase=OBSERVING"

probe_ok=0
probe_fail=0
probe_lines=""

probe_one() {
  local url="$1" want="$2"
  local body title
  body="$(curl -sL --max-time 12 -H 'Cache-Control: no-cache' "${url}?t=$(date +%s)" 2>/dev/null || true)"
  title="$(printf '%s' "$body" | tr '\n' ' ' | sed -n 's/.*<[tT][iI][tT][lL][eE]>\([^<]*\)<\/[tT][iI][tT][lL][eE]>.*/\1/p' | head -1)"
  if printf '%s' "$title" | grep -qiF "$want"; then
    log "PROBE_OK url=$url title=${title:0:60}"
    probe_ok=$((probe_ok + 1))
    probe_lines+="ok|$url"$'\n'
  else
    log "PROBE_FAIL url=$url title=${title:0:60} want~$want"
    probe_fail=$((probe_fail + 1))
    probe_lines+="fail|$url"$'\n'
  fi
}

probe_one "https://quantumpiforge.com/try.html" "Try QPF"
probe_one "https://quantumpiforge.com/problems/" "Problems QPF"
probe_one "https://quantumpiforge.com/verification-certificate.html" "Verification Certificate"
probe_one "https://quantumpiforge.com/verification-request" "Verification Review"

locks_json="$(curl -sL --max-time 10 "https://quantumpiforge.com/verification-status-v1.json?t=$(date +%s)" 2>/dev/null || echo '{}')"
mint="$(printf '%s' "$locks_json" | grep -o '"public_mint"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | cut -d'"' -f4)"
lp="$(printf '%s' "$locks_json" | grep -o '"liquidity"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | cut -d'"' -f4)"
log "LOCKS public_mint=${mint:-unknown} liquidity=${lp:-unknown}"

ollama_ok=0
if curl -s --max-time 2 http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  ollama_ok=1
fi
copilot_n=$(pgrep -x copilot 2>/dev/null | wc -l | tr -d ' ' || true)
grok_n=$(pgrep -x grok 2>/dev/null | wc -l | tr -d ' ' || true)
event_n=$(pgrep -f 'living-forge/event-loop.sh' 2>/dev/null | wc -l | tr -d ' ' || true)
# pgrep returns 1 when no match; with pipefail that would abort — force zeros
copilot_n=${copilot_n:-0}
grok_n=${grok_n:-0}
event_n=${event_n:-0}
[[ "$copilot_n" =~ ^[0-9]+$ ]] || copilot_n=0
[[ "$grok_n" =~ ^[0-9]+$ ]] || grok_n=0
[[ "$event_n" =~ ^[0-9]+$ ]] || event_n=0
log "AGENTS ollama=$ollama_ok copilot_procs=$copilot_n grok_procs=$grok_n event_loops=$event_n"

git_main=""
if [[ -d "$ROOT/.git" ]]; then
  git_main="$(git -C "$ROOT" rev-parse --short origin/main 2>/dev/null || true)"
fi
log "GIT origin/main~=$git_main"

next="OBSERVE: find→understand→try→request; freeze packaging"
if (( probe_fail > 0 )); then
  next="FIX: production entry probe failed ($probe_fail); check CF deploy / build allowlist"
fi

# compact status json — use python3 if available, else a portable shell fallback
_ts_now="$(ts)"
if command -v python3 >/dev/null 2>&1; then
  PROBE_LINES="$probe_lines" NEXT="$next" LOAD1="$load1" AVAIL="$avail_mib" \
  POK="$probe_ok" PFAIL="$probe_fail" MINT="${mint:-unknown}" LP="${lp:-unknown}" \
  OLL="$ollama_ok" COP="$copilot_n" GRK="$grok_n" EV="$event_n" GITM="$git_main" \
  STATUS_JSON="$STATUS_JSON" TS="$_ts_now" python3 - <<'PY'
import json, os
probes = []
for line in os.environ.get("PROBE_LINES", "").splitlines():
    if not line.strip():
        continue
    st, url = line.split("|", 1)
    probes.append({"status": st, "url": url})
status = {
    "at": os.environ["TS"],
    "phase": "OBSERVING",
    "skipped": False,
    "load1": float(os.environ["LOAD1"]),
    "avail_mib": int(os.environ["AVAIL"]),
    "probe_ok": int(os.environ["POK"]),
    "probe_fail": int(os.environ["PFAIL"]),
    "probes": probes,
    "locks": {"public_mint": os.environ["MINT"], "liquidity": os.environ["LP"]},
    "agents": {
        "ollama": bool(int(os.environ["OLL"])),
        "copilot": int(os.environ["COP"]),
        "grok": int(os.environ["GRK"]),
        "event_loops": int(os.environ["EV"]),
    },
    "git_main_short": os.environ.get("GITM") or None,
    "next_action": os.environ["NEXT"],
    "no_wallet_touch": True,
}
open(os.environ["STATUS_JSON"], "w").write(json.dumps(status, indent=2) + "\n")
print("STATUS_WRITTEN", os.environ["STATUS_JSON"])
PY
else
  # shell fallback: write minimal but valid JSON without python3
  log "WARN python3 not found — writing minimal status JSON via shell"
  # Sanitize: timestamp to known ISO-8601 safe chars; coerce numerics to integers
  _ts_safe="$(printf '%s' "$_ts_now" | tr -cd 'A-Za-z0-9:+-')"
  _load_safe="$(printf '%.2f' "$load1" 2>/dev/null || echo '0.00')"
  _avail_safe="$(( avail_mib + 0 ))"
  _pok_safe="$(( probe_ok + 0 ))"
  _pfail_safe="$(( probe_fail + 0 ))"
  printf '{"at":"%s","phase":"OBSERVING","skipped":false,"load1":%s,"avail_mib":%s,"probe_ok":%s,"probe_fail":%s,"no_wallet_touch":true,"note":"python3 unavailable; probes omitted"}\n' \
    "$_ts_safe" "$_load_safe" "$_avail_safe" "$_pok_safe" "$_pfail_safe" >"$STATUS_JSON"
  log "STATUS_WRITTEN $STATUS_JSON (shell fallback)"
fi

log "PULSE_END next=$next"
exit 0
