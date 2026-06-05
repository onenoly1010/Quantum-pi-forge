#!/usr/bin/env bash
set -Eeuo pipefail

# Usage: ./scripts/forge-evidence-packet.sh <claim_id> <file> <pattern> <description>

CLAIM_ID="${1:-test-$(date +%s)}"
TARGET_FILE="${2:-}"
SEARCH_PATTERN="${3:-}"
DESCRIPTION="${4:-No description}"

if [[ -z "$TARGET_FILE" || -z "$SEARCH_PATTERN" ]]; then
  echo "Usage: $0 <claim_id> <file> <pattern> <description>" >&2
  exit 1
fi

if [[ ! -f "$TARGET_FILE" ]]; then
  echo "ERROR: target file not found: $TARGET_FILE" >&2
  exit 2
fi

mkdir -p examples logs

SAFE_ID="$(printf "%s" "$CLAIM_ID" | tr -cs "A-Za-z0-9._-" "-")"
OUTPUT_JSON="examples/verification-packet-${SAFE_ID}.json"
OUTPUT_MD="examples/verification-packet-${SAFE_ID}.md"
JOURNAL="logs/verification.journal"
MATCHES_FILE="$(mktemp)"
trap 'rm -f "$MATCHES_FILE"' EXIT

grep -E -i -n "$SEARCH_PATTERN" "$TARGET_FILE" > "$MATCHES_FILE" || true
MATCH_COUNT="$(wc -l < "$MATCHES_FILE" | tr -d " ")"

if [[ "$MATCH_COUNT" -gt 0 ]]; then
  STATUS="fail"
  SUMMARY="Claim failed: $DESCRIPTION - found matching pattern(s) in $TARGET_FILE"
  EVIDENCE_TYPE="positive"
  RISK_LEVEL="medium"
  RESULT_TEXT="Matches found"
else
  STATUS="pass"
  SUMMARY="Claim verified: $DESCRIPTION - no matches for pattern in $TARGET_FILE"
  EVIDENCE_TYPE="negative"
  RISK_LEVEL="low"
  RESULT_TEXT="No matches found"
fi

export CLAIM_ID TARGET_FILE SEARCH_PATTERN DESCRIPTION STATUS SUMMARY EVIDENCE_TYPE RISK_LEVEL MATCH_COUNT

python3 -c "import json, os; packet={\"skill\":\"quantum-pi-forge\",\"version\":\"0.1.0\",\"mode\":\"local-first\",\"request_id\":os.environ[\"CLAIM_ID\"],\"status\":os.environ[\"STATUS\"],\"summary\":os.environ[\"SUMMARY\"],\"evidence\":[{\"type\":\"file\",\"reference\":os.environ[\"TARGET_FILE\"],\"description\":\"Scanned target file\"},{\"type\":\"command\",\"reference\":\"grep -E -i -n <pattern> <target_file>\",\"description\":\"Evidence: \"+os.environ[\"EVIDENCE_TYPE\"]+\" match; match_count=\"+os.environ[\"MATCH_COUNT\"]}],\"risks\":[{\"level\":os.environ[\"RISK_LEVEL\"],\"description\":\"Static grep may miss dynamic, generated, minified, or obfuscated content.\",\"mitigation\":\"Use broader static analysis, bundle inspection, and manual review before treating this as complete.\"}],\"authority_boundary\":{\"wallet_signing\":False,\"chain_mutation\":False,\"deployment\":False,\"funds_movement\":False,\"governance_execution\":False,\"requires_human_authorization\":True},\"next_action\":\"Run broader scan or integrate into local CI surrogate.\"}; print(json.dumps(packet, indent=2))" > "$OUTPUT_JSON"

printf "%s\n" "# Forge Verification Packet: $CLAIM_ID" > "$OUTPUT_MD"
printf "%s\n\n" "**Claim:** $DESCRIPTION" >> "$OUTPUT_MD"
printf "%s\n\n" "**File:** $TARGET_FILE" >> "$OUTPUT_MD"
printf "%s\n\n" "**Status:** $STATUS" >> "$OUTPUT_MD"
printf "%s\n" "## Evidence" >> "$OUTPUT_MD"
printf "%s\n\n" "Pattern \`$SEARCH_PATTERN\` searched in \`$TARGET_FILE\`." >> "$OUTPUT_MD"
printf "%s\n\n" "Result: $RESULT_TEXT." >> "$OUTPUT_MD"
printf "%s\n" "## What was NOT checked" >> "$OUTPUT_MD"
printf "%s\n" "- Runtime execution" >> "$OUTPUT_MD"
printf "%s\n" "- External or dynamically loaded scripts" >> "$OUTPUT_MD"
printf "%s\n" "- Minified bundles" >> "$OUTPUT_MD"
printf "%s\n\n" "- Semantic review beyond the supplied grep pattern" >> "$OUTPUT_MD"
printf "%s\n\n" "**Risk Level:** $RISK_LEVEL" >> "$OUTPUT_MD"
printf "%s\n\n" "**Authority Boundary:** Read-only inspection. No signing, deployment, funds movement, governance execution, or chain mutation." >> "$OUTPUT_MD"
printf "%s\n" "## Reproduce" >> "$OUTPUT_MD"
printf "%s\n" "\`\`\`bash" >> "$OUTPUT_MD"
printf "%s\n" "grep -E -i -n \"$SEARCH_PATTERN\" \"$TARGET_FILE\"" >> "$OUTPUT_MD"
printf "%s\n" "\`\`\`" >> "$OUTPUT_MD"

printf "[%s] %s %s %s\n" "$(date -Iseconds)" "$CLAIM_ID" "$STATUS" "$SUMMARY" >> "$JOURNAL"
cat "$OUTPUT_JSON" >> "$JOURNAL"
printf "\n" >> "$JOURNAL"

echo "Generated: $OUTPUT_JSON"
echo "Generated: $OUTPUT_MD"
echo "Journal updated locally: $JOURNAL"
