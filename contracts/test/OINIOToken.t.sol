// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/OINIOToken.sol";

contract OINIOTokenTest is Test {
    OINIOToken public token;
    address public owner;
    address public user1;
    address public user2;

    uint256 constant INITIAL_SUPPLY = 1_000_000_000 * 10**18;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        token = new OINIOToken(owner);
    }

    function testDeployment() public {
        assertEq(token.name(), "OINIO Token");
        assertEq(token.symbol(), "OINIO");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY);
    }

    function testOwnership() public {
        assertEq(token.owner(), owner);
    }

    function testTransfer() public {
        uint256 amount = 1000 * 10**18;
        
        token.transfer(user1, amount);
        
        assertEq(token.balanceOf(user1), amount);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - amount);
    }

    function testTransferFrom() public {
        uint256 amount = 1000 * 10**18;
        
        // Owner approves user1 to spend tokens
        token.approve(user1, amount);
        assertEq(token.allowance(owner, user1), amount);
        
        // user1 transfers tokens from owner to user2
        vm.prank(user1);
        token.transferFrom(owner, user2, amount);
        
        assertEq(token.balanceOf(user2), amount);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - amount);
        assertEq(token.allowance(owner, user1), 0);
    }

    function testApprove() public {
        uint256 amount = 1000 * 10**18;
        
        token.approve(user1, amount);
        
        assertEq(token.allowance(owner, user1), amount);
    }

    function testBurn() public {
        uint256 burnAmount = 1000 * 10**18;
        uint256 initialBalance = token.balanceOf(owner);
        uint256 initialSupply = token.totalSupply();
        
        token.burn(burnAmount);
        
        assertEq(token.balanceOf(owner), initialBalance - burnAmount);
        assertEq(token.totalSupply(), initialSupply - burnAmount);
    }

    function testBurnFrom() public {
        uint256 burnAmount = 1000 * 10**18;
        
        // Transfer some tokens to user1
        token.transfer(user1, burnAmount * 2);
        
        // user1 approves owner to burn their tokens
        vm.prank(user1);
        token.approve(owner, burnAmount);
        
        uint256 user1BalanceBefore = token.balanceOf(user1);
        uint256 totalSupplyBefore = token.totalSupply();
        
        // Owner burns user1's tokens
        token.burnFrom(user1, burnAmount);
        
        assertEq(token.balanceOf(user1), user1BalanceBefore - burnAmount);
        assertEq(token.totalSupply(), totalSupplyBefore - burnAmount);
    }

    function testTransferFailsWithInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert();
        token.transfer(user2, 1000 * 10**18);
    }

    function testTransferFromFailsWithoutApproval() public {
        vm.prank(user1);
        vm.expectRevert();
        token.transferFrom(owner, user2, 1000 * 10**18);
    }

    function testBurnFailsWithInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert();
        token.burn(1000 * 10**18);
    }

    function testOwnerCanTransferOwnership() public {
        token.transferOwnership(user1);
        assertEq(token.owner(), user1);
    }

    function testNonOwnerCannotTransferOwnership() public {
        vm.prank(user1);
        vm.expectRevert();
        token.transferOwnership(user2);
    }

    function testTotalSupplyIsFixed() public {
        // No minting function exists, supply should remain constant unless burned
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        
        // Even owner cannot mint more
        // This is implicit as there's no mint function
    }

    function testMultipleTransfers() public {
        uint256 amount = 100 * 10**18;
        
        token.transfer(user1, amount);
        token.transfer(user2, amount);
        
        assertEq(token.balanceOf(user1), amount);
        assertEq(token.balanceOf(user2), amount);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - (amount * 2));
    }

    function testLargeTransfer() public {
        uint256 largeAmount = INITIAL_SUPPLY / 2;
        
        token.transfer(user1, largeAmount);
        
        assertEq(token.balanceOf(user1), largeAmount);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - largeAmount);
    }
}
