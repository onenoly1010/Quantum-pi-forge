# Deployment Recovery Checkpoint — 2026-05-28

## Confirmed

- GitHub PR #70 merged: reduced automatic Actions billing risk.
- Cloudflare Pages project `quantumpiforge` fixed.
- Build command: `npm run build`
- Output directory: `out`
- `wrangler_config_hash` cleared.
- Workers Builds deploy command disabled.
- Manual Cloudflare Pages deploy succeeded with Node v22 and Wrangler.
- Public domains return HTTP 200:
  - `https://quantumpiforge.pages.dev`
  - `https://quantumpiforge.com`
  - `https://www.quantumpiforge.com`
- `run-guardian.sh` resolves as a shell script on both Pages and custom domain.
- Continue/Ollama model mismatch patched to `qwen2.5-coder:latest`.
- Ollama idle after cleanup.
- `forge-guardian.service` stopped and disabled after repeated `INVALIDARGUMENT` restart loop.

## Do not re-enable yet

- `forge-guardian.service`
- GitHub Actions reruns while billing/account lock is unresolved
- Vercel paid deployment path

## Active manual Cloudflare deploy command

Run:

    cd ~/forge/Quantum-pi-forge
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm use 22
    npm run build
    npx wrangler pages deploy out --project-name=quantumpiforge

## Last known good deployment

- Project: `quantumpiforge`
- Commit in generated manifest: `4488bed`
- Verification date: 2026-05-28
