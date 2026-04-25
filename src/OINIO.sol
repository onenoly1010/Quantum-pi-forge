// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OINIO {
    string public name = "OINIO";
    string public symbol = "OINIO";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    
    address public router;
    address public owner;

    error Unauthorized();
    error InvalidRouterAddress();

    event RouterUpdated(address indexed oldRouter, address indexed newRouter, uint256 timestamp);

    constructor(uint256 _supply) {
        totalSupply = _supply;
        balanceOf[msg.sender] = _supply;
        owner = msg.sender;
    }

    /**
     * @dev Set the DEX Router address for 0G Aristotle Mainnet
     * @notice Only callable by contract owner, can only be set once
     * @param _router Address of verified UniswapV2-compatible router
     */
    function setRouter(address _router) external {
        if (msg.sender != owner) revert Unauthorized();
        if (_router == address(0)) revert InvalidRouterAddress();
        if (router != address(0)) revert InvalidRouterAddress(); // ONE TIME SET ONLY
        
        address oldRouter = router;
        router = _router;
        
        emit RouterUpdated(oldRouter, router, block.timestamp);
    }
}
