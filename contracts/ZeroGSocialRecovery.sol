// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ZeroGSocialRecovery
 * @notice Safe-compatible social recovery for 0G wallets using the 
 *         existing ForgeRegistry guardian set.
 */
contract ZeroGSocialRecovery {

    // =========================================================================
    // Errors
    // =========================================================================
    error NotGuardian();
    error AlreadyVoted();
    error NoActiveRecovery();
    error RecoveryExists();
    error InsufficientApprovals(uint256 have, uint256 need);
    error ZeroAddress();
    error CallerNotWalletOwner();
    error RecoveryExpired();
    error InvalidThreshold();

    // =========================================================================
    // Events
    // =========================================================================
    event RecoveryRequested(
        address indexed wallet,
        address indexed newOwner,
        uint256 indexed recoveryNonce,
        uint256 threshold,
        uint256 expiry,
        address requestor
    );
    event GuardianApproved(
        address indexed wallet,
        address indexed guardian,
        uint256 indexed recoveryNonce
    );
    event RecoveryFinalized(
        address indexed wallet,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 recoveryNonce
    );
    event RecoveryCancelled(
        address indexed wallet,
        uint256 indexed recoveryNonce,
        string reason
    );
    event ThresholdChanged(
        address indexed wallet,
        uint256 oldThreshold,
        uint256 newThreshold
    );

    // =========================================================================
    // Structs
    // =========================================================================
    struct RecoveryRequest {
        address newOwner;
        uint256 threshold;
        uint256 expiry;
        uint256 guardianCount;
        bool executed;
        bool exists;
    }
    struct GuardianApproval {
        bool approved;
        uint256 timestamp;
    }

    // =========================================================================
    // EIP-712 Domain
    // =========================================================================
    bytes32 private constant DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );
    bytes32 private constant RECOVERY_TYPEHASH = keccak256(
        "RecoveryApproval(address wallet,address newOwner,uint256 nonce,uint256 expiry)"
    );
    bytes32 private immutable DOMAIN_SEPARATOR;

    // =========================================================================
    // State
    // =========================================================================
    IForgeRegistry public immutable forgeRegistry;
    uint256 public defaultThreshold;
    uint256 public recoveryTimeout;
    mapping(address => address) public walletOwners;
    mapping(address => uint256) public walletThreshold;
    mapping(address => mapping(uint256 => RecoveryRequest)) public recoveries;
    mapping(address => mapping(uint256 => mapping(address => GuardianApproval))) public approvals;
    mapping(address => uint256) public nonces;
    mapping(address => address) public ownerToWallet;

    // =========================================================================
    // Constructor
    // =========================================================================
    constructor(
        address _forgeRegistry,
        uint256 _defaultThreshold,
        uint256 _recoveryTimeout
    ) {
        if (_forgeRegistry == address(0)) revert ZeroAddress();
        if (_defaultThreshold == 0) revert InvalidThreshold();
        forgeRegistry = IForgeRegistry(_forgeRegistry);
        defaultThreshold = _defaultThreshold;
        recoveryTimeout = _recoveryTimeout;
        DOMAIN_SEPARATOR = keccak256(abi.encode(
            DOMAIN_TYPEHASH,
            keccak256(bytes("0G_SOCIAL_RECOVERY")),
            keccak256(bytes("1")),
            block.chainid,
            address(this)
        ));
    }

    // =========================================================================
    // Modifiers
    // =========================================================================
    modifier onlyWalletOwner(address wallet) {
        if (walletOwners[wallet] != msg.sender) revert CallerNotWalletOwner();
        _;
    }
    modifier onlyGuardian() {
        if (!forgeRegistry.isGuardian(msg.sender)) revert NotGuardian();
        _;
    }

    // =========================================================================
    // Wallet Setup
    // =========================================================================
    function initWallet(address wallet, address owner) external {
        if (walletOwners[wallet] != address(0)) revert("Wallet already initialized");
        if (owner == address(0)) revert ZeroAddress();
        walletOwners[wallet] = owner;
        ownerToWallet[owner] = wallet;
    }
    function rotateKey(address wallet, address newOwner) external onlyWalletOwner(wallet) {
        if (newOwner == address(0)) revert ZeroAddress();
        address oldOwner = walletOwners[wallet];
        walletOwners[wallet] = newOwner;
        delete ownerToWallet[oldOwner];
        ownerToWallet[newOwner] = wallet;
    }
    function setThreshold(address wallet, uint256 newThreshold) external onlyWalletOwner(wallet) {
        if (newThreshold == 0) revert InvalidThreshold();
        uint256 oldThreshold = walletThreshold[wallet];
        walletThreshold[wallet] = newThreshold;
        emit ThresholdChanged(wallet, oldThreshold, newThreshold);
    }

    // =========================================================================
    // Social Recovery Flow
    // =========================================================================
    function requestRecovery(address wallet, address newOwner) external {
        if (newOwner == address(0)) revert ZeroAddress();
        uint256 currentNonce = nonces[wallet];
        if (recoveries[wallet][currentNonce].exists) revert RecoveryExists();
        uint256 threshold = _getThreshold(wallet);
        if (threshold == 0) revert InvalidThreshold();
        RecoveryRequest storage req = recoveries[wallet][currentNonce];
        req.newOwner = newOwner;
        req.threshold = threshold;
        req.expiry = block.timestamp + recoveryTimeout;
        req.exists = true;
        emit RecoveryRequested(wallet, newOwner, currentNonce, threshold, req.expiry, msg.sender);
    }
    function approveRecovery(address wallet, uint256 recoveryNonce) external onlyGuardian {
        RecoveryRequest storage req = recoveries[wallet][recoveryNonce];
        if (!req.exists) revert NoActiveRecovery();
        if (req.executed) revert NoActiveRecovery();
        if (block.timestamp >= req.expiry) revert RecoveryExpired();
        GuardianApproval storage approval = approvals[wallet][recoveryNonce][msg.sender];
        if (approval.approved) revert AlreadyVoted();
        approval.approved = true;
        approval.timestamp = block.timestamp;
        req.guardianCount++;
        emit GuardianApproved(wallet, msg.sender, recoveryNonce);
    }
    function executeRecovery(address wallet, uint256 recoveryNonce) external {
        RecoveryRequest storage req = recoveries[wallet][recoveryNonce];
        if (!req.exists) revert NoActiveRecovery();
        if (req.executed) revert("Already executed");
        if (block.timestamp >= req.expiry) revert RecoveryExpired();
        if (req.guardianCount < req.threshold) {
            revert InsufficientApprovals(req.guardianCount, req.threshold);
        }
        req.executed = true;
        address oldOwner = walletOwners[wallet];
        walletOwners[wallet] = req.newOwner;
        if (oldOwner != address(0)) {
            delete ownerToWallet[oldOwner];
        }
        ownerToWallet[req.newOwner] = wallet;
        nonces[wallet] = recoveryNonce + 1;
        emit RecoveryFinalized(wallet, oldOwner, req.newOwner, recoveryNonce);
    }
    function approveRecoveryWithSig(
        address wallet,
        address newOwner,
        uint256 recoveryNonce,
        uint256 expiry,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        bytes32 structHash = keccak256(abi.encode(
            RECOVERY_TYPEHASH,
            wallet,
            newOwner,
            recoveryNonce,
            expiry
        ));
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            structHash
        ));
        address signer = ecrecover(digest, v, r, s);
        if (signer == address(0)) revert("Invalid signature");
        if (!forgeRegistry.isGuardian(signer)) revert NotGuardian();
        RecoveryRequest storage req = recoveries[wallet][recoveryNonce];
        if (!req.exists) revert NoActiveRecovery();
        if (req.executed) revert NoActiveRecovery();
        if (block.timestamp >= req.expiry || block.timestamp >= expiry) revert RecoveryExpired();
        if (signer == walletOwners[wallet]) revert("Owner cannot approve own recovery");
        GuardianApproval storage approval = approvals[wallet][recoveryNonce][signer];
        if (approval.approved) revert AlreadyVoted();
        approval.approved = true;
        approval.timestamp = block.timestamp;
        req.guardianCount++;
        emit GuardianApproved(wallet, signer, recoveryNonce);
    }

    // =========================================================================
    // Cancellation Actions
    // =========================================================================
    function cancelRecovery(address wallet, uint256 recoveryNonce) external onlyWalletOwner(wallet) {
        RecoveryRequest storage req = recoveries[wallet][recoveryNonce];
        if (!req.exists) revert NoActiveRecovery();
        if (req.executed) revert("Already executed");
        delete recoveries[wallet][recoveryNonce];
        emit RecoveryCancelled(wallet, recoveryNonce, "Cancelled by owner");
    }
    function cancelExpiredRecovery(address wallet, uint256 recoveryNonce) external {
        RecoveryRequest storage req = recoveries[wallet][recoveryNonce];
        if (!req.exists) revert NoActiveRecovery();
        if (block.timestamp < req.expiry) revert("Not yet expired");
        delete recoveries[wallet][recoveryNonce];
        emit RecoveryCancelled(wallet, recoveryNonce, "Expired");
    }

    // =========================================================================
    // Guardian Actions (Non-Recovery)
    // =========================================================================
    function flagCompromised(address wallet) external onlyGuardian {
        emit RecoveryCancelled(wallet, nonces[wallet], "Compromised - flagged by guardian");
    }

    // =========================================================================
    // View Functions
    // =========================================================================
    function getThreshold(address wallet) external view returns (uint256) {
        return _getThreshold(wallet);
    }
    function isRecoveryReady(address wallet, uint256 recoveryNonce) external view returns (bool) {
        RecoveryRequest storage req = recoveries[wallet][recoveryNonce];
        return req.exists && !req.executed && req.guardianCount >= req.threshold;
    }
    function getRecoveryDetails(address wallet, uint256 recoveryNonce) external view returns (
        address newOwner,
        uint256 threshold,
        uint256 expiry,
        uint256 guardianCount,
        bool executed,
        bool exists
    ) {
        RecoveryRequest storage req = recoveries[wallet][recoveryNonce];
        return (req.newOwner, req.threshold, req.expiry, req.guardianCount, req.executed, req.exists);
    }
    function getApprovalStatus(address wallet, uint256 recoveryNonce, address guardian) external view returns (bool, uint256) {
        GuardianApproval storage a = approvals[wallet][recoveryNonce][guardian];
        return (a.approved, a.timestamp);
    }
    function getOwner(address wallet) external view returns (address) {
        return walletOwners[wallet];
    }
    function getWalletForOwner(address owner) external view returns (address) {
        return ownerToWallet[owner];
    }

    // =========================================================================
    // Internal
    // =========================================================================
    function _getThreshold(address wallet) internal view returns (uint256) {
        uint256 custom = walletThreshold[wallet];
        return custom != 0 ? custom : defaultThreshold;
    }
}

/// @notice Interface to the pre-deployed ForgeRegistry guardian list
interface IForgeRegistry {
    function isGuardian(address account) external view returns (bool);
    function totalGuardians() external view returns (uint256);
}