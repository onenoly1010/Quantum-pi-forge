# Independent Verification v1

Run `npm run verify:independent` from a checkout at the referenced commit (Node 22).
Add `-- --live` to also make read-only JSON-RPC calls (`eth_chainId`, `eth_getCode`) to the 0G RPC.
Nothing is signed, sent, deployed or published.

Each check reports **PASS**, **FAIL** or **UNKNOWN**. A check that cannot be done is UNKNOWN, never PASS.
The overall result is FAIL if any check fails, UNKNOWN if any check is unknown, and PASS only if every check passes.
Exit codes: 0 PASS, 1 FAIL, 2 UNKNOWN, 3 verifier error.

The verifier writes one file: a run record in `.qpf-runs/` (git-ignored), with UTC times, commit, Node version,
command, per-check observed values and input sha256 digests. It does **not** rewrite
`deploy/independent-verification-v1.json`, which is kept as a historical receipt (its fixed "PASS" came from a format-only check).

Tests, including deliberately tampered inputs that must FAIL: `npm run test:verify-independent`.

## What this verifies and what it does not

**It verifies**, from the repository alone:
- The three evidence files exist, parse, and have the expected schema.
- The recorded chain is 0G mainnet (`0x4115`) and agrees with the declared deployment list.
- The addresses observed on-chain are exactly the addresses QPF declares, and the three files list the same contracts.
- The derived copy in `deploy/live-rpc-correspondence-v1.json` repeats the same code hashes and sizes.
- Build-manifest entries are internally consistent (empty bytecode ↔ empty hash) and match `contracts/foundry.toml` compiler settings.
- Listed source files exist, and the source-identity file makes no claim (such as MATCHED) that its own evidence cannot back.
- With `--live`: the code at each address, at the recorded block, still hashes to the recorded value.
- If you build `contracts/out` with Foundry: artifact bytecode hashes match the manifest.

**It does not verify:**
- That the deployed contracts were built from this repository's source. The evidence does not establish this, so that check is UNKNOWN.
- Contract behavior, ownership, security, or safety of funds.
- Who ran a verification, or when. Digests prove integrity only.
- Anything about adoption, demand, or value.
- Running this grants no authority (`externalVerifierAuthority: false`).
