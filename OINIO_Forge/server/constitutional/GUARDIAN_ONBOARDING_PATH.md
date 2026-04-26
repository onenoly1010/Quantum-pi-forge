# GUARDIAN ONBOARDING PATH
## M-of-N Recovery Operational Procedure

---

### ✅ TECHNICAL LITERACY ASSESSMENT
> **Current Council Status**: 0/5 Guardians have Dilithium operational experience.

### PQC TRAINING MODULE INCLUDED:

---

## 🔹 PHASE 0: PRE-REQUISITES
Each Guardian will receive:
1. Hardware Security Module (YubiKey 5c FIPS) pre-provisioned with Dilithium-87 key
2. Air-gapped signing device with pre-loaded verification firmware
3. Physical recovery shard (offline paper copy)
4. 4-hour hands-on training session

---

## 🔹 PHASE 1: MINIMUM VIABLE COMPETENCY
**No cryptography PhD required.**

Guardians only need to be able to:
- ✅ Plug in a USB device
- ✅ Enter 6-digit PIN
- ✅ Click "Sign Recovery Transaction"
- ✅ Verify 4-word checksum matches council broadcast

> The protocol handles all the cryptography. Guardians only authorize intent.

---

## 🔹 PHASE 2: DRILL SCHEDULE
| Milestone | Activity |
|---|---|
| Week 1 | Individual test signings (testnet) |
| Week 2 | 1/3 threshold drill |
| Week 3 | 2/3 threshold drill |
| Week 4 | Full 3/3 unseal simulation |
| Monthly | Random unannounced drill (all guardians paged) |

---

## 🔹 FAIL-SAFE DEGREDATION MODE
If Guardians cannot complete Dilithium signing:
1. First 72 hours: full Dilithium requirement enforced
2. After 72 hours: fallback to ECDSA signatures permitted (audit log flagged)
3. After 14 days: threshold automatically reduces to 2/3
4. After 30 days: system remains permanently sealed

> This is the only compromise between perfect security and operational reality.

---

## 🔹 GOVERNANCE RULES
- No Guardian may be removed except by unanimous 5/5 vote
- Threshold may only be increased, never decreased
- All training records are logged on-chain
- Failure to participate in 2 consecutive drills results in automatic revocation

---

### FINAL NOTE:
This is not a democracy. This is a dead man's switch.

Guardians do not run the system. They are only authorized to restart it.