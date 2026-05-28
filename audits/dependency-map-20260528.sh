#!/usr/bin/env bash
set -Eeuo pipefail

OUT="audits/dependency-map-20260528.txt"

{
  echo "# Quantum Pi Forge Dependency Map — $(date -Is)"
  echo

  echo "## Git state"
  git status --short || true
  git branch --show-current || true
  git log --oneline --decorate -8 || true
  echo

  echo "## Public Cloudflare endpoints"
  for url in \
    https://quantumpiforge.pages.dev \
    https://quantumpiforge.com \
    https://www.quantumpiforge.com \
    https://quantumpiforge.com/run-guardian.sh
  do
    echo
    echo "### $url"
    curl -I --max-time 20 "$url" 2>/dev/null | sed -n '1,20p' || echo "FAILED"
  done
  echo

  echo "## Local Node/Wrangler"
  command -v node || true
  node -v || true
  command -v npm || true
  npm -v || true
  command -v wrangler || true
  npx wrangler --version || true
  echo

  echo "## Package scripts"
  node - <<'NODE' || true
const fs = require("fs");
const p = "package.json";
if (!fs.existsSync(p)) process.exit(0);
const pkg = JSON.parse(fs.readFileSync(p, "utf8"));
console.log(JSON.stringify(pkg.scripts || {}, null, 2));
NODE
  echo

  echo "## Cloudflare-related files"
  find . -maxdepth 4 -type f \( \
    -name 'wrangler.toml' -o \
    -name 'wrangler.json' -o \
    -name 'wrangler.jsonc' -o \
    -name '_headers' -o \
    -name '_redirects' \
  \) -print | sort
  echo

  echo "## Deploy/build files"
  find deploy frontend public out -maxdepth 3 -type f 2>/dev/null | sort | sed -n '1,200p'
  echo

  echo "## Systemd user services"
  systemctl --user list-units --type=service --all | grep -Ei 'forge|guardian|ollama|agent|soul|monitor|continue|aider' || true
  echo
  systemctl --user list-unit-files | grep -Ei 'forge|guardian|ollama|agent|soul|monitor|continue|aider' || true
  echo

  echo "## Guardian service status"
  systemctl --user status forge-guardian.service --no-pager -l || true
  echo

  echo "## Ollama state"
  ollama list || true
  echo
  ollama ps || true
  echo
  curl -s --max-time 10 http://127.0.0.1:11434/api/tags | python3 -m json.tool 2>/dev/null | sed -n '1,160p' || true
  echo

  echo "## Active pressure"
  ps -eo pid,ppid,cmd,%cpu,%mem --sort=-%cpu | head -35
  echo

  echo "## Local ports"
  ss -ltnp 2>/dev/null | sed -n '1,120p' || true
  echo

  echo "## Environment files present, names only"
  find . -maxdepth 4 -type f \( -name '.env' -o -name '.env.*' \) -print | sort
  echo

  echo "## Platform config hints"
  grep -RInE 'vercel|railway|cloudflare|wrangler|0g|aristotle|storacha|github|pages.dev|quantumpiforge.com' \
    package.json wrangler.toml wrangler.json wrangler.jsonc .github deploy frontend server scripts 2>/dev/null \
    | sed -n '1,240p' || true

} | tee "$OUT"

echo
echo "WROTE $OUT"
