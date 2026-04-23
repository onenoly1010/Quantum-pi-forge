#!/bin/bash
set -e

# Configuration
FORGE_ROOT="/home/kris/forge/Quantum-pi-forge"
cd "$FORGE_ROOT"

# Backup original config (if exists)
CONFIG_FILE=".github/config/canon-merge-rules.json"
BACKUP_FILE="/tmp/canon-merge-rules.json.bak"
TEST_CONFIG="/tmp/canon-merge-rules.test.json"

echo "=== OINIO Soul Governance Stress Test ==="
echo "Starting at $(date)"

# 1. Backup and create test config with drift
if [ -f "$CONFIG_FILE" ]; then
    cp "$CONFIG_FILE" "$BACKUP_FILE"
    echo "✓ Backed up original config to $BACKUP_FILE"
else
    echo "⚠️ No existing config found; using default template"
    cat > "$BACKUP_FILE" <<'EOF'
{"version":"1.0","artifact_types":{"closure":{"required_approvals":1,"required_roles":["steward"],"auto_merge_enabled":true}}}
EOF
fi

# Inject drift: change required_approvals from integer to string "two"
jq '.artifact_types.closure.required_approvals = "two"' "$BACKUP_FILE" > "$TEST_CONFIG"
echo "✓ Injected governance drift: required_approvals is now string 'two' (invalid)"

# 2. Override config path for this test
echo "⚙️ Preparing agent to use test config..."
cat > /tmp/run_agent_test.sh <<'EOF'
#!/bin/bash
export CANON_MERGE_RULES_JSON="/tmp/canon-merge-rules.test.json"
cd /home/kris/forge/Quantum-pi-forge
python3 .github/scripts/task_selector.py --mode drift-detection --output /tmp/drift_result.json
python3 .github/scripts/draft_lint_repair.py --target-file .github/config/canon-merge-rules.json --task "Fix governance drift: required_approvals must be integer" --max-attempts 2
EOF
chmod +x /tmp/run_agent_test.sh

# 3. Run the agent cycle
echo "🚀 Starting agent cycle (task selection + repair)..."
/tmp/run_agent_test.sh 2>&1 | tee /tmp/stress_test.log

# 4. Monitor outcome
echo "=== Test Results ==="
if grep -q "Lint passed. Changes applied." /tmp/stress_test.log; then
    echo "✅ Agent successfully fixed the drift via direct lint pass."
    PASS=1
elif grep -q "PR created" /tmp/stress_test.log; then
    echo "⚠️ Agent created a Humility PR instead of direct fix."
    PASS=0
    echo "   Check PR at: $(grep -o 'https://github.com/.*' /tmp/stress_test.log | head -1)"
else
    echo "❌ Agent failed to correct drift and did not create a PR."
    PASS=0
fi

# 5. Revert all changes
echo "🧹 Cleaning up..."
rm -f "$TEST_CONFIG" /tmp/run_agent_test.sh
if [ -f "$BACKUP_FILE" ]; then
    cp "$BACKUP_FILE" "$CONFIG_FILE"
    echo "✓ Restored original config"
    rm "$BACKUP_FILE"
fi

# 6. Final verdict
if [ $PASS -eq 1 ]; then
    echo "✅ STRESS TEST PASSED: Agent autonomously corrected governance drift."
else
    echo "❌ STRESS TEST FAILED: Agent could not correct drift (but did not break anything)."
    echo "   Review logs at /tmp/stress_test.log"
fi

echo "Test completed at $(date)"