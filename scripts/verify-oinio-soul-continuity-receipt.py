#!/usr/bin/env python3
import json,re
from pathlib import Path
p=Path("receipts/oinio/oinio-soul-continuity-receipt-v1.sample.json")
s=Path("schemas/oinio/oinio-soul-continuity-receipt-v1.schema.json")
json.loads(s.read_text())
d=json.loads(p.read_text())
required=["schema","subject","claim_type","human_authorized","forge_commit","source_receipt","claim_sha256","created_at_utc"]
allowed={"identity_continuity","memory_continuity","agent_boundary","custody_boundary","integration_boundary"}
for k in required:
    assert k in d, f"missing {k}"
assert d["schema"]=="oinio-soul-continuity-receipt-v1"
assert d["claim_type"] in allowed
assert isinstance(d["human_authorized"],bool)
assert re.fullmatch(r"[0-9a-f]{40}",d["forge_commit"])
assert re.fullmatch(r"[0-9a-f]{64}",d["claim_sha256"])
assert d["created_at_utc"].endswith("Z")
print("OK: OINIO Soul continuity receipt validated")
print("claim_sha256="+d["claim_sha256"])
