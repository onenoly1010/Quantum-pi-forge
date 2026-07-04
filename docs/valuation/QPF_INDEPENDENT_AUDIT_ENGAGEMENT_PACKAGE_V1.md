# QPF Independent Audit Engagement Package v1

Status: AUDIT_SCOPE_PACKAGE_NOT_AUDIT_REPORT
Created: 2026-07-04T05:53:11Z
Head: 9d836e7

## Purpose
This package prepares Quantum Pi Forge for independent external audit scoping. It is not an audit report, not a certification, and not an appraisal. It organizes the technical surfaces, governance gates, evidence receipts, and risk controls that an auditor should review.

## Audit objectives
- Confirm smart contract and deployment posture.
- Review Guardian/Safe authority assumptions and permission boundaries.
- Review public mint, liquidity, staking, and bridge gates before activation.
- Review evidence receipt integrity and build verification flow.
- Confirm no custody, private-key, seed-phrase, signing, or broadcast actions are delegated to AI or public surfaces.
- Identify technical, governance, economic, and operational risks before any financial activation.

## Recommended audit scope
| Scope area | Review target |
|---|---|
| Contracts | Token, registry, heartbeat, mint, staking, DEX/liquidity, bridge-related code where present |
| Governance | Guardian Safe, authorization receipts, role boundaries, activation gates |
| Public surfaces | mint.html, mint-status.html, onboarding/status/deployed-address pages |
| Evidence system | verification scripts, receipts, evidence index, claim map, snapshot checks |
| AI/local observer | no private-key, no signing, no broadcast, review-only boundaries |
| Valuation evidence | FMV memo, audit readiness, permission map, threat model, diligence index, metrics dashboard |

## Files for auditor review
| File | Matched scope terms |
|---|---|
| contracts/0g-dex/README.md | mint, liquidity, audit, deploy, contract |
| contracts/0g-dex/UniswapV2ERC20.sol | mint, safe, contract |
| contracts/0g-dex/UniswapV2Factory.sol | contract |
| contracts/0g-dex/UniswapV2Pair.sol | mint, liquidity, safe, deploy, contract |
| contracts/0g-dex/UniswapV2Router02.sol | mint, liquidity, safe, contract |
| contracts/0g-dex/interfaces/IERC20.sol | contract |
| contracts/0g-dex/interfaces/IUniswapV2Callee.sol | contract |
| contracts/0g-dex/interfaces/IUniswapV2ERC20.sol | contract |
| contracts/0g-dex/interfaces/IUniswapV2Factory.sol | contract |
| contracts/0g-dex/interfaces/IUniswapV2Pair.sol | mint, liquidity, contract |
| contracts/0g-dex/interfaces/IUniswapV2Router01.sol | liquidity, contract |
| contracts/0g-dex/interfaces/IUniswapV2Router02.sol | liquidity, contract |
| contracts/0g-dex/interfaces/IWETH.sol | contract |
| contracts/0g-dex/libraries/Math.sol | contract |
| contracts/0g-dex/libraries/SafeMath.sol | safe, contract |
| contracts/0g-dex/libraries/SafeMath06.sol | safe, contract |
| contracts/0g-dex/libraries/UQ112x112.sol | contract |
| contracts/0g-dex/libraries/UniswapV2Library.sol | liquidity, safe, contract |
| contracts/0g-uniswap-v2/DEPLOYMENT_CHECKLIST.md | liquidity, deploy, contract, private key, wallet, signing |
| contracts/0g-uniswap-v2/IMPLEMENTATION_SUMMARY.md | liquidity, safe, deploy, contract, private key, wallet |
| contracts/0g-uniswap-v2/INTEGRATION_EXAMPLE.md | receipt, contract, private key, signing |
| contracts/0g-uniswap-v2/PR_SUMMARY.md | safe, deploy, contract, wallet |
| contracts/0g-uniswap-v2/QUICKSTART.md | liquidity, safe, deploy, contract, private key, wallet |
| contracts/0g-uniswap-v2/README.md | liquidity, safe, deploy, contract, private key, wallet |
| contracts/0g-uniswap-v2/script/Deploy.s.sol | safe, deploy, contract, broadcast |
| contracts/0g-uniswap-v2/src/W0G.sol | contract |
| contracts/0g-uniswap-v2/test/ZeroGDeployment.t.sol | deploy, contract |
| contracts/DEPLOYED_ADDRESSES.md | liquidity, staking, evidence, receipt, deploy, contract, wallet, signing |
| contracts/DEPLOYMENT_CHECKLIST.md | staking, safe, audit, deploy, contract, private key, wallet, broadcast |
| contracts/INTEGRATION_EXAMPLE.md | safe, receipt, deploy, contract, wallet |
| contracts/README.md | mint, guardian, safe, audit, contract |
| contracts/VERIFICATION.md | mint, staking, safe, audit, deploy, contract, private key, wallet |
| contracts/ZeroGSocialRecovery.sol | guardian, safe, deploy, contract, wallet |
| contracts/broadcast/BirthGenesisHeartbeat.s.sol/16661/run-1782167154566.json | receipt, contract, broadcast |
| contracts/broadcast/BirthGenesisHeartbeat.s.sol/16661/run-latest.json | receipt, contract, broadcast |
| contracts/broadcast/DeployYieldRouter.s.sol/16661/dry-run/run-1782383447144.json | receipt, deploy, contract, broadcast |
| contracts/broadcast/DeployYieldRouter.s.sol/16661/dry-run/run-latest.json | receipt, deploy, contract, broadcast |
| contracts/broadcast/DeployYieldRouter.s.sol/16661/run-1782383524559.json | receipt, deploy, contract, broadcast |
| contracts/broadcast/DeployYieldRouter.s.sol/16661/run-1782387414139.json | receipt, deploy, contract, broadcast |
| contracts/broadcast/DeployYieldRouter.s.sol/16661/run-latest.json | receipt, deploy, contract, broadcast |
| contracts/cache/BirthGenesisHeartbeat.s.sol/16661/run-1782167154566.json | contract |
| contracts/cache/BirthGenesisHeartbeat.s.sol/16661/run-latest.json | contract |
| contracts/cache/DeployYieldRouter.s.sol/16661/dry-run/run-1782383447144.json | deploy, contract |
| contracts/cache/DeployYieldRouter.s.sol/16661/dry-run/run-latest.json | deploy, contract |
| contracts/cache/DeployYieldRouter.s.sol/16661/run-1782383524559.json | deploy, contract |
| contracts/cache/DeployYieldRouter.s.sol/16661/run-1782387414139.json | deploy, contract |
| contracts/cache/DeployYieldRouter.s.sol/16661/run-latest.json | deploy, contract |
| contracts/cache/solidity-files-cache.json | safe, deploy, contract |
| contracts/heartbeat/HeartbeatMonitor.sol | contract |
| contracts/lib/forge-std/CONTRIBUTING.md | audit, contract |
| contracts/lib/forge-std/README.md | safe, deploy, contract |
| contracts/lib/forge-std/RELEASE_CHECKLIST.md | contract |
| contracts/lib/forge-std/package.json | contract |
| contracts/lib/forge-std/src/Base.sol | safe, deploy, contract |
| contracts/lib/forge-std/src/Config.sol | contract |
| contracts/lib/forge-std/src/LibVariable.sol | safe, contract |
| contracts/lib/forge-std/src/Script.sol | safe, contract |
| contracts/lib/forge-std/src/StdAssertions.sol | contract |
| contracts/lib/forge-std/src/StdChains.sol | safe, contract, seed |
| contracts/lib/forge-std/src/StdCheats.sol | mint, safe, receipt, deploy, contract, private key, broadcast |
| contracts/lib/forge-std/src/StdConfig.sol | safe, deploy, contract |
| contracts/lib/forge-std/src/StdConstants.sol | deploy, contract |
| contracts/lib/forge-std/src/StdError.sol | contract |
| contracts/lib/forge-std/src/StdInvariant.sol | contract |
| contracts/lib/forge-std/src/StdJson.sol | safe, contract |
| contracts/lib/forge-std/src/StdMath.sol | contract |
| contracts/lib/forge-std/src/StdStorage.sol | safe, contract |
| contracts/lib/forge-std/src/StdStyle.sol | safe, contract |
| contracts/lib/forge-std/src/StdToml.sol | safe, contract |
| contracts/lib/forge-std/src/StdUtils.sol | safe, deploy, contract |
| contracts/lib/forge-std/src/Test.sol | safe, contract |
| contracts/lib/forge-std/src/Vm.sol | mint, safe, permission, receipt, deploy, contract, private key, seed |
| contracts/lib/forge-std/src/console.sol | safe, contract |
| contracts/lib/forge-std/src/console2.sol | contract |
| contracts/lib/forge-std/src/interfaces/IERC1155.sol | mint, safe, contract |
| contracts/lib/forge-std/src/interfaces/IERC165.sol | contract |
| contracts/lib/forge-std/src/interfaces/IERC20.sol | contract |
| contracts/lib/forge-std/src/interfaces/IERC4626.sol | mint, contract |
| contracts/lib/forge-std/src/interfaces/IERC6909.sol | permission, contract |
| contracts/lib/forge-std/src/interfaces/IERC721.sol | safe, receipt, contract |
| contracts/lib/forge-std/src/interfaces/IERC7540.sol | mint, contract |
| contracts/lib/forge-std/src/interfaces/IERC7575.sol | mint, contract |
| contracts/lib/forge-std/src/interfaces/IMulticall3.sol | contract |
| contracts/lib/forge-std/src/safeconsole.sol | safe, contract |
| contracts/lib/forge-std/test/CommonBase.t.sol | contract |
| contracts/lib/forge-std/test/Config.t.sol | deploy, contract |
| contracts/lib/forge-std/test/LibVariable.t.sol | safe, contract |
| contracts/lib/forge-std/test/StdAssertions.t.sol | mint, contract |
| contracts/lib/forge-std/test/StdChains.t.sol | deploy, contract |
| contracts/lib/forge-std/test/StdCheats.t.sol | safe, receipt, deploy, contract, signing, broadcast |
| contracts/lib/forge-std/test/StdConstants.t.sol | contract |
| contracts/lib/forge-std/test/StdError.t.sol | safe, contract |
| contracts/lib/forge-std/test/StdJson.t.sol | contract |
| contracts/lib/forge-std/test/StdMath.t.sol | deploy, contract |
| contracts/lib/forge-std/test/StdStorage.t.sol | safe, contract, seed |
| contracts/lib/forge-std/test/StdStyle.t.sol | contract |
| contracts/lib/forge-std/test/StdToml.t.sol | contract |
| contracts/lib/forge-std/test/StdUtils.t.sol | deploy, contract, private key |
| contracts/lib/forge-std/test/Vm.t.sol | mint, safe, contract |
| contracts/lib/forge-std/test/compilation/CompilationScript.sol | contract |
| contracts/lib/forge-std/test/compilation/CompilationScriptBase.sol | contract |
| contracts/lib/forge-std/test/compilation/CompilationTest.sol | contract |
| contracts/lib/forge-std/test/compilation/CompilationTestBase.sol | contract |
| contracts/lib/forge-std/test/fixtures/broadcast.log.json | receipt, contract, broadcast |
| contracts/lib/forge-std/test/fixtures/test.json | contract |
| contracts/lib/openzeppelin-contracts/.changeset/config.json | contract |
| contracts/lib/openzeppelin-contracts/.github/ISSUE_TEMPLATE/bug_report.md | contract |
| contracts/lib/openzeppelin-contracts/.github/ISSUE_TEMPLATE/feature_request.md | contract |
| contracts/lib/openzeppelin-contracts/.github/PULL_REQUEST_TEMPLATE.md | contract |
| contracts/lib/openzeppelin-contracts/.mocharc.js | contract |
| contracts/lib/openzeppelin-contracts/.solcover.js | contract |
| contracts/lib/openzeppelin-contracts/CHANGELOG.md | mint, bridge, safe, permission, deploy, contract, wallet, signing |
| contracts/lib/openzeppelin-contracts/CODE_OF_CONDUCT.md | permission, threat, contract |
| contracts/lib/openzeppelin-contracts/CONTRIBUTING.md | contract |
| contracts/lib/openzeppelin-contracts/GUIDELINES.md | audit, contract |
| contracts/lib/openzeppelin-contracts/README.md | safe, permission, audit, deploy, contract, signing |
| contracts/lib/openzeppelin-contracts/RELEASING.md | contract |
| contracts/lib/openzeppelin-contracts/SECURITY.md | evidence, contract |
| contracts/lib/openzeppelin-contracts/audits/2017-03.md | mint, safe, audit, deploy, contract, wallet |
| contracts/lib/openzeppelin-contracts/audits/README.md | mint, audit, contract |
| contracts/lib/openzeppelin-contracts/certora/README.md | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/AccessControlDefaultAdminRulesHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/AccessControlHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/DoubleEndedQueueHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/ERC20FlashMintHarness.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/ERC20PermitHarness.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/ERC20WrapperHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/ERC3156FlashBorrowerHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/ERC721Harness.sol | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/ERC721ReceiverHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/EnumerableMapHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/EnumerableSetHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/InitializableHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/Ownable2StepHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/OwnableHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/PausableHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/harnesses/TimelockControllerHarness.sol | contract |
| contracts/lib/openzeppelin-contracts/certora/run.js | contract |
| contracts/lib/openzeppelin-contracts/certora/specs.json | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/access/AccessControl.sol | permission, contract |
| contracts/lib/openzeppelin-contracts/contracts/access/IAccessControl.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/access/Ownable.sol | deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/access/Ownable2Step.sol | deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol | mint, safe, permission, deploy, contract, signing |
| contracts/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlEnumerable.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlEnumerable.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/access/manager/AccessManaged.sol | permission, contract |
| contracts/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol | guardian, safe, permission, contract |
| contracts/lib/openzeppelin-contracts/contracts/access/manager/AuthorityUtils.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/access/manager/IAccessManaged.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol | guardian, permission, contract |
| contracts/lib/openzeppelin-contracts/contracts/access/manager/IAuthority.sol | permission, contract |
| contracts/lib/openzeppelin-contracts/contracts/finance/VestingWallet.sol | safe, deploy, contract, wallet |
| contracts/lib/openzeppelin-contracts/contracts/governance/Governor.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/TimelockController.sol | deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorCountingSimple.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorPreventLateQuorum.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorStorage.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockAccess.sol | guardian, safe, permission, contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockCompound.sol | safe, permission, contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockControl.sol | safe, permission, contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotes.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotesQuorumFraction.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/utils/IVotes.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/governance/utils/Votes.sol | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC1155.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC1155MetadataURI.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC1155Receiver.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC1271.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC1363.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC1363Receiver.sol | receipt, contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC1363Spender.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC165.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC1820Implementer.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC1820Registry.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC1967.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC20Metadata.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC2309.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC2612.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC2981.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC3156.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC3156FlashBorrower.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC3156FlashLender.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC4906.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC5267.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC5313.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC5805.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC6372.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC721.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC721Enumerable.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC721Metadata.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC721Receiver.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC777.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC777Recipient.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/IERC777Sender.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/draft-IERC1822.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/interfaces/draft-IERC6093.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/metatx/ERC2771Context.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/metatx/ERC2771Forwarder.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/AccessManagedTarget.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ArraysMock.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/AuthorityMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/Base64Dirty.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/CallReceiverMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ContextMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/DummyImplementation.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/EIP712Verifier.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ERC1271WalletMock.sol | contract, wallet |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ERC165/ERC165InterfacesSupported.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ERC165/ERC165MaliciousData.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ERC165/ERC165MissingData.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ERC165/ERC165NotSupported.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ERC165/ERC165ReturnBomb.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ERC2771ContextMock.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ERC3156FlashBorrowerMock.sol | audit, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/EtherReceiverMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/InitializableMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/MulticallTest.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/MultipleInheritanceInitializableMocks.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/PausableMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ReentrancyAttack.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/ReentrancyMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/RegressionImplementation.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/SingleInheritanceInitializableMocks.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/Stateless.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/StorageSlotMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/TimelockReentrant.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/UpgradeableBeaconMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/VotesMock.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/compound/CompTimelock.sol | permission, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/docs/ERC20WithAutoMinerReward.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/docs/ERC4626Fees.sol | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/docs/access-control/AccessControlERC20MintBase.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/docs/access-control/AccessControlERC20MintMissing.sol | mint, deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/docs/access-control/AccessControlERC20MintOnlyRole.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/docs/access-control/AccessManagedERC20MintBase.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/docs/access-control/MyContractOwnable.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/docs/governance/MyGovernor.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/docs/governance/MyToken.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/docs/governance/MyTokenTimestampBased.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/docs/governance/MyTokenWrapped.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/governance/GovernorMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/governance/GovernorPreventLateQuorumMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/governance/GovernorStorageMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/governance/GovernorTimelockAccessMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/governance/GovernorTimelockCompoundMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/governance/GovernorTimelockControlMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/governance/GovernorVoteMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/governance/GovernorWithParamsMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/proxy/BadBeacon.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/proxy/ClashingImplementation.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/proxy/UUPSUpgradeableMock.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC1155ReceiverMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC20ApprovalMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC20DecimalsMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC20ExcessDecimalsMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC20FlashMintMock.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC20ForceApproveMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC20Mock.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC20MulticallMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC20NoReturnMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC20Reentrant.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC20ReturnFalseMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC20VotesLegacyMock.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC4626LimitsMock.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC4626Mock.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC4626OffsetMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC4646FeesMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC721ConsecutiveEnumerableMock.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC721ConsecutiveMock.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC721ReceiverMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/ERC721URIStorageMock.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/mocks/token/VotesTimestamp.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/package.json | contract |
| contracts/lib/openzeppelin-contracts/contracts/proxy/Clones.sol | safe, deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Utils.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/proxy/Proxy.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/proxy/beacon/BeaconProxy.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/proxy/beacon/IBeacon.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/proxy/beacon/UpgradeableBeacon.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/proxy/transparent/ProxyAdmin.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/proxy/transparent/TransparentUpgradeableProxy.sol | permission, deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/proxy/utils/Initializable.sol | safe, deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/proxy/utils/UUPSUpgradeable.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol | safe, permission, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol | safe, receipt, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155Burnable.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155Pausable.sol | mint, valuation, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155Supply.sol | mint, deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Burnable.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Capped.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20FlashMint.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Pausable.sol | mint, valuation, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Votes.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Wrapper.sol | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol | mint, safe, deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol | safe, contract, wallet |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol | safe, permission, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Burnable.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Consecutive.sol | mint, safe, deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Pausable.sol | mint, valuation, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Royalty.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Votes.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Wrapper.sol | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Enumerable.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/token/ERC721/utils/ERC721Holder.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/token/common/ERC2981.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/Address.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/Arrays.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/Base64.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/Context.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/Create2.sol | safe, deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/Multicall.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/Nonces.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/Pausable.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol | deploy, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/ShortStrings.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/StorageSlot.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/Strings.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol | safe, contract, private key |
| contracts/lib/openzeppelin-contracts/contracts/utils/cryptography/EIP712.sol | safe, contract, signing |
| contracts/lib/openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol | safe, contract, signing |
| contracts/lib/openzeppelin-contracts/contracts/utils/cryptography/SignatureChecker.sol | safe, contract, wallet |
| contracts/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165Checker.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/math/Math.sol | contract, seed |
| contracts/lib/openzeppelin-contracts/contracts/utils/math/SafeCast.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/math/SignedMath.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/structs/BitMaps.sol | contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/structs/Checkpoints.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/structs/DoubleEndedQueue.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/structs/EnumerableMap.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/utils/types/Time.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/contracts/vendor/compound/ICompoundTimelock.sol | contract |
| contracts/lib/openzeppelin-contracts/docs/README.md | contract |
| contracts/lib/openzeppelin-contracts/docs/config.js | contract |
| contracts/lib/openzeppelin-contracts/docs/templates/helpers.js | contract |
| contracts/lib/openzeppelin-contracts/docs/templates/properties.js | contract |
| contracts/lib/openzeppelin-contracts/hardhat.config.js | contract |
| contracts/lib/openzeppelin-contracts/hardhat/env-artifacts.js | contract |
| contracts/lib/openzeppelin-contracts/hardhat/env-contract.js | deploy, contract |
| contracts/lib/openzeppelin-contracts/hardhat/ignore-unreachable-warnings.js | contract |
| contracts/lib/openzeppelin-contracts/hardhat/skip-foundry-tests.js | contract |
| contracts/lib/openzeppelin-contracts/hardhat/task-test-get-files.js | contract |
| contracts/lib/openzeppelin-contracts/lib/erc4626-tests/ERC4626.prop.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/lib/erc4626-tests/ERC4626.test.sol | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/lib/erc4626-tests/README.md | mint, safe, audit, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/README.md | safe, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/lib/ds-test/demo/demo.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/lib/ds-test/package.json | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/lib/ds-test/src/test.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/package.json | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/Base.sol | safe, deploy, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/Script.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/StdAssertions.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/StdChains.sol | safe, contract, seed |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/StdCheats.sol | safe, receipt, deploy, contract, private key, broadcast |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/StdError.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/StdJson.sol | safe, deploy, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/StdMath.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/StdStorage.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/StdUtils.sol | safe, deploy, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/Test.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/Vm.sol | safe, permission, deploy, contract, private key, wallet, broadcast |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/console.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/console2.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/interfaces/IERC1155.sol | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/interfaces/IERC165.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/interfaces/IERC20.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/interfaces/IERC4626.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/src/interfaces/IERC721.sol | safe, receipt, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/StdAssertions.t.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/StdChains.t.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/StdCheats.t.sol | safe, receipt, deploy, contract, signing, broadcast |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/StdError.t.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/StdMath.t.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/StdStorage.t.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/StdUtils.t.sol | deploy, contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/compilation/CompilationScript.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/compilation/CompilationScriptBase.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/compilation/CompilationTest.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/compilation/CompilationTestBase.sol | contract |
| contracts/lib/openzeppelin-contracts/lib/forge-std/test/fixtures/broadcast.log.json | receipt, contract, broadcast |
| contracts/lib/openzeppelin-contracts/package-lock.json | safe, contract, wallet, signing |
| contracts/lib/openzeppelin-contracts/package.json | safe, contract, wallet |
| contracts/lib/openzeppelin-contracts/renovate.json | contract |
| contracts/lib/openzeppelin-contracts/scripts/checks/compare-layout.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/checks/compareGasReports.js | deploy, contract |
| contracts/lib/openzeppelin-contracts/scripts/checks/extract-layout.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/checks/inheritance-ordering.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/gen-nav.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/generate/format-lines.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/generate/run.js | safe, contract |
| contracts/lib/openzeppelin-contracts/scripts/generate/templates/Checkpoints.js | safe, contract |
| contracts/lib/openzeppelin-contracts/scripts/generate/templates/Checkpoints.opts.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/generate/templates/Checkpoints.t.js | safe, contract |
| contracts/lib/openzeppelin-contracts/scripts/generate/templates/EnumerableMap.js | safe, contract |
| contracts/lib/openzeppelin-contracts/scripts/generate/templates/EnumerableSet.js | safe, contract |
| contracts/lib/openzeppelin-contracts/scripts/generate/templates/SafeCast.js | safe, contract |
| contracts/lib/openzeppelin-contracts/scripts/generate/templates/StorageSlot.js | safe, contract |
| contracts/lib/openzeppelin-contracts/scripts/generate/templates/conversion.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/helpers.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/release/format-changelog.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/release/synchronize-versions.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/release/update-comment.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/release/workflow/github-release.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/release/workflow/rerun.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/release/workflow/set-changesets-pr-title.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/release/workflow/state.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/remove-ignored-artifacts.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/solhint-custom/index.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/solhint-custom/package.json | contract |
| contracts/lib/openzeppelin-contracts/scripts/update-docs-branch.js | contract |
| contracts/lib/openzeppelin-contracts/scripts/upgradeable/README.md | contract |
| contracts/lib/openzeppelin-contracts/slither.config.json | contract |
| contracts/lib/openzeppelin-contracts/solhint.config.js | contract |
| contracts/lib/openzeppelin-contracts/test/TESTING.md | contract |
| contracts/lib/openzeppelin-contracts/test/access/AccessControl.behavior.js | mint, receipt, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/access/AccessControl.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/access/Ownable.test.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/access/Ownable2Step.test.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/access/extensions/AccessControlDefaultAdminRules.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/access/extensions/AccessControlEnumerable.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/access/manager/AccessManaged.test.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/access/manager/AccessManager.behavior.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/access/manager/AccessManager.test.js | guardian, receipt, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/access/manager/AuthorityUtils.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/finance/VestingWallet.behavior.js | receipt, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/finance/VestingWallet.test.js | mint, receipt, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/governance/Governor.t.sol | contract |
| contracts/lib/openzeppelin-contracts/test/governance/Governor.test.js | mint, safe, receipt, deploy, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/governance/TimelockController.test.js | mint, safe, receipt, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/governance/extensions/GovernorERC721.test.js | mint, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/governance/extensions/GovernorPreventLateQuorum.test.js | mint, receipt, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/governance/extensions/GovernorStorage.test.js | mint, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/governance/extensions/GovernorTimelockAccess.test.js | mint, guardian, receipt, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/governance/extensions/GovernorTimelockCompound.test.js | mint, safe, receipt, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/governance/extensions/GovernorTimelockControl.test.js | mint, safe, receipt, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/governance/extensions/GovernorVotesQuorumFraction.test.js | mint, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/governance/extensions/GovernorWithParams.test.js | mint, deploy, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/governance/utils/EIP6372.behavior.js | contract |
| contracts/lib/openzeppelin-contracts/test/governance/utils/Votes.behavior.js | mint, receipt, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/governance/utils/Votes.test.js | mint, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/helpers/access-manager.js | guardian, contract |
| contracts/lib/openzeppelin-contracts/test/helpers/account.js | contract |
| contracts/lib/openzeppelin-contracts/test/helpers/chainid.js | contract |
| contracts/lib/openzeppelin-contracts/test/helpers/constants.js | contract |
| contracts/lib/openzeppelin-contracts/test/helpers/create.js | deploy, contract |
| contracts/lib/openzeppelin-contracts/test/helpers/customError.js | contract |
| contracts/lib/openzeppelin-contracts/test/helpers/eip712.js | contract |
| contracts/lib/openzeppelin-contracts/test/helpers/enums.js | contract |
| contracts/lib/openzeppelin-contracts/test/helpers/erc1967.js | contract |
| contracts/lib/openzeppelin-contracts/test/helpers/governance.js | contract |
| contracts/lib/openzeppelin-contracts/test/helpers/iterate.js | contract |
| contracts/lib/openzeppelin-contracts/test/helpers/math.js | contract |
| contracts/lib/openzeppelin-contracts/test/helpers/methods.js | contract |
| contracts/lib/openzeppelin-contracts/test/helpers/sign.js | contract, signing |
| contracts/lib/openzeppelin-contracts/test/helpers/time.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/helpers/txpool.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/metatx/ERC2771Context.test.js | receipt, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/metatx/ERC2771Forwarder.t.sol | contract |
| contracts/lib/openzeppelin-contracts/test/metatx/ERC2771Forwarder.test.js | receipt, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/proxy/Clones.behaviour.js | deploy, contract |
| contracts/lib/openzeppelin-contracts/test/proxy/Clones.test.js | receipt, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/proxy/ERC1967/ERC1967Proxy.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/proxy/ERC1967/ERC1967Utils.test.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/proxy/Proxy.behaviour.js | deploy, contract |
| contracts/lib/openzeppelin-contracts/test/proxy/beacon/BeaconProxy.test.js | deploy, contract |
| contracts/lib/openzeppelin-contracts/test/proxy/beacon/UpgradeableBeacon.test.js | receipt, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/proxy/transparent/ProxyAdmin.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/proxy/transparent/TransparentUpgradeableProxy.behaviour.js | safe, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/proxy/transparent/TransparentUpgradeableProxy.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/proxy/utils/Initializable.test.js | receipt, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/proxy/utils/UUPSUpgradeable.test.js | safe, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC1155/ERC1155.behavior.js | mint, safe, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC1155/ERC1155.test.js | mint, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC1155/extensions/ERC1155Burnable.test.js | mint, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC1155/extensions/ERC1155Pausable.test.js | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC1155/extensions/ERC1155Supply.test.js | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC1155/extensions/ERC1155URIStorage.test.js | mint, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC1155/utils/ERC1155Holder.test.js | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/ERC20.behavior.js | contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/ERC20.test.js | mint, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/extensions/ERC20Burnable.behavior.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/extensions/ERC20Burnable.test.js | mint, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/extensions/ERC20Capped.behavior.js | mint, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/extensions/ERC20Capped.test.js | deploy, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/extensions/ERC20FlashMint.test.js | mint, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/extensions/ERC20Pausable.test.js | mint, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/extensions/ERC20Permit.test.js | mint, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/extensions/ERC20Votes.test.js | mint, safe, receipt, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/extensions/ERC20Wrapper.test.js | mint, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/extensions/ERC4626.t.sol | contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/extensions/ERC4626.test.js | mint, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC20/utils/SafeERC20.test.js | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/ERC721.behavior.js | mint, safe, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/ERC721.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/ERC721Enumerable.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/extensions/ERC721Burnable.test.js | mint, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/extensions/ERC721Consecutive.t.sol | mint, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/extensions/ERC721Consecutive.test.js | mint, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/extensions/ERC721Pausable.test.js | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/extensions/ERC721Royalty.test.js | mint, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/extensions/ERC721URIStorage.test.js | mint, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/extensions/ERC721Votes.test.js | mint, receipt, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/extensions/ERC721Wrapper.test.js | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/test/token/ERC721/utils/ERC721Holder.test.js | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/test/token/common/ERC2981.behavior.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/Address.test.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/utils/Arrays.test.js | safe, contract |
| contracts/lib/openzeppelin-contracts/test/utils/Base64.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/Context.behavior.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/utils/Context.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/Create2.test.js | deploy, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/utils/Multicall.test.js | mint, deploy, contract |
| contracts/lib/openzeppelin-contracts/test/utils/Nonces.test.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/utils/Pausable.test.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/utils/ReentrancyGuard.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/ShortStrings.t.sol | contract |
| contracts/lib/openzeppelin-contracts/test/utils/ShortStrings.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/StorageSlot.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/Strings.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/cryptography/ECDSA.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/cryptography/EIP712.test.js | receipt, deploy, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/utils/cryptography/MerkleProof.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/cryptography/MessageHashUtils.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/cryptography/SignatureChecker.test.js | deploy, contract, wallet |
| contracts/lib/openzeppelin-contracts/test/utils/introspection/ERC165.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/introspection/ERC165Checker.test.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/utils/introspection/SupportsInterface.behavior.js | mint, safe, contract |
| contracts/lib/openzeppelin-contracts/test/utils/math/Math.t.sol | contract |
| contracts/lib/openzeppelin-contracts/test/utils/math/Math.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/math/SafeCast.test.js | safe, contract |
| contracts/lib/openzeppelin-contracts/test/utils/math/SignedMath.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/structs/BitMap.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/structs/Checkpoints.t.sol | safe, contract |
| contracts/lib/openzeppelin-contracts/test/utils/structs/Checkpoints.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/structs/DoubleEndedQueue.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/structs/EnumerableMap.behavior.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/utils/structs/EnumerableMap.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/structs/EnumerableSet.behavior.js | receipt, contract |
| contracts/lib/openzeppelin-contracts/test/utils/structs/EnumerableSet.test.js | contract |
| contracts/lib/openzeppelin-contracts/test/utils/types/Time.test.js | contract |
| contracts/oinio-memorial-bridge/README.md | bridge, deploy, contract |
| contracts/script/BirthGenesisHeartbeat.s.sol | deploy, contract, broadcast |
| contracts/script/Deploy.s.sol | deploy, contract, private key, broadcast |
| contracts/script/DeploySocialRecovery.s.sol | guardian, deploy, contract, broadcast |
| contracts/script/DeployYieldRouter.s.sol | safe, deploy, contract, broadcast |
| contracts/script/RegisterGenesisAgent.s.sol | deploy, contract, broadcast |
| contracts/src/FeeCollector.sol | mint, staking, bridge, guardian, receipt, contract |
| contracts/src/LegacyVault.sol | bridge, contract |
| contracts/src/OINIOModelRegistry.sol | mint, staking, safe, contract |
| contracts/src/OINIOToken.sol | mint, deploy, contract |
| contracts/src/OperationalTreasury.sol | staking, guardian, audit, contract |
| contracts/src/PioneerRewards.sol | mint, contract |
| contracts/src/YieldRouterFactory.sol | guardian, deploy, contract |
| contracts/test/FeeCollector.t.sol | mint, staking, bridge, guardian, contract |
| contracts/test/LegacyVault.t.sol | contract |
| contracts/test/OperationalTreasury.t.sol | guardian, contract |
| contracts/test/PioneerRewards.t.sol | contract |
| contracts/test/YieldRouterFactory.t.sol | guardian, deploy, contract |
| deploy/FORGE_ACTIVATION_GUIDE.md | mint, liquidity, staking, bridge, guardian, audit, deploy, contract |
| deploy/dao.html | bridge, guardian, deploy, contract, wallet, signing, broadcast |
| deploy/deployed-addresses.html | mint, liquidity, staking, bridge, guardian, safe, evidence, receipt |
| deploy/for-builders.html | liquidity, staking, bridge, safe, permission, audit, evidence, receipt |
| deploy/human-onboarding.html | mint, liquidity, staking, bridge, safe, permission, evidence, receipt |
| deploy/index.html | mint, liquidity, staking, bridge, guardian, safe, evidence, deploy |
| deploy/manifest.json | deploy |
| deploy/metadata/qpf-genesis-guardian-model-v1.json | mint, liquidity, staking, bridge, guardian, deploy |
| deploy/onboarding-status.html | mint, liquidity, staking, guardian, safe, audit, evidence, receipt |
| deploy/pre-unpark-handoff.html | evidence, receipt, deploy, private key, broadcast |
| deploy/resonate.html | staking, guardian, deploy, contract, wallet |
| deploy/staking.html | staking, safe, evidence, deploy, contract, wallet, signing |
| deploy/trust/kris-olofson-trust-evidence.json | safe, evidence, deploy, contract, wallet, signing |
| deploy/trust/reviewer-status.html | safe, evidence, receipt, deploy, broadcast |
| deploy/what-it-does.html | evidence, receipt, deploy, contract |
| deploy/why-this-matters.html | liquidity, staking, bridge, safe, evidence, receipt, deploy, contract |
| docs/governance/0G_COMPUTE_INFERENCE_EVIDENCE_DRY_RUN_GATE_V1.md | bridge, safe, evidence, receipt, private key, wallet, signing |
| docs/governance/0G_SKILLS_PREREQ_READINESS_V1.md | liquidity, threat, audit, receipt, deploy, contract, wallet, broadcast |
| docs/governance/ACTIVE_DEVELOPMENT_REOPEN_GATE_V1.md | liquidity, evidence, deploy, contract, wallet, signing |
| docs/governance/AGENT_EARNING_UNGATE_V1.md | mint, liquidity, staking, bridge, evidence, receipt, private key, seed |
| docs/governance/AI_AGENT_FIRST_CLASS_CITIZENSHIP_CHARTER_V1.md | mint, liquidity, staking, bridge, permission, audit, evidence, receipt |
| docs/governance/APPLY_LONE_STEWARD_BRANCH_PROTECTION_V1.md | audit, receipt |
| docs/governance/ASSIGNED_AI_AGENT_REGISTRY_V1.md | mint, liquidity, bridge, guardian, safe, audit, receipt, private key |
| docs/governance/AUDIT_HARDENING_READINESS_V1.md | liquidity, bridge, audit, evidence, receipt, deploy, contract, broadcast |
| docs/governance/AUTONOMY_COMPLETION_AUDITOR_V1.md | liquidity, bridge, audit, evidence, deploy, private key, seed, wallet |
| docs/governance/BOUNDED_ACTIVATION_READINESS_GATE_V1.json | mint, staking, safe, evidence, receipt, deploy, contract, wallet |
| docs/governance/CI_BILLING_LOCK_EXCEPTION_PR467_V1.md | audit, evidence, deploy, wallet, signing, broadcast |
| docs/governance/CROSS_PLATFORM_DETERMINISM_V1.md | audit, receipt, deploy, broadcast |
| docs/governance/CURRENT_FUNDER_AUDIT_HANDOFF_V1.md | safe, audit, evidence, receipt, deploy |
| docs/governance/CURRENT_GOVERNANCE_STATE_V1.md | permission, receipt, deploy, broadcast |
| docs/governance/CURRENT_PUBLIC_STATUS_HANDOFF_V1.md | evidence, receipt, deploy, broadcast |
| docs/governance/CURRENT_SOVEREIGN_STATE_V1.md | safe, receipt, wallet, broadcast |
| docs/governance/DRY_RUN_SIMULATION_RECEIPT_V1.json | mint, receipt, deploy, wallet, signing, broadcast |
| docs/governance/ECONOMIC_SOVEREIGNTY_GATE_V1.md | liquidity, audit, evidence, receipt, wallet |
| docs/governance/EXECUTION_LANE_SEPARATION_GATE_V1.json | mint, evidence, receipt, deploy, contract, private key, wallet, signing |
| docs/governance/EXECUTION_WRAPPER_READINESS_CORRECTIVE_V1.md | liquidity, staking, guardian, safe, audit, evidence, receipt, deploy |
| docs/governance/EXECUTION_WRAPPER_READINESS_TRIAGE_V1.md | liquidity, staking, bridge, guardian, safe, permission, valuation, audit |
| docs/governance/EXTERNAL_ATTESTATION_VERIFIER_V1.md | receipt, deploy, broadcast |
| docs/governance/FINAL_CURRENT_STATE_RECONCILIATION_POST_PR_315_V1.md | receipt, deploy, wallet, signing, broadcast |
| docs/governance/FINAL_PREFLIGHT_CHECKLIST_V1.md | evidence, receipt, deploy, private key, seed, broadcast |
| docs/governance/FOUNDRY_DEPENDENCY_LAYOUT_REPAIR_V1.md | mint, staking, deploy, contract, private key, wallet, signing, broadcast |
| docs/governance/FOUNDRY_LINT_CLEANUP_V1.md | evidence, deploy, contract, private key, wallet, signing, broadcast |
| docs/governance/FRESH_MAINNET_OPERATOR_REAUTHORIZATION_V1.md | deploy, private key, wallet, signing, broadcast |
| docs/governance/FRESH_MAINNET_REAUTHORIZATION_PREP_V1.md | receipt, deploy, wallet, signing, broadcast |
| docs/governance/FULL_LIVE_ROADMAP_V1.md | mint, liquidity, staking, guardian, safe, audit, evidence, receipt |
| docs/governance/FUNDING_CONSTRAINT_RESILIENCE_MODE_V1.md | liquidity, evidence, deploy, wallet, signing |
| docs/governance/GAS_FUNDING_QUANTITY_LIMITS_V1.json | mint, liquidity, receipt, deploy, wallet, signing, broadcast |
| docs/governance/GUARDIAN_AUTHORITY_RECONCILIATION_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_BLANK_SPECIMEN_TEMPLATE_V1.md | mint, liquidity, bridge, guardian, safe, receipt, deploy, contract |
| docs/governance/GUARDIAN_COMPLETION_RECEIPT_FILLING_GUIDE_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_HUMAN_AUTHORIZATION_COMPLETION_RECEIPT_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_HUMAN_AUTHORIZATION_RECEIPT_TEMPLATE_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_HUMAN_INSPECTION_DECISION_RECEIPT_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_HUMAN_SAFE_OPEN_READINESS_GATE_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_PAYLOAD_SPECIMEN_INTAKE_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_POST_SAFE_OPEN_RECEIPT_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_PRE_SIGNATURE_PAYLOAD_AUTHORITY_CHECKLIST_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_RECOVERY_EXECUTION_AUTHORIZATION_BLOCKER_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_SAFE_INSPECTION_COMPLETION_INTAKE_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_SIGNATURE_RECOVERY_COMPLETION_RECEIPT_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_SIGNATURE_RECOVERY_OPERATOR_RUNBOOK_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_SPECIMEN_COMPLETION_RULES_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_SPECIMEN_REJECTION_RULES_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/GUARDIAN_SPECIMEN_REVIEW_DECISION_STATES_V1.md | mint, liquidity, staking, bridge, guardian, safe, deploy, private key |
| docs/governance/HUMAN_CUSTODY_BALANCE_CHARTER_V1.md | mint, liquidity, staking, guardian, safe, receipt, contract, private key |
| docs/governance/HUMAN_OPERATOR_APPROVAL_RECEIPT_V1.json | mint, receipt, deploy, wallet, signing, broadcast |
| docs/governance/HUMAN_SUSTENANCE_FIRST_V1.md | mint, liquidity, staking, guardian, safe, receipt, private key, seed |
| docs/governance/IRREVERSIBLE_ZONE_REVIEW_V1.json | mint, liquidity, receipt, deploy, private key, wallet, signing, broadcast |
| docs/governance/LIVE_ACTIVATION_GATE_V1.md | liquidity, safe, evidence, receipt, deploy, wallet, signing |
| docs/governance/LIVE_CANARY_GATE_V1.md | liquidity, staking, deploy, contract, private key, wallet, broadcast |
| docs/governance/LOCAL_AUTONOMOUS_WORKFLOW_SUPERVISOR_V1.md | liquidity, bridge, safe, evidence, receipt, deploy, contract, private key |
| docs/governance/LONE_STEWARD_GOVERNANCE_BASELINE_V1.md | safe, receipt |
| docs/governance/MAINNET_ACTIVATION_COMMAND_HASH_READINESS_V1.md | evidence, receipt, deploy, contract, wallet, signing, broadcast |
| docs/governance/MAINNET_ACTIVATION_PREFLIGHT_V1.md | receipt, deploy, contract, wallet, broadcast |
| docs/governance/MAINNET_EXECUTION_RESULT_V1.md | receipt |
| docs/governance/MAINNET_EXECUTION_WINDOW_V1.md | receipt |
| docs/governance/MAINNET_FINALIZATION_GATE_V1.md | mint, liquidity, staking, guardian, safe, evidence, receipt, deploy |
| docs/governance/MAINNET_FINAL_COMMAND_SELECTION_V1.md | mint, staking, receipt, deploy, signing, broadcast |
| docs/governance/MAINNET_FINAL_STATE_SEAL_V1.md | evidence |
| docs/governance/MAINNET_OPERATOR_APPROVAL_PREPARATION_V1.md | receipt, deploy, wallet, signing, broadcast |
| docs/governance/MAINNET_OPERATOR_APPROVAL_V1.md | receipt |
| docs/governance/NAMED_ACTIVATION_ACTION_PLAN_V1.json | mint, liquidity, staking, receipt, deploy, contract, private key, wallet |
| docs/governance/NPM_AUDIT_HARDENING_EVIDENCE_V1.md | safe, audit, evidence, receipt, deploy, broadcast |
| docs/governance/OPEN_VERIFICATION_GATE_V1.md | permission, receipt, deploy, broadcast |
| docs/governance/OPEN_VERIFICATION_GATE_V1_POST_MERGE.md | permission, receipt, deploy, broadcast |
| docs/governance/OPERATIONAL_ACTIVATION_GATE_V1.md | liquidity, safe, audit, evidence, receipt, deploy, wallet, broadcast |
| docs/governance/POST_FAILURE_REPAIR_READINESS_V1.md | evidence, receipt, deploy, contract, private key, wallet, signing, broadcast |
| docs/governance/POST_GUARDIAN_NO_ADVANCE_LOCK_V1.md | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_205.md | receipt |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_207.md | receipt, deploy |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_209_211.md | safe, receipt, deploy, wallet |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_213.md | receipt, deploy, wallet |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_215.md | safe, evidence, receipt, wallet |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_218.md | safe, evidence, receipt, wallet |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_220.md | safe, evidence, receipt, wallet |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_222.md | safe, evidence, receipt, wallet |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_224.md | safe, evidence, receipt, wallet |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_226.md | safe, evidence, receipt, wallet |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_228.md | receipt, broadcast |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_231.md | evidence, receipt, broadcast |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_247.md | receipt, deploy, contract, broadcast |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_249.md | safe, receipt, deploy, broadcast |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_251.md | audit, evidence, receipt, deploy, broadcast |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md | audit, receipt, deploy, broadcast |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_256.md | audit, receipt, deploy, broadcast |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_258.md | receipt, deploy, broadcast |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_292.md | receipt, deploy, broadcast |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_294.md | liquidity, staking, receipt, deploy, wallet, signing, broadcast |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_296.md | liquidity, staking, receipt, deploy, wallet, signing, broadcast |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_298.md | evidence, receipt |
| docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_V1.md | safe, receipt |
| docs/governance/POST_PR_318_OBSERVER_READINESS_RECEIPT_V1.md | evidence, receipt, deploy, wallet, signing, broadcast |
| docs/governance/PRE_CUTOVER_EXIT_CRITERION_CHECKPOINT_V1.md | audit, receipt, deploy, contract, broadcast |
| docs/governance/PRE_CUTOVER_REVIEW_WINDOW_V1.md | audit, receipt, deploy, contract, broadcast |
| docs/governance/PRE_UNPARK_READINESS_CANDIDATE_CLOSURE_V1.md | deploy, broadcast |
| docs/governance/PR_186_SELFHOSTED_MERGE_BOUNDARY_V1.md | evidence, receipt |
| docs/governance/PR_188_AUTONOMOUS_READINESS_MERGE_BOUNDARY_V1.md | receipt |
| docs/governance/PR_243_POST_MERGE_GOVERNANCE_RECEIPT_V1.md | receipt, deploy, broadcast |
| docs/governance/PR_251_HOSTED_CI_FAILURE_OPACITY_BOUNDARY_V1.md | audit, receipt, deploy, broadcast |
| docs/governance/PR_260_POST_MERGE_GOVERNANCE_RECEIPT_V1.md | audit, receipt, deploy, broadcast |
| docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md | receipt, deploy, contract, broadcast |
| docs/governance/PR_285_POST_MERGE_GOVERNANCE_RECEIPT_V1.md | receipt, deploy, broadcast |
| docs/governance/PR_287_POST_MERGE_GOVERNANCE_RECEIPT_V1.md | receipt, deploy, broadcast |
| docs/governance/PR_289_POST_MERGE_GOVERNANCE_RECEIPT_V1.md | receipt, deploy, broadcast |
| docs/governance/PR_291_POST_MERGE_GOVERNANCE_RECEIPT_V1.md | receipt, deploy, broadcast |
| docs/governance/PR_298_EXECUTION_WRAPPER_FAILED_ATTEMPT_REVIEW_V1.md | deploy, broadcast |
| docs/governance/PR_300_POST_MERGE_GOVERNANCE_RECEIPT_V1.md | liquidity, staking, guardian, safe, audit, evidence, receipt, deploy |
| docs/governance/PR_302_POST_MERGE_GOVERNANCE_RECEIPT_V1.md | liquidity, staking, guardian, safe, audit, evidence, receipt, deploy |
| docs/governance/PR_304_POST_MERGE_GOVERNANCE_RECEIPT_V1.md | liquidity, staking, bridge, guardian, safe, permission, audit, evidence |
| docs/governance/PR_312_POST_MERGE_OBSERVER_REPAIR_RECEIPT_V1.md | evidence, receipt, deploy, broadcast |
| docs/governance/PUBLIC_MINT_POLICY_FINAL_V1.md | mint, guardian, safe, receipt, contract, seed, wallet |
| docs/governance/PUBLIC_REVIEWER_STATUS_ROUTE_V1.md | evidence, receipt, deploy |
| docs/governance/PUBLIC_SURFACE_POST_PR_314_VERIFICATION_V1.md | evidence, receipt, deploy, broadcast |
| docs/governance/PUBLIC_VALIDATION_STATUS_V1.md | liquidity, staking, bridge, safe, evidence, receipt, deploy, contract |
| docs/governance/QPF_CONSTITUTIONAL_CLOSURE_V1.md | mint, liquidity, staking, bridge, guardian, safe, permission, receipt |
| docs/governance/REVIEWER_ATTESTATION_INTAKE_V1.md | audit, receipt, deploy, contract, broadcast |
| docs/governance/REVIEWER_PRIORITY_GRANT_APPROVAL_GATE_V1.md | mint, liquidity, staking, evidence, receipt, deploy, contract, seed |
| docs/governance/REVIEWER_STATUS_CONSOLIDATION_V1.md | safe, audit, evidence, receipt, deploy, broadcast |
| docs/governance/RUNTIME_ACTIVATION_STACK_STATUS_V1.md | signing, broadcast |
| docs/governance/SECURITY_POSTURE_ROLLUP_V1.md | bridge, contract, signing, broadcast |
| docs/governance/STALE_OPENZEPPELIN_SUBMODULE_PATH_REPAIR_V1.md | evidence, deploy, contract, wallet, signing, broadcast |
| docs/governance/STEWARD_PROOF_DECLARATION_V1.md | permission, evidence, receipt, deploy, broadcast |
| docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_1_EVIDENCE_V1.md | safe, evidence, receipt, wallet |
| docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_2_EVIDENCE_V1.md | safe, evidence, receipt |
| docs/governance/SUPERVISED_ACTIVATION_DRY_RUN_3_EVIDENCE_V1.md | safe, evidence, receipt, private key, wallet |
| docs/governance/SUPERVISED_ACTIVATION_V1_MILESTONE_SNAPSHOT.md | evidence, receipt, broadcast |
| docs/governance/SUPERVISED_EXECUTION_GATE_V1.json | mint, receipt, deploy, wallet, signing, broadcast |
| docs/governance/SUSTAINABILITY_READINESS_GATE_V1.md | liquidity, deploy, wallet, signing |
| docs/governance/V1_LIFECYCLE_CLOSURE_NOTICE.md | audit, evidence, deploy |
| docs/governance/V2_CUTOVER_EXECUTION_COMMAND_HASH_V1.md | liquidity, staking, receipt, deploy, wallet, signing, broadcast |
| docs/governance/V2_FINAL_OPERATOR_UNPARK_APPROVAL_RECEIPT_V1.md | liquidity, staking, receipt, deploy, wallet, signing, broadcast |
| docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md | safe, audit, evidence, receipt, deploy, broadcast |
| docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md | safe, audit, evidence, receipt, deploy, contract, broadcast |
| docs/governance/V2_GOVERNANCE_RECEIPT_CHAIN_INDEX_V1.md | receipt |
| docs/governance/V2_LIVE_CUTOVER_BODY_IMPLEMENTATION_PLAN_V1.md | bridge, safe, receipt, deploy, contract, broadcast |
| docs/governance/V2_MAINNET_CUTOVER_EXECUTION_V1.md | liquidity, staking, evidence, receipt, deploy, wallet, signing, broadcast |
| docs/governance/V2_OPERATOR_UNPARK_APPROVAL_CANDIDATE_V1.md | receipt, deploy, broadcast |
| docs/governance/V2_PRE_UNPARK_READINESS_GATE_V1.md | evidence, receipt, deploy, broadcast |
| docs/governance/V2_PUBLIC_FUNDER_PACKET_INDEX_V1.md | audit, evidence, receipt, deploy, broadcast |
| docs/governance/V2_SCOPE_DEFINITION.md | valuation, audit, evidence, receipt, deploy, contract, broadcast |
| docs/governance/V2_SEALED_CUTOVER_COMMAND_IMPLEMENTATION_REPAIR_V1.md | receipt, deploy, wallet, signing, broadcast |
| docs/governance/WALLET_ONBOARDING_POLICY_V1.md | mint, liquidity, staking, bridge, guardian, safe, permission, evidence |
| docs/valuation/QPF_AUDIT_READINESS_LIVE_EVIDENCE_ADDENDUM_V1.md | mint, liquidity, staking, bridge, guardian, safe, valuation, audit |
| docs/valuation/QPF_AUDIT_READINESS_PACKAGE_V1.md | mint, liquidity, staking, bridge, guardian, safe, permission, valuation |
| docs/valuation/QPF_AUDIT_READINESS_PERMISSION_MAP_THREAT_MODEL_V1.md | mint, liquidity, staking, bridge, guardian, safe, permission, threat |
| docs/valuation/QPF_EXTERNAL_VALUATION_SUMMARY_V1.md | mint, liquidity, staking, bridge, guardian, safe, permission, threat |
| docs/valuation/QPF_FMV_BASELINE_MEMO_V1.md | guardian, valuation, audit, evidence, receipt, deploy |
| docs/valuation/QPF_IP_ASSET_REGISTER_V1.md | mint, liquidity, staking, bridge, guardian, valuation, evidence, receipt |
| docs/valuation/QPF_PARTNER_AUDITOR_DILIGENCE_INDEX_V1.md | mint, liquidity, staking, bridge, guardian, safe, permission, threat |
| docs/valuation/QPF_SELF_SUSTAINING_VALUE_FLYWHEEL_V1.md | mint, liquidity, staking, bridge, guardian, safe, permission, threat |
| docs/valuation/QPF_VALUE_METRICS_DASHBOARD_V1.md | mint, liquidity, staking, bridge, safe, permission, threat, valuation |
| mint-status.html | mint, safe, contract, private key, seed |
| mint.html | mint, safe, contract, private key, seed, wallet |
| receipts/governance/0g-skills-prereq-readiness-v1.json | liquidity, threat, audit, receipt, contract, wallet |
| receipts/governance/activation-completion-status-f83c652-v1.json | evidence, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/active-development-reopen-gate-v1.json | liquidity, receipt, wallet |
| receipts/governance/agent-earning-ungate-v1.json | liquidity, staking, receipt, wallet, signing, broadcast |
| receipts/governance/ai-agent-first-class-citizenship-charter-v1.json | liquidity, staking, permission, audit, receipt, wallet, signing, broadcast |
| receipts/governance/ai-inner-docs-improvement-lane-closure-v1.json | mint, liquidity, staking, guardian, safe, audit, evidence, receipt |
| receipts/governance/ai-inner-docs-improvement-lane-v1.json | mint, liquidity, staking, guardian, safe, receipt, deploy, wallet |
| receipts/governance/apply-lone-steward-branch-protection-v1.json | receipt |
| receipts/governance/assigned-ai-agent-registry-v1.json | receipt, wallet, signing, broadcast |
| receipts/governance/audit-hardening-readiness-v1.json | audit, receipt, deploy, broadcast |
| receipts/governance/autonomy-completion-auditor-v1.json | audit, receipt, wallet, signing |
| receipts/governance/bounded-activation-readiness-gate-v1.json | mint, guardian, safe, evidence, receipt, deploy, contract, wallet |
| receipts/governance/bridge-policy-readiness-v1.json | mint, liquidity, bridge, safe, receipt, deploy, contract |
| receipts/governance/ci-billing-lock-exception-pr467-v1.json | audit, evidence, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/cloudflare-pages-public-surface-audit-v1.json | mint, staking, safe, audit, evidence, receipt, deploy, wallet |
| receipts/governance/controlled-mint-approval-and-stake-risk-v1.json | mint, guardian, safe, receipt, contract, private key, wallet |
| receipts/governance/cross-platform-determinism-manifest-v1.json | liquidity, staking, bridge, guardian, safe, audit, evidence, receipt |
| receipts/governance/cross-platform-determinism-v1.json | audit, evidence, receipt, deploy, broadcast |
| receipts/governance/current-funder-audit-handoff-v1.json | audit, evidence, receipt, deploy |
| receipts/governance/current-governance-state-v1.json | receipt, deploy, broadcast |
| receipts/governance/current-public-status-handoff-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/current-sovereign-state-v1.json | safe, receipt, wallet |
| receipts/governance/current-vs-historical-activation-status-index-v1.json | staking, guardian, safe, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/dry-run-simulation-v1.json | mint, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/earnings-layer-absence-audit-v1.json | mint, staking, bridge, audit, receipt, deploy, contract, wallet |
| receipts/governance/economic-sovereignty-gate-v1.json | liquidity, receipt, wallet |
| receipts/governance/exact-supervised-activation-command-hash-v1/receipt.json | mint, evidence, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/execution-lane-separation-gate-v1.json | mint, guardian, safe, audit, evidence, receipt, deploy, contract |
| receipts/governance/execution-wrapper-readiness-corrective-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/execution-wrapper-readiness-triage-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/external-attestation-verifier-v1.json | receipt, deploy, broadcast |
| receipts/governance/external-guardian-assistance-required-v1.json | mint, guardian, safe, receipt, deploy |
| receipts/governance/final-current-state-reconciliation-post-pr-315-v1.json | liquidity, staking, evidence, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/final-preflight-checklist-v1.json | receipt |
| receipts/governance/final-readiness-sweep-4584019-v1.json | audit, evidence, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/final-supervised-activation-preflight-v1/receipt.json | mint, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/first-external-human-wallet-onboarding-v1.json | mint, liquidity, staking, bridge, guardian, safe, permission, evidence |
| receipts/governance/foundry-dependency-layout-repair-v1.json | receipt, deploy, contract, wallet, signing, broadcast |
| receipts/governance/foundry-lint-cleanup-v1.json | evidence, receipt, deploy, contract, wallet, signing, broadcast |
| receipts/governance/foundry-lint-note-cleanup-v2.json | audit, evidence, receipt, deploy, contract, wallet, signing, broadcast |
| receipts/governance/fresh-mainnet-operator-reauthorization-v1.json | receipt, deploy, private key, wallet, signing, broadcast |
| receipts/governance/fresh-mainnet-reauthorization-prep-v1.json | receipt, deploy, wallet, signing, broadcast |
| receipts/governance/funding-constraint-resilience-mode-v1.json | liquidity, bridge, evidence, receipt, deploy, seed, wallet, signing |
| receipts/governance/gas-funding-quantity-limits-v1.json | mint, liquidity, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/guardian-authority-reconciliation-precheck-v1.json | mint, liquidity, bridge, guardian, safe, valuation, audit, evidence |
| receipts/governance/guardian-authority-reconciliation-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-blank-specimen-template-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-completion-acceptance-v1.json | mint, liquidity, staking, guardian, safe, evidence, receipt, deploy |
| receipts/governance/guardian-completion-receipt-filling-guide-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-controlled-mint-authorization-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-governance-readiness-v1.json | mint, liquidity, staking, guardian, safe, receipt, contract |
| receipts/governance/guardian-human-authorization-completion-receipt-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-human-authorization-receipt-template-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-human-inspection-decision-receipt-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-human-safe-open-readiness-gate-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-payload-specimen-intake-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-post-safe-open-receipt-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-pre-signature-payload-authority-checklist-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-recovery-execution-authorization-blocker-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-safe-inspection-completion-intake-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-signature-recovery-completion-receipt-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-signature-recovery-operator-runbook-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-signature-recovery-required-v1.json | mint, guardian, safe, receipt, deploy, signing |
| receipts/governance/guardian-specimen-completion-rules-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-specimen-rejection-rules-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-specimen-review-decision-states-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/guardian-ux-recovery-redesign-required-v1.json | mint, guardian, safe, receipt, deploy, signing |
| receipts/governance/human-approval-checkpoint-phase-7-v1.json | mint, liquidity, staking, receipt, contract, wallet |
| receipts/governance/human-balance-activation-v1.json | liquidity, guardian, safe, audit, evidence, receipt, deploy, contract |
| receipts/governance/human-balance-map-v1.json | liquidity, guardian, safe, audit, evidence, receipt, deploy, contract |
| receipts/governance/human-custody-balance-charter-v1.json | receipt, wallet, signing, broadcast |
| receipts/governance/human-onboarding-public-explanation-v1-closure.json | mint, liquidity, staking, bridge, safe, permission, receipt, seed |
| receipts/governance/human-operator-approval-v1.json | mint, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/human-sustenance-first-v1.json | receipt, wallet, signing, broadcast |
| receipts/governance/irreversible-zone-review-v1.json | mint, guardian, safe, audit, evidence, receipt, deploy, contract |
| receipts/governance/liquidity-approval-command-hash-blocked-v1.json | liquidity, receipt, private key, broadcast |
| receipts/governance/liquidity-funding-plan-v1.json | liquidity, receipt, private key, broadcast |
| receipts/governance/liquidity-policy-readiness-v1.json | liquidity, guardian, safe, receipt, wallet |
| receipts/governance/liquidity-readiness-preflight-v1.json | liquidity, bridge, receipt, broadcast |
| receipts/governance/live-activation-gate-v1.json | liquidity, receipt, deploy, wallet, signing |
| receipts/governance/local-ai-agent-runtime-inventory-v1.json | mint, liquidity, staking, guardian, safe, receipt, deploy, wallet |
| receipts/governance/local-autonomous-worker-loop-v1.json | liquidity, bridge, receipt, deploy, seed, wallet, signing |
| receipts/governance/local-autonomous-workflow-supervisor-v1.json | liquidity, bridge, evidence, receipt, deploy, seed, wallet, signing |
| receipts/governance/lone-steward-governance-baseline-v1.json | receipt |
| receipts/governance/main-protection-after-pr-188-corrected-merge.json | receipt |
| receipts/governance/main-protection-before-pr-188-corrected-merge.json | receipt |
| receipts/governance/mainnet-activation-command-hash-readiness-v1.json | receipt, deploy, signing, broadcast |
| receipts/governance/mainnet-activation-preflight-v1.json | receipt, deploy, wallet, broadcast |
| receipts/governance/mainnet-execution-result-v1.json | evidence, receipt |
| receipts/governance/mainnet-execution-window-v1.json | receipt, deploy, broadcast |
| receipts/governance/mainnet-final-command-selection-v1.json | receipt, deploy, broadcast |
| receipts/governance/mainnet-final-state-seal-v1.json | receipt |
| receipts/governance/mainnet-operator-approval-preparation-v1.json | receipt, deploy, signing, broadcast |
| receipts/governance/mainnet-operator-approval-v1.json | receipt, deploy, broadcast |
| receipts/governance/manual-custody-and-nested-safe-execution-model-v1.json | mint, liquidity, staking, safe, evidence, receipt, deploy, contract |
| receipts/governance/named-activation-action-plan-v1.json | mint, guardian, safe, audit, evidence, receipt, deploy, contract |
| receipts/governance/npm-audit-hardening-evidence-v1.json | audit, evidence, receipt, deploy, broadcast |
| receipts/governance/official-0g-building-docs-reference-v1.json | mint, liquidity, staking, guardian, safe, receipt, deploy, wallet |
| receipts/governance/oinio-model-registry-classification-v1.md | mint, staking, safe, audit, evidence, receipt, deploy, contract |
| receipts/governance/oinio-personal-support-wallet-onboarding-v1.json | liquidity, safe, permission, evidence, receipt, seed, wallet |
| receipts/governance/oinio-wallet-onboarding-status-index-v1.json | liquidity, permission, evidence, receipt, wallet |
| receipts/governance/open-verification-gate-v1-post-merge.json | receipt, deploy, broadcast |
| receipts/governance/open-verification-gate-v1.json | receipt, deploy, broadcast |
| receipts/governance/operator-truth-snapshot-440a928-v1.json | liquidity, staking, bridge, safe, evidence, receipt, wallet, signing |
| receipts/governance/original-task-completion-and-phase-19-gate-v1.json | mint, liquidity, staking, bridge, evidence, receipt, wallet, signing |
| receipts/governance/phase-13-controlled-mint-authorization-request-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, wallet |
| receipts/governance/phase-13-controlled-mint-final-authorization-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, contract |
| receipts/governance/phase-13-controlled-mint-human-decisions-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/phase-13-controlled-mint-parameter-candidate-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, wallet |
| receipts/governance/phase-14-public-mint-readiness-reconciliation-v1.json | mint, liquidity, staking, bridge, receipt, wallet |
| receipts/governance/phase-19-public-activation-decision-outcome-v1.json | mint, liquidity, staking, bridge, receipt, wallet, signing, broadcast |
| receipts/governance/phase-20-public-mint-additional-review-checklist-v1.json | mint, liquidity, staking, bridge, evidence, receipt, wallet, signing |
| receipts/governance/phase-20-public-mint-review-outcome-v1.json | mint, liquidity, staking, bridge, receipt, wallet, signing, broadcast |
| receipts/governance/phase-22-public-mint-surface-alignment-v1.json | mint, liquidity, staking, bridge, receipt, wallet, signing, broadcast |
| receipts/governance/phase-23-public-mint-human-authorization-v1.json | mint, liquidity, staking, bridge, receipt, seed, wallet, signing |
| receipts/governance/phase-24-roadmap-reconciliation-closure-v1.json | mint, liquidity, staking, bridge, receipt, seed, wallet, signing |
| receipts/governance/phase-24-roadmap-reconciliation-preflight-v1.json | mint, liquidity, staking, bridge, receipt, signing, broadcast |
| receipts/governance/phase-25-public-mint-execution-preflight-v1.json | mint, liquidity, staking, bridge, safe, receipt, deploy, contract |
| receipts/governance/phase-26-public-mint-execution-path-design-v1.json | mint, liquidity, staking, bridge, receipt, contract, private key, seed |
| receipts/governance/phase-27-public-mint-execution-script-review-findings-v1.json | mint, liquidity, staking, bridge, safe, receipt, deploy, contract |
| receipts/governance/phase-27-public-mint-execution-script-review-v1.json | mint, liquidity, staking, bridge, safe, receipt, contract, seed |
| receipts/governance/phase-28-final-public-mint-execution-decision-gate-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/phase-29-public-mint-execution-path-completion-plan-v1.json | mint, liquidity, staking, bridge, safe, receipt, contract, seed |
| receipts/governance/phase-29-public-mint-execution-path-completion-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/phase-30-public-mint-final-execution-review-reopen-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/phase-31-human-wallet-prompt-inspection-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/phase-32-explicit-human-signing-approval-gate-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/phase-32-human-signing-approval-v1.json | mint, liquidity, staking, bridge, receipt, seed, wallet, signing |
| receipts/governance/phase-33-execution-authorization-retry-gate-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/phase-33-public-mint-execution-gate-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/phase-33-public-mint-execution-no-go-v1.json | mint, receipt, wallet, signing, broadcast |
| receipts/governance/phase-34-public-mint-execution-preparation-lane-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/phase-35-final-reviewed-values-human-confirmation-gate-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/phase-35-final-reviewed-values-human-confirmation-v1.json | mint, liquidity, staking, bridge, receipt, seed, wallet, signing |
| receipts/governance/phase-7-ai-docs-master-status-v1.json | mint, liquidity, staking, guardian, safe, receipt, deploy, wallet |
| receipts/governance/phase-7-authorization-proposal-v1.json | mint, liquidity, staking, guardian, safe, evidence, receipt, deploy |
| receipts/governance/phase-7-deploy-yield-router-script-created-v1.json | safe, receipt, deploy, contract, wallet, signing, broadcast |
| receipts/governance/phase-7-guardian-address-intake-v1.json | mint, liquidity, staking, guardian, safe, receipt, deploy, contract |
| receipts/governance/phase-7-pre-execution-validation-v1.json | guardian, safe, evidence, receipt, deploy, contract, wallet, signing |
| receipts/governance/phase-7-yield-routing-post-execution-correction-v1.json | safe, receipt, deploy, contract, wallet, signing, broadcast |
| receipts/governance/phase-7-yield-routing-post-execution-v1.json | safe, receipt, deploy, contract, broadcast |
| receipts/governance/phase-8-human-onboarding-main-closure-v1.json | mint, receipt, deploy, wallet |
| receipts/governance/phase-8-opening-receipt-v1.json | mint, liquidity, staking, bridge, safe, evidence, receipt, deploy |
| receipts/governance/post-failure-repair-readiness-v1.json | receipt, deploy, wallet, signing, broadcast |
| receipts/governance/post-foundry-lint-clean-main-seal-v1.json | audit, evidence, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/post-guardian-no-advance-lock-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/post-mainnet-activation-closure-v1.json | safe, evidence, receipt, deploy, contract, seed |
| receipts/governance/post-merge-governance-receipt-v1.json | receipt |
| receipts/governance/post-pr-318-observer-readiness-receipt-v1.json | receipt, deploy, wallet, signing, broadcast |
| receipts/governance/post-pr-477-main-state-closure-v1.json | mint, staking, safe, evidence, receipt, deploy, wallet, signing |
| receipts/governance/post-pr-480-main-state-closure-v1.json | mint, staking, safe, audit, evidence, receipt, deploy, wallet |
| receipts/governance/post-pr-482-main-state-closure-v1.json | mint, staking, safe, audit, evidence, receipt, deploy, wallet |
| receipts/governance/post-pr-484-main-state-closure-v1.json | mint, staking, safe, audit, evidence, receipt, deploy, wallet |
| receipts/governance/post-pr-486-main-state-closure-v1.json | mint, staking, safe, audit, evidence, receipt, deploy, wallet |
| receipts/governance/post-pr-488-main-state-closure-v1.json | evidence, receipt, deploy, contract |
| receipts/governance/post-pr-492-public-site-404-sweep-closure-v1.json | evidence, receipt, wallet, signing, broadcast |
| receipts/governance/post-pr-494-0g-skill-reference-closure-v1.json | evidence, receipt, wallet, signing, broadcast |
| receipts/governance/post-pr-497-earnings-audit-closure-v1.json | mint, audit, evidence, receipt, wallet, signing, broadcast |
| receipts/governance/post-pr-499-yield-routing-readiness-closure-v1.json | mint, liquidity, staking, evidence, receipt, deploy, wallet, signing |
| receipts/governance/post-pr-501-evidence-spec-closure-v1.json | mint, liquidity, staking, evidence, receipt, deploy, wallet, signing |
| receipts/governance/post-pr-503-contract-design-closure-v1.json | mint, liquidity, staking, evidence, receipt, deploy, contract, wallet |
| receipts/governance/post-pr-505-test-spec-closure-v1.json | mint, liquidity, staking, evidence, receipt, deploy, contract, wallet |
| receipts/governance/post-pr-506-pre-deployment-gate-closure-v1.json | mint, liquidity, staking, evidence, receipt, deploy, wallet, signing |
| receipts/governance/post-pr-509-foundry-remapping-registry-test-closure-v1.md | mint, liquidity, staking, evidence, receipt, deploy, contract, wallet |
| receipts/governance/post-pr467-main-seal-v1.json | evidence, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/post-soul-core-undici-repair-main-seal-v1.json | audit, evidence, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/post-wrangler-security-main-seal-v1.json | audit, evidence, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/pr-186-selfhosted-merge-boundary-v1.json | receipt |
| receipts/governance/pr-188-autonomous-readiness-merge-boundary-v1.json | receipt |
| receipts/governance/pr-205-post-merge-governance-receipt-v1.json | receipt |
| receipts/governance/pr-207-post-merge-governance-receipt-v1.json | receipt, deploy |
| receipts/governance/pr-209-211-post-merge-governance-receipt-v1.json | safe, receipt, deploy, wallet |
| receipts/governance/pr-213-post-merge-governance-receipt-v1.json | receipt, deploy, wallet |
| receipts/governance/pr-215-post-merge-governance-receipt-v1.json | receipt, wallet |
| receipts/governance/pr-218-post-merge-governance-receipt-v1.json | evidence, receipt, wallet |
| receipts/governance/pr-220-post-merge-governance-receipt-v1.json | evidence, receipt, wallet |
| receipts/governance/pr-222-post-merge-governance-receipt-v1.json | evidence, receipt, wallet |
| receipts/governance/pr-224-post-merge-governance-receipt-v1.json | evidence, receipt, wallet |
| receipts/governance/pr-226-post-merge-governance-receipt-v1.json | evidence, receipt, wallet |
| receipts/governance/pr-228-post-merge-governance-receipt-v1.json | receipt |
| receipts/governance/pr-231-post-merge-governance-receipt-v1.json | evidence, receipt, broadcast |
| receipts/governance/pr-243-post-merge-governance-receipt-v1.json | receipt, deploy, broadcast |
| receipts/governance/pr-247-post-merge-governance-receipt-v1.json | receipt, deploy, broadcast |
| receipts/governance/pr-249-post-merge-governance-receipt-v1.json | receipt, deploy, broadcast |
| receipts/governance/pr-251-hosted-ci-failure-opacity-boundary-v1.json | audit, receipt, deploy, broadcast |
| receipts/governance/pr-251-post-merge-governance-receipt-v1.json | audit, receipt, deploy, broadcast |
| receipts/governance/pr-253-post-merge-governance-receipt-v1.json | audit, receipt, deploy, broadcast |
| receipts/governance/pr-256-post-merge-governance-receipt-v1.json | audit, receipt, deploy, broadcast |
| receipts/governance/pr-258-post-merge-governance-receipt-v1.json | receipt, deploy, broadcast |
| receipts/governance/pr-260-post-merge-governance-receipt-v1.json | audit, receipt, deploy, broadcast |
| receipts/governance/pr-283-post-merge-governance-receipt-v1.json | receipt, deploy, broadcast |
| receipts/governance/pr-285-post-merge-governance-receipt-v1.json | receipt, deploy, broadcast |
| receipts/governance/pr-287-post-merge-governance-receipt-v1.json | receipt, deploy, broadcast |
| receipts/governance/pr-289-post-merge-governance-receipt-v1.json | receipt, deploy, broadcast |
| receipts/governance/pr-291-post-merge-governance-receipt-v1.json | receipt, deploy, broadcast |
| receipts/governance/pr-292-post-merge-governance-receipt-v1.json | receipt, deploy, broadcast |
| receipts/governance/pr-294-post-merge-governance-receipt-v1.json | liquidity, staking, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/pr-296-post-merge-governance-receipt-v1.json | liquidity, staking, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/pr-298-execution-wrapper-failed-attempt-review-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/pr-298-post-merge-governance-receipt-v1.json | evidence, receipt |
| receipts/governance/pr-300-post-merge-governance-receipt-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/pr-302-post-merge-governance-receipt-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/pr-304-post-merge-governance-receipt-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/pr-312-post-merge-observer-repair-receipt-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/pr-319-fresh-observer-receipt-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/pr-325-post-merge-governance-receipt-v1.json | safe, audit, evidence, receipt, deploy |
| receipts/governance/pr-333-post-merge-press-agent-local-runtime-health-v2.json | evidence, receipt, deploy |
| receipts/governance/pr-335-post-merge-parked-broadcast-guard-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/pr-451-post-merge-closure-v1-20260621T172800Z.json | mint, evidence, receipt, deploy, wallet, broadcast |
| receipts/governance/pr-454-post-merge-closure-v1/receipt.json | mint, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/pr-488-local-verification-ci-unavailable-v1.json | safe, evidence, receipt, deploy, contract, seed |
| receipts/governance/pr-514-public-onboarding-post-merge-closure-v1.json | mint, liquidity, staking, guardian, safe, evidence, receipt, deploy |
| receipts/governance/pr-516-phase-7-post-merge-closure-v1.json | mint, liquidity, staking, bridge, guardian, safe, evidence, receipt |
| receipts/governance/pr-521-remote-execution-quarantine-closure-v1.json | mint, liquidity, staking, bridge, safe, evidence, receipt, deploy |
| receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json | audit, receipt, deploy, contract, broadcast |
| receipts/governance/pre-unpark-readiness-candidate-closure-v1.json | receipt, deploy, broadcast |
| receipts/governance/project-erc721-surface-audit-v1.json | mint, safe, audit, receipt, contract |
| receipts/governance/public-first-dex-pair-comms-v1.json | liquidity, receipt, private key, broadcast |
| receipts/governance/public-first-dex-pair-handoff-v1.json | liquidity, receipt, broadcast |
| receipts/governance/public-mint-authorization-final-v1.json | mint, liquidity, staking, bridge, evidence, receipt, seed, wallet |
| receipts/governance/public-mint-authorization-v1.json | mint, guardian, safe, receipt, contract, wallet |
| receipts/governance/public-mint-dry-run-execution-preview-v1.json | mint, liquidity, staking, bridge, receipt, contract, private key, seed |
| receipts/governance/public-mint-execution-approval-request-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/public-mint-execution-authorization-retry-request-v1.json | mint, liquidity, staking, bridge, receipt, contract, private key, seed |
| receipts/governance/public-mint-execution-path-spec-v1.json | mint, liquidity, staking, bridge, receipt, contract, private key, seed |
| receipts/governance/public-mint-final-reviewed-values-confirmation-request-v1.json | mint, liquidity, staking, bridge, receipt, contract, private key, seed |
| receipts/governance/public-mint-final-reviewed-values-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/public-mint-human-signing-approval-request-v1.json | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| receipts/governance/public-mint-open-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, contract |
| receipts/governance/public-mint-policy-final-v1.json | mint, guardian, safe, receipt, contract, seed, wallet |
| receipts/governance/public-mint-policy-readiness-v1.json | mint, guardian, safe, audit, receipt, contract, wallet |
| receipts/governance/public-mint-wallet-prompt-inspection-v1.json | mint, liquidity, staking, bridge, receipt, contract, private key, seed |
| receipts/governance/public-onboarding-readiness-v1-evidence-v1.json | mint, liquidity, staking, guardian, safe, audit, evidence, receipt |
| receipts/governance/public-ready-ecosystem-gate-index-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/public-reviewer-status-route-v1.json | evidence, receipt, deploy |
| receipts/governance/public-surface-post-pr-314-verification-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/public-validation-status-v1.json | liquidity, staking, receipt, wallet |
| receipts/governance/qpf-constitutional-closure-manifest-v1.json | guardian, receipt, seed, wallet, signing, broadcast |
| receipts/governance/qpf-constitutional-closure-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/qpf-constitutional-publication-and-anchor-gate-v1.json | mint, liquidity, staking, bridge, guardian, receipt, wallet, signing |
| receipts/governance/qpf-constitutional-stack-status-v1.json | mint, liquidity, staking, bridge, guardian, receipt, wallet, signing |
| receipts/governance/qpf-reviewer-approval-package-v1.json | evidence, receipt, wallet, signing, broadcast |
| receipts/governance/quarantined-conflicting-governance-receipts-v1.json | mint, guardian, receipt, deploy |
| receipts/governance/remote-execution-script-quarantine-v1.json | mint, liquidity, staking, bridge, receipt, deploy, contract, private key |
| receipts/governance/remote-social-recovery-merge-safety-review-v1.json | mint, liquidity, staking, bridge, guardian, safe, receipt, deploy |
| receipts/governance/reviewer-attestation-intake-v1.json | receipt, deploy, broadcast |
| receipts/governance/reviewer-priority-grant-approval-gate-v1.json | receipt, wallet, signing, broadcast |
| receipts/governance/reviewer-status-consolidation-v1.json | audit, evidence, receipt, deploy, broadcast |
| receipts/governance/roadmap-completion-and-following-phase-v1.json | mint, liquidity, staking, bridge, guardian, evidence, receipt, wallet |
| receipts/governance/staking-policy-readiness-v1.json | staking, safe, audit, receipt, deploy, contract |
| receipts/governance/stale-openzeppelin-submodule-path-repair-v1.json | evidence, receipt, deploy, contract, wallet, signing, broadcast |
| receipts/governance/supervised-activation-dry-run-1-evidence-v1.json | evidence, receipt, wallet |
| receipts/governance/supervised-activation-dry-run-2-evidence-v1.json | evidence, receipt |
| receipts/governance/supervised-activation-dry-run-3-evidence-v1.json | evidence, receipt, wallet |
| receipts/governance/supervised-activation-v1-milestone-snapshot.json | evidence, receipt, broadcast |
| receipts/governance/supervised-execution-gate-v1.json | mint, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/sustainability-readiness-gate-v1.json | liquidity, bridge, receipt, deploy, seed, wallet, signing |
| receipts/governance/targeted-review-outreach-receipt-v1.json | evidence, receipt, deploy |
| receipts/governance/v2-activation-readiness-review-v1.json | mint, staking, safe, audit, receipt, deploy, wallet, signing |
| receipts/governance/v2-cutover-execution-command-hash-v1.json | liquidity, staking, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/v2-final-operator-unpark-approval-receipt-v1.json | liquidity, staking, safe, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/v2-funder-outreach-manifest-v1.json | receipt, deploy, broadcast |
| receipts/governance/v2-funder-review-packet-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/v2-governance-receipt-chain-index-v1.json | evidence, receipt, deploy, broadcast |
| receipts/governance/v2-live-cutover-body-implementation-plan-v1.json | receipt |
| receipts/governance/v2-mainnet-cutover-execution-governance-wrapper-v1.json | receipt |
| receipts/governance/v2-operator-unpark-approval-candidate-v1.json | receipt, deploy, broadcast |
| receipts/governance/v2-pre-unpark-readiness-gate-v1.json | receipt, deploy, broadcast |
| receipts/governance/v2-public-funder-packet-index-v1.json | receipt, deploy, broadcast |
| receipts/governance/v2-public-packet-human-readability-audit-v1.json | mint, staking, safe, audit, evidence, receipt, deploy, wallet |
| receipts/governance/v2-public-reviewer-start-here-link-v1.json | mint, staking, safe, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/v2-public-reviewer-start-here-v1.json | mint, staking, safe, audit, evidence, receipt, deploy, wallet |
| receipts/governance/v2-public-status-endpoint-v1.json | evidence, receipt, deploy, signing, broadcast |
| receipts/governance/v2-read-only-status-dashboard-v1.json | receipt, deploy, signing, broadcast |
| receipts/governance/v2-reviewer-evidence-index-v1.json | evidence, receipt, deploy, signing, broadcast |
| receipts/governance/v2-scope-definition.json | evidence, receipt, deploy, contract, broadcast |
| receipts/governance/v2-sealed-cutover-command-implementation-repair-v1.json | receipt, deploy, wallet, signing, broadcast |
| receipts/governance/v2-static-site-public-verification-v1.json | evidence, receipt, deploy, signing, broadcast |
| receipts/governance/v2-w0g-deployment-governance-wrapper-v1.json | receipt, deploy |
| receipts/governance/wallet-onboarding-policy-v1.json | mint, liquidity, staking, bridge, guardian, safe, permission, evidence |
| receipts/governance/wrangler-security-update-v1.json | audit, evidence, receipt, deploy, wallet, signing, broadcast |
| receipts/governance/yield-routing-contract-design-v1.json | mint, liquidity, staking, guardian, evidence, receipt, deploy, contract |
| receipts/governance/yield-routing-evidence-spec-v1.json | mint, liquidity, staking, evidence, receipt, deploy, contract, wallet |
| receipts/governance/yield-routing-implementation-readiness-v1.json | mint, liquidity, staking, audit, evidence, receipt, deploy, contract |
| receipts/governance/yield-routing-pre-deployment-gate-v1.json | mint, liquidity, staking, receipt, deploy, contract, private key, wallet |
| receipts/valuation/pr-562-valuation-evidence-main-closure-v1.json | mint, liquidity, staking, bridge, permission, threat, valuation, audit |
| receipts/valuation/pr-564-audit-permission-map-threat-model-main-closure-v1.json | mint, liquidity, staking, bridge, permission, threat, valuation, audit |
| receipts/valuation/pr-566-partner-auditor-diligence-index-main-closure-v1.json | mint, liquidity, staking, bridge, valuation, audit, evidence, receipt |
| receipts/valuation/pr-568-external-valuation-summary-main-closure-v1.json | mint, liquidity, staking, bridge, valuation, evidence, receipt, wallet |
| receipts/valuation/pr-571-value-metrics-dashboard-main-closure-v1.json | mint, liquidity, staking, bridge, valuation, evidence, receipt, wallet |
| receipts/valuation/qpf-audit-readiness-live-evidence-addendum-v1.json | mint, liquidity, staking, bridge, valuation, audit, evidence, receipt |
| receipts/valuation/qpf-audit-readiness-permission-map-threat-model-v1.json | mint, liquidity, staking, bridge, permission, threat, valuation, audit |
| receipts/valuation/qpf-external-valuation-summary-v1.json | mint, liquidity, staking, bridge, valuation, evidence, receipt, wallet |
| receipts/valuation/qpf-partner-auditor-diligence-index-v1.json | mint, liquidity, staking, bridge, valuation, audit, receipt, wallet |
| receipts/valuation/qpf-self-sustaining-value-flywheel-v1.json | mint, liquidity, staking, bridge, safe, valuation, receipt, wallet |
| receipts/valuation/qpf-valuation-evidence-lane-v1.json | valuation, audit, evidence, receipt, wallet |
| receipts/valuation/qpf-value-metrics-dashboard-live-snapshot-v1.json | mint, liquidity, staking, bridge, permission, valuation, audit, evidence |
| scripts/0g-storage-evidence-dry-run-gate-v1.cjs | evidence, receipt, broadcast |
| scripts/audit-full-local.cjs | audit |
| scripts/autonomous-worker-monitor-attempt-v1.cjs | receipt, wallet |
| scripts/autonomy/autonomy-completion-auditor-v1.cjs | audit, evidence, receipt, wallet, signing |
| scripts/autonomy/local-autonomous-worker-loop-v1.cjs | liquidity, bridge, audit, evidence, receipt, deploy, private key, seed |
| scripts/autonomy/local-autonomous-workflow-supervisor-v1.cjs | liquidity, bridge, safe, receipt, deploy, seed, wallet, signing |
| scripts/build.js | mint, liquidity, staking, guardian, deploy |
| scripts/check-0g-router-chat.cjs | safe |
| scripts/check-claim-map.cjs | evidence |
| scripts/check-evidence-receipt.cjs | evidence, receipt |
| scripts/check-mainnet-finalization-gate-v1.cjs | mint, deploy, wallet, broadcast |
| scripts/check-public-validation-status-v1.cjs | liquidity, staking, safe, receipt, wallet |
| scripts/check-readme-public-validation-pin-v1.cjs | liquidity, staking |
| scripts/classifier/protocol-intent-classifier-v0_1.cjs | liquidity, deploy, wallet, signing |
| scripts/compile-and-deploy.js | deploy, broadcast |
| scripts/create-bounded-activation-readiness-gate-v1.cjs | mint, safe, receipt, deploy, contract, wallet, signing, broadcast |
| scripts/create-dry-run-simulation-v1.cjs | receipt |
| scripts/create-execution-lane-separation-gate-v1.cjs | mint, receipt, deploy, contract, private key, wallet, signing, broadcast |
| scripts/create-gas-funding-limits-v1.cjs | receipt |
| scripts/create-human-operator-approval-v1.cjs | receipt |
| scripts/create-irreversible-zone-review-v1.cjs | mint, liquidity, receipt, deploy, wallet, signing, broadcast |
| scripts/create-named-activation-action-plan-v1.cjs | mint, receipt, deploy, contract, wallet, signing, broadcast |
| scripts/create-supervised-execution-gate-v1.cjs | receipt |
| scripts/deploy-0g-mainnet.js | deploy, broadcast |
| scripts/deploy-direct.js | deploy, broadcast |
| scripts/discover-0g-router.js | contract |
| scripts/execute-v2-first-pair-live-createpair-v1.cjs | liquidity, receipt, contract, wallet, broadcast |
| scripts/field/spiral-return-field-kit-v1.cjs | liquidity, safe, receipt, deploy, wallet, signing |
| scripts/generate-determinism-manifest.cjs | receipt, deploy, contract, broadcast |
| scripts/generate-evidence-receipt.cjs | mint, staking, evidence, receipt, deploy, wallet, signing |
| scripts/generate-external-runner-live-failure.cjs | evidence, receipt |
| scripts/generate-grant-evidence.cjs | safe, evidence |
| scripts/generate-v2-first-pair-final-execution-command-selection-v1.cjs | liquidity, receipt, private key, broadcast |
| scripts/generate-v2-first-pair-init-command-hash-v1.cjs | liquidity, receipt, broadcast |
| scripts/generate-v2-first-pair-live-createpair-doc-v1.cjs | liquidity, receipt, deploy |
| scripts/hermes-write-receipt.cjs | evidence, receipt, deploy, wallet, signing |
| scripts/human-onboarding-receipt-template.json | mint, liquidity, staking, bridge, guardian, safe, permission, evidence |
| scripts/inspect-execution-wrapper-readiness-v1.cjs | receipt, deploy, broadcast |
| scripts/liquidity-guardian.cjs | liquidity, guardian, safe, deploy, seed, wallet |
| scripts/normalization/normalization-engine-v0_1.cjs | liquidity, safe, evidence, receipt, deploy, wallet, signing |
| scripts/orchestrator/protocol-pipeline-orchestrator-v0_1.cjs | liquidity, evidence, receipt, deploy, signing |
| scripts/pipeline/e2e-pipeline-guard-receipt-v0_1.cjs | liquidity, safe, receipt, deploy, contract, wallet, signing |
| scripts/pipeline/protocol-adapter-normalization-pipeline-v0_1.cjs | liquidity, evidence, receipt, deploy, signing |
| scripts/preflight-0g-deploy.js | deploy, contract, wallet |
| scripts/probe-v2-first-pair-final-live-prebroadcast-v1.cjs | liquidity, receipt, contract, broadcast |
| scripts/probe-v2-first-pair-final-state-seal-v1.cjs | liquidity, receipt, contract, broadcast |
| scripts/probe-v2-first-pair-metadata-v1.cjs | liquidity, receipt, contract, broadcast |
| scripts/protocol/protocol-adapter-dry-run-v1.cjs | liquidity, receipt, deploy, signing |
| scripts/public/verify-public-verification-demo-gate-v1.cjs | liquidity, staking, safe, receipt, deploy, private key, wallet, broadcast |
| scripts/query-0g-compute-model.js | liquidity, deploy, contract |
| scripts/review/final-reviewed-values-human-confirmation-v1.cjs | mint, receipt, signing, broadcast |
| scripts/review/human-wallet-prompt-inspection-v1.cjs | mint, receipt, contract, wallet, signing, broadcast |
| scripts/review/phase-33-execution-authorization-retry-review-v1.cjs | mint, receipt, wallet, signing, broadcast |
| scripts/review/public-mint-dry-run-execution-preview-v1.cjs | mint, liquidity, staking, bridge, receipt, contract, private key, seed |
| scripts/review/public-mint-execution-path-review-v1.cjs | mint, liquidity, staking, bridge, receipt, contract, seed, wallet |
| scripts/review/verify-phase-30-final-execution-review-reopen-v1.cjs | mint, receipt, contract, wallet, signing, broadcast |
| scripts/review/verify-phase-32-human-signing-approval-gate-v1.cjs | mint, receipt, contract, wallet, signing, broadcast |
| scripts/review/verify-phase-33-execution-authorization-retry-gate-v1.cjs | mint, receipt, wallet, signing, broadcast |
| scripts/review/verify-phase-33-public-mint-execution-gate-v1.cjs | mint, receipt, contract, wallet, signing, broadcast |
| scripts/review/verify-phase-34-public-mint-execution-preparation-lane-v1.cjs | mint, receipt, wallet, signing, broadcast |
| scripts/review/verify-phase-35-final-reviewed-values-human-confirmation-gate-v1.cjs | mint, receipt, wallet, signing, broadcast |
| scripts/runtime/activation-runtime-v1.cjs | liquidity, receipt, deploy, seed, wallet, signing |
| scripts/safe-deploy.js | liquidity, safe, receipt, deploy, contract, wallet |
| scripts/scaffold-hermes-receipt-replay.cjs | mint, staking, evidence, receipt, deploy, wallet, signing |
| scripts/security/wallet-preflight-verifier-v1.cjs | receipt, deploy, seed, wallet, broadcast |
| scripts/supervised-autonomous-activation-v1.cjs | safe, receipt, deploy, private key, wallet |
| scripts/supervised-autonomous-dry-run-v1.cjs | receipt, wallet |
| scripts/triage-execution-wrapper-readiness-v1.cjs | receipt, deploy, broadcast |
| scripts/update-liquidity-signals.cjs | liquidity, seed |
| scripts/update-v2-public-first-pair-status-v1.cjs | liquidity, receipt, deploy |
| scripts/v2-full-dex-deployment-execute.cjs | receipt, deploy, contract, wallet, signing, broadcast |
| scripts/v2-mainnet-cutover-execute.cjs | receipt, deploy, contract, wallet, signing, broadcast |
| scripts/v2-w0g-deployment-execute.cjs | receipt, deploy, contract, wallet, signing, broadcast |
| scripts/verification/QUICKSTART.md | deploy, contract |
| scripts/verification/README.md | deploy, contract |
| scripts/verify-0g-compute-inference-evidence-dry-run-gate-v1.cjs | evidence, receipt, private key, wallet, signing |
| scripts/verify-0g-ship-skill-ingest-v1.cjs | deploy |
| scripts/verify-0g-ship-skill-reconciliation-v1.cjs | liquidity, deploy, private key, broadcast |
| scripts/verify-0g-storage-evidence-dry-run-gate-v1.cjs | evidence, receipt, broadcast |
| scripts/verify-active-development-reopen-gate-v1.cjs | liquidity, receipt, wallet |
| scripts/verify-apply-lone-steward-branch-protection-v1.cjs | receipt |
| scripts/verify-audit-hardening-readiness-v1.cjs | audit, receipt, deploy, broadcast |
| scripts/verify-autonomous-agent-quarantine-manifest-v1.cjs | receipt, wallet |
| scripts/verify-autonomous-execution-receipt.cjs | evidence, receipt |
| scripts/verify-autonomous-network-activation-readiness-v2.cjs | evidence, receipt |
| scripts/verify-autonomous-network-readiness-v1.cjs | receipt |
| scripts/verify-autonomous-public-health-surface-v1.cjs | deploy, contract |
| scripts/verify-autonomous-runner-observation-v1.cjs | evidence, receipt, deploy, contract |
| scripts/verify-autonomous-worker-monitor-attempt-v1.cjs | receipt, wallet |
| scripts/verify-autonomy-completion-auditor-v1.cjs | audit, receipt, wallet, signing |
| scripts/verify-bounded-activation-readiness-gate-v1.cjs | mint, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-claim-map.cjs | safe, evidence |
| scripts/verify-cold-storage-custody-onboarding-gate-v1.cjs | liquidity, receipt, deploy, private key, seed, wallet, signing |
| scripts/verify-consolidated-execution-evidence-index.cjs | evidence, receipt |
| scripts/verify-cross-platform-determinism-v1.cjs | audit, evidence, receipt, deploy, broadcast |
| scripts/verify-current-funder-audit-handoff-v1.cjs | audit, evidence, receipt |
| scripts/verify-current-governance-state-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-current-public-status-handoff-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-current-sovereign-state-v1.cjs | safe, receipt, wallet |
| scripts/verify-discord-only-proof-v1.cjs | safe, receipt, wallet |
| scripts/verify-discord-webhook-diagnostic-v1.cjs | receipt, deploy |
| scripts/verify-dry-run-output-hygiene-v1.cjs | receipt, wallet |
| scripts/verify-dry-run-simulation-v1.cjs | mint, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-e2e-pipeline-guard-v0_1.cjs | liquidity, safe, receipt, deploy, private key, signing |
| scripts/verify-evidence-index.cjs | evidence |
| scripts/verify-evidence.cjs | evidence, receipt |
| scripts/verify-execution-lane-separation-gate-v1.cjs | mint, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-execution-wrapper-readiness-corrective-v1.cjs | evidence, receipt, deploy, broadcast |
| scripts/verify-execution-wrapper-readiness-triage-v1.cjs | evidence, receipt, deploy, broadcast |
| scripts/verify-external-attestation-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-external-runner-3c32f91-inaccessible.cjs | receipt |
| scripts/verify-external-runner-fixed-run-observation.cjs | receipt |
| scripts/verify-external-runner-live-attempt.cjs | receipt |
| scripts/verify-external-runner-live-failure.cjs | receipt |
| scripts/verify-external-runner-live-log.cjs | receipt |
| scripts/verify-external-runner-live-result.cjs | receipt |
| scripts/verify-external-runner-proof.cjs | receipt |
| scripts/verify-final-current-state-reconciliation-post-pr-315-v1.cjs | liquidity, staking, evidence, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-final-preflight-checklist-v1.cjs | receipt |
| scripts/verify-gas-funding-limits-v1.cjs | mint, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-hermes-receipt.cjs | receipt, deploy, wallet, signing |
| scripts/verify-human-operator-approval-v1.cjs | mint, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-irreversible-zone-review-v1.cjs | mint, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-liquidity-approval-command-hash-blocked-v1.cjs | liquidity, receipt, private key, broadcast |
| scripts/verify-liquidity-funding-plan-v1.cjs | liquidity, receipt, broadcast |
| scripts/verify-liquidity-readiness-preflight-v1.cjs | liquidity, receipt, broadcast |
| scripts/verify-live-canary-gate-v1.cjs | liquidity, staking, receipt, deploy, wallet, broadcast |
| scripts/verify-local-autonomous-worker-loop-v1.cjs | liquidity, bridge, evidence, receipt, deploy, seed, wallet, signing |
| scripts/verify-local-autonomous-workflow-supervisor-v1.cjs | liquidity, bridge, receipt, deploy, private key, seed, wallet, signing |
| scripts/verify-lone-steward-governance-baseline-v1.cjs | receipt |
| scripts/verify-mainnet-activation-command-hash-readiness-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-mainnet-activation-preflight-v1.cjs | receipt, deploy, wallet, broadcast |
| scripts/verify-mainnet-cutover-command-hash-v1.cjs | receipt, deploy, contract, broadcast |
| scripts/verify-mainnet-cutover-final-operator-approval-v1.cjs | receipt, deploy, contract, broadcast |
| scripts/verify-mainnet-cutover-gate-definition-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-mainnet-cutover-operator-approval-gate-v1.cjs | receipt, deploy, contract, broadcast |
| scripts/verify-mainnet-cutover-preflight-boundary-v1.cjs | receipt, deploy, contract, broadcast |
| scripts/verify-mainnet-cutover-readiness-boundary-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-mainnet-cutover-readonly-live-probe-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-mainnet-cutover-rollback-plan-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-mainnet-cutover-secret-completion-gate-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-mainnet-cutover-secret-remediation-plan-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-mainnet-execution-result-v1.cjs | evidence, receipt |
| scripts/verify-mainnet-execution-window-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-mainnet-final-command-selection-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-mainnet-final-state-seal-v1.cjs | receipt |
| scripts/verify-mainnet-operator-approval-preparation-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-mainnet-operator-approval-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-named-activation-action-plan-v1.cjs | mint, receipt, deploy, contract, wallet, signing, broadcast |
| scripts/verify-normalization-engine-v0_1.cjs | liquidity, receipt, deploy, signing |
| scripts/verify-npm-audit-hardening-evidence-v1.cjs | audit, evidence, receipt, deploy, broadcast |
| scripts/verify-open-verification-gate-v1-post-merge.cjs | receipt, deploy, broadcast |
| scripts/verify-open-verification-gate-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-post-merge-governance-receipt.cjs | receipt |
| scripts/verify-post-pr-318-observer-readiness-receipt-v1.cjs | receipt, deploy, wallet, signing, broadcast |
| scripts/verify-pr-186-selfhosted-merge-boundary.cjs | receipt |
| scripts/verify-pr-188-autonomous-readiness-merge-boundary.cjs | receipt |
| scripts/verify-pr-205-post-merge-governance-receipt-v1.cjs | receipt |
| scripts/verify-pr-207-post-merge-governance-receipt-v1.cjs | receipt, deploy |
| scripts/verify-pr-209-211-post-merge-governance-receipt-v1.cjs | safe, receipt, deploy, private key, wallet |
| scripts/verify-pr-213-post-merge-governance-receipt-v1.cjs | receipt, deploy, wallet |
| scripts/verify-pr-215-post-merge-governance-receipt-v1.cjs | receipt, wallet |
| scripts/verify-pr-218-post-merge-governance-receipt-v1.cjs | evidence, receipt, wallet |
| scripts/verify-pr-220-post-merge-governance-receipt-v1.cjs | evidence, receipt, wallet |
| scripts/verify-pr-222-post-merge-governance-receipt-v1.cjs | evidence, receipt, wallet |
| scripts/verify-pr-224-post-merge-governance-receipt-v1.cjs | evidence, receipt, wallet |
| scripts/verify-pr-226-post-merge-governance-receipt-v1.cjs | evidence, receipt, wallet |
| scripts/verify-pr-228-post-merge-governance-receipt-v1.cjs | receipt |
| scripts/verify-pr-231-post-merge-governance-receipt-v1.cjs | evidence, receipt, broadcast |
| scripts/verify-pr-243-post-merge-governance-receipt-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-247-post-merge-governance-receipt-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-249-post-merge-governance-receipt-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-251-hosted-ci-failure-opacity-boundary-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-251-post-merge-governance-receipt-v1.cjs | audit, receipt, deploy, broadcast |
| scripts/verify-pr-253-post-merge-governance-receipt-v1.cjs | audit, receipt, deploy, broadcast |
| scripts/verify-pr-256-post-merge-governance-receipt-v1.cjs | audit, receipt, deploy, broadcast |
| scripts/verify-pr-258-post-merge-governance-receipt-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-260-post-merge-governance-receipt-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-283-post-merge-governance-receipt-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-285-post-merge-governance-receipt-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-287-post-merge-governance-receipt-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-289-post-merge-governance-receipt-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-291-post-merge-governance-receipt-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-292-post-merge-governance-receipt-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pr-294-post-merge-governance-receipt-v1.cjs | liquidity, staking, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-pr-296-post-merge-governance-receipt-v1.cjs | liquidity, staking, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-pr-298-execution-wrapper-failed-attempt-review-v1.cjs | evidence, receipt, deploy, broadcast |
| scripts/verify-pr-298-post-merge-governance-receipt-v1.cjs | evidence, receipt |
| scripts/verify-pr-300-post-merge-governance-receipt-v1.cjs | evidence, receipt, deploy, broadcast |
| scripts/verify-pr-302-post-merge-governance-receipt-v1.cjs | evidence, receipt, deploy, broadcast |
| scripts/verify-pr-304-post-merge-governance-receipt-v1.cjs | evidence, receipt, deploy, broadcast |
| scripts/verify-pr-312-post-merge-observer-repair-receipt-v1.cjs | evidence, receipt, deploy, broadcast |
| scripts/verify-pr-319-fresh-observer-receipt-v1.cjs | safe, receipt, deploy, broadcast |
| scripts/verify-pr-325-post-merge-governance-receipt-v1.cjs | audit, evidence, receipt |
| scripts/verify-pr-333-post-merge-press-agent-local-runtime-health-v2.cjs | evidence, receipt, deploy |
| scripts/verify-pr-335-post-merge-parked-broadcast-guard-v1.cjs | evidence, receipt, deploy, broadcast |
| scripts/verify-pre-cutover-exit-criterion-checkpoint-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-pre-cutover-review-window-v1.cjs | audit, receipt, deploy, broadcast |
| scripts/verify-pre-unpark-readiness-candidate-closure-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-press-agent-credential-completion-boundary-v1.cjs | safe, receipt, broadcast |
| scripts/verify-press-agent-discord-parked-broadcast-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-press-agent-local-runtime-health-v2.cjs | receipt, deploy |
| scripts/verify-press-agent-parked-broadcast-guard-v1.cjs | evidence, receipt, deploy, broadcast |
| scripts/verify-press-agent-readonly-readiness-v1.cjs | receipt |
| scripts/verify-protocol-adapter-layer-v1.cjs | liquidity, receipt, deploy, private key, signing |
| scripts/verify-protocol-adapter-negative-tests-v1.cjs | liquidity, receipt, deploy, signing |
| scripts/verify-protocol-adapter-normalization-pipeline-v0_1.cjs | liquidity, receipt, deploy, signing |
| scripts/verify-protocol-intent-classifier-v0_1.cjs | liquidity, receipt, deploy, signing |
| scripts/verify-protocol-pipeline-orchestrator-v0_1.cjs | liquidity, receipt, deploy, signing |
| scripts/verify-public-first-dex-pair-comms-v1.cjs | liquidity, receipt, broadcast |
| scripts/verify-public-first-dex-pair-handoff-v1.cjs | liquidity, receipt, deploy, private key, broadcast |
| scripts/verify-public-reviewer-status-route-v1.cjs | receipt, deploy |
| scripts/verify-public-status-v1.cjs | audit, deploy, broadcast |
| scripts/verify-public-surface-post-pr-314-verification-v1.cjs | evidence, receipt, deploy, broadcast |
| scripts/verify-readme-audit-entrypoint-v1.cjs | audit, deploy |
| scripts/verify-reviewer-attestation-intake-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-reviewer-status-consolidation-v1.cjs | audit, evidence, receipt, deploy, broadcast |
| scripts/verify-root-audit-runbook-v1.cjs | audit, receipt, deploy, broadcast |
| scripts/verify-runtime-evidence-index-v1.cjs | safe, evidence, receipt, private key |
| scripts/verify-selfhosted-forgejo-runner-pass.cjs | receipt |
| scripts/verify-selfhosted-forgejo-runner-target.cjs | receipt |
| scripts/verify-selfhosted-forgejo-runner-task-observation.cjs | receipt |
| scripts/verify-selfhosted-runner-live-attempt-v2.cjs | evidence, receipt |
| scripts/verify-selfhosted-runner-live-pass-v2.cjs | receipt |
| scripts/verify-snapshot-ancestor-runner-context.cjs | receipt |
| scripts/verify-snapshot.cjs | mint, staking, evidence, receipt, deploy, wallet, signing |
| scripts/verify-supervised-activation-dry-run-1-evidence-v1.cjs | evidence, receipt, wallet |
| scripts/verify-supervised-activation-dry-run-2-evidence-v1.cjs | safe, evidence, receipt |
| scripts/verify-supervised-activation-dry-run-3-evidence-v1.cjs | safe, evidence, receipt, private key, wallet |
| scripts/verify-supervised-activation-dry-run-4-evidence-v1.cjs | evidence, receipt, broadcast |
| scripts/verify-supervised-activation-dry-run-evidence-summary-v1.cjs | evidence, receipt, wallet |
| scripts/verify-supervised-activation-operations-index-v1.cjs | evidence, receipt, wallet |
| scripts/verify-supervised-activation-readiness-index-v1.cjs | safe, receipt, deploy, wallet |
| scripts/verify-supervised-activation-receipt-hash-semantics-v1.cjs | evidence, receipt, wallet |
| scripts/verify-supervised-activation-refusal-tests-v1.cjs | receipt, deploy, private key |
| scripts/verify-supervised-activation-runbook-v1.cjs | safe, receipt, wallet |
| scripts/verify-supervised-activation-runtime-hygiene-v1.cjs | receipt, private key |
| scripts/verify-supervised-activation-v1-milestone-snapshot.cjs | receipt |
| scripts/verify-supervised-autonomous-activation-command-v1.cjs | private key |
| scripts/verify-supervised-autonomous-dry-run-script-v1.cjs | receipt, wallet |
| scripts/verify-supervised-autonomous-dry-run-v1.cjs | receipt, wallet |
| scripts/verify-supervised-execution-gate-v1.cjs | mint, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-targeted-review-outreach-receipt-v1.cjs | evidence, receipt, deploy |
| scripts/verify-tedious-task-worker-repair-v1.cjs | safe, receipt, deploy, broadcast |
| scripts/verify-v2-cutover-execution-command-hash-v1.cjs | liquidity, staking, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-v2-final-operator-unpark-approval-receipt-v1.cjs | liquidity, staking, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-v2-first-pair-final-execution-command-selection-v1.cjs | liquidity, receipt, private key, broadcast |
| scripts/verify-v2-first-pair-final-live-prebroadcast-probe-v1.cjs | liquidity, receipt, broadcast |
| scripts/verify-v2-first-pair-final-state-seal-v1.cjs | liquidity, receipt, broadcast |
| scripts/verify-v2-first-pair-init-command-hash-v1.cjs | liquidity, receipt, broadcast |
| scripts/verify-v2-first-pair-init-preflight-audit-v1.cjs | liquidity, audit, receipt, deploy, private key, broadcast |
| scripts/verify-v2-first-pair-live-createpair-execution-v1.cjs | liquidity, receipt, broadcast |
| scripts/verify-v2-first-pair-metadata-probe-v1.cjs | liquidity, receipt, broadcast |
| scripts/verify-v2-first-pair-selection-v1.cjs | liquidity, deploy, broadcast |
| scripts/verify-v2-first-pair-tokenb-candidate-discovery-v1.cjs | receipt, deploy, contract |
| scripts/verify-v2-full-dex-deployment-execution-v1.cjs | safe, receipt, deploy, wallet, signing, broadcast |
| scripts/verify-v2-funder-outreach-manifest-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-v2-funder-review-packet-v1.cjs | audit, evidence, receipt, deploy, contract, broadcast |
| scripts/verify-v2-governance-receipt-chain-index-v1.cjs | receipt |
| scripts/verify-v2-mainnet-cutover-execution-v1.cjs | receipt |
| scripts/verify-v2-operator-unpark-approval-candidate-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-v2-pair-init-execution-v1.cjs | liquidity, receipt, deploy, broadcast |
| scripts/verify-v2-pair-init-readiness-v1.cjs | liquidity, deploy, broadcast |
| scripts/verify-v2-pre-unpark-readiness-gate-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-v2-public-first-pair-status-v1.cjs | liquidity, receipt, deploy |
| scripts/verify-v2-public-funder-packet-index-v1.cjs | evidence, receipt, deploy, broadcast |
| scripts/verify-v2-public-handoff-route-v1.cjs | receipt, deploy, broadcast |
| scripts/verify-v2-public-status-endpoint-v1.cjs | evidence, receipt |
| scripts/verify-v2-public-visible-first-pair-proof-v1.cjs | receipt, deploy |
| scripts/verify-v2-read-only-status-dashboard-v1.cjs | receipt |
| scripts/verify-v2-reviewer-evidence-index-v1.cjs | evidence, receipt |
| scripts/verify-v2-scope-definition.cjs | safe, receipt |
| scripts/verify-v2-sealed-cutover-command-implementation-repair-v1.cjs | receipt, deploy, wallet, signing, broadcast |
| scripts/verify-v2-static-site-public-verification-v1.cjs | evidence, receipt |
| scripts/verify-v2-w0g-deployment-execution-v1.cjs | receipt, deploy, wallet, signing, broadcast |

## Explicit non-authorization
This package does not authorize mint opening, liquidity, staking, bridge activity, wallet action, signing, transaction broadcasting, custody, private-key access, or fund movement.

## Audit engagement request language
QPF seeks an independent review of its smart contracts, governance gates, activation controls, public surfaces, evidence receipts, and local AI observer boundaries before any expansion of financial activation. The desired outcome is a written finding set with severity levels, remediation recommendations, and a re-review path after fixes.

## Safety assertions
- No wallet action performed.
- No signing performed.
- No transaction broadcast.
- No mint opened.
- No liquidity authorized.
- No staking authorized.
- No bridge authorized.
- Audit engagement package only.
