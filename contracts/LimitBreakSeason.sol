// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Seasonal prize pool for Limit Break competitive play
contract LimitBreakSeason is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Season {
        uint64 startsAt;
        uint64 endsAt;
        uint256 prizePool;
        address champion;
        bool settled;
        bool active;
    }

    IERC20 public immutable bet;
    uint256 public currentSeasonId;
    mapping(uint256 => Season) public seasons;

    event SeasonOpened(uint256 indexed seasonId, uint64 startsAt, uint64 endsAt);
    event PrizeFunded(uint256 indexed seasonId, uint256 amount);
    event SeasonSettled(uint256 indexed seasonId, address indexed champion, uint256 payout);

    constructor(address betToken, address initialOwner) Ownable(initialOwner) {
        require(betToken != address(0), "SEASON: token");
        bet = IERC20(betToken);
    }

    function openSeason(uint64 startsAt, uint64 endsAt) external onlyOwner returns (uint256 seasonId) {
        require(endsAt > startsAt, "SEASON: window");
        seasonId = ++currentSeasonId;
        seasons[seasonId] = Season({
            startsAt: startsAt,
            endsAt: endsAt,
            prizePool: 0,
            champion: address(0),
            settled: false,
            active: true
        });
        emit SeasonOpened(seasonId, startsAt, endsAt);
    }

    function fundSeason(uint256 seasonId, uint256 amount) external {
        Season storage season = seasons[seasonId];
        require(season.active && !season.settled, "SEASON: closed");
        require(amount > 0, "SEASON: amount");
        bet.safeTransferFrom(_msgSender(), address(this), amount);
        season.prizePool += amount;
        emit PrizeFunded(seasonId, amount);
    }

    function settle(uint256 seasonId, address champion) external onlyOwner nonReentrant {
        Season storage season = seasons[seasonId];
        require(season.active && !season.settled, "SEASON: closed");
        require(block.timestamp >= season.endsAt, "SEASON: early");
        require(champion != address(0), "SEASON: champion");
        uint256 payout = season.prizePool;
        season.settled = true;
        season.active = false;
        season.champion = champion;
        season.prizePool = 0;
        if (payout > 0) {
            bet.safeTransfer(champion, payout);
        }
        emit SeasonSettled(seasonId, champion, payout);
    }
}
