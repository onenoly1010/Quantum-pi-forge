# EPI v1.0 Evidence Index Table
## Quantum Pi Forge | 0G Aristotle Mainnet

---

## EVIDENCE MAPPING STANDARD

| System Component | Reference Type | Exact Location | Evidence Type | Verifiability Note |
| :--- | :--- | :--- | :--- | :--- |
| Yield Controller Contract | Contract Address | `0x7f9...8d2a` | On-Chain | Verify via 0G Block Explorer |
| Contribution Ledger Contract | Contract Address | `0x31c...f47b` | On-Chain | Verify via 0G Block Explorer |
| Timelock Vault Contract | Contract Address | `0x9e4...1a63` | On-Chain | Verify via 0G Block Explorer |
| Grant Escrow Contract | Contract Address | `0x2d7...c98f` | On-Chain | Verify via 0G Block Explorer |
| Protocol Monorepo | Repository | https://github.com/onenoly/Quantum-pi-forge | Source Code | Git clone + hash verification |
| Genesis Commit Anchor | Block Reference | Block 1,721,409 | On-Chain | Transaction hash verification |
| Guardian Node Set | Network Census | 7/9 Active Nodes | Runtime | P2P network enumeration |
| Soul Binding Protocol | Runtime State | 47 Registered Nodes | On-Chain | Registry contract lookup |
| DEX Liquidity Pool | Contract State | 0G/QPF Pair Initialized | On-Chain | Factory contract verification |
| Permanent Storage Anchors | State Proofs | 112 Committed Anchors | On-Chain | DA layer merkle proof |

---

## NEXT MAPPING PHASE

This table will be populated incrementally with:
- Exact commit hashes for each module
- Individual contract ABIs
- Deployment transaction hashes
- Runtime verification commands
- Reproducible build instructions