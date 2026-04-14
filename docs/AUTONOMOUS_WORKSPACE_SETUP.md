# Autonomous Workspace Setup

This workspace now has a simple control-plane pattern for agents:

- Real secrets live in `.env.local` or `.env`.
- Copy the shared template from `.env.agent.example`.
- Run `python3 scripts/env_doctor.py` before deploys or repo automation.

## Load Order

The repo treats these files as the local source of truth, in this order:

1. `.env.local`
2. `.env`

That lets you keep machine-specific or operator-specific secrets in `.env.local` while preserving broader workspace values in `.env`.

## Minimum Agent Keys

For autonomous GitHub and deployment work, set at least:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_TOKEN`
- `OPENAI_API_KEY`

Recommended if agents will verify or ship deploys:

- `RAILWAY_TOKEN`
- `VERCEL_TOKEN`
- `CLOUDFLARE_API_TOKEN`
- `CANONICAL_BACKEND_URL`
- `CANONICAL_SITE_URL`
- `HEALTHCHECK_URL`

## What `env_doctor` Checks

The doctor script now validates:

- missing required keys
- duplicate or malformed env entries
- placeholder values that were never replaced
- blocked legacy deployment hosts in tracked config files

The audit rules live in `config/autonomous-workspace.json`.

## Safe Workflow

1. Fill `.env.local` from `.env.agent.example`.
2. Keep provider secrets in platform secret stores too:
   GitHub Actions secrets, Railway variables, Vercel project env vars, and Cloudflare secrets.
3. Run `python3 scripts/env_doctor.py`.
4. Run your deployment or verification command.

## Important Boundary

This pattern makes secrets easier for local agents to use, but it does not replace platform-native secret management. Production deploy targets should still store their own secrets server-side.

