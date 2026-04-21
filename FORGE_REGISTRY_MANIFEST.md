# 🔥 ForgeRegistry - Sovereign Guardian Contract

## Contract Details
| Attribute | Value |
|-----------|-------|
| **Solidity Version** | `0.8.20` |
| **Event Signature Hash** | `0x6760ce85b1d88b62de57d71b5cc601cc8a3610138b395c76bc0f56198e392bba` |
| **Event ABI** | `GuardianActivated(address indexed guardian, uint256 timestamp)` |
| **Optimizations** | `200 runs` |
| **Deployment Chain** | 0G Aristotle Mainnet |

---

## Contract Properties:
✅ **No owner key** - No admin, no backdoors
✅ **Idempotent registration** - Each address can register exactly once
✅ **Permanent record** - Cannot be removed or modified
✅ **No ETH acceptance** - Cannot receive funds
✅ **Clean event stream** - Only one single event emitted
✅ **Public mapping** - `isGuardian(address)` verifiable by anyone
✅ **Public counter** - `totalGuardians()` live metric

---

## Verification:
```
keccak256("GuardianActivated(address,uint256)") = 0x6760ce85b1d88b62de57d71b5cc601cc8a3610138b395c76bc0f56198e392bba
```

---

## Next Steps:
1. Deploy contract to 0G Aristotle Mainnet
2. Verify contract on block explorer
3. Add contract address to frontend live panel
4. Integrate `register()` call into guardian script
5. Add live guardian counter to index.html