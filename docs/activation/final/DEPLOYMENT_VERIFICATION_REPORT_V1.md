# Deployment Verification Report v1

**RPC:** `https://evmrpc.0g.ai`  
**Live chainId:** `16661` (`0x4115`) — **verified**  
**Probe HEAD:** `ce275b8…`  
**Canonical matrix:** `contracts/DEPLOYED_ADDRESSES.md`

## Summary

| Item | Result |
| --- | --- |
| Network reachable | Yes |
| Chain ID correct | Yes |
| Contracts with code | Multiple (two sets) |
| CREATE receipts (broadcast set) | Verified `status=0x1` |
| Bytecode match current Foundry artifacts | **Only broadcast OINIOToken** |
| Ownership safe | **No** — untrusted owner residual |
| Pi deployments | Pending (not probed) |

## Broadcast set (Foundry CREATE)

| Contract | Address | Block | CREATE tx | Code | Artifact match |
| --- | --- | ---: | --- | ---: | --- |
| OINIOToken | `0x709f23C7A7172E137427576abB5Eb8959E2A57c1` | 36824379 | `0x78e0247e…` | 2280 B | **MATCH** |
| OINIOModelRegistry | `0x25A9C5A244EAf688E078C387616e2380A0589562` | 36824380 | `0x24a33a32…` | 9710 B | NO MATCH |
| HeartbeatMonitor | `0xd1d5147f38E74855a133Cd75cE7b040eBE6324a0` | 36824380 | `0xd1cc6e7e…` | 2571 B | NO MATCH |

Deployer `from`: `0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc`

## Docs / public-mint set (code present)

| Contract | Address | Code | Artifact match |
| --- | --- | ---: | --- |
| OINIOToken | `0x75995EC0fdf881189850aeD864cB3f43c0DFCb58` | 2281 B | NO MATCH |
| OINIOModelRegistry | `0x67aD7169184581f23D1E10B39d4eb4e98293E87a` | 9850 B | NO MATCH |
| HeartbeatMonitor | `0x5E50b92E57e854659f7D98c733088aABd551C49F` | 2571 B | NO MATCH |

Docs token ABI smoke: name `OINIO Token`, symbol `OINIO`, decimals 18, supply 1e9 whole tokens.

## Alternate address

| Address | Code | Note |
| --- | ---: | --- |
| `0x6011c341a01c80f489a5c3Ab751987A55142F04e` | 4132 B | Skill inventory alt; not canon this gate |

## Build ↔ deploy linkage

| Build | Result |
| --- | --- |
| `forge build --evm-version cancun` | exit 0 |
| Compare `contracts/out/**` to chain | Partial match only |
| Static site build | exit 0; `out/version.json` commit pin |

## Deployment verdict

| Claim | Verdict |
| --- | --- |
| “Something is deployed on Aristotle with live code” | **PASS** (RPC) |
| “Single verified canonical deployment matching current source for all contracts” | **BLOCKED** (B-01, B-03) |
| “Safe production ownership” | **BLOCKED** (B-02) |
| “Pi Network contracts live” | **NOT ESTABLISHED** |

## Explorer links (broadcast token)

https://chainscan.0g.ai/address/0x709f23C7A7172E137427576abB5Eb8959E2A57c1  
