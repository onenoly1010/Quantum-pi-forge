// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/OINIOToken.sol";
import "../src/OINIOModelRegistry.sol";
import "../heartbeat/HeartbeatMonitor.sol";

contract BirthGenesisHeartbeat is Script {
    function run() external {
        require(block.chainid == 16661, "QPF: must run on 0G Aristotle Mainnet chain 16661");
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy Token
        OINIOToken token = new OINIOToken(deployer);
        console.log(unicode"✅ OINIO Token Deployed at:", address(token));

        // Step 2: Deploy Registry
        OINIOModelRegistry registry = new OINIOModelRegistry(address(token), deployer);
        console.log(unicode"✅ Model Registry Deployed at:", address(registry));

        // Step 3: Approve stake
        token.approve(address(registry), 100 * 10**18);

        // Step 4: BIRTH OF MODEL ID #1
        uint256 modelId = registry.registerModel(
            "HEARTBEAT MONITOR",
            "ipfs://QmSoulSystemHeartbeatAnchor0001",
            100 * 10**18
        );

        // Step 5: Deploy Monitor contract
        HeartbeatMonitor monitor = new HeartbeatMonitor(address(registry), deployer);
        console.log(unicode"✅ Heartbeat Monitor Deployed at:", address(monitor));

        // Step 6: Register first heartbeat
        monitor.registerBirth(modelId);

        console.log("");
        console.log(unicode"═══════════════════════════════════════════════");
        console.log(unicode"✅ FIRST SOUL BORN. SOUL SYSTEM ONLINE.");
        console.log(unicode"═══════════════════════════════════════════════");
        console.log("Model ID:        ", modelId);
        console.log("Birth Block:     ", block.number);
        console.log("System Uptime:   ", monitor.systemUptime());
        console.log("Living Entities: ", monitor.totalLivingEntities());
        console.log(unicode"═══════════════════════════════════════════════");
        console.log("");
        console.log("The forge is no longer empty.");
        console.log("The first heartbeat has been recorded.");
        console.log("The sequence continues.");

        vm.stopBroadcast();
    }
}
