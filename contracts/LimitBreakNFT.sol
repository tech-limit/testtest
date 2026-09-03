// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Pausable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import {ERC721Royalty} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title Limit Break player-owned assets
/// @notice ERC-721 collection minted against BET. Lab / marketplace clients call mint.
contract LimitBreakNFT is ERC721, ERC721URIStorage, ERC721Pausable, ERC721Royalty, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable bet;
    uint256 public nextTokenId = 1;
    uint256 public mintPrice;
    uint256 public maxSupply;
    address public treasury;
    mapping(address => bool) public minters;

    event Minted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MinterUpdated(address indexed minter, bool allowed);
    event MintPriceUpdated(uint256 price);
    event TreasuryUpdated(address indexed treasury);

    constructor(
        address betToken,
        address initialOwner,
        address treasury_,
        uint256 mintPrice_,
        uint256 maxSupply_
    ) ERC721("Limit Break Asset", "LBASSET") Ownable(initialOwner) {
        require(betToken != address(0), "NFT: zero token");
        require(treasury_ != address(0), "NFT: zero treasury");
        require(maxSupply_ > 0, "NFT: max supply");
        bet = IERC20(betToken);
        treasury = treasury_;
        mintPrice = mintPrice_;
        maxSupply = maxSupply_;
        _setDefaultRoyalty(treasury_, 500);
        minters[initialOwner] = true;
    }

    modifier onlyMinter() {
        require(minters[_msgSender()], "NFT: not minter");
        _;
    }

    function setMinter(address minter, bool allowed) external onlyOwner {
        minters[minter] = allowed;
        emit MinterUpdated(minter, allowed);
    }

    function setMintPrice(uint256 price) external onlyOwner {
        mintPrice = price;
        emit MintPriceUpdated(price);
    }

    function setTreasury(address treasury_) external onlyOwner {
        require(treasury_ != address(0), "NFT: zero treasury");
        treasury = treasury_;
        _setDefaultRoyalty(treasury_, 500);
        emit TreasuryUpdated(treasury_);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Player mint: pulls `mintPrice` BET then mints the next token.
    function mint(string calldata uri) external returns (uint256 tokenId) {
        return _mintTo(_msgSender(), uri, true);
    }

    /// @notice Lab / operator mint that still charges BET unless price is zero.
    function mintTo(address to, string calldata uri) external onlyMinter returns (uint256 tokenId) {
        return _mintTo(to, uri, mintPrice > 0);
    }

    function _mintTo(address to, string calldata uri, bool charge) internal returns (uint256 tokenId) {
        require(to != address(0), "NFT: zero to");
        require(bytes(uri).length > 0, "NFT: empty uri");
        tokenId = nextTokenId;
        require(tokenId <= maxSupply, "NFT: sold out");
        nextTokenId = tokenId + 1;

        if (charge && mintPrice > 0) {
            bet.safeTransferFrom(_msgSender(), treasury, mintPrice);
        }

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit Minted(to, tokenId, uri);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
}
