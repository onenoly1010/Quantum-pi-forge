// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OINIO {
    string public name = "OINIO";
    string public symbol = "OINIO";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _supply) {
        totalSupply = _supply;
        balanceOf[msg.sender] = _supply;
    }
}