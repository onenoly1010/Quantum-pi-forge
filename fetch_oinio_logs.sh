#!/bin/bash

ADDR="0x6011c341a01c80f489a5c3Ab751987A55142F04e"
RPC="https://evmrpc.0g.ai"
START_BLOCK="0x1e65cda" # 31874842 in hex

echo "Checking for all on-chain events for OINIO Core since genesis..."
echo "--------------------------------------------------------"

RESPONSE=$(curl -s "$RPC" \
  -H 'Content-Type: application/json' \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getLogs\",\"params\":[{\"address\":\"$ADDR\",\"fromBlock\":\"$START_BLOCK\",\"toBlock\":\"latest\"}],\"id\":1}")

# Check if any logs exist
LOG_COUNT=$(echo "$RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin).get('result', [])))" 2>/dev/null)

if [ -z "$LOG_COUNT" ] || [ "$LOG_COUNT" -eq 0 ]; then
  echo "❌ Zero events found. The contract has been completely idle since deployment."
else
  echo "✅ Found $LOG_COUNT historical event(s)!"
  echo "$RESPONSE" | python3 -m json.tool | grep -E '"blockNumber"|"transactionHash"|"topics"' -A 2
fi
