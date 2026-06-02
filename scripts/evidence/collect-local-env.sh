#!/usr/bin/env bash
set -euo pipefail

commit="$(git rev-parse HEAD)"
branch="$(git branch --show-current)"
status="$(git status --short)"
os="$(. /etc/os-release 2>/dev/null && printf "%s %s" "${NAME:-unknown}" "${VERSION_ID:-unknown}" || uname -s)"
kernel="$(uname -sr)"
node_version="$(node -v 2>/dev/null || echo "not available")"
npm_version="$(npm -v 2>/dev/null || echo "not available")"
python_version="$(python3 --version 2>/dev/null || python --version 2>/dev/null || echo "not available")"
git_version="$(git --version 2>/dev/null || echo "not available")"

lock_hash="not available"
if [ -f package-lock.json ]; then
  lock_hash="$(sha256sum package-lock.json | awk '{print $1}')"
elif [ -f pnpm-lock.yaml ]; then
  lock_hash="$(sha256sum pnpm-lock.yaml | awk '{print $1}')"
elif [ -f yarn.lock ]; then
  lock_hash="$(sha256sum yarn.lock | awk '{print $1}')"
fi

surrogate_hash="not available"
if [ -f scripts/local-ci-surrogate.sh ]; then
  surrogate_hash="$(sha256sum scripts/local-ci-surrogate.sh | awk '{print $1}')"
fi

printf "%s\n" "- Builder label: builder-node"
printf "%s\n" "- OS: ${os}"
printf "%s\n" "- Kernel: ${kernel}"
printf "%s\n" "- Node: ${node_version}"
printf "%s\n" "- npm: ${npm_version}"
printf "%s\n" "- Python: ${python_version}"
printf "%s\n" "- Git: ${git_version}"
printf "%s\n" "- Commit: ${commit}"
printf "%s\n" "- Branch: ${branch}"
printf "%s\n" "- Worktree status: ${status:-clean}"
printf "%s\n" "- Lockfile hash: ${lock_hash}"
printf "%s\n" "- Local CI surrogate hash: ${surrogate_hash}"
printf "%s\n" "- Secrets required: no"
printf "%s\n" "- Wallet credentials required: no"
printf "%s\n" "- Deployment credentials required: no"
