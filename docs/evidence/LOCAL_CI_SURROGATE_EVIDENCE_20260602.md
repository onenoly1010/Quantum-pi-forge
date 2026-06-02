# Genesis Evidence v0 — Local CI Surrogate Baseline

## Verification Continuity Principle

GitHub Actions may be used as an external convenience layer, but it is not the canonical source of execution truth.

The canonical source of execution truth is the committed evidence chain: exact commit, exact command, environment snapshot, verification output, hashes, non-mutation statement, and reproduction path.

## Repository State

- Commit: `da1c8a3fb8bb93a8017d94676d3a769b90ff6550`
- Branch: `main`
- Worktree status before evidence generation: `?? scripts/evidence/
?? templates/`
- Evidence date UTC: `2026-06-02T05:20:15Z`

## Environment Snapshot

- Builder label: builder-node
- OS: Linux Mint 22.3
- Kernel: Linux 6.17.0-29-generic
- Node: v22.22.3
- npm: 10.9.8
- Python: Python 3.12.3
- Git: git version 2.43.0
- Commit: da1c8a3fb8bb93a8017d94676d3a769b90ff6550
- Branch: main
- Worktree status: ?? .tmp-evidence/
?? scripts/evidence/
?? templates/
- Lockfile hash: 2654078d6967d9835e0d067b8ab39732bfd48a063c6e2807ce544c05d7debcf6
- Local CI surrogate hash: d42ef7a85090030aeb22d80b77de7294140581d9252e95fe7461b554036af82f
- Secrets required: no
- Wallet credentials required: no
- Deployment credentials required: no

## Commands Executed

```bash
bash scripts/local-ci-surrogate.sh
```

## Verification Results

- Local CI surrogate: `PASSED`
- Runtime activation: not introduced
- Wallet signing: not introduced
- Deployment mutation: not introduced
- Autonomous execution: not introduced

## Output Hashes

```text
local-ci-output.sha256: 696e6111208abd660d96536d9052ade57f6ca147b03f2f783ffe0c94880ff1ef
lockfile.sha256: 2654078d6967d9835e0d067b8ab39732bfd48a063c6e2807ce544c05d7debcf6
local-ci-surrogate.sha256: d42ef7a85090030aeb22d80b77de7294140581d9252e95fe7461b554036af82f
```

## Local CI Output

```text
=== Quantum Pi Forge local CI surrogate ===
This script replaces GitHub Actions checks while Actions are unavailable.

=== git baseline ===
?? .tmp-evidence/
?? scripts/evidence/
?? templates/
main
da1c8a3

=== Node environment ===
node path: [HOME]/.nvm/versions/node/v22.22.3/bin/node
npm path:  [HOME]/.nvm/versions/node/v22.22.3/bin/npm
v22.22.3
10.9.8

=== dependency install ===
npm warn deprecated prebuild-install@7.1.3: No longer maintained. Please contact the author of the relevant native addon; alternatives are available.

added 698 packages, and audited 699 packages in 1m

154 packages are looking for funding
  run `npm fund` for details

4 high severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

=== available npm scripts ===
{
  "build": "node scripts/build.js",
  "build:cf": "node scripts/build.js",
  "serve:deploy": "python3 -m http.server 8100 --directory out",
  "deploy:cf": "bash scripts/deploy-cloudflare-pages.sh"
}

=== lint / test / build ===

> build
> node scripts/build.js

Building static assets for Cloudflare Pages

OK created out/_redirects

Copying static files
OK copied deploy/_headers -> out/_headers
OK copied deploy/index.html -> out/index.html
OK copied deploy/dao.html -> out/dao.html
OK copied deploy/resonate.html -> out/resonate.html
OK copied deploy/manifest.json -> out/manifest.json
OK copied ceremonial_interface.html -> out/ceremonial_interface.html
OK copied spectral_command_shell.html -> out/spectral_command_shell.html
OK copied pi-forge-integration.js -> out/pi-forge-integration.js

Copying static directories
OK copied frontend/ -> out/frontend/
OK copied deploy/trust/ -> out/trust/
OK pruned dev artifact out/frontend/README.md
OK pruned dev artifact out/frontend/example.html
OK generated version manifest for da1c8a3

Build completed: [PROJECT_ROOT]/out

OK copied run-guardian.sh -> out/run-guardian.sh
OK copied api/ -> out/api

=== static deploy artifact check ===
deploy/index.html present

=== canon script availability ===
FOUND .github/scripts/validate-canon-state.py
FOUND .github/scripts/verify-canon-integrity.py
FOUND .github/scripts/check-conflicts.py

=== canon validation ===
canon/closure_claim.json not present; skipping canon state validation

=== canon integrity ===
::group::Canon Integrity Verification
Loading artifacts from [PROJECT_ROOT]/canon...
Found 5 artifacts

Running integrity checks...
  • Checking for broken parent references...
  • Checking for orphaned artifacts...
  • Checking for circular dependencies...
  • Checking for missing required fields...
  • Checking for duplicate IDs...
  • Checking type validity...

============================================================
Canon Integrity Verification Results:
  Total Artifacts: 5
  Total Issues: 3
  Errors: 0
  Warnings: 3
============================================================

⚠️  Warnings found:
  • orphaned_artifact: Non-foundational artifact VDP-0002 has no parent
  • orphaned_artifact: Non-foundational artifact CLOSURE-001 has no parent
  • orphaned_artifact: Non-foundational artifact TEST-001 has no parent

✅ Canon integrity verified successfully!

Results saved to: /tmp/quantum-pi-forge-canon-integrity.json
::endgroup::

=== canon conflict check ===
NEW_CANON_ARTIFACT not set or file missing; skipping canon conflict check

=== final git state ===
?? .tmp-evidence/
?? scripts/evidence/
?? templates/

✅ local CI surrogate completed
```

## Reproducibility Recipe

1. Checkout commit: `da1c8a3fb8bb93a8017d94676d3a769b90ff6550`
2. Use the runtime versions listed in the environment snapshot.
3. Run: `bash scripts/local-ci-surrogate.sh`
4. Redact output using: `bash scripts/evidence/redact-evidence-output.sh`
5. Compare the resulting output hash against: `696e6111208abd660d96536d9052ade57f6ca147b03f2f783ffe0c94880ff1ef`

## Non-Mutation Statement

This verification pass introduced no autonomous execution, no wallet signing, no deployment expansion, no production mutation, and no runtime activation.

## Scope Note

Genesis Evidence v0 establishes the evidence infrastructure and sealed verification baseline. It is intentionally evidentiary and does not introduce runtime behavior.

## Evidence Artifact Hash

```text
evidence-artifact.sha256: 0c3add92e39fa41e62552b024eb951cd276063c3f6a8593c7c0773b86d92d6c4
```
