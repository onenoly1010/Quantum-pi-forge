// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {OperationalTreasury} from "../src/OperationalTreasury.sol";

contract OperationalTreasuryTest is Test {
    OperationalTreasury public treasury;
    address public feeCollector;
    address public guardian1;
    address public guardian2;
    address public guardian3;
    address public recipient;

    function setUp() public {
        feeCollector = makeAddr("feeCollector");
        guardian1 = makeAddr("guardian1");
        guardian2 = makeAddr("guardian2");
        guardian3 = makeAddr("guardian3");
        recipient = makeAddr("recipient");

        address[] memory guardians = new address[](3);
        guardians[0] = guardian1;
        guardians[1] = guardian2;
        guardians[2] = guardian3;

        treasury = new OperationalTreasury(feeCollector, guardians);
    }

    function test_Constructor_SetsFeeCollector() public view {
        assertEq(treasury.feeCollector(), feeCollector);
    }

    function test_Deposit_OnlyFeeCollector() public {
        vm.deal(feeCollector, 1 ether);
        vm.prank(feeCollector);
        treasury.deposit{value: 1 ether}();
        assertEq(treasury.balance(), 1 ether);
    }

    function test_Deposit_RevertsNonFeeCollector() public {
        vm.deal(makeAddr("rando"), 1 ether);
        vm.prank(makeAddr("rando"));
        vm.expectRevert(OperationalTreasury.NotFeeCollector.selector);
        treasury.deposit{value: 1 ether}();
    }

    function test_ProposeExpenditure() public {
        vm.deal(feeCollector, 10 ether);
        vm.prank(feeCollector);
        treasury.deposit{value: 10 ether}();

        vm.prank(guardian1);
        uint256 proposalId = treasury.proposeExpenditure(recipient, 1 ether, bytes32("node hosting"));
        assertEq(proposalId, 1);
    }

    function test_ProposeExpenditure_RevertsNonGuardian() public {
        vm.deal(feeCollector, 10 ether);
        vm.prank(feeCollector);
        treasury.deposit{value: 10 ether}();

        vm.prank(makeAddr("rando"));
        vm.expectRevert(OperationalTreasury.NotGuardian.selector);
        treasury.proposeExpenditure(recipient, 1 ether, bytes32("node hosting"));
    }

    function test_ApproveExpenditure() public {
        vm.deal(feeCollector, 10 ether);
        vm.prank(feeCollector);
        treasury.deposit{value: 10 ether}();

        vm.prank(guardian1);
        uint256 id = treasury.proposeExpenditure(recipient, 1 ether, bytes32("node hosting"));

        vm.prank(guardian2);
        treasury.approveExpenditure(id);
        vm.prank(guardian3);
        treasury.approveExpenditure(id);
    }

    function test_ApproveExpenditure_RevertsDoubleApproval() public {
        vm.deal(feeCollector, 10 ether);
        vm.prank(feeCollector);
        treasury.deposit{value: 10 ether}();

        vm.prank(guardian1);
        uint256 id = treasury.proposeExpenditure(recipient, 1 ether, bytes32("node hosting"));

        vm.prank(guardian2);
        treasury.approveExpenditure(id);

        vm.prank(guardian2);
        vm.expectRevert(OperationalTreasury.AlreadyApproved.selector);
        treasury.approveExpenditure(id);
    }

    function test_ExecuteExpenditure() public {
        vm.deal(feeCollector, 10 ether);
        vm.prank(feeCollector);
        treasury.deposit{value: 10 ether}();

        vm.prank(guardian1);
        uint256 id = treasury.proposeExpenditure(recipient, 1 ether, bytes32("node hosting"));

        vm.prank(guardian2);
        treasury.approveExpenditure(id);
        vm.prank(guardian3);
        treasury.approveExpenditure(id);
        vm.prank(guardian1);
        treasury.approveExpenditure(id);

        vm.prank(guardian1);
        treasury.executeExpenditure(id);

        assertEq(address(recipient).balance, 1 ether);
    }

    function test_ExecuteExpenditure_RevertsInsufficientApprovals() public {
        vm.deal(feeCollector, 10 ether);
        vm.prank(feeCollector);
        treasury.deposit{value: 10 ether}();

        vm.prank(guardian1);
        uint256 id = treasury.proposeExpenditure(recipient, 1 ether, bytes32("node hosting"));

        vm.prank(guardian2);
        treasury.approveExpenditure(id);

        // Only 2 approvals, threshold is 3
        vm.prank(guardian1);
        vm.expectRevert(OperationalTreasury.InsufficientApprovals.selector);
        treasury.executeExpenditure(id);
    }

    function test_ExecuteExpenditure_RevertsAlreadyExecuted() public {
        vm.deal(feeCollector, 10 ether);
        vm.prank(feeCollector);
        treasury.deposit{value: 10 ether}();

        vm.prank(guardian1);
        uint256 id = treasury.proposeExpenditure(recipient, 1 ether, bytes32("node hosting"));

        vm.prank(guardian2);
        treasury.approveExpenditure(id);
        vm.prank(guardian3);
        treasury.approveExpenditure(id);
        vm.prank(guardian1);
        treasury.approveExpenditure(id);

        vm.prank(guardian1);
        treasury.executeExpenditure(id);

        vm.expectRevert(OperationalTreasury.AlreadyExecuted.selector);
        vm.prank(guardian1);
        treasury.executeExpenditure(id);
    }

    function test_Pause_BlocksProposal() public {
        vm.deal(feeCollector, 10 ether);
        vm.prank(feeCollector);
        treasury.deposit{value: 10 ether}();

        vm.prank(guardian1);
        treasury.pause();

        vm.expectRevert(OperationalTreasury.Paused.selector);
        vm.prank(guardian1);
        treasury.proposeExpenditure(recipient, 1 ether, bytes32("node hosting"));
    }

    function test_Pause_RevertsNonGuardian() public {
        vm.prank(makeAddr("rando"));
        vm.expectRevert(OperationalTreasury.NotGuardian.selector);
        treasury.pause();
    }

    function test_ProposeExpenditure_RevertsInsufficientBalance() public {
        // No deposit made, balance is 0
        vm.prank(guardian1);
        vm.expectRevert(OperationalTreasury.InsufficientBalance.selector);
        treasury.proposeExpenditure(recipient, 1 ether, bytes32("node hosting"));
    }
}