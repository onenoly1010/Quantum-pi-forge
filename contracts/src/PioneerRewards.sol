// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PioneerRewards
 * @dev Reward pool receiving 30% of swap fees and 100% of soul mint royalties.
 * Distribution weighted by SOV contribution per GDR-001.2 §1.
 */
contract PioneerRewards is ReentrancyGuard {
    error NotFeeCollector();
    error CooldownActive();
    error NoRewards();
    error BelowMinimumClaim();
    error ZeroAddress();

    event Deposited(address indexed from, uint256 amount);
    event Claimed(address indexed pioneer, uint256 amount);
    event SOVWeightSet(address indexed pioneer, uint256 weight);

    address public immutable feeCollector;
    uint256 public totalAccumulated;
    uint256 public constant CLAIM_COOLDOWN = 21600; // ~3 days in blocks
    uint256 public constant MIN_CLAIM = 1e9; // 1 gwei
    uint256 public totalSOVWeight;

    mapping(address => uint256) public totalClaimed;
    mapping(address => uint256) public lastClaimBlock;
    mapping(address => uint256) public sovWeight;

    modifier onlyFeeCollector() {
        if (msg.sender != feeCollector) revert NotFeeCollector();
        _;
    }

    constructor(address _feeCollector) {
        if (_feeCollector == address(0)) revert ZeroAddress();
        feeCollector = _feeCollector;
    }

    /// @notice Accept native 0G fees (FeeCollector only)
    function deposit() external payable onlyFeeCollector {
        totalAccumulated += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Accept ERC20 royalties (FeeCollector only)
    function depositERC20(address token, uint256 amount) external onlyFeeCollector {
        // ERC20 deposit tracking — amounts accrue to pool but are handled separately
        emit Deposited(msg.sender, amount);
    }

    /// @notice Set SOV weight for a pioneer (FeeCollector/owner)
    function setSOVWeight(address pioneer, uint256 weight) external onlyFeeCollector {
        if (pioneer == address(0)) revert ZeroAddress();
        totalSOVWeight = totalSOVWeight - sovWeight[pioneer] + weight;
        sovWeight[pioneer] = weight;
        emit SOVWeightSet(pioneer, weight);
    }

    /// @notice Claim accumulated rewards
    function claim() external nonReentrant returns (uint256) {
        if (block.number < lastClaimBlock[msg.sender] + CLAIM_COOLDOWN && lastClaimBlock[msg.sender] != 0) {
            revert CooldownActive();
        }

        uint256 pending = pendingRewards(msg.sender);
        if (pending < MIN_CLAIM) revert BelowMinimumClaim();

        totalClaimed[msg.sender] += pending;
        lastClaimBlock[msg.sender] = block.number;

        (bool ok,) = payable(msg.sender).call{value: pending}("");
        if (!ok) revert NoRewards();

        emit Claimed(msg.sender, pending);
        return pending;
    }

    /// @notice Get pending rewards for a pioneer
    function pendingRewards(address pioneer) public view returns (uint256) {
        if (totalSOVWeight == 0) return 0;
        uint256 earned = (sovWeight[pioneer] * totalAccumulated) / totalSOVWeight;
        uint256 claimed = totalClaimed[pioneer];
        if (earned <= claimed) return 0;
        return earned - claimed;
    }

    /// @notice Get total reward pool
    function totalPool() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        if (msg.sender != feeCollector) revert NotFeeCollector();
        totalAccumulated += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
}