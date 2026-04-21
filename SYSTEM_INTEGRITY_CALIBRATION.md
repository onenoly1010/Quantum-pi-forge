# System Integrity Calibration
## Actual Invariants Implemented v1.3

---

## ✅ What is *structurally* guaranteed

| Guarantee | Status | Enforcement |
|-----------|--------|-------------|
| Single source of truth | ✅ Fully enforced | Manifest is canonical reference for all operations |
| Resolver symmetry | ✅ Correct | Identical verification logic runs in browser + Node.js |
| Execution path unification | ✅ Solid | All code paths go through same verification gate |
| Deterministic verifier | ✅ Operational | Same input always produces same verification result |
| No silent failures | ✅ **This is the big win** | System will never lie about validity |

---

## ⚠️ What is *not* guaranteed (and never was)

> ❌ **DO NOT CLAIM:** "environment-independent"

This system is **environment-aware and environment-validating by design**.

It intentionally depends on and verifies:
  * RPC endpoint connectivity and chain identity
  * Actual chain state at current block height
  * Contract deployment existence and bytecode
  * Manifest declarations matching on-chain reality

---

## 🚨 The actual invariant you built

> **"This system will fail loudly and deterministically when reality diverges from the manifest."**

This is the true safety property. Not "never fails" — **never fails silently**.

---

## 📊 Current System State

| Verification Check | Result |
|--------------------|--------|
| RPC Reported ChainId | `16602` |
| Manifest Declared ChainId | `16661` |
| Contract Deployment Status | ❌ Not deployed |
| Verifier Result | ✅ **HARD FAIL** |

✅ This is **correct behavior**.

The system is operating exactly as designed:
> **"I refuse to operate because your assumptions are wrong."**

---

## 🔄 Before vs After

| Before | Now |
|--------|-----|
| System *assumed* correctness | System **demands proof of correctness** |
| Would proceed with invalid state | Will stop execution entirely |
| Silent failures possible | All failures are explicit and observable |
| Trust required | Verification required |

---

## ✅ Completion Criteria

This system is considered "operational" **only when all four are true**:
1.  ✅ RPC connected to correct network
2.  ✅ Chain contains declared deployment block
3.  ✅ Contract returns valid non-`0x` bytecode
4.  ✅ Verifier passes cleanly with zero mismatches

Until then, hard fail is **integrity working as intended**.

---

## 🧠 Final Calibration

You did not build a system that works everywhere.

You built a system that:
> **Truth must match declaration — or execution stops.**

That is a far more powerful guarantee.

---

*This document replaces all previous claims about environment independence. All documentation, comments, and descriptions should be updated to reflect this actual invariant.*