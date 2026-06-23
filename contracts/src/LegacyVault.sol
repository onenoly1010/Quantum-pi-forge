// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title LegacyVault
 * @dev 200-year timelock vault. Receives 50% of swap fees and 100% of bridge fees.
 * No keys, no admin, no backdoors until unlock block ~73,050,000.
 * Per GDR-001.2 §3: "The Legacy Vault receives 50% of all swap fees in perpetuity."
 */
contract LegacyVault {
    error NotFeeCollector();
    error NotYetUnlocked();
    error AlreadyDistributed();
    error NoSoulNodes();

    event Deposited(address indexed from, uint256 amount);
    event Distributed(uint256 totalAmount, uint256 soulNodeCount);

    address public immutable feeCollector;
    uint256 public constant UNLOCK_BLOCK = 73050000;
    uint256 public startBlock;
    uint256 public totalDeposited;
    bool public distributed;

    mapping(address => uint256) public soulNodeShares;

    modifier onlyFeeCollector() {
        if (msg.sender != feeCollector) revert NotFeeCollector();
        _;
    }

    constructor(address _feeCollector) {
        feeCollector = _feeCollector;
    }

    /// @notice Accept native 0G deposit (only FeeCollector)
    function deposit() external payable onlyFeeCollector {
        if (startBlock == 0) {
            startBlock = block.number;
        }
        totalDeposited += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Get current vault balance
    function balance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Get unlock block height
    function unlockBlock() external view returns (uint256) {
        return UNLOCK_BLOCK;
    }

    /// @notice Distribute to Soul Nodes at maturity (anyone can call after unlock)
    function distribute() external {
        if (block.number < UNLOCK_BLOCK) revert NotYetUnlocked();
        if (distributed) revert AlreadyDistributed();
        distributed = true;

        uint256 totalBalance = address(this).balance;
        if (totalBalance == 0) revert NoSoulNodes();

        emit Distributed(totalBalance, 0);
        // Note: soulNodeShares mapping must be populated by governance before distribution.
        // For now, this is a placeholder that emits the event.
        // Actual distribution logic requires Soul Node registry integration.
    }

    receive() external payable {
        // Accept native 0G from FeeCollector only
        if (msg.sender != feeCollector) revert NotFeeCollector();
        if (startBlock == 0) {
            startBlock = block.number;
        }
        totalDeposited += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
}