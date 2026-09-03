// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title BET — Limit Break Energy Token
/// @notice ERC-20 used for staking, mint settlement, and in-game value.
contract BETToken is ERC20, ERC20Burnable, ERC20Pausable, ERC20Permit, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether;

    constructor(address treasury, address initialOwner)
        ERC20("Limit Break Energy", "BET")
        ERC20Permit("Limit Break Energy")
        Ownable(initialOwner)
    {
        require(treasury != address(0), "BET: zero treasury");
        require(initialOwner != address(0), "BET: zero owner");
        _mint(treasury, MAX_SUPPLY);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
