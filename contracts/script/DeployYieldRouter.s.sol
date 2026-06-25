// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/YieldRouterFactory.sol";

contract DeployYieldRouter is Script {
    address internal constant DEFAULT_SAFE_FEE_COLLECTOR_OWNER = 0x8d088B88219D072aB035502065ee2410c2cb4389;

    function run() external returns (address deployed) {
        address feeCollectorOwner = vm.envOr("SAFE_FEE_COLLECTOR_OWNER", DEFAULT_SAFE_FEE_COLLECTOR_OWNER);
        vm.startBroadcast();
        YieldRouterFactory factory = new YieldRouterFactory();
        vm.stopBroadcast();
        deployed = address(factory);
        console2.log("YieldRouterFactory", deployed);
        console2.log("SafeFeeCollectorOwner", feeCollectorOwner);
    }
}
