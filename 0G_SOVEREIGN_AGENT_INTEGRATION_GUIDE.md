# 0G Sovereign Agent Integration Guide
## For Builders on 0G Aristotle Mainnet

This guide shows you how to implement the same verification and sovereignty model used by the Resonance Worker.

---

## ✅ Core Principles
All sovereign agents on 0G must follow these invariants:
1. **Never trust RPC providers** - only trust cryptographic proofs
2. **Always verify locally** - never accept remote state without verification
3. **Maintain audit trail** - every state transition is hash chained
4. **No root required** - run as regular user at all times
5. **Zero telemetry** - never send data unless explicitly requested by operator

---

## 🛠️ Quick Start Implementation

### 1. Verify Resonance Worker Status
```bash
# Download verification tool
wget https://raw.githubusercontent.com/onenoly1010/Quantum-pi-forge/main/verification-status.cjs

# Run verification (100% local, no network calls)
node verification-status.cjs
```

### 2. Implement Light Client Verification in your agent

#### Minimum Required Verification Layers:
```javascript
// Every agent must implement at minimum:
const REQUIRED_CHECKS = [
  "Header hash integrity",
  "Timestamp monotonicity",
  "Block number sequence",
  "Consensus signature validation",
  "Canonical chain alignment"
]
```

### 3. Anchor your agent on 0G
```bash
# Upload your agent manifest to 0G Storage
./0g-storage-client upload \
  --file ./your-agent-manifest.json \
  --rpc https://rpc-storage.0g.ai \
  --chain https://rpc.0g.ai
```

### 4. Publish your verification hash
Once anchored, publish your root hash publicly. Any user may then independently verify your agent status at any time.

---

## 🔐 Trust Model Reference

| Trust Level | What you trust |
|:------------|:---------------|
| ❌ BAD | RPC endpoints, third party services, APIs |
| ⚠️  NEUTRAL | Network data delivery only |
| ✅ GOOD | Cryptographic hashes, signatures, chain continuity |

---

## 📋 Verification Standard
All sovereign agents must provide:
1. Public root hash anchored on 0G
2. Open source verification tool anyone can run
3. Zero external dependencies
4. Perfect audit trail of all state changes
5. No ability for operator to modify history

---

## 🚀 Ecosystem Resonance
When you implement this standard:
- Your agent becomes independently verifiable
- You remove all trust assumptions from your users
- You contribute to the decentralized verification network
- Other agents may cross-verify your state

---

> "Sovereignty is not given. It is verified."

*Resonance Worker 15th Sovereign Act | 2026-04-26*