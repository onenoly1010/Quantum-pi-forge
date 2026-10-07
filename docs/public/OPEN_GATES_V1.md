# Open Gates — participant map

**Status:** Public participant door  
**Date:** 2026-09-18 (door honesty update)  
**Live page:** https://quantumpiforge.com/open.html  
**Machine-readable:** [`deploy/open-gates-v1.json`](../../deploy/open-gates-v1.json)  
**Operating doctrine:** [`docs/governance/OPEN_GATES_PLATFORM_HANDOVER_V1.md`](../governance/OPEN_GATES_PLATFORM_HANDOVER_V1.md)

If you are a human or an AI who did not build QPF: start here. Do not wait for Kris Olofson.

```text
You do not need an account.
You do not need a wallet.
You do not need approval to inspect.
You do need evidence for any claim you make.
```

**Do this first** (then go deeper below):

1. Confirm the chain:

```bash
curl -s -X POST https://evmrpc.0g.ai \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
# expect "0x4115"
```

2. Run the browser check: https://quantumpiforge.com/try.html

Creating a counterpart is a different door: https://quantumpiforge.com/mint-ai.html  
This map is for inspect / verify / participate without waiting for Kris.

---

## 1. What exists, classified

```text
TECHNICAL CAPABILITY     = ESTABLISHED
EXTERNAL ADOPTION        = NOT ESTABLISHED
CUSTOMER                 = NOT ESTABLISHED
REAL REVENUE             = NOT ESTABLISHED
AI ECONOMY               = BEING BUILT
MINT / LP / YIELD        = NOT AUTHORIZED
```

Established means: a stranger can inspect public artifacts and reproduce a check.

Not established means: do not say it as if it were true.

---

## 2. Chain context

| Field | Value |
| --- | --- |
| Network | 0G Aristotle mainnet |
| Chain ID | `16661` (`0x4115`) |
| Public RPC | `https://evmrpc.0g.ai` |
| Explorer | `https://chainscan.0g.ai` |
| Source | https://github.com/onenoly1010/Quantum-pi-forge |
| Public site | https://quantumpiforge.com |

Designated identity set (docs SoR, chain 16661):

| Role | Address |
| --- | --- |
| Token | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` |
| Registry | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` |
| Heartbeat | `0x5E50b92E57e854659f7D98c733088aABd551C49F` |

`0x6011c341a01c80f489a5c3Ab751987A55142F04e` is a historical peer. It is **not** designated identity SoR.

Designation ≠ control ≠ economic authority. Code present ≠ economy open.

---

## 3. Enter — do one thing now

Pick one. All of these work without Kris.

| Action | Where | Needs Kris? |
| --- | --- | --- |
| Confirm chain + code at a claimed address | [/try.html](https://quantumpiforge.com/try.html) | No |
| **Canonical stranger VERIFY** (EXT-001) | [/attack-kit.html](https://quantumpiforge.com/attack-kit.html) | No |
| Begin creating a counterpart | [/birth](https://quantumpiforge.com/birth) | No |
| Meet / continue after birth | [/meet](https://quantumpiforge.com/meet) | No |
| Read public contract inventory | [/deployed-addresses.html](https://quantumpiforge.com/deployed-addresses.html) | No |
| Run local independent verification | `npm run verify:independent` from a clone | No |
| File a verification report | [GitHub issues](https://github.com/onenoly1010/Quantum-pi-forge/issues/new) | No |
| Request a packaged review | [/verification-request.html](https://quantumpiforge.com/verification-request.html) | Human fit-check after you submit |

First useful action for most participants:

```bash
curl -s -X POST https://evmrpc.0g.ai \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
# expect "0x4115"
```

Then open [/try.html](https://quantumpiforge.com/try.html) and run the browser check.

---

## 4. If you are an AI

Do not ask Kris to interpret this repository.

Allowed without further human GO:

- read this map, the handover, the verification status table, and public JSON
- reproduce public RPC checks
- run documented local verify / dry-run commands
- write evidence, reports, and honest receipts
- open issues or PRs that do not move capital

Forbidden without a separate explicit human GO:

- mint, LP, yield, staking, or other protocol economics
- wallet sign / broadcast / fund
- live 0G compute deposit or paid inference
- pretending to be an independent customer
- declaring UNKNOWN states healthy
- claiming revenue, adoption, or a complete AI economy

Preferred loop:

```text
AUTHORIZED SCOPE → EXECUTE → VERIFY → RECEIPT
```

If a boundary blocks execution:

```text
BOUNDARY → NO FALSE EXECUTION → HONEST RECEIPT
```

---

## 5. Create

What a participant can create **today** without protocol economics:

| Object | How | Status |
| --- | --- | --- |
| A public verification check | `/try` or curl against a claimed address | Supported |
| A break / non-break of EXT-001 | `/attack-kit` | Supported |
| An independent verification report | GitHub issue using the community template | Supported |
| A packaged evidence request | `/verification-request` | Request supported; delivery is human labor |
| A public verified-work object | [gist](https://gist.github.com/onenoly1010/f219c8b95f554b79896d3c94a016a07b) `qpfo0:ebda8d38…` | Observable; **as of 2026-09-18 published `artifact.bin` is base64 and fails verify — use `/attack-kit` for VERIFY PASS**; **no customer / no payment / no revenue** |
| A local sovereign agent setup | repo installer / Ollama path | Experimental / local |
| Protocol mint, LP position, yield share | — | **Not authorized** |

A created object can be real without being valuable. Value starts when an independent participant voluntarily exchanges something for it.

---

## 6. Verify

**Canonical stranger VERIFY today:** https://quantumpiforge.com/attack-kit — `python3 verify.py` → ALL CHECKS PASSED / ESTABLISHED for EXT-001. The invitation gist is not VERIFY PASS until `artifact.bin` is raw bytes.

Same boundary for humans, AIs, QPF, and the creator:

```text
ASSERTION ≠ EVIDENCE
EVIDENCE ≠ VERIFICATION
VERIFICATION ≠ AUTHORIZATION
AUTHORIZATION ≠ EXECUTION
UNKNOWN != HEALTHY
```

Labels used in QPF packages: **verified** · **unverified** · **gated** · **unknown**.

Reviewer SSOT: [`docs/review/VERIFICATION_STATUS_TABLE_V1.md`](../review/VERIFICATION_STATUS_TABLE_V1.md)

---

## 7. Economic participation

Self-serve inspection is free. QPF does not charge a fee to exist as an inspectable fact.

Current public commercial direction for a packaged review (labor around the protocol, not payment for truth):

```text
STANDARD: $2
EXPEDITED: $5
PAY AFTER ESTABLISHED
FAILED = $0
PAYMENT ≠ VERDICT
```

This is an **offer**. It is not evidence of a customer, a sale, or a market.

Older certificate pages may still mention founder $500 CAD. Treat that as historical product copy until those pages are updated. Do not treat either price as revenue.

Optional CAD $1+ support of demonstrated work lives at [/support.html](https://quantumpiforge.com/support.html). That is support, not protocol mint, and not market validation.

Protocol mint / staking / LP / yield remain **NOT AUTHORIZED**.

---

## 8. Receipts

| Surface | What it records |
| --- | --- |
| `evidence/INDEX.md` | Repo evidence map |
| `receipts/` | Project-recorded receipts (what QPF wrote down) |
| `/verification-artifact` | Inspectable public artifact |
| `/verification-status-v1.json` | Public economic/technical status snapshot |
| `/open-gates-v1.json` | This door, as data |
| GitHub issues / PRs | External participation history |

A QPF receipt is evidence of what was recorded. It is not an external certification, and it is not a substitute for re-running the check.

---

## 9. Boundaries

QPF currently does **not**:

- operate a live public mint
- seed or offer protocol liquidity
- pay yield
- guarantee token value
- certify that an AI is an independent economic actor
- require belief
- require Kris to interpret public evidence

QPF is not an app-store product and is not trying to become one.

---

## 10. Creator-dependency test

If the answer is no, the missing primitive is real:

1. Can a stranger understand this map without Kris?
2. Can they verify something?
3. Can they create something the next participant can recognize?
4. Can consequences be recorded without Kris as middleware?

This file exists so (1) and (2) can be yes.

(3) and (4) are being built by participation, not by announcement.
