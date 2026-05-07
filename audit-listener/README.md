# Quantum Pi Forge Audit Listener

Live on-chain event verification pipeline that validates contract behaviour against the formal audit specification.

This service directly implements the verification rules defined in `QUANTUM_PI_FORGE_FORMAL_AUDIT_SPECIFICATION_v1.0.md`

---

## ✅ FEATURES

* Real-time WebSocket subscription to 0G Aristotle Mainnet
* Direct ABI log decoding
* Deterministic mathematical validation of all economic parameters
* Append-only immutable audit logging
* Real-time PASS/FAIL status output
* Exact rule mapping to audit specification sections

---

## 🚀 RUNNING

```bash
cd audit-listener
npm install
npm start
```

---

## 📏 VALIDATED RULES

| Specification Rule | Status | Implemented |
|---|---|---|
| 4.1 DEX Swap Fee 0.5% | ✅ | ✓ |
| 4.2 NFT Royalty 2.5% | ✅ | ✓ |
| 4.3 Staking Fee 1% | ✅ | ✓ |
| 4.4 Bridge Fee 0.25% | ⏳ | Planned |
| 4.5 Validator Rewards | ⏳ | Planned |

---

## 📜 AUDIT LOG FORMAT

Every transaction produces a structured log entry:
```json
{
  "timestamp": 1746545972133,
  "event": {
    "module": "DEX",
    "event": "SwapExecuted",
    "tx": "0x3d768430ab02659be395afcc116b4c70739f0590dac3b0818da3088d8a104ba9",
    "block": 31874842
  },
  "status": "PASS",
  "violations": []
}
```

---

## 🔒 GUARANTEES

* No off-chain state modification
* No oracle dependencies
* All validation logic is pure and deterministic
* Logs are append-only and cannot be modified
* All mathematical operations use native BigInt with no floating point errors

This is the bridge between the formal audit specification and actual on-chain reality.