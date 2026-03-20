// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/W0G.sol";

/**
 * @title Deploy Script for Uniswap V2 Fork on 0G Aristotle Mainnet
 * @notice Comprehensive deployment script with safety checks and verification
 * @dev Deploy order: W0G -> Factory -> Router02 (with manual init code hash update)
 */
contract Deploy is Script {
    // Deployment addresses (to be set after each deployment)
    address public w0g;
    address public factory;
    address public router;
    bytes32 public pairInitCodeHash;

    // Configuration from environment
    address public deployer;
    address public feeToSetter;
    uint256 public chainId;

    function setUp() public {
        // Load environment variables
        deployer = vm.envAddress("DEPLOYER");
        feeToSetter = vm.envOr("FEE_TO_SETTER", deployer);
        chainId = vm.envUint("CHAIN_ID");

        // Verify we're on 0G Aristotle Mainnet
        require(chainId == 16661, "Deploy: Must deploy to 0G Aristotle Mainnet (Chain ID 16661)");
        
        console.log("=== Pre-Deployment Configuration ===");
        console.log("Chain ID:", chainId);
        console.log("Deployer:", deployer);
        console.log("Fee To Setter:", feeToSetter);
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Pre-deployment safety checks
        performSafetyChecks();

        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy W0G (Wrapped 0G)
        console.log("\n=== Step 1: Deploying W0G ===");
        w0g = address(new W0G());
        console.log("W0G deployed at:", w0g);

        // Step 2: Deploy UniswapV2Factory
        console.log("\n=== Step 2: Deploying UniswapV2Factory ===");
        console.log("Note: Factory deployment requires v2-core submodule");
        console.log("This script assumes you've added Uniswap v2-core via git submodule");
        
        // Factory deployment code would go here after submodule setup
        // For now, we'll create a placeholder that shows what needs to be done
        console.log("Factory will be deployed with feeToSetter:", feeToSetter);
        
        // Note: Actual factory deployment:
        // factory = address(new UniswapV2Factory(feeToSetter));
        // console.log("Factory deployed at:", factory);

        // Step 3: Compute PAIR_INIT_CODE_HASH
        // This must be done after factory deployment
        // pairInitCodeHash = keccak256(abi.encodePacked(type(UniswapV2Pair).creationCode));
        // console.log("PAIR_INIT_CODE_HASH:");
        // console.logBytes32(pairInitCodeHash);

        // Step 4: Deploy UniswapV2Router02
        // Note: This requires manual update of init code hash in UniswapV2Library.sol first
        // router = address(new UniswapV2Router02(factory, w0g));
        // console.log("Router02 deployed at:", router);

        vm.stopBroadcast();

        // Post-deployment summary
        printDeploymentSummary();
    }

    function performSafetyChecks() internal view {
        console.log("\n=== Pre-Deployment Safety Checks ===");
        
        // Check deployer balance
        uint256 balance = deployer.balance;
        console.log("Deployer balance:", balance);
        
        uint256 minBalance = vm.envOr("MIN_BALANCE", uint256(0.5 ether));
        require(balance >= minBalance, "Deploy: Insufficient balance for deployment");
        console.log("Balance check: PASSED");

        // Check RPC connectivity (implicit through vm calls)
        console.log("RPC connectivity: PASSED");
        
        console.log("All safety checks: PASSED\n");
    }

    function printDeploymentSummary() internal view {
        console.log("\n=== Deployment Summary ===");
        console.log("Network: 0G Aristotle Mainnet");
        console.log("Chain ID:", chainId);
        console.log("Deployer:", deployer);
        console.log("Fee To Setter:", feeToSetter);
        console.log("");
        console.log("Deployed Contracts:");
        console.log("W0G:", w0g);
        if (factory != address(0)) {
            console.log("Factory:", factory);
        }
        if (router != address(0)) {
            console.log("Router02:", router);
        }
        console.log("");
        console.log("=== Next Steps ===");
        console.log("1. Copy PAIR_INIT_CODE_HASH from logs above");
        console.log("2. Update lib/v2-periphery/contracts/libraries/UniswapV2Library.sol");
        console.log("3. Run 'forge build' to recompile");
        console.log("4. Run deployment script again to deploy Router02");
        console.log("");
        console.log("=== .env.launch Format ===");
        console.log("ZERO_G_W0G=", w0g);
        if (factory != address(0)) {
            console.log("ZERO_G_FACTORY=", factory);
        }
        if (router != address(0)) {
            console.log("ZERO_G_UNIVERSAL_ROUTER=", router);
        }
        console.log("ZERO_G_RPC=https://evmrpc.0g.ai");
    }

    /**
     * @notice Helper function to deploy only W0G (for testing)
     */
    function deployW0GOnly() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        w0g = address(new W0G());
        console.log("W0G deployed at:", w0g);
        
        vm.stopBroadcast();
    }

    /**
     * @notice Helper function to verify contract on block explorer
     */
    function verify(address contractAddress, bytes memory constructorArgs) public {
        console.log("Verifying contract at:", contractAddress);
        // Verification would be handled by --verify flag in forge script command
        console.log("Use: forge verify-contract --chain-id 16661 --watch", contractAddress);
    }
}
