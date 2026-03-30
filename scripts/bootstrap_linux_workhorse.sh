#!/usr/bin/env bash
set -euo pipefail

print_header() {
  echo
  echo "== $1 =="
}

has_cmd() {
  command -v "$1" >/dev/null 2>&1
}

status_line() {
  local label="$1"
  local value="$2"
  printf "%-28s %s\n" "$label" "$value"
}

print_header "System"
status_line "Hostname" "$(hostname)"
status_line "OS" "$(grep -E '^PRETTY_NAME=' /etc/os-release | cut -d= -f2- | tr -d '"')"
status_line "Kernel" "$(uname -r)"

print_header "Required Tooling"
if has_cmd git; then
  status_line "git" "$(git --version)"
else
  status_line "git" "MISSING"
fi

if has_cmd python3; then
  status_line "python3" "$(python3 --version)"
else
  status_line "python3" "MISSING"
fi

if has_cmd node; then
  status_line "node" "$(node --version)"
else
  status_line "node" "MISSING"
fi

if has_cmd npm; then
  status_line "npm" "$(npm --version)"
else
  status_line "npm" "MISSING"
fi

if has_cmd gh; then
  status_line "gh" "$(gh --version | head -n 1)"
else
  status_line "gh" "MISSING"
fi

if has_cmd docker; then
  status_line "docker" "$(docker --version)"
else
  status_line "docker" "MISSING"
fi

if has_cmd docker-compose; then
  status_line "docker-compose" "$(docker-compose --version)"
elif has_cmd docker && docker compose version >/dev/null 2>&1; then
  status_line "docker compose" "$(docker compose version | head -n 1)"
else
  status_line "docker compose" "MISSING"
fi

print_header "Git Access"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  status_line "Repo root" "$(pwd)"
  status_line "Current branch" "$(git branch --show-current)"
  status_line "origin" "$(git remote get-url origin 2>/dev/null || echo 'NOT SET')"
  status_line "upstream" "$(git remote get-url upstream 2>/dev/null || echo 'NOT SET')"
else
  status_line "Repo root" "NOT A GIT REPO"
fi

print_header "SSH"
if [[ -f "${HOME}/.ssh/id_ed25519.pub" ]]; then
  status_line "id_ed25519.pub" "PRESENT"
else
  status_line "id_ed25519.pub" "MISSING"
fi

print_header "Control Plane"
if [[ -f "${HOME}/.oinio/config.yaml" ]]; then
  status_line "~/.oinio/config.yaml" "PRESENT"
else
  status_line "~/.oinio/config.yaml" "MISSING"
fi

if [[ -x "${HOME}/.oinio/commands/deploy.sh" ]]; then
  status_line "~/.oinio/commands/*" "PRESENT"
else
  status_line "~/.oinio/commands/*" "MISSING"
fi

print_header "Next Commands"
echo "1) Initialize control plane:"
echo "   bash scripts/setup_oinio_control_plane.sh"
echo
echo "2) Install missing system tools (if needed):"
echo "   sudo apt update"
echo "   sudo apt install -y gh docker.io docker-compose-plugin"
echo "   sudo usermod -aG docker \"$USER\""
echo
echo "3) Authenticate GitHub CLI:"
echo "   gh auth login"
echo
echo "4) Verify Docker access:"
echo "   docker run --rm hello-world"
