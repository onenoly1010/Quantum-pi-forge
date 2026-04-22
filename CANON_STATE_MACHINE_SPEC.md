# CANON STATE MACHINE: Epistemic Humility Enforcement Substrate
## Formal Specification v1.0

---

## CORE PHILOSOPHICAL INVARIANT
> **No execution may directly produce a claim.**
>
> All claims are explicitly second-order observations about execution, not intrinsic properties of the execution itself.
>
> Execution ⊢ Observation ⊢ Claim

---

## 1. STATE DIAGRAM (MERMAID)

```mermaid
stateDiagram-v2
    direction TB

    note left of [*]: INITIAL
    [*] --> UNINITIATED

    %% EXECUTION LAYER
    UNINITIATED --> EXECUTION_PENDING
    EXECUTION_PENDING --> EXECUTION_RUNNING
    EXECUTION_RUNNING --> EXECUTION_ABORTED
    EXECUTION_RUNNING --> EXECUTION_TIMED_OUT
    EXECUTION_RUNNING --> EXECUTION_COMPLETED
    EXECUTION_RUNNING --> EXECUTION_FAILED

    %% OBSERVATION LAYER
    EXECUTION_COMPLETED --> OBSERVATION_PENDING
    OBSERVATION_PENDING --> OBSERVATION_RUNNING
    OBSERVATION_RUNNING --> OBSERVATION_FAILED
    OBSERVATION_RUNNING --> OBSERVATION_PARTIAL
    OBSERVATION_RUNNING --> OBSERVATION_VERIFIED

    %% CLAIM LAYER
    OBSERVATION_VERIFIED --> CLAIM_PENDING
    OBSERVATION_PARTIAL --> CLAIM_PENDING
    OBSERVATION_FAILED --> CLAIM_PENDING
    EXECUTION_ABORTED --> CLAIM_PENDING
    EXECUTION_TIMED_OUT --> CLAIM_PENDING
    EXECUTION_FAILED --> CLAIM_PENDING

    CLAIM_PENDING --> CLAIM_GENERATED
    CLAIM_GENERATED --> [*]

    note right of CLAIM_GENERATED: FINAL. Never "success". Always only a claim.
```

---

## 2. DEFINED STATES

### EXECUTION STATES (Layer 0: Uninterpreted Runtime)
| State | Description | Terminal |
|---|---|---|
| `EXECUTION_PENDING` | Scheduled, not yet started | ❌ |
| `EXECUTION_RUNNING` | Active execution in progress | ❌ |
| `EXECUTION_COMPLETED` | Process exited with code 0 | ✅ |
| `EXECUTION_FAILED` | Process exited with non-zero code | ✅ |
| `EXECUTION_ABORTED` | Manually cancelled by operator | ✅ |
| `EXECUTION_TIMED_OUT` | Terminated by runtime timeout | ✅ |

### OBSERVATION STATES (Layer 1: Neutral Measurement)
| State | Description | Terminal |
|---|---|---|
| `OBSERVATION_PENDING` | Gate 6 verifier not yet run | ❌ |
| `OBSERVATION_RUNNING` | Verifier actively inspecting artifacts | ❌ |
| `OBSERVATION_VERIFIED` | All invariants satisfied, full integrity | ✅ |
| `OBSERVATION_PARTIAL` | Some invariants passed, some failed | ✅ |
| `OBSERVATION_FAILED` | Verifier itself did not complete | ✅ |

### CLAIM STATES (Layer 2: Explicit Assertion)
| State | Description | Terminal |
|---|---|---|
| `CLAIM_PENDING` | Claim generator not yet run | ❌ |
| `CLAIM_GENERATED` | Canonical claim object written | ✅ |

---

## 3. TRANSITION INVARIANTS (ENFORCED RULES)
### Hard Constraints (May Not Be Violated Under Any Circumstance)
1. ❌ **You cannot jump directly from any EXECUTION state to CLAIM state**
2. ❌ `CLAIM_GENERATED` may never be reached without passing through an OBSERVATION state
3. ❌ There is no `SUCCESS` state. There are only claims.
4. ❌ Execution exit code 0 does not imply correctness. It only implies completion.
5. ✅ All terminal execution states **must** proceed through observation before claim generation
6. ✅ Observation may only read execution outputs. Observation may never modify execution artifacts.
7. ✅ Claim may only read observation outputs. Claim may never modify observation results.

### State Transition Truth Table
| From State | May Transition To | May NOT Transition To |
|---|---|---|
| Any EXECUTION | Any OBSERVATION | Any CLAIM |
| Any OBSERVATION | CLAIM_PENDING | CLAIM_GENERATED directly |
| CLAIM_PENDING | CLAIM_GENERATED | All other states |

---

## 4. CANON STATE OBJECT SCHEMA
### Standardized JSON Output
```json
{
  "canon_version": "1.0.0",
  "canon_hash": "sha256:<directory-hash>",
  "execution": {
    "state": "EXECUTION_COMPLETED",
    "timestamp": "<iso-8601>",
    "job_id": "<github-run-id>",
    "exit_code": 0,
    "duration_ms": 12742
  },
  "observation": {
    "state": "OBSERVATION_VERIFIED",
    "timestamp": "<iso-8601>",
    "verifier_hash": "sha256:<verify-canon-integrity.py hash>",
    "invariants_checked": 17,
    "invariants_passed": 17,
    "invariants_failed": 0,
    "integrity": "full"
  },
  "claim": {
    "state": "CLAIM_GENERATED",
    "timestamp": "<iso-8601>",
    "authoritative": false,
    "verification_required": true,
    "claim_text": "This pipeline asserts that the canon closure is valid as of this execution. This is not a statement of truth. This is a claim."
  },
  "_meta": {
    "schema_version": "1.0.0",
    "generated_by": "canon-state-contract.yml",
    "external_attestation_hook": null
  }
}
```

---

## 5. FAILURE MODES & EXPLICIT HANDLING

### All Possible Failure Cases And Required Claim Output
| Failure Scenario | Execution State | Observation State | Claim Integrity Field |
|---|---|---|---|
| Normal success | `EXECUTION_COMPLETED` | `OBSERVATION_VERIFIED` | `full` |
| Execution completed, some invariants failed | `EXECUTION_COMPLETED` | `OBSERVATION_PARTIAL` | `partial` |
| Execution succeeded, verifier crashed | `EXECUTION_COMPLETED` | `OBSERVATION_FAILED` | `unobserved` |
| Execution failed | `EXECUTION_FAILED` | Skipped | `execution_failed` |
| Workflow cancelled | `EXECUTION_ABORTED` | Skipped | `aborted` |
| Timeout | `EXECUTION_TIMED_OUT` | Skipped | `timeout` |
| Human override / manual approval | Any | `OBSERVATION_MANUAL` | `human_attested` |

### Recovery Semantics
- ❌ **No automatic retries** across layer boundaries. Retries are permitted only within a single layer.
- ✅ If observation fails, you may re-run observation only. You may not re-run execution to fix observation failure.
- ✅ If claim generation fails, you may re-run claim generation only. You may not re-run observation or execution.
- ✅ Each re-run produces a new distinct claim object, with explicit reference to previous attempts.

---

## 6. VALIDATION RULES FOR GITHUB ACTIONS IMPLEMENTATION

### Enforced Workflow Structure
1. ✅ **Three separate jobs**, no cross-job step sharing
2. ✅ Job 1: Execution only. Writes artifacts. No outputs.
3. ✅ Job 2: Observation only. Reads artifacts. Never writes to execution outputs.
4. ✅ Job 3: Claim generation only. Reads observation report.
5. ✅ No `if: success()` conditions between jobs. All terminal execution states must proceed to observation.
6. ✅ All three jobs must always run, regardless of previous job status.

### Grep Enforcement Patterns
```bash
# FORBIDDEN PATTERNS (will fail validation)
- "if: success()"                      # Implicit collapse of execution → truth
- "echo ::set-output name=success"     # Asserting success directly
- "job completed successfully"         # Linguistic collapse
- "the build passed"                   # Linguistic collapse

# REQUIRED PATTERNS (must be present)
- "observation_state"                  # Explicit observation layer
- "claim_state"                        # Explicit claim layer
- "this is a claim, not a fact"        # Epistemic disclaimer
```

---

## 7. EXTERNAL VERIFICATION HOOK
### Extension Point For Cross-Boundary Attestation
The state object includes an optional `external_attestation_hook` field which may be populated by:
1. Separate repository validator running on `workflow_run` trigger
2. External oracle service
3. Cryptographic signature from trusted party
4. Blockchain anchoring transaction reference
5. Human review signature

This hook is intentionally unpopulated by default. The pipeline does not attempt to validate its own truth. It only produces a claim that others may validate.

---

## 8. FORMAL INVARIANTS FOR MODEL CHECKING
```
∀ run ∈ WorkflowRuns:
  (∃ e ∈ ExecutionStates) ∧ (∃ o ∈ ObservationStates) ∧ (∃ c ∈ ClaimStates)

∀ run ∈ WorkflowRuns:
  time(e) < time(o) < time(c)

∀ run ∈ WorkflowRuns:
  c.state = CLAIM_GENERATED → o.state ∈ TerminalObservationStates

∀ run ∈ WorkflowRuns:
  ¬ (e.exit_code = 0 → o.integrity = full)

∀ run ∈ WorkflowRuns:
  ¬ (o.integrity = full → claim_is_true)
```

---

> This specification does not attempt to eliminate uncertainty.
>
> It attempts to make the uncertainty explicit.