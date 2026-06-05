#!/usr/bin/env bash
set -Eeuo pipefail

echo "============================================================"
echo " HERMES DIAGNOSTIC SWEEP"
echo " Safe / read-only / no secrets printed"
echo "============================================================"
echo

echo "=== 1. repo state ==="
git status -sb || true
git branch --show-current || true
git log --oneline --decorate -5 || true

echo
echo "=== 2. system basics ==="
date -u || true
uname -a || true
node -v 2>/dev/null || true
npm -v 2>/dev/null || true
python3 --version 2>/dev/null || true

echo
echo "=== 3. npm project health ==="
if [ -f package.json ]; then
  npm run 2>/dev/null || true
else
  echo "No package.json found."
fi

echo
echo "=== 4. Hermes files ==="
find hermes -maxdepth 3 -type f 2>/dev/null | sort || true

echo
echo "=== 5. Hermes Python syntax check ==="
find hermes -name '*.py' -type f 2>/dev/null | sort | while read -r f; do
  echo "--- $f"
  python3 -m py_compile "$f" && echo "OK" || echo "FAIL"
done

echo
echo "=== 6. local AI / Ollama check ==="
if command -v ollama >/dev/null 2>&1; then
  ollama list || true
else
  echo "ollama command not found"
fi

curl -fsS http://127.0.0.1:11434/api/tags >/tmp/hermes_ollama_tags.json 2>/dev/null \
  && echo "Ollama API reachable at 127.0.0.1:11434" \
  && head -c 1000 /tmp/hermes_ollama_tags.json && echo \
  || echo "Ollama API not reachable"

echo
echo "=== 7. network checks ==="
for url in \
  "https://quantumpiforge.com" \
  "https://github.com" \
  "https://api.github.com" \
  "https://evmrpc.0g.ai"
do
  echo "--- $url"
  curl -LksS -o /dev/null -w "HTTP %{http_code} | %{time_total}s | %{url_effective}\n" "$url" || true
done

echo
echo "=== 8. VS Code settings JSON check ==="
SETTINGS="$HOME/.config/Code/User/settings.json"
if [ -f "$SETTINGS" ]; then
  python3 -m json.tool "$SETTINGS" >/dev/null \
    && echo "VS Code settings.json: valid JSON" \
    || echo "VS Code settings.json: INVALID JSON"
else
  echo "VS Code settings.json not found at $SETTINGS"
fi

echo
echo "=== 9. environment key presence check ==="
echo "Values are intentionally not printed."
for key in \
  OPENAI_API_KEY \
  GROQ_API_KEY \
  TAVILY_API_KEY \
  BRAVE_SEARCH_API_KEY \
  GITHUB_TOKEN \
  CLOUDFLARE_API_TOKEN
do
  if [ -n "${!key:-}" ]; then
    echo "$key: present"
  else
    echo "$key: missing"
  fi
done

echo
echo "=== 10. protected local-only paths ==="
for d in journal keys .env; do
  if [ -e "$d" ]; then
    echo "$d: exists locally"
  else
    echo "$d: not present"
  fi
done

echo
echo "============================================================"
echo " HERMES DIAGNOSTIC COMPLETE"
echo "============================================================"
