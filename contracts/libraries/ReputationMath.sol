// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Shared reputation curve for match results and quest completion.
library ReputationMath {
    uint256 internal constant WIN_BONUS = 25;
    uint256 internal constant LOSS_FLOOR = 5;
    uint256 internal constant CAP = 1_000_000;

    function applyMatch(uint256 current, bool won, uint256 scoreDelta) internal pure returns (uint256) {
        uint256 gain = won ? WIN_BONUS + (scoreDelta % 50) : LOSS_FLOOR;
        uint256 next = current + gain;
        return next > CAP ? CAP : next;
    }

    function applyQuest(uint256 current, uint16 weightBps) internal pure returns (uint256) {
        uint256 gain = 10 + (uint256(weightBps) / 100);
        uint256 next = current + gain;
        return next > CAP ? CAP : next;
    }
}
