# Quantum Pi Forge Deployment Checkpoint

Date: 2026-05-27

## Production

Cloudflare Pages project:
- quantumpiforge

Live domains:
- https://quantumpiforge.pages.dev
- https://quantumpiforge.com
- https://www.quantumpiforge.com

Current deployed commit:
- e0edc46 Reduce noisy legacy workflows on main pushes

## Deployment Path

Use local direct deploy until the GitHub hosted-runner issue is resolved.

Deploy command:

    cd ~/forge/Quantum-pi-forge
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm use 22
    npm ci
    DEPLOY_TARGET=cloudflare-pages npm run build
    npx wrangler pages deploy out --project-name quantumpiforge --branch main --commit-dirty=true

## Cloudflare Worker Status

- quantum-pi-forge Worker Git triggers disconnected
- quantum-pi-forge Worker is dormant and not used for production Pages
- oinio-forge-event-hub Worker remains active

## Guardian

Run locally from the repo version:

    cd ~/forge/Quantum-pi-forge
    ./run-guardian.sh

Do not curl-download run-guardian.sh from the Pages URL.
