# `gh secret set` helper v1

**Purpose:** Push rotated secrets into GitHub Actions without pasting values into chat or git.  
**Local only:** helper lives under `~/.qpf-secrets/` (not in the repo).

## Files

| Path | Role |
|------|------|
| `~/.qpf-secrets/rotation.env.template` | Blank template |
| `~/.qpf-secrets/rotation.env` | **Your values** (mode 600) — never commit |
| `~/.qpf-secrets/set-gh-secrets.sh` | Reads env file → `gh secret set` per repo |

## Steps

### 1. Fill values (after provider rotation)

```bash
nano ~/.qpf-secrets/rotation.env
# or: code ~/.qpf-secrets/rotation.env
```

Replace every `CHANGE_ME` you actually use. Leave `CHANGE_ME` to skip.

### 2. Run the helper

```bash
~/.qpf-secrets/set-gh-secrets.sh
```

Default target repos (core 4):

- `onenoly1010/Quantum-pi-forge`
- `onenoly1010/quantum-pi-forge-fixed`
- `onenoly1010/pi-forge-quantum-genesis`
- `onenoly1010/oinio-soul-system`

Hub-only names (`CLOUDFLARE_*`, `DISCORD_WEBHOOK_URL`) go only to **Quantum-pi-forge**.

### 3. Verify names only

```bash
gh secret list -R onenoly1010/Quantum-pi-forge
gh secret list -R onenoly1010/quantum-pi-forge-fixed
```

### 4. Optional: one secret, one repo

```bash
# Interactive (if you have a real TTY in a terminal):
gh secret set OPENAI_API_KEY -R onenoly1010/Quantum-pi-forge
# then paste value, Enter, Ctrl-D if needed

# Or from a value you type once (not saved in shell history if you use a subshell carefully):
read -rs VAL; printf '%s' "$VAL" | gh secret set OPENAI_API_KEY -R onenoly1010/quantum-pi-forge-fixed; unset VAL
```

### 5. After all set

1. Re-run a green Actions workflow.  
2. Close secret-scanning alerts as **Revoked**.  
3. Unlock Slot A/B/C outreach.

## Safety

- Do **not** paste keys into chat, issues, or PR descriptions.  
- Do **not** put `rotation.env` under any git worktree.  
- After success, optionally wipe values: `shred -u ~/.qpf-secrets/rotation.env` (keep template).

## Agent note

This environment often has **no TTY**. Prefer filling `rotation.env` then running `set-gh-secrets.sh` (agent can run the script **after** you confirm the file is filled — it will not print values).
