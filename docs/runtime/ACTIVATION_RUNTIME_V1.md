# Activation Runtime v1

**Status:** SEALED_SAFE_AUTONOMY_RUNTIME
**Baseline:** 4a9faf4 (Live Activation Gate v1)
**Mode:** AUTONOMOUS_LOCAL_ORCHESTRATION
**Live Execution:** NOT AUTHORIZED
**Wallet Access:** NOT AUTHORIZED
**Private Key Access:** NOT AUTHORIZED

## Purpose

Activation Runtime v1 provides the first autonomous runtime layer after Live Activation Gate v1.

It may run continuous local orchestration, seal runtime receipts, perform read-only health checks, inspect local evidence state, and halt on boundary violations.

## Authorized

- Continuous local runtime loop.
- Local health checks.
- Local receipt sealing.
- Read-only checks.
- Evidence directory inspection.
- Runtime heartbeat receipts.
- Boundary violation halt.

## Blocked

- Private-key access.
- Wallet access.
- Transaction signing.
- Deployments.
- Liquidity movement.
- Treasury routing.
- Automated fee capture.
- Creator payout.
- Live revenue claim.
- External uploads.
- Autonomous irreversible mutation.

## Final Boundary

This runtime is autonomous for local orchestration only. It may observe, seal, and halt. It may not mutate live systems.

## Persistent Daemon v1

Activation Runtime v1 supports FOREVER mode, interval control, stop-file shutdown, and lock-file protection.

- QPF_ACTIVATION_RUNTIME_MODE=FOREVER
- QPF_ACTIVATION_RUNTIME_INTERVAL_MS=60000
- QPF_ACTIVATION_RUNTIME_STOP_FILE=runtime/.stop-activation-runtime-v1
- QPF_ACTIVATION_RUNTIME_LOCK_FILE=runtime/.activation-runtime-v1.lock

The daemon remains local-only and preserves the same no-wallet, no-private-key, no-signing, no-deployment, no-liquidity, no-treasury, and no-revenue boundaries.
