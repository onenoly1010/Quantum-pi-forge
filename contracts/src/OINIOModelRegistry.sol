// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title OINIOModelRegistry
 * @dev NFT-based registry for AI models with metadata and OINIO token staking
 * 
 * Features:
 * - Each AI model is represented as a unique ERC-721 NFT
 * - Model metadata stored on-chain (IPFS hash + attributes)
 * - OINIO token staking requirement for model registration
 * - Only model owners can update their model metadata
 * - Searchable registry of all models by creator
 */
contract OINIOModelRegistry is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, ReentrancyGuard {
    /// @dev Structure representing an AI model
    struct AIModel {
        uint256 modelId;
        address creator;
        string name;
        string metadataURI;
        uint256 stakeAmount;
        uint256 createdAt;
        bool isActive;
    }

    /// @dev OINIO token contract reference
    IERC20 public immutable oinioToken;

    /// @dev Counter for model IDs
    uint256 private _nextModelId;

    /// @dev Mapping from model ID to AI model data
    mapping(uint256 => AIModel) private _models;

    /// @dev Mapping from creator address to their model IDs
    mapping(address => uint256[]) private _modelsByCreator;

    /// @dev Events
    event ModelRegistered(
        uint256 indexed modelId,
        address indexed creator,
        string name,
        string metadataURI,
        uint256 stakeAmount
    );

    event ModelMetadataUpdated(
        uint256 indexed modelId,
        string newMetadataURI
    );

    event ModelDeactivated(
        uint256 indexed modelId
    );

    event ModelTransferred(
        uint256 indexed modelId,
        address indexed from,
        address indexed to
    );

    /**
     * @dev Constructor
     * @param _oinioToken Address of the OINIO token contract
     * @param initialOwner Address that will own the registry contract
     */
    constructor(address _oinioToken, address initialOwner) 
        ERC721("OINIO AI Model", "OINIO-MODEL") 
        Ownable(initialOwner) 
    {
        require(_oinioToken != address(0), "Invalid token address");
        oinioToken = IERC20(_oinioToken);
        _nextModelId = 1; // Start from 1
    }

    /**
     * @dev Register a new AI model by minting an NFT
     * @param name Name of the AI model
     * @param metadataURI IPFS hash or URI containing model metadata
     * @param stakeAmount Amount of OINIO tokens to stake
     * @return modelId The ID of the newly registered model
     */
    function registerModel(
        string calldata name,
        string calldata metadataURI,
        uint256 stakeAmount
    ) external nonReentrant returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");
        require(stakeAmount > 0, "Stake amount must be greater than 0");

        uint256 modelId = _nextModelId++;

        // Transfer OINIO tokens from sender to this contract
        require(
            oinioToken.transferFrom(msg.sender, address(this), stakeAmount),
            "Token transfer failed"
        );

        // Mint NFT to the creator
        _safeMint(msg.sender, modelId);
        _setTokenURI(modelId, metadataURI);

        // Store model data
        _models[modelId] = AIModel({
            modelId: modelId,
            creator: msg.sender,
            name: name,
            metadataURI: metadataURI,
            stakeAmount: stakeAmount,
            createdAt: block.timestamp,
            isActive: true
        });

        // Add to creator's model list
        _modelsByCreator[msg.sender].push(modelId);

        emit ModelRegistered(modelId, msg.sender, name, metadataURI, stakeAmount);

        return modelId;
    }

    /**
     * @dev Update the metadata URI of a model (only by model owner)
     * @param modelId ID of the model to update
     * @param newMetadataURI New IPFS hash or URI
     */
    function updateModelMetadata(uint256 modelId, string calldata newMetadataURI) external {
        require(_ownerOf(modelId) == msg.sender, "Not the model owner");
        require(bytes(newMetadataURI).length > 0, "Metadata URI cannot be empty");
        require(_models[modelId].isActive, "Model is not active");

        _setTokenURI(modelId, newMetadataURI);
        _models[modelId].metadataURI = newMetadataURI;

        emit ModelMetadataUpdated(modelId, newMetadataURI);
    }

    /**
     * @dev Deactivate a model (only by model owner)
     * @param modelId ID of the model to deactivate
     */
    function deactivateModel(uint256 modelId) external {
        require(_ownerOf(modelId) == msg.sender, "Not the model owner");
        require(_models[modelId].isActive, "Model already inactive");

        _models[modelId].isActive = false;

        emit ModelDeactivated(modelId);
    }

    /**
     * @dev Get model data by ID
     * @param modelId ID of the model
     * @return AIModel struct containing all model data
     */
    function getModel(uint256 modelId) external view returns (AIModel memory) {
        require(_ownerOf(modelId) != address(0), "Model does not exist");
        return _models[modelId];
    }

    /**
     * @dev Get all model IDs created by a specific address
     * @param creator Address of the creator
     * @return Array of model IDs
     */
    function getModelsByCreator(address creator) external view returns (uint256[] memory) {
        return _modelsByCreator[creator];
    }

    /**
     * @dev Transfer model ownership (overrides ERC721 transfer to emit custom event)
     * @param to Address to transfer to
     * @param modelId ID of the model to transfer
     */
    function transferModel(address to, uint256 modelId) external {
        require(_ownerOf(modelId) == msg.sender, "Not the model owner");
        require(to != address(0), "Invalid recipient address");

        address from = msg.sender;
        
        // Remove from previous owner's model list
        _removeModelFromCreator(from, modelId);
        
        // Add to new owner's model list
        _modelsByCreator[to].push(modelId);

        // Transfer the NFT
        safeTransferFrom(from, to, modelId);

        emit ModelTransferred(modelId, from, to);
    }

    /**
     * @dev Internal function to remove a model ID from a creator's list
     * @param creator Address of the creator
     * @param modelId ID of the model to remove
     */
    function _removeModelFromCreator(address creator, uint256 modelId) private {
        uint256[] storage models = _modelsByCreator[creator];
        for (uint256 i = 0; i < models.length; i++) {
            if (models[i] == modelId) {
                // Move the last element to this position and pop
                models[i] = models[models.length - 1];
                models.pop();
                break;
            }
        }
    }

    /**
     * @dev Get the total number of models registered
     * @return Total number of models
     */
    function totalModels() external view returns (uint256) {
        return _nextModelId - 1;
    }

    /**
     * @dev Override required by Solidity for ERC721URIStorage
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Override required by Solidity for ERC721URIStorage
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Burnable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    /**
     * @dev Allow model owners to withdraw their staked tokens (emergency function)
     * @param modelId ID of the model to withdraw stake from
     */
    function withdrawStake(uint256 modelId) external nonReentrant {
        require(_ownerOf(modelId) == msg.sender, "Not the model owner");
        require(_models[modelId].isActive, "Model is not active");
        
        uint256 stakeAmount = _models[modelId].stakeAmount;
        require(stakeAmount > 0, "No stake to withdraw");
        
        // Mark stake as withdrawn
        _models[modelId].stakeAmount = 0;
        
        // Transfer tokens back to owner
        require(oinioToken.transfer(msg.sender, stakeAmount), "Stake withdrawal failed");
        
        emit ModelDeactivated(modelId);
    }

    /**
     * @dev Emergency function for contract owner to recover stuck tokens
     * @param amount Amount of tokens to recover
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(oinioToken.transfer(owner(), amount), "Emergency withdrawal failed");
    }}
