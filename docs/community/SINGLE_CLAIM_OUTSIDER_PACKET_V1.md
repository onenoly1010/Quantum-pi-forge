# Single-Claim Outsider Packet v1

**Phase:** 8.5 Round 1 (rolling) · **Mode:** DOCS-ONLY INVITATION — not activation
**Status:** `READY_FOR_OUTSIDER` · **Created:** 2026-09-19
**Base:** `origin/main @ 97c5091` · **Branch:** `docs/phase85-single-claim-packet`
**Does NOT authorize:** mint, liquidity, staking, yield, signing, broadcast, spend, contract changes.

Acceptance flow:

```text
ONE CLAIM → ONE EVIDENCE PATH → INDEPENDENT OBSERVATION → VERBATIM RECEIPT → RECORD
```

## 1. The one claim

> DEX Pair `0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE` on 0G Aristotle (chain 16661) holds **0 / 0 reserves**.
> Therefore **liquidity is NOT AUTHORIZED** — empty pool is intentional restraint, not missing infrastructure.

Source of truth hierarchy: **chain > registry > page**. If they disagree, report drift.

| Layer | Value |
|---|---|
| Network | 0G Aristotle Mainnet · chain ID **16661** (`0x4115`) · RPC `https://evmrpc.0g.ai` · Explorer `https://chainscan.0g.ai` |
| DEX Pair | `0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE` ([explorer](https://chainscan.0g.ai/address/0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE)) · [registry](../CONTRACT_REGISTRY_V1.md) |
| Expected | `getReserves()` returns all-zero → liquidity `NOT AUTHORIZED` |
| Portal | https://quantumpiforge.com/deployed-addresses#verify-now |
| Status JSON | https://quantumpiforge.com/verification-status-v1.json (`8_5 n=0/m=3`, `liquidity: NOT_AUTHORIZED`) |

## 2. The one evidence path (no wallet, no funds, no transaction)

Run **one** read-only call (`getReserves()` selector `0x0902f1ac`):

```bash
curl -s -X POST https://evmrpc.0g.ai \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"to":"0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE","data":"0x0902f1ac"},"latest"]}'
# expect: all-zero reserves (0 / 0). Any non-zero or error = FINDING, report verbatim.
```

Optional cross-check (no extra tooling): open the pair address on https://chainscan.0g.ai and confirm the page shows the same address with no liquidity event. Do NOT send funds, sign, or run any `*:execute` script.

## 3. Independent observation — allowed verdicts

Record **what you actually found**, uncoached. Pick exactly one:

```text
PASS         — reserves observed 0/0, matches claim.
INCONCLUSIVE — could not determine (RPC error, explorer unreachable, ambiguous output); state blocker.
INCOMPLETE   — stopped before the single call completed; state where and why.
FINDING      — observed state contradicts claim (non-zero reserves, different address behavior, page ≠ chain); attach verbatim output + timestamps.
```

No coached conclusion. Honest drift (`docs ≠ chain`) is a successful verification event.

## 4. Verbatim receipt (paste this, fill it)

```text
verifier: (name or handle — must not be repo maintainer for m-eligibility)
date_utc: (YYYY-MM-DDTHH:MMZ)
method: single-curl getReserves via https://evmrpc.0g.ai (+ optional explorer check)
pair: 0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE
raw_output: (paste full RPC JSON verbatim, no trimming)
verdict: PASS / INCONCLUSIVE / INCOMPLETE / FINDING (one only)
verbatim_note: (one paragraph, your words, what you saw)
disagreements: (none, or list with timestamps)
```

Rules: **CAPABILITY ≠ AUTHORITY · EVIDENCE ≠ AUTHORIZATION.** This receipt is evidence for later governance review only. It never unlocks mint, liquidity, staking, yield, or any spend — quorum `m=3` included.

## 5. Record (the loop closes here)

1. Open a GitHub issue titled `External verification: YYYY-MM-DD`:
   https://github.com/onenoly1010/Quantum-pi-forge/issues/new?title=External%20verification%3A%20YYYY-MM-DD
2. Paste the verbatim receipt above. Reference context [#636](https://github.com/onenoly1010/Quantum-pi-forge/issues/636).
3. Maintainer indexes it in [verification-reports/INDEX_V1.md](./verification-reports/INDEX_V1.md). Maintainer self-reports never count toward `m=3`.
4. Full template (if you check more than this one claim): [VERIFICATION_REPORT_TEMPLATE_V1.md](./VERIFICATION_REPORT_TEMPLATE_V1.md).

Full path reference (not required for this packet): [FIRST_VERIFICATION_EVENT_V1.md](./FIRST_VERIFICATION_EVENT_V1.md) · [VERIFICATION_PORTAL_V1.md](./VERIFICATION_PORTAL_V1.md) · [MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md](./MULTI_REPORT_VERIFICATION_ARCHITECTURE_V1.md).

---
*Single-claim outsider packet — one claim, one curl, verbatim reality. Restraint remains the evidence.*
