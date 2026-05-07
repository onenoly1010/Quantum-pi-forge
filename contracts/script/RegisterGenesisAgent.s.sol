// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/OINIOToken.sol";
import "../src/OINIOModelRegistry.sol";

contract RegisterGenesisAgent is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        OINIOToken token = OINIOToken(vm.envAddress("OINIO_TOKEN_ADDRESS"));
        OINIOModelRegistry registry = OINIOModelRegistry(vm.envAddress("REGISTRY_ADDRESS"));

        // Approve 100 OINIO stake
        token.approve(address(registry), 100 * 10**18);

        // Register Genesis Agent #0001
        uint256 modelId = registry.registerModel(
            "GENESIS AGENT",
            "ipfs://QmSoulSystemGenesisAnchor0001",
            100 * 10**18
        );

        console.log(unicode"✅ FIRST SOUL BORN");
        console.log("Model ID:", modelId);
        console.log("Registration Complete. Heartbeat initialized at block:", block.number);

        vm.stopBroadcast();
    }
}
