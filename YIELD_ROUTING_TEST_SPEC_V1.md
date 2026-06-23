# Test Specification — Yield-Routing Contracts V1

**Lane:** yield-routing test spec v1  
**Mode:** REVIEW-ONLY / NO LIVE EXECUTION  
**Status:** TEST_SPEC_DEFINED (test requirements codified, Solidity source and tests written, not deployed)  
**Canon:** `main` @ `22370fb`  
**Generated:** 2026-06-23 03:54 UTC-6

---

## 1. Test Environment

- **Framework**: Foundry (forge test)
- **Solc**: 0.8.24
- **EVM**: cancun
- **Fuzz runs**: 1024 per test
- **Invariant runs**: 65536

---

## 2. Source Contracts (written alongside tests)

| Contract | Path | Purpose |
|----------|------|---------|
| FeeCollector | `contracts/src/FeeCollector.sol` | Single entry point for all protocol fees |
| LegacyVault | `contracts/src/LegacyVault.sol` | 200-year timelock vault |
| PioneerRewards | `contracts/src/PioneerRewards.sol` | SOV-weighted reward pool |
| OperationalTreasury | `contracts/src/OperationalTreasury.sol` | Guardian-approved expenditure treasury |

---

## 3. Test Files

| Test File | Tests |
|-----------|-------|
| `contracts/test/FeeCollector.t.sol` | Fee collection, routing, pause, reentrancy |
| `contracts/test/LegacyVault.t.sol` | Deposit, balance, timelock, distribution |
| `contracts/test/PioneerRewards.t.sol` | Fee deposits, SOV-weighted claims, cooldown |
| `contracts/test/OperationalTreasury.t.sol` | Expenditure proposals, approvals, execution |
| `contracts/test/YieldRoutingIntegration.t.sol` | End-to-end: DEX swap → FeeCollector → vaults |

---

## 4. Test Cases

### 4.1 FeeCollector Tests

| # | Test | Type | Expected |
|---|------|------|----------|
| FC-1 | `routeSwapFees()` splits 50/30/20 correctly | Unit | LegacyVault: 50%, PioneerRewards: 30%, Treasury: 20% |
| FC-2 | `routeMintRoyalties()` sends 100% to PioneerRewards | Unit | Full amount to PioneerRewards |
| FC-3 | `routeStakingCut()` sends 100% to Treasury | Unit | Full amount to OperationalTreasury |
| FC-4 | `routeBridgeFees()` sends 100% to LegacyVault | Unit | Full amount to LegacyVault |
| FC-5 | `activate()` can only be called once | Unit | Second call reverts |
| FC-6 | `pause()` blocks routing | Unit | Routes revert when paused |
| FC-7 | `unpause()` resumes routing | Unit | Routes succeed after unpause |
| FC-8 | Non-Guardian cannot pause | Unit | Reverts with `NotGuardian` |
| FC-9 | Reentrancy guard blocks callback attack | Fuzz | Attacker cannot re-enter during routing |
| FC-10 | Zero-address vault is rejected | Unit | Constructor reverts |
| FC-11 | Swap fee splits total exactly 100% | Invariant | swapLegacyShare + swapPioneerShare + swapTreasuryShare == 10000 |

### 4.2 LegacyVault Tests

| # | Test | Type | Expected |
|---|------|------|----------|
| LV-1 | `deposit()` only callable by FeeCollector | Unit | Non-FeeCollector reverts |
| LV-2 | Balance accumulates on multiple deposits | Unit | balance == sum of deposits |
| LV-3 | `balance()` returns correct value | Unit | == address(this).balance |
| LV-4 | `distribute()` reverts before unlock block | Unit | Reverts with `NotYetUnlocked` |
| LV-5 | `distribute()` succeeds after unlock block | Unit | Emits `Distributed` event |
| LV-6 | `unlockBlock()` returns constant | Unit | == 73050000 |
| LV-7 | Native 0G stays in contract as balance | Invariant | address(this).balance never decreases except distribute() |

### 4.3 PioneerRewards Tests

| # | Test | Type | Expected |
|---|------|------|----------|
| PR-1 | `deposit()` only callable by FeeCollector | Unit | Non-FeeCollector reverts |
| PR-2 | `depositERC20()` only callable by FeeCollector | Unit | Non-FeeCollector reverts |
| PR-3 | Rewards accumulate proportionally to SOV weight | Unit | Higher weight → higher pending |
| PR-4 | `claim()` transfers correct amount | Unit | claim == pendingRewards |
| PR-5 | `claim()` respects cooldown | Unit | Second claim within cooldown reverts |
| PR-6 | `pendingRewards()` returns 0 after claim | Unit | claim → pendingRewards == 0 |
| PR-7 | Multiple deposits accumulate | Unit | totalAccumulated grows |
| PR-8 | Dust handling: remainder < 1 wei stays | Unit | Not lost, stays in pool |
| PR-9 | Minimum claim threshold of 1 gwei | Unit | Claim of < 1 gwei reverts |
| PR-10 | Reentrancy guard on claim() | Fuzz | Cannot re-enter during claim |

### 4.4 OperationalTreasury Tests

| # | Test | Type | Expected |
|---|------|------|----------|
| OT-1 | `deposit()` only callable by FeeCollector | Unit | Non-FeeCollector reverts |
| OT-2 | Guardian can propose expenditure | Unit | Proposal created, id returned |
| OT-3 | Non-Guardian cannot propose | Unit | Reverts with `NotGuardian` |
| OT-4 | Proposal requires threshold approvals | Unit | < threshold → cannot execute |
| OT-5 | Guardian can approve | Unit | Approval count increases |
| OT-6 | Double approval by same guardian reverts | Unit | Reverts with `AlreadyApproved` |
| OT-7 | Approved proposal can be executed | Unit | Transfer succeeds, `executed` set |
| OT-8 | Executed proposal cannot be re-executed | Unit | Reverts with `AlreadyExecuted` |
| OT-9 | `pause()` blocks expenditure | Unit | Proposals cannot be created when paused |
| OT-10 | Budget enforcement: propose > balance reverts | Unit | Reverts with `InsufficientBalance` |

### 4.5 Integration Tests

| # | Test | Type | Expected |
|---|------|------|----------|
| INT-1 | DEX swap → FeeCollector → vault flow | Integration | Full routing completes, balances update |
| INT-2 | FeeCollector paused → all routes blocked | Integration | All route*() calls revert |
| INT-3 | LegacyVault → distribute after unlock | Integration | Balance zeroed after distribution |
| INT-4 | Full fee cycle: route → accumulate → claim | Integration | Pioneer can claim accumulated rewards |

---

## 5. Gas Sanity Checks

| Test | Max Gas |
|------|---------|
| FeeCollector.routeSwapFees() | 200k |
| FeeCollector.routeMintRoyalties() | 150k |
| PioneerRewards.claim() | 100k |
| OperationalTreasury.proposeExpenditure() | 80k |
| OperationalTreasury.approveExpenditure() | 50k |
| OperationalTreasury.executeExpenditure() | 60k |

---

## 6. Invariant Tests

| Invariant | Property |
|-----------|----------|
| Total fees in == total fees out | Sum of all vault/treasury balances == total fees collected minus gas |
| No minting | OINIOToken totalSupply never increases |
| Fee split consistency | FeeCollector split totals always == 10000 bps |
| Pause state isolation | Paused FeeCollector does not affect already-stored funds |

---

## 7. Success Criteria

- [ ] `forge build` passes with no warnings
- [ ] `forge test` passes all unit tests
- [ ] `forge test` passes all fuzz tests (1024 runs)
- [ ] `forge test` passes integration tests
- [ ] Gas checks within limits
- [ ] OINIOToken totalSupply invariant holds
- [ ] `npm run verify:evidence` passes

---

## 8. Safety Assertions

- wallet_actions: false
- private_key_access: false
- signing_attempted: false
- transaction_broadcast: false
- deployment_attempted: false
- live_execution: false
- code_review_only: true
- tests_written: true
- forge_build_passing: false (requires `forge build`)
- forge_test_passing: false (requires `forge test`)