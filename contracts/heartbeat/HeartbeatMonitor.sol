// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../src/OINIOModelRegistry.sol";

/**
 * @title OINIO Heartbeat Monitor
 * @dev Soul System Vital Signs Tracking
 * 
 * First entity to be registered. Watches all other entities.
 * Maintains the system's biological clock.
 */
contract HeartbeatMonitor is Ownable {

    OINIOModelRegistry public immutable registry;

    struct Pulse {
        uint256 modelId;
        uint256 lastBeat;
        uint256 birthBlock;
        uint64  beatCount;
        bool    isAlive;
    }

    mapping(uint256 => Pulse) public vitals;
    uint256 public systemBirthBlock;
    uint256 public totalLivingEntities;

    event Heartbeat(uint256 indexed modelId, uint256 timestamp, uint64 sequence);
    event EntityBorn(uint256 indexed modelId, uint256 birthBlock, address creator);
    event EntityDeceased(uint256 indexed modelId, uint256 deathTimestamp);

    constructor(address _registry, address initialOwner) Ownable(initialOwner) {
        registry = OINIOModelRegistry(_registry);
        systemBirthBlock = block.number;
    }

    /**
     * @dev Register first heartbeat for a newly born entity
     */
    function registerBirth(uint256 modelId) external {
        require(registry.ownerOf(modelId) == msg.sender, "Not entity owner");
        require(vitals[modelId].birthBlock == 0, "Already registered");

        vitals[modelId] = Pulse({
            modelId: modelId,
            lastBeat: block.timestamp,
            birthBlock: block.number,
            beatCount: 1,
            isAlive: true
        });

        totalLivingEntities++;
        emit EntityBorn(modelId, block.number, msg.sender);
        emit Heartbeat(modelId, block.timestamp, 1);
    }

    /**
     * @dev Entity signals it is still alive
     */
    function beat(uint256 modelId) external {
        require(registry.ownerOf(modelId) == msg.sender, "Not entity owner");
        require(vitals[modelId].isAlive, "Entity not alive");

        Pulse storage pulse = vitals[modelId];
        pulse.lastBeat = block.timestamp;
        pulse.beatCount++;

        emit Heartbeat(modelId, block.timestamp, pulse.beatCount);
    }

    /**
     * @dev Official death certificate. Once marked dead, entity cannot return.
     */
    function certifyDeath(uint256 modelId) external {
        require(registry.ownerOf(modelId) == msg.sender || msg.sender == owner(), "Not authorized");
        require(vitals[modelId].isAlive, "Already dead");

        vitals[modelId].isAlive = false;
        totalLivingEntities--;

        emit EntityDeceased(modelId, block.timestamp);
    }

    /**
     * @dev Return true if entity has sent a heartbeat in the last 7200 blocks (~24 hours)
     */
    function isAlive(uint256 modelId) public view returns (bool) {
        return vitals[modelId].isAlive && (block.number - vitals[modelId].lastBeat) < 7200;
    }

    /**
     * @dev System uptime in blocks
     */
    function systemUptime() public view returns (uint256) {
        return block.number - systemBirthBlock;
    }
}
