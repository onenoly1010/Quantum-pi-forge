#!/usr/bin/env bash
set -euo pipefail
test -f docs/runtime/ACTIVATION_RUNTIME_V1.md
test -f scripts/runtime/activation-runtime-v1.cjs
grep -q "autonomous for local orchestration only" docs/runtime/ACTIVATION_RUNTIME_V1.md
grep -q "private_key_access_authorized:false" scripts/runtime/activation-runtime-v1.cjs
grep -q "wallet_actions_authorized:false" scripts/runtime/activation-runtime-v1.cjs
grep -q "transaction_signing_authorized:false" scripts/runtime/activation-runtime-v1.cjs
node scripts/runtime/activation-runtime-v1.cjs >/tmp/activation-runtime-v1.out
grep -q "ACTIVATION_RUNTIME_V1_CYCLE_SEALED" /tmp/activation-runtime-v1.out
grep -q "LIVE_EXECUTION=false" /tmp/activation-runtime-v1.out
grep -q "PRIVATE_KEY_ACCESS=false" /tmp/activation-runtime-v1.out
grep -q "WALLET_ACTIONS=false" /tmp/activation-runtime-v1.out
echo "ACTIVATION_RUNTIME_V1_VERIFIED"
