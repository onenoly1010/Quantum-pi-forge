# G-02 Build Integrity — Evidence

**Timestamp (UTC):** 2026-07-16T19:47:34Z  
**HEAD:** `ce275b81f54d4f166a17f7fac8ffa67f0c937435`  
**Full log:** `docs/activation/evidence/G-02-build-log-20260716T194734Z.txt`

## Supported builds discovered

| Build | Command | Exit | Result |
| --- | --- | ---: | --- |
| Static site / Cloudflare Pages | `npm run build` (`node scripts/build.js`) | **0** | `out/` produced; version manifest for `ce275b8` |
| Foundry contracts | `cd contracts && forge build --evm-version cancun` | **0** | `Compiler run successful!` (Solc 0.8.24) |
| Hardhat compile | `npx hardhat compile` | **0** | `Compiled 2 Solidity files with solc 0.8.24 (evm target: cancun)` |

## Lint / types / bundle

| Check | Result | Notes |
| --- | --- | --- |
| npm lint scripts | **N/A** | `package.json` has **no** scripts matching lint/typecheck/tsc/eslint/prettier |
| Forge lint notes | INFO | Compiler emitted style **notes** (imports, modifier wrapping); **not** treated as errors; process exit 0 |
| Types (TS project-wide) | **N/A** | No root typecheck script discovered |
| Bundle (static) | PASS | `npm run build` completed static copy to `out/` |

## Exit condition

Protocol: zero errors on supported builds.

**PASS** — all discovered supported builds exited 0. Lint/type gates are not configured as package scripts; absence is recorded, not invented as failure or success of a non-existent check.

## Forbidden actions not taken

- No “fix” of forge lint notes (would be drive-by refactor)  
- No auto-commit of build artifacts  
