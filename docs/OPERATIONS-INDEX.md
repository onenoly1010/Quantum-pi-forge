# Repository Operations Index

This index provides a consolidated architectural and operational map of the current hardened perimeter. It serves as a single source of truth for external reviewers, support engineers, and grant evaluators to understand system state, safety boundaries, and deployment safeguards without inspecting raw commit history.

## 1. Core Operational Dimensions

### Official Channels & Local Truth

- **`OFFICIAL_CHANNELS.md`**
- **Purpose:** Defines the verified public communication surfaces for Quantum Pi Forge.
- **Operator Guidance:** Defines what is official and eliminates ambiguity regarding out-of-band communication, impersonation attempts, or unofficial network states.

### Upstream Friction & Diagnostics

- **`docs/ROUTER-STATE-FRICTION.md`**
- **Purpose:** Documents known router/proxy state friction and isolates external or upstream anomalies without modifying wallet, runtime, deployment, or contract behavior.
- **Operator Guidance:** Defines what is external or upstream friction and sets baseline expectations for router behavior.

- **`GITHUB_ACTIONS_PRE_STEP_FAILURE_EVIDENCE_PR94_20260601.md`**
- **Purpose:** Retains empirical forensic evidence of account-level or runner-level pre-step execution failures observed on 2026-06-01.
- **Operator Guidance:** Treats failing hosted checks as an external execution environment condition unless local diagnostics prove otherwise.

- **`scripts/ci-preflight-diagnose.sh`**
- **Purpose:** Provides a non-mutating local diagnostic script used to verify environment integrity and surface runner-preflight issues before trusting hosted workflow results.
- **Operator Guidance:** Defines what is local truth. Run this script to evaluate environment stability without altering system state.

### Liquidity Guarding & Security Progression

- **Read-Only Liquidity Guardian Proof**
- **Purpose:** Demonstrates the safety boundary governing read-only liquidity observation.
- **Operator Guidance:** Defines what is explicitly non-mutating. Verification must not become execution.

- **Guardian Protocol Evolution: v1 / v1.1 / v1.2**
- **Purpose:** Chronicles the progression from local observer loop, to remote fetch and production frontend hardening, to Node 22 CI preflight diagnostics.
- **Operator Guidance:** Preserves the staged security narrative: observe, verify, document, and stop before mutation.

## 2. Operator Guardrails

> **Critical Operator Directives**
>
> To preserve the integrity of the sealed runtime perimeter, operators and automated workflows must strictly adhere to the following constraints:
>
> 1. **No Autonomous Remediation:** Do not activate, script, or deploy autonomous self-healing loops or remediation logic. All interventions remain manual and analytical.
> 2. **No Wallet Modifications:** Wallet behavior, signing mechanics, and key-management paths are frozen unless a separately reviewed security process explicitly authorizes changes.
> 3. **No Hidden Fallbacks:** Do not introduce hidden router fallback logic or silent routing bypass paths.
> 4. **Workflow Freeze:** Do not modify GitHub Actions workflow configuration until the underlying infrastructure or account-level pre-step issue is formally resolved.
> 5. **No Production Mutation:** Do not treat documentation, diagnostics, or external friction as permission to alter contracts, deployments, wallet state, or runtime behavior.

## 3. Hardening Run Reference

The current perimeter state is anchored by the six-commit hardening sequence:

```text
dc90278 → 7d4df0f → ddc246a → c236da8 → 10355ad → ea231d9
```

- **Status:** Sealed.
- **Runtime Behavior:** Unchanged.
- **Wallet Behavior:** Unchanged.
- **Deployment Behavior:** Unchanged.
- **CI State:** Read-only local verification prioritized until hosted runner/account state is resolved.
- **Documentation State:** Security, router friction, official channels, and local diagnostics are now discoverable from this index.

## 4. Review Posture

This index is documentation-only. It does not alter runtime logic, contract state, wallet behavior, deployment behavior, CI configuration, or autonomous execution paths.
