// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPlayerRegistry} from "./interfaces/IPlayerRegistry.sol";
import {ReputationMath} from "./libraries/ReputationMath.sol";

/// @title On-chain player identity for the Limit Break game layer
contract LimitBreakPlayerRegistry is IPlayerRegistry, Ownable {
    struct Profile {
        bytes32 handle;
        uint64 joinedAt;
        uint32 matchesPlayed;
        uint32 wins;
        uint256 reputation;
        bool registered;
    }

    mapping(address => Profile) public profiles;
    mapping(bytes32 => address) public handleOwner;
    mapping(address => bool) public operators;
    uint256 public playerCount;

    event Registered(address indexed player, bytes32 handle);
    event MatchRecorded(address indexed player, bool won, uint256 reputation);
    event OperatorUpdated(address indexed operator, bool allowed);

    constructor(address initialOwner) Ownable(initialOwner) {
        operators[initialOwner] = true;
    }

    modifier onlyOperator() {
        require(operators[_msgSender()], "REG: operator");
        _;
    }

    function setOperator(address operator, bool allowed) external onlyOwner {
        operators[operator] = allowed;
        emit OperatorUpdated(operator, allowed);
    }

    function register(bytes32 handle) external {
        require(handle != bytes32(0), "REG: handle");
        require(!profiles[_msgSender()].registered, "REG: already");
        require(handleOwner[handle] == address(0), "REG: taken");

        profiles[_msgSender()] = Profile({
            handle: handle,
            joinedAt: uint64(block.timestamp),
            matchesPlayed: 0,
            wins: 0,
            reputation: 100,
            registered: true
        });
        handleOwner[handle] = _msgSender();
        playerCount += 1;
        emit Registered(_msgSender(), handle);
    }

    function isRegistered(address player) public view returns (bool) {
        return profiles[player].registered;
    }

    function reputationOf(address player) external view returns (uint256) {
        return profiles[player].reputation;
    }

    function recordMatch(address player, bool won, uint256 scoreDelta) external onlyOperator {
        require(isRegistered(player), "REG: unknown");
        Profile storage profile = profiles[player];
        profile.matchesPlayed += 1;
        if (won) profile.wins += 1;
        profile.reputation = ReputationMath.applyMatch(profile.reputation, won, scoreDelta);
        emit MatchRecorded(player, won, profile.reputation);
    }
}
