#!/usr/bin/env bash
# QPF-IVB-1 fixture generator / scaffolder.
# This program is not a verifier. It must not sign, hash a package,
# emit private keys, or write expected traces/verdicts.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FIX="${ROOT}/fixtures"
CMD="${1:-scaffold}"

usage() {
  cat <<'EOF'
Usage: scripts/generate-ivb-fixtures.sh [scaffold|status|help]

scaffold  Create reserved harness directories and placeholders (default).
status    Report which slots are still unpopulated.
help      Print this message.

This generator refuses signatures, private-key material, package hashes,
and expected traces/verdicts. Those wait on an audited VEC-001
construction plan. See fixtures/GENERATION_CONTRACT_V1.md.
EOF
}

die_forbidden() {
  echo "error: generate-ivb-fixtures must not produce: $1" >&2
  echo "Deferred until the VEC-001 construction plan is audited." >&2
  echo "See fixtures/GENERATION_CONTRACT_V1.md." >&2
  exit 2
}

for arg in "$@"; do
  case "${arg}" in
    --sign|--signature|--signatures|--keys|--key|--private-key|--private-keys)
      die_forbidden "${arg}"
      ;;
    --package-hash|--hash|--digest|--populate|--crypto|--expected|--verdict|--verdicts|--trace|--traces)
      die_forbidden "${arg}"
      ;;
  esac
done

vector_ids() {
  local i
  for i in $(seq 1 25); do
    printf 'VEC-%03d\n' "${i}"
  done
}

write_if_missing() {
  local path="$1"
  shift
  if [[ -e "${path}" ]]; then
    return 0
  fi
  mkdir -p "$(dirname "${path}")"
  cat >"${path}" "$@"
}

scaffold() {
  mkdir -p "${FIX}/registry" "${FIX}/package" "${FIX}/vectors"

  write_if_missing "${FIX}/registry/root_keys.json" <<'EOF'
{
  "status": "unpopulated",
  "package": "QPF-IVB-1",
  "keys": [],
  "note": "Reserved registry slot. Not a Section 06 trust root. No key material in this commit. Population is deferred until the VEC-001 construction plan is audited. Private keys MUST NOT be stored here (Section 05)."
}
EOF

  write_if_missing "${FIX}/package/.gitkeep" <<'EOF'
EOF

  local id
  for id in $(vector_ids); do
    mkdir -p "${FIX}/vectors/${id}/input" "${FIX}/vectors/${id}/meta" "${FIX}/vectors/${id}/expected"
    write_if_missing "${FIX}/vectors/${id}/input/.gitkeep" <<'EOF'
EOF
    write_if_missing "${FIX}/vectors/${id}/expected/.gitkeep" <<'EOF'
EOF
    if [[ ! -e "${FIX}/vectors/${id}/meta/vector.json" ]]; then
      if [[ "${id}" == "VEC-001" ]]; then
        cat >"${FIX}/vectors/${id}/meta/vector.json" <<'EOF'
{
  "id": "VEC-001",
  "status": "scaffold",
  "input_populated": false,
  "expected_populated": false,
  "note": "Reserved first construction target. Cryptographic contents, signatures, and expected traces are deferred until the VEC-001 construction plan is audited."
}
EOF
      else
        cat >"${FIX}/vectors/${id}/meta/vector.json" <<EOF
{
  "id": "${id}",
  "status": "scaffold",
  "input_populated": false,
  "expected_populated": false
}
EOF
      fi
    fi
  done

  echo "QPF-IVB-1 scaffold complete under ${FIX}"
  echo "No signatures, keys, package hash, or expected verdicts were written."
}

count_non_gitkeep() {
  local dir="$1"
  find "${dir}" -mindepth 1 -maxdepth 1 ! -name '.gitkeep' | wc -l
}

status() {
  if [[ ! -d "${FIX}" ]]; then
    echo "fixtures/ missing"
    exit 1
  fi

  echo "package: QPF-IVB-1"
  echo "contract: fixtures/GENERATION_CONTRACT_V1.md"
  echo "generator: scripts/generate-ivb-fixtures.sh (not a verifier)"
  echo

  if [[ -f "${FIX}/registry/root_keys.json" ]]; then
    echo "registry/root_keys.json: present (must remain unpopulated in this phase)"
  else
    echo "registry/root_keys.json: MISSING"
  fi

  local pkg_extra
  pkg_extra="$(count_non_gitkeep "${FIX}/package")"
  echo "package/ extra files (not .gitkeep): ${pkg_extra}"

  local id extra_in extra_ex
  for id in $(vector_ids); do
    extra_in="$(count_non_gitkeep "${FIX}/vectors/${id}/input")"
    extra_ex="$(count_non_gitkeep "${FIX}/vectors/${id}/expected")"
    printf '%s input_files=%s expected_files=%s\n' "${id}" "${extra_in}" "${extra_ex}"
  done
}

case "${CMD}" in
  scaffold) scaffold ;;
  status) status ;;
  help|-h|--help) usage ;;
  *)
    echo "error: unknown command: ${CMD}" >&2
    usage >&2
    exit 2
    ;;
esac
