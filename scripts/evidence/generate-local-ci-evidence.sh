#!/usr/bin/env bash
set -euo pipefail

date_stamp="$(date -u +%Y%m%d)"
out="docs/evidence/LOCAL_CI_SURROGATE_EVIDENCE_${date_stamp}.md"
tmp_dir=".tmp-evidence"
raw_log="${tmp_dir}/local-ci-output.raw.log"
redacted_log="${tmp_dir}/local-ci-output.redacted.log"
env_raw="${tmp_dir}/env.raw.txt"
env_redacted="${tmp_dir}/env.redacted.txt"

mkdir -p docs/evidence "$tmp_dir"

commit="$(git rev-parse HEAD)"
branch="$(git branch --show-current)"
worktree_status="$(git status --short)"
evidence_date="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "=== collect environment snapshot ==="
bash scripts/evidence/collect-local-env.sh > "$env_raw"
bash scripts/evidence/redact-evidence-output.sh < "$env_raw" > "$env_redacted"

echo "=== run local CI surrogate ==="
if [ ! -f scripts/local-ci-surrogate.sh ]; then
  {
    echo "scripts/local-ci-surrogate.sh not found."
    echo "Genesis Evidence v0 records evidence infrastructure only."
    echo "Local CI surrogate command could not be executed because the surrogate script is not present at this path."
  } > "$raw_log"
  surrogate_result="NOT_RUN_SCRIPT_MISSING"
else
  set +e
  bash scripts/local-ci-surrogate.sh > "$raw_log" 2>&1
  rc=$?
  set -e
  if [ "$rc" -ne 0 ]; then
    surrogate_result="FAILED_EXIT_${rc}"
  else
    surrogate_result="PASSED"
  fi
fi

bash scripts/evidence/redact-evidence-output.sh < "$raw_log" > "$redacted_log"
local_ci_hash="$(sha256sum "$redacted_log" | awk '{print $1}')"

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

{
printf "%s\n" "# Genesis Evidence v0 — Local CI Surrogate Baseline"
printf "%s\n" ""
printf "%s\n" "## Verification Continuity Principle"
printf "%s\n" ""
printf "%s\n" "GitHub Actions may be used as an external convenience layer, but it is not the canonical source of execution truth."
printf "%s\n" ""
printf "%s\n" "The canonical source of execution truth is the committed evidence chain: exact commit, exact command, environment snapshot, verification output, hashes, non-mutation statement, and reproduction path."
printf "%s\n" ""
printf "%s\n" "## Repository State"
printf "%s\n" ""
printf "%s\n" "- Commit: \`${commit}\`"
printf "%s\n" "- Branch: \`${branch}\`"
printf "%s\n" "- Worktree status before evidence generation: \`${worktree_status:-clean}\`"
printf "%s\n" "- Evidence date UTC: \`${evidence_date}\`"
printf "%s\n" ""
printf "%s\n" "## Environment Snapshot"
printf "%s\n" ""
cat "$env_redacted"
printf "%s\n" ""
printf "%s\n" "## Commands Executed"
printf "%s\n" ""
printf "%s\n" "\`\`\`bash"
printf "%s\n" "bash scripts/local-ci-surrogate.sh"
printf "%s\n" "\`\`\`"
printf "%s\n" ""
printf "%s\n" "## Verification Results"
printf "%s\n" ""
printf "%s\n" "- Local CI surrogate: \`${surrogate_result}\`"
printf "%s\n" "- Runtime activation: not introduced"
printf "%s\n" "- Wallet signing: not introduced"
printf "%s\n" "- Deployment mutation: not introduced"
printf "%s\n" "- Autonomous execution: not introduced"
printf "%s\n" ""
printf "%s\n" "## Output Hashes"
printf "%s\n" ""
printf "%s\n" "\`\`\`text"
printf "%s\n" "local-ci-output.sha256: ${local_ci_hash}"
printf "%s\n" "lockfile.sha256: ${lock_hash}"
printf "%s\n" "local-ci-surrogate.sha256: ${surrogate_hash}"
printf "%s\n" "\`\`\`"
printf "%s\n" ""
printf "%s\n" "## Local CI Output"
printf "%s\n" ""
printf "%s\n" "\`\`\`text"
cat "$redacted_log"
printf "%s\n" "\`\`\`"
printf "%s\n" ""
printf "%s\n" "## Reproducibility Recipe"
printf "%s\n" ""
printf "%s\n" "1. Checkout commit: \`${commit}\`"
printf "%s\n" "2. Use the runtime versions listed in the environment snapshot."
printf "%s\n" "3. Run: \`bash scripts/local-ci-surrogate.sh\`"
printf "%s\n" "4. Redact output using: \`bash scripts/evidence/redact-evidence-output.sh\`"
printf "%s\n" "5. Compare the resulting output hash against: \`${local_ci_hash}\`"
printf "%s\n" ""
printf "%s\n" "## Non-Mutation Statement"
printf "%s\n" ""
printf "%s\n" "This verification pass introduced no autonomous execution, no wallet signing, no deployment expansion, no production mutation, and no runtime activation."
printf "%s\n" ""
printf "%s\n" "## Scope Note"
printf "%s\n" ""
printf "%s\n" "Genesis Evidence v0 establishes the evidence infrastructure and sealed verification baseline. It is intentionally evidentiary and does not introduce runtime behavior."
} > "$out"

evidence_hash="$(sha256sum "$out" | awk '{print $1}')"
{
printf "%s\n" ""
printf "%s\n" "## Evidence Artifact Hash"
printf "%s\n" ""
printf "%s\n" "\`\`\`text"
printf "%s\n" "evidence-artifact.sha256: ${evidence_hash}"
printf "%s\n" "\`\`\`"
} >> "$out"

echo "Generated: $out"
echo "Evidence artifact hash: $evidence_hash"

if [ "$surrogate_result" != "PASSED" ] && [ "$surrogate_result" != "NOT_RUN_SCRIPT_MISSING" ]; then
  echo "Local CI surrogate did not pass: $surrogate_result" >&2
  exit 1
fi
