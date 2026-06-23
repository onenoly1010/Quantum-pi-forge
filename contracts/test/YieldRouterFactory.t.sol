// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/YieldRouterFactory.sol";
import "../src/FeeCollector.sol";
import "../src/LegacyVault.sol";
import "../src/PioneerRewards.sol";
import "../src/OperationalTreasury.sol";

contract YieldRouterFactoryTest is Test {
    YieldRouterFactory public factory;
    address public guardian = address(0x1111);
    address public otherGuardian = address(0x2222);
    address public predictedFeeCollector;
    address[] public guardians;

    function setUp() public {
        factory = new YieldRouterFactory();
        guardians.push(guardian);
        guardians.push(otherGuardian);

        // Precompute FeeCollector address from factory nonce sequence:
        //   0=LV, 1=PR, 2=OT, 3=FC
        predictedFeeCollector = vm.computeCreateAddress(address(factory), 3);
    }

    /// @notice Test successful full deployment
    function test_DeployAll_Success() public {
        factory.deployAll(predictedFeeCollector, guardian, guardians);

        // All four addresses must be non-zero
        assertTrue(factory.feeCollector() != address(0), "FC zero");
        assertTrue(factory.legacyVault() != address(0), "LV zero");
        assertTrue(factory.pioneerRewards() != address(0), "PR zero");
        assertTrue(factory.operationalTreasury() != address(0), "OT zero");

        // FeeCollector lands at predicted address
        assertEq(factory.feeCollector(), predictedFeeCollector, "FC != predicted");

        assertTrue(factory.deployed(), "deployed flag not set");
    }

    /// @notice Verify deployed contracts have correct immutable cross-references
    function test_DeployedContracts_ImmutableReferences() public {
        factory.deployAll(predictedFeeCollector, guardian, guardians);

        FeeCollector fc = FeeCollector(payable(factory.feeCollector()));
        LegacyVault lv = LegacyVault(payable(factory.legacyVault()));
        PioneerRewards pr = PioneerRewards(payable(factory.pioneerRewards()));
        OperationalTreasury ot = OperationalTreasury(payable(factory.operationalTreasury()));

        // Receivers know FeeCollector
        assertEq(lv.feeCollector(), predictedFeeCollector, "LV.feeCollector");
        assertEq(pr.feeCollector(), predictedFeeCollector, "PR.feeCollector");

        // FeeCollector knows receivers
        assertEq(fc.legacyVault(), factory.legacyVault(), "FC.legacyVault");
        assertEq(fc.pioneerRewards(), factory.pioneerRewards(), "FC.pioneerRewards");
        assertEq(fc.operationalTreasury(), factory.operationalTreasury(), "FC.operationalTreasury");
    }

    /// @notice Verify FeeCollector owner is guardian
    function test_FeeCollector_OwnerIsGuardian() public {
        factory.deployAll(predictedFeeCollector, guardian, guardians);
        FeeCollector fc = FeeCollector(payable(factory.feeCollector()));
        assertEq(fc.owner(), guardian, "owner != guardian");
    }

    /// @notice Verify re-deployment reverts
    function test_ReDeploy_Reverts() public {
        factory.deployAll(predictedFeeCollector, guardian, guardians);
        vm.expectRevert(YieldRouterFactory.AlreadyDeployed.selector);
        factory.deployAll(predictedFeeCollector, guardian, guardians);
    }

    /// @notice Verify zero guardian reverts
    function test_ZeroGuardian_Reverts() public {
        vm.expectRevert(YieldRouterFactory.ZeroGuardianAddress.selector);
        factory.deployAll(predictedFeeCollector, address(0), guardians);
    }

    /// @notice Verify empty guardians array reverts
    function test_EmptyGuardians_Reverts() public {
        address[] memory empty;
        vm.expectRevert(YieldRouterFactory.GuardianArrayRequired.selector);
        factory.deployAll(predictedFeeCollector, guardian, empty);
    }

    /// @notice Verify end-to-end fee routing through deployed contracts
    function test_FeeRouting_EndToEnd() public {
        factory.deployAll(predictedFeeCollector, guardian, guardians);

        FeeCollector fc = FeeCollector(payable(factory.feeCollector()));
        LegacyVault lv = LegacyVault(payable(factory.legacyVault()));
        PioneerRewards pr = PioneerRewards(payable(factory.pioneerRewards()));
        OperationalTreasury ot = OperationalTreasury(payable(factory.operationalTreasury()));

        // Activate
        vm.prank(guardian);
        fc.activate();
        assertTrue(fc.isActive(), "should be active");

        // Route swap fees (50/30/20 split)
        uint256 swapAmount = 10 ether;
        vm.deal(address(this), swapAmount + 1 ether);

        uint256 lvBefore = address(lv).balance;
        uint256 prBefore = address(pr).balance;
        uint256 otBefore = address(ot).balance;

        fc.routeSwapFees{value: swapAmount}();

        uint256 lvAfter = address(lv).balance;
        uint256 prAfter = address(pr).balance;
        uint256 otAfter = address(ot).balance;

        // 50/30/20
        assertApproxEqRel(lvAfter - lvBefore, swapAmount * 50 / 100, 0.01e18, "LV 50%");
        assertApproxEqRel(prAfter - prBefore, swapAmount * 30 / 100, 0.01e18, "PR 30%");
        assertApproxEqRel(otAfter - otBefore, swapAmount * 20 / 100, 0.01e18, "OT 20%");

        uint256 totalRouted = (lvAfter - lvBefore) + (prAfter - prBefore) + (otAfter - otBefore);
        assertApproxEqRel(totalRouted, swapAmount, 0.001e18, "total_routed_approx_swap");
    }
}