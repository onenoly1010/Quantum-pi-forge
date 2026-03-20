// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title W0G - Wrapped 0G Token
 * @notice Standard WETH9 implementation for 0G Aristotle Mainnet
 * @dev This contract wraps the native 0G token into an ERC-20 compatible token
 */
contract W0G {
    string public name     = "Wrapped 0G";
    string public symbol   = "W0G";
    uint8  public decimals = 18;

    event Approval(address indexed src, address indexed guy, uint256 wad);
    event Transfer(address indexed src, address indexed dst, uint256 wad);
    event Deposit(address indexed dst, uint256 wad);
    event Withdrawal(address indexed src, uint256 wad);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    /**
     * @notice Fallback function to accept native 0G and wrap it
     */
    receive() external payable {
        deposit();
    }

    /**
     * @notice Deposit native 0G and receive W0G tokens
     */
    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @notice Withdraw W0G tokens and receive native 0G
     * @param wad Amount of W0G to withdraw
     */
    function withdraw(uint256 wad) public {
        require(balanceOf[msg.sender] >= wad, "W0G: insufficient balance");
        balanceOf[msg.sender] -= wad;
        
        // Use call instead of transfer for better compatibility with contracts
        (bool success, ) = payable(msg.sender).call{value: wad}("");
        require(success, "W0G: withdrawal transfer failed");
        
        emit Withdrawal(msg.sender, wad);
    }

    /**
     * @notice Get total supply of W0G (equal to contract balance)
     */
    function totalSupply() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Approve spender to transfer tokens on behalf of owner
     * @param guy Spender address
     * @param wad Amount to approve
     */
    function approve(address guy, uint256 wad) public returns (bool) {
        allowance[msg.sender][guy] = wad;
        emit Approval(msg.sender, guy, wad);
        return true;
    }

    /**
     * @notice Transfer tokens to another address
     * @param dst Destination address
     * @param wad Amount to transfer
     */
    function transfer(address dst, uint256 wad) public returns (bool) {
        return transferFrom(msg.sender, dst, wad);
    }

    /**
     * @notice Transfer tokens from one address to another
     * @param src Source address
     * @param dst Destination address
     * @param wad Amount to transfer
     */
    function transferFrom(address src, address dst, uint256 wad) public returns (bool) {
        require(balanceOf[src] >= wad, "W0G: insufficient balance");

        if (src != msg.sender && allowance[src][msg.sender] != type(uint256).max) {
            require(allowance[src][msg.sender] >= wad, "W0G: insufficient allowance");
            allowance[src][msg.sender] -= wad;
        }

        balanceOf[src] -= wad;
        balanceOf[dst] += wad;

        emit Transfer(src, dst, wad);

        return true;
    }
}
