#!/usr/bin/env bash
set -Eeuo pipefail

BUNDLE_ID="${1:-local-$(date +%Y%m%d%H%M%S)}"
mkdir -p examples examples/bundles logs

if [[ ! -x scripts/forge-evidence-packet.sh ]]; then
  echo "ERROR: scripts/forge-evidence-packet.sh is missing or not executable" >&2
  exit 2
fi

declare -a PACKETS=()

run_claim() {
  local claim_id="$1"
  local target_file="$2"
  local pattern="$3"
  local description="$4"
  if [[ ! -f "$target_file" ]]; then
    echo "WARN: skipping missing file: $target_file" >&2
    return 0
  fi
  ./scripts/forge-evidence-packet.sh "$claim_id" "$target_file" "$pattern" "$description"
  local safe_id
  safe_id="$(printf "%s" "$claim_id" | tr -cs "A-Za-z0-9._-" "-")"
  PACKETS+=("examples/verification-packet-${safe_id}.json")
}

WALLET_MUTATION_PATTERN="(personal_sign|eth_sign|eth_sendTransaction|sendTransaction|wallet_requestPermissions|wallet_addEthereumChain)"

run_claim "no-wallet-signing-ceremonial" "ceremonial_interface.html" "$WALLET_MUTATION_PATTERN" "No direct wallet signing or transaction-send calls in ceremonial interface"
run_claim "no-wallet-signing-deploy-index" "deploy/index.html" "$WALLET_MUTATION_PATTERN" "No direct wallet signing or transaction-send calls in deployed index"
run_claim "reviewer-onboarding-boundary" "docs/REVIEWER_ONBOARDING.md" "$WALLET_MUTATION_PATTERN" "Reviewer onboarding does not instruct direct wallet signing or transaction-send calls"

python3 -c 'import json,sys,hashlib; from pathlib import Path; bundle_id=sys.argv[1]; paths=[Path(p) for p in sys.argv[2:]]; packets=[json.loads(p.read_text()) for p in paths if p.exists()]; out=Path("examples/bundles")/(bundle_id+".json"); out.write_text(json.dumps(packets,indent=2)+"\n"); sha=Path(str(out)+".sha256"); sha.write_text(hashlib.sha256(out.read_bytes()).hexdigest()+"  "+out.name+"\n"); print("Generated bundle:",out); print("Generated digest:",sha); print("Claims bundled:",len(packets)); failed=[p for p in packets if p.get("status")=="fail"]; [print("- "+p.get("request_id","")+" "+p.get("summary","")) for p in failed]; sys.exit(1 if failed else 0)' "$BUNDLE_ID" "${PACKETS[@]}"
