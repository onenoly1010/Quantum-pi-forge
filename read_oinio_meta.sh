#!/bin/bash

ADDR="0x6011c341a01c80f489a5c3Ab751987A55142F04e"
RPC="https://evmrpc.0g.ai"

echo "=== Querying OINIO Identity Strings ==="

# 1. Query name() -> 0x06fdde03
HEX_NAME=$(curl -s "$RPC" -H 'Content-Type: application/json' \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_call\",\"params\":[{\"to\":\"$ADDR\",\"data\":\"0x06fdde03\"},\"latest\"],\"id\":1}" \
  | python3 -c "import sys, json; print(json.load(sys.stdin).get('result', ''))")

# 2. Query symbol() -> 0x95d89b41
HEX_SYMBOL=$(curl -s "$RPC" -H 'Content-Type: application/json' \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_call\",\"params\":[{\"to\":\"$ADDR\",\"data\":\"0x95d89b41\"},\"latest\"],\"id\":2}" \
  | python3 -c "import sys, json; print(json.load(sys.stdin).get('result', ''))")

decode_hex_string() {
    local hex=$1
    if [ -z "$hex" ] || [ "$hex" = "0x" ]; then
        echo "Unknown"
        return
    fi
    # Strip 0x and parse EVM string layout (offset, length, data)
    python3 -c "
hex_data = '$hex'[2:]
if len(hex_data) >= 128:
    length = int(hex_data[64:128], 16)
    data_hex = hex_data[128:128 + length*2]
    print(bytes.fromhex(data_hex).decode('utf-8', errors='ignore'))
else:
    print('Decoding Error')
"
}

echo -n "Token Name:   "
decode_hex_string "$HEX_NAME"
echo -n "Token Symbol: "
decode_hex_string "$HEX_SYMBOL"

