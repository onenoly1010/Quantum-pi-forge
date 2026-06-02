# Local CI Surrogate Evidence

## Verification Continuity Principle

GitHub Actions may be used as an external convenience layer, but it is not the canonical source of execution truth.

The canonical source of execution truth is the committed evidence chain: exact commit, exact command, environment snapshot, verification output, hashes, non-mutation statement, and reproduction path.

## Repository State

- Commit:
- Branch:
- Worktree status:
- Evidence date:

## Environment Snapshot

- Builder label:
- OS:
- Kernel:
- Node:
- npm:
- Python:
- Git:
- Lockfile hash:
- Local CI surrogate hash:

## Commands Executed

```bash
bash scripts/local-ci-surrogate.sh
```

## Verification Results

- Local CI surrogate:
- Runtime activation:
- Wallet signing:
- Deployment mutation:
- Autonomous execution:

## Output Hashes

```text
local-ci-output.sha256:
lockfile.sha256:
local-ci-surrogate.sha256:
evidence-artifact.sha256:
```

## Reproducibility Recipe

1. Checkout the commit listed above.
2. Use the runtime versions listed in the environment snapshot.
3. Run:

```bash
bash scripts/local-ci-surrogate.sh
```

4. Compare output hashes against this evidence file.

## Non-Mutation Statement

This verification pass introduced no autonomous execution, no wallet signing, no deployment expansion, no production mutation, and no runtime activation.
