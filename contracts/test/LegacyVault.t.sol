// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {LegacyVault} from "../src/LegacyVault.sol";

contract LegacyVaultTest is Test {
    LegacyVault public vault;
    address public feeCollector;

    event Deposited(address indexed from, uint256 amount);
    event Distributed(uint256 totalAmount, uint256 soulNodeCount);

    function setUp() public {
        feeCollector = makeAddr("feeCollector");
        vault = new LegacyVault(feeCollector);
    }

    function test_Constructor_SetsFeeCollector() public view {
        assertEq(vault.feeCollector(), feeCollector);
    }

    function test_UnlockBlock() public view {
        assertEq(vault.unlockBlock(), 73050000);
    }

    function test_Deposit_OnlyFeeCollector() public {
        vm.deal(feeCollector, 1 ether);
        vm.prank(feeCollector);
        vault.deposit{value: 1 ether}();
        assertEq(vault.totalDeposited(), 1 ether);
    }

    function test_Deposit_RevertsNonFeeCollector() public {
        vm.deal(makeAddr("rando"), 1 ether);
        vm.prank(makeAddr("rando"));
        vm.expectRevert(LegacyVault.NotFeeCollector.selector);
        vault.deposit{value: 1 ether}();
    }

    function test_Balance() public {
        vm.deal(feeCollector, 2 ether);
        vm.prank(feeCollector);
        vault.deposit{value: 2 ether}();
        assertEq(vault.balance(), 2 ether);
    }

    function test_Distribute_RevertsBeforeUnlock() public {
        vm.expectRevert(LegacyVault.NotYetUnlocked.selector);
        vault.distribute();
    }

    function test_Distribute_SucceedsAfterUnlock() public {
        vm.deal(feeCollector, 1 ether);
        vm.prank(feeCollector);
        vault.deposit{value: 1 ether}();

        vm.roll(73050001);
        vault.distribute();
        assertTrue(vault.distributed());
    }

    function test_Distribute_RevertsAlreadyDistributed() public {
        vm.deal(feeCollector, 1 ether);
        vm.prank(feeCollector);
        vault.deposit{value: 1 ether}();

        vm.roll(73050001);
        vault.distribute();

        vm.expectRevert(LegacyVault.AlreadyDistributed.selector);
        vault.distribute();
    }

    function test_Receive_OnlyFeeCollector() public {
        vm.deal(feeCollector, 1 ether);
        vm.prank(feeCollector);
        (bool ok,) = address(vault).call{value: 1 ether}("");
        assertTrue(ok);
        assertEq(vault.totalDeposited(), 1 ether);
    }

    function test_Receive_RevertsNonFeeCollector() public {
        vm.deal(makeAddr("rando"), 1 ether);
        vm.prank(makeAddr("rando"));
        (bool ok,) = address(vault).call{value: 1 ether}("");
        assertFalse(ok);
    }
}