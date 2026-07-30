# Integrate / Verify QPF in 10 Minutes

**Audience:** builders who are not Kris  
**Goal:** independent verification — not mainnet risk  

## 0. Prerequisites

- `curl`  
- optional: `cast` (Foundry), Node 18+  
- RPC: `https://evmrpc.0g.ai`  
- Explorer: https://chainscan.0g.ai  

## 1. Confirm network (1 min)

```bash
curl -s -X POST https://evmrpc.0g.ai \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
# expect result "0x4115" (16661)
```

## 2. Confirm contracts exist (2 min)

```bash
TOKEN=0x75995EC0fdf881189850aeD864cB3f43c0DFCb58
REG=0x67aD7169184581f23D1E10B39d4eb4e98293E87a

for A in $TOKEN $REG; do
  curl -s -X POST https://evmrpc.0g.ai \
    -H 'content-type: application/json' \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_getCode\",\"params\":[\"$A\",\"latest\"]}"
  echo
done
# each result must be longer than "0x"
```

Full table + bytecode digests: [CONTRACT_REGISTRY_V1.md](./CONTRACT_REGISTRY_V1.md)

## 3. Confirm pair is empty (liquidity not activated) (1 min)

```bash
PAIR=0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE
# getReserves() selector 0x0902f1ac
curl -s -X POST https://evmrpc.0g.ai \
  -H 'content-type: application/json' \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_call\",\"params\":[{\"to\":\"$PAIR\",\"data\":\"0x0902f1ac\"},\"latest\"]}"
# zero reserves = technical readiness without liquidity event
```

## 4. Read public status (1 min)

- https://quantumpiforge.com/deployed-addresses  
- https://quantumpiforge.com/mint-status.html (or `/mint` redirect)  
- Expect: mint **disabled** on site; pair **empty pool**  

## 5. Read governance evidence (3 min)

Clone or browse:

```text
https://github.com/onenoly1010/Quantum-pi-forge
```

Key paths:

```text
docs/GENESIS_VERIFICATION_V1.md
docs/SECURITY_BOUNDARIES_V1.md
docs/evidence/PUBLIC_READINESS_REPORT_V1.md
receipts/governance/public-mint-policy-final-v1.json
receipts/governance/phase-33-public-mint-execution-no-go-v1.json
receipts/governance/guardian-authority-reconciliation-v1.json
receipts/execution/first-controlled-mint-verification-v1.json
```

Optional local checks (from repo root, no keys):

```bash
# Prefer a full clone (or: git fetch --unshallow) so snapshot ancestor checks pass.
# Shallow clones may fail verify:snapshot with “canonicalCommit is not an ancestor of HEAD”.
npm run verify:evidence
npm run security:wallet-preflight-gate:v1:check
# must report private_key_used=false, transaction_broadcast=false
```

Maintainer dry-run note (2026-07-30): [docs/evidence/BUILDER_REPRODUCTION_DRY_RUN_20260730.md](./evidence/BUILDER_REPRODUCTION_DRY_RUN_20260730.md)

## 6. Metadata (mint preview only) (1 min)

```bash
curl -sI https://quantumpiforge.com/metadata/qpf-public-mint-model-v1.json
# expect HTTP 200 application/json
```

## 7. What you should **not** do

- Do not send funds to “mint” addresses manually  
- Do not run `*:execute` npm scripts without explicit human GO + command hash  
- Do not assume liquidity or yield is live  
- Do not treat `wallet_signing_allowed=true` preflight unlock as “sign everything”  

## 8. First external participant paths (non-activation)

After verification, useful non-admin contributions:

- Open issues with verification results (bytecode mismatch, doc drift)  
- Run guardian / evidence checks in read-only mode  
- Improve docs/ABIs/examples  
- Resonance / identity surfaces: https://www.quantumpiforge.com/resonate  

## ABIs / events (pointer)

Authoritative ABIs live with contracts and build artifacts in-repo. For registry mint path (when authorized later):

- `approve(address,uint256)` on OINIO token  
- `registerModel(string,string,uint256)` on OINIOModelRegistry  
- Success signals: `ModelRegistered`, ERC721 mint to caller, stake transfer  

Until GO: treat as **documentation of future path only**.

---

*Builder Quickstart — independent verification without trust.*
