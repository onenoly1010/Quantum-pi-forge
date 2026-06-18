#!/usr/bin/env bash
set -euo pipefail
DOC="docs/ops/SPIRAL_RETURN_FIELD_PLAN_V1.md"
REC="receipts/ops/spiral-return-field-plan-v1.json"
LOG="logs/field/spiral-return-field-log-template-v1.csv"
test -f "$DOC"
test -f "$REC"
test -f "$LOG"
grep -q "No live execution is authorized by this plan." "$DOC"
grep -q "ECONOMIC_SOVEREIGNTY_GATE_V1" "$DOC"
python3 -c 'import json,hashlib,pathlib,sys; rec=json.loads(pathlib.Path("receipts/ops/spiral-return-field-plan-v1.json").read_text()); doc=pathlib.Path(rec["document"]); sha=hashlib.sha256(doc.read_bytes()).hexdigest(); assert rec["document_sha256"]==sha; assert rec["live_execution_authorized"] is False; assert rec["wallet_actions_authorized"] is False; assert rec["live_revenue_claim"] is False; assert rec["mobile_node_demo_authorized"] is True; assert rec["human_reconciliation_required"] is True; print("SPIRAL_RETURN_FIELD_PLAN_V1_VERIFIED")'
