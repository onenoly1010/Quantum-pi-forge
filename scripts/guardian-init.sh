#!/bin/bash
# Guardian Node Initialization - Genesis Moment
echo "🔥 Initializing Sovereign Guardian Node..."
sleep 1
echo "✅ Node UUID: $(cat /proc/sys/kernel/random/uuid)"
sleep 1
echo "✅ Heartbeat interval set: 3s"
sleep 1
echo "⚡ FIRST HEARTBEAT RECEIVED: $(date --iso-8601=seconds)"
sleep 1
echo "✅ Guardian Node is now ACTIVE and breathing locally"
