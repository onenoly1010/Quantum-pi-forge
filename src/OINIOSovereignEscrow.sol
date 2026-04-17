// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/**
 * @title OINIOSovereignEscrow
 * @dev Sovereign Multisig Escrow for Quantum Pi Forge / OINIO Ecosystem
 * Tier A Audit Ready Implementation
 * Features: Linear nonce replay protection, ordered signature verification,
 * bitmask conditionality, temporal bounds, guardian governance
 */
contract OINIOSovereignEscrow is EIP712, Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    bytes32 public constant PROPOSAL_TYPEHASH = keccak256(
        "Proposal(address target,uint256 value,bytes data,uint256 nonce,uint256 deadline,uint256 requiredFlags)"
    );

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

    // State
    address[] public owners;
    uint256 public immutable threshold;
    uint256 public nonce;
    uint256 public constant MIN_PROPOSAL_WINDOW = 10; // ~150 seconds at 15s blocks

    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool) public isOwner;
    mapping(address => bool) public isGuardian;
    mapping(uint256 => bool) public usedNonces;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        address target,
        uint256 value,
        uint256 nonce,
        uint256 deadline,
        uint256 requiredFlags
    );

    event ProposalExecuted(
        uint256 indexed proposalId,
        bool indexed success,
        bytes result
    );

    event ConditionUpdated(
        uint256 indexed proposalId,
        uint256 oldFlags,
        uint256 newFlags
    );

    event GuardianAdded(address indexed guardian);
    event GuardianRemoved(address indexed guardian);

    modifier onlyGuardian() {
        require(isGuardian[msg.sender], "OINIO: caller is not guardian");
        _;
    }

    /**
     * @param _owners Array of initial owner addresses
     * @param _threshold Minimum number of signatures required
     */
    constructor(address[] memory _owners, uint256 _threshold)
        EIP712("OINIOSovereignEscrow", "1.0")
        Ownable(msg.sender)
    {
        require(_owners.length >= _threshold, "OINIO: threshold > owners");
        require(_threshold > 0, "OINIO: threshold 0");

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "OINIO: zero owner");
            require(!isOwner[owner], "OINIO: duplicate owner");
            isOwner[owner] = true;
        }

        owners = _owners;
        threshold = _threshold;
        isGuardian[msg.sender] = true;
    }

    /**
     * @dev Create a new proposal
     * @param target Target address to call
     * @param value Ether value to send
     * @param data Calldata for execution
     * @param deadline Timestamp after which proposal is invalid
     * @param requiredFlags Bitmask of conditions required for execution
     * @return proposalId ID of created proposal
     */
    function propose(
        address target,
        uint256 value,
        bytes calldata data,
        uint256 deadline,
        uint256 requiredFlags
    ) external returns (uint256 proposalId) {
        require(isOwner[msg.sender], "OINIO: not owner");
        require(
            deadline > block.timestamp + MIN_PROPOSAL_WINDOW,
            "OINIO: deadline too soon"
        );

        proposalId = nonce;
        nonce++;

        proposals[proposalId] = Proposal({
            target: target,
            value: value,
            data: data,
            nonce: proposalId,
            deadline: deadline,
            requiredFlags: requiredFlags,
            conditionFlags: 0,
            executed: false
        });

        emit ProposalCreated(
            proposalId,
            msg.sender,
            target,
            value,
            proposalId,
            deadline,
            requiredFlags
        );
    }

    /**
     * @dev Execute a proposal with valid signatures
     * @param proposalId ID of proposal to execute
     * @param signatures Array of ordered signatures from owners
     */
    function execute(uint256 proposalId, bytes[] calldata signatures)
        external
        nonReentrant
    {
        Proposal storage prop = proposals[proposalId];

        require(!prop.executed, "OINIO: already executed");
        require(!usedNonces[proposalId], "OINIO: nonce already used");
        require(block.timestamp <= prop.deadline, "OINIO: expired");

        // Verify conditions: required flags must be set in conditionFlags
        require(
            (prop.conditionFlags & prop.requiredFlags) == prop.requiredFlags,
            "OINIO: conditions not met"
        );

        // Verify signatures
        bytes32 digest = _hashProposal(prop);
        _verifySignatures(digest, signatures);

        // CONSUME NONCE IMMEDIATELY AFTER VALIDATION (FIX 1)
        // This prevents replay even if external call reverts
        usedNonces[proposalId] = true;
        prop.executed = true;

        // External call
        (bool success, bytes memory result) = prop.target.call{value: prop.value}(prop.data);

        emit ProposalExecuted(proposalId, success, result);

        // We do NOT revert on external failure - nonce is already consumed
    }

    /**
     * @dev Update condition flags for a proposal
     * @param proposalId ID of proposal
     * @param flags Bitmask flags to set
     */
    function updateCondition(uint256 proposalId, uint256 flags)
        external
        onlyGuardian
    {
        Proposal storage prop = proposals[proposalId];
        require(!prop.executed, "OINIO: already executed");

        uint256 oldFlags = prop.conditionFlags;
        prop.conditionFlags = flags;

        emit ConditionUpdated(proposalId, oldFlags, flags);
    }

    /**
     * @dev Verify ordered unique signatures from owners
     * @param digest Hash of proposal
     * @param signatures Array of signatures
     */
    function _verifySignatures(bytes32 digest, bytes[] calldata signatures)
        internal
        view
    {
        // Prevent padding attacks: exactly threshold signatures required, no extras
        require(signatures.length == threshold, "OINIO: exactly threshold signatures required");
        require(threshold > 0, "OINIO: threshold not set");

        address lastSigner = address(0);

        // Use memory mapping for temporary duplicate tracking
        bool[] memory seen = new bool[](owners.length);

        for (uint256 i = 0; i < signatures.length; i++) {
            address signer = digest.recover(signatures[i]);

            // Find owner index
            uint256 ownerIndex = type(uint256).max;
            for (uint256 j = 0; j < owners.length; j++) {
                if (owners[j] == signer) {
                    ownerIndex = j;
                    break;
                }
            }

            require(ownerIndex != type(uint256).max, "OINIO: invalid signer");
            require(signer > lastSigner, "OINIO: signatures must be strictly ordered");
            require(!seen[ownerIndex], "OINIO: duplicate signature");

            seen[ownerIndex] = true;
            lastSigner = signer;
        }
    }

    /**
     * @dev Hash proposal for signature verification
     * @param prop Proposal to hash
     * @return EIP712 digest
     */
    function _hashProposal(Proposal memory prop)
        internal
        view
        returns (bytes32)
    {
        return _hashTypedDataV4(
            keccak256(abi.encode(
                PROPOSAL_TYPEHASH,
                prop.target,
                prop.value,
                keccak256(prop.data),
                prop.nonce,
                prop.deadline,
                prop.requiredFlags
            ))
        );
    }

    /**
     * @dev Add a guardian address
     * @param guardian Address to add as guardian
     */
    function addGuardian(address guardian) external onlyOwner {
        require(guardian != address(0), "OINIO: zero address");
        isGuardian[guardian] = true;
        emit GuardianAdded(guardian);
    }

    /**
     * @dev Remove a guardian address
     * @param guardian Address to remove from guardians
     */
    function removeGuardian(address guardian) external onlyOwner {
        isGuardian[guardian] = false;
        emit GuardianRemoved(guardian);
    }

    receive() external payable {}
}