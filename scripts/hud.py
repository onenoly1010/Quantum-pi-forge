#!/usr/bin/env python3
# OINIO HUD - Local Health Dashboard
from flask import Flask, jsonify, render_template_string
import json
import os

app = Flask(__name__)

STATUS_FILE = "./local/var/run/guardian/status.json"

DASHBOARD_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>OINIO TELEMETRY SIDEWINDER</title>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="10">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #050505; color: #00ff88; font-family: monospace; padding: 2rem; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { border-bottom: 1px solid #00ff88; padding-bottom: 1rem; margin-bottom: 2rem; }
        .metric { background: #0a0a0a; padding: 1.5rem; margin: 1rem 0; border-left: 3px solid #00ff88; }
        .metric-label { opacity: 0.7; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .metric-value { font-size: 2rem; font-weight: bold; }
        .alert { background: #2d0000; border-left: 3px solid #ff3333; color: #ff3333; animation: pulse 1s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .timestamp { margin-top: 3rem; opacity: 0.5; font-size: 0.8rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>⬡ TELEMETRY SIDEWINDER ⬡</h1>
        <div class="metric">
            <div class="metric-label">GUARDIAN HEARTBEAT</div>
            <div class="metric-value">{{ data.guardian_heartbeat }}</div>
        </div>
        <div class="metric">
            <div class="metric-label">TOTAL ATTEMPTS</div>
            <div class="metric-value">{{ data.metrics.attempts }}</div>
        </div>
        <div class="metric">
            <div class="metric-label">QUORUM REJECTS</div>
            <div class="metric-value">{{ data.metrics.quorum_rejects }}</div>
        </div>
        <div class="metric">
            <div class="metric-label">SIGNATURE FAILURES</div>
            <div class="metric-value">{{ data.metrics.signature_failures }}</div>
        </div>
        <div class="metric">
            <div class="metric-label">SUCCESSFUL EXECUTIONS</div>
            <div class="metric-value">{{ data.metrics.successful_executions }}</div>
        </div>
        {% if data.alerts %}
        <div class="metric alert">
            <div class="metric-label">⚠️  CRITICAL ALERT ACTIVE</div>
            <div class="metric-value">SIGNATURE FAILURE DETECTED</div>
        </div>
        {% endif %}
        <div class="timestamp">Last Updated: {{ data.timestamp }} UTC</div>
    </div>
</body>
</html>
"""

@app.route('/')
def dashboard():
    try:
        with open(STATUS_FILE, 'r') as f:
            data = json.load(f)
        return render_template_string(DASHBOARD_TEMPLATE, data=data)
    except Exception:
        return render_template_string(DASHBOARD_TEMPLATE, data={
            "timestamp": "UNKNOWN",
            "guardian_heartbeat": "OFFLINE",
            "metrics": {
                "attempts": 0,
                "quorum_rejects": 0,
                "signature_failures": 0,
                "successful_executions": 0
            },
            "alerts": False
        })

@app.route('/health')
def health():
    try:
        with open(STATUS_FILE, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception:
        return jsonify({"status": "offline"}), 500

if __name__ == '__main__':
    print("OINIO HUD running on http://0.0.0.0:8080")
    app.run(host='0.0.0.0', port=8080, debug=False)