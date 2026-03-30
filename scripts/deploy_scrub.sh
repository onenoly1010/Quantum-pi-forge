#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/kris/forge/Quantum-pi-forge"
cd "$ROOT"

echo "[deploy_scrub] 1/7 checking package.json conflict markers"
if grep -nE '<<<<<<<|=======|>>>>>>>' package.json >/dev/null 2>&1; then
  echo "[deploy_scrub] FAIL: conflict markers found in package.json"
  grep -nE '<<<<<<<|=======|>>>>>>>' package.json || true
  exit 2
fi

echo "[deploy_scrub] 2/7 checking gitlinks/submodules in index"
if git ls-files --stage | grep '^160000' >/dev/null 2>&1; then
  echo "[deploy_scrub] FAIL: gitlink entries remain"
  git ls-files --stage | grep '^160000' || true
  exit 3
fi

echo "[deploy_scrub] 3/7 checking .gitmodules"
if [[ -f .gitmodules ]]; then
  echo "[deploy_scrub] FAIL: .gitmodules exists"
  cat .gitmodules
  exit 4
fi

echo "[deploy_scrub] 4/7 verifying wrangler pages output dir"
grep -q 'pages_build_output_dir = "out"' wrangler.toml || {
  echo "[deploy_scrub] FAIL: wrangler.toml pages_build_output_dir is not out"
  exit 5
}

echo "[deploy_scrub] 5/7 verifying Cloudflare build script"
grep -q '"build:cf"' package.json || {
  echo "[deploy_scrub] FAIL: build:cf script missing"
  exit 6
}

echo "[deploy_scrub] 6/7 fresh install + audit fix"
rm -rf node_modules package-lock.json
npm install
npm audit fix || true

echo "[deploy_scrub] 7/7 cloudflare-target build"
DEPLOY_TARGET=cloudflare-pages npm run build

echo "[deploy_scrub] PASS"
