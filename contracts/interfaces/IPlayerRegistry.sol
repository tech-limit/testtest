// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPlayerRegistry {
    function isRegistered(address player) external view returns (bool);
    function reputationOf(address player) external view returns (uint256);
    function recordMatch(address player, bool won, uint256 scoreDelta) external;
}
