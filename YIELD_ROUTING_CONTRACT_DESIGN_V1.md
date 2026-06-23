# Contract Design — Yield-Routing Contracts V1

**Lane:** yield-routing contract design v1  
**Mode:** REVIEW-ONLY / NO LIVE EXECUTION  
**Status:** DESIGN_PROPOSED (contract architectures defined, no deployment)  
**Canon:** `main` @ `949e928`  
**Generated:** 2026-06-23 03:42 UTC-6

---

## 1. Architecture Overview

### Flow Diagram

```
                       ┌──────────────────────────────────┐
                       │         FeeCollector              │
                       │  (single entry point for fees)    │
                       └──────────┬───────────────────────┘
                                  │ routes based on source
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────────┐
│   LegacyVault     │   │ PioneerRewards   │   │ OperationalTreasury  │
│  (200-yr timelock)│   │ (rewards pool)   │   │ (ops & infra)        │
└──────────────────┘   └──────────────────┘   └──────────────────────┘
```

### Fee Routing Table

| Source | Fee % | FeeCollector Routing |
|--------|-------|---------------------|
| DEX swap | 0.5% | 50% → LegacyVault, 30% → PioneerRewards, 20% → OperationalTreasury |
| Soul mint | 2.5% | 100% → PioneerRewards |
| Staking cut | 1.0% | 100% → OperationalTreasury |
| Bridge transfer | 0.25% | 100% → LegacyVault |

---

## 2. FeeCollector Contract

### Role
Single entry point that receives all protocol fees and routes them to the appropriate vault/treasury/pool based on fee source.

### Interface

```solidity
interface IFeeCollector {
    /// @notice Route DEX swap fees
    function routeSwapFees() external payable;
    
    /// @notice Route soul mint royalties
    function routeMintRoyalties(address from, uint256 amount) external;
    
    /// @notice Route staking yield cut
    function routeStakingCut() external payable;
    
    /// @notice Route bridge transfer fees
    function routeBridgeFees() external payable;
    
    /// @notice Check if fee routing is active
    function isActive() external view returns (bool);
    
    /// @notice Activate fee collection (only once)
    function activate(address[] calldata recipients, uint256[] calldata splits) external;
    
    /// @notice Pause in emergency (Guardian only)
    function pause() external;
    
    /// @notice Unpause (Guardian only)  
    function unpause() external;
}
```

### Storage

```solidity
address public legacyVault;
address public pioneerRewards;
address public operationalTreasury;
bool public active;
bool public paused;

// Fee split basis points (total = 10000 = 100%)
uint256 public swapLegacyShare = 5000;   // 50%
uint256 public swapPioneerShare = 3000;  // 30%
uint256 public swapTreasuryShare = 2000; // 20%
```

### Access Control

- `activate()` — callable once by deployer or Ennead multisig
- `pause()` / `unpause()` — Guardian role (Ennead multisig)
- Split modification — not permitted (immutable per GDR-001.2)

### Reentrancy Protection

- Use OpenZeppelin `ReentrancyGuard` for all `route*()` functions
- Follow checks-effects-interactions pattern

---

## 3. LegacyVault Contract

### Role
Long-term reserve receiving 50% of swap fees and 100% of bridge fees. Locked until block ~73,050,000 (≈200 years).

### Interface

```solidity
interface ILegacyVault {
    /// @notice Accept native 0G (only callable by FeeCollector)
    function deposit() external payable;
    
    /// @notice Get current vault balance
    function balance() external view returns (uint256);
    
    /// @notice Get unlock block height
    function unlockBlock() external view returns (uint256);
    
    /// @notice Distribute to Soul Nodes at maturity (callable by anyone after unlock)
    function distribute() external;
}
```

### Storage

```solidity
address public immutable feeCollector;
uint256 public constant UNLOCK_BLOCK = 73050000; // ~200 years from block 0
uint256 public startBlock; // block when first deposit occurs
bool public distributed;
mapping(address => uint256) public soulNodeShares; // for eventual distribution
```

### Design Decisions

- **No withdrawal mechanism**: No keys, no admin, no backdoors until unlock block
- **Compounding**: Native 0G held in contract, no yield farming (gas-efficient)
- **Distribution**: At maturity, total balance split equally among active Soul Nodes
- **Reentrancy**: `deposit()` is simple `payable` receive — no reentrancy surface

### Edge Cases

- **Early deposits before activation**: Revert unless called by FeeCollector
- **Multiple deposits**: Accumulate, only one `distribute()` call at maturity
- **Zero Soul Nodes**: Balance remains locked until at least one Soul Node exists

---

## 4. PioneerRewards Contract

### Role
Reward pool receiving 30% of swap fees and 100% of soul mint royalties. Distributed to staked pioneers weighted by SOV contribution.

### Interface

```solidity
interface IPioneerRewards {
    /// @notice Accept fees (only callable by FeeCollector)
    function deposit() external payable;
    
    /// @notice Accept ERC20 royalties (only callable by FeeCollector)
    function depositERC20(address token, uint256 amount) external;
    
    /// @notice Claim rewards by pioneer
    function claim() external returns (uint256);
    
    /// @notice Get pending rewards for address
    function pendingRewards(address pioneer) external view returns (uint256);
    
    /// @notice Get total reward pool
    function totalPool() external view returns (uint256);
}
```

### Storage

```solidity
address public immutable feeCollector;
mapping(address => uint256) public rewards;
uint256 public totalAccumulated;
uint256 public constant CLAIM_COOLDOWN = 21600; // ~3 days in blocks
mapping(address => uint256) public lastClaimBlock;
```

### Accounting Model

- Rewards accrue proportionally to SOV Weight
- Earned = (pioneerSOVWeight / totalSOVWeight) × totalAccumulated
- Claimable = earned - alreadyClaimed

### Dust/Rounding

- Dust (remainder < 1 wei) stays in pool for next distribution
- No rounding down to zero — minimum claim threshold: `1 gwei (1e9 wei)`

### Reentrancy

- `claim()` uses checks-effects-interactions (update mapping before transfer)
- OpenZeppelin `ReentrancyGuard`

---

## 5. OperationalTreasury Contract

### Role
Operations fund receiving 20% of swap fees and 100% of staking cut. Disburses for authorized OLLAMA/0G/audit/maintenance costs through Guardian-approved proposals.

### Interface

```solidity
interface IOperationalTreasury {
    /// @notice Accept fees (only callable by FeeCollector)
    function deposit() external payable;
    
    /// @notice Propose expenditure (Guardian only)
    function proposeExpenditure(address to, uint256 amount, bytes32 reason) external returns (uint256 proposalId);
    
    /// @notice Approve expenditure proposal (Guardian consensus)
    function approveExpenditure(uint256 proposalId) external;
    
    /// @notice Execute approved expenditure
    function executeExpenditure(uint256 proposalId) external;
    
    /// @notice Get balance
    function balance() external view returns (uint256);
    
    /// @notice Get proposal details
    function getProposal(uint256 proposalId) external view returns (...);
}
```

### Storage

```solidity
address public immutable feeCollector;
address[] public guardians;
uint256 public guardianApprovalThreshold = 3; // out of N guardians
uint256 public proposalCount;

struct Proposal {
    address to;
    uint256 amount;
    bytes32 reason;
    uint256 approvals;
    bool executed;
    mapping(address => bool) approvedBy;
}
```

### Access Control

- Guardian set: 5/7 multisig for expenditure approval
- Expenditure requires: `>= guardianApprovalThreshold` approvals
- Treasury deposit: FeeCollector only
- No salaries, no marketing, no team tokens (enforced by reason field check)

### Event Schema

```solidity
event FeeDeposited(address indexed from, uint256 amount, uint8 source);
event ExpenditureProposed(uint256 indexed proposalId, address to, uint256 amount, bytes32 reason);
event ExpenditureApproved(uint256 indexed proposalId, address guardian);
event ExpenditureExecuted(uint256 indexed proposalId);
event Paused(address guardian);
event Unpaused(address guardian);
```

---

## 6. Fee Source Detection

The FeeCollector determines which routing table to use based on `msg.sender` / function selector.

| Function | Source | Routing |
|----------|--------|---------|
| `routeSwapFees()` | DEX router callback | 50/30/20 split |
| `routeMintRoyalties()` | OINIOToken royalty callback | 100% PioneerRewards |
| `routeStakingCut()` | Staking contract callback | 100% OperationalTreasury |
| `routeBridgeFees()` | Bridge contract callback | 100% LegacyVault |

For DEX integration, the UniswapV2Factory `feeTo` parameter points to the FeeCollector address. The `_mintFee` function in the pair contract sends accumulated fees to FeeCollector via `routeSwapFees()`.

---

## 7. Upgradeability Decision

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Upgradeable? | **No** — all contracts are immutable proxy-free | GDR-001.2 specifies immutability  |
| Exception | OperationalTreasury guardian set is mutable (5/7 rotating) | Authorized expenditures need governance flexibility  |
| Proxy pattern | Not used | Avoids proxy admin risk and storage collision complexity |
| Constructor args | All immutable addresses set at deploy time | Ensures FeeCollector → vault routing cannot be changed |

---

## 8. Emergency Pause Decision

| Contract | Pausable? | Trigger | Effect |
|----------|-----------|---------|--------|
| FeeCollector | ✅ Yes | Guardian multisig (>= 3/5) | Stops fee routing, accumulated fees held in contract |
| LegacyVault | ❌ No | N/A — no admin controls by design | Cannot be paused |
| PioneerRewards | ❌ No (deposits only) | N/A | Deposits can be paused via FeeCollector; claims cannot be blocked |
| OperationalTreasury | ✅ Yes | Guardian multisig | Stops expenditure execution |

---

## 9. Token Compatibility

| Aspect | Design |
|--------|--------|
| Native 0G | All deposits use native 0G (`msg.value` or `payable` receive) |
| ERC20 | PioneerRewards supports ERC20 tokens for mint royalty payments |
| Wrapped 0G (W0G) | Not used directly — DEX swaps route native 0G through FeeCollector |
| OINIOToken | Fixed-supply ERC20, no mint function — yield is fee-based, not emissions-based |

### No-Mint Yield Guarantee

OINIOToken has no mint function. All yield distributed through these contracts comes exclusively from:
1. DEX swap fees (0.5% on each trade)
2. Soul mint royalties (2.5% on mint)
3. Staking yield cuts (1.0% of staking rewards)
4. Bridge transfer fees (0.25% on each transfer)

No tokens are created for yield. Yield = accumulated fees, not inflation.

---

## 10. Required Tests (pre-deployment)

See Phase 5 specification for complete test matrix. Key test categories:
- Fee collection and routing accuracy (unit)
- Distribution accounting (unit + invariant)
- Reentrancy resistance (fuzz)
- Emergency pause (integration)
- Timelock enforcement (integration)
- No-mint yield proof (integration)

---

## 11. Safety Assertions

- wallet_actions: false
- private_key_access: false
- signing_attempted: false
- transaction_broadcast: false
- deployment_attempted: false
- live_execution: false
- code_review_only: true
- contract_design_proposed: true