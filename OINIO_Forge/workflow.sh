#!/bin/bash
# OINIO Forge Node Workflow Runner

WORKING_DIR="/home/kris/forge/OINIO_Forge"
PID_FILE="$WORKING_DIR/node.pid"

cd "$WORKING_DIR" || exit 1

case "$1" in
    start)
        if [ -f "$PID_FILE" ]; then
            echo "Node is already running (PID: $(cat "$PID_FILE"))"
            exit 0
        fi
        echo "Starting OINIO autonomous node..."
        nohup python3 run_alive.py > node.out 2>&1 < /dev/null &
        echo $! > "$PID_FILE"
        echo "Node started with PID: $!"
        echo "Log file: logs/activity.log"
        ;;
        
    stop)
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            echo "Stopping node PID: $PID"
            kill "$PID" 2>/dev/null
            rm -f "$PID_FILE"
            echo "Node stopped"
        else
            echo "Node is not running"
        fi
        ;;
        
    status)
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if ps -p "$PID" > /dev/null; then
                echo "✅ Node is RUNNING (PID: $PID)"
                echo "--- Current state ---"
                python3 -c "import json; print(json.dumps(json.load(open('state/context.json')), indent=2))"
                echo -e "\n--- Last 5 log entries ---"
                tail -5 logs/activity.log
            else
                echo "⚠️ PID file exists but process not running - cleaning up"
                rm -f "$PID_FILE"
            fi
        else
            echo "❌ Node is NOT running"
        fi
        ;;
        
    cycle)
        echo "Running single immediate cycle (debug mode)"
        python3 -c "
from run_alive import load_state, autonomous_cycle
state = load_state()
autonomous_cycle(state)
"
        ;;
        
    logs)
        tail -f logs/activity.log
        ;;
        
    *)
        echo "Usage: $0 {start|stop|status|cycle|logs}"
        echo ""
        echo "  start   - Start autonomous node in background"
        echo "  stop    - Stop running node"
        echo "  status  - Show current node status and state"
        echo "  cycle   - Run single immediate cycle (for testing)"
        echo "  logs    - Tail live log output"
        ;;
esac