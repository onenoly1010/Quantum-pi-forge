# Linux Workhorse Onboarding

This runbook sets up this Linux Mint machine as the primary development and deployment node for `github.com/onenoly1010/*`.

## 1. Baseline Verification

From repo root:

```bash
bash scripts/bootstrap_linux_workhorse.sh
```

Fix anything marked `MISSING`.

Or run the full non-root onboarding sequence:

```bash
bash scripts/workhorse_ready.sh
```

## 2. Install Required System Tools

```bash
bash scripts/install_system_deps.sh
```

Log out and log back in so Docker group membership applies.

Verify:

```bash
docker run --rm hello-world
gh --version
```

## 3. GitHub Access and Repo Control

Authenticate:

```bash
gh auth login
gh auth status
```

Check repo remotes:

```bash
git remote -v
```

Recommended convention:
- `origin` = HTTPS
- `upstream` = SSH

## 4. OINIO Control Plane

Initialize once:

```bash
bash scripts/setup_oinio_control_plane.sh
```

Then edit:

- `~/.oinio/config.yaml`

Set strict permissions:

```bash
chmod 600 ~/.oinio/config.yaml
```

## 5. Agent Readiness Gate

Run this before allowing agents to deploy:

```bash
bash scripts/agent_preflight.sh
```

Only proceed when it prints `PASS`.

## 6. Deployment Path (Controlled)

Use wrappers only:

```bash
~/.oinio/commands/check.sh
~/.oinio/commands/deploy.sh
~/.oinio/commands/logs.sh deploy.log
```

## 7. Domain and Production Checklist (`quantumpiforge.com`)

Keep this as a hard gate before DNS or production changes:

1. Confirm backend health endpoint is green.
2. Confirm frontend/API base URLs match target env.
3. Confirm TLS cert coverage for root + `www`.
4. Confirm DNS records point to intended provider target.
5. Confirm rollback target is documented and reachable.

## 8. Recommended Operating Rules for Agents

1. Read config only from `~/.oinio/config.yaml`.
2. Do not hardcode secrets or endpoints.
3. Use controlled wrappers under `~/.oinio/commands/`.
4. Do preflight before deploy.
5. Record deployment output in `~/.oinio/logs/`.
