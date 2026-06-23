// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {FeeCollector} from "../src/FeeCollector.sol";

contract FeeCollectorTest is Test {
    FeeCollector public collector;
    address public legacyVault;
    address public pioneerRewards;
    address public operationalTreasury;
    address public guardian;

    event Activated(address indexed caller);
    event Paused_(address indexed guardian);
    event Unpaused_(address indexed guardian);
    event FeesRouted(uint256 amount, uint8 source, address indexed recipient);

    function setUp() public {
        legacyVault = makeAddr("legacyVault");
        pioneerRewards = makeAddr("pioneerRewards");
        operationalTreasury = makeAddr("operationalTreasury");
        guardian = makeAddr("guardian");

        collector = new FeeCollector(legacyVault, pioneerRewards, operationalTreasury, guardian);
    }

    function test_Constructor_SetsAddresses() public view {
        assertEq(collector.legacyVault(), legacyVault);
        assertEq(collector.pioneerRewards(), pioneerRewards);
        assertEq(collector.operationalTreasury(), operationalTreasury);
    }

    function test_Constructor_RevertsZeroAddress() public {
        vm.expectRevert(FeeCollector.ZeroAddress.selector);
        new FeeCollector(address(0), pioneerRewards, operationalTreasury, guardian);
    }

    function test_Activate() public {
        vm.prank(guardian);
        collector.activate();
        assertTrue(collector.active());
    }

    function test_Activate_RevertsNotOwner() public {
        vm.prank(makeAddr("rando"));
        vm.expectRevert();
        collector.activate();
    }

    function test_RouteSwapFees_SplitsCorrectly() public {
        vm.prank(guardian);
        collector.activate();

        vm.deal(address(this), 1 ether);
        uint256 amount = 1 ether;

        vm.prank(address(this));
        (bool ok,) = address(collector).call{value: amount}(abi.encodeWithSignature("routeSwapFees()"));
        assertTrue(ok);

        uint256 vaultExpected = (amount * 5000) / 10000;
        uint256 pioneerExpected = (amount * 3000) / 10000;
        uint256 treasuryExpected = (amount * 2000) / 10000;

        assertEq(address(legacyVault).balance, vaultExpected);
        assertEq(address(pioneerRewards).balance, pioneerExpected);
        assertEq(address(operationalTreasury).balance, treasuryExpected);
    }

    function test_RouteSwapFees_RevertsWhenPaused() public {
        vm.prank(guardian);
        collector.activate();
        vm.prank(guardian);
        collector.pause();

        vm.prank(address(this));
        (bool ok,) = address(collector).call{value: 1 ether}(abi.encodeWithSignature("routeSwapFees()"));
        assertFalse(ok);
    }

    function test_Pause_Unpause() public {
        vm.prank(guardian);
        collector.activate();

        vm.prank(guardian);
        collector.pause();
        assertTrue(collector.paused());

        vm.prank(guardian);
        collector.unpause();
        assertFalse(collector.paused());
    }

    function test_Pause_RevertsNonGuardian() public {
        vm.prank(makeAddr("rando"));
        vm.expectRevert(FeeCollector.NotGuardian.selector);
        collector.pause();
    }

    function test_RouteMintRoyalties_SendsAllToPioneer() public {
        vm.prank(guardian);
        collector.activate();

        uint256 amount = 1 ether;
        vm.deal(address(this), amount);

        vm.prank(address(this));
        (bool ok,) = address(collector).call{value: amount}(abi.encodeWithSignature("routeMintRoyalties()"));
        assertTrue(ok);

        assertEq(address(pioneerRewards).balance, amount);
    }

    function test_RouteStakingCut_SendsAllToTreasury() public {
        vm.prank(guardian);
        collector.activate();

        uint256 amount = 1 ether;
        vm.deal(address(this), amount);

        vm.prank(address(this));
        (bool ok,) = address(collector).call{value: amount}(abi.encodeWithSignature("routeStakingCut()"));
        assertTrue(ok);

        assertEq(address(operationalTreasury).balance, amount);
    }

    function test_RouteBridgeFees_SendsAllToVault() public {
        vm.prank(guardian);
        collector.activate();

        uint256 amount = 1 ether;
        vm.deal(address(this), amount);

        vm.prank(address(this));
        (bool ok,) = address(collector).call{value: amount}(abi.encodeWithSignature("routeBridgeFees()"));
        assertTrue(ok);

        assertEq(address(legacyVault).balance, amount);
    }

    function test_IsActive_TrueWhenActiveAndNotPaused() public {
        vm.prank(guardian);
        collector.activate();
        assertTrue(collector.isActive());

        vm.prank(guardian);
        collector.pause();
        assertFalse(collector.isActive());

        vm.prank(guardian);
        collector.unpause();
        assertTrue(collector.isActive());
    }
}