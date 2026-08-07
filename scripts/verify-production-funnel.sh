#!/usr/bin/env bash
# Production funnel enablement check (Gate 1 only).
# Does NOT measure demand. Does NOT authorize economics.
set -euo pipefail

BASE="${QPF_BASE_URL:-https://quantumpiforge.com}"
fails=0

pass() { echo "  PASS $1"; }
fail() { echo "  FAIL $1"; fails=$((fails + 1)); }

check() {
  local path="$1" title_re="$2"
  shift 2
  local url="${BASE}${path}"
  local tmp code title
  tmp="$(mktemp)"
  code=$(curl -sS -o "$tmp" -w "%{http_code}" -L --max-time 25 \
    -H 'Cache-Control: no-cache' "${url}" || echo FAIL)
  title=$(grep -oP '(?<=<title>)[^<]+' "$tmp" 2>/dev/null | head -1 || true)

  echo "PATH ${path}"
  echo "  http=${code} title=${title}"

  if [[ "$code" != "200" ]]; then fail "http ${code}"; rm -f "$tmp"; return; fi
  if printf '%s' "$title" | grep -qi 'Genesis'; then fail "SPA/genesis fallback title"; rm -f "$tmp"; return; fi
  if [[ -n "$title_re" ]] && ! printf '%s' "$title" | grep -qiE "$title_re"; then
    fail "title !~ ${title_re}"
    rm -f "$tmp"
    return
  fi
  local s
  for s in "$@"; do
    # Accept /try and /try.html (CF may strip .html in some responses)
    if ! grep -qF "$s" "$tmp" 2>/dev/null; then
      if [[ "$s" == "/try.html" ]] && grep -qE 'href="/try(\.html)?"' "$tmp" 2>/dev/null; then
        continue
      fi
      if [[ "$s" == "/problems/" ]] && grep -qE 'href="/problems/?' "$tmp" 2>/dev/null; then
        continue
      fi
      fail "missing string: ${s}"
      rm -f "$tmp"
      return
    fi
  done
  rm -f "$tmp"
  pass "${path}"
}

echo "QPF production funnel verify"
echo "base=${BASE}"
echo "time=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo

check "/" "Know what is real" "/try.html" "/problems/"
check "/problems/" "Problems QPF" "/try.html"
check "/try.html" "Try QPF" "Run check now" "/verification.html"
check "/verification.html" "Verification" "verification-certificate"
check "/verification-request.html" "Request" "Request a verification"
check "/sitemap.xml" "" "try.html" "problems/"

echo
echo "=== economic locks (must stay OFF) ==="
status=$(curl -sS -L --max-time 15 "${BASE}/verification-status-v1.json" || true)
if printf '%s' "$status" | grep -q 'NOT_AUTHORIZED'; then
  pass "economic fields present as NOT_AUTHORIZED"
else
  fail "expected NOT_AUTHORIZED in verification-status-v1.json"
fi
if printf '%s' "$status" | grep -q '"mint_activation": "LOCKED"'; then
  pass "mint_activation LOCKED"
else
  fail "mint_activation not LOCKED"
fi

echo
echo "=== version pin ==="
curl -sS -L --max-time 15 "${BASE}/version.json" || true
echo

if [[ "$fails" -eq 0 ]]; then
  echo "RESULT: PASS (enablement only — not demand)"
  exit 0
fi
echo "RESULT: FAIL (${fails} checks)"
exit 1
