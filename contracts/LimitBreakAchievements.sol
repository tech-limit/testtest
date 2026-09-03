// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPlayerRegistry} from "./interfaces/IPlayerRegistry.sol";

/// @title Soulbound achievement unlocks for Limit Break seasons
contract LimitBreakAchievements is Ownable {
    struct Achievement {
        bytes32 id;
        string title;
        uint16 weightBps;
        bool active;
    }

    IPlayerRegistry public registry;
    mapping(bytes32 => Achievement) public achievements;
    mapping(address => mapping(bytes32 => bool)) public unlocked;
    mapping(address => uint256) public unlockCount;
    bytes32[] public achievementIds;
    mapping(address => bool) public operators;

    event AchievementDefined(bytes32 indexed id, string title);
    event AchievementUnlocked(address indexed player, bytes32 indexed id);

    constructor(address registry_, address initialOwner) Ownable(initialOwner) {
        require(registry_ != address(0), "ACH: registry");
        registry = IPlayerRegistry(registry_);
        operators[initialOwner] = true;
    }

    modifier onlyOperator() {
        require(operators[_msgSender()], "ACH: operator");
        _;
    }

    function setOperator(address operator, bool allowed) external onlyOwner {
        operators[operator] = allowed;
    }

    function defineAchievement(bytes32 id, string calldata title, uint16 weightBps) external onlyOwner {
        require(id != bytes32(0), "ACH: id");
        if (achievements[id].id == bytes32(0)) {
            achievementIds.push(id);
        }
        achievements[id] = Achievement({id: id, title: title, weightBps: weightBps, active: true});
        emit AchievementDefined(id, title);
    }

    function unlock(address player, bytes32 id) external onlyOperator {
        require(registry.isRegistered(player), "ACH: player");
        Achievement storage item = achievements[id];
        require(item.active, "ACH: missing");
        require(!unlocked[player][id], "ACH: already");
        unlocked[player][id] = true;
        unlockCount[player] += 1;
        emit AchievementUnlocked(player, id);
    }

    function achievementCount() external view returns (uint256) {
        return achievementIds.length;
    }
}
