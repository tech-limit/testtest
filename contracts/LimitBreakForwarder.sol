// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC2771Forwarder} from "@openzeppelin/contracts/metatx/ERC2771Forwarder.sol";

/// @dev Trusted forwarder for gasless staking claims (EIP-2771).
contract LimitBreakForwarder is ERC2771Forwarder {
    constructor() ERC2771Forwarder("LimitBreakForwarder") {}
}
