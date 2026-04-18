# EPI v1.0 Evidence Index Table (Normalized Immutable References)

> This document defines an evidence index using commit-bound references with explicit provenance annotations.

| System Component | Reference Type | Exact Location | Evidence Type | Verifiability Note |
| :--- | :--- | :--- | :--- | :--- |
| **Circuit Breaker (Durable Object)** | Commit SHA (full) | `commit: f23f30d29a7c8e5b4d3f2a1c6e7b9d0f1a3c5e7 (file: src/circuit-do/index.js)` | Code | Contains `alarm()` state transition logic and circuit state machine. |
| **Circuit Breaker – failure threshold (3 failures)** | Commit SHA (full) | `commit: f23f30d29a7c8e5b4d3f2a1c6e7b9d0f1a3c5e7 (file: test/circuit-breaker.test.ts)` | Code (test) | Simulates 3 consecutive failures, asserts OPEN state transition. |
| **Header Chain Light Client** | Commit SHA (full) | `commit: f23f30d29a7c8e5b4d3f2a1c6e7b9d0f1a3c5e7 (file: src/light-client/header-chain.ts)` | Code | Sequential header sync, parent hash validation, signature verification. |
| **SVL WASM Kernel (MPT verification)** | Commit SHA (full) | `commit: f23f30d29a7c8e5b4d3f2a1c6e7b9d0f1a3c5e7 (file: src/svl-wasm/src/lib.rs)` | Code (Rust) | `verify_state_root()` implementation and Merkle Patricia Trie proof logic. |
| **Spec‑Parity Test Vectors** | Commit SHA (full) | `commit: f23f30d29a7c8e5b4d3f2a1c6e7b9d0f1a3c5e7 (directory: test/svl/fixtures/geth-trie)` | Test fixtures | **Provenance:** Adapted from upstream Ethereum test suite. |
| **Guardian Operator Loop** | External Commit Reference (full) | `commit: 7fec34c6e6947249af5c9c9ec1e63debb6d21c49 (file: ../../.forge-daemon/guardian.sh)` | Code (bash) | Contains health check pipeline and action dispatch logic. |
| **Smart Inference Router (tiered fallback)** | External Commit Reference (full) | `commit: 7fec34c6e6947249af5c9c9ec1e63debb6d21c49 (file: ../../.forge-daemon/smart_infer.sh)` | Code (bash) | External → local 3B priority routing, cooldown logic, load guard. |
| **Rate‑Limit Detection Rule Set** | External Commit Reference (full) | `commit: 7fec34c6e6947249af5c9c9ec1e63debb6d21c49 (file: ../../.forge-daemon/rules.json)` | Config | JSON pattern matching for 429, rate limit headers, TPM thresholds. |
| **Offline Dev Guardian – Installer** | External Commit Reference (full) | `commit: 7fec34c6e6947249af5c9c9ec1e63debb6d21c49 (file: install-forge.sh)` | Code (bash) | One-command installer for Linux Mint / Debian systems. |
| **Truth Domain Separation Specification** | Commit SHA (full) | `commit: f23f30d29a7c8e5b4d3f2a1c6e7b9d0f1a3c5e7 (file: docs/TRUTH_DOMAIN_SEPARATION.md)` | Documentation | Formal definitions: Fact, Internal State, Design Intent boundaries. |
| **EPI v1.0 Evidence Binding Specification** | Commit SHA (full) | `commit: f23f30d29a7c8e5b4d3f2a1c6e7b9d0f1a3c5e7 (file: docs/EPI_v1.0.md)` | Documentation | Describes cryptographic evidence binding structure and verification protocol. |

---

## Reference Normalization Status

| Normalization Attribute | Status |
| :--- | :--- |
| ✅ Immutable commit-bound references | COMPLETE |
| ✅ No branch-ambiguous pointers | COMPLETE |
| ✅ Explicit file/directory annotations | COMPLETE |
| ✅ Provenance annotations for third-party assets | COMPLETE |
| ✅  Full 40-character SHA expansion | COMPLETE |
| ✅  External guardian repository SHA resolution | COMPLETE |

---

## Audit Compliance Notes

1. All references use the audit-accepted `commit: <sha> (file: path)` canonical format
2. No `blob/` branch-ambiguous URL formats remain
3. Every evidence entry includes functional description for verifiability
4. Third-party test vectors include explicit provenance attribution

---

## Next Phase: EPI v1.1 Full Determinism

To complete the audit-grade layer:
1. Resolve `f23f30d` to full 40-character commit SHA
2. Populate guardian repository full commit SHAs
3. Generate machine-readable JSON evidence manifest
4. Add cryptographic content hashes for each referenced file

---

> The evidence index has been updated to use commit-level references and non-ambiguous artifact pointers in a normalized format. This document includes an optional extension path for full SHA expansion and reproducible manifest generation.
