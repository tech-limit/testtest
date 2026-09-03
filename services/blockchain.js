const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const config = require("../config");

const POOL_IDS = ["conservative", "growth", "ecosystem"];

const STAKING_ABI = [
  "function poolCount() view returns (uint256)",
  "function getPool(uint8 index) view returns (tuple(bytes32 id, uint64 lockDuration, uint16 apyBps, uint256 totalStaked, bool active))",
  "function positionsOf(address user) view returns (uint256[])",
  "function pendingRewards(uint256 positionId) view returns (uint256)",
  "function positions(uint256) view returns (address owner, uint8 poolIndex, uint256 amount, uint64 startedAt, uint64 unlockAt, uint256 claimedRewards, bool open)",
];

const ERC20_ABI = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
];

const NFT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function nextTokenId() view returns (uint256)",
  "function mintPrice() view returns (uint256)",
  "function maxSupply() view returns (uint256)",
];

function loadDeployment(chainId) {
  const file = path.join(__dirname, "..", "deployments", `${chainId}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function resolveAddresses() {
  const deployment = config.CHAIN_ID ? loadDeployment(config.CHAIN_ID) : null;
  const contracts = deployment?.contracts || {};
  return {
    bet: config.BET_TOKEN_ADDRESS || contracts.BETToken || "",
    staking: config.STAKING_ADDRESS || contracts.LimitBreakStaking || "",
    nft: config.NFT_ADDRESS || contracts.LimitBreakNFT || "",
    forwarder: config.FORWARDER_ADDRESS || contracts.LimitBreakForwarder || contracts.ERC2771Forwarder || "",
  };
}

function isConfigured() {
  const { bet, staking, nft } = resolveAddresses();
  return Boolean(config.RPC_URL && bet && staking && nft);
}

function getProvider() {
  if (!config.RPC_URL) return null;
  return new ethers.JsonRpcProvider(config.RPC_URL, config.CHAIN_ID || undefined);
}

function getContracts() {
  if (!isConfigured()) return null;
  const provider = getProvider();
  const addresses = resolveAddresses();
  return {
    provider,
    addresses,
    bet: new ethers.Contract(addresses.bet, ERC20_ABI, provider),
    staking: new ethers.Contract(addresses.staking, STAKING_ABI, provider),
    nft: new ethers.Contract(addresses.nft, NFT_ABI, provider),
  };
}

function decodePoolId(id) {
  try {
    return ethers.decodeBytes32String(id);
  } catch {
    return String(id);
  }
}

async function getProtocolSnapshot() {
  const addresses = resolveAddresses();
  const snapshot = {
    configured: isConfigured(),
    chainId: config.CHAIN_ID || null,
    rpcConfigured: Boolean(config.RPC_URL),
    contracts: addresses,
    token: null,
    nft: null,
    pools: [],
    note: isConfigured()
      ? "Live RPC + contract addresses are set."
      : "Contracts are in-repo. Set RPC_URL and deployment addresses to read chain state.",
  };

  if (!isConfigured()) return snapshot;

  try {
    const { bet, staking, nft } = getContracts();
    const [symbol, decimals, totalSupply, mintPrice, maxSupply, nextTokenId, poolCount] =
      await Promise.all([
        bet.symbol(),
        bet.decimals(),
        bet.totalSupply(),
        nft.mintPrice(),
        nft.maxSupply(),
        nft.nextTokenId(),
        staking.poolCount(),
      ]);

    snapshot.token = {
      symbol,
      decimals,
      totalSupply: totalSupply.toString(),
    };
    snapshot.nft = {
      mintPrice: mintPrice.toString(),
      maxSupply: maxSupply.toString(),
      nextTokenId: nextTokenId.toString(),
    };

    const count = Number(poolCount);
    for (let i = 0; i < count; i += 1) {
      const pool = await staking.getPool(i);
      const id = decodePoolId(pool.id) || POOL_IDS[i] || `pool-${i}`;
      snapshot.pools.push({
        id,
        poolIndex: i,
        apy: `${Number(pool.apyBps) / 100}%`,
        apyBps: Number(pool.apyBps),
        tvl: `${ethers.formatEther(pool.totalStaked)} BET`,
        totalStaked: pool.totalStaked.toString(),
        lockDays: Math.round(Number(pool.lockDuration) / 86400),
        active: pool.active,
      });
    }
  } catch (err) {
    snapshot.note = `RPC read failed: ${err.message}`;
  }

  return snapshot;
}

async function getPositions(wallet) {
  if (!isConfigured() || !wallet || !ethers.isAddress(wallet)) return [];
  const { staking } = getContracts();
  const ids = await staking.positionsOf(wallet);
  const rows = [];
  for (const id of ids) {
    const pos = await staking.positions(id);
    const pending = await staking.pendingRewards(id);
    rows.push({
      id: id.toString(),
      poolIndex: Number(pos.poolIndex),
      poolId: POOL_IDS[Number(pos.poolIndex)] || String(pos.poolIndex),
      amount: ethers.formatEther(pos.amount),
      unlockAt: new Date(Number(pos.unlockAt) * 1000).toISOString(),
      claimedRewards: ethers.formatEther(pos.claimedRewards),
      pendingRewards: ethers.formatEther(pending),
      open: pos.open,
    });
  }
  return rows;
}

module.exports = {
  POOL_IDS,
  isConfigured,
  resolveAddresses,
  getProtocolSnapshot,
  getPositions,
};
