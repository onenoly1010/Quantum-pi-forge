# Truth Domain Separation Layer v1.0
## 0G Sovereign Agent System | Audit Safety Specification

---

## ⚖️ CORE PRINCIPLE
> No mixing of truth domains. Ever.

This document defines the immutable classification system for all claims made in grant artifacts.
Violation of this boundary is the single most common reason technical grant submissions get rejected before review.

---

# 🎯 DOMAIN CLASSIFICATION

All information in the project falls into exactly one of three mutually exclusive domains.

---

## 🔵 DOMAIN 1: VERIFIABLE FACT
**Definition**: Any claim that can be independently reproduced by a third party *without trusting this repository or any node operator*.

✅ **ALLOWED IN AUDIT ARTIFACTS**
| Allowed Data | Verification Method |
| :--- | :--- |
| Git commit hashes | `git show <hash>` |
| File paths and contents | Public repository inspection |
| Interface signatures | Static code analysis |
| Contract addresses | Blockchain explorer |
| Transaction hashes | Blockchain explorer |
| Public endpoints | HTTP request |

❌ **FORBIDDEN CLAIMS IN THIS DOMAIN**
- "works"
- "tested"
- "validated"
- "compliant"
- "secure"
- "active"
- percentage values of any kind

---

## 🟡 DOMAIN 2: SELF-REPORTED TELEMETRY
**Definition**: Observational data collected by running nodes. May be accurate, but cannot be independently verified.

⚠️ **MUST BE EXPLICITLY LABELED**
> ALL CLAIMS IN THIS SECTION ARE SELF-REPORTED AND NON-AUDITABLE

| Allowed Data |
| :--- |
| Node count |
| Uptime percentages |
| Latency measurements |
| Local test results |
| Runtime metrics |
| Commit counts |
| Internal validation status |

✅ **REQUIRED DISCLOSURE**: Every claim in this domain must include the standard disclaimer. No exceptions.

---

## 🟠 DOMAIN 3: DESIGN INTENT
**Definition**: Planned work, future milestones, unimplemented interfaces, architectural descriptions.

⚠️ **MUST BE EXPLICITLY LABELED**
> THIS IS DESIGN DOCUMENTATION. NOT PRODUCTION DEPLOYMENT STATUS.

| Allowed Data |
| :--- |
| Interface specifications |
| Architecture diagrams |
| Milestone plans |
| Failure mode analysis |
| Mitigation designs |
| Future integration targets |

---

# 🚦 CROSS-DOMAIN BOUNDARY RULES

1. **No domain may reference another without explicit labeling**
2. **Audit artifacts may only contain Domain 1 claims by default**
3. **Domain 2 and 3 must be in separate sections with clear headers**
4. **No percentage completion claims in Domain 1**
5. **No assertive language ("verified", "confirmed") outside Domain 1**
6. **You may never call something "validated" unless you provide the exact procedure a third party can run to reproduce that validation**

---

# ✅ ACCEPTABLE LANGUAGE BY DOMAIN

| ❌ Invalid Claim | ✅ Valid Equivalent | Domain |
| :--- | :--- | :--- |
| "100% interface compliance" | "Interface methods implemented in code at referenced commit" | 1 |
| "MVD criteria met" | "All MVD defined interfaces are present in repository" | 1 |
| "7/9 nodes active" | "7/9 nodes reported active in local monitoring environment" | 2 |
| "876 verified commits" | "876 commits present in main branch at time of writing" | 1 |
| "Validated" | "Observed functioning in local test environment" | 2 |
| "Confirmed" | "Implemented at commit hash referenced" | 1 |
| "99.7% uptime" | "Reported uptime 99.7% over last 72 hours (self-reported)" | 2 |
| "Secure" | "Security monitor module implemented" | 1 |

---

# 🔒 AUDIT SAFETY GUARANTEE

When these rules are followed:
- Reviewers cannot dismiss your submission for epistemic contamination
- Every claim can be independently verified or explicitly marked as self-reported
- There are no credibility gaps that require explanation during review
- The document will pass structural review on first submission

This is the standard used by all successful protocol grant teams.