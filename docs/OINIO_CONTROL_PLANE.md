# OINIO Control Plane

This repository now supports a single control-plane config at:

- `~/.oinio/config.yaml`

## Setup

Run:

```bash
bash scripts/setup_oinio_control_plane.sh
```

This will:
- create `~/.oinio/config.yaml` from `oinio/config.yaml.example` (if missing)
- install controlled command wrappers into `~/.oinio/commands/`
- create `~/.oinio/logs/`
- apply secure permissions (`chmod 600` on config)

## Controlled Commands

- `~/.oinio/commands/deploy.sh`
- `~/.oinio/commands/check.sh`
- `~/.oinio/commands/logs.sh [logfile]`

Agents should invoke these wrappers instead of ad-hoc shell commands.

## Server Integration

`server/main.py` now reads key settings from control-plane config first-class via `server/control_plane_config.py`, with environment variable override priority:

1. Environment variables
2. `~/.oinio/config.yaml`
3. Code defaults

Current control-plane-backed fields:
- `supabase.url`, `supabase.key`
- `pi_network.mode`, `pi_network.app_id`, `pi_network.api_key`, `pi_network.api_endpoint`, `pi_network.sandbox_mode`, `pi_network.webhook_secret`, `pi_network.wallet_private_key`
