#!/bin/bash

# OINIO Token Whale Transaction Monitor
# Sends Mint desktop notification for transactions over 1,000,000 units

CONTRACT="0xbebc1a40a18632cee19d220647e7ad296a1a5f37"
THRESHOLD=1000000
CSV_FILE="token-OINIO-${CONTRACT}-2026.04.15.csv"
STATE_FILE=".oinio_last_processed"

# Initialize state if not exists
[ ! -f "$STATE_FILE" ] && echo 0 > "$STATE_FILE"
LAST_PROCESSED=$(cat "$STATE_FILE")

# Check for large transactions
NEW_WHALES=$(awk -F, -v last="$LAST_PROCESSED" -v threshold="$THRESHOLD" '
NR>1 && NR>last && $9 > threshold { print NR "," $3 "," $6 "," $7 "," $9 }' "$CSV_FILE")

if [ -n "$NEW_WHALES" ]; then
    echo "$NEW_WHALES" | while IFS=, read -r lineno txhash from to qty; do
        # Send Mint system notification
        notify-send -u critical -i dialog-warning "🐋 OINIO WHALE ALERT" "
Transaction over $THRESHOLD detected

Hash: ${txhash:0:18}...
From: ${from:0:16}...
To:   ${to:0:16}...
Qty:  $qty OINIO"
        
        echo "$(date +"%Y-%m-%d %H:%M:%S") | Whale transaction detected: $qty OINIO $from -> $to"
    done
    
    # Update last processed line
    tail -n1 "$CSV_FILE" | wc -l | xargs expr $LAST_PROCESSED + > "$STATE_FILE"
fi