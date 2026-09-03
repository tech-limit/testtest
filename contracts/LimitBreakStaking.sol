// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

/// @title Limit Break BET staking
/// @notice Three lock pools matching the product UI. Supports EIP-2771 gasless claims.
contract LimitBreakStaking is ERC2771Context, Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant BPS_DENOMINATOR = 10_000;
    uint256 public constant YEAR = 365 days;

    struct Pool {
        bytes32 id;
        uint64 lockDuration;
        uint16 apyBps;
        uint256 totalStaked;
        bool active;
    }

    struct Position {
        address owner;
        uint8 poolIndex;
        uint256 amount;
        uint64 startedAt;
        uint64 unlockAt;
        uint256 claimedRewards;
        bool open;
    }

    IERC20 public immutable bet;
    Pool[] public pools;
    Position[] public positions;
    mapping(address => uint256[]) private _ownerPositions;
    mapping(bytes32 => uint8) public poolIndexById;

    event Staked(address indexed user, uint256 indexed positionId, uint8 poolIndex, uint256 amount);
    event Unstaked(address indexed user, uint256 indexed positionId, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 indexed positionId, uint256 amount);
    event RewardsFunded(uint256 amount);
    event PoolToggled(uint8 poolIndex, bool active);

    constructor(address betToken, address trustedForwarder, address initialOwner)
        ERC2771Context(trustedForwarder)
        Ownable(initialOwner)
    {
        require(betToken != address(0), "STAKE: zero token");
        bet = IERC20(betToken);

        _addPool("conservative", 30 days, 1800);
        _addPool("growth", 90 days, 4200);
        _addPool("ecosystem", 180 days, 6300);
    }

    function _addPool(bytes32 id, uint64 lockDuration, uint16 apyBps) internal {
        poolIndexById[id] = uint8(pools.length);
        pools.push(Pool({
            id: id,
            lockDuration: lockDuration,
            apyBps: apyBps,
            totalStaked: 0,
            active: true
        }));
    }

    function poolCount() external view returns (uint256) {
        return pools.length;
    }

    function getPool(uint8 index) external view returns (Pool memory) {
        require(index < pools.length, "STAKE: pool");
        return pools[index];
    }

    function positionsOf(address user) external view returns (uint256[] memory) {
        return _ownerPositions[user];
    }

    function pendingRewards(uint256 positionId) public view returns (uint256) {
        require(positionId < positions.length, "STAKE: position");
        Position storage pos = positions[positionId];
        if (!pos.open) return 0;
        Pool storage pool = pools[pos.poolIndex];
        uint256 elapsed = block.timestamp - pos.startedAt;
        uint256 yearly = Math.mulDiv(pos.amount, pool.apyBps, BPS_DENOMINATOR);
        uint256 gross = Math.mulDiv(yearly, elapsed, YEAR);
        if (gross <= pos.claimedRewards) return 0;
        return gross - pos.claimedRewards;
    }

    function stake(uint8 poolIndex, uint256 amount) external whenNotPaused nonReentrant returns (uint256 positionId) {
        require(poolIndex < pools.length, "STAKE: pool");
        require(amount > 0, "STAKE: amount");
        Pool storage pool = pools[poolIndex];
        require(pool.active, "STAKE: inactive");

        address user = _msgSender();
        bet.safeTransferFrom(user, address(this), amount);

        positionId = positions.length;
        uint64 started = uint64(block.timestamp);
        positions.push(Position({
            owner: user,
            poolIndex: poolIndex,
            amount: amount,
            startedAt: started,
            unlockAt: started + pool.lockDuration,
            claimedRewards: 0,
            open: true
        }));
        _ownerPositions[user].push(positionId);
        pool.totalStaked += amount;

        emit Staked(user, positionId, poolIndex, amount);
    }

    function claim(uint256 positionId) external whenNotPaused nonReentrant {
        Position storage pos = positions[positionId];
        address user = _msgSender();
        require(pos.owner == user, "STAKE: owner");
        require(pos.open, "STAKE: closed");

        uint256 reward = pendingRewards(positionId);
        require(reward > 0, "STAKE: no rewards");
        require(bet.balanceOf(address(this)) >= pos.amount + reward, "STAKE: underfunded");

        pos.claimedRewards += reward;
        bet.safeTransfer(user, reward);
        emit RewardsClaimed(user, positionId, reward);
    }

    function unstake(uint256 positionId) external whenNotPaused nonReentrant {
        Position storage pos = positions[positionId];
        address user = _msgSender();
        require(pos.owner == user, "STAKE: owner");
        require(pos.open, "STAKE: closed");
        require(block.timestamp >= pos.unlockAt, "STAKE: locked");

        uint256 reward = pendingRewards(positionId);
        uint256 payout = pos.amount + reward;
        require(bet.balanceOf(address(this)) >= payout, "STAKE: underfunded");

        pos.open = false;
        pos.claimedRewards += reward;
        pools[pos.poolIndex].totalStaked -= pos.amount;

        bet.safeTransfer(user, payout);
        emit Unstaked(user, positionId, pos.amount);
        if (reward > 0) {
            emit RewardsClaimed(user, positionId, reward);
        }
    }

    function fundRewards(uint256 amount) external {
        require(amount > 0, "STAKE: amount");
        bet.safeTransferFrom(_msgSender(), address(this), amount);
        emit RewardsFunded(amount);
    }

    function setPoolActive(uint8 poolIndex, bool active) external onlyOwner {
        require(poolIndex < pools.length, "STAKE: pool");
        pools[poolIndex].active = active;
        emit PoolToggled(poolIndex, active);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    function _contextSuffixLength() internal view override(Context, ERC2771Context) returns (uint256) {
        return ERC2771Context._contextSuffixLength();
    }
}
