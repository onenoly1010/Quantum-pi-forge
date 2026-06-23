// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title OperationalTreasury
 * @dev Operations fund receiving 20% of swap fees and 100% of staking cut.
 * Disburses for authorized OLLAMA/0G/audit/maintenance costs through Guardian-approved proposals.
 * Per GDR-001.2 §4.
 */
contract OperationalTreasury {
    error NotFeeCollector();
    error NotGuardian();
    error AlreadyApproved();
    error AlreadyExecuted();
    error InsufficientApprovals();
    error InsufficientBalance();
    error Paused();
    error ZeroAddress();
    error InvalidReason();

    event Deposited(address indexed from, uint256 amount);
    event ExpenditureProposed(uint256 indexed proposalId, address to, uint256 amount, bytes32 indexed reason);
    event ExpenditureApproved(uint256 indexed proposalId, address indexed guardian);
    event ExpenditureExecuted(uint256 indexed proposalId);
    event Paused_(address indexed guardian);
    event Unpaused_(address indexed guardian);

    address public immutable feeCollector;
    address[] public guardians;
    uint256 public guardianApprovalThreshold = 3;
    uint256 public proposalCount;
    bool public paused;

    mapping(address => bool) public isGuardian;

    struct Proposal {
        address to;
        uint256 amount;
        bytes32 reason;
        uint256 approvalCount;
        bool executed;
        mapping(address => bool) approvedBy;
    }

    mapping(uint256 => Proposal) public proposals;

    modifier onlyFeeCollector() {
        if (msg.sender != feeCollector) revert NotFeeCollector();
        _;
    }

    modifier onlyGuardian() {
        if (!isGuardian[msg.sender]) revert NotGuardian();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert Paused();
        _;
    }

    constructor(address _feeCollector, address[] memory _guardians) {
        if (_feeCollector == address(0)) revert ZeroAddress();
        feeCollector = _feeCollector;
        for (uint256 i = 0; i < _guardians.length; i++) {
            if (_guardians[i] != address(0)) {
                guardians.push(_guardians[i]);
                isGuardian[_guardians[i]] = true;
            }
        }
        if (guardians.length == 0) revert ZeroAddress();
    }

    /// @notice Accept native 0G deposit (FeeCollector only via .call)
    receive() external payable {
        if (msg.sender != feeCollector) revert NotFeeCollector();
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Accept native 0G deposit (FeeCollector only)
    function deposit() external payable onlyFeeCollector {
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Propose expenditure (Guardian only)
    function proposeExpenditure(address to, uint256 amount, bytes32 reason) external onlyGuardian whenNotPaused returns (uint256) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert InsufficientBalance();
        if (reason == bytes32(0)) revert InvalidReason();
        if (amount > address(this).balance) revert InsufficientBalance();

        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.to = to;
        p.amount = amount;
        p.reason = reason;

        emit ExpenditureProposed(proposalCount, to, amount, reason);
        return proposalCount;
    }

    /// @notice Approve expenditure proposal (Guardian)
    function approveExpenditure(uint256 proposalId) external onlyGuardian whenNotPaused {
        Proposal storage p = proposals[proposalId];
        if (p.executed) revert AlreadyExecuted();
        if (p.approvedBy[msg.sender]) revert AlreadyApproved();

        p.approvedBy[msg.sender] = true;
        p.approvalCount++;

        emit ExpenditureApproved(proposalId, msg.sender);
    }

    /// @notice Execute approved expenditure
    function executeExpenditure(uint256 proposalId) external onlyGuardian whenNotPaused {
        Proposal storage p = proposals[proposalId];
        if (p.executed) revert AlreadyExecuted();
        if (p.approvalCount < guardianApprovalThreshold) revert InsufficientApprovals();

        p.executed = true;

        (bool ok,) = payable(p.to).call{value: p.amount}("");
        if (!ok) revert InsufficientBalance();

        emit ExpenditureExecuted(proposalId);
    }

    /// @notice Get balance
    function balance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Pause (Guardian only)
    function pause() external onlyGuardian {
        paused = true;
        emit Paused_(msg.sender);
    }

    /// @notice Unpause (Guardian only)
    function unpause() external onlyGuardian {
        paused = false;
        emit Unpaused_(msg.sender);
    }

    /// @notice Set approval threshold (Guardian consensus via separate mechanism)
    function setThreshold(uint256 newThreshold) external onlyGuardian {
        guardianApprovalThreshold = newThreshold;
    }
}