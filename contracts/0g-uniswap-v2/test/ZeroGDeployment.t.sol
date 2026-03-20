// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/W0G.sol";

/**
 * @title ZeroGDeployment Tests
 * @notice Comprehensive test suite for 0G Uniswap V2 deployment
 * @dev Tests W0G functionality and prepares for full Uniswap V2 testing
 */
contract ZeroGDeploymentTest is Test {
    W0G public w0g;
    address public alice;
    address public bob;

    event Deposit(address indexed dst, uint256 wad);
    event Withdrawal(address indexed src, uint256 wad);
    event Transfer(address indexed src, address indexed dst, uint256 wad);
    event Approval(address indexed src, address indexed guy, uint256 wad);

    function setUp() public {
        // Deploy W0G contract
        w0g = new W0G();

        // Create test accounts with 0G
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
    }

    // =============================================================================
    // W0G Basic Tests
    // =============================================================================

    function testW0GDeployment() public {
        assertEq(w0g.name(), "Wrapped 0G");
        assertEq(w0g.symbol(), "W0G");
        assertEq(w0g.decimals(), 18);
        assertEq(w0g.totalSupply(), 0);
    }

    function testW0GDeposit() public {
        vm.startPrank(alice);
        
        uint256 depositAmount = 10 ether;
        
        vm.expectEmit(true, false, false, true);
        emit Deposit(alice, depositAmount);
        
        w0g.deposit{value: depositAmount}();
        
        assertEq(w0g.balanceOf(alice), depositAmount);
        assertEq(w0g.totalSupply(), depositAmount);
        assertEq(address(w0g).balance, depositAmount);
        
        vm.stopPrank();
    }

    function testW0GDepositViaFallback() public {
        vm.startPrank(alice);
        
        uint256 depositAmount = 5 ether;
        
        vm.expectEmit(true, false, false, true);
        emit Deposit(alice, depositAmount);
        
        (bool success, ) = address(w0g).call{value: depositAmount}("");
        assertTrue(success);
        
        assertEq(w0g.balanceOf(alice), depositAmount);
        assertEq(w0g.totalSupply(), depositAmount);
        
        vm.stopPrank();
    }

    function testW0GWithdrawal() public {
        vm.startPrank(alice);
        
        uint256 depositAmount = 10 ether;
        w0g.deposit{value: depositAmount}();
        
        uint256 withdrawAmount = 3 ether;
        uint256 aliceBalanceBefore = alice.balance;
        
        vm.expectEmit(true, false, false, true);
        emit Withdrawal(alice, withdrawAmount);
        
        w0g.withdraw(withdrawAmount);
        
        assertEq(w0g.balanceOf(alice), depositAmount - withdrawAmount);
        assertEq(alice.balance, aliceBalanceBefore + withdrawAmount);
        assertEq(w0g.totalSupply(), depositAmount - withdrawAmount);
        
        vm.stopPrank();
    }

    function testW0GWithdrawInsufficientBalance() public {
        vm.startPrank(alice);
        
        w0g.deposit{value: 5 ether}();
        
        vm.expectRevert("W0G: insufficient balance");
        w0g.withdraw(10 ether);
        
        vm.stopPrank();
    }

    // =============================================================================
    // W0G Transfer Tests
    // =============================================================================

    function testW0GTransfer() public {
        vm.startPrank(alice);
        
        w0g.deposit{value: 10 ether}();
        
        uint256 transferAmount = 4 ether;
        
        vm.expectEmit(true, true, false, true);
        emit Transfer(alice, bob, transferAmount);
        
        assertTrue(w0g.transfer(bob, transferAmount));
        
        assertEq(w0g.balanceOf(alice), 6 ether);
        assertEq(w0g.balanceOf(bob), 4 ether);
        
        vm.stopPrank();
    }

    function testW0GTransferInsufficientBalance() public {
        vm.startPrank(alice);
        
        w0g.deposit{value: 5 ether}();
        
        vm.expectRevert("W0G: insufficient balance");
        w0g.transfer(bob, 10 ether);
        
        vm.stopPrank();
    }

    // =============================================================================
    // W0G Approval Tests
    // =============================================================================

    function testW0GApprove() public {
        vm.startPrank(alice);
        
        uint256 approvalAmount = 5 ether;
        
        vm.expectEmit(true, true, false, true);
        emit Approval(alice, bob, approvalAmount);
        
        assertTrue(w0g.approve(bob, approvalAmount));
        
        assertEq(w0g.allowance(alice, bob), approvalAmount);
        
        vm.stopPrank();
    }

    function testW0GTransferFrom() public {
        vm.startPrank(alice);
        w0g.deposit{value: 10 ether}();
        w0g.approve(bob, 5 ether);
        vm.stopPrank();
        
        vm.startPrank(bob);
        
        uint256 transferAmount = 3 ether;
        
        vm.expectEmit(true, true, false, true);
        emit Transfer(alice, bob, transferAmount);
        
        assertTrue(w0g.transferFrom(alice, bob, transferAmount));
        
        assertEq(w0g.balanceOf(alice), 7 ether);
        assertEq(w0g.balanceOf(bob), 3 ether);
        assertEq(w0g.allowance(alice, bob), 2 ether);
        
        vm.stopPrank();
    }

    function testW0GTransferFromInsufficientAllowance() public {
        vm.startPrank(alice);
        w0g.deposit{value: 10 ether}();
        w0g.approve(bob, 2 ether);
        vm.stopPrank();
        
        vm.startPrank(bob);
        
        vm.expectRevert("W0G: insufficient allowance");
        w0g.transferFrom(alice, bob, 5 ether);
        
        vm.stopPrank();
    }

    function testW0GTransferFromWithMaxApproval() public {
        vm.startPrank(alice);
        w0g.deposit{value: 10 ether}();
        w0g.approve(bob, type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(bob);
        
        assertTrue(w0g.transferFrom(alice, bob, 5 ether));
        
        // Max approval should not decrease
        assertEq(w0g.allowance(alice, bob), type(uint256).max);
        assertEq(w0g.balanceOf(bob), 5 ether);
        
        vm.stopPrank();
    }

    // =============================================================================
    // W0G Edge Cases
    // =============================================================================

    function testW0GZeroAmountDeposit() public {
        vm.startPrank(alice);
        
        w0g.deposit{value: 0}();
        
        assertEq(w0g.balanceOf(alice), 0);
        assertEq(w0g.totalSupply(), 0);
        
        vm.stopPrank();
    }

    function testW0GMultipleDepositsAndWithdrawals() public {
        vm.startPrank(alice);
        
        w0g.deposit{value: 5 ether}();
        assertEq(w0g.balanceOf(alice), 5 ether);
        
        w0g.deposit{value: 3 ether}();
        assertEq(w0g.balanceOf(alice), 8 ether);
        
        w0g.withdraw(2 ether);
        assertEq(w0g.balanceOf(alice), 6 ether);
        
        w0g.deposit{value: 1 ether}();
        assertEq(w0g.balanceOf(alice), 7 ether);
        
        assertEq(w0g.totalSupply(), 7 ether);
        
        vm.stopPrank();
    }

    function testW0GTransferToSelf() public {
        vm.startPrank(alice);
        
        w0g.deposit{value: 10 ether}();
        
        assertTrue(w0g.transfer(alice, 5 ether));
        
        // Balance should remain the same
        assertEq(w0g.balanceOf(alice), 10 ether);
        
        vm.stopPrank();
    }

    // =============================================================================
    // Fuzz Tests
    // =============================================================================

    function testFuzzW0GDeposit(uint96 amount) public {
        vm.assume(amount > 0 && amount < 100 ether);
        
        vm.deal(alice, amount);
        vm.startPrank(alice);
        
        w0g.deposit{value: amount}();
        
        assertEq(w0g.balanceOf(alice), amount);
        assertEq(w0g.totalSupply(), amount);
        
        vm.stopPrank();
    }

    function testFuzzW0GTransfer(uint96 depositAmount, uint96 transferAmount) public {
        vm.assume(depositAmount > 0 && depositAmount < 100 ether);
        vm.assume(transferAmount > 0 && transferAmount <= depositAmount);
        
        vm.deal(alice, depositAmount);
        vm.startPrank(alice);
        
        w0g.deposit{value: depositAmount}();
        w0g.transfer(bob, transferAmount);
        
        assertEq(w0g.balanceOf(alice), depositAmount - transferAmount);
        assertEq(w0g.balanceOf(bob), transferAmount);
        
        vm.stopPrank();
    }

    // =============================================================================
    // Gas Optimization Tests
    // =============================================================================

    function testW0GGasUsage() public {
        vm.startPrank(alice);
        
        uint256 gasBefore = gasleft();
        w0g.deposit{value: 1 ether}();
        uint256 gasUsed = gasBefore - gasleft();
        
        // Log gas usage for optimization tracking
        emit log_named_uint("Deposit gas used", gasUsed);
        
        gasBefore = gasleft();
        w0g.transfer(bob, 0.5 ether);
        gasUsed = gasBefore - gasleft();
        
        emit log_named_uint("Transfer gas used", gasUsed);
        
        vm.stopPrank();
    }
}
