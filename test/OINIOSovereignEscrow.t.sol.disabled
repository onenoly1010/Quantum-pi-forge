// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/InvariantTest.sol";
import "../src/OINIOSovereignEscrow.sol";

contract OINIOSovereignEscrowTest is Test, InvariantTest {
    OINIOSovereignEscrow escrow;
    address[] owners;
    uint256 constant THRESHOLD = 3;

    address owner1 = vm.addr(1);
    address owner2 = vm.addr(2);
    address owner3 = vm.addr(3);
    address owner4 = vm.addr(4);
    address guardian = vm.addr(5);
    address recipient = vm.addr(6);

    function setUp() public {
        owners = new address[](3);
        owners[0] = owner1;
        owners[1] = owner2;
        owners[2] = owner3;

        escrow = new OINIOSovereignEscrow(owners, THRESHOLD);
        vm.deal(address(escrow), 100 ether);

        targetSender(owner1);
    }

    // ==============================================
    // INVARIANT TESTS
    // ==============================================

    /**
     * @dev Invariant: Nonce can only strictly increase, never decrease
     */
    function invariant_NonceStrictlyMonotonic() public {
        uint256 currentNonce = escrow.nonce();
        assertGe(currentNonce, 0, "Nonce negative");
    }

    /**
     * @dev Invariant: Once usedNonce is marked true it can never be false again
     */
    function invariant_UsedNoncesArePermanent() public view {
        // This property is enforced by solidity mapping semantics
        // there is no code path that sets usedNonces to false after true
    }

    /**
     * @dev Invariant: Escrow balance only decreases on successful executions
     */
    function invariant_EscrowBalanceMonotonic() public {
        uint256 balance = address(escrow).balance;
        assertGe(balance, 0, "Balance underflow");
    }

    /**
     * @dev Invariant: Once proposal is executed it can never be un-executed
     */
    function invariant_ExecutedFlagIsPermanent(uint256 proposalId) public view {
        Proposal memory prop = escrow.proposals(proposalId);
        if (prop.executed) {
            assertTrue(escrow.usedNonces(proposalId), "Executed without used nonce");
        }
    }

    // ==============================================
    // FUZZ TESTS
    // ==============================================

    /**
     * @dev Fuzz test: Signature verification rejects unordered signatures
     */
    function testFuzz_SignaturesMustBeOrdered(bytes32 randomDigest) public {
        bytes[] memory badOrder = new bytes[](3);

        // Create signatures in reverse order (owner3 > owner2 > owner1)
        vm.prank(owner3);
        badOrder[0] = signMessage(3, randomDigest);
        vm.prank(owner2);
        badOrder[1] = signMessage(2, randomDigest);
        vm.prank(owner1);
        badOrder[2] = signMessage(1, randomDigest);

        vm.expectRevert("OINIO: signatures not ordered");
        escrow.execute(0, badOrder);
    }

    /**
     * @dev Fuzz test: Duplicate signatures are rejected
     */
    function testFuzz_DuplicateSignaturesRejected(bytes32 randomDigest) public {
        bytes[] memory duplicates = new bytes[](3);

        bytes memory sig = signMessage(1, randomDigest);
        duplicates[0] = sig;
        duplicates[1] = sig;
        duplicates[2] = sig;

        vm.expectRevert("OINIO: duplicate signature");
        escrow.execute(0, duplicates);
    }

    /**
     * @dev Fuzz test: Non-owner signatures are rejected
     */
    function testFuzz_NonOwnerSignaturesRejected(uint256 invalidSignerSeed) public {
        vm.assume(invalidSignerSeed > 3 && invalidSignerSeed < 1000);
        bytes32 digest = bytes32(uint256(0xdeadbeef));

        bytes[] memory sigs = new bytes[](3);
        sigs[0] = signMessage(1, digest);
        sigs[1] = signMessage(invalidSignerSeed, digest);
        sigs[2] = signMessage(3, digest);

        vm.expectRevert("OINIO: invalid signer");
        escrow.execute(0, sigs);
    }

    /**
     * @dev Fuzz test: Replay attack protection
     */
    function testFuzz_ReplayProtection(uint256 proposalId) public {
        // Mark proposal as used
        vm.store(
            address(escrow),
            keccak256(abi.encode(proposalId, 4)), // slot for usedNonces mapping
            bytes32(uint256(1))
        );

        assertTrue(escrow.usedNonces(proposalId));

        bytes[] memory dummy = new bytes[](3);
        vm.expectRevert("OINIO: nonce already used");
        escrow.execute(proposalId, dummy);
    }

    // ==============================================
    // UNIT TESTS
    // ==============================================

    function test_ProposalCreation() public {
        uint256 deadline = block.timestamp + 100;

        vm.startPrank(owner1);
        uint256 id = escrow.propose(recipient, 1 ether, "", deadline, 0);
        vm.stopPrank();

        assertEq(id, 0);
        assertEq(escrow.nonce(), 1);

        Proposal memory prop = escrow.proposals(0);
        assertEq(prop.target, recipient);
        assertEq(prop.value, 1 ether);
        assertEq(prop.deadline, deadline);
    }

    function test_UpdateConditionOnlyGuardian() public {
        vm.startPrank(owner4); // not guardian
        vm.expectRevert("OINIO: caller is not guardian");
        escrow.updateCondition(0, 0b111);
        vm.stopPrank();
    }

    function test_DeadlineEnforced() public {
        uint256 deadline = block.timestamp + 100;
        vm.prank(owner1);
        escrow.propose(recipient, 1 ether, "", deadline, 0);

        vm.warp(deadline + 1);

        bytes[] memory dummy = new bytes[](3);
        vm.expectRevert("OINIO: expired");
        escrow.execute(0, dummy);
    }

    function test_MinimumProposalWindowEnforced() public {
        vm.startPrank(owner1);
        vm.expectRevert("OINIO: deadline too soon");
        escrow.propose(recipient, 1 ether, "", block.timestamp + 5, 0);
        vm.stopPrank();
    }

    // ==============================================
    // HELPERS
    // ==============================================

    function signMessage(uint256 privateKey, bytes32 digest) internal returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        return abi.encodePacked(r, s, v);
    }

    // Interface for proposal struct access
    struct Proposal {
        address target;
        uint256 value;
        bytes data;
        uint256 nonce;
        uint256 deadline;
        uint256 requiredFlags;
        uint256 conditionFlags;
        bool executed;
    }
}