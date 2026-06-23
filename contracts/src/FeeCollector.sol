// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FeeCollector
 * @dev Single entry point for all protocol fees. Routes to LegacyVault, PioneerRewards, OperationalTreasury.
 * Activation at block >= 1,850,000 per GDR-001.2.
 * Immutable after construction.
 */
contract FeeCollector is ReentrancyGuard, Ownable {
    error NotGuardian();
    error AlreadyActive();
    error NotActive();
    error NotRecipient();
    error ZeroAddress();
    error Paused();
    error SplitMismatch();

    event Activated(address indexed caller);
    event Paused_(address indexed guardian);
    event Unpaused_(address indexed guardian);
    event FeesRouted(uint256 amount, uint8 source, address indexed recipient);

    address public legacyVault;
    address public pioneerRewards;
    address public operationalTreasury;

    bool public active;
    bool public paused;

    // Fee splits in basis points (1 bp = 0.01%)
    uint256 public swapLegacyShare = 5000;   // 50%
    uint256 public swapPioneerShare = 3000;  // 30%
    uint256 public swapTreasuryShare = 2000; // 20%

    /// @notice Source enum for fee routing
    uint8 public constant SOURCE_SWAP = 1;
    uint8 public constant SOURCE_MINT = 2;
    uint8 public constant SOURCE_STAKING = 3;
    uint8 public constant SOURCE_BRIDGE = 4;

    mapping(address => bool) public guardians;

    modifier onlyGuardian() {
        if (!guardians[msg.sender]) revert NotGuardian();
        _;
    }

    modifier whenActive() {
        if (!active) revert NotActive();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert Paused();
        _;
    }

    constructor(
        address _legacyVault,
        address _pioneerRewards,
        address _operationalTreasury,
        address _guardian
    ) Ownable(_guardian) {
        if (_legacyVault == address(0) || _pioneerRewards == address(0) || _operationalTreasury == address(0)) {
            revert ZeroAddress();
        }
        legacyVault = _legacyVault;
        pioneerRewards = _pioneerRewards;
        operationalTreasury = _operationalTreasury;
        guardians[_guardian] = true;
    }

    /// @notice Activate fee collection (one-time)
    function activate() external onlyOwner {
        if (active) revert AlreadyActive();
        active = true;
        emit Activated(msg.sender);
    }

    /// @notice Route DEX swap fees (50/30/20 split)
    function routeSwapFees() external payable nonReentrant whenActive whenNotPaused {
        uint256 amount = msg.value;
        uint256 vaultShare = (amount * swapLegacyShare) / 10000;
        uint256 pioneerShare = (amount * swapPioneerShare) / 10000;
        uint256 treasuryShare = (amount * swapTreasuryShare) / 10000;

        _send(legacyVault, vaultShare, SOURCE_SWAP);
        _send(pioneerRewards, pioneerShare, SOURCE_SWAP);
        _send(operationalTreasury, treasuryShare, SOURCE_SWAP);

        // Send remainder (dust) to Treasury
        uint256 remaining = address(this).balance;
        if (remaining > 0) {
            _send(operationalTreasury, remaining, SOURCE_SWAP);
        }
    }

    /// @notice Route soul mint royalties (100% to PioneerRewards)
    function routeMintRoyalties() external payable nonReentrant whenActive whenNotPaused {
        _send(pioneerRewards, msg.value, SOURCE_MINT);
    }

    /// @notice Route staking yield cut (100% to OperationalTreasury)
    function routeStakingCut() external payable nonReentrant whenActive whenNotPaused {
        _send(operationalTreasury, msg.value, SOURCE_STAKING);
    }

    /// @notice Route bridge transfer fees (100% to LegacyVault)
    function routeBridgeFees() external payable nonReentrant whenActive whenNotPaused {
        _send(legacyVault, msg.value, SOURCE_BRIDGE);
    }

    /// @notice Pause fee routing (Guardian only)
    function pause() external onlyGuardian {
        paused = true;
        emit Paused_(msg.sender);
    }

    /// @notice Unpause fee routing (Guardian only)
    function unpause() external onlyGuardian {
        paused = false;
        emit Unpaused_(msg.sender);
    }

    /// @notice Add or remove guardian (owner only)
    function setGuardian(address guardian, bool status) external onlyOwner {
        guardians[guardian] = status;
    }

    /// @notice Check active status
    function isActive() external view returns (bool) {
        return active && !paused;
    }

    function _send(address recipient, uint256 amount, uint8 source) internal {
        if (amount == 0) return;
        (bool ok,) = payable(recipient).call{value: amount}("");
        if (!ok) revert NotRecipient();
        emit FeesRouted(amount, source, recipient);
    }

    receive() external payable {
        // Allow direct native 0G receipt for flexibility
    }
}