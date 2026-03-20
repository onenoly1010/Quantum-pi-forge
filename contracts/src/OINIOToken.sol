// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OINIOToken
 * @dev ERC-20 token for the OINIO (Ontological Intelligence Network Incentive Organism) ecosystem
 * 
 * Features:
 * - Fixed supply of 1,000,000,000 OINIO tokens (1 billion)
 * - Burnable tokens for deflationary mechanics
 * - Ownable for future governance migration
 * - No minting after deployment
 */
contract OINIOToken is ERC20, ERC20Burnable, Ownable {
    /// @dev Initial supply: 1 billion tokens with 18 decimals
    uint256 private constant INITIAL_SUPPLY = 1_000_000_000 * 10**18;

    /**
     * @dev Constructor mints the entire supply to the deployer
     * @param initialOwner Address that will receive the initial supply and own the contract
     */
    constructor(address initialOwner) ERC20("OINIO Token", "OINIO") Ownable(initialOwner) {
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    /**
     * @dev Returns the number of decimals used for token amounts
     * @return uint8 Number of decimals (18)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
