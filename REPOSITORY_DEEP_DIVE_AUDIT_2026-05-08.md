# Repository Deep Dive Audit - 2026-05-08

## Scope

This pass reviewed the parent `Quantum-pi-forge` repository, its public landing bundle, deployment tooling, grant tracking documents, guardian runtime scripts, and nested repository status.

## Updated

- Cloudflare Pages deployment path now treats `deploy/` as the landing source and `out/` as the generated output.
- `package.json` now exposes `build`, `build:cf`, `serve:deploy`, and `deploy:cf` scripts.
- `scripts/build.js` is compatible with the repo's ESM configuration and copies the landing bundle plus linked static pages.
- `deploy/index.html` has working CTA targets, wallet connection flow, and no placeholder `href="#"` links.
- `deploy/dao.html` and `deploy/resonate.html` are included in the deploy bundle so landing-page cards do not route to missing files.
- `GUILD_SUBMISSION_CHECKLIST.md` no longer contains the malformed Hall URL splice and now records the known tracking references.
- Guardian tooling defaults to the low-memory survival model and avoids unnecessary heavyweight model loading.
- Placeholder static files now contain usable fallback/redirect content.
- `.gitmodules` now includes mappings for the nested `quantum-pi-forge-ignited/quantum-pi-forge-ignited` and `server/pi-forge-quantum-genesis` repositories.

## Verification Performed

- HTML parse check for `index.html`, `deploy/index.html`, `deploy/dao.html`, `deploy/resonate.html`, `ceremonial_interface.html`, and `resonance_dashboard.html`.
- Local static HTTP check for the deploy bundle:
  - `/`
  - `/dao.html`
  - `/resonate.html`
- `package.json` JSON parse check.
- `python3 -m py_compile offline-dev-guardian/guardian_v2.1.py`.
- `bash -n run-guardian.sh`.
- `git diff --cached --check`.
- `git submodule status --recursive` no longer fails due to missing `.gitmodules` mappings.

## Not Completed

- Node-based build execution was not run because `node`, `npm`, and `wrangler` are not installed in the current environment.
- Browser wallet testing was not run because no browser automation runtime is installed.
- Nested repositories still have their own dirty worktrees and should be reviewed or committed from inside those repos before parent submodule pointers are advanced.
- Untracked parent files remain for separate review:
  - `contracts/src/ResonanceAnchor.sol`
  - `resonate.html`
  - `resonate.js`

## Recommended Next Steps

1. Install or restore Node/Wrangler locally.
2. Run `npm run build`.
3. Run `npm run serve:deploy` and verify the landing manually in a browser wallet.
4. Run `npm run deploy:cf` after wallet/CTA verification.
5. Review nested repo dirty states separately:
   - `quantum-pi-forge-ignited/quantum-pi-forge-ignited`
   - `server/pi-forge-quantum-genesis`
