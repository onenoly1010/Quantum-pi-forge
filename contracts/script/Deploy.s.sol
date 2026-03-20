// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OINIOToken.sol";
import "../src/OINIOModelRegistry.sol";

/**
 * @title Deploy
 * @dev Deployment script for OINIO smart contracts
 * 
 * Usage:
 * Testnet: forge script script/Deploy.s.sol --rpc-url pi_testnet --broadcast --verify
 * Mainnet: forge script script/Deploy.s.sol --rpc-url pi_mainnet --broadcast --verify
 * 
 * Environment variables required:
 * - PRIVATE_KEY: Deployer's private key
 * - RPC_URL: Pi Network RPC endpoint
 * - CHAIN_ID: 2025 for testnet, 314159 for mainnet
 * - ETHERSCAN_API_KEY: (optional) For contract verification
 */
contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy OINIOToken
        console.log("\n=== Deploying OINIOToken ===");
        OINIOToken token = new OINIOToken(deployer);
        console.log("OINIOToken deployed to:", address(token));
        console.log("Token Name:", token.name());
        console.log("Token Symbol:", token.symbol());
        console.log("Token Decimals:", token.decimals());
        console.log("Total Supply:", token.totalSupply());

        // Deploy OINIOModelRegistry
        console.log("\n=== Deploying OINIOModelRegistry ===");
        OINIOModelRegistry registry = new OINIOModelRegistry(address(token), deployer);
        console.log("OINIOModelRegistry deployed to:", address(registry));
        console.log("Registry Name:", registry.name());
        console.log("Registry Symbol:", registry.symbol());
        console.log("OINIO Token Address:", address(registry.oinioToken()));

        vm.stopBroadcast();

        // Output deployment summary
        console.log("\n=== Deployment Summary ===");
        console.log("Network Chain ID:", block.chainid);
        console.log("Deployer:", deployer);
        console.log("OINIOToken:", address(token));
        console.log("OINIOModelRegistry:", address(registry));
        console.log("\n=== Next Steps ===");
        console.log("1. Save the contract addresses above");
        console.log("2. Verify contracts on block explorer if not done automatically");
        console.log("3. Update frontend configuration with contract addresses");
        console.log("4. Test contract interactions");
    }
}
