#!/usr/bin/env bash
set -euo pipefail
umask 077

if [ "$#" -lt 3 ] || [ "$2" != "--" ]; then
  echo "Usage: $0 <x_public|email|contact_form> -- <command> [args...]" >&2
  exit 64
fi

channel="$1"
shift 2

if ! command -v pass >/dev/null 2>&1; then
  echo "The approved local credential store (pass) is not available." >&2
  exit 69
fi

load_secret() {
  local environment_name="$1"
  local entry="qpf/revenue-delivery/$environment_name"
  local value

  value="$(pass show "$entry" | sed -n '1p')"
  if [ -z "$value" ]; then
    echo "Credential entry is empty: $entry" >&2
    exit 78
  fi

  export "$environment_name=$value"
  unset value
}

case "$channel" in
  x_public)
    load_secret TWITTER_API_KEY
    load_secret TWITTER_API_SECRET
    load_secret TWITTER_ACCESS_TOKEN
    load_secret TWITTER_ACCESS_SECRET
    ;;
  email)
    load_secret EMAIL_API_KEY
    ;;
  contact_form)
    load_secret CONTACT_FORM_API_KEY
    ;;
  *)
    echo "Unsupported delivery channel: $channel" >&2
    exit 64
    ;;
esac

exec "$@"
