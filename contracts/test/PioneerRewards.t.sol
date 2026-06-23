// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PioneerRewards} from "../src/PioneerRewards.sol";

contract PioneerRewardsTest is Test {
    PioneerRewards public rewards;
    address public feeCollector;
    address public pioneer1;
    address public pioneer2;

    function setUp() public {
        feeCollector = makeAddr("feeCollector");
        pioneer1 = makeAddr("pioneer1");
        pioneer2 = makeAddr("pioneer2");
        rewards = new PioneerRewards(feeCollector);
    }

    function test_Constructor_SetsFeeCollector() public view {
        assertEq(rewards.feeCollector(), feeCollector);
    }

    function test_Deposit_OnlyFeeCollector() public {
        vm.deal(feeCollector, 1 ether);
        vm.prank(feeCollector);
        rewards.deposit{value: 1 ether}();
        assertEq(rewards.totalAccumulated(), 1 ether);
    }

    function test_Deposit_RevertsNonFeeCollector() public {
        vm.deal(makeAddr("rando"), 1 ether);
        vm.prank(makeAddr("rando"));
        vm.expectRevert(PioneerRewards.NotFeeCollector.selector);
        rewards.deposit{value: 1 ether}();
    }

    function test_SetSOVWeight() public {
        vm.prank(feeCollector);
        rewards.setSOVWeight(pioneer1, 1000);
        assertEq(rewards.sovWeight(pioneer1), 1000);
        assertEq(rewards.totalSOVWeight(), 1000);
    }

    function test_SetSOVWeight_UpdatesTotal() public {
        vm.prank(feeCollector);
        rewards.setSOVWeight(pioneer1, 1000);
        vm.prank(feeCollector);
        rewards.setSOVWeight(pioneer2, 2000);
        assertEq(rewards.totalSOVWeight(), 3000);

        // Update pioneer1 weight
        vm.prank(feeCollector);
        rewards.setSOVWeight(pioneer1, 500);
        assertEq(rewards.totalSOVWeight(), 2500);
    }

    function test_PendingRewards_ProportionalToWeight() public {
        vm.prank(feeCollector);
        rewards.setSOVWeight(pioneer1, 1000);
        vm.prank(feeCollector);
        rewards.setSOVWeight(pioneer2, 3000);

        vm.deal(feeCollector, 4 ether);
        vm.prank(feeCollector);
        rewards.deposit{value: 4 ether}();

        assertEq(rewards.pendingRewards(pioneer1), 1 ether);
        assertEq(rewards.pendingRewards(pioneer2), 3 ether);
    }

    function test_Claim() public {
        vm.prank(feeCollector);
        rewards.setSOVWeight(pioneer1, 1000);

        vm.deal(feeCollector, 1 ether);
        vm.prank(feeCollector);
        rewards.deposit{value: 1 ether}();

        vm.prank(pioneer1);
        uint256 claimed = rewards.claim();
        assertEq(claimed, 1 ether);

        // After claim, pending should be 0
        assertEq(rewards.pendingRewards(pioneer1), 0);
    }

    function test_Claim_RevertsBelowMinimum() public {
        vm.prank(feeCollector);
        rewards.setSOVWeight(pioneer1, 1);

        vm.deal(feeCollector, 1);
        vm.prank(feeCollector);
        rewards.deposit{value: 1}();

        vm.prank(pioneer1);
        vm.expectRevert(PioneerRewards.BelowMinimumClaim.selector);
        rewards.claim();
    }

    function test_Claim_RevertsCooldown() public {
        vm.prank(feeCollector);
        rewards.setSOVWeight(pioneer1, 1000);

        vm.deal(feeCollector, 1 ether);
        vm.prank(feeCollector);
        rewards.deposit{value: 1 ether}();

        vm.prank(pioneer1);
        rewards.claim();

        // Second claim should revert due to cooldown
        vm.expectRevert(PioneerRewards.CooldownActive.selector);
        vm.prank(pioneer1);
        rewards.claim();
    }

    function test_TotalPool() public {
        vm.deal(feeCollector, 2 ether);
        vm.prank(feeCollector);
        rewards.deposit{value: 2 ether}();
        assertEq(rewards.totalPool(), 2 ether);
    }
}