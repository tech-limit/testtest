export const BET_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
];

export const STAKING_ABI = [
  "function stake(uint8 poolIndex, uint256 amount) returns (uint256)",
  "function claim(uint256 positionId)",
  "function unstake(uint256 positionId)",
  "function pendingRewards(uint256 positionId) view returns (uint256)",
  "function positionsOf(address user) view returns (uint256[])",
  "function getPool(uint8 index) view returns (tuple(bytes32 id, uint64 lockDuration, uint16 apyBps, uint256 totalStaked, bool active))",
];

export const NFT_ABI = [
  "function mint(string uri) returns (uint256)",
  "function mintPrice() view returns (uint256)",
  "function nextTokenId() view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

export const POOL_INDEX = {
  conservative: 0,
  growth: 1,
  ecosystem: 2,
};
