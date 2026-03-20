// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/OINIOToken.sol";
import "../src/OINIOModelRegistry.sol";

contract OINIOModelRegistryTest is Test {
    OINIOToken public token;
    OINIOModelRegistry public registry;
    
    address public owner;
    address public creator1;
    address public creator2;

    uint256 constant INITIAL_SUPPLY = 1_000_000_000 * 10**18;
    uint256 constant STAKE_AMOUNT = 1000 * 10**18;

    function setUp() public {
        owner = address(this);
        creator1 = address(0x1);
        creator2 = address(0x2);

        // Deploy contracts
        token = new OINIOToken(owner);
        registry = new OINIOModelRegistry(address(token), owner);

        // Distribute tokens to creators
        token.transfer(creator1, 10000 * 10**18);
        token.transfer(creator2, 10000 * 10**18);

        // Approve registry to spend tokens
        vm.prank(creator1);
        token.approve(address(registry), type(uint256).max);
        
        vm.prank(creator2);
        token.approve(address(registry), type(uint256).max);
    }

    function testDeployment() public {
        assertEq(registry.name(), "OINIO AI Model");
        assertEq(registry.symbol(), "OINIO-MODEL");
        assertEq(address(registry.oinioToken()), address(token));
        assertEq(registry.owner(), owner);
        assertEq(registry.totalModels(), 0);
    }

    function testRegisterModel() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel(
            "Test Model",
            "ipfs://QmTest123",
            STAKE_AMOUNT
        );

        assertEq(modelId, 1);
        assertEq(registry.totalModels(), 1);
        assertEq(registry.ownerOf(modelId), creator1);

        OINIOModelRegistry.AIModel memory model = registry.getModel(modelId);
        assertEq(model.modelId, modelId);
        assertEq(model.creator, creator1);
        assertEq(model.name, "Test Model");
        assertEq(model.metadataURI, "ipfs://QmTest123");
        assertEq(model.stakeAmount, STAKE_AMOUNT);
        assertTrue(model.isActive);
        assertEq(model.createdAt, block.timestamp);
    }

    function testRegisterMultipleModels() public {
        vm.startPrank(creator1);
        uint256 modelId1 = registry.registerModel("Model 1", "ipfs://1", STAKE_AMOUNT);
        uint256 modelId2 = registry.registerModel("Model 2", "ipfs://2", STAKE_AMOUNT);
        vm.stopPrank();

        assertEq(modelId1, 1);
        assertEq(modelId2, 2);
        assertEq(registry.totalModels(), 2);

        uint256[] memory creator1Models = registry.getModelsByCreator(creator1);
        assertEq(creator1Models.length, 2);
        assertEq(creator1Models[0], modelId1);
        assertEq(creator1Models[1], modelId2);
    }

    function testRegisterModelTransfersTokens() public {
        uint256 creator1BalanceBefore = token.balanceOf(creator1);
        uint256 registryBalanceBefore = token.balanceOf(address(registry));

        vm.prank(creator1);
        registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);

        assertEq(token.balanceOf(creator1), creator1BalanceBefore - STAKE_AMOUNT);
        assertEq(token.balanceOf(address(registry)), registryBalanceBefore + STAKE_AMOUNT);
    }

    function testUpdateModelMetadata() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel("Test Model", "ipfs://old", STAKE_AMOUNT);

        vm.prank(creator1);
        registry.updateModelMetadata(modelId, "ipfs://new");

        OINIOModelRegistry.AIModel memory model = registry.getModel(modelId);
        assertEq(model.metadataURI, "ipfs://new");
    }

    function testDeactivateModel() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);

        vm.prank(creator1);
        registry.deactivateModel(modelId);

        OINIOModelRegistry.AIModel memory model = registry.getModel(modelId);
        assertFalse(model.isActive);
    }

    function testGetModelsByCreator() public {
        vm.startPrank(creator1);
        registry.registerModel("Model 1", "ipfs://1", STAKE_AMOUNT);
        registry.registerModel("Model 2", "ipfs://2", STAKE_AMOUNT);
        vm.stopPrank();

        vm.prank(creator2);
        registry.registerModel("Model 3", "ipfs://3", STAKE_AMOUNT);

        uint256[] memory creator1Models = registry.getModelsByCreator(creator1);
        uint256[] memory creator2Models = registry.getModelsByCreator(creator2);

        assertEq(creator1Models.length, 2);
        assertEq(creator2Models.length, 1);
    }

    function testTransferModel() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);

        vm.prank(creator1);
        registry.transferModel(creator2, modelId);

        assertEq(registry.ownerOf(modelId), creator2);
        
        // Check creator2's models include the transferred one
        uint256[] memory creator2Models = registry.getModelsByCreator(creator2);
        bool found = false;
        for (uint256 i = 0; i < creator2Models.length; i++) {
            if (creator2Models[i] == modelId) {
                found = true;
                break;
            }
        }
        assertTrue(found);
    }

    // Test failure cases

    function testRegisterModelFailsWithEmptyName() public {
        vm.prank(creator1);
        vm.expectRevert("Name cannot be empty");
        registry.registerModel("", "ipfs://test", STAKE_AMOUNT);
    }

    function testRegisterModelFailsWithEmptyMetadata() public {
        vm.prank(creator1);
        vm.expectRevert("Metadata URI cannot be empty");
        registry.registerModel("Test Model", "", STAKE_AMOUNT);
    }

    function testRegisterModelFailsWithZeroStake() public {
        vm.prank(creator1);
        vm.expectRevert("Stake amount must be greater than 0");
        registry.registerModel("Test Model", "ipfs://test", 0);
    }

    function testRegisterModelFailsWithoutApproval() public {
        address creator3 = address(0x3);
        token.transfer(creator3, STAKE_AMOUNT);

        vm.prank(creator3);
        vm.expectRevert();
        registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);
    }

    function testUpdateModelMetadataFailsForNonOwner() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);

        vm.prank(creator2);
        vm.expectRevert("Not the model owner");
        registry.updateModelMetadata(modelId, "ipfs://new");
    }

    function testUpdateModelMetadataFailsWithEmptyURI() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);

        vm.prank(creator1);
        vm.expectRevert("Metadata URI cannot be empty");
        registry.updateModelMetadata(modelId, "");
    }

    function testUpdateModelMetadataFailsForInactiveModel() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);

        vm.prank(creator1);
        registry.deactivateModel(modelId);

        vm.prank(creator1);
        vm.expectRevert("Model is not active");
        registry.updateModelMetadata(modelId, "ipfs://new");
    }

    function testDeactivateModelFailsForNonOwner() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);

        vm.prank(creator2);
        vm.expectRevert("Not the model owner");
        registry.deactivateModel(modelId);
    }

    function testDeactivateModelFailsForAlreadyInactive() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);

        vm.startPrank(creator1);
        registry.deactivateModel(modelId);
        
        vm.expectRevert("Model already inactive");
        registry.deactivateModel(modelId);
        vm.stopPrank();
    }

    function testGetModelFailsForNonexistentModel() public {
        vm.expectRevert("Model does not exist");
        registry.getModel(999);
    }

    function testTransferModelFailsForNonOwner() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);

        vm.prank(creator2);
        vm.expectRevert("Not the model owner");
        registry.transferModel(creator2, modelId);
    }

    function testTransferModelFailsWithInvalidRecipient() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);

        vm.prank(creator1);
        vm.expectRevert("Invalid recipient address");
        registry.transferModel(address(0), modelId);
    }

    function testTokenURIWorks() public {
        vm.prank(creator1);
        uint256 modelId = registry.registerModel("Test Model", "ipfs://test", STAKE_AMOUNT);

        string memory uri = registry.tokenURI(modelId);
        assertEq(uri, "ipfs://test");
    }

    function testTransferModelRemovesFromPreviousOwnerList() public {
        // Creator1 registers two models
        vm.startPrank(creator1);
        uint256 modelId1 = registry.registerModel("Model 1", "ipfs://1", STAKE_AMOUNT);
        uint256 modelId2 = registry.registerModel("Model 2", "ipfs://2", STAKE_AMOUNT);
        vm.stopPrank();

        // Verify creator1 has 2 models
        uint256[] memory creator1ModelsBefore = registry.getModelsByCreator(creator1);
        assertEq(creator1ModelsBefore.length, 2);

        // Transfer one model to creator2
        vm.prank(creator1);
        registry.transferModel(creator2, modelId1);

        // Verify creator1 now has only 1 model
        uint256[] memory creator1ModelsAfter = registry.getModelsByCreator(creator1);
        assertEq(creator1ModelsAfter.length, 1);
        assertEq(creator1ModelsAfter[0], modelId2);

        // Verify creator2 has the transferred model
        uint256[] memory creator2Models = registry.getModelsByCreator(creator2);
        bool found = false;
        for (uint256 i = 0; i < creator2Models.length; i++) {
            if (creator2Models[i] == modelId1) {
                found = true;
                break;
            }
        }
        assertTrue(found);
    }
}
