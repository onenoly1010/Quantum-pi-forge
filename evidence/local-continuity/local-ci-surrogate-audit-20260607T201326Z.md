# Local CI Surrogate Audit

- Generated: 20260607T201326Z
- Branch: local/local-ci-surrogate-audit-v1
- Base HEAD: 0670e48
- Purpose: preserve local verification continuity while hosted GitHub Actions are blocked by account billing state.

## Authority Boundary

Read-only local diagnostics only.

No wallet signing, deployment, posting, governance execution, custody transfer, token minting, staking, or chain mutation.

## Local Commands

```bash
npm ci
npm run build
npm run evidence:receipt:check
npm run verify:evidence-index
```

## Results


### npm ci
```text

added 246 packages, and audited 247 packages in 40s

47 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### npm run build
```text

> build
> node scripts/build.js

Building static assets for Cloudflare Pages

OK created out/_redirects

Copying static files
OK copied deploy/_headers -> out/_headers
OK copied deploy/index.html -> out/index.html
OK copied deploy/dao.html -> out/dao.html
OK copied deploy/resonate.html -> out/resonate.html
OK copied deploy/staking.html -> out/staking.html
OK copied deploy/manifest.json -> out/manifest.json
OK copied ceremonial_interface.html -> out/ceremonial_interface.html
OK copied spectral_command_shell.html -> out/spectral_command_shell.html
OK copied pi-forge-integration.js -> out/pi-forge-integration.js

Copying static directories
OK copied frontend/ -> out/frontend/
OK copied deploy/trust/ -> out/trust/
OK pruned dev artifact out/frontend/README.md
OK pruned dev artifact out/frontend/example.html
OK generated version manifest for 0670e48

Build completed: /home/kris/forge/Quantum-pi-forge/out

OK copied run-guardian.sh -> out/run-guardian.sh
OK copied api/ -> out/api
```

### npm run evidence:receipt:check
```text

> evidence:receipt:check
> node scripts/check-evidence-receipt.cjs

OK evidence receipt matches evidence index hash.
indexSha256=a63dc16e5f577c808fd495e5a18e87f25006980cf0d84d23b61f5beca57e58fa
```

### npm run verify:evidence-index
```text

> verify:evidence-index
> node scripts/verify-evidence-index.cjs

OK evidence index verified: 3 lanes, 6 paths checked.
```

## GitHub Hosted CI Context

PR #147 is currently blocked because GitHub-hosted jobs do not start under the account billing lock.

Known annotation:

```text
The job was not started because your account is locked due to a billing issue.
```

This local audit does not replace branch protection. It records local continuity evidence while hosted CI is unavailable.

