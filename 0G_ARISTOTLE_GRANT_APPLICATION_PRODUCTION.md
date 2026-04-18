# 0G Grant Readiness Technical Whitepaper  
**OINIO Soul System – Sovereign, Deterministic, Verifiable Edge Infrastructure**

*Document Version 1.0 – April 2026*  
*Corresponding Commit: `b22b391` (EPI v1.5)*

---

## 1. Executive Summary

The OINIO Soul System is a **locally orchestrated, policy‑gated execution system with cryptographic enforcement**. It enables deterministic, auditable, and verifiable management of AI agents, smart contract escrows, and infrastructure provisioning without reliance on third‑party cloud services.

**Key properties:**  
- **Deterministic** – same input → same output (EPI v1.0‑1.5)  
- **Verifiable** – cosign signatures, signed capability tokens, causal hash chain  
- **Observable** – local telemetry (Sidewinder) without external data leakage  
- **Resilient** – 3‑layer lockdown protocol (L1 flag, L2 systemd, L3 quorum broadcast)

**Target grant:** 0G Aristotle ecosystem fund – to accelerate development of sovereign AI tooling and decentralised infrastructure.

---

## 2. System Architecture (Summary)

The system is decomposed into six layers, each with a distinct responsibility and verifiable artifact.

| Layer | Component | Role | Evidence |
| :--- | :--- | :--- | :--- |
| **1. Build** | EPI v1.5 container | Deterministic image build | `infra/repro/Dockerfile` (commit `b22b391`) |
| **2. Signing** | Cosign + minisign | Cryptographic artifact binding | `cosign.pub` in repo; `gate.sh` verification |
| **3. Quorum** | `aggregate.sh` + `policy.json` | N‑of‑M signature aggregation | `quorum/` directory, tests |
| **4. Execution Gate** | `gate.sh` + capability token | Single entrypoint, token verification | `runtime/gate.sh` (causal chain) |
| **5. Observability** | Sidewinder + local HUD | Log aggregation, health status | `scripts/sidewinder.sh`, `hud.py` |
| **6. Incident Response** | 3‑layer lockdown | Emergency freeze, key revocation | `emergency_lockdown.sh`, broadcast |

---

## 3. Core Security Primitives

### 3.1 Capability Token (Signed by Quorum)

After quorum approval, a token is issued containing:

- `image_digest` (SHA‑256)  
- `nonce` (UUID)  
- `expiry` (timestamp)  
- `proposal_hash` (hash of the proposal)

Token is signed with the quorum private key. `gate.sh` verifies the signature using the public key (`/etc/guardian/quorum.pub`). Execution proceeds only if the token is valid and matches the expected image digest.

### 3.2 Causal Hash Chain

Each proposal includes `prev_proposal_hash`, linking it to the previous accepted proposal. Nodes maintain `/etc/guardian/last_proposal.hash`. Any proposal that does not extend the current chain is rejected. This prevents replay attacks and forks.

### 3.3 3‑Layer Lockdown Protocol

| Layer | Mechanism | Scope |
| :--- | :--- | :--- |
| L1 | `/etc/guardian/EXECUTION_DISABLED` flag | Local policy gate (checked by `gate.sh`) |
| L2 | `systemctl stop guardian-*` | Immediate runtime containment |
| L3 | Quorum‑signed broadcast | Cluster‑wide propagation via `/lockdown` endpoint |

Lockdown does not delete keys; it archives them and requires re‑provisioning for recovery. This preserves auditability.

---

## 4. Verifiability & Reproducibility

- **EPI v1.5 container** – pinned Debian snapshot, fixed tool versions (`jq`, `minisign`, `cosign`).  
- **CI pipeline** – builds, signs, and attests OCI images; all steps are deterministic.  
- **Test suite** – 37 unit/invariant/fuzz tests (Foundry) pass inside the hermetic container.  
- **Reproducibility script** – `epi-reproduce.sh` regenerates the JSON manifest and compares hashes.

**External reviewer can:**  
1. Clone the repository at commit `b22b391`.  
2. Run `docker build` and `docker run` to reproduce the manifest.  
3. Verify cosign signatures using the public key in the repo.  
4. Simulate quorum approval and observe `gate.sh` enforcement.

---

## 5. Threat Model Summary

| Threat | Mitigation | Residual Risk |
| :--- | :--- | :--- |
| Local privilege escalation | Capability token + quorum signature | None (token required) |
| Replay attack | Nonce + causal chain + single‑use token | None |
| Quorum hijacking (≤N‑1 nodes) | Threshold signatures (N‑of‑M) | N‑of‑M collusion (requires majority) |
| Private key compromise | Emergency lockdown (L1‑L3) + key archival | Attacker can act before lockdown |
| Supply chain (image substitution) | Cosign verification + digest pinning | None |

**Residual risk acceptance:** Quorum key compromise requires immediate lockdown and manual re‑provisioning. This is documented in the incident response plan.

---

## 6. Grant Impact & Sustainability

The 0G grant will be used to:

- **Harden the quorum engine** – add BFT consensus (if needed) and formal verification.  
- **Extend EPI** – to cover the full build pipeline (source → OCI → deployment).  
- **Audit & compliance** – engage a third‑party auditor for the capability token and escrow contract.  
- **Community onboarding** – documentation, workshops, and 0G ecosystem integration.

**Long‑term sustainability:** The system is designed to be self‑hosting. After grant completion, the Forge will operate as a sovereign, low‑cost infrastructure for AI agents, with potential revenue from iNFT minting, escrow fees, and consulting.

---

## 7. Conclusion

The OINIO Soul System is a **real, running, verifiable execution platform** that meets the technical requirements for 0G ecosystem funding. It provides:

- **Deterministic builds** (EPI)  
- **Cryptographic enforcement** (capability tokens, cosign)  
- **Causal consistency** (hash chain)  
- **Incident response** (3‑layer lockdown)  

All artifacts are available in the public repository at commit `b22b391`. The system is ready for audit and production deployment.