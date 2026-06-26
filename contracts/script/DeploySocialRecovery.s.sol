// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../ZeroGSocialRecovery.sol";

/**
 * @title DeploySocialRecovery
 * @notice Deploy the 0G Social Recovery Module on 0G Aristotle Mainnet (chain 16661)
 *
 * Usage:
 *   forge script contracts/script/DeploySocialRecovery.s.sol \
 *     --rpc-url https://evmrpc.0g.ai \
 *     --private-key $DEPLOYER_KEY \
 *     --broadcast --verify
 *
 *   forge script contracts/script/DeploySocialRecovery.s.sol \
 *     --rpc-url https://evmrpc.0g.ai \
 *     --sig "runWithArgs(address,uint256,uint256)" \
 *     --private-key $DEPLOYER_KEY \
 *     <FORGE_REGISTRY_ADDR> <THRESHOLD> <TIMEOUT_SECONDS> \
 *     --broadcast
 */
contract DeploySocialRecovery is Script {
    // Known deployed contract addresses on 0G Aristotle Mainnet (16661)
    // ForgeRegistry — deployed in this project
    address constant FORGE_REGISTRY = 0x6011c341a01c80f489a5c3Ab751987A55142F04e;

    // Default configuration
    uint256 constant DEFAULT_THRESHOLD = 3;  // 3-of-5 guardian model
    uint256 constant RECOVERY_TIMEOUT = 7 days;

    function run() external {
        vm.startBroadcast();

        ZeroGSocialRecovery recovery = new ZeroGSocialRecovery(
            FORGE_REGISTRY,
            DEFAULT_THRESHOLD,
            RECOVERY_TIMEOUT
        );

        vm.stopBroadcast();

        console.log("0G Social Recovery Module deployed at:");
        console.log("  Contract:", address(recovery));
        console.log("  ForgeRegistry:", FORGE_REGISTRY);
        console.log("  Default Threshold:", DEFAULT_THRESHOLD);
        console.log("  Recovery Timeout:", RECOVERY_TIMEOUT, "seconds");
        console.log("  Chain ID:", block.chainid);
    }

    /**
     * @notice Deploy with custom parameters
     * @param forgeRegistry  Address of the ForgeRegistry contract
     * @param threshold      Number of guardian approvals required (e.g., 3)
     * @param timeout        Recovery request timeout in seconds (e.g., 604800 for 7 days)
     */
    function runWithArgs(address forgeRegistry, uint256 threshold, uint256 timeout) external {
        require(forgeRegistry != address(0), "Invalid ForgeRegistry address");
        require(threshold > 0 && threshold <= 10, "Threshold must be 1-10");
        require(timeout >= 1 days && timeout <= 30 days, "Timeout must be 1-30 days");

        vm.startBroadcast();

        ZeroGSocialRecovery recovery = new ZeroGSocialRecovery(
            forgeRegistry,
            threshold,
            timeout
        );

        vm.stopBroadcast();

        console.log("0G Social Recovery Module deployed at:");
        console.log("  Contract:", address(recovery));
        console.log("  ForgeRegistry:", forgeRegistry);
        console.log("  Threshold:", threshold);
        console.log("  Timeout:", timeout, "seconds");
        console.log("  Chain ID:", block.chainid);
    }
}