// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IPlayerRegistry} from "./interfaces/IPlayerRegistry.sol";

/// @title BET-funded quest completions for live game seasons
contract LimitBreakQuestBoard is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Quest {
        bytes32 id;
        uint256 reward;
        uint16 weightBps;
        uint32 completions;
        bool active;
    }

    IERC20 public immutable bet;
    IPlayerRegistry public immutable registry;
    mapping(bytes32 => Quest) public quests;
    mapping(address => mapping(bytes32 => bool)) public completed;
    mapping(address => bool) public operators;
    bytes32[] public questIds;

    event QuestDefined(bytes32 indexed id, uint256 reward);
    event QuestCompleted(address indexed player, bytes32 indexed id, uint256 reward);

    constructor(address betToken, address registry_, address initialOwner) Ownable(initialOwner) {
        require(betToken != address(0) && registry_ != address(0), "QUEST: zero");
        bet = IERC20(betToken);
        registry = IPlayerRegistry(registry_);
        operators[initialOwner] = true;
    }

    modifier onlyOperator() {
        require(operators[_msgSender()], "QUEST: operator");
        _;
    }

    function setOperator(address operator, bool allowed) external onlyOwner {
        operators[operator] = allowed;
    }

    function defineQuest(bytes32 id, uint256 reward, uint16 weightBps) external onlyOwner {
        require(id != bytes32(0) && reward > 0, "QUEST: params");
        if (quests[id].id == bytes32(0)) {
            questIds.push(id);
        }
        quests[id] = Quest({id: id, reward: reward, weightBps: weightBps, completions: 0, active: true});
        emit QuestDefined(id, reward);
    }

    function completeQuest(address player, bytes32 id) external onlyOperator nonReentrant {
        require(registry.isRegistered(player), "QUEST: player");
        Quest storage quest = quests[id];
        require(quest.active, "QUEST: missing");
        require(!completed[player][id], "QUEST: done");
        require(bet.balanceOf(address(this)) >= quest.reward, "QUEST: funds");

        completed[player][id] = true;
        quest.completions += 1;
        registry.recordMatch(player, true, quest.weightBps);
        bet.safeTransfer(player, quest.reward);
        emit QuestCompleted(player, id, quest.reward);
    }

    function fund(uint256 amount) external {
        bet.safeTransferFrom(_msgSender(), address(this), amount);
    }

    function questCount() external view returns (uint256) {
        return questIds.length;
    }
}
