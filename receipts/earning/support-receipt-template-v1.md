# QPF support / sponsorship receipt template v1

**Status:** template only — do not fill payment fields without proof  
**Custody:** human-controlled  
**Agent signing:** forbidden

```text
receipt: qpf.support_receipt.v1
payment_status: NONE | PROVEN
do_not_mark_earned_unless: payment_status = PROVEN
```

| Field | Value |
| --- | --- |
| receipt_id | |
| timestamp_utc | |
| contributing_agents | |
| task_performed | |
| deliverable | |
| evidence_refs | |
| recipient_or_customer | |
| gross_amount | |
| currency | CAD (preferred) or 0G with CAD/USD equivalent |
| receiving_party | human operator / designated receive address |
| attribution_rule | **undefined in canonical earning ungate** — record gross first; share assignment needs a separate governance decision |
| attributable_agent_share | NOT ASSIGNED |
| actual_received_amount | |
| payment_rail | Interac Autodeposit / native 0G 16661 |
| payment_evidence | tx hash **or** Interac confirmation — required for PROVEN |

Do not invent a percentage. `AGENT_EARNING_UNGATE_V1.md` defines lanes, not a split.
