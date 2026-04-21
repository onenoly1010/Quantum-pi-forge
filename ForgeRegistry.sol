// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Quantum Pi Forge Registry
 * @dev Minimal sovereign guardian registry with idempotency and event stream
 *
 * Characteristics:
 * - No owner
 * - No admin
 * - No modification
 * - Permanent record
 * - Idempotent registration
 *
 * Deployed at 0G Aristotle Mainnet
 */
contract ForgeRegistry {

    /**
     * @dev Emitted when a new guardian is successfully registered
     * This is the only signal emitted from the contract
     */
    event GuardianActivated(
        address indexed guardian,
        uint256 timestamp
    );

    /// @dev Mapping of address to guardian status
    mapping(address => bool) public isGuardian;

    /// @dev Total count of unique registered guardians
    uint256 public totalGuardians;

    /**
     * @dev Register calling address as an active guardian
     * Can only be called once per address
     * Emits GuardianActivated event
     */
    function register() external {
        require(!isGuardian[msg.sender], "Forge: Already registered as guardian");

        isGuardian[msg.sender] = true;
        totalGuardians++;

        emit GuardianActivated(msg.sender, block.timestamp);
    }

    /**
     * @dev Prevent accidental ETH transfers
     */
    receive() external payable {
        revert("Forge: Contract does not accept ETH");
    }
}