#!/usr/bin/env bash
set -Eeuo pipefail

# Local Hermes / Ollama runner.
# Read-only, evidence-bound, no wallet/deploy/chain/posting authority.

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

QUERY="${1:-}"
MODEL="${2:-llama3.2:1b}"

if [ -z "$QUERY" ]; then
  echo "Usage: $0 \"query string\" [model]" >&2
  exit 1
fi

if ! command -v ollama >/dev/null 2>&1; then
  echo "ERROR: ollama command not found." >&2
  exit 1
fi

if ! ollama list | awk "NR > 1 {print \$1}" | grep -Fxq "$MODEL"; then
  echo "ERROR: Ollama model is not available locally: $MODEL" >&2
  echo "Pull it manually first: ollama pull $MODEL" >&2
  exit 1
fi

TIMESTAMP="$(date -u +%Y%m%d-%H%M%S)"
ISO_TIMESTAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
SHORT_SHA="$(git rev-parse --short HEAD 2>/dev/null || echo nogit)"
OUTDIR="evidence/hermes/receipts"
INPUT_DIR="evidence/hermes/inputs"
OUTPUT_DIR="evidence/hermes/outputs"
mkdir -p "$OUTDIR" "$INPUT_DIR" "$OUTPUT_DIR"
OUTFILE="$OUTDIR/hermes-${TIMESTAMP}-${SHORT_SHA}.json"
TMP_PROMPT="$INPUT_DIR/hermes-${TIMESTAMP}-${SHORT_SHA}.prompt.txt"
TMP_OUTPUT="$OUTPUT_DIR/hermes-${TIMESTAMP}-${SHORT_SHA}.output.txt"

BOUNDARY="This inference is read-only and does not execute wallet signing, chain mutation, deployment, governance voting, fund movement, token approval or transfer, smart contract upgrade, or autonomous posting."

printf "%s\n" "$QUERY" > "$TMP_PROMPT"

echo "Running local Hermes/Ollama inference..."
echo "Model: $MODEL"
echo "Output: $OUTFILE"

ollama run "$MODEL" "$QUERY" > "$TMP_OUTPUT"

PROMPT_SHA256="$(sha256sum "$TMP_PROMPT" | awk "{print \$1}")"
OUTPUT_SHA256="$(sha256sum "$TMP_OUTPUT" | awk "{print \$1}")"

env \
HERMES_OUTFILE="$OUTFILE" \
HERMES_RECEIPT_ID="QPF-HERMES-RECEIPT-${TIMESTAMP}-${SHORT_SHA}" \
HERMES_TIMESTAMP="$ISO_TIMESTAMP" \
HERMES_MODEL="$MODEL" \
HERMES_PROMPT_PATH="$TMP_PROMPT" \
HERMES_OUTPUT_PATH="$TMP_OUTPUT" \
HERMES_PROMPT_SHA="$PROMPT_SHA256" \
HERMES_OUTPUT_SHA="$OUTPUT_SHA256" \
node scripts/hermes-write-receipt.cjs
echo "Inference receipt written: $OUTFILE"

if [ -x scripts/evidence-index-refresh.sh ]; then
  echo "Refreshing evidence index..."
  bash scripts/evidence-index-refresh.sh
fi

if [ -x scripts/evidence-index-verify.sh ]; then
  echo "Verifying evidence index..."
  bash scripts/evidence-index-verify.sh
fi

echo "Hermes run complete."
